import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError } from "@/lib/api-response";
import { requireAdmin } from "@/lib/auth-server";
import { sendEmail } from "@/lib/email";

const statutSchema = z.object({
  statut: z.enum(["ACTIVE", "INACTIVE"]),
});

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;

    const body = await request.json();
    const parsed = statutSchema.safeParse(body);
    if (!parsed.success) {
      return apiError("Statut invalide. Valeurs acceptées : ACTIVE, INACTIVE", 400);
    }

    const { statut } = parsed.data;

    const artisan = await prisma.artisan.findUnique({
      where: { id },
      include: { user: { select: { email: true } } },
    });

    if (!artisan || artisan.deletedAt) {
      return apiError("Artisan introuvable", 404);
    }

    const updatedArtisan = await prisma.artisan.update({
      where: { id },
      data: {
        actif: statut === "ACTIVE",
        artisanStatus: statut === "ACTIVE" ? "ACTIVE" : "INACTIVE",
        // Clear NAF review flag if admin approves
        motifRefus: statut === "ACTIVE" ? null : artisan.motifRefus,
      },
      include: {
        user: { select: { email: true } },
        metier: true,
      },
    });

    // Send validation email when activating
    if (statut === "ACTIVE" && artisan.user.email) {
      await sendEmail(
          artisan.user.email,
          "Votre compte Bativio est activé !",
          `
            <h1>Bienvenue sur Bativio, ${artisan.nomAffichage} !</h1>
            <p>Votre compte a été validé par notre équipe. Votre fiche est désormais visible dans l'annuaire.</p>
            <p><a href="${process.env.NEXT_PUBLIC_APP_URL || "https://www.bativio.fr"}/dashboard">Accéder à mon espace</a></p>
          `,
        );
    }

    return apiSuccess(updatedArtisan);
  } catch (error: unknown) {
    const err = error as Error;
    if (err.message === "UNAUTHORIZED") return apiError("Non autorisé", 401);
    if (err.message === "FORBIDDEN") return apiError("Accès interdit", 403);
    console.error("Admin update statut error:", err);
    return apiError("Erreur interne du serveur", 500);
  }
}
