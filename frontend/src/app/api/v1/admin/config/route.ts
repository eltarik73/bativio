import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError } from "@/lib/api-response";
import { requireAdmin } from "@/lib/auth-server";
import { invalidateConfigCache } from "@/lib/config";

export async function GET() {
  try {
    await requireAdmin();

    const configs = await prisma.siteConfig.findMany({
      orderBy: { cle: "asc" },
    });

    const grouped: Record<string, typeof configs> = {};
    for (const config of configs) {
      const cat = config.categorie || "other";
      if (!grouped[cat]) grouped[cat] = [];
      grouped[cat].push(config);
    }

    return apiSuccess(grouped);
  } catch (error: unknown) {
    const err = error as Error;
    if (err.message === "UNAUTHORIZED") return apiError("Non autorise", 401);
    if (err.message === "FORBIDDEN") return apiError("Acces interdit", 403);
    console.error("Admin config GET error:", err);
    return apiError("Erreur interne du serveur", 500);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await requireAdmin();

    const body = await request.json();
    if (!Array.isArray(body)) {
      return apiError("Le body doit etre un tableau de { cle, valeur }", 400);
    }

    const updates = [];
    for (const item of body) {
      if (!item.cle || item.valeur === undefined) continue;
      updates.push(
        prisma.siteConfig.update({
          where: { cle: item.cle },
          data: {
            valeur: String(item.valeur),
            updatedBy: session.userId,
          },
        })
      );
    }

    await Promise.all(updates);
    invalidateConfigCache();

    return apiSuccess({ updated: updates.length });
  } catch (error: unknown) {
    const err = error as Error;
    if (err.message === "UNAUTHORIZED") return apiError("Non autorise", 401);
    if (err.message === "FORBIDDEN") return apiError("Acces interdit", 403);
    console.error("Admin config PUT error:", err);
    return apiError("Erreur interne du serveur", 500);
  }
}
