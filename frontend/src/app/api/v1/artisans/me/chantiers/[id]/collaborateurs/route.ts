import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError, handleAuthError } from "@/lib/api-response";
import { requireAuth } from "@/lib/auth-server";

const addCollabSchema = z.object({
  nom: z.string().min(1, "Le nom est requis"),
  email: z.string().email().optional().or(z.literal("")),
  telephone: z.string().optional(),
  role: z.string().optional(),
  source: z.enum(["MANUEL", "BATIVIO", "GMAIL"]).default("MANUEL"),
  artisanBativioId: z.string().optional(),
});

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAuth();
    const { id: chantierId } = await params;

    const artisan = await prisma.artisan.findUnique({
      where: { userId: session.userId },
      include: { user: { select: { email: true } } },
    });
    if (!artisan || artisan.deletedAt) return apiError("Artisan introuvable", 404);

    const chantier = await prisma.chantier.findUnique({ where: { id: chantierId } });
    if (!chantier || chantier.artisanId !== artisan.id) {
      return apiError("Chantier introuvable", 404);
    }

    const body = await request.json();
    const parsed = addCollabSchema.safeParse(body);
    if (!parsed.success) {
      return apiError(parsed.error.issues[0]?.message || "Donn\u00e9es invalides", 400);
    }

    const data = parsed.data;

    const collab = await prisma.chantierCollaborateur.create({
      data: {
        chantierId,
        nom: data.nom,
        email: data.email || null,
        telephone: data.telephone || null,
        role: data.role || "collaborateur",
        source: data.source,
        artisanBativioId: data.artisanBativioId || null,
      },
    });

    // If Bativio artisan — send notification + email
    if (data.source === "BATIVIO" && data.artisanBativioId) {
      try {
        const invitedArtisan = await prisma.artisan.findUnique({
          where: { id: data.artisanBativioId },
          include: { user: { select: { email: true } } },
        });

        if (invitedArtisan) {
          // Create in-app notification
          await prisma.notification.create({
            data: {
              artisanId: invitedArtisan.id,
              type: "CHANTIER_INVITE",
              titre: `Invitation chantier : ${chantier.nom}`,
              message: `${artisan.nomAffichage} vous a ajout\u00e9 au chantier "${chantier.nom}"${chantier.adresse ? ` \u00e0 ${chantier.adresse}` : ""} du ${new Date(chantier.dateDebut).toLocaleDateString("fr-FR")} au ${new Date(chantier.dateFin).toLocaleDateString("fr-FR")}.`,
            },
          });

          // Send email
          if (invitedArtisan.user.email) {
            const { sendEmail } = await import("@/lib/email");
            const dateDebStr = new Date(chantier.dateDebut).toLocaleDateString("fr-FR");
            const dateFinStr = new Date(chantier.dateFin).toLocaleDateString("fr-FR");
            await sendEmail(
              invitedArtisan.user.email,
              `Invitation chantier : ${chantier.nom}`,
              `<div style="font-family:Karla,sans-serif;max-width:500px;margin:0 auto;padding:24px">
                <h2 style="color:#3D2E1F;font-family:Fraunces,serif">Vous avez \u00e9t\u00e9 ajout\u00e9 \u00e0 un chantier</h2>
                <p><strong>${artisan.nomAffichage}</strong> vous a ajout\u00e9 au chantier :</p>
                <div style="background:#FAF8F5;border-radius:10px;padding:16px;margin:16px 0;border-left:4px solid ${chantier.couleur}">
                  <p style="font-weight:700;color:#3D2E1F;margin:0 0 4px">${chantier.nom}</p>
                  ${chantier.adresse ? `<p style="color:#6B6560;margin:0 0 4px">${chantier.adresse}${chantier.ville ? `, ${chantier.ville}` : ""}</p>` : ""}
                  <p style="color:#9C958D;margin:0">${dateDebStr} \u2192 ${dateFinStr}</p>
                </div>
                <p style="color:#9C958D;font-size:12px">Ce chantier appara\u00eet dans votre planning Bativio.</p>
              </div>`
            );
          }
        }
      } catch (notifErr) {
        console.error("Notification collab error:", notifErr);
        // Don't fail the request if notification fails
      }
    }

    return apiSuccess(collab, 201);
  } catch (e) {
    const authErr = handleAuthError(e);
    if (authErr) return authErr;
    console.error("POST collaborateur error:", e);
    return apiError("Erreur interne du serveur", 500);
  }
}
