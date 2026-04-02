import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError } from "@/lib/api-response";
import { requireAuth } from "@/lib/auth-server";
import { getLeadLimit } from "@/lib/lead-limits";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAuth();
    const { id } = await params;

    const artisan = await prisma.artisan.findUnique({
      where: { userId: session.userId },
    });

    if (!artisan || artisan.deletedAt) {
      return apiError("Artisan introuvable", 404);
    }

    const demande = await prisma.demandeDevis.findUnique({
      where: { id },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
        },
        photosDevis: {
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!demande || demande.artisanId !== artisan.id) {
      return apiError("Demande de devis introuvable", 404);
    }

    // Determine rank of this demande (1-based, ordered by createdAt ASC)
    const rankBefore = await prisma.demandeDevis.count({
      where: {
        artisanId: artisan.id,
        createdAt: { lt: demande.createdAt },
      },
    });
    const rank = rankBefore + 1;

    const leadLimit = getLeadLimit(artisan.plan);
    const masked = leadLimit !== null && rank > leadLimit;

    const responseData = {
      ...demande,
      masque: masked,
      ...(masked
        ? {
            nomClient: null,
            telephoneClient: null,
            emailClient: null,
          }
        : {}),
    };

    return apiSuccess(responseData);
  } catch (error: unknown) {
    const err = error as Error;
    if (err.message === "UNAUTHORIZED") return apiError("Non autorisé", 401);
    if (err.message === "FORBIDDEN") return apiError("Accès interdit", 403);
    console.error("GET /api/v1/artisan/demandes/[id] error:", err);
    return apiError("Erreur interne du serveur", 500);
  }
}
