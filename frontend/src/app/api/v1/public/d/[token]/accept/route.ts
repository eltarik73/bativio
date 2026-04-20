import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError } from "@/lib/api-response";
import { sendEmail } from "@/lib/email";
import { escapeHtml } from "@/lib/html-escape";

const bodySchema = z.object({
  action: z.enum(["accept", "refuse"]),
  signatureNom: z.string().min(2).max(120).optional(),
  refusRaison: z.string().max(500).optional(),
});

export async function POST(request: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  try {
    const { token } = await params;
    const body = await request.json();
    const parsed = bodySchema.safeParse(body);
    if (!parsed.success) return apiError("Paramètres invalides", 400);

    const devis = await prisma.devis.findUnique({
      where: { viewToken: token },
      include: {
        artisan: { include: { user: { select: { email: true } } } },
      },
    });
    if (!devis) return apiError("Devis introuvable", 404);
    if (devis.statut === "ACCEPTE" || devis.statut === "REFUSE") {
      return apiError(`Ce devis a déjà été ${devis.statut.toLowerCase()}`, 400);
    }

    if (parsed.data.action === "accept") {
      await prisma.devis.update({
        where: { id: devis.id },
        data: {
          statut: "ACCEPTE",
          accepteAt: new Date(),
          notes: parsed.data.signatureNom
            ? `${devis.notes ?? ""}\n\n[Accepté par : ${parsed.data.signatureNom} le ${new Date().toLocaleString("fr-FR")}]`.trim()
            : devis.notes,
        },
      });

      // Notif artisan
      await prisma.notification.create({
        data: {
          artisanId: devis.artisanId,
          type: "DEMANDE_DEVIS",
          titre: `Devis ${devis.numero} accepté !`,
          message: `${devis.clientNom} a accepté votre devis de ${devis.totalTTC.toLocaleString("fr-FR")} € TTC`,
        },
      }).catch(() => null);

      // Email artisan (escape user-controlled content)
      if (devis.artisan.user?.email) {
        const safeClientNom = escapeHtml(devis.clientNom);
        const safeNumero = escapeHtml(devis.numero);
        const safeObjet = escapeHtml(devis.objet);
        const safeSignatureNom = parsed.data.signatureNom ? escapeHtml(parsed.data.signatureNom) : "";
        const html = `
          <div style="font-family: -apple-system, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px;">
            <h2 style="color: #4A6741; font-family: Georgia, serif;">Devis accepté</h2>
            <p style="color: #3D2E1F; font-size: 15px; line-height: 1.6;">
              <strong>${safeClientNom}</strong> vient d'accepter votre devis <strong>${safeNumero}</strong>.
            </p>
            <div style="background: rgba(74,103,65,.08); padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #4A6741;">
              <div style="font-size: 11px; letter-spacing: 1.5px; color: #4A6741; text-transform: uppercase; font-weight: 700; margin-bottom: 6px;">${safeObjet}</div>
              <div style="font-size: 26px; color: #3D2E1F; font-weight: 600; font-family: Georgia, serif;">${devis.totalTTC.toLocaleString("fr-FR")} € TTC</div>
              ${safeSignatureNom ? `<div style="font-size: 12px; color: #6B6560; margin-top: 8px;">Signé par : ${safeSignatureNom}</div>` : ""}
            </div>
            <p style="color: #6B6560; font-size: 13px;">Prochaine étape : planifier le chantier avec le client.</p>
            <a href="https://bativio.fr/dashboard/devis" style="display: inline-block; background: #C4531A; color: #fff; padding: 12px 24px; border-radius: 10px; text-decoration: none; font-weight: 600;">Voir le devis</a>
          </div>
        `;
        await sendEmail(devis.artisan.user.email, `Devis ${devis.numero} accepté — ${devis.totalTTC.toLocaleString("fr-FR")} €`, html).catch(() => null);
      }

      return apiSuccess({ ok: true, statut: "ACCEPTE" });
    } else {
      await prisma.devis.update({
        where: { id: devis.id },
        data: {
          statut: "REFUSE",
          refuseAt: new Date(),
          notes: parsed.data.refusRaison ? `${devis.notes ?? ""}\n\n[Refusé : ${parsed.data.refusRaison}]`.trim() : devis.notes,
        },
      });
      return apiSuccess({ ok: true, statut: "REFUSE" });
    }
  } catch (error: unknown) {
    console.error("Accept/refuse devis error:", error);
    return apiError("Erreur serveur", 500);
  }
}
