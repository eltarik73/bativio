"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import s from "./Abonnement.module.css";

/* ═══ Plan config ═══ */

interface PlanConfig {
  id: string;
  label: string;
  price: number;
  period: string;
  desc: string;
  stripePlan: string;
}

const PLANS: Record<string, PlanConfig> = {
  gratuit: {
    id: "gratuit",
    label: "Gratuit",
    price: 0,
    period: "",
    desc: "Fiche annuaire basique pour tester la plateforme.",
    stripePlan: "",
  },
  starter: {
    id: "starter",
    label: "Essentiel",
    price: 19,
    period: "/mois",
    desc: "Agenda visible, prise de RDV en ligne, SMS rappel et r\u00e9ception factures.",
    stripePlan: "starter",
  },
  pro: {
    id: "pro",
    label: "Pro",
    price: 49,
    period: "/mois",
    desc: "Vitrine compl\u00e8te, mini-CRM, facturation \u00e9lectronique, QR Code.",
    stripePlan: "pro",
  },
  business: {
    id: "business",
    label: "Business",
    price: 79,
    period: "/mois",
    desc: "Agent IA, devis IA, SEO boost, support d\u00e9di\u00e9. Le plan le plus complet.",
    stripePlan: "business",
  },
};

const PLAN_ORDER = ["gratuit", "starter", "pro", "business"];

/* ═══ Features per plan ═══ */

interface PlanFeature {
  label: string;
  tag: string;
  tagClass: string;
}

const PLAN_FEATURES: Record<string, PlanFeature[]> = {
  gratuit: [
    { label: "Fiche annuaire", tag: "Actif", tagClass: "included" },
    { label: "Formulaire demande de devis", tag: "Actif", tagClass: "included" },
    { label: "Photos chantiers", tag: "3 max", tagClass: "limit" },
    { label: "Badges qualifications", tag: "2 max", tagClass: "limit" },
    { label: "Dashboard stats basique", tag: "Actif", tagClass: "included" },
  ],
  starter: [
    { label: "Fiche annuaire", tag: "Actif", tagClass: "included" },
    { label: "Formulaire demande de devis", tag: "Actif", tagClass: "included" },
    { label: "Photos chantiers", tag: "10 max", tagClass: "limit" },
    { label: "Photos avant/apr\u00e8s", tag: "Actif", tagClass: "included" },
    { label: "Badges qualifications", tag: "Illimit\u00e9", tagClass: "included" },
    { label: "Agenda visible 24/7 + RDV en ligne", tag: "Actif", tagClass: "included" },
    { label: "R\u00e9ception factures (PA)", tag: "Essentiel", tagClass: "starter" },
  ],
  pro: [
    { label: "Fiche annuaire", tag: "Actif", tagClass: "included" },
    { label: "Vitrine compl\u00e8te (URL perso)", tag: "Pro", tagClass: "pro" },
    { label: "Photos chantiers", tag: "Illimit\u00e9", tagClass: "included" },
    { label: "Photos avant/apr\u00e8s", tag: "Actif", tagClass: "included" },
    { label: "Badges qualifications", tag: "Illimit\u00e9", tagClass: "included" },
    { label: "Fiches clients / mini-CRM", tag: "Pro", tagClass: "pro" },
    { label: "QR Code vitrine", tag: "Pro", tagClass: "pro" },
    { label: "D\u00e9p\u00f4t + transmission factures (PA)", tag: "Pro", tagClass: "pro" },
  ],
  business: [
    { label: "Tout le plan Pro inclus", tag: "Actif", tagClass: "included" },
    { label: "Agent IA r\u00e9pondeur client", tag: "Business", tagClass: "business" },
    { label: "Devis IA", tag: "Business", tagClass: "business" },
    { label: "Cr\u00e9ation factures + transmission PA", tag: "Business", tagClass: "business" },
    { label: "SEO boost local", tag: "Business", tagClass: "business" },
    { label: "Dashboard avanc\u00e9 complet", tag: "Actif", tagClass: "included" },
    { label: "Support d\u00e9di\u00e9", tag: "Business", tagClass: "business" },
  ],
};

/* ═══ Upsells ═══ */

interface Upsell {
  icon: string;
  title: string;
  desc: string;
  minPlan: string;
  planLabel: string;
  planClass: string;
}

