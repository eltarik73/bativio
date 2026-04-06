import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError, handleAuthError } from "@/lib/api-response";
import { requireAuth } from "@/lib/auth-server";

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string; collabId: string }> }
) {
  try {
    const session = await requireAuth();
    const { id: chantierId, collabId } = await params;

    const artisan = await prisma.artisan.findUnique({ where: { userId: session.userId } });
    if (!artisan || artisan.deletedAt) return apiError("Artisan introuvable", 404);

    const chantier = await prisma.chantier.findUnique({ where: { id: chantierId } });
    if (!chantier || chantier.artisanId !== artisan.id) {
      return apiError("Chantier introuvable", 404);
    }

    const collab = await prisma.chantierCollaborateur.findUnique({ where: { id: collabId } });
    if (!collab || collab.chantierId !== chantierId) {
      return apiError("Collaborateur introuvable", 404);
    }

    await prisma.chantierCollaborateur.delete({ where: { id: collabId } });

    return apiSuccess({ deleted: collabId });
  } catch (e) {
    const authErr = handleAuthError(e);
    if (authErr) return authErr;
    console.error("DELETE collaborateur error:", e);
    return apiError("Erreur interne du serveur", 500);
  }
}
