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
  // Auth d'abord (hors try/catch principal pour mapping clean des codes)
  try {
    await requireAdmin();
  } catch (e) {
    const err = e as Error;
    if (err.message === "UNAUTHORIZED") return apiError("Non autorise", 401);
    if (err.message === "FORBIDDEN") return apiError("Acces interdit", 403);
    console.error("[admin/validations] auth error:", err);
    return apiError(`Auth error : ${err.message || "inconnue"}`, 500);
  }

  // Query DB en try/catch separe pour logging precis
  try {
    console.log("[admin/validations] GET start - query Prisma");

    const rows = await prisma.artisan.findMany({
      where: {
        artisanStatus: { in: ["ONBOARDING", "PENDING_REVIEW", "PENDING_NAF_REVIEW"] },
        deletedAt: null,
      },
      include: {
        user: { select: { email: true } },
        metier: { select: { nom: true, slug: true } },
      },
      orderBy: [
        // PENDING_REVIEW d'abord (scoring fait, pret a valider).
        // Tri alphabetique : ONBOARDING < PENDING_NAF_REVIEW < PENDING_REVIEW.
        { artisanStatus: "asc" },
        // scoringDate nullable : les ONBOARDING n'ont pas encore score, on les met en dernier
        // dans chaque groupe via nulls: "last" (sinon Postgres met null en premier en ASC).
        { scoringDate: { sort: "asc", nulls: "last" } },
        { createdAt: "asc" },
      ],
    });

    // IMPORTANT : on aplatit la reponse pour eviter d'envoyer des objets nested
    // ({ metier: { nom, slug }, user: { email }, scoringAnswers: Json) au client.
    // Si le client render directement {artisan.metier} sur un objet -> React crash :
    // "Objects are not valid as a React child" -> error.tsx s'affiche.
    // Donc on retourne uniquement des champs scalaires + answers en array deserialise.
    const artisans = rows.map((a) => {
      // scoringData (Json?) peut etre stocke en string JSON ou en JSON natif Prisma
      let answers: unknown = a.scoringData;
      if (typeof answers === "string") {
        try { answers = JSON.parse(answers); } catch { answers = null; }
      }
      return {
        id: a.id,
        nomAffichage: a.nomAffichage,
        ville: a.ville,
        slug: a.slug,
        artisanStatus: a.artisanStatus,
        // metier : on extrait juste le nom (string), pas l'objet
        metierNom: a.metier?.nom || null,
        metierSlug: a.metier?.slug || null,
        // email user
        email: a.user?.email || null,
        // scoring : score + percent + answers deserialises
        score: a.scoringScore ?? null,
        scorePercent: a.scoringPercent ?? null,
        scoringDate: a.scoringDate ? a.scoringDate.toISOString() : null,
        answers,
        // dates
        createdAt: a.createdAt.toISOString(),
      };
    });

    console.log(`[admin/validations] GET ok - ${artisans.length} artisans found`);
    return apiSuccess({ artisans });
  } catch (error: unknown) {
    const err = error as Error;
    // Log detaille pour debug Vercel
    console.error("[admin/validations] DB error:", {
      name: err.name,
      message: err.message,
      stack: (err.stack || "").substring(0, 500),
    });
    // Renvoie le vrai message d'erreur (pas "Erreur interne du serveur" generique)
    return apiError(`DB error : ${err.message || "inconnue"}`, 500);
  }
}
