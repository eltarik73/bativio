import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError } from "@/lib/api-response";
import { requireAuth } from "@/lib/auth-server";
import { generateDevisPdf } from "@/lib/pdf/devis-pdf";
import { sendEmail } from "@/lib/email";
import { escapeHtml } from "@/lib/html-escape";
import { computeTvaIntra } from "@/lib/tva-intra";

interface LigneJson {
  label: string;
  description?: string;
  qte: number;
  unite: string;
  puHt: number;
  totalHt: number;
  tva: number;
}

export async function POST(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await requireAuth();
    const { id } = await params;

    const artisan = await prisma.artisan.findUnique({
      where: { userId: session.userId },
      include: { tarification: true },
    });
    if (!artisan) return apiError("Artisan introuvable", 404);

    const devis = await prisma.devis.findUnique({ where: { id } });
    if (!devis || devis.artisanId !== artisan.id) return apiError("Devis introuvable", 404);
    if (!devis.clientEmail) return apiError("Email client manquant", 400);

    // Génère PDF
    const lignes = (devis.postes as unknown as LigneJson[]) || [];
    const pdfBytes = await generateDevisPdf({
      numero: devis.numero,
      date: devis.createdAt,
      validiteJours: devis.validiteJours,
      artisan: {
        nomAffichage: artisan.nomAffichage,
        raisonSociale: artisan.raisonSociale,
        siret: artisan.siret,
        tvaIntra: computeTvaIntra(artisan.siret),
        adresse: artisan.adresse,
        codePostal: artisan.codePostal,
        ville: artisan.ville,
        telephone: artisan.telephone,
        email: null,
        assuranceNom: artisan.tarification?.assuranceNom,
        assuranceNumero: artisan.tarification?.assuranceNumero,
        logo: artisan.logo,
        franchiseTva: artisan.tarification?.tvaDefault === 0,
      },
      client: {
        nom: devis.clientNom,
        email: devis.clientEmail,
        telephone: devis.clientTelephone,
        adresse: devis.clientAdresse,
        adresseChantier: null,
      },
      objet: devis.objet,
      lignes,
      totalHt: devis.totalHT,
      totalTva: devis.montantTVA,
      totalTtc: devis.totalTTC,
      dureeEstimee: devis.dureeEstimee,
      conditionsPaiement: devis.conditionsPaiement,
      notes: devis.notes,
      couleurAccent: artisan.colorPrimary,
    });

    // Upload Cloudinary (via signed API ou base64 direct)
    const pdfBase64 = Buffer.from(pdfBytes).toString("base64");
    const pdfUrl = await uploadPdfToCloudinary(pdfBase64, devis.numero);

    // Update devis
    const updated = await prisma.devis.update({
      where: { id },
      data: {
        pdfUrl,
        statut: "ENVOYE",
        envoyeAt: new Date(),
      },
    });

    // Email au client (escape user-controlled content pour prévenir XSS)
    const safeClientNom = escapeHtml(devis.clientNom);
    const safeArtisanNom = escapeHtml(artisan.nomAffichage);
    const safeNumero = escapeHtml(devis.numero);
    const safeObjet = escapeHtml(devis.objet);
    const safeTelephone = escapeHtml(artisan.telephone);
    // tel: ne garde que chiffres et + (E.164 + national)
    const telephoneHref = artisan.telephone.replace(/[^\d+]/g, "");
    const html = `
      <div style="font-family: -apple-system, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px;">
        <h2 style="color: #C4531A; font-family: Georgia, serif;">Votre devis Bativio est prêt</h2>
        <p style="color: #3D2E1F; font-size: 15px; line-height: 1.6;">
          Bonjour <strong>${safeClientNom}</strong>,<br><br>
          <strong>${safeArtisanNom}</strong> vient de vous envoyer le devis <strong>${safeNumero}</strong>.
        </p>
        <div style="background: linear-gradient(135deg, rgba(196,83,26,.06), rgba(201,148,58,.04)); padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #C4531A;">
          <div style="font-size: 11px; letter-spacing: 1.5px; color: #C4531A; text-transform: uppercase; font-weight: 700; margin-bottom: 6px;">${safeObjet}</div>
          <div style="font-size: 26px; color: #3D2E1F; font-weight: 600; font-family: Georgia, serif;">
            ${devis.totalTTC.toLocaleString("fr-FR")} € TTC
          </div>
          <div style="font-size: 12px; color: #9C958D; margin-top: 4px;">${devis.validiteJours} jours de validité</div>
        </div>
        <a href="${escapeHtml(pdfUrl)}" style="display: inline-block; background: #C4531A; color: #fff; padding: 14px 28px; border-radius: 12px; text-decoration: none; font-weight: 600; margin-top: 12px;">Télécharger le devis PDF</a>
        <p style="color: #6B6560; font-size: 13px; margin-top: 24px;">
          Pour accepter ce devis, retournez-le signé avec la mention "Bon pour accord".<br>
          Pour toute question, contactez ${safeArtisanNom} au <a href="tel:${telephoneHref}" style="color: #C4531A;">${safeTelephone}</a>.
        </p>
        <p style="color: #9C958D; font-size: 12px; margin-top: 32px; border-top: 1px solid #EDEBE7; padding-top: 16px;">
          Bativio — contact@bativio.fr
        </p>
      </div>
    `;

    await sendEmail(devis.clientEmail, `Devis ${devis.numero} — ${artisan.nomAffichage}`, html);

    return apiSuccess({ devis: updated, pdfUrl });
  } catch (error: unknown) {
    const err = error as Error;
    if (err.message === "UNAUTHORIZED") return apiError("Non autorise", 401);
    console.error("Envoyer devis error:", err);
    return apiError(err.message || "Erreur envoi devis", 500);
  }
}

async function uploadPdfToCloudinary(pdfBase64: string, numero: string): Promise<string> {
  const cloudinaryUrl = process.env.CLOUDINARY_URL;
  if (!cloudinaryUrl) throw new Error("CLOUDINARY_URL manquante");
  const match = cloudinaryUrl.match(/^cloudinary:\/\/([^:]+):([^@]+)@(.+)$/);
  if (!match) throw new Error("CLOUDINARY_URL invalide");
  const [, apiKey, apiSecret, cloudName] = match;

  const crypto = await import("node:crypto");
  const folder = "bativio/devis-pdf";
  const publicId = `devis-${numero}-${Date.now()}`;
  const timestamp = Math.floor(Date.now() / 1000);
  const paramsToSign = `folder=${folder}&public_id=${publicId}&timestamp=${timestamp}`;
  const signature = crypto.createHash("sha1").update(paramsToSign + apiSecret).digest("hex");

  const formData = new FormData();
  formData.append("file", `data:application/pdf;base64,${pdfBase64}`);
  formData.append("api_key", apiKey);
  formData.append("public_id", publicId);
  formData.append("folder", folder);
  formData.append("timestamp", String(timestamp));
  formData.append("signature", signature);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/raw/upload`, {
    method: "POST",
    body: formData,
  });
  const json = await res.json();
  if (!json.secure_url) throw new Error(`Cloudinary upload failed: ${JSON.stringify(json)}`);
  return json.secure_url as string;
}
