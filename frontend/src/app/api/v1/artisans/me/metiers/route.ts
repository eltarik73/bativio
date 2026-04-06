import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError, handleAuthError } from "@/lib/api-response";
import { requireAuth } from "@/lib/auth-server";
import { getEffectivePlan, getPlanLimits } from "@/lib/plan-gates";

const addMetierSchema = z.object({
  metierId: z.string().min(1, "metierId requis"),
});

export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth();

    const artisan = await prisma.artisan.findUnique({
      where: { userId: session.userId },
      include: { artisanMetiers: true },
    });

    if (!artisan || artisan.deletedAt) {
      return apiError("Artisan introuvable", 404);
    }

    const body = await request.json();
    const parsed = addMetierSchema.safeParse(body);
    if (!parsed.success) {
      return apiError(parsed.error.issues[0]?.message || "Données invalides", 400);
    }

    const { metierId } = parsed.data;

    // Check plan limit
    const effectivePlan = getEffectivePlan(artisan);
    const limits = getPlanLimits(effectivePlan);
    if (artisan.artisanMetiers.length >= limits.maxMetiers) {
      return apiError(`Votre formule permet ${limits.maxMetiers} métier${limits.maxMetiers > 1 ? "s" : ""} maximum`, 403);
    }

    // Check metier exists
    const metier = await prisma.metier.findUnique({ where: { id: metierId } });
    if (!metier) {
      return apiError("Métier introuvable", 404);
    }

    // Check not already linked
    const existing = await prisma.artisanMetier.findUnique({
      where: { artisanId_metierId: { artisanId: artisan.id, metierId } },
    });
    if (existing) {
      return apiError("Ce métier est déjà ajouté", 409);
    }

    const am = await prisma.artisanMetier.create({
      data: {
        artisanId: artisan.id,
        metierId,
        principal: false,
      },
      include: { metier: true },
    });

    return apiSuccess({ id: am.metier.id, nom: am.metier.nom, icone: am.metier.icone, principal: am.principal }, 201);
  } catch (e) {
    const authErr = handleAuthError(e);
    if (authErr) return authErr;
    console.error("POST metiers error:", e);
    return apiError("Erreur interne du serveur", 500);
  }
}
