import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-server";
import { apiSuccess, apiError } from "@/lib/api-response";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAuth();
    const { id } = await params;

    const artisan = await prisma.artisan.findUnique({
      where: { userId: session.userId },
    });
    if (!artisan) return apiError("Artisan non trouve", 404);

    const jourFerie = await prisma.jourFerie.findUnique({
      where: { id },
    });

    if (!jourFerie) {
      return apiError("Jour ferie non trouve", 404);
    }

    if (jourFerie.artisanId !== artisan.id) {
      return apiError("Acces refuse", 403);
    }

    await prisma.jourFerie.delete({
      where: { id },
    });

    return apiSuccess({ message: "Jour ferie supprime" });
  } catch (e: unknown) {
    if (e instanceof Error && e.message === "UNAUTHORIZED")
      return apiError("Non autorise", 401);
    console.error("DELETE jour-ferie error:", e);
    return apiError("Erreur serveur", 500);
  }
}
