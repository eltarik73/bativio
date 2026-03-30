"use client";

import { useState } from "react";
import Link from "next/link";
import s from "./PricingGrid.module.css";

/* ── SVG helpers ── */
const CheckTerre = () => (
  <svg className={s.featureCheck} viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="8" fill="rgba(196,83,26,.1)" /><path d="M5 8.2l2 2 4-4" stroke="#C4531A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
);
const CheckGreen = () => (
  <svg className={s.featureCheck} viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="8" fill="rgba(5,150,105,.1)" /><path d="M5 8.2l2 2 4-4" stroke="#059669" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
);
const Arrow = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
);
const FlagFR = () => (
  <svg width="18" height="13" viewBox="0 0 18 13"><rect width="6" height="13" fill="#002395" /><rect x="6" width="6" height="13" fill="#fff" /><rect x="12" width="6" height="13" fill="#ED2939" /></svg>
);
const FlagEU = () => (
  <svg width="18" height="13" viewBox="0 0 18 13"><rect width="18" height="13" fill="#003399" rx="1" />{[...Array(12)].map((_, i) => { const a = (i * 30 - 90) * Math.PI / 180; return <circle key={i} cx={9 + 4 * Math.cos(a)} cy={6.5 + 4 * Math.sin(a)} r=".8" fill="#FFCC00" />; })}</svg>
);

/* ── Badge icons ── */
const IconStar = () => <svg width="12" height="12" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>;
const IconFile = () => <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><path d="M14 2v6h6" /></svg>;
const IconSparkles = () => <svg width="12" height="12" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l2.09 6.26L20.18 10l-6.09 1.74L12 18l-2.09-6.26L3.82 10l6.09-1.74z" /></svg>;
const IconSms = () => <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /></svg>;

const BADGE_ICONS: Record<string, React.FC> = { star: IconStar, file: IconFile, sparkles: IconSparkles, sms: IconSms };
const BADGE_STYLES: Record<string, string> = { free: s.badgeFree, popular: s.badgePopular, factu: s.badgeFactu, ia: s.badgeIa, sms: s.badgeSms };

/* ── Plans data ── */
interface Feature { label: string; detail?: string; soon?: boolean }
interface Badge { label: string; variant: string; icon?: string }
interface Plan {
  id: string; name: string; price: number; description: string;
  badges: Badge[]; featured: boolean;
  cta: { label: string; variant: string };
  visibilityLabel: string; visibility: Feature[]; invoicing: Feature[];
}

const PLANS: Plan[] = [
  {
    id: "gratuit", name: "Gratuit", price: 0, description: "Pour découvrir Bativio",
    badges: [{ label: "Découverte", variant: "free" }], featured: false,
    cta: { label: "Commencer gratuitement", variant: "outline" },
    visibilityLabel: "Visibilité",
    visibility: [
      { label: "Fiche annuaire" }, { label: "Formulaire de devis" },
      { label: "Photos chantiers", detail: "3 max" }, { label: "Badges qualifications", detail: "2 max" },
    ],
    invoicing: [],
  },
  {
    id: "essentiel", name: "Essentiel", price: 19, description: "Pour être visible, joignable et en règle",
    badges: [{ label: "Réception PA", variant: "factu", icon: "file" }], featured: false,
    cta: { label: "Choisir Essentiel", variant: "outline" },
    visibilityLabel: "Visibilité",
    visibility: [
      { label: "Fiche annuaire" }, { label: "Formulaire de devis" },
      { label: "Photos chantiers", detail: "10" }, { label: "Badges qualifications", detail: "illimité" },
      { label: "Agenda & RDV en ligne" }, { label: "Support", detail: "email" },
    ],
    invoicing: [{ label: "Réception factures PA" }],
  },
  {
    id: "pro", name: "Pro", price: 49, description: "Votre vitrine complète avec facturation",
    badges: [
      { label: "Le + populaire", variant: "popular", icon: "star" },
      { label: "Facturation complète", variant: "factu", icon: "file" },
    ],
    featured: true,
    cta: { label: "Choisir Pro", variant: "filled" },
    visibilityLabel: "Visibilité",
    visibility: [
      { label: "Fiche annuaire" }, { label: "Formulaire de devis" },
      { label: "Photos chantiers", detail: "illimité" }, { label: "Badges qualifications", detail: "illimité" },
      { label: "Vitrine personnalisée" }, { label: "Agenda & RDV en ligne" }, { label: "Support", detail: "prioritaire" },
    ],
    invoicing: [
      { label: "Réception factures PA" }, { label: "Émission factures PA" }, { label: "E-reporting automatique" },
    ],
  },
  {
    id: "proplus", name: "Pro+", price: 79, description: "L'artisan boosté par l'IA + facturation pro",
    badges: [
      { label: "IA intégrée", variant: "ia", icon: "sparkles" },
      { label: "Facturation pro", variant: "factu", icon: "file" },
      { label: "SMS inclus", variant: "sms", icon: "sms" },
    ],
    featured: false,
    cta: { label: "Choisir Pro+", variant: "dark" },
    visibilityLabel: "Visibilité & IA",
    visibility: [
      { label: "Fiche annuaire" }, { label: "Formulaire de devis" },
      { label: "Photos chantiers", detail: "illimité" }, { label: "Badges qualifications", detail: "illimité" },
      { label: "Vitrine personnalisée" }, { label: "Agenda & RDV en ligne" },
      { label: "SMS notifications", detail: "30/mois" }, { label: "Devis IA" },
      { label: "Agent IA répondeur", soon: true }, { label: "Support", detail: "dédié" },
    ],
    invoicing: [
      { label: "Réception factures PA" }, { label: "Émission factures PA" },
      { label: "E-reporting automatique" }, { label: "Création factures / devis" }, { label: "Export comptable (FEC)" },
    ],
  },
];

