import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError } from "@/lib/api-response";
import { requireAuth } from "@/lib/auth-server";
import { z } from "zod";

const photoSchema = z.object({
  url: z
    .string()
    .url("L'URL de la photo est invalide")
    .max(2048, "L'URL est trop longue"),
});

// ---------------------------------------------------------------------------
// POST /api/v1/artisan/demandes/[id]/photos
// Upload a photo reference for a demande de devis (artisan, auth required)
// ---------------------------------------------------------------------------
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAuth();
    const { id } = await params;

    // Verify artisan exists
    const artisan = await prisma.artisan.findUnique({
      where: { userId: session.userId },
    });

    if (!artisan || artisan.deletedAt) {
      return apiError("Artisan introuvable", 404);
    }

    // Verify ownership of the demande
    const demande = await prisma.demandeDevis.findUnique({
      where: { id },
    });

    if (!demande || demande.artisanId !== artisan.id) {
      return apiError("Demande de devis introuvable", 404);
    }

    // Parse and validate body
    const body = await request.json();
    const parsed = photoSchema.safeParse(body);
    if (!parsed.success) {
      const firstError =
        parsed.error.issues[0]?.message || "Données invalides";
      return apiError(firstError, 400);
    }

    const { url } = parsed.data;

    // Create the DevisPhoto record with auteur="artisan"
    const photo = await prisma.devisPhoto.create({
      data: {
        demandeId: demande.id,
        url,
        auteur: "artisan",
      },
    });

    return apiSuccess(photo, 201);
  } catch (error: unknown) {
    const err = error as Error;
    if (err.message === "UNAUTHORIZED") return apiError("Non autorisé", 401);
    if (err.message === "FORBIDDEN") return apiError("Accès interdit", 403);
    console.error(
      "POST /api/v1/artisan/demandes/[id]/photos error:",
      err
    );
    return apiError("Erreur interne du serveur", 500);
  }
}
