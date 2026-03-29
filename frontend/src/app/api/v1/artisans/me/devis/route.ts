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
    const statut = searchParams.get("statut");
    const page = parseInt(searchParams.get("page") || "0", 10);
    const size = parseInt(searchParams.get("size") || "20", 10);

    const where = {
      artisanId: artisan.id,
      ...(statut ? { statut: statut as "NOUVEAU" | "VU" | "REPONDU" | "ACCEPTE" | "REFUSE" | "ARCHIVE" } : {}),
    };

    const [devis, total] = await Promise.all([
      prisma.demandeDevis.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: page * size,
        take: size,
      }),
      prisma.demandeDevis.count({ where }),
    ]);

    return apiSuccess({
      devis,
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
    console.error("Get devis list error:", err);
    return apiError("Erreur interne du serveur", 500);
  }
}
