import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError } from "@/lib/api-response";
import { requireAuth } from "@/lib/auth-server";

export async function GET() {
  try {
    const session = await requireAuth();

    const artisan = await prisma.artisan.findUnique({
      where: { userId: session.userId },
    });

    if (!artisan || artisan.deletedAt) {
      return apiError("Artisan introuvable", 404);
    }

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const demandesCeMois = await prisma.demandeDevis.count({
      where: {
        artisanId: artisan.id,
        createdAt: { gte: startOfMonth },
      },
    });

    return apiSuccess({
      vuesCeMois: 0,
      demandesCeMois,
      rdvCeMois: 0,
      noteMoyenne: artisan.noteMoyenne,
      nombreAvis: artisan.nombreAvis,
    });
  } catch (error: unknown) {
    const err = error as Error;
    if (err.message === "UNAUTHORIZED") return apiError("Non autorisé", 401);
    if (err.message === "FORBIDDEN") return apiError("Accès interdit", 403);
    console.error("Artisan stats error:", err);
    return apiError("Erreur interne du serveur", 500);
  }
}
