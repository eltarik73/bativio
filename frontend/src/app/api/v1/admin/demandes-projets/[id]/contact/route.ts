import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError } from "@/lib/api-response";
import { requireAdmin } from "@/lib/auth-server";

const bodySchema = z.object({
  canal: z.enum(["email", "tel", "sms", "plateforme"]),
  note: z.string().max(2000).optional().nullable(),
  result: z.enum(["joint", "non_joint", "rappel_prevu", "message_laisse"]).optional(),
});

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await requireAdmin();
    const { id } = await params;

    const body = await request.json();
    const parsed = bodySchema.safeParse(body);
    if (!parsed.success) return apiError("Paramètres invalides", 400);

    const demande = await prisma.demandeProjet.findUnique({ where: { id } });
    if (!demande) return apiError("Demande introuvable", 404);

    await prisma.demandeContact.create({
      data: {
        demandeId: id,
        userId: session.userId,
        type: "webmaster_to_client",
        canal: parsed.data.canal,
        note: parsed.data.note ?? null,
        result: parsed.data.result ?? null,
      },
    });

    if (parsed.data.result === "joint") {
      await prisma.demandeProjet.update({
        where: { id },
        data: {
          webmasterJoignableA: new Date(),
          webmasterContactType: parsed.data.canal,
          webmasterContactResult: parsed.data.result,
        },
      });
    } else if (parsed.data.result) {
      await prisma.demandeProjet.update({
        where: { id },
        data: {
          webmasterContactType: parsed.data.canal,
          webmasterContactResult: parsed.data.result,
        },
      });
    }

    return apiSuccess({ ok: true });
  } catch (error: unknown) {
    const err = error as Error;
    if (err.message === "UNAUTHORIZED") return apiError("Non autorise", 401);
    if (err.message === "FORBIDDEN") return apiError("Acces admin requis", 403);
    console.error("Contact error:", err);
    return apiError("Erreur serveur", 500);
  }
}
