import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError } from "@/lib/api-response";
import { z } from "zod";

const MAX_PHOTOS_PER_DEMANDE = 5;

const photoSchema = z.object({
  url: z
    .string()
    .url("L'URL de la photo est invalide")
    .max(2048, "L'URL est trop longue"),
  auteur: z
    .enum(["client", "artisan"])
    .optional()
    .default("client"),
});

// ---------------------------------------------------------------------------
// POST /api/v1/public/demandes/[token]/photos
// Upload a photo reference for a demande de devis (public, by token)
// ---------------------------------------------------------------------------
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;

    // Find the demande by responseToken
    const demande = await prisma.demandeDevis.findFirst({
      where: { responseToken: token },
    });

    if (!demande) {
      return apiError("Demande de devis introuvable", 404);
    }

    if (demande.expiresAt && demande.expiresAt < new Date()) {
      return apiError("Cette demande a expiré", 410);
    }

    // Check photo limit
    const existingCount = await prisma.devisPhoto.count({
      where: { demandeId: demande.id },
    });

    if (existingCount >= MAX_PHOTOS_PER_DEMANDE) {
      return apiError(
        `Limite de ${MAX_PHOTOS_PER_DEMANDE} photos atteinte pour cette demande.`,
        400
      );
    }

    // Parse and validate body
    const body = await request.json();
    const parsed = photoSchema.safeParse(body);
    if (!parsed.success) {
      const firstError =
        parsed.error.issues[0]?.message || "Données invalides";
      return apiError(firstError, 400);
    }

    const { url, auteur } = parsed.data;

    // Create the DevisPhoto record
    const photo = await prisma.devisPhoto.create({
      data: {
        demandeId: demande.id,
        url,
        auteur,
      },
    });

    return apiSuccess(photo, 201);
  } catch (error) {
    console.error(
      "POST /api/v1/public/demandes/[token]/photos error:",
      error
    );
    return apiError("Erreur interne du serveur", 500);
  }
}
