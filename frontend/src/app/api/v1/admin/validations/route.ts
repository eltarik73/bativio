import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError } from "@/lib/api-response";
import { requireAdmin } from "@/lib/auth-server";

/**
 * Liste tous les artisans en attente de validation par l'admin.
 *
 * Statuts inclus (non-finaux) :
 * - ONBOARDING : artisan vient de s'inscrire, n'a pas encore complete le scoring
 * - PENDING_REVIEW : scoring fait, en attente validation manuelle admin
 * - PENDING_NAF_REVIEW : check NAF/SIRET en attente
 *
 * Statuts EXCLUS (etats finaux) :
 * - ACTIVE : deja valide
 * - REJECTED : refuse explicitement (artisan doit re-soumettre)
 *
 * Tri : artisans avec scoringDate (PENDING_REVIEW) en premier puis ONBOARDING/PENDING_NAF_REVIEW
 * (les plus prets a valider remontent en haut)
 */
export async function GET() {
  try {
    await requireAdmin();

    const artisans = await prisma.artisan.findMany({
      where: {
        artisanStatus: { in: ["ONBOARDING", "PENDING_REVIEW", "PENDING_NAF_REVIEW"] },
        deletedAt: null,
      },
      include: {
        user: { select: { email: true } },
        metier: { select: { nom: true, slug: true } },
      },
      orderBy: [
        // PENDING_REVIEW d'abord (scoring fait, pret a valider)
        { artisanStatus: "asc" }, // ONBOARDING < PENDING_NAF_REVIEW < PENDING_REVIEW alphabetiquement
        { scoringDate: "asc" }, // les + anciens en premier dans chaque statut
        { createdAt: "asc" },
      ],
    });

    return apiSuccess({ artisans });
  } catch (error: unknown) {
    const err = error as Error;
    if (err.message === "UNAUTHORIZED") return apiError("Non autorise", 401);
    if (err.message === "FORBIDDEN") return apiError("Acces interdit", 403);
    console.error("[admin/validations] list error:", err);
    return apiError("Erreur interne du serveur", 500);
  }
}
