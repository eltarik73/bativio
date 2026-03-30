import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError } from "@/lib/api-response";
import { requireAdmin } from "@/lib/auth-server";

const planSchema = z.object({
  plan: z.enum(["GRATUIT", "STARTER", "PRO", "BUSINESS", "ESSENTIEL", "PRO_PLUS"]),
});

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;

    const body = await request.json();
    const parsed = planSchema.safeParse(body);
    if (!parsed.success) {
      return apiError("Plan invalide. Valeurs acceptées : GRATUIT, STARTER, PRO, BUSINESS", 400);
    }

    const { plan } = parsed.data;

    const artisan = await prisma.artisan.findUnique({ where: { id } });
    if (!artisan || artisan.deletedAt) {
      return apiError("Artisan introuvable", 404);
    }

    const updatedArtisan = await prisma.artisan.update({
      where: { id },
      data: { plan },
      include: {
        user: { select: { email: true } },
        metier: true,
      },
    });

    return apiSuccess(updatedArtisan);
  } catch (error: unknown) {
    const err = error as Error;
    if (err.message === "UNAUTHORIZED") return apiError("Non autorisé", 401);
    if (err.message === "FORBIDDEN") return apiError("Accès interdit", 403);
    console.error("Admin update plan error:", err);
    return apiError("Erreur interne du serveur", 500);
  }
}
