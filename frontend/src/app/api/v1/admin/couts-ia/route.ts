import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError } from "@/lib/api-response";
import { requireAdmin } from "@/lib/auth-server";

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();

    const { searchParams } = new URL(request.url);
    const days = Math.min(parseInt(searchParams.get("days") ?? "30", 10), 365);
    const since = new Date(Date.now() - days * 24 * 3600 * 1000);

    const [byAgent, byModel, total, last50, topArtisans] = await Promise.all([
      prisma.tokenUsage.groupBy({
        by: ["agent"],
        where: { createdAt: { gte: since } },
        _sum: { costEur: true, tokensIn: true, tokensOut: true, tokensCacheRead: true },
        _count: { _all: true },
      }),
      prisma.tokenUsage.groupBy({
        by: ["model"],
        where: { createdAt: { gte: since } },
        _sum: { costEur: true, tokensIn: true, tokensOut: true },
        _count: { _all: true },
      }),
      prisma.tokenUsage.aggregate({
        where: { createdAt: { gte: since } },
        _sum: { costEur: true, tokensIn: true, tokensOut: true, tokensCacheRead: true },
        _count: { _all: true },
      }),
      prisma.tokenUsage.findMany({
        where: { createdAt: { gte: since } },
        orderBy: { createdAt: "desc" },
        take: 50,
        select: {
          id: true, agent: true, model: true, tokensIn: true, tokensOut: true,
          tokensCacheRead: true, costEur: true, success: true, errorMessage: true,
          latencyMs: true, createdAt: true, artisanId: true, demandeId: true,
        },
      }),
      prisma.tokenUsage.groupBy({
        by: ["artisanId"],
        where: { createdAt: { gte: since }, artisanId: { not: null } },
        _sum: { costEur: true },
        _count: { _all: true },
        orderBy: { _sum: { costEur: "desc" } },
        take: 10,
      }),
    ]);

    return apiSuccess({
      period: { days, since: since.toISOString() },
      total: {
        calls: total._count._all,
        costEur: total._sum.costEur ?? 0,
        tokensIn: total._sum.tokensIn ?? 0,
        tokensOut: total._sum.tokensOut ?? 0,
        tokensCacheRead: total._sum.tokensCacheRead ?? 0,
      },
      byAgent,
      byModel,
      last50,
      topArtisans,
    });
  } catch (error: unknown) {
    const err = error as Error;
    if (err.message === "UNAUTHORIZED" || err.message === "FORBIDDEN")
      return apiError("Non autorisé", 403);
    console.error("[admin/couts-ia]", err);
    return apiError("Erreur serveur", 500);
  }
}
