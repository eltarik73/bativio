import { type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError } from "@/lib/api-response";
import { sendEmail } from "@/lib/email";
import { z } from "zod";

const postSchema = z.object({
  token: z.string().min(1, "Le token est requis"),
  action: z.enum(["accept", "refuse"], {
    error: "L'action doit être 'accept' ou 'refuse'",
  }),
  raison: z.string().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const token = request.nextUrl.searchParams.get("token");

    if (!token) {
      return apiError("Le token est requis", 400);
    }

    const demandeDevis = await prisma.demandeDevis.findFirst({
      where: { responseToken: token },
      include: {
        artisan: {
          select: {
            nomAffichage: true,
            telephone: true,
            ville: true,
            metier: { select: { nom: true } },
          },
        },
      },
    });

    if (!demandeDevis) {
      return apiError("Demande de devis non trouvée", 404);
    }

    return apiSuccess({
      id: demandeDevis.id,
      nomClient: demandeDevis.nomClient,
      descriptionBesoin: demandeDevis.descriptionBesoin,
      statut: demandeDevis.statut,
      createdAt: demandeDevis.createdAt,
      artisan: {
        nomAffichage: demandeDevis.artisan.nomAffichage,
        telephone: demandeDevis.artisan.telephone,
        ville: demandeDevis.artisan.ville,
        metierNom: demandeDevis.artisan.metier?.nom ?? null,
      },
    });
  } catch (error) {
    console.error("GET /api/v1/public/devis-response error:", error);
    return apiError("Erreur interne du serveur", 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const parsed = postSchema.safeParse(body);
    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message || "Données invalides";
      return apiError(firstError, 400);
    }

    const { token, action, raison } = parsed.data;

    const demandeDevis = await prisma.demandeDevis.findFirst({
      where: { responseToken: token },
      include: {
        artisan: {
          include: {
            user: { select: { email: true } },
          },
        },
      },
    });

    if (!demandeDevis) {
      return apiError("Demande de devis non trouvée", 404);
    }

    // Check if already responded
    if (
      demandeDevis.statut === "ACCEPTE" ||
      demandeDevis.statut === "REFUSE"
    ) {
      return apiError("Cette demande a déjà reçu une réponse", 400);
    }

    const newStatut = action === "accept" ? "ACCEPTE" : "REFUSE";

    // Update the devis status
    await prisma.demandeDevis.update({
      where: { id: demandeDevis.id },
      data: {
        statut: newStatut,
        reponduAt: new Date(),
      },
    });

    // Send email notification to artisan
    const actionLabel = action === "accept" ? "acceptée" : "refusée";
    await sendEmail(
      demandeDevis.artisan.user.email,
      `Demande de devis ${actionLabel} par ${demandeDevis.nomClient}`,
      `
          <div style="font-family: Karla, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #C4531A;">Demande de devis ${actionLabel}</h2>
            <p>Bonjour <strong>${demandeDevis.artisan.nomAffichage}</strong>,</p>
            <p>Le client <strong>${demandeDevis.nomClient}</strong> a <strong>${actionLabel}</strong> votre proposition.</p>
            ${raison ? `<div style="background: #FAF8F5; padding: 16px; border-radius: 8px; margin: 16px 0;"><p><strong>Raison :</strong> ${raison}</p></div>` : ""}
            <div style="background: #FAF8F5; padding: 16px; border-radius: 8px; margin: 16px 0;">
              <p><strong>Demande initiale :</strong></p>
              <p>${demandeDevis.descriptionBesoin}</p>
            </div>
            <a href="${process.env.NEXT_PUBLIC_APP_URL || "https://bativio.fr"}/dashboard/devis/${demandeDevis.id}"
               style="display: inline-block; background: #C4531A; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin-top: 8px;">
              Voir le détail
            </a>
            <p style="color: #666; font-size: 12px; margin-top: 24px;">
              — L'équipe Bativio
            </p>
          </div>
        `,
    );

    // Create notification for artisan
    await prisma.notification.create({
      data: {
        artisanId: demandeDevis.artisanId,
        type: "DEMANDE_DEVIS",
        titre: `Devis ${actionLabel}`,
        message: `${demandeDevis.nomClient} a ${actionLabel} votre proposition de devis.${raison ? ` Raison : ${raison}` : ""}`,
      },
    });

    return apiSuccess({
      message: `La demande de devis a été ${actionLabel}`,
      statut: newStatut,
    });
  } catch (error) {
    console.error("POST /api/v1/public/devis-response error:", error);
    return apiError("Erreur interne du serveur", 500);
  }
}
