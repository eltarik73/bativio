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

    const devis = await prisma.demandeDevis.findUnique({
      where: { id },
      include: {
        replies: {
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!devis || devis.artisanId !== artisan.id) {
      return apiError("Demande de devis introuvable", 404);
    }

    return apiSuccess(devis);
  } catch (error: unknown) {
    const err = error as Error;
    if (err.message === "UNAUTHORIZED") return apiError("Non autorisé", 401);
    if (err.message === "FORBIDDEN") return apiError("Accès interdit", 403);
    console.error("Get devis detail error:", err);
    return apiError("Erreur interne du serveur", 500);
  }
}
