import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError } from "@/lib/api-response";
import { requireAdmin } from "@/lib/auth-server";
import { sendEmail } from "@/lib/email";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ artisanId: string }> }
) {
  try {
    const session = await requireAdmin();
    const { artisanId } = await params;

    const artisan = await prisma.artisan.findUnique({
      where: { id: artisanId },
      include: { user: { select: { email: true } } },
    });

    if (!artisan || artisan.deletedAt) {
      return apiError("Artisan introuvable", 404);
    }

    if (artisan.artisanStatus !== "PENDING_REVIEW") {
      return apiError(
        "Cet artisan n'est pas en attente de validation",
        409
      );
    }

    const updatedArtisan = await prisma.artisan.update({
      where: { id: artisanId },
      data: {
        artisanStatus: "ACTIVE",
        actif: true,
        validationDate: new Date(),
        validatedBy: session.userId,
      },
      include: {
        user: { select: { email: true } },
        metier: { select: { nom: true } },
      },
    });

    // Send welcome email (fire & forget)
    sendEmail(
      updatedArtisan.user.email,
      "Bienvenue sur Bativio ! Votre compte est active",
      `
        <h1>Felicitations, ${updatedArtisan.nomAffichage} !</h1>
        <p>Votre compte Bativio a ete valide par notre equipe. Votre fiche est desormais visible dans l'annuaire.</p>
        <p>Connectez-vous a votre espace pour completer votre profil et commencer a recevoir des demandes de devis.</p>
        <p><a href="${process.env.NEXT_PUBLIC_APP_URL || "https://bativio.fr"}/dashboard" style="display:inline-block;padding:12px 24px;background:#C4531A;color:#fff;text-decoration:none;border-radius:8px;">Acceder a mon espace</a></p>
      `
    ).catch(() => {});

    return apiSuccess({ success: true, artisan: updatedArtisan });
  } catch (error: unknown) {
    const err = error as Error;
    if (err.message === "UNAUTHORIZED") return apiError("Non autorise", 401);
    if (err.message === "FORBIDDEN") return apiError("Acces interdit", 403);
    console.error("Admin approve error:", err);
    return apiError("Erreur interne du serveur", 500);
  }
}
