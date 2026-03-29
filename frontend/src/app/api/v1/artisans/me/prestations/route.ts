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

    const prestations = await prisma.prestationType.findMany({
      where: { artisanId: artisan.id },
      orderBy: { createdAt: "desc" },
    });

    return apiSuccess(prestations);
  } catch (error: unknown) {
    const err = error as Error;
    if (err.message === "UNAUTHORIZED") return apiError("Non autorise", 401);
    if (err.message === "FORBIDDEN") return apiError("Acces interdit", 403);
    console.error("Get prestations error:", err);
    return apiError("Erreur interne du serveur", 500);
  }
}

const prestationSchema = z.object({
  designation: z.string().min(1, "La designation est requise"),
  unite: z.string().min(1, "L'unite est requise"),
  prixUnitaire: z.number().min(0, "Le prix unitaire doit etre positif"),
  categorie: z.string().optional(),
  inclutFourniture: z.boolean().default(true),
});

export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth();

    const artisan = await prisma.artisan.findUnique({
      where: { userId: session.userId },
    });

    if (!artisan || artisan.deletedAt) {
      return apiError("Artisan introuvable", 404);
    }

    const body = await request.json();
    const parsed = prestationSchema.safeParse(body);
    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message || "Donnees invalides";
      return apiError(firstError, 400);
    }

    const prestation = await prisma.prestationType.create({
      data: {
        artisanId: artisan.id,
        designation: parsed.data.designation,
        unite: parsed.data.unite,
        prixUnitaire: parsed.data.prixUnitaire,
        categorie: parsed.data.categorie || null,
        inclutFourniture: parsed.data.inclutFourniture,
        isCustom: true,
      },
    });

    return apiSuccess(prestation, 201);
  } catch (error: unknown) {
    const err = error as Error;
    if (err.message === "UNAUTHORIZED") return apiError("Non autorise", 401);
    if (err.message === "FORBIDDEN") return apiError("Acces interdit", 403);
    console.error("Create prestation error:", err);
    return apiError("Erreur interne du serveur", 500);
  }
}
