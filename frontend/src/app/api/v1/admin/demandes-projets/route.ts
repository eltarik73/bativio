import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError } from "@/lib/api-response";
import { requireAdmin } from "@/lib/auth-server";

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();

    const sp = request.nextUrl.searchParams;
    const statut = sp.get("statut");
    const metier = sp.get("metier");
    const page = parseInt(sp.get("page") || "0", 10);
    const size = Math.min(parseInt(sp.get("size") || "30", 10), 100);

    const where: {
      statut?: "NOUVELLE" | "EN_ATTENTE" | "ROUTEE" | "DEVIS_ENVOYE" | "CLOTUREE";
      metierDetecte?: string;
    } = {};
    if (statut) where.statut = statut as typeof where.statut;
    if (metier) where.metierDetecte = metier;

    const [items, total, stats] = await Promise.all([
      prisma.demandeProjet.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: page * size,
        take: size,
        include: {
          envois: {
            include: {
              artisan: { select: { id: true, nomAffichage: true, ville: true } },
            },
          },
          _count: { select: { envois: true, devis: true } },
        },
      }),
      prisma.demandeProjet.count({ where }),
      prisma.demandeProjet.groupBy({
        by: ["statut"],
        _count: true,
      }),
    ]);

    return apiSuccess({
      items,
      total,
      page,
      size,
      stats: Object.fromEntries(stats.map((s) => [s.statut, s._count])),
    });
  } catch (error: unknown) {
    const err = error as Error;
    if (err.message === "UNAUTHORIZED") return apiError("Non autorise", 401);
    if (err.message === "FORBIDDEN") return apiError("Acces admin requis", 403);
    console.error("List demandes-projets error:", err);
    return apiError("Erreur serveur", 500);
  }
}
