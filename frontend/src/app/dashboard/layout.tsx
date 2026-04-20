"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import { getEffectivePlan, getModuleBadge, PLAN_LABELS, type PlanId } from "@/lib/plan-gates";

const ICON_STAR = '<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 16.8l-6.2 4.5 2.4-7.4L2 9.4h7.6z"/></svg>';

const NAV: { href: string; label: string; icon: string; badge?: string; sep?: boolean }[] = [
  { href: "/dashboard", label: "Tableau de bord", icon: '<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>' },
  { href: "/dashboard/agenda", label: "Planning", icon: '<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>' },
  { href: "/dashboard/profil", label: "Mon profil", icon: '<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 4-7 8-7s8 3 8 7"/></svg>' },
  { href: "/dashboard/vitrine", label: "Ma vitrine", icon: '<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/></svg>' },
  { href: "/dashboard/photos", label: "Mes photos", icon: '<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>' },
  { href: "/dashboard/demandes", label: "Demandes", icon: '<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>' },
  { href: "/dashboard/demandes-projets", label: "Projets IA", icon: '<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M9.937 15.5A2 2 0 008.5 14.063l-6.135-1.582a.5.5 0 010-.962L8.5 9.937A2 2 0 009.937 8.5l1.582-6.135a.5.5 0 01.962 0L14.063 8.5A2 2 0 0015.5 9.937l6.135 1.582a.5.5 0 010 .962L15.5 14.063a2 2 0 00-1.437 1.437l-1.582 6.135a.5.5 0 01-.962 0L9.937 15.5z"/></svg>' },
  { href: "/dashboard/tarifs", label: "Mes tarifs", icon: '<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M12 1v22M17 5H9.5a3.5 3.5 0 100 7h5a3.5 3.5 0 010 7H6"/></svg>' },
  { href: "/dashboard/devis-ia", label: "Devis IA", icon: '<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M9.937 15.5A2 2 0 008.5 14.063l-6.135-1.582a.5.5 0 010-.962L8.5 9.937A2 2 0 009.937 8.5l1.582-6.135a.5.5 0 01.962 0L14.063 8.5A2 2 0 0015.5 9.937l6.135 1.582a.5.5 0 010 .962L15.5 14.063a2 2 0 00-1.437 1.437l-1.582 6.135a.5.5 0 01-.962 0L9.937 15.5z"/><path d="M3.5 2v3M2 3.5h3M5 18v2.5M3.75 19.25h2.5"/></svg>' },
  { href: "/dashboard/facturation", label: "Facturation", icon: '<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/></svg>' },
  // Séparateur avant paramètres et abonnement
  { href: "/dashboard/abonnement", label: "Mon abonnement", icon: ICON_STAR, sep: true },
  { href: "/dashboard/parametres", label: "Paramètres", icon: '<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>' },
];

function getInitials(name: string): string {
  if (!name) return "?";
  const words = name.trim().split(/\s+/);
  if (words.length === 1) return words[0].charAt(0).toUpperCase();
  return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
}

function getPlanLabel(plan: string): string {
  const p = (plan || "GRATUIT").toUpperCase();
  if (p === "BUSINESS" || p === "PRO_PLUS") return "Business";
  if (p === "PRO") return "Pro";
  if (p === "STARTER" || p === "ESSENTIEL") return "Starter";
  return "Gratuit";
}

function getPlanBadgeStyle(plan: string): React.CSSProperties {
  const p = (plan || "GRATUIT").toUpperCase();
  if (p === "BUSINESS" || p === "PRO_PLUS") return { background: "var(--bois,#3D2E1F)", color: "var(--sable-light,#F2EAE0)" };
  if (p === "PRO") return { background: "var(--terre,#C4531A)", color: "#fff" };
  if (p === "STARTER" || p === "ESSENTIEL") return { background: "rgba(196,83,26,.08)", color: "var(--terre,#C4531A)" };
  return { background: "var(--sable-light,#F2EAE0)", color: "var(--pierre,#9C958D)" };
}

