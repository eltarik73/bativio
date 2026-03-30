"use client";

import { useState } from "react";
import Link from "next/link";
import s from "./PricingGrid.module.css";

/* ── SVGs exact from pricing-bativio-v8.html ── */
const Chk = () => <svg viewBox="0 0 12 12" fill="none"><path d="M2.5 6L5 8.5L9.5 3.5" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>;
const Arrow = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>;

const FlagFR = () => <svg width="22" height="16" viewBox="0 0 22 16" fill="none"><rect x="0.5" y="0.5" width="21" height="15" rx="2" fill="#fff" stroke="#E5E7EB" strokeWidth="0.5" /><rect x="1" y="1" width="6.67" height="14" fill="#002395" /><rect x="7.67" y="1" width="6.67" height="14" fill="#fff" /><rect x="14.33" y="1" width="6.67" height="14" fill="#ED2939" /></svg>;
const FlagEU = () => <svg width="22" height="16" viewBox="0 0 22 16" fill="none"><rect x="0.5" y="0.5" width="21" height="15" rx="2" fill="#003399" stroke="#E5E7EB" strokeWidth="0.5" /><circle cx="11" cy="3.2" r="0.7" fill="#FFCC00" /><circle cx="13.5" cy="3.9" r="0.7" fill="#FFCC00" /><circle cx="15.1" cy="5.5" r="0.7" fill="#FFCC00" /><circle cx="15.8" cy="8" r="0.7" fill="#FFCC00" /><circle cx="15.1" cy="10.5" r="0.7" fill="#FFCC00" /><circle cx="13.5" cy="12.1" r="0.7" fill="#FFCC00" /><circle cx="11" cy="12.8" r="0.7" fill="#FFCC00" /><circle cx="8.5" cy="12.1" r="0.7" fill="#FFCC00" /><circle cx="6.9" cy="10.5" r="0.7" fill="#FFCC00" /><circle cx="6.2" cy="8" r="0.7" fill="#FFCC00" /><circle cx="6.9" cy="5.5" r="0.7" fill="#FFCC00" /><circle cx="8.5" cy="3.9" r="0.7" fill="#FFCC00" /></svg>;

/* ── Badge icons from v8 ── */
const IFile = () => <svg viewBox="0 0 12 12" fill="none"><path d="M2 2h8v8H2z" stroke="currentColor" strokeWidth="1" /><path d="M4 5h4M4 7h3" stroke="currentColor" strokeWidth="0.8" /></svg>;
const IPlus = () => <svg viewBox="0 0 12 12" fill="none"><path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" /></svg>;
const IStar = () => <svg viewBox="0 0 12 12" fill="none"><path d="M6 1l1.5 3.1 3.4.5-2.5 2.4.6 3.4L6 8.8 3 10.4l.6-3.4L1.1 4.6l3.4-.5z" fill="#fff" /></svg>;
const IBrowser = () => <svg viewBox="0 0 12 12" fill="none"><rect x="1" y="2" width="10" height="8" rx="1" stroke="currentColor" strokeWidth="1" /><path d="M1 5h10" stroke="currentColor" strokeWidth="0.8" /></svg>;
const ISparkles = () => <svg viewBox="0 0 12 12" fill="none"><circle cx="6" cy="4" r="2" stroke="currentColor" strokeWidth="1" /><path d="M2 10c0-2.2 1.8-4 4-4s4 1.8 4 4" stroke="currentColor" strokeWidth="1" /></svg>;
const ISearch = () => <svg viewBox="0 0 12 12" fill="none"><circle cx="5" cy="5" r="3" stroke="currentColor" strokeWidth="1" /><path d="M7.5 7.5L10 10" stroke="currentColor" strokeWidth="1" strokeLinecap="round" /></svg>;
const IPhone = () => <svg viewBox="0 0 12 12" fill="none"><rect x="2" y="1" width="8" height="10" rx="1" stroke="currentColor" strokeWidth="1" /><path d="M5 9h2" stroke="currentColor" strokeWidth="0.8" /></svg>;