export default function PricingGrid() {
  const [isAnnual, setIsAnnual] = useState(false);

  const getPrice = (monthly: number) => isAnnual ? Math.round(monthly * 0.83) : monthly;
  const getAnnualTotal = (monthly: number) => getPrice(monthly) * 12;
  const getAnnualSaving = (monthly: number) => monthly * 12 - getAnnualTotal(monthly);

  return (
    <div className={s.wrapper}>
      {/* Toggle */}
      <div className={s.toggleWrap}>
        <div className={s.toggle}>
          <button className={`${s.toggleBtn} ${!isAnnual ? s.toggleBtnActive : ""}`} onClick={() => setIsAnnual(false)}>Mensuel</button>
          <button className={`${s.toggleBtn} ${isAnnual ? s.toggleBtnActive : ""}`} onClick={() => setIsAnnual(true)}>
            Annuel <span className={s.saveBadge}>-17%</span>
          </button>
        </div>
      </div>

      {/* Conformity bar */}
      <div className={s.conformBar}>
        <svg width="18" height="18" fill="none" stroke="#059669" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
        <p className={s.conformText}>
          <span className={s.conformBold}>Conforme réforme sept. 2026</span> — Facturation électronique incluse dès le pack Essentiel
          <span className={s.flags}><FlagFR /><FlagEU /></span>
        </p>
      </div>

      {/* Grid */}
      <div className={s.grid}>
        {PLANS.map((plan) => {
          const price = getPrice(plan.price);
          const ctaCls = plan.cta.variant === "filled" ? s.ctaFilled : plan.cta.variant === "dark" ? s.ctaDark : s.ctaOutline;

          return (
            <div key={plan.id} className={`${s.card} ${plan.featured ? s.cardFeatured : ""}`}>
              {plan.featured && <div className={s.recommendedBadge}>Recommandé</div>}

              <h3 className={s.planName}>{plan.name}</h3>
              <p className={s.planDesc}>{plan.description}</p>

              {/* Price */}
              <div className={s.priceRow}>
                <span className={s.priceValue}>{plan.price === 0 ? "0€" : `${price}€`}</span>
                {plan.price > 0 && <span className={s.priceSuffix}>/mois</span>}
              </div>
              <div className={s.savingText}>
                {isAnnual && plan.price > 0 ? `2 mois offerts · ${getAnnualTotal(plan.price)}€/an au lieu de ${plan.price * 12}€` : "\u00A0"}
              </div>

              {/* Badges */}
              <div className={s.badges}>
                {plan.badges.map((b) => {
                  const Icon = b.icon ? BADGE_ICONS[b.icon] : null;
                  return (
                    <span key={b.label} className={`${s.badge} ${BADGE_STYLES[b.variant] || ""}`}>
                      {Icon && <Icon />}
                      {b.label}
                    </span>
                  );
                })}
              </div>

              {/* Visibility features */}
              <div className={s.sectionLabel}>{plan.visibilityLabel}</div>
              <ul className={s.featureList}>
                {plan.visibility.map((f) => (
                  <li key={f.label} className={s.featureItem}>
                    <CheckTerre />
                    <span>{f.label}</span>
                    {f.soon && <span className={s.featureSoon}>bientôt</span>}
                    {f.detail && !f.soon && <span className={s.featureDetail}>{f.detail}</span>}
                  </li>
                ))}

                {/* Invoicing section */}
                {plan.invoicing.length > 0 && (
                  <>
                    <hr className={s.invoicingSep} />
                    <div className={s.sectionLabel}>Facturation électronique</div>
                    {plan.invoicing.map((f) => (
                      <li key={f.label} className={s.featureItem}>
                        <CheckGreen />
                        <span>{f.label}</span>
                        {f.detail && <span className={s.featureDetail}>{f.detail}</span>}
                      </li>
                    ))}
                  </>
                )}
              </ul>

              {/* CTA */}
              <Link href="/inscription" className={`${s.cta} ${ctaCls}`}>
                {plan.cta.label} <Arrow />
              </Link>
            </div>
          );
        })}
      </div>

      <p className={s.bottomNote}>
        Pas de commission. Pas de coût par devis. Pas de frais cachés. <span className={s.bottomBold}>Jamais.</span>
      </p>
    </div>
  );
}
