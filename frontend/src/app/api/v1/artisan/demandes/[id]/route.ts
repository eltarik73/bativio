import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError } from "@/lib/api-response";
import { requireAuth } from "@/lib/auth-server";

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

    return apiSuccess(demande);
  } catch (error: unknown) {
    const err = error as Error;
    if (err.message === "UNAUTHORIZED") return apiError("Non autorisé", 401);
    if (err.message === "FORBIDDEN") return apiError("Accès interdit", 403);
    console.error("GET /api/v1/artisan/demandes/[id] error:", err);
    return apiError("Erreur interne du serveur", 500);
  }
}
