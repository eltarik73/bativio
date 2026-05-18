import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError } from "@/lib/api-response";
import { requireAdmin } from "@/lib/auth-server";

// GET /api/v1/admin/clicks
//
// Stats des clics sortants enregistres par ClickEvent.
// Renvoie 3 vues : par label, par sourcePage, par category, + total + last24h.
//
// Utilise par /admin/statistiques pour la section "Clics sortants & redirections".

export async function GET() {
  try {
    await requireAdmin();

    const now = new Date();
    const startOfDay = new Date(now);
    startOfDay.setHours(0, 0, 0, 0);
    const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const last7d = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const last30d = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [
      totalAll,
      total24h,
      total7d,
      total30d,
      byLabel,
      byPage,
      byCategory,
      recentClicks,
    ] = await Promise.all([
      prisma.clickEvent.count(),
      prisma.clickEvent.count({ where: { createdAt: { gte: last24h } } }),
      prisma.clickEvent.count({ where: { createdAt: { gte: last7d } } }),
      prisma.clickEvent.count({ where: { createdAt: { gte: last30d } } }),
      // Aggregation par label (top 20)
      prisma.clickEvent.groupBy({
        by: ["label"],
        _count: { label: true },
        orderBy: { _count: { label: "desc" } },
        take: 20,
      }),
      // Aggregation par page source (top 20)
      prisma.clickEvent.groupBy({
        by: ["sourcePage"],
        _count: { sourcePage: true },
        orderBy: { _count: { sourcePage: "desc" } },
        take: 20,
      }),
      // Aggregation par categorie
      prisma.clickEvent.groupBy({
        by: ["category"],
        _count: { category: true },
        orderBy: { _count: { category: "desc" } },
      }),
      // Derniers 50 clics pour preview/audit
      prisma.clickEvent.findMany({
        orderBy: { createdAt: "desc" },
        take: 50,
        select: {
          id: true,
          label: true,
          targetUrl: true,
          sourcePage: true,
          category: true,
          createdAt: true,
        },
      }),
    ]);

    return apiSuccess({
      totals: {
        all: totalAll,
        last24h: total24h,
        last7d: total7d,
        last30d: total30d,
      },
      byLabel: byLabel.map((b) => ({ label: b.label, count: b._count.label })),
      byPage: byPage.map((b) => ({
        page: b.sourcePage,
        count: b._count.sourcePage,
      })),
      byCategory: byCategory.map((b) => ({
        category: b.category ?? "(uncategorized)",
        count: b._count.category,
      })),
      recent: recentClicks.map((c) => ({
        ...c,
        createdAt: c.createdAt.toISOString(),
      })),
    });
  } catch (err) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const e = err as any;
    if (e?.message === "UNAUTHORIZED") return apiError("Unauthorized", 401);
    if (e?.message === "FORBIDDEN") return apiError("Forbidden", 403);
    console.error("GET /api/v1/admin/clicks error:", err);
    return apiError("Erreur interne du serveur", 500);
  }
}
