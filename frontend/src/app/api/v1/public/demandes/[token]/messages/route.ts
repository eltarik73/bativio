import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError } from "@/lib/api-response";
import { z } from "zod";
import { sendClientReplyToArtisan } from "@/lib/devis-emails";

const messageSchema = z.object({
  contenu: z.string().min(1, "Le message ne peut pas être vide").max(2000, "Le message ne peut pas dépasser 2000 caractères"),
});

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

    // Rate limit: max 20 messages per token per hour
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const recentMessages = await prisma.messageDevis.count({
      where: {
        demandeId: demande.id,
        auteur: "client",
        createdAt: { gte: oneHourAgo },
      },
    });

    if (recentMessages >= 20) {
      return apiError(
        "Trop de messages envoyés. Veuillez réessayer dans une heure.",
        429
      );
    }

    const body = await request.json();
    const parsed = messageSchema.safeParse(body);
    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message || "Données invalides";
      return apiError(firstError, 400);
    }

    const { contenu } = parsed.data;

    // Sanitize HTML to prevent XSS
    const sanitizedContenu = contenu.replace(/</g, "&lt;").replace(/>/g, "&gt;");

    const message = await prisma.messageDevis.create({
      data: {
        demandeId: demande.id,
        auteur: "client",
        contenu: sanitizedContenu,
      },
    });

    // Notify artisan by email
    const artisan = await prisma.artisan.findUnique({
      where: { id: demande.artisanId },
      include: { user: { select: { email: true } } },
    });
    if (artisan?.user?.email) {
      sendClientReplyToArtisan({
        artisanEmail: artisan.user.email,
        artisanNom: artisan.nomAffichage,
        clientNom: demande.nomClient,
        messageExtrait: sanitizedContenu.substring(0, 100),
        demandeId: demande.id,
      }).catch((e) => console.error("Email artisan reply error:", e));
    }

    return apiSuccess(message, 201);
  } catch (error) {
    console.error("POST /api/v1/public/demandes/[token]/messages error:", error);
    return apiError("Erreur interne du serveur", 500);
  }
}
