import { NextRequest } from "next/server";
import { z } from "zod";
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

    const tarification = await prisma.tarification.findUnique({
      where: { artisanId: artisan.id },
    });

    if (!tarification) {
      return apiSuccess(null);
    }

    return apiSuccess(tarification);
  } catch (error: unknown) {
    const err = error as Error;
    if (err.message === "UNAUTHORIZED") return apiError("Non autorise", 401);
    if (err.message === "FORBIDDEN") return apiError("Acces interdit", 403);
    console.error("Get tarification error:", err);
    return apiError("Erreur interne du serveur", 500);
  }
}

const tarificationSchema = z.object({
  tarifHoraire: z.number().min(20).max(200),
  fraisDeplacementType: z.enum(["forfait", "km"]),
  fraisDeplacementMontant: z.number().min(0).max(100),
  margeFournitures: z.number().min(0).max(100),
  tvaDefault: z.number().min(0).max(20),
  assuranceNumero: z.string().optional(),
  assuranceNom: z.string().optional(),
  fourniturePolicy: z.enum(["artisan_fournit", "client_peut_fournir", "peu_importe"]).optional(),
});

export async function PUT(request: NextRequest) {
  try {
    const session = await requireAuth();

    const artisan = await prisma.artisan.findUnique({
      where: { userId: session.userId },
    });

    if (!artisan || artisan.deletedAt) {
      return apiError("Artisan introuvable", 404);
    }

    const body = await request.json();
    const parsed = tarificationSchema.safeParse(body);
    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message || "Donnees invalides";
      return apiError(firstError, 400);
    }

    const tarification = await prisma.tarification.upsert({
      where: { artisanId: artisan.id },
      create: {
        artisanId: artisan.id,
        ...parsed.data,
      },
      update: parsed.data,
    });

    return apiSuccess(tarification);
  } catch (error: unknown) {
    const err = error as Error;
    if (err.message === "UNAUTHORIZED") return apiError("Non autorise", 401);
    if (err.message === "FORBIDDEN") return apiError("Acces interdit", 403);
    console.error("Upsert tarification error:", err);
    return apiError("Erreur interne du serveur", 500);
  }
}