const BADGE_ICONS: Record<string, React.FC> = { file: IFile, plus: IPlus, star: IStar, browser: IBrowser, sparkles: ISparkles, search: ISearch, phone: IPhone };
const BADGE_CLS: Record<string, string> = { free: s.fbFree, starter: s.fbStarter, pop: s.fbPop, site: s.fbSite, ia: s.fbIa, ft: s.fbFt, seo: s.fbSeo };
const PT_CLS: Record<string, string> = { free: s.ptFree, green: s.ptGreen, blue: s.ptBlue, purple: s.ptPurple };
const CK_CLS: Record<string, string> = { g: s.ckG, t: s.ckT, b: s.ckB, p: s.ckP };
const SL_CLS: Record<string, string> = { default: "", ft: s.slFt, biz: s.slBiz, ia: s.slIa };
const CTA_CLS: Record<string, string> = { outline: s.ctaO, green: s.ctaG, blue: s.ctaB, purple: s.ctaP };

interface Feature { label: string; check: string; detail?: string; soon?: boolean }
interface Section { label: string; variant: string; features: Feature[] }
interface Badge { label: string; variant: string; icon?: string }
interface Plan {
  id: string; name: string; price: number; description: string;
  promiseTag: { label: string; variant: string };
  badges: Badge[]; featured: boolean;
  cta: { label: string; variant: string };
  sections: Section[];
}

const PLANS: Plan[] = [
  {
    id: "gratuit", name: "Gratuit", price: 0,
    description: "Testez Bativio et commencez à facturer gratuitement",
    promiseTag: { label: "Je découvre", variant: "free" },
    badges: [{ label: "Découverte", variant: "free" }], featured: false,
    cta: { label: "Commencer gratuitement", variant: "outline" },
    sections: [
      { label: "Visibilité", variant: "default", features: [
        { label: "Fiche annuaire", check: "g" },
        { label: "Réception demandes de devis", check: "g" },
        { label: "3 photos chantiers", check: "g" },
      ]},
      { label: "Facturation", variant: "ft", features: [
        { label: "5 factures / mois", check: "t" },
      ]},
    ],
  },
  {
    id: "starter", name: "Starter", price: 19,
    description: "Votre présence en ligne et facturation illimitée, en conformité",
    promiseTag: { label: "J'existe en ligne", variant: "green" },
    badges: [
      { label: "Conformité PA", variant: "starter", icon: "file" },
      { label: "Factures illimitées", variant: "ft", icon: "plus" },
    ], featured: false,
    cta: { label: "Choisir Starter", variant: "green" },
    sections: [
      { label: "Visibilité", variant: "default", features: [
        { label: "Fiche annuaire optimisée", check: "g" },
        { label: "10 photos chantiers", check: "g" },
        { label: "Badges qualifications illimités", check: "g" },
        { label: "Support email", check: "g" },
      ]},
      { label: "Facturation électronique", variant: "ft", features: [
        { label: "Factures + devis illimités", check: "t" },
        { label: "Réception PA", check: "t" },
        { label: "Émission PA", check: "t" },
        { label: "E-reporting automatique", check: "t" },
      ]},
    ],
  },
  {
    id: "pro", name: "Pro", price: 39,
    description: "Votre site internet pro + CRM pour gagner des clients",
    promiseTag: { label: "Je trouve des clients", variant: "blue" },
    badges: [
      { label: "Le + populaire", variant: "pop", icon: "star" },
      { label: "Site internet inclus", variant: "site", icon: "browser" },
    ], featured: true,
    cta: { label: "Choisir Pro", variant: "blue" },
    sections: [
      { label: "Acquisition clients", variant: "biz", features: [
        { label: "Site internet Bativio personnalisé", check: "b" },
        { label: "Avis clients vérifiés", check: "b" },
        { label: "Relances devis automatiques", check: "b" },
        { label: "Agenda & RDV en ligne", check: "b" },
        { label: "CRM clients", check: "b" },
        { label: "Photos illimitées", check: "g" },
        { label: "Support prioritaire", check: "g" },
      ]},
      { label: "Facturation", variant: "ft", features: [
        { label: "Tout Starter inclus", check: "t" },
        { label: "Export comptable (FEC)", check: "t" },
        { label: "Création factures in-app", check: "t" },
      ]},
    ],
  },
  {
    id: "business", name: "Business", price: 59,
    description: "L'IA et le SEO travaillent pour vous, même quand vous êtes sur chantier",
    promiseTag: { label: "Je scale mon activité", variant: "purple" },
    badges: [
      { label: "IA intégrée", variant: "ia", icon: "sparkles" },
      { label: "SEO local", variant: "seo", icon: "search" },
      { label: "SMS inclus", variant: "ft", icon: "phone" },
    ], featured: false,
    cta: { label: "Choisir Business", variant: "purple" },
    sections: [
      { label: "Croissance", variant: "biz", features: [
        { label: "Tout Pro inclus", check: "b" },
        { label: "SEO local optimisé", check: "b" },
        { label: "Mise en avant dans l'annuaire", check: "b" },
        { label: "Multi-utilisateurs", check: "b", soon: true },
        { label: "Stats CA + conversion", check: "b" },
        { label: "SMS notifications", check: "b", detail: "50/mois" },
        { label: "Support prioritaire", check: "g" },
      ]},
      { label: "Intelligence artificielle", variant: "ia", features: [
        { label: "Devis IA automatisé", check: "p" },
        { label: "Agent IA répondeur", check: "p" },
        { label: "Reporting intelligent", check: "p" },
      ]},
      { label: "Facturation", variant: "ft", features: [
        { label: "Tout Pro inclus", check: "t" },
      ]},
    ],
  },
];

