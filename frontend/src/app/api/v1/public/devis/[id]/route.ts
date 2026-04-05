import { type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError } from "@/lib/api-response";
import { sendEmail } from "@/lib/email";
import { z } from "zod";

const postSchema = z.object({
  action: z.enum(["accept", "refuse"], {
    error: "L'action doit être 'accept' ou 'refuse'",
  }),
  commentaire: z.string().optional(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const token = request.nextUrl.searchParams.get("token");

    if (!token) {
      return apiError("Le token est requis", 400);
    }

    const devis = await prisma.devis.findFirst({
      where: { id, viewToken: token },
      include: {
        artisan: {
          select: {
            nomAffichage: true,
            telephone: true,
            adresse: true,
            ville: true,
            codePostal: true,
            siret: true,
            logo: true,
            metier: { select: { nom: true, slug: true } },
          },
        },
      },
    });

    if (!devis) {
      return apiError("Devis introuvable", 404);
    }

    // Mark as viewed if first time
    if (!devis.vuAt) {
      await prisma.devis.update({
        where: { id: devis.id },
        data: {
          vuAt: new Date(),
          statut: devis.statut === "ENVOYE" ? "VU" : devis.statut,
        },
      });
    }

    return apiSuccess({
      id: devis.id,
      numero: devis.numero,
      objet: devis.objet,
      clientNom: devis.clientNom,
      clientEmail: devis.clientEmail,
      clientTelephone: devis.clientTelephone,
      clientAdresse: devis.clientAdresse,
      niveauGamme: devis.niveauGamme,
      postes: devis.postes,
      totalHT: devis.totalHT,
      tauxTVA: devis.tauxTVA,
      montantTVA: devis.montantTVA,
      totalTTC: devis.totalTTC,
      dureeEstimee: devis.dureeEstimee,
      conditionsPaiement: devis.conditionsPaiement,
      notes: devis.notes,
      mentionSousReserve: devis.mentionSousReserve,
      validiteJours: devis.validiteJours,
      statut: devis.statut,
      createdAt: devis.createdAt,
      envoyeAt: devis.envoyeAt,
      pdfUrl: devis.pdfUrl,
      artisan: {
        nomAffichage: devis.artisan.nomAffichage,
        telephone: devis.artisan.telephone,
        adresse: devis.artisan.adresse,
        ville: devis.artisan.ville,
        codePostal: devis.artisan.codePostal,
        siret: devis.artisan.siret,
        logo: devis.artisan.logo,
        metier: devis.artisan.metier?.nom ?? null,
      },
    });
  } catch (error) {
    console.error("GET /api/v1/public/devis/[id] error:", error);
    return apiError("Erreur interne du serveur", 500);
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const token = request.nextUrl.searchParams.get("token");

    if (!token) {
      return apiError("Le token est requis", 400);
    }

    const body = await request.json();
    const parsed = postSchema.safeParse(body);

    if (!parsed.success) {
      const firstError =
        parsed.error.issues[0]?.message || "Donnees invalides";
      return apiError(firstError, 400);
    }

    const { action, commentaire } = parsed.data;

    const devis = await prisma.devis.findFirst({
      where: { id, viewToken: token },
      include: {
        artisan: {
          include: {
            user: { select: { email: true } },
          },
        },
      },
    });

    if (!devis) {
      return apiError("Devis introuvable", 404);
    }

    // Check if already responded
    if (devis.statut === "ACCEPTE" || devis.statut === "REFUSE") {
      return apiError("Ce devis a deja recu une reponse", 400);
    }

    const newStatut = action === "accept" ? "ACCEPTE" : "REFUSE";
    const now = new Date();

    await prisma.devis.update({
      where: { id: devis.id },
      data: {
        statut: newStatut,
        ...(action === "accept"
          ? { accepteAt: now }
          : { refuseAt: now }),
      },
    });

    // Send email notification to artisan
    const actionLabel = action === "accept" ? "accepte" : "refuse";
    const actionLabelFem = action === "accept" ? "acceptee" : "refusee";
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.bativio.fr";

    await sendEmail(
      devis.artisan.user.email,
      `Devis ${devis.numero} ${actionLabel} par ${devis.clientNom}`,
      `
        <div style="font-family: Karla, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #C4531A;">Devis ${actionLabel}</h2>
          <p>Bonjour <strong>${devis.artisan.nomAffichage}</strong>,</p>
          <p>Le client <strong>${devis.clientNom}</strong> a <strong>${actionLabel}</strong> votre devis <strong>${devis.numero}</strong>.</p>
          ${commentaire ? `<div style="background: #FAF8F5; padding: 16px; border-radius: 8px; margin: 16px 0;"><p><strong>Commentaire :</strong> ${commentaire}</p></div>` : ""}
          <div style="background: #FAF8F5; padding: 16px; border-radius: 8px; margin: 16px 0;">
            <p><strong>Objet :</strong> ${devis.objet}</p>
            <p><strong>Montant TTC :</strong> ${devis.totalTTC.toFixed(2)} &euro;</p>
          </div>
          <a href="${baseUrl}/dashboard/devis"
             style="display: inline-block; background: #C4531A; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin-top: 8px;">
            Voir mes devis
          </a>
          <p style="color: #666; font-size: 12px; margin-top: 24px;">
            &mdash; L'equipe Bativio
          </p>
        </div>
      `
    );

    // Create notification for artisan
    await prisma.notification.create({
      data: {
        artisanId: devis.artisanId,
        type: "DEMANDE_DEVIS",
        titre: `Devis ${devis.numero} ${actionLabel}`,
        message: `${devis.clientNom} a ${actionLabel} votre devis ${devis.numero}.${commentaire ? ` Commentaire : ${commentaire}` : ""}`,
      },
    });

    return apiSuccess({
      message: `Le devis a ete ${actionLabelFem}`,
      statut: newStatut,
    });
  } catch (error) {
    console.error("POST /api/v1/public/devis/[id] error:", error);
    return apiError("Erreur interne du serveur", 500);
  }
}
