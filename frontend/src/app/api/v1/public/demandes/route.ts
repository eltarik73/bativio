import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError } from "@/lib/api-response";
import { z } from "zod";
import crypto from "crypto";
import { sendNewDemandeToArtisan, sendDemandeConfirmationToClient } from "@/lib/devis-emails";

const demandeSchema = z.object({
  artisanId: z.string().min(1, "L'identifiant artisan est requis"),
  metierId: z.string().optional(),
  clientNom: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  clientEmail: z.string().email("Format d'email invalide"),
  clientTel: z.string().regex(/^\d{10}$/, "Le téléphone doit contenir 10 chiffres"),
  clientVille: z.string().optional(),
  descriptionBesoin: z.string().min(10, "La description doit contenir au moins 10 caractères"),
  reponses: z.any().optional(),
  urgence: z.enum(["normal", "urgent"]).default("normal"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const parsed = demandeSchema.safeParse(body);
    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message || "Données invalides";
      return apiError(firstError, 400);
    }

    const {
      artisanId,
      metierId,
      clientNom,
      clientEmail,
      clientTel,
      clientVille,
      descriptionBesoin,
      reponses,
      urgence,
    } = parsed.data;

    // Verify artisan exists
    const artisan = await prisma.artisan.findUnique({
      where: { id: artisanId },
    });

    if (!artisan || artisan.deletedAt) {
      return apiError("Artisan introuvable", 404);
    }

    // Rate limit: max 5 demandes per email per hour
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const recentCount = await prisma.demandeDevis.count({
      where: {
        emailClient: clientEmail,
        createdAt: { gte: oneHourAgo },
      },
    });

    if (recentCount >= 5) {
      return apiError(
        "Trop de demandes envoyées. Veuillez réessayer dans une heure.",
        429
      );
    }

    // Generate unique response token
    const responseToken = crypto.randomUUID();

    // Create the DemandeDevis
    const demande = await prisma.demandeDevis.create({
      data: {
        artisanId,
        metierId: metierId || null,
        nomClient: clientNom,
        telephoneClient: clientTel,
        emailClient: clientEmail,
        clientVille: clientVille || null,
        descriptionBesoin,
        reponses: reponses || undefined,
        urgence,
        responseToken,
      },
    });

    // Send emails (fire-and-forget, don't block response)
    const artisanUser = await prisma.user.findUnique({ where: { id: artisan.userId }, select: { email: true } });
    if (artisanUser?.email) {
      sendNewDemandeToArtisan({
        artisanEmail: artisanUser.email,
        artisanNom: artisan.nomAffichage,
        clientNom,
        descriptionBesoin,
        urgence,
        demandeId: demande.id,
      }).catch((e) => console.error("Email artisan error:", e));
    }
    if (clientEmail) {
      sendDemandeConfirmationToClient({
        clientEmail,
        clientNom,
        artisanNom: artisan.nomAffichage,
        responseToken,
      }).catch((e) => console.error("Email client error:", e));
    }

    return apiSuccess({ id: demande.id, responseToken }, 201);
  } catch (error) {
    console.error("POST /api/v1/public/demandes error:", error);
    return apiError("Erreur interne du serveur", 500);
  }
}
