import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError } from "@/lib/api-response";
import { requireAuth } from "@/lib/auth-server";

const serviceSchema = z.object({
  titre: z.string().min(1, "Le titre du service est requis"),
  description: z.string().optional(),
  prixIndicatif: z.string().optional(),
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
    const parsed = serviceSchema.safeParse(body);
    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message || "Données invalides";
      return apiError(firstError, 400);
    }

    const { titre, description, prixIndicatif } = parsed.data;

    // Get next order value
    const lastService = await prisma.serviceArtisan.findFirst({
      where: { artisanId: artisan.id },
      orderBy: { ordre: "desc" },
    });
    const nextOrdre = (lastService?.ordre ?? -1) + 1;

    const service = await prisma.serviceArtisan.create({
      data: {
        artisanId: artisan.id,
        titre,
        description: description || null,
        prixIndicatif: prixIndicatif || null,
        ordre: nextOrdre,
      },
    });

    return apiSuccess(service, 201);
  } catch (error: unknown) {
    const err = error as Error;
    if (err.message === "UNAUTHORIZED") return apiError("Non autorisé", 401);
    if (err.message === "FORBIDDEN") return apiError("Accès interdit", 403);
    console.error("Create service error:", err);
    return apiError("Erreur interne du serveur", 500);
  }
}
