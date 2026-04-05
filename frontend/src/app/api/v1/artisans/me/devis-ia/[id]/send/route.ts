import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError } from "@/lib/api-response";
import { requireAuth } from "@/lib/auth-server";
import { sendEmail } from "@/lib/email";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAuth();
    const { id } = await params;

    const artisan = await prisma.artisan.findUnique({
      where: { userId: session.userId },
    });

    if (!artisan || artisan.deletedAt) {
      return apiError("Artisan introuvable", 404);
    }

    const devis = await prisma.devis.findUnique({ where: { id } });

    if (!devis || devis.artisanId !== artisan.id) {
      return apiError("Devis introuvable", 404);
    }

    if (!devis.clientEmail) {
      return apiError("Le devis n'a pas d'adresse email client", 400);
    }

    // Update statut to ENVOYE
    const updatedDevis = await prisma.devis.update({
      where: { id },
      data: {
        statut: "ENVOYE",
        envoyeAt: new Date(),
      },
    });

    // Build view link
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.bativio.fr";
    const viewLink = `${baseUrl}/devis/${devis.viewToken}`;

    // Build postes summary
    const postes = devis.postes as Array<{
      designation: string;
      quantite: number;
      unite: string;
      totalHT: number;
    }>;

    const postesHtml = postes
      .map(
        (p) =>
          `<tr>
            <td style="padding:8px;border-bottom:1px solid #eee;">${p.designation}</td>
            <td style="padding:8px;border-bottom:1px solid #eee;text-align:center;">${p.quantite} ${p.unite}</td>
            <td style="padding:8px;border-bottom:1px solid #eee;text-align:right;">${p.totalHT.toFixed(2)} EUR</td>
          </tr>`
      )
      .join("");

    const emailHtml = `
      <div style="font-family:Karla,sans-serif;max-width:600px;margin:0 auto;color:#1C1C1E;">
        <div style="background:#C4531A;padding:24px;text-align:center;">
          <h1 style="color:#fff;margin:0;font-family:Fraunces,serif;">Bativio</h1>
        </div>
        <div style="padding:32px 24px;">
          <p>Bonjour ${devis.clientNom},</p>
          <p><strong>${artisan.nomAffichage}</strong> vous a envoye un devis.</p>

          <h2 style="color:#C4531A;font-family:Fraunces,serif;margin-top:24px;">${devis.objet}</h2>

          <table style="width:100%;border-collapse:collapse;margin:16px 0;">
            <thead>
              <tr style="background:#FAF8F5;">
                <th style="padding:8px;text-align:left;">Designation</th>
                <th style="padding:8px;text-align:center;">Quantite</th>
                <th style="padding:8px;text-align:right;">Total HT</th>
              </tr>
            </thead>
            <tbody>
              ${postesHtml}
            </tbody>
          </table>

          <div style="background:#FAF8F5;padding:16px;border-radius:8px;margin:16px 0;">
            <p style="margin:4px 0;"><strong>Total HT :</strong> ${devis.totalHT.toFixed(2)} EUR</p>
            <p style="margin:4px 0;"><strong>TVA (${devis.tauxTVA}%) :</strong> ${devis.montantTVA.toFixed(2)} EUR</p>
            <p style="margin:4px 0;font-size:18px;"><strong>Total TTC :</strong> ${devis.totalTTC.toFixed(2)} EUR</p>
          </div>

          ${devis.dureeEstimee ? `<p><strong>Duree estimee :</strong> ${devis.dureeEstimee}</p>` : ""}
          ${devis.notes ? `<p><strong>Notes :</strong> ${devis.notes}</p>` : ""}

          <div style="text-align:center;margin:32px 0;">
            <a href="${viewLink}" style="background:#C4531A;color:#fff;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:bold;">
              Voir le devis complet
            </a>
          </div>

          <p style="color:#666;font-size:12px;margin-top:32px;">
            Ce devis est valable ${devis.validiteJours} jours.
            ${devis.mentionSousReserve ? "Les prix sont donnes sous reserve de visite technique." : ""}
          </p>
        </div>
        <div style="background:#1C1C1E;padding:16px;text-align:center;color:#999;font-size:12px;">
          Envoye via Bativio - La plateforme des artisans du batiment
        </div>
      </div>
    `;

    await sendEmail(
      devis.clientEmail,
      `Devis ${devis.numero} - ${devis.objet} | ${artisan.nomAffichage}`,
      emailHtml
    );

    return apiSuccess(updatedDevis);
  } catch (error: unknown) {
    const err = error as Error;
    if (err.message === "UNAUTHORIZED") return apiError("Non autorise", 401);
    if (err.message === "FORBIDDEN") return apiError("Acces interdit", 403);
    console.error("Send devis error:", err);
    return apiError("Erreur interne du serveur", 500);
  }
}
