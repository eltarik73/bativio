import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError, handleAuthError } from "@/lib/api-response";
import { requireAuth } from "@/lib/auth-server";

const updateSchema = z.object({
  nom: z.string().min(1).optional(),
  adresse: z.string().nullable().optional(),
  ville: z.string().nullable().optional(),
  clientNom: z.string().nullable().optional(),
  clientTelephone: z.string().nullable().optional(),
  couleur: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  dateDebut: z.string().optional(),
  dateFin: z.string().optional(),
  heureDebut: z.string().nullable().optional(),
  heureFin: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
  statut: z.enum(["PLANIFIE", "EN_COURS", "TERMINE", "ANNULE", "REPORTE"]).optional(),
  devisId: z.string().nullable().optional(),
  montantDevis: z.number().nullable().optional(),
});

// PUT — update a chantier
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAuth();
    const { id } = await params;

    const artisan = await prisma.artisan.findUnique({ where: { userId: session.userId } });
    if (!artisan || artisan.deletedAt) return apiError("Artisan introuvable", 404);

    const chantier = await prisma.chantier.findUnique({ where: { id } });
    if (!chantier || chantier.artisanId !== artisan.id) {
      return apiError("Chantier introuvable", 404);
    }

    const body = await request.json();
    const parsed = updateSchema.safeParse(body);
    if (!parsed.success) {
      return apiError(parsed.error.issues[0]?.message || "Donn\u00e9es invalides", 400);
    }

    const data = parsed.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData: Record<string, any> = {};

    if (data.nom !== undefined) updateData.nom = data.nom;
    if (data.adresse !== undefined) updateData.adresse = data.adresse;
    if (data.ville !== undefined) updateData.ville = data.ville;
    if (data.clientNom !== undefined) updateData.clientNom = data.clientNom;
    if (data.clientTelephone !== undefined) updateData.clientTelephone = data.clientTelephone;
    if (data.couleur !== undefined) updateData.couleur = data.couleur;
    if (data.dateDebut !== undefined) updateData.dateDebut = new Date(data.dateDebut);
    if (data.dateFin !== undefined) updateData.dateFin = new Date(data.dateFin);
    if (data.heureDebut !== undefined) updateData.heureDebut = data.heureDebut;
    if (data.heureFin !== undefined) updateData.heureFin = data.heureFin;
    if (data.notes !== undefined) updateData.notes = data.notes;
    if (data.statut !== undefined) updateData.statut = data.statut;
    if (data.devisId !== undefined) updateData.devisId = data.devisId;
    if (data.montantDevis !== undefined) updateData.montantDevis = data.montantDevis;

    const updated = await prisma.chantier.update({
      where: { id },
      data: updateData,
      include: { collaborateurs: true },
    });

    return apiSuccess(updated);
  } catch (e) {
    const authErr = handleAuthError(e);
    if (authErr) return authErr;
    console.error("PUT chantier error:", e);
    return apiError("Erreur interne du serveur", 500);
  }
}

// DELETE — delete a chantier
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAuth();
    const { id } = await params;

    const artisan = await prisma.artisan.findUnique({ where: { userId: session.userId } });
    if (!artisan || artisan.deletedAt) return apiError("Artisan introuvable", 404);

    const chantier = await prisma.chantier.findUnique({ where: { id } });
    if (!chantier || chantier.artisanId !== artisan.id) {
      return apiError("Chantier introuvable", 404);
    }

    await prisma.chantier.delete({ where: { id } });

    return apiSuccess({ deleted: id });
  } catch (e) {
    const authErr = handleAuthError(e);
    if (authErr) return authErr;
    console.error("DELETE chantier error:", e);
    return apiError("Erreur interne du serveur", 500);
  }
}
