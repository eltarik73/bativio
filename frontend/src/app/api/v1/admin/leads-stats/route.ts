import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError } from "@/lib/api-response";
import { requireAdmin } from "@/lib/auth-server";

/**
 * GET /api/v1/admin/leads-stats?since=30d
 *
 * Stats orientees LEADS : a qui Bativio genere le plus de leads.
 *
 * Sources :
 * - DemandeDevis (lead direct : un client clique "demander un devis")
 * - DevisReply (l artisan a repondu = lead converti)
 * - ClickEvent category=vitrine_view (vue vitrine, label commence par vitrine_<slug>)
 * - ClickEvent category=phone_call (appel telephone, label commence par phone_<slug>)
 *
 * Modeles : Artisan (plan, ville, metier), DemandeDevis (artisanId), DevisReply,
 * ClickEvent (label -> slug parsing).
 *
 * Renvoie :
 * - period : la periode demandee
 * - artisansByLeads : top artisans, tri par totalLeads desc
 * - planSummary : agregat par plan (Pro/Business/Gratuit)
 * - villeFunnel : vues + demandes par ville
 * - metierFunnel : vues + demandes par metier
 * - funnel : totaux global + taux de conversion
 */

const PERIODS = {
  "7d": 7 * 24 * 60 * 60 * 1000,
  "30d": 30 * 24 * 60 * 60 * 1000,
  "90d": 90 * 24 * 60 * 60 * 1000,
} as const;

type PeriodKey = keyof typeof PERIODS | "all";

function parseSlugFromLabel(label: string): string | null {
  // vitrine_<slug> ou phone_<slug>
  const m = label.match(/^(?:vitrine|phone)_(.+)$/);
  return m ? m[1] : null;
}