const MOB = [
  { href: "/dashboard", label: "Accueil", icon: '<svg width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>' },
  { href: "/dashboard/demandes", label: "Demandes", icon: '<svg width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>' },
  { href: "/dashboard/facturation", label: "Factures", icon: '<svg width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/><path d="M9 14h.01M13 14h2M9 18h.01M13 18h2"/></svg>' },
  { href: "/dashboard/devis-ia", label: "Devis IA", icon: '<svg width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M9.937 15.5A2 2 0 008.5 14.063l-6.135-1.582a.5.5 0 010-.962L8.5 9.937A2 2 0 009.937 8.5l1.582-6.135a.5.5 0 01.962 0L14.063 8.5A2 2 0 0015.5 9.937l6.135 1.582a.5.5 0 010 .962L15.5 14.063a2 2 0 00-1.437 1.437l-1.582 6.135a.5.5 0 01-.962 0L9.937 15.5z"/></svg>' },
];

function slugifyVille(ville: string): string {
  return ville.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/\s+/g, "-");
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const p = usePathname();
  const router = useRouter();
  const { user, logout, fetchWithAuth } = useAuth();
  const [newDemandesCount, setNewDemandesCount] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Compute effective plan for module gating badges
  const effectivePlan = getEffectivePlan({
    plan: (user?.plan as string) || "GRATUIT",
    planOverride: (user as Record<string, unknown> | null)?.planOverride as string | null,
    planOverrideExpireAt: (user as Record<string, unknown> | null)?.planOverrideExpireAt as string | null,
  });

  // Redirect to scoring if artisan is still in ONBOARDING
  useEffect(() => {
    const status = (user as Record<string, unknown> | null)?.artisanStatus as string | undefined;
    if (status === "ONBOARDING") {
      router.replace("/onboarding/validation");
    } else if (status === "PENDING_REVIEW") {
      router.replace("/onboarding/validation");
    }
  }, [user, router]);

  useEffect(() => {
    fetchWithAuth("/artisan/demandes?status=NOUVEAU&size=0")
      .then((data) => {
        const d = data as { pagination?: { total?: number } };
        setNewDemandesCount(d.pagination?.total || 0);
      })
      .catch(() => {});
  }, [fetchWithAuth, p]); // re-fetch when navigating

  const handleLogout = () => {
    logout();
    router.replace("/connexion");
  };

  const vitrineSlug = user?.slug || "";
  const vitrineVille = user?.ville ? slugifyVille(user.ville) : "";
  const vitrineHref = vitrineSlug && vitrineVille ? `/${vitrineVille}/${vitrineSlug}` : "#";

  return (
    <ProtectedRoute>
      <div style={{ display: "flex", minHeight: "100vh", background: "#FAF8F5" }}>
        {/* Sidebar desktop */}
        <aside style={{ width: 252, flexShrink: 0, background: "var(--blanc,#fff)", borderRight: "1px solid var(--sable,#E8D5C0)", flexDirection: "column", height: "100vh", position: "sticky", top: 0, overflow: "hidden" }} className="hidden md:!flex">
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, fontFamily: "'Fraunces',serif", fontSize: 22, fontWeight: 700, color: "#C4531A", textDecoration: "none", padding: "20px 16px 0 24px", marginBottom: 20, letterSpacing: -0.5, flexShrink: 0 }}>
            <img src="/icons/icon.svg" alt="" width={26} height={26} style={{ flexShrink: 0 }} />
            <span><span style={{ color: "#1C1C1E" }}>B</span>ativio</span>
          </Link>
          <nav style={{ flex: 1, minHeight: 0, overflowY: "auto", display: "flex", flexDirection: "column", gap: 2, padding: "0 12px" }}>
            {NAV.map((item) => {
              const active = p === item.href;
              return (
                <div key={item.href}>
                  {item.sep && <div style={{ height: 1, background: "#F7F5F2", margin: "14px 8px" }} />}
                  <Link href={item.href} prefetch={false} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", borderRadius: 10, fontSize: 14, fontWeight: active ? 600 : 500, color: active ? "#C4531A" : "#6B6560", background: active ? "rgba(196,83,26,.08)" : "transparent", textDecoration: "none", transition: "all .15s" }}>
                    <span dangerouslySetInnerHTML={{ __html: item.icon }} style={{ display: "flex", flexShrink: 0, width: 20, height: 20 }} />
                    {item.label}
                    {(() => {
                      const badge = getModuleBadge(effectivePlan, item.href);
                      if (!badge) return null;
                      const colors: Record<string, { bg: string; color: string }> = {
                        starter: { bg: "rgba(59,125,216,.08)", color: "#3B7DD8" },
                        pro: { bg: "rgba(196,83,26,.06)", color: "#C4531A" },
                        business: { bg: "rgba(232,168,76,.1)", color: "#C9943A" },
                      };
                      const c = colors[badge] || colors.starter;
                      return <span style={{ marginLeft: "auto", fontSize: 10, fontWeight: 600, padding: "3px 8px", borderRadius: 6, background: c.bg, color: c.color, letterSpacing: 0.2 }}>{PLAN_LABELS[badge]}</span>;
                    })()}
                    {item.href === "/dashboard/demandes" && newDemandesCount > 0 && <span style={{ marginLeft: "auto", minWidth: 20, height: 20, borderRadius: 10, background: "#dc2626", color: "#fff", fontSize: 11, fontWeight: 700, display: "inline-flex", alignItems: "center", justifyContent: "center", padding: "0 6px" }}>{newDemandesCount}</span>}
                  </Link>
                </div>
              );
            })}
          </nav>
          {/* User block — always visible at bottom */}
          <div style={{ flexShrink: 0, borderTop: "1px solid var(--sable,#E8D5C0)", padding: "10px 14px 12px", background: "var(--creme,#FAF8F5)" }}>
            {/* Avatar + name + plan — compact */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0" }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg, var(--terre,#C4531A), var(--argile,#D4956B))", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ fontFamily: "'Fraunces',serif", fontSize: 12, fontWeight: 700, color: "#fff", lineHeight: 1 }}>{getInitials(user?.nomAffichage || "")}</span>
              </div>
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--bois,#3D2E1F)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user?.nomAffichage || "Artisan"}</div>
                <span style={{ fontSize: 10, fontWeight: 600, padding: "1px 6px", borderRadius: 4, ...getPlanBadgeStyle(user?.plan || "GRATUIT") }}>{getPlanLabel(user?.plan || "GRATUIT")}</span>
              </div>
              <Link href="/dashboard/parametres" style={{ fontSize: 11, color: "var(--terre,#C4531A)", fontWeight: 500, textDecoration: "none", flexShrink: 0 }}>&uarr;</Link>
            </div>

            {/* Voir ma page */}
            {vitrineHref !== "#" && user?.actif && (
              <Link href={vitrineHref} target="_blank" style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--terre,#C4531A)", fontWeight: 600, textDecoration: "none", padding: "5px 0", transition: "color .15s" }}>
                <span dangerouslySetInnerHTML={{ __html: '<svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15,3 21,3 21,9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>' }} style={{ display: "flex", flexShrink: 0 }} />
                Voir ma page
              </Link>
            )}
            {vitrineHref !== "#" && !user?.actif && (
              <span style={{ fontSize: 12, color: "var(--pierre,#9C958D)", fontStyle: "italic", display: "block", padding: "5px 0" }}>Page visible apr&egrave;s validation</span>
            )}

            {/* Déconnexion */}
            <button onClick={handleLogout} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--pierre,#9C958D)", fontWeight: 500, background: "none", border: "none", cursor: "pointer", textAlign: "left", padding: "5px 0", transition: "color .15s", fontFamily: "'Karla',sans-serif" }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "var(--terre,#C4531A)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "var(--pierre,#9C958D)"; }}
            >
              <span dangerouslySetInnerHTML={{ __html: '<svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16,17 21,12 16,7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>' }} style={{ display: "flex", flexShrink: 0 }} />
              Se d&eacute;connecter
            </button>
          </div>
        </aside>

        {/* Main */}
        <div style={{ flex: 1, paddingBottom: 72 }} className="md:pb-0">
          <main style={{ padding: "28px 32px", maxWidth: 1000, margin: "0 auto" }} className="max-md:!px-4 max-md:!pt-4 max-md:!pb-24">{children}</main>
        </div>

        {/* Mobile nav — safe area aware */}
        <nav style={{ position: "fixed", bottom: 0, left: 0, right: 0, paddingBottom: "env(safe-area-inset-bottom, 0px)", height: "calc(60px + env(safe-area-inset-bottom, 0px))", background: "rgba(255,255,255,.96)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", borderTop: "1.5px solid #EDEBE7", zIndex: 50 }} className="flex md:!hidden">
          {MOB.map((item) => (
            <Link key={item.href} href={item.href} prefetch={false} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 3, fontSize: 10, fontWeight: p === item.href ? 600 : 500, color: p === item.href ? "#C4531A" : "#9B9590", textDecoration: "none", transition: "color .15s" }}>
              <span dangerouslySetInnerHTML={{ __html: item.icon }} style={{ display: "flex" }} />
              {item.label}
            </Link>
          ))}
          {/* Plus / Menu button */}
          <button onClick={() => setMobileMenuOpen(true)} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 3, fontSize: 10, fontWeight: 500, color: mobileMenuOpen ? "#C4531A" : "#9B9590", background: "none", border: "none", cursor: "pointer", fontFamily: "'Karla',sans-serif" }}>
            <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/></svg>
            Plus
          </button>
        </nav>

        {/* Mobile menu drawer */}
        {mobileMenuOpen && (
          <div style={{ position: "fixed", inset: 0, zIndex: 100, flexDirection: "column", justifyContent: "flex-end" }} className="flex md:!hidden" onClick={(e) => { if (e.target === e.currentTarget) setMobileMenuOpen(false); }}>
            <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,.3)" }} />
            <div style={{ position: "relative", background: "#fff", borderRadius: "16px 16px 0 0", padding: "20px 20px 100px", maxHeight: "70vh", overflowY: "auto" }}>
              {/* User info */}
              <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 0 16px", borderBottom: "1px solid var(--sable,#E8D5C0)" }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: "linear-gradient(135deg, var(--terre,#C4531A), var(--argile,#D4956B))", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <span style={{ fontFamily: "'Fraunces',serif", fontSize: 14, fontWeight: 700, color: "#fff" }}>{getInitials(user?.nomAffichage || "")}</span>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 600, color: "var(--bois,#3D2E1F)" }}>{user?.nomAffichage || "Artisan"}</div>
                  <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 4, ...getPlanBadgeStyle(user?.plan || "GRATUIT") }}>{getPlanLabel(user?.plan || "GRATUIT")}</span>
                </div>
                <button onClick={() => setMobileMenuOpen(false)} style={{ width: 32, height: 32, borderRadius: 8, background: "var(--sable-light,#F2EAE0)", border: "none", cursor: "pointer", fontSize: 18, color: "var(--pierre,#9C958D)", display: "flex", alignItems: "center", justifyContent: "center" }}>&times;</button>
              </div>

              {/* Quick links */}
              <div style={{ padding: "12px 0", display: "flex", flexDirection: "column", gap: 4 }}>
                {[
                  { href: "/dashboard/profil", label: "Mon profil" },
                  { href: "/dashboard/agenda", label: "Planning" },
                  { href: "/dashboard/vitrine", label: "Ma vitrine" },
                  { href: "/dashboard/photos", label: "Mes photos" },
                  { href: "/dashboard/abonnement", label: "Mon abonnement" },
                  { href: "/dashboard/parametres", label: "Param\u00e8tres" },
                ].map((l) => (
                  <Link key={l.href} href={l.href} prefetch={false} onClick={() => setMobileMenuOpen(false)} style={{ display: "block", padding: "12px 4px", fontSize: 15, fontWeight: 500, color: "var(--bois,#3D2E1F)", textDecoration: "none", borderBottom: "1px solid var(--sable-light,#F2EAE0)" }}>
                    {l.label}
                  </Link>
                ))}
              </div>

              {/* Voir ma page */}
              {vitrineHref !== "#" && user?.actif && (
                <Link href={vitrineHref} target="_blank" onClick={() => setMobileMenuOpen(false)} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, color: "var(--terre,#C4531A)", fontWeight: 600, textDecoration: "none", padding: "12px 4px" }}>
                  Voir ma page &rarr;
                </Link>
              )}

              {/* Se déconnecter */}
              <button onClick={() => { setMobileMenuOpen(false); handleLogout(); }} style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", fontSize: 14, color: "var(--pierre,#9C958D)", fontWeight: 500, background: "none", border: "none", cursor: "pointer", textAlign: "left", padding: "12px 4px", fontFamily: "'Karla',sans-serif" }}>
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16,17 21,12 16,7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                Se d&eacute;connecter
              </button>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
