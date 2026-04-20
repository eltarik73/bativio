import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError } from "@/lib/api-response";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  try {
    const { token } = await params;
    const devis = await prisma.devis.findUnique({
      where: { viewToken: token },
      include: {
        artisan: {
          select: {
            nomAffichage: true, slug: true, telephone: true, logo: true,
            colorPrimary: true, ville: true,
          },
        },
      },
    });
    if (!devis) return apiError("Devis introuvable", 404);

    // Marque comme vu
    if (!devis.vuAt) {
      await prisma.devis.update({ where: { id: devis.id }, data: { vuAt: new Date() } });
    }

    return apiSuccess({
      numero: devis.numero,
      objet: devis.objet,
      clientNom: devis.clientNom,
      totalHT: devis.totalHT,
      montantTVA: devis.montantTVA,
      totalTTC: devis.totalTTC,
      dureeEstimee: devis.dureeEstimee,
      conditionsPaiement: devis.conditionsPaiement,
      notes: devis.notes,
      validiteJours: devis.validiteJours,
      statut: devis.statut,
      pdfUrl: devis.pdfUrl,
      createdAt: devis.createdAt,
      envoyeAt: devis.envoyeAt,
      accepteAt: devis.accepteAt,
      refuseAt: devis.refuseAt,
      postes: devis.postes,
      artisan: devis.artisan,
    });
  } catch (error: unknown) {
    console.error("GET devis public error:", error);
    return apiError("Erreur serveur", 500);
  }
}
