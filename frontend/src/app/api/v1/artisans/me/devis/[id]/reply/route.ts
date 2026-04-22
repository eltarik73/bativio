import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError } from "@/lib/api-response";
import { requireAuth } from "@/lib/auth-server";
import { sendEmail } from "@/lib/email";
import { escapeHtml } from "@/lib/html-escape";
import crypto from "crypto";

const replySchema = z.object({
  message: z.string().min(1, "Le message est requis"),
  type: z.enum(["MESSAGE", "QUOTE_UPLOAD", "QUOTE_INVOQUO"]).optional(),
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

    const devis = await prisma.demandeDevis.findUnique({ where: { id } });

    if (!devis || devis.artisanId !== artisan.id) {
      return apiError("Demande de devis introuvable", 404);
    }

    const body = await request.json();
    const parsed = replySchema.safeParse(body);
    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message || "Données invalides";
      return apiError(firstError, 400);
    }

    const { message, type } = parsed.data;

    // Generate responseToken if null
    const responseToken = devis.responseToken || crypto.randomUUID();

    // Create reply and update devis in a transaction
    const [reply] = await prisma.$transaction([
      prisma.devisReply.create({
        data: {
          demandeDevisId: devis.id,
          artisanId: artisan.id,
          message,
          type: type || "MESSAGE",
        },
      }),
      prisma.demandeDevis.update({
        where: { id },
        data: {
          statut: "REPONDU",
          reponduAt: new Date(),
          responseToken,
        },
      }),
    ]);

    // Send email to client (escape user-controlled content)
    if (devis.emailClient) {
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.bativio.fr";
      const safeArtisanNom = escapeHtml(artisan.nomAffichage);
      const safeMessage = escapeHtml(message).replace(/\n/g, "<br>");
      await sendEmail(
          devis.emailClient,
          `${artisan.nomAffichage} a répondu à votre demande de devis`,
          `
            <h2>Réponse de ${safeArtisanNom}</h2>
            <p>${safeMessage}</p>
            <hr>
            <p>
              <a href="${baseUrl}/devis/${devis.id}/response?token=${responseToken}&action=accept" style="display:inline-block;padding:12px 24px;background:#C4531A;color:#fff;text-decoration:none;border-radius:8px;margin-right:12px;">Accepter</a>
              <a href="${baseUrl}/devis/${devis.id}/response?token=${responseToken}&action=refuse" style="display:inline-block;padding:12px 24px;background:#1C1C1E;color:#fff;text-decoration:none;border-radius:8px;">Refuser</a>
            </p>
          `,
        );
    }

    return apiSuccess(reply, 201);
  } catch (error: unknown) {
    const err = error as Error;
    if (err.message === "UNAUTHORIZED") return apiError("Non autorisé", 401);
    if (err.message === "FORBIDDEN") return apiError("Accès interdit", 403);
    console.error("Reply to devis error:", err);
    return apiError("Erreur interne du serveur", 500);
  }
}