export async function GET(req: Request) {
  try {
    await requireAdmin();

    const url = new URL(req.url);
    const sinceParam = (url.searchParams.get("since") || "30d") as PeriodKey;
    const ms = sinceParam === "all" ? null : PERIODS[sinceParam] ?? PERIODS["30d"];
    const since = ms ? new Date(Date.now() - ms) : null;
    const dateFilter = since ? { gte: since } : undefined;

    // 1) Tous les artisans actifs (base du dashboard)
    const artisansBase = await prisma.artisan.findMany({
      where: { deletedAt: null, actif: true },
      select: {
        id: true,
        slug: true,
        nomAffichage: true,
        plan: true,
        planOverride: true,
        ville: true,
        villeSlug: true,
        metierId: true,
        metier: { select: { slug: true, nom: true } },
      },
    });

    const artisanBySlug = new Map(artisansBase.map((a) => [a.slug, a]));
    const artisanById = new Map(artisansBase.map((a) => [a.id, a]));

    // 2) Demandes de devis par artisan (sur periode)
    const demandesByArtisan = await prisma.demandeDevis.groupBy({
      by: ["artisanId"],
      where: dateFilter ? { createdAt: dateFilter } : undefined,
      _count: { id: true },
    });
    const demandesCount = new Map(
      demandesByArtisan.map((d) => [d.artisanId, d._count.id])
    );

    // 3) DevisReply par artisan (= leads traites)
    const repliesByArtisan = await prisma.devisReply.groupBy({
      by: ["artisanId"],
      where: dateFilter ? { createdAt: dateFilter } : undefined,
      _count: { id: true },
    });
    const repliesCount = new Map(
      repliesByArtisan.map((r) => [r.artisanId, r._count.id])
    );

    // 4) ClickEvent : vues vitrine + appels phone, groupes par label
    const clicksByLabel = await prisma.clickEvent.groupBy({
      by: ["label", "category"],
      where: {
        category: { in: ["vitrine_view", "phone_call"] },
        ...(dateFilter ? { createdAt: dateFilter } : {}),
      },
      _count: { id: true },
    });

    // Map slug -> {vues, appels}
    const vuesBySlug = new Map<string, number>();
    const appelsBySlug = new Map<string, number>();
    for (const c of clicksByLabel) {
      const slug = parseSlugFromLabel(c.label);
      if (!slug) continue;
      if (c.category === "vitrine_view") {
        vuesBySlug.set(slug, (vuesBySlug.get(slug) || 0) + c._count.id);
      } else if (c.category === "phone_call") {
        appelsBySlug.set(slug, (appelsBySlug.get(slug) || 0) + c._count.id);
      }
    }

    // Poids par plan pour le leadScore (input futur du routing automatique)
    const PLAN_WEIGHT: Record<string, number> = {
      BUSINESS: 3,
      PRO: 2,
      STARTER: 1.5,
      PRO_PLUS: 2,    // legacy
      ESSENTIEL: 1.5, // legacy
      GRATUIT: 1,
    };

    // 5) Construction de la table artisansByLeads
    const artisansByLeads = artisansBase
      .map((a) => {
        const vues = vuesBySlug.get(a.slug) || 0;
        const appels = appelsBySlug.get(a.slug) || 0;
        const demandes = demandesCount.get(a.id) || 0;
        const reponsesArtisan = repliesCount.get(a.id) || 0;
        const totalLeads = appels + demandes;
        const conversionRate = vues > 0 ? Math.round((demandes / vues) * 1000) / 10 : 0;
        const responseRate = demandes > 0
          ? Math.round((reponsesArtisan / demandes) * 1000) / 10
          : 0;
        const effectivePlan = a.planOverride || a.plan;
        const weight = PLAN_WEIGHT[effectivePlan] || 1;
        // leadScore : signal qui priorise un artisan dans le routing futur
        // (totalLeads recent * poidsPlan + bonus conversion).
        const leadScore = Math.round((totalLeads * weight + conversionRate * 0.1) * 10) / 10;
        return {
          artisanId: a.id,
          slug: a.slug,
          nomAffichage: a.nomAffichage,
          plan: effectivePlan,
          ville: a.ville,
          metier: a.metier?.nom || null,
          vues,
          appels,
          demandes,
          reponses: reponsesArtisan,
          totalLeads,
          conversionRate,
          responseRate,
          leadScore,
        };
      })
      .sort((a, b) => b.totalLeads - a.totalLeads || b.vues - a.vues);

    // 6) Plan summary
    const planMap = new Map<string, {
      plan: string;
      nbArtisans: number;
      vues: number;
      appels: number;
      demandes: number;
      reponses: number;
    }>();
    for (const a of artisansByLeads) {
      const k = a.plan;
      const cur = planMap.get(k) || {
        plan: k,
        nbArtisans: 0,
        vues: 0,
        appels: 0,
        demandes: 0,
        reponses: 0,
      };
      cur.nbArtisans += 1;
      cur.vues += a.vues;
      cur.appels += a.appels;
      cur.demandes += a.demandes;
      cur.reponses += a.reponses;
      planMap.set(k, cur);
    }
    const planSummary = Array.from(planMap.values()).map((p) => ({
      ...p,
      leadsParArtisan: p.nbArtisans > 0
        ? Math.round(((p.appels + p.demandes) / p.nbArtisans) * 10) / 10
        : 0,
      conversionRate: p.vues > 0
        ? Math.round((p.demandes / p.vues) * 1000) / 10
        : 0,
    })).sort((a, b) => {
      const order = ["BUSINESS", "PRO", "STARTER", "PRO_PLUS", "ESSENTIEL", "GRATUIT"];
      return order.indexOf(a.plan) - order.indexOf(b.plan);
    });

    // 7) Ville funnel
    const villeMap = new Map<string, { ville: string; vues: number; demandes: number }>();
    for (const a of artisansByLeads) {
      if (!a.ville) continue;
      const cur = villeMap.get(a.ville) || { ville: a.ville, vues: 0, demandes: 0 };
      cur.vues += a.vues;
      cur.demandes += a.demandes;
      villeMap.set(a.ville, cur);
    }
    const villeFunnel = Array.from(villeMap.values())
      .map((v) => ({
        ...v,
        conversionRate: v.vues > 0 ? Math.round((v.demandes / v.vues) * 1000) / 10 : 0,
      }))
      .sort((a, b) => b.demandes - a.demandes || b.vues - a.vues);

    // 8) Metier funnel
    const metierMap = new Map<string, { metier: string; vues: number; demandes: number }>();
    for (const a of artisansByLeads) {
      if (!a.metier) continue;
      const cur = metierMap.get(a.metier) || { metier: a.metier, vues: 0, demandes: 0 };
      cur.vues += a.vues;
      cur.demandes += a.demandes;
      metierMap.set(a.metier, cur);
    }
    const metierFunnel = Array.from(metierMap.values())
      .map((m) => ({
        ...m,
        conversionRate: m.vues > 0 ? Math.round((m.demandes / m.vues) * 1000) / 10 : 0,
      }))
      .sort((a, b) => b.demandes - a.demandes || b.vues - a.vues);

    // 9) Funnel global
    const totalVues = artisansByLeads.reduce((s, a) => s + a.vues, 0);
    const totalAppels = artisansByLeads.reduce((s, a) => s + a.appels, 0);
    const totalDemandes = artisansByLeads.reduce((s, a) => s + a.demandes, 0);
    const totalReponses = artisansByLeads.reduce((s, a) => s + a.reponses, 0);
    const funnel = {
      totalVues,
      totalAppels,
      totalDemandes,
      totalReponses,
      viewToCallRate: totalVues > 0 ? Math.round((totalAppels / totalVues) * 1000) / 10 : 0,
      viewToDemandeRate: totalVues > 0 ? Math.round((totalDemandes / totalVues) * 1000) / 10 : 0,
      demandeToReponseRate: totalDemandes > 0 ? Math.round((totalReponses / totalDemandes) * 1000) / 10 : 0,
    };

    // 10) Anti-leak : artisans qui n ont jamais ete vus mais ont des demandes
    //  (peut signaler un bug de tracking)
    const artisansSansVues = artisansByLeads
      .filter((a) => a.demandes > 0 && a.vues === 0)
      .map((a) => ({ slug: a.slug, nomAffichage: a.nomAffichage, demandes: a.demandes }));

    // 11) Artisans payants a risque : Pro/Business avec 0 lead sur la periode
    //  Signal de churn imminent - Tarik appelle ces artisans avant qu ils ne resilient
    const PAYANTS = new Set(["BUSINESS", "PRO", "STARTER", "PRO_PLUS", "ESSENTIEL"]);
    const atRisque = artisansByLeads
      .filter((a) => PAYANTS.has(a.plan) && a.totalLeads === 0)
      .map((a) => ({
        artisanId: a.artisanId,
        slug: a.slug,
        nomAffichage: a.nomAffichage,
        plan: a.plan,
        ville: a.ville,
        metier: a.metier,
        vues: a.vues,
      }));

    // 12) Top vitrines (sourcePage des ClickEvent agreges) pour visibilite SEO
    const topPagesRaw = await prisma.clickEvent.groupBy({
      by: ["sourcePage"],
      where: {
        category: "vitrine_view",
        ...(dateFilter ? { createdAt: dateFilter } : {}),
      },
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
      take: 10,
    });
    const topPages = topPagesRaw.map((p) => ({
      sourcePage: p.sourcePage,
      vues: p._count.id,
    }));

    void artisanById; // keep map ready for future enrichment
    void artisanBySlug;

    return apiSuccess({
      period: sinceParam,
      generatedAt: new Date().toISOString(),
      artisansByLeads,
      planSummary,
      villeFunnel,
      metierFunnel,
      funnel,
      atRisque,
      topPages,
      diagnostics: {
        artisansSansVues,
      },
    });
  } catch (err) {
    const e = err as Error;
    if (e.message === "UNAUTHORIZED") return apiError("Unauthorized", 401);
    if (e.message === "FORBIDDEN") return apiError("Forbidden", 403);
    console.error("GET /api/v1/admin/leads-stats error:", err);
    return apiError("Erreur interne du serveur", 500);
  }
}
