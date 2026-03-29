import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError } from "@/lib/api-response";
import { requireAuth } from "@/lib/auth-server";

export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth();

    const artisan = await prisma.artisan.findUnique({
      where: { userId: session.userId },
    });

    if (!artisan || artisan.deletedAt) {
      return apiError("Artisan introuvable", 404);
    }

    const searchParams = request.nextUrl.searchParams;
    const luParam = searchParams.get("lu");

    const where = {
      artisanId: artisan.id,
      ...(luParam !== null ? { lu: luParam === "true" } : {}),
    };

    const notifications = await prisma.notification.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return apiSuccess(notifications);
  } catch (error: unknown) {
    const err = error as Error;
    if (err.message === "UNAUTHORIZED") return apiError("Non autorisé", 401);
    if (err.message === "FORBIDDEN") return apiError("Accès interdit", 403);
    console.error("Get notifications error:", err);
    return apiError("Erreur interne du serveur", 500);
  }
}

export async function PUT() {
  try {
    const session = await requireAuth();

    const artisan = await prisma.artisan.findUnique({
      where: { userId: session.userId },
    });

    if (!artisan || artisan.deletedAt) {
      return apiError("Artisan introuvable", 404);
    }

    await prisma.notification.updateMany({
      where: { artisanId: artisan.id, lu: false },
      data: { lu: true },
    });

    return apiSuccess({ message: "Toutes les notifications ont été marquées comme lues" });
  } catch (error: unknown) {
    const err = error as Error;
    if (err.message === "UNAUTHORIZED") return apiError("Non autorisé", 401);
    if (err.message === "FORBIDDEN") return apiError("Accès interdit", 403);
    console.error("Mark all notifications read error:", err);
    return apiError("Erreur interne du serveur", 500);
  }
}
