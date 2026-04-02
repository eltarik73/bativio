import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError } from "@/lib/api-response";
import { requireAdmin } from "@/lib/auth-server";
import { sendEmail } from "@/lib/email";

const rejectSchema = z.object({
  motif: z.string().min(10, "Le motif doit contenir au moins 10 caracteres"),
});

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ artisanId: string }> }
) {
  try {
    const session = await requireAdmin();
    const { artisanId } = await params;

    const body = await request.json();
    const parsed = rejectSchema.safeParse(body);
    if (!parsed.success) {
      return apiError(
        parsed.error.issues[0]?.message || "Motif invalide",
        400
      );
    }

    const { motif } = parsed.data;

    const artisan = await prisma.artisan.findUnique({
      where: { id: artisanId },
      include: { user: { select: { email: true } } },
    });

    if (!artisan || artisan.deletedAt) {
      return apiError("Artisan introuvable", 404);
    }

    if (artisan.artisanStatus !== "PENDING_REVIEW") {
      return apiError(
        "Cet artisan n'est pas en attente de validation",
        409
      );
    }

    const updatedArtisan = await prisma.artisan.update({
      where: { id: artisanId },
      data: {
        artisanStatus: "REJECTED",
        motifRefus: motif,
        validationDate: new Date(),
        validatedBy: session.userId,
      },
      include: {
        user: { select: { email: true } },
        metier: { select: { nom: true } },
      },
    });

    // Send rejection email (fire & forget)
    sendEmail(
      updatedArtisan.user.email,
      "Bativio — Votre inscription necessite des informations complementaires",
      `
        <h1>Bonjour ${updatedArtisan.nomAffichage},</h1>
        <p>Nous avons examine votre demande d'inscription sur Bativio.</p>
        <p>Malheureusement, nous ne pouvons pas valider votre profil pour le moment.</p>
        <p><strong>Motif :</strong></p>
        <blockquote style="border-left:3px solid #C4531A;padding-left:12px;margin:16px 0;color:#555;">${motif}</blockquote>
        <p>Vous pouvez completer votre profil et soumettre une nouvelle demande a tout moment.</p>
        <p><a href="${process.env.NEXT_PUBLIC_APP_URL || "https://bativio.fr"}/dashboard" style="display:inline-block;padding:12px 24px;background:#C4531A;color:#fff;text-decoration:none;border-radius:8px;">Completer mon profil</a></p>
        <p>L'equipe Bativio</p>
      `
    ).catch(() => {});

    return apiSuccess({ success: true, artisan: updatedArtisan });
  } catch (error: unknown) {
    const err = error as Error;
    if (err.message === "UNAUTHORIZED") return apiError("Non autorise", 401);
    if (err.message === "FORBIDDEN") return apiError("Acces interdit", 403);
    console.error("Admin reject error:", err);
    return apiError("Erreur interne du serveur", 500);
  }
}
