import { NextRequest } from "next/server";
import { z } from "zod";
import { Prisma, Plan } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError } from "@/lib/api-response";
import { requireAdmin } from "@/lib/auth-server";

const bodySchema = z.object({
  mode: z.enum(["MANUAL", "AUTO_CONCERNES", "AUTO_TOUS", "AUTO_PRO", "AUTO_BUSINESS"]),
  artisanIds: z.array(z.string()).optional(),
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

    let targetIds: string[] = [];

    if (parsed.data.mode === "MANUAL") {
      if (!parsed.data.artisanIds || parsed.data.artisanIds.length === 0) {
        return apiError("Sélection vide", 400);
      }
      targetIds = parsed.data.artisanIds;
    } else {
      const where: Prisma.ArtisanWhereInput = {
        deletedAt: null,
        actif: true,
        visible: true,
      };

      if (parsed.data.mode === "AUTO_CONCERNES" || parsed.data.mode === "AUTO_PRO" || parsed.data.mode === "AUTO_BUSINESS") {
        if (demande.metierDetecte) where.metier = { slug: demande.metierDetecte };
        if (demande.villeSlug) where.villeSlug = demande.villeSlug;
      }

      if (parsed.data.mode === "AUTO_PRO") where.plan = { in: [Plan.PRO, Plan.PRO_PLUS, Plan.BUSINESS] };
      if (parsed.data.mode === "AUTO_BUSINESS") where.plan = { in: [Plan.BUSINESS] };

      const artisans = await prisma.artisan.findMany({
        where,
        select: { id: true },
        take: 20,
      });
      targetIds = artisans.map((a) => a.id);
    }

    if (targetIds.length === 0) {
      return apiError("Aucun artisan cible trouvé", 400);
    }

    // Crée les envois en masse (upsert pour éviter doublons si déjà routé)
    const envois = await Promise.all(
      targetIds.map((artisanId) =>
        prisma.demandeEnvoi.upsert({
          where: { demandeId_artisanId: { demandeId: id, artisanId } },
          update: { sentAt: new Date() },
          create: { demandeId: id, artisanId },
        })
      )
    );

    // Met à jour statut et meta
    const updated = await prisma.demandeProjet.update({
      where: { id },
      data: {
        statut: "ROUTEE",
        modeRoutage: parsed.data.mode === "MANUAL" ? "MANUEL" : parsed.data.mode,
        routageBy: session.userId,
        routageAt: new Date(),
      },
    });

    return apiSuccess({
      demande: updated,
      envoyesA: envois.length,
      artisanIds: targetIds,
    });
  } catch (error: unknown) {
    const err = error as Error;
    if (err.message === "UNAUTHORIZED") return apiError("Non autorise", 401);
    if (err.message === "FORBIDDEN") return apiError("Acces admin requis", 403);
    console.error("Route demande error:", err);
    return apiError("Erreur serveur", 500);
  }
}
