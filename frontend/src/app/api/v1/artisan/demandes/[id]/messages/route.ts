import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError } from "@/lib/api-response";
import { requireAuth } from "@/lib/auth-server";
import { z } from "zod";

const messageSchema = z.object({
  contenu: z.string().min(1, "Le message ne peut pas être vide").max(2000, "Le message ne peut pas dépasser 2000 caractères"),
});

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAuth();
    const { id } = await params;

    const artisan = await prisma.artisan.findUnique({
      where: { userId: session.userId },
    });

    if (!artisan || artisan.deletedAt) {
      return apiError("Artisan introuvable", 404);
    }

    const demande = await prisma.demandeDevis.findUnique({
      where: { id },
    });

    if (!demande || demande.artisanId !== artisan.id) {
      return apiError("Demande de devis introuvable", 404);
    }

    const body = await request.json();
    const parsed = messageSchema.safeParse(body);
    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message || "Données invalides";
      return apiError(firstError, 400);
    }

    const { contenu } = parsed.data;

    const isFirstReply = demande.statut !== "REPONDU" && !demande.reponduAt;

    // Create message and update demande status in a transaction
    const [message] = await prisma.$transaction([
      prisma.messageDevis.create({
        data: {
          demandeId: demande.id,
          auteur: "artisan",
          contenu,
        },
      }),
      prisma.demandeDevis.update({
        where: { id },
        data: {
          statut: "REPONDU",
          ...(isFirstReply ? { reponduAt: new Date() } : {}),
        },
      }),
    ]);

    return apiSuccess(message, 201);
  } catch (error: unknown) {
    const err = error as Error;
    if (err.message === "UNAUTHORIZED") return apiError("Non autorisé", 401);
    if (err.message === "FORBIDDEN") return apiError("Accès interdit", 403);
    console.error("POST /api/v1/artisan/demandes/[id]/messages error:", err);
    return apiError("Erreur interne du serveur", 500);
  }
}
