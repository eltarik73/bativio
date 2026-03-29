import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError } from "@/lib/api-response";
import { requireAdmin } from "@/lib/auth-server";

export async function GET() {
  try {
    await requireAdmin();

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [totalArtisans, totalDevis, plansBreakdown] = await Promise.all([
      prisma.artisan.count({
        where: { actif: true, deletedAt: null },
      }),
      prisma.demandeDevis.count({
        where: { createdAt: { gte: startOfMonth } },
      }),
      prisma.artisan.groupBy({
        by: ["plan"],
        where: { deletedAt: null },
        _count: { plan: true },
      }),
    ]);

    const plans = plansBreakdown.reduce(
      (acc, item) => {
        acc[item.plan] = item._count.plan;
        return acc;
      },
      {} as Record<string, number>
    );

    return apiSuccess({
      totalArtisans,
      totalDevis,
      plans,
    });
  } catch (error: unknown) {
    const err = error as Error;
    if (err.message === "UNAUTHORIZED") return apiError("Non autorisé", 401);
    if (err.message === "FORBIDDEN") return apiError("Accès interdit", 403);
    console.error("Admin stats error:", err);
    return apiError("Erreur interne du serveur", 500);
  }
}
