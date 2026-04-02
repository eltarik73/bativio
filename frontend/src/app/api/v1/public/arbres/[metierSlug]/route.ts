import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError } from "@/lib/api-response";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ metierSlug: string }> }
) {
  try {
    const { metierSlug } = await params;

    // Look up ArbreQuestions by metierSlug
    let arbre = await prisma.arbreQuestions.findUnique({
      where: { metierSlug },
    });

    // Fallback to generic arbre if not found
    if (!arbre) {
      arbre = await prisma.arbreQuestions.findUnique({
        where: { metierSlug: "_generique" },
      });
    }

    if (!arbre) {
      return apiError("Arbre de questions introuvable", 404);
    }

    return apiSuccess({
      id: arbre.id,
      metierSlug: arbre.metierSlug,
      questions: arbre.questions,
      version: arbre.version,
    });
  } catch (error) {
    console.error("GET /api/v1/public/arbres/[metierSlug] error:", error);
    return apiError("Erreur interne du serveur", 500);
  }
}