const UPSELLS: Upsell[] = [
  {
    icon: "\uD83C\uDFE0",
    title: "Vitrine compl\u00e8te avec URL perso",
    desc: "Un mini-site professionnel \u00e0 votre nom, visible sur Google.",
    minPlan: "pro",
    planLabel: "D\u00e8s Pro",
    planClass: "pro",
  },
  {
    icon: "\uD83E\uDD16",
    title: "Agent IA r\u00e9pondeur",
    desc: "R\u00e9pondez instantan\u00e9ment \u00e0 vos prospects, m\u00eame sur chantier.",
    minPlan: "business",
    planLabel: "Business",
    planClass: "business",
  },
  {
    icon: "\uD83D\uDCCB",
    title: "Devis IA automatique",
    desc: "G\u00e9n\u00e9rez un devis structur\u00e9 en 2 phrases.",
    minPlan: "business",
    planLabel: "Business",
    planClass: "business",
  },
  {
    icon: "\uD83D\uDCC5",
    title: "Agenda + RDV en ligne",
    desc: "Vos clients r\u00e9servent 24h/24, m\u00eame le week-end.",
    minPlan: "starter",
    planLabel: "D\u00e8s Essentiel",
    planClass: "starter",
  },
  {
    icon: "\uD83D\uDCC4",
    title: "Facturation \u00e9lectronique",
    desc: "Transmettez vos factures sur la plateforme d\u2019\u00c9tat.",
    minPlan: "starter",
    planLabel: "D\u00e8s Essentiel",
    planClass: "starter",
  },
];

/* ═══ FAQ ═══ */

const FAQ_ITEMS = [
  {
    q: "Puis-je changer de plan \u00e0 tout moment\u00a0?",
    a: "Oui, vous pouvez monter ou descendre de plan \u00e0 tout moment depuis cette page. Le changement prend effet imm\u00e9diatement et la facturation est ajust\u00e9e au prorata.",
  },
  {
    q: "Y a-t-il un engagement\u00a0?",
    a: "Aucun engagement. Vous pouvez annuler votre abonnement \u00e0 tout moment. Vous conservez l\u2019acc\u00e8s jusqu\u2019\u00e0 la fin de la p\u00e9riode pay\u00e9e.",
  },
  {
    q: "Comment fonctionne la facturation\u00a0?",
    a: "Vous \u00eates factur\u00e9 chaque mois par carte bancaire via Stripe. Aucune commission sur vos chantiers, jamais.",
  },
  {
    q: "Que se passe-t-il si je d\u00e9passe les limites de mon plan\u00a0?",
    a: "Vous recevez une notification pour passer au plan sup\u00e9rieur. Aucune coupure de service\u00a0: vos donn\u00e9es restent accessibles.",
  },
  {
    q: "Puis-je essayer un plan sup\u00e9rieur gratuitement\u00a0?",
    a: "Contactez-nous pour b\u00e9n\u00e9ficier d\u2019un essai. Nous offrons r\u00e9guli\u00e8rement des p\u00e9riodes d\u2019essai aux artisans motiv\u00e9s.",
  },
];

/* ═══ Helpers ═══ */

function normalizePlan(p: string): string {
  const plan = (p || "GRATUIT").toUpperCase();
  if (plan === "ESSENTIEL") return "starter";
  if (plan === "PRO_PLUS") return "business";
  return plan.toLowerCase();
}

interface UsageGauge {
  label: string;
  value: number;
  limit: number | null;
  display: string;
}

function getBarColor(pct: number): string {
  if (pct > 80) return "red";
  if (pct >= 50) return "orange";
  return "green";
}

/* ═══ Component ═══ */

interface Stats {
  vuesCeMois: number;
  demandesCeMois: number;
  rdvCeMois: number;
  noteMoyenne: number;
  nombreAvis: number;
}

