import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError } from "@/lib/api-response";
import { requireAdmin } from "@/lib/auth-server";

// Plan pricing (€/mois) — keep in sync with PLANS in lib/constants.ts
const PLAN_PRICE: Record<string, number> = {
  GRATUIT: 0,
  STARTER: 19,
  ESSENTIEL: 19, // legacy
  PRO: 39,
  BUSINESS: 59,
  PRO_PLUS: 59, // legacy
};

const VILLES_PRINCIPALES = ["chambery", "annecy", "grenoble", "lyon", "valence"];

export async function GET() {
  try {
    await requireAdmin();

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);

    // All counts done in parallel against the same DB connection.
    const [
      totalArtisansActif,
      totalArtisansAll,
      inscriptionsThisMonth,
      inscriptionsLastMonth,
      totalDevisThisMonth,
      totalDevisLastMonth,
      artisansEnAttente,
      plansBreakdownActif,
      villesBreakdownActif,
      activeArtisansForRevenue,
    ] = await Promise.all([
      // Artisans réellement visibles dans l'annuaire
      prisma.artisan.count({ where: { actif: true, deletedAt: null } }),
      // Artisans non-supprimés (incluant onboarding/rejected) — utilisé par /admin/artisans
      prisma.artisan.count({ where: { deletedAt: null } }),
      // Inscriptions du mois courant (Artisan.createdAt, pas User)
      prisma.artisan.count({
        where: { deletedAt: null, createdAt: { gte: startOfMonth } },
      }),
      prisma.artisan.count({
        where: {
          deletedAt: null,
          createdAt: { gte: startOfLastMonth, lte: endOfLastMonth },
        },
      }),
      prisma.demandeDevis.count({ where: { createdAt: { gte: startOfMonth } } }),
      prisma.demandeDevis.count({
        where: { createdAt: { gte: startOfLastMonth, lte: endOfLastMonth } },
      }),
      // Compteur "à valider" — uniquement les statuts qui attendent une
      // décision de l'admin. ONBOARDING = artisan en cours d'inscription
      // (n'a pas encore soumis son scoring), donc rien à valider côté admin.
      //
      // BUGFIX 18/05/2026 : on exclut explicitement actif=true. Sinon un
      // artisan qu'un admin a active manuellement (mise actif=true) reste
      // bizarrement dans "en attente" si l'artisanStatus n'a pas ete remis
      // a ACTIVE (incoherence DB). Tarik a signale ce bug. Si actif=true,
      // l'artisan est de fait valide, peu importe son artisanStatus historique.
      prisma.artisan.count({
        where: {
          deletedAt: null,
          actif: false,
          artisanStatus: { in: ["PENDING_NAF_REVIEW", "PENDING_REVIEW"] },
        },
      }),
      // Répartition par plan : seulement actifs (sinon le total dépasse totalArtisansActif)
      prisma.artisan.groupBy({
        by: ["plan"],
        where: { actif: true, deletedAt: null },
        _count: { plan: true },
      }),
      // Répartition par ville : seulement actifs
      prisma.artisan.groupBy({
        by: ["villeSlug"],
        where: { actif: true, deletedAt: null },
        _count: { villeSlug: true },
      }),
      // Revenus estimés : on compte les plans payants des artisans actifs
      prisma.artisan.findMany({
        where: { actif: true, deletedAt: null },
        select: { plan: true },
      }),
    ]);

    const plans = plansBreakdownActif.reduce<Record<string, number>>((acc, item) => {
      acc[item.plan] = item._count.plan;
      return acc;
    }, {});

    // Normalise villes : on remonte les 5 principales + agrégat "Autres"
    const villesMap = villesBreakdownActif.reduce<Record<string, number>>((acc, item) => {
      const key = (item.villeSlug || "autres").toLowerCase();
      acc[key] = (acc[key] || 0) + item._count.villeSlug;
      return acc;
    }, {});
    const villes: Array<{ slug: string; count: number }> = VILLES_PRINCIPALES.map((slug) => ({
      slug,
      count: villesMap[slug] || 0,
    }));
    const autresCount = Object.entries(villesMap)
      .filter(([slug]) => !VILLES_PRINCIPALES.includes(slug))
      .reduce((sum, [, count]) => sum + count, 0);
    if (autresCount > 0) villes.push({ slug: "autres", count: autresCount });

    const revenusEstimes = activeArtisansForRevenue.reduce(
      (sum, a) => sum + (PLAN_PRICE[a.plan] || 0),
      0
    );

    // Delta relatif simple (en %), null si le mois précédent était à 0.
    const deltaPct = (current: number, previous: number): number | null => {
      if (previous === 0) return current > 0 ? null : 0;
      return Math.round(((current - previous) / previous) * 100);
    };

    return apiSuccess({
      totalArtisansActif,
      totalArtisansAll,
      inscriptionsThisMonth,
      inscriptionsLastMonth,
      inscriptionsDeltaPct: deltaPct(inscriptionsThisMonth, inscriptionsLastMonth),
      totalDevisThisMonth,
      totalDevisLastMonth,
      devisDeltaPct: deltaPct(totalDevisThisMonth, totalDevisLastMonth),
      artisansEnAttente,
      revenusEstimes,
      plans,
      villes,
      generatedAt: now.toISOString(),
    });
  } catch (error: unknown) {
    const err = error as Error;
    if (err.message === "UNAUTHORIZED") return apiError("Non autorisé", 401);
    if (err.message === "FORBIDDEN") return apiError("Accès interdit", 403);
    console.error("Admin stats error:", err);
    return apiError("Erreur interne du serveur", 500);
  }
}