export default function PricingGrid() {
  const [annual, setAnnual] = useState(false);

  const getPrice = (m: number) => annual ? Math.round(m * 0.83) : m;

  return (
    <section className={s.pg}>
      {/* Conformity bar */}
      <div className={s.cb}>
        <div className={s.ci}><FlagFR /> Conforme réforme 2026</div>
        <div className={s.ci}><FlagEU /> Norme européenne e-invoicing</div>
        <div className={s.ci}>
          <span className={s.cick}><Chk /></span>
          Connecté PA certifiée par l&apos;État
        </div>
      </div>

      {/* Toggle */}
      <div className={s.tw}>
        <span className={`${s.tl} ${!annual ? s.tlOn : ""}`} onClick={() => setAnnual(false)}>Mensuel</span>
        <div className={`${s.tr} ${annual ? s.trOn : ""}`} onClick={() => setAnnual(!annual)}>
          <div className={`${s.th} ${annual ? s.thOn : ""}`} />
        </div>
        <span className={`${s.tl} ${annual ? s.tlOn : ""}`} onClick={() => setAnnual(true)}>Annuel</span>
        <span className={`${s.sv} ${annual ? s.svShow : ""}`}>2 mois offerts</span>
      </div>

      {/* Plans grid */}
      <div className={s.plans}>
        {PLANS.map((plan) => {
          const price = getPrice(plan.price);
          return (
            <div key={plan.id} className={`${s.plan} ${plan.featured ? s.planFeat : ""}`}>
              {plan.featured && <div className={s.ptop}>Recommandé</div>}

              <div className={`${s.pt} ${PT_CLS[plan.promiseTag.variant] || ""}`} style={plan.featured ? { marginTop: 6 } : undefined}>
                {plan.promiseTag.label}
              </div>
              <div className={s.pn}>{plan.name}</div>
              <div className={s.pp}>
                <span className={s.am}>{plan.price === 0 ? "0€" : `${price}€`}</span>
                {plan.price > 0 && <span className={s.pe}>/mois</span>}
              </div>
              <div className={s.ps}>
                {annual && plan.price > 0
                  ? `2 mois offerts · ${price * 12}€/an au lieu de ${plan.price * 12}€`
                  : "\u00A0"}
              </div>
              <div className={s.pd}>{plan.description}</div>

              {/* Badges */}
              <div className={s.br}>
                {plan.badges.map((b) => {
                  const Icon = b.icon ? BADGE_ICONS[b.icon] : null;
                  return <span key={b.label} className={`${s.fb} ${BADGE_CLS[b.variant] || ""}`}>{Icon && <Icon />} {b.label}</span>;
                })}
              </div>

              {/* Sections */}
              {plan.sections.map((sec, si) => (
                <div key={si}>
                  <div className={`${s.sl} ${SL_CLS[sec.variant] || ""}`}>{sec.label}</div>
                  <ul className={s.fl}>
                    {sec.features.map((f) => (
                      <li key={f.label} className={s.fi}>
                        <span className={`${s.ck} ${CK_CLS[f.check] || ""}`}><Chk /></span>
                        {f.label}
                        {f.soon && <span className={s.soon}>bientôt</span>}
                        {f.detail && !f.soon && <span className={s.fd}>{f.detail}</span>}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}

              {/* CTA */}
              <div className={s.pcta}>
                <Link href={plan.id === "gratuit" ? "/inscription" : "/inscription"} className={`${s.ctaBtn} ${CTA_CLS[plan.cta.variant] || ""}`}>
                  {plan.cta.label} <Arrow />
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      <p className={s.pf}>Sans engagement · Sans commission · Zéro frais cachés · Annulable à tout moment</p>
    </section>
  );
}
