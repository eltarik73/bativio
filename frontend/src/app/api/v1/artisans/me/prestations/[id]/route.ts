import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError } from "@/lib/api-response";
import { requireAuth } from "@/lib/auth-server";

const updatePrestationSchema = z.object({
  designation: z.string().min(1).optional(),
  unite: z.string().min(1).optional(),
  prixUnitaire: z.number().min(0).optional(),
  categorie: z.string().optional(),
  inclutFourniture: z.boolean().optional(),
});

export async function PUT(
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

    const prestation = await prisma.prestationType.findUnique({ where: { id } });

    if (!prestation || prestation.artisanId !== artisan.id) {
      return apiError("Prestation introuvable", 404);
    }

    const body = await request.json();
    const parsed = updatePrestationSchema.safeParse(body);
    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message || "Donnees invalides";
      return apiError(firstError, 400);
    }

    const updatedPrestation = await prisma.prestationType.update({
      where: { id },
      data: parsed.data,
    });

    return apiSuccess(updatedPrestation);
  } catch (error: unknown) {
    const err = error as Error;
    if (err.message === "UNAUTHORIZED") return apiError("Non autorise", 401);
    if (err.message === "FORBIDDEN") return apiError("Acces interdit", 403);
    console.error("Update prestation error:", err);
    return apiError("Erreur interne du serveur", 500);
  }
}

export async function DELETE(
  _request: NextRequest,
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

    const prestation = await prisma.prestationType.findUnique({ where: { id } });

    if (!prestation || prestation.artisanId !== artisan.id) {
      return apiError("Prestation introuvable", 404);
    }

    await prisma.prestationType.delete({ where: { id } });

    return apiSuccess({ deleted: true });
  } catch (error: unknown) {
    const err = error as Error;
    if (err.message === "UNAUTHORIZED") return apiError("Non autorise", 401);
    if (err.message === "FORBIDDEN") return apiError("Acces interdit", 403);
    console.error("Delete prestation error:", err);
    return apiError("Erreur interne du serveur", 500);
  }
}
