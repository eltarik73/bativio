import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError } from "@/lib/api-response";
import { requireAdmin } from "@/lib/auth-server";

export async function GET() {
  try {
    await requireAdmin();

    const [subscribers, total, last30dCount] = await Promise.all([
      prisma.newsletterSubscriber.findMany({
        orderBy: { createdAt: "desc" },
        take: 100,
      }),
      prisma.newsletterSubscriber.count(),
      prisma.newsletterSubscriber.count({
        where: { createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } },
      }),
    ]);

    return apiSuccess({
      subscribers,
      total,
      last30dCount,
      activeCount: subscribers.filter((s) => !s.unsubscribedAt).length,
    });
  } catch (error: unknown) {
    const err = error as Error;
    if (err.message === "UNAUTHORIZED") return apiError("Non autorisé", 401);
    if (err.message === "FORBIDDEN") return apiError("Accès interdit", 403);
    console.error("Admin newsletter list error:", err);
    return apiError("Erreur interne du serveur", 500);
  }
}
