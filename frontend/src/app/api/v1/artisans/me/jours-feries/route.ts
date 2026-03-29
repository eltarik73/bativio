import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-server";
import { apiSuccess, apiError } from "@/lib/api-response";

export async function GET() {
  try {
    const session = await requireAuth();

    const artisan = await prisma.artisan.findUnique({
      where: { userId: session.userId },
    });
    if (!artisan) return apiError("Artisan non trouve", 404);

    const joursFeries = await prisma.jourFerie.findMany({
      where: { artisanId: artisan.id },
      orderBy: { date: "asc" },
    });

    return apiSuccess(joursFeries);
  } catch (e: unknown) {
    if (e instanceof Error && e.message === "UNAUTHORIZED")
      return apiError("Non autorise", 401);
    console.error("GET jours-feries error:", e);
    return apiError("Erreur serveur", 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth();

    const artisan = await prisma.artisan.findUnique({
      where: { userId: session.userId },
    });
    if (!artisan) return apiError("Artisan non trouve", 404);

    const body: { date: string; motif?: string } = await request.json();

    if (!body.date) {
      return apiError("La date est requise", 400);
    }

    const dateObj = new Date(body.date);
    if (isNaN(dateObj.getTime())) {
      return apiError("Date invalide", 400);
    }

    const jourFerie = await prisma.jourFerie.create({
      data: {
        artisanId: artisan.id,
        date: dateObj,
        motif: body.motif ?? null,
      },
    });

    return apiSuccess(jourFerie, 201);
  } catch (e: unknown) {
    if (e instanceof Error && e.message === "UNAUTHORIZED")
      return apiError("Non autorise", 401);
    console.error("POST jours-feries error:", e);
    return apiError("Erreur serveur", 500);
  }
}
