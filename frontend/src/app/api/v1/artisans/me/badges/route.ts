import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError } from "@/lib/api-response";
import { requireAuth } from "@/lib/auth-server";

const BADGE_LIMITS: Record<string, number> = {
  GRATUIT: 2,
  ESSENTIEL: Infinity,
  PRO: Infinity,
  PRO_PLUS: Infinity,
};

const badgeSchema = z.object({
  nom: z.string().min(1, "Le nom du badge est requis"),
  icone: z.string().optional(),
  couleur: z.string().optional(),
  badgeSystemeId: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth();

    const artisan = await prisma.artisan.findUnique({
      where: { userId: session.userId },
      include: { _count: { select: { badges: true } } },
    });

    if (!artisan || artisan.deletedAt) {
      return apiError("Artisan introuvable", 404);
    }

    // Check plan badge limits
    const limit = BADGE_LIMITS[artisan.plan] ?? 2;
    if (artisan._count.badges >= limit) {
      return apiError(
        `Limite de badges atteinte pour votre plan (${limit} max). Passez à un plan supérieur pour en ajouter davantage.`,
        403
      );
    }

    const body = await request.json();
    const parsed = badgeSchema.safeParse(body);
    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message || "Données invalides";
      return apiError(firstError, 400);
    }

    const { nom, icone, couleur, badgeSystemeId } = parsed.data;

    const badge = await prisma.badge.create({
      data: {
        artisanId: artisan.id,
        nom,
        icone: icone || null,
        couleur: couleur || null,
        type: badgeSystemeId ? "SYSTEME" : "CUSTOM",
      },
    });

    return apiSuccess(badge, 201);
  } catch (error: unknown) {
    const err = error as Error;
    if (err.message === "UNAUTHORIZED") return apiError("Non autorisé", 401);
    if (err.message === "FORBIDDEN") return apiError("Accès interdit", 403);
    console.error("Create badge error:", err);
    return apiError("Erreur interne du serveur", 500);
  }
}
