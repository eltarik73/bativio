import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError, handleAuthError } from "@/lib/api-response";
import { requireAuth } from "@/lib/auth-server";
import { sendEmail } from "@/lib/email";
import { escapeHtml } from "@/lib/html-escape";

export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth();
    const artisan = await prisma.artisan.findUnique({
      where: { userId: session.userId },
      include: { user: { select: { email: true } } },
    });
    if (!artisan || artisan.deletedAt) return apiError("Artisan introuvable", 404);

    const { devisId } = await request.json() as { devisId: string };
    if (!devisId) return apiError("devisId requis", 400);

    const devis = await prisma.devis.findUnique({ where: { id: devisId } });
    if (!devis || devis.artisanId !== artisan.id) return apiError("Devis introuvable", 404);

    if (!devis.clientEmail) return apiError("Le client n'a pas d'adresse email", 400);

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.bativio.fr";
    const viewUrl = `${siteUrl}/devis/${devis.viewToken || devis.id}`;
    const postes = devis.postes as Array<{ designation: string; quantite: number; prixUnitaire?: number; prixUnitaireHT?: number; totalHT: number; unite?: string }>;

    // Build HTML email (escape user-controlled content)
    const safeArtisanNom = escapeHtml(artisan.nomAffichage);
    const safeArtisanVille = artisan.ville ? escapeHtml(artisan.ville) : "";
    const safeArtisanTelephone = artisan.telephone ? escapeHtml(artisan.telephone) : "";
    const safeArtisanAdresse = artisan.adresse ? escapeHtml(artisan.adresse) : "";
    const safeArtisanSiret = escapeHtml(artisan.siret);
    const safeClientNom = escapeHtml(devis.clientNom);
    const safeNumero = escapeHtml(devis.numero);
    const safeObjet = escapeHtml(devis.objet);
    const safeNotes = devis.notes ? escapeHtml(devis.notes).replace(/\n/g, "<br>") : "";

    const lignesHtml = postes.map(p => `
      <tr>
        <td style="padding:8px 12px;border-bottom:1px solid #F3F4F6;font-size:13px;color:#374151">${escapeHtml(p.designation)}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #F3F4F6;font-size:13px;color:#374151;text-align:center">${p.quantite} ${p.unite ? escapeHtml(p.unite) : ""}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #F3F4F6;font-size:13px;color:#374151;text-align:right">${((p.prixUnitaire || p.prixUnitaireHT || 0) * p.quantite).toFixed(2)} \u20ac</td>
      </tr>
    `).join("");

    const html = `
    <div style="font-family:Karla,Arial,sans-serif;max-width:600px;margin:0 auto;background:#fff">
      <div style="padding:24px 32px;border-bottom:2px solid #C4531A">
        <h1 style="font-family:Fraunces,Georgia,serif;font-size:22px;color:#1C1C1E;margin:0">Devis n\u00b0${safeNumero}</h1>
        <p style="color:#6B7280;font-size:14px;margin:8px 0 0">${safeArtisanNom}${safeArtisanVille ? ` \u2014 ${safeArtisanVille}` : ""}</p>
      </div>

      <div style="padding:24px 32px">
        <p style="font-size:15px;color:#374151;line-height:1.6">
          Bonjour <strong>${safeClientNom}</strong>,
        </p>
        <p style="font-size:15px;color:#374151;line-height:1.6">
          Veuillez trouver ci-dessous le devis <strong>n\u00b0${safeNumero}</strong> pour : <em>${safeObjet}</em>.
        </p>

        <table style="width:100%;border-collapse:collapse;margin:24px 0;border:1px solid #E5E7EB;border-radius:8px;overflow:hidden">
          <thead>
            <tr style="background:#F9FAFB">
              <th style="padding:10px 12px;text-align:left;font-size:12px;font-weight:600;color:#6B7280;text-transform:uppercase">D\u00e9signation</th>
              <th style="padding:10px 12px;text-align:center;font-size:12px;font-weight:600;color:#6B7280;text-transform:uppercase">Qt\u00e9</th>
              <th style="padding:10px 12px;text-align:right;font-size:12px;font-weight:600;color:#6B7280;text-transform:uppercase">Montant HT</th>
            </tr>
          </thead>
          <tbody>
            ${lignesHtml}
          </tbody>
        </table>

        <div style="background:#F9FAFB;border-radius:8px;padding:16px 20px;margin:16px 0">
          <div style="display:flex;justify-content:space-between;margin-bottom:6px">
            <span style="font-size:14px;color:#6B7280">Total HT</span>
            <span style="font-size:14px;color:#374151;font-weight:600">${devis.totalHT.toFixed(2)} \u20ac</span>
          </div>
          <div style="display:flex;justify-content:space-between;margin-bottom:6px">
            <span style="font-size:14px;color:#6B7280">TVA (${devis.tauxTVA}%)</span>
            <span style="font-size:14px;color:#374151">${devis.montantTVA.toFixed(2)} \u20ac</span>
          </div>
          <div style="display:flex;justify-content:space-between;padding-top:10px;border-top:1px solid #E5E7EB">
            <span style="font-size:16px;font-weight:700;color:#1C1C1E">Total TTC</span>
            <span style="font-size:16px;font-weight:700;color:#C4531A">${devis.totalTTC.toFixed(2)} \u20ac</span>
          </div>
        </div>

        ${safeNotes ? `<p style="font-size:13px;color:#6B7280;margin-top:16px;padding:12px;background:#FFFBEB;border-radius:6px;border:1px solid #FEF3C7"><strong>Notes :</strong> ${safeNotes}</p>` : ""}

        <div style="text-align:center;margin:32px 0 16px">
          <a href="${viewUrl}" style="display:inline-block;padding:14px 32px;background:#C4531A;color:#fff;border-radius:10px;font-size:15px;font-weight:600;text-decoration:none">
            Voir le devis complet
          </a>
        </div>

        <p style="font-size:12px;color:#9CA3AF;text-align:center">
          Ce devis est valable ${devis.validiteJours} jours. Pour toute question, contactez ${safeArtisanNom}${safeArtisanTelephone ? ` au ${safeArtisanTelephone}` : ""}.
        </p>
      </div>

      <div style="padding:16px 32px;border-top:1px solid #F3F4F6;text-align:center">
        <p style="font-size:11px;color:#D1D5DB;margin:0">${safeArtisanNom} \u2014 SIRET ${safeArtisanSiret}${safeArtisanAdresse ? ` \u2014 ${safeArtisanAdresse}` : ""}${safeArtisanVille ? `, ${safeArtisanVille}` : ""}</p>
        <p style="font-size:11px;color:#D1D5DB;margin:4px 0 0">Envoy\u00e9 via Bativio</p>
      </div>
    </div>`;

    await sendEmail(
      devis.clientEmail,
      `Devis n\u00b0${devis.numero} \u2014 ${artisan.nomAffichage}`,
      html,
    );

    // Update devis status
    await prisma.devis.update({
      where: { id: devisId },
      data: {
        statut: "ENVOYE",
        envoyeAt: new Date(),
      },
    });

    return apiSuccess({ sent: true, to: devis.clientEmail });
  } catch (e) {
    const authErr = handleAuthError(e);
    if (authErr) return authErr;
    console.error("POST devis-send error:", e);
    return apiError("Erreur interne du serveur", 500);
  }
}
