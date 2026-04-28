/**
 * Validation admin d'un artisan.
 *
 * Comportement :
 * - Accepte tous les status non-finaux : ONBOARDING, PENDING_REVIEW, PENDING_NAF_REVIEW
 * - Idempotent : si l'artisan est deja ACTIVE, renvoie 200 sans erreur
 * - Refuse uniquement REJECTED (a unblock manuellement) et soft-deleted
 * - Logs serveur explicites pour faciliter le debug
 * - IndexNow + email welcome fire-and-forget (n'echouent pas l'API)
 */
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError } from "@/lib/api-response";
import { requireAdmin } from "@/lib/auth-server";
import { sendEmail } from "@/lib/email";

const STATUS_VALIDABLES = new Set(["ONBOARDING", "PENDING_REVIEW", "PENDING_NAF_REVIEW"]);

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
      console.warn(`[admin/approve] artisan introuvable ou supprime : ${artisanId}`);
      return apiError("Artisan introuvable", 404);
    }

    // IDEMPOTENT : si deja ACTIVE, on retourne succes sans rien refaire
    if (artisan.artisanStatus === "ACTIVE" && artisan.actif) {
      console.log(`[admin/approve] artisan ${artisanId} (${artisan.slug}) deja ACTIVE, idempotent OK`);
      return apiSuccess({
        success: true,
        artisan,
        message: "Cet artisan etait deja actif",
        alreadyActive: true,
      });
    }

    // Bloque uniquement REJECTED (besoin de re-soumission explicite par l'artisan)
    if (artisan.artisanStatus === "REJECTED") {
      console.warn(`[admin/approve] tentative validation artisan REJECTED : ${artisanId}`);
      return apiError(
        "Cet artisan a ete refuse precedemment. Demandez-lui de se ressoumettre depuis son dashboard.",
        409
      );
    }

    // Accepte tous les autres status (ONBOARDING, PENDING_REVIEW, PENDING_NAF_REVIEW, et tout autre cas hybride)
    if (!STATUS_VALIDABLES.has(artisan.artisanStatus) && artisan.artisanStatus !== "ACTIVE") {
      console.warn(`[admin/approve] status non reconnu : ${artisanId} status=${artisan.artisanStatus}`);
      // Status inattendu mais on autorise quand meme la validation (defensive)
    }

    console.log(`[admin/approve] validation artisan ${artisanId} (${artisan.slug}) status_avant=${artisan.artisanStatus} actif_avant=${artisan.actif} -> ACTIVE+actif`);

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

    // SEO : notifie IndexNow (Bing, Yandex) - fire & forget
    try {
      const { notifyArtisanChange } = await import("@/lib/indexnow");
      notifyArtisanChange({
        slug: updatedArtisan.slug,
        villeSlug: updatedArtisan.villeSlug,
        ville: updatedArtisan.ville,
        metierSlugSeo: updatedArtisan.metierSlugSeo,
      });
    } catch (e) {
      console.warn("[admin/approve] indexnow trigger failed:", (e as Error).message);
    }

    // Send welcome email (fire & forget, log si erreur)
    sendEmail(
      updatedArtisan.user.email,
      "Bienvenue sur Bativio ! Votre compte est activé",
      `
        <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#3D2E1F;">
          <h1 style="font-family:Georgia,serif;font-size:24px;color:#C4531A;">Felicitations, ${updatedArtisan.nomAffichage} !</h1>
          <p style="font-size:15px;line-height:1.6;">Votre compte Bativio a ete valide par notre equipe. Votre fiche est desormais visible dans l'annuaire ${updatedArtisan.ville ? "&agrave; " + updatedArtisan.ville : ""}.</p>
          <p style="font-size:15px;line-height:1.6;">Connectez-vous pour completer votre profil et commencer a recevoir des demandes de devis :</p>
          <p><a href="${process.env.NEXT_PUBLIC_APP_URL || "https://www.bativio.fr"}/dashboard" style="display:inline-block;padding:14px 28px;background:#C4531A;color:#fff;text-decoration:none;border-radius:8px;font-weight:600;">Acceder a mon espace</a></p>
          <p style="margin-top:24px;font-size:13px;color:#9C958D;">Une question ? Repondez a ce mail.<br>L'equipe Bativio</p>
        </div>
      `
    ).catch((e) => {
      console.warn(`[admin/approve] email welcome echec pour ${updatedArtisan.user.email}:`, (e as Error).message);
    });

    return apiSuccess({ success: true, artisan: updatedArtisan, message: "Artisan valide avec succes" });
  } catch (error: unknown) {
    const err = error as Error;
    if (err.message === "UNAUTHORIZED") return apiError("Non autorise", 401);
    if (err.message === "FORBIDDEN") return apiError("Acces interdit", 403);
    console.error("[admin/approve] erreur interne:", err);
    return apiError(`Erreur interne du serveur : ${err.message || "inconnue"}`, 500);
  }
}
