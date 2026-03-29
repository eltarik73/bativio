import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError } from "@/lib/api-response";
import { requireAuth } from "@/lib/auth-server";

export async function DELETE(
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

    const zone = await prisma.zoneIntervention.findUnique({ where: { id } });

    if (!zone || zone.artisanId !== artisan.id) {
      return apiError("Zone introuvable", 404);
    }

    await prisma.zoneIntervention.delete({ where: { id } });

    return apiSuccess({ deleted: true });
  } catch (error: unknown) {
    const err = error as Error;
    if (err.message === "UNAUTHORIZED") return apiError("Non autorisé", 401);
    if (err.message === "FORBIDDEN") return apiError("Accès interdit", 403);
    console.error("Delete zone error:", err);
    return apiError("Erreur interne du serveur", 500);
  }
}
