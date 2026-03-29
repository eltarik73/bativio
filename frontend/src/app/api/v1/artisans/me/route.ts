import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError } from "@/lib/api-response";
import { requireAuth } from "@/lib/auth-server";

function calculateProfilCompletion(artisan: {
  nomAffichage: string;
  description: string | null;
  telephone: string;
  adresse: string | null;
  ville: string | null;
  metierId: string | null;
  _count?: { photos: number; badges: number; services: number };
}): number {
  let score = 0;
  const total = 10;

  if (artisan.nomAffichage) score++;
  if (artisan.telephone) score++;
  if (artisan.description && artisan.description.length > 20) score++;
  if (artisan.adresse) score++;
  if (artisan.ville) score++;
  if (artisan.metierId) score++;
  if (artisan._count) {
    if (artisan._count.photos > 0) score++;
    if (artisan._count.photos >= 3) score++;
    if (artisan._count.badges > 0) score++;
    if (artisan._count.services > 0) score++;
  }

  return Math.round((score / total) * 100);
}

export async function GET() {
  try {
    const session = await requireAuth();

    const artisan = await prisma.artisan.findUnique({
      where: { userId: session.userId },
      include: {
        user: { select: { email: true } },
        metier: true,
        photos: { orderBy: { ordre: "asc" } },
        badges: true,
        services: { orderBy: { ordre: "asc" } },
        horaires: { orderBy: { jourSemaine: "asc" } },
        zones: true,
        notifications: {
          where: { lu: false },
          orderBy: { createdAt: "desc" },
          take: 5,
        },
      },
    });

    if (!artisan || artisan.deletedAt) {
      return apiError("Artisan introuvable", 404);
    }

    return apiSuccess(artisan);
  } catch (error: unknown) {
    const err = error as Error;
    if (err.message === "UNAUTHORIZED") return apiError("Non autorisé", 401);
    if (err.message === "FORBIDDEN") return apiError("Accès interdit", 403);
    console.error("Get artisan me error:", err);
    return apiError("Erreur interne du serveur", 500);
  }
}

const updateSchema = z.object({
  nomAffichage: z.string().min(1).optional(),
  description: z.string().optional(),
  telephone: z.string().optional(),
  adresse: z.string().optional(),
  codePostal: z.string().optional(),
  ville: z.string().optional(),
  zoneRayonKm: z.number().int().min(5).max(80).optional(),
  experienceAnnees: z.number().int().min(0).optional(),
  metierId: z.string().optional(),
  templateId: z.string().optional(),
  colorPrimary: z.string().optional(),
  colorAccent: z.string().optional(),
  photoLayout: z.string().optional(),
});

export async function PUT(request: NextRequest) {
  try {
    const session = await requireAuth();

    const body = await request.json();
    const parsed = updateSchema.safeParse(body);
    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message || "Données invalides";
      return apiError(firstError, 400);
    }

    const artisan = await prisma.artisan.findUnique({
      where: { userId: session.userId },
    });

    if (!artisan || artisan.deletedAt) {
      return apiError("Artisan introuvable", 404);
    }

    // Update artisan fields
    const updatedArtisan = await prisma.artisan.update({
      where: { id: artisan.id },
      data: parsed.data,
      include: {
        user: { select: { email: true } },
        metier: true,
        photos: true,
        badges: true,
        services: true,
        _count: { select: { photos: true, badges: true, services: true } },
      },
    });

    // Recalculate profil completion
    const profilCompletion = calculateProfilCompletion(updatedArtisan);

    const finalArtisan = await prisma.artisan.update({
      where: { id: artisan.id },
      data: { profilCompletion },
      include: {
        user: { select: { email: true } },
        metier: true,
        photos: { orderBy: { ordre: "asc" } },
        badges: true,
        services: { orderBy: { ordre: "asc" } },
        horaires: { orderBy: { jourSemaine: "asc" } },
        zones: true,
      },
    });

    return apiSuccess(finalArtisan);
  } catch (error: unknown) {
    const err = error as Error;
    if (err.message === "UNAUTHORIZED") return apiError("Non autorisé", 401);
    if (err.message === "FORBIDDEN") return apiError("Accès interdit", 403);
    console.error("Update artisan me error:", err);
    return apiError("Erreur interne du serveur", 500);
  }
}
