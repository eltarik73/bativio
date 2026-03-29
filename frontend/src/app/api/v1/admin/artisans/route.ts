import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError } from "@/lib/api-response";
import { requireAdmin } from "@/lib/auth-server";

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();

    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page") || "0", 10);
    const size = parseInt(searchParams.get("size") || "20", 10);

    const where = {
      deletedAt: null,
      ...(search
        ? {
            OR: [
              { nomAffichage: { contains: search, mode: "insensitive" as const } },
              { ville: { contains: search, mode: "insensitive" as const } },
            ],
          }
        : {}),
    };

    const [artisans, total] = await Promise.all([
      prisma.artisan.findMany({
        where,
        include: {
          user: { select: { email: true } },
          metier: true,
        },
        skip: page * size,
        take: size,
        orderBy: { createdAt: "desc" },
      }),
      prisma.artisan.count({ where }),
    ]);

    return apiSuccess({
      artisans,
      pagination: {
        page,
        size,
        total,
        totalPages: Math.ceil(total / size),
      },
    });
  } catch (error: unknown) {
    const err = error as Error;
    if (err.message === "UNAUTHORIZED") return apiError("Non autorisé", 401);
    if (err.message === "FORBIDDEN") return apiError("Accès interdit", 403);
    console.error("Admin artisans list error:", err);
    return apiError("Erreur interne du serveur", 500);
  }
}
