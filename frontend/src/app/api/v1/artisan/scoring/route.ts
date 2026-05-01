import { NextRequest } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError } from "@/lib/api-response";
import { requireAuth } from "@/lib/auth-server";
import { sendEmail } from "@/lib/email";
import {
  calculateScore,
  validateAnswers,
  ScoringAnswers,
} from "@/lib/scoring";

export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth();

    const artisan = await prisma.artisan.findUnique({
      where: { userId: session.userId },
      include: { user: { select: { email: true } } },
    });

    if (!artisan || artisan.deletedAt) {
      return apiError("Artisan introuvable", 404);
    }

    if (
      artisan.artisanStatus !== "ONBOARDING" &&
      artisan.artisanStatus !== "REJECTED"
    ) {
      return apiError(
        "Le scoring n'est possible qu'en statut ONBOARDING ou REJECTED",
        403
      );
    }

    const body = await request.json();
    // Accept both { answers: {...} } and direct {...} format
    const answers: ScoringAnswers = body.answers || body;

    if (!answers || typeof answers !== "object" || Object.keys(answers).length === 0) {
      return apiError("Les reponses sont requises", 400);
    }

    const validationError = validateAnswers(answers);
    if (validationError) {
      return apiError(validationError, 400);
    }

    const scoringResult = calculateScore(answers);

    const isAutoAccepted = scoringResult.autoAccepted;
    const newStatus = isAutoAccepted ? "ACTIVE" : "PENDING_REVIEW";

    await prisma.artisan.update({
      where: { id: artisan.id },
      data: {
        scoringData: answers as Prisma.InputJsonValue,
        scoringScore: scoringResult.score,
        scoringPercent: scoringResult.percent,
        scoringDate: new Date(),
        artisanStatus: newStatus,
        motifRefus: null, // Clear motif if retrying
        ...(isAutoAccepted
          ? {
              actif: true,
              validationDate: new Date(),
            }
          : {}),
      },
    });

    // Send admin notification email (fire & forget)
    const settings = await prisma.settings
      .findUnique({ where: { id: "singleton" } })
      .catch(() => null);
    const adminEmail = settings?.adminEmail || "contact@bativio.com";

    const resultLabel = isAutoAccepted ? "AUTO-ACCEPTE" : "EN ATTENTE DE VALIDATION";
    sendEmail(
      adminEmail,
      `[Bativio] Scoring artisan : ${artisan.nomAffichage} — ${resultLabel}`,
      `
        <h2>Scoring artisan</h2>
        <p><strong>Artisan :</strong> ${artisan.nomAffichage}</p>
        <p><strong>Email :</strong> ${artisan.user.email}</p>
        <p><strong>Score :</strong> ${scoringResult.percent}% (${scoringResult.score}/${scoringResult.maxScore})</p>
        <p><strong>Resultat :</strong> ${resultLabel}</p>
        ${
          !isAutoAccepted
            ? `<p><a href="${process.env.NEXT_PUBLIC_APP_URL || "https://www.bativio.fr"}/admin/validations">Valider manuellement</a></p>`
            : ""
        }
      `
    ).catch(() => {});

    return apiSuccess({
      result: isAutoAccepted ? "auto_accepted" : "pending_review",
      percent: scoringResult.percent,
      score: scoringResult.score,
      maxScore: scoringResult.maxScore,
    });
  } catch (error: unknown) {
    const err = error as Error;
    if (err.message === "UNAUTHORIZED") return apiError("Non autorise", 401);
    if (err.message === "FORBIDDEN") return apiError("Acces interdit", 403);
    console.error("Scoring error:", err);
    return apiError("Erreur interne du serveur", 500);
  }
}
