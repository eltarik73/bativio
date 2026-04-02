import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError } from "@/lib/api-response";
import { requireAuth } from "@/lib/auth-server";
import { z } from "zod";

const statusSchema = z.object({
  status: z.enum(["NOUVEAU", "VU", "REPONDU", "ACCEPTE", "REFUSE", "ARCHIVE"], {
    error: "Statut invalide",
  }),
});

export async function PUT(
  request: NextRequest,
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
    });

    if (!demande || demande.artisanId !== artisan.id) {
      return apiError("Demande de devis introuvable", 404);
    }

    const body = await request.json();
    const parsed = statusSchema.safeParse(body);
    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message || "Données invalides";
      return apiError(firstError, 400);
    }

    const { status } = parsed.data;

    const updated = await prisma.demandeDevis.update({
      where: { id },
      data: { statut: status },
    });

    return apiSuccess(updated);
  } catch (error: unknown) {
    const err = error as Error;
    if (err.message === "UNAUTHORIZED") return apiError("Non autorisé", 401);
    if (err.message === "FORBIDDEN") return apiError("Accès interdit", 403);
    console.error("PUT /api/v1/artisan/demandes/[id]/status error:", err);
    return apiError("Erreur interne du serveur", 500);
  }
}
