import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-server";
import { apiSuccess, apiError } from "@/lib/api-response";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;
    const { visible } = await request.json();

    const updated = await prisma.artisan.update({
      where: { id },
      data: { visible: Boolean(visible) },
      select: { id: true, visible: true, nomAffichage: true },
    });

    return apiSuccess(updated);
  } catch (error: unknown) {
    const err = error as Error;
    if (err.message === "UNAUTHORIZED") return apiError("Non autorisé", 401);
    if (err.message === "FORBIDDEN") return apiError("Accès refusé", 403);
    console.error("Toggle visibility error:", err);
    return apiError("Erreur interne", 500);
  }
}