export default function AbonnementPage() {
  const { user, fetchWithAuth } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [photoCount, setPhotoCount] = useState(0);
  const [faqOpen, setFaqOpen] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [statsData, photosData] = await Promise.allSettled([
          fetchWithAuth("/artisans/me/stats"),
          fetchWithAuth("/artisans/me/photos"),
        ]);

        if (cancelled) return;

        if (statsData.status === "fulfilled") {
          setStats(statsData.value as Stats);
        }
        if (photosData.status === "fulfilled") {
          const photos = photosData.value;
          if (Array.isArray(photos)) {
            setPhotoCount(photos.length);
          } else if (photos && typeof photos === "object" && "count" in photos) {
            setPhotoCount((photos as { count: number }).count);
          }
        }
      } catch {
        // Silent fail — page still works with defaults
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [fetchWithAuth]);

  if (!user) {
    return <div className={s.loading}>Chargement...</div>;
  }

  const planId = normalizePlan(user.plan || "GRATUIT");
  const currentIndex = PLAN_ORDER.indexOf(planId);
  const planConfig = PLANS[planId] || PLANS.gratuit;

  /* ─── Usage gauges ─── */
  const invoiceCount = (typeof user.invoiceCount === "number" ? user.invoiceCount : 0) as number;

  const photoLimit = (() => {
    if (planId === "gratuit") return 3;
    if (planId === "starter") return 10;
    return null; // unlimited
  })();

  const invoiceLimit = (() => {
    if (planId === "gratuit") return 5;
    return null; // unlimited
  })();

  const gauges: UsageGauge[] = [
    {
      label: "Factures",
      value: invoiceCount,
      limit: invoiceLimit,
      display: invoiceLimit ? `${invoiceCount} / ${invoiceLimit}` : `${invoiceCount}`,
    },
    {
      label: "Photos",
      value: photoCount,
      limit: photoLimit,
      display: photoLimit ? `${photoCount} / ${photoLimit}` : `${photoCount}`,
    },
    {
      label: "Demandes",
      value: stats?.demandesCeMois ?? 0,
      limit: null,
      display: `${stats?.demandesCeMois ?? 0}`,
    },
  ];

  /* ─── Features for current plan ─── */
  const features = PLAN_FEATURES[planId] || PLAN_FEATURES.gratuit;

  /* ─── Upsells (only those above current plan) ─── */
  const visibleUpsells = UPSELLS.filter((u) => {
    const upsellIndex = PLAN_ORDER.indexOf(u.minPlan);
    return upsellIndex > currentIndex;
  });

  /* ─── Upgrade plans ─── */
  const upgradePlans = PLAN_ORDER.slice(currentIndex + 1).map((id) => PLANS[id]);
  const recommendedPlan = upgradePlans.length > 0 ? upgradePlans[0].id : null;
  const isBusiness = planId === "business";

  /* ─── Handlers ─── */
  const handleUpgrade = async (plan: string) => {
    try {
      const data = (await fetchWithAuth("/stripe/checkout", {
        method: "POST",
        body: JSON.stringify({ plan }),
      })) as { url: string };
      if (data.url) window.location.href = data.url;
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erreur");
    }
  };

  const handleManageSubscription = async () => {
    try {
      const data = (await fetchWithAuth("/stripe/portal", {
        method: "POST",
      })) as { url: string };
      if (data.url) window.location.href = data.url;
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erreur");
    }
  };

  if (loading) {
    return <div className={s.loading}>Chargement de votre abonnement...</div>;
  }

  return (
    <div className={s.page}>
      {/* ─── Header ─── */}
      <h1 className={s.pageTitle}>Mon abonnement</h1>
      <p className={s.pageSub}>
        G\u00e9rez votre plan, suivez votre consommation et d\u00e9bloquez de nouvelles fonctionnalit\u00e9s.
      </p>

      {/* ─── Current Plan ─── */}
      <div className={s.currentPlan}>
        <span className={s.cpBadge}>Plan actuel</span>
        <div className={s.cpHeader}>
          <span className={s.cpName}>{planConfig.label}</span>
          <div className={s.cpPrice}>
            {planConfig.price > 0 ? (
              <>
                <span className={s.cpAmount}>{planConfig.price}\u20ac</span>
                <span className={s.cpPeriod}>{planConfig.period}</span>
              </>
            ) : (
              <span className={s.cpAmount}>Gratuit</span>
            )}
          </div>
        </div>
        <p className={s.cpDesc}>{planConfig.desc}</p>

        {/* Usage gauges */}
        <div className={s.usageGrid}>
          {gauges.map((g) => {
            const pct = g.limit ? Math.min((g.value / g.limit) * 100, 100) : 0;
            const color = g.limit ? getBarColor(pct) : "green";
            return (
              <div key={g.label} className={s.usageItem}>
                <div className={s.usageLabel}>{g.label}</div>
                <div className={s.usageValue}>{g.display}</div>
                {g.limit ? (
                  <div className={s.usageBar}>
                    <div
                      className={`${s.usageFill} ${s[color] || ""}`}
                      style={{ width: `${pct}%`, background: color === "green" ? "var(--mousse, #4A6741)" : color === "orange" ? "var(--or, #C9943A)" : "#C43A1A" }}
                    />
                  </div>
                ) : (
                  <div className={s.usageBar}>
                    <div
                      className={s.usageFill}
                      style={{ width: "100%", background: "var(--mousse, #4A6741)", opacity: 0.3 }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ─── Features included ─── */}
      <h2 className={s.sectionTitle}>Fonctionnalit\u00e9s incluses</h2>
      <div className={s.featuresList}>
        {features.map((f, i) => (
          <div key={i} className={s.featRow}>
            <div className={`${s.featCheck} ${s.on}`}>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2.5 6L5 8.5L9.5 3.5" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className={s.featLabel}>{f.label}</span>
            <span className={`${s.featTag} ${s[f.tagClass] || ""}`}>{f.tag}</span>
          </div>
        ))}
      </div>

      {/* ─── Upsells ─── */}
      {visibleUpsells.length > 0 && (
        <>
          <h2 className={s.sectionTitle}>D\u00e9bloquez plus</h2>
          <div className={s.upsellGrid}>
            {visibleUpsells.map((u, i) => (
              <div key={i} className={s.upsellCard}>
                <div className={s.upsellIcon}>{u.icon}</div>
                <div className={s.upsellContent}>
                  <div className={s.upsellTitle}>{u.title}</div>
                  <div className={s.upsellDesc}>{u.desc}</div>
                </div>
                <span
                  className={s.upsellPlan}
                  style={
                    u.planClass === "business"
                      ? { background: "var(--bois, #3D2E1F)", color: "var(--sable-light, #F2EAE0)" }
                      : { background: "rgba(196, 83, 26, 0.08)", color: "var(--terre, #C4531A)" }
                  }
                >
                  {u.planLabel}
                </span>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ─── Upgrade or Max Plan ─── */}
      {isBusiness ? (
        <div className={s.maxPlan}>
          <div className={s.maxPlanIcon}>{"\u2B50"}</div>
          <div className={s.maxPlanTitle}>Vous avez le plan le plus complet</div>
          <p className={s.maxPlanDesc}>
            Profitez de toutes les fonctionnalit\u00e9s Bativio, y compris l&apos;IA et le support d\u00e9di\u00e9.
          </p>
        </div>
      ) : (
        <div className={s.upgradeSection}>
          <h2 className={s.upgradeTitle}>Passez au niveau sup\u00e9rieur</h2>
          <p className={s.upgradeSub}>
            D\u00e9bloquez plus de fonctionnalit\u00e9s pour d\u00e9velopper votre activit\u00e9.
          </p>
          <div className={s.upgradePlans}>
            {upgradePlans.map((plan) => {
              const isRecommended = plan.id === recommendedPlan;
              return (
                <div
                  key={plan.id}
                  className={`${s.upgradePlan} ${isRecommended ? s.upgradePlanRecommended : ""}`}
                >
                  {isRecommended && (
                    <span className={s.upPlanRecBadge}>Recommand\u00e9</span>
                  )}
                  <div className={s.upPlanName}>{plan.label}</div>
                  <div className={s.upPlanPrice}>
                    {plan.price}\u20ac{plan.period}
                  </div>
                  <button
                    className={isRecommended ? s.upCta : s.upCtaOutline}
                    onClick={() => handleUpgrade(plan.stripePlan)}
                  >
                    Passer \u00e0 {plan.label}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ─── FAQ ─── */}
      <h2 className={s.sectionTitle}>Questions fr\u00e9quentes</h2>
      <div className={s.faq}>
        {FAQ_ITEMS.map((item, i) => (
          <div key={i} className={s.faqItem}>
            <button
              className={s.faqQ}
              onClick={() => setFaqOpen(faqOpen === i ? null : i)}
            >
              <span>{item.q}</span>
              <span
                className={`${s.faqChevron} ${faqOpen === i ? s.faqChevronOpen : ""}`}
              >
                {"\u25BC"}
              </span>
            </button>
            <div className={`${s.faqA} ${faqOpen === i ? s.open : ""}`}>
              {item.a}
            </div>
          </div>
        ))}
      </div>

      {/* ─── Manage subscription ─── */}
      {planId !== "gratuit" && (
        <div className={s.manageLink}>
          <button className={s.manageLinkBtn} onClick={handleManageSubscription}>
            G\u00e9rer mon abonnement via Stripe
          </button>
        </div>
      )}
    </div>
  );
}
