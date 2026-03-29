import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError } from "@/lib/api-response";
import { requireAuth } from "@/lib/auth-server";

export async function GET(
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

    const devis = await prisma.devis.findUnique({ where: { id } });

    if (!devis || devis.artisanId !== artisan.id) {
      return apiError("Devis introuvable", 404);
    }

    return apiSuccess(devis);
  } catch (error: unknown) {
    const err = error as Error;
    if (err.message === "UNAUTHORIZED") return apiError("Non autorise", 401);
    if (err.message === "FORBIDDEN") return apiError("Acces interdit", 403);
    console.error("Get devis IA detail error:", err);
    return apiError("Erreur interne du serveur", 500);
  }
}

const posteSchema = z.object({
  categorie: z.string().optional(),
  designation: z.string(),
  quantite: z.number().min(0),
  unite: z.string(),
  prixUnitaireHT: z.number().min(0),
  totalHT: z.number().min(0),
  inclutFourniture: z.boolean().optional(),
});

const updateDevisSchema = z.object({
  clientNom: z.string().min(2).optional(),
  clientEmail: z.string().email().optional(),
  clientTelephone: z.string().optional(),
  clientAdresse: z.string().optional(),
  objet: z.string().optional(),
  postes: z.array(posteSchema).optional(),
  dureeEstimee: z.string().optional(),
  notes: z.string().optional(),
  conditionsPaiement: z.string().optional(),
  validiteJours: z.number().int().min(1).optional(),
  mentionSousReserve: z.boolean().optional(),
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
      include: { tarification: true },
    });

    if (!artisan || artisan.deletedAt) {
      return apiError("Artisan introuvable", 404);
    }

    const devis = await prisma.devis.findUnique({ where: { id } });

    if (!devis || devis.artisanId !== artisan.id) {
      return apiError("Devis introuvable", 404);
    }

    const body = await request.json();
    const parsed = updateDevisSchema.safeParse(body);
    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message || "Donnees invalides";
      return apiError(firstError, 400);
    }

    const updateData: Record<string, unknown> = { ...parsed.data };

    // Recalculate totals if postes changed
    if (parsed.data.postes) {
      const totalHT = parsed.data.postes.reduce((sum, p) => sum + p.totalHT, 0);
      const tauxTVA = artisan.tarification?.tvaDefault ?? devis.tauxTVA;
      const montantTVA = Math.round(totalHT * (tauxTVA / 100) * 100) / 100;
      const totalTTC = Math.round((totalHT + montantTVA) * 100) / 100;

      updateData.totalHT = Math.round(totalHT * 100) / 100;
      updateData.tauxTVA = tauxTVA;
      updateData.montantTVA = montantTVA;
      updateData.totalTTC = totalTTC;
    }

    const updatedDevis = await prisma.devis.update({
      where: { id },
      data: updateData,
    });

    return apiSuccess(updatedDevis);
  } catch (error: unknown) {
    const err = error as Error;
    if (err.message === "UNAUTHORIZED") return apiError("Non autorise", 401);
    if (err.message === "FORBIDDEN") return apiError("Acces interdit", 403);
    console.error("Update devis IA error:", err);
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

    const devis = await prisma.devis.findUnique({ where: { id } });

    if (!devis || devis.artisanId !== artisan.id) {
      return apiError("Devis introuvable", 404);
    }

    await prisma.devis.delete({ where: { id } });

    return apiSuccess({ deleted: true });
  } catch (error: unknown) {
    const err = error as Error;
    if (err.message === "UNAUTHORIZED") return apiError("Non autorise", 401);
    if (err.message === "FORBIDDEN") return apiError("Acces interdit", 403);
    console.error("Delete devis IA error:", err);
    return apiError("Erreur interne du serveur", 500);
  }
}
