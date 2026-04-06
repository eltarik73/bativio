import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError, handleAuthError } from "@/lib/api-response";
import { requireAuth } from "@/lib/auth-server";

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ metierId: string }> }
) {
  try {
    const session = await requireAuth();
    const { metierId } = await params;

    const artisan = await prisma.artisan.findUnique({
      where: { userId: session.userId },
    });

    if (!artisan || artisan.deletedAt) {
      return apiError("Artisan introuvable", 404);
    }

    // Find the link
    const am = await prisma.artisanMetier.findUnique({
      where: { artisanId_metierId: { artisanId: artisan.id, metierId } },
    });

    if (!am) {
      return apiError("Métier non trouvé dans votre liste", 404);
    }

    if (am.principal) {
      return apiError("Impossible de retirer votre métier principal", 400);
    }

    await prisma.artisanMetier.delete({
      where: { id: am.id },
    });

    return apiSuccess({ removed: metierId });
  } catch (e) {
    const authErr = handleAuthError(e);
    if (authErr) return authErr;
    console.error("DELETE metier error:", e);
    return apiError("Erreur interne du serveur", 500);
  }
}
