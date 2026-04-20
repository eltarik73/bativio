import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError } from "@/lib/api-response";
import { requireAdmin } from "@/lib/auth-server";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id } = await params;

    const demande = await prisma.demandeProjet.findUnique({
      where: { id },
      include: {
        envois: {
          include: {
            artisan: {
              select: {
                id: true, nomAffichage: true, slug: true, ville: true, telephone: true,
                noteMoyenne: true, nombreAvis: true, plan: true,
                metier: { select: { nom: true, slug: true } },
              },
            },
          },
        },
        devis: {
          select: { id: true, numero: true, statut: true, totalTTC: true, createdAt: true, artisanId: true },
        },
      },
    });

    if (!demande) return apiError("Demande introuvable", 404);

    // Suggestions : artisans pertinents (mêmes métier + ville, non déjà envoyés)
    const alreadySent = new Set(demande.envois.map((e) => e.artisanId));
    const suggestions = await prisma.artisan.findMany({
      where: {
        deletedAt: null,
        actif: true,
        visible: true,
        NOT: { id: { in: Array.from(alreadySent) } },
        ...(demande.metierDetecte
          ? { metier: { slug: demande.metierDetecte } }
          : {}),
        ...(demande.villeSlug ? { villeSlug: demande.villeSlug } : {}),
      },
      select: {
        id: true, nomAffichage: true, slug: true, ville: true, plan: true,
        noteMoyenne: true, nombreAvis: true,
        metier: { select: { nom: true, slug: true } },
      },
      take: 12,
      orderBy: [
        { plan: "desc" },
        { noteMoyenne: "desc" },
      ],
    });

    return apiSuccess({ demande, suggestions });
  } catch (error: unknown) {
    const err = error as Error;
    if (err.message === "UNAUTHORIZED") return apiError("Non autorise", 401);
    if (err.message === "FORBIDDEN") return apiError("Acces admin requis", 403);
    console.error("Get demande error:", err);
    return apiError("Erreur serveur", 500);
  }
}
