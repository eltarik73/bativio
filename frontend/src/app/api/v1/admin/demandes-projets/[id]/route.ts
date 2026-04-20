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
          select: { id: true, numero: true, statut: true, totalTTC: true, createdAt: true, artisanId: true, envoyeAt: true, accepteAt: true },
        },
      },
    });

    if (!demande) return apiError("Demande introuvable", 404);

    // Charge tous les artisans actifs visibles, avec un champ "recommandé"
    const alreadySent = new Set(demande.envois.map((e) => e.artisanId));

    const allArtisans = await prisma.artisan.findMany({
      where: {
        deletedAt: null,
        actif: true,
        visible: true,
      },
      select: {
        id: true, nomAffichage: true, slug: true, ville: true, villeSlug: true, telephone: true, plan: true,
        noteMoyenne: true, nombreAvis: true,
        metier: { select: { nom: true, slug: true } },
        artisanMetiers: { select: { metier: { select: { nom: true, slug: true } } } },
      },
      orderBy: [
        { plan: "desc" },
        { noteMoyenne: "desc" },
      ],
      take: 200,
    });

    // Score de pertinence pour tri
    const demandeMetier = demande.metierDetecte?.toLowerCase();
    const demandeVille = demande.villeSlug;
    const artisansWithScore = allArtisans.map((a) => {
      const metierSlugs = [a.metier?.slug, ...a.artisanMetiers.map((am) => am.metier?.slug)].filter(Boolean);
      const metierMatch = demandeMetier && metierSlugs.some((s) => s?.toLowerCase() === demandeMetier);
      const villeMatch = demandeVille && a.villeSlug === demandeVille;
      const alreadyContacted = alreadySent.has(a.id);
      let score = 0;
      if (metierMatch) score += 50;
      if (villeMatch) score += 30;
      if (a.plan === "BUSINESS") score += 15;
      else if (a.plan === "PRO" || a.plan === "PRO_PLUS") score += 10;
      if ((a.noteMoyenne || 0) >= 4.5) score += 10;
      else if ((a.noteMoyenne || 0) >= 4.0) score += 5;
      return {
        ...a,
        _score: score,
        _recommended: metierMatch && villeMatch,
        _alreadyContacted: alreadyContacted,
      };
    });

    // Tri : recommandés d'abord, puis par score
    artisansWithScore.sort((a, b) => {
      if (a._recommended !== b._recommended) return a._recommended ? -1 : 1;
      return b._score - a._score;
    });

    // Compteurs devis
    const devisStats = {
      total: demande.devis.length,
      envoyes: demande.devis.filter((d) => d.envoyeAt).length,
      acceptes: demande.devis.filter((d) => d.accepteAt).length,
      enBrouillon: demande.devis.filter((d) => !d.envoyeAt).length,
    };

    return apiSuccess({
      demande,
      artisans: artisansWithScore,
      devisStats,
      // Legacy (pour compat UI existante)
      suggestions: artisansWithScore.filter((a) => a._recommended && !a._alreadyContacted).slice(0, 12),
    });
  } catch (error: unknown) {
    const err = error as Error;
    if (err.message === "UNAUTHORIZED") return apiError("Non autorise", 401);
    if (err.message === "FORBIDDEN") return apiError("Acces admin requis", 403);
    console.error("Get demande error:", err);
    return apiError("Erreur serveur", 500);
  }
}
