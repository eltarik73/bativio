"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/components/AuthProvider";
import { logout, getAccessToken } from "@/lib/auth";

const NAV: { href: string; label: string; icon: string; badge?: string; sep?: boolean }[] = [
  { href: "/dashboard", label: "Tableau de bord", icon: '<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>' },
  { href: "/dashboard/profil", label: "Mon profil", icon: '<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 4-7 8-7s8 3 8 7"/></svg>' },
  { href: "/dashboard/vitrine", label: "Ma vitrine", icon: '<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/></svg>', badge: "Pro" },
  { href: "/dashboard/photos", label: "Mes photos", icon: '<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>' },
  { href: "/dashboard/devis", label: "Demandes de devis", icon: '<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/></svg>' },
  { href: "/dashboard/facturation", label: "Facturation", icon: '<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/><path d="M9 14h.01M13 14h2M9 18h.01M13 18h2"/></svg>', badge: "Bient\u00f4t" },
  { href: "/dashboard/rdv", label: "Mes RDV", icon: '<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>' },
  { href: "/dashboard/parametres", label: "Param\u00e8tres", icon: '<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>', sep: true },
];

const MOB = [
  { href: "/dashboard", label: "Accueil", icon: '<svg width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>' },
  { href: "/dashboard/profil", label: "Profil", icon: '<svg width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 4-7 8-7s8 3 8 7"/></svg>' },
  { href: "/dashboard/devis", label: "Devis", icon: '<svg width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6"/></svg>' },
  { href: "/dashboard/photos", label: "Photos", icon: '<svg width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>' },
  { href: "/dashboard/facturation", label: "Factures", icon: '<svg width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/></svg>' },
];

function slugifyVille(ville: string): string {
  return ville.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "-");
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const p = usePathname();
  const router = useRouter();
  const { isAuth, loading, artisan } = useAuth();

  // Auth guard: redirect to /connexion if not authenticated.
  // We check multiple sources before redirecting: React context, in-memory token,
  // AND localStorage token. This prevents false redirects during page refresh.
  useEffect(() => {
    if (!loading && !isAuth && !getAccessToken()) {
      // Final check: localStorage might still have a valid refresh token
      const hasRefresh = typeof window !== "undefined" && !!localStorage.getItem("bativio_refresh");
      if (!hasRefresh) {
        router.replace("/connexion");
      }
    }
  }, [loading, isAuth, router]);

  // Show loading state while checking auth.
  // Also treat "has token in memory but context not yet updated" as loading.
  // Check localStorage refresh token too — during page refresh, in-memory token
  // is null but localStorage still holds the session.
  const hasRefreshToken = typeof window !== "undefined" && !!localStorage.getItem("bativio_refresh");
  if (loading || (!isAuth && (getAccessToken() || hasRefreshToken))) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: "#FAF8F5" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontFamily: "'Fraunces',serif", fontSize: 24, fontWeight: 700, color: "#C4531A", marginBottom: 12 }}>Bativio</div>
          <div style={{ fontSize: 14, color: "#9B9590" }}>Chargement...</div>
        </div>
      </div>
    );
  }

  // Don't render dashboard if not authenticated (redirect is in progress)
  if (!isAuth) {
    return null;
  }

  const vitrineSlug = artisan?.slug || "";
  const vitrineVille = artisan?.ville ? slugifyVille(artisan.ville) : "";
  const vitrineHref = vitrineSlug && vitrineVille ? `/${vitrineVille}/${vitrineSlug}` : "#";

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#FAF8F5" }}>
      {/* Sidebar desktop */}
      <aside style={{ width: 252, flexShrink: 0, background: "#fff", borderRight: "1.5px solid #EDEBE7", padding: "24px 16px 20px", display: "flex", flexDirection: "column" }} className="hidden md:flex">
        <Link href="/" style={{ fontFamily: "'Fraunces',serif", fontSize: 22, fontWeight: 700, color: "#C4531A", textDecoration: "none", marginBottom: 36, paddingLeft: 14, display: "block", letterSpacing: -0.5 }}>Bativio</Link>
        <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
          {NAV.map((item) => {
            const active = p === item.href;
            return (
              <div key={item.href}>
                {item.sep && <div style={{ height: 1, background: "#F7F5F2", margin: "14px 8px" }} />}
                <Link href={item.href} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", borderRadius: 10, fontSize: 14, fontWeight: active ? 600 : 500, color: active ? "#C4531A" : "#6B6560", background: active ? "rgba(196,83,26,.08)" : "transparent", textDecoration: "none", transition: "all .15s" }}>
                  <span dangerouslySetInnerHTML={{ __html: item.icon }} style={{ display: "flex", flexShrink: 0, width: 20, height: 20 }} />
                  {item.label}
                  {item.badge === "Bient\u00f4t" && <span style={{ marginLeft: "auto", fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 6, background: "rgba(232,168,76,.12)", color: "#E8A84C", letterSpacing: 0.2 }}>{item.badge}</span>}
                  {item.badge && item.badge !== "Bient\u00f4t" && <span style={{ marginLeft: "auto", fontSize: 10, fontWeight: 600, padding: "3px 10px", borderRadius: 6, background: "rgba(196,83,26,.06)", color: "#C4531A", letterSpacing: 0.2 }}>{item.badge}</span>}
                </Link>
              </div>
            );
          })}
        </nav>
        <div style={{ borderTop: "1.5px solid #F7F5F2", paddingTop: 16, display: "flex", flexDirection: "column", gap: 10, paddingLeft: 14 }}>
          {vitrineHref !== "#" && (
            <Link href={vitrineHref} target="_blank" style={{ fontSize: 13, color: "#C4531A", fontWeight: 600, textDecoration: "none", transition: "color .15s" }}>Voir ma page &rarr;</Link>
          )}
          <button onClick={() => logout()} style={{ fontSize: 13, color: "#9B9590", fontWeight: 500, background: "none", border: "none", cursor: "pointer", textAlign: "left", padding: 0, transition: "color .15s" }}>Se d&eacute;connecter</button>
        </div>
      </aside>

      {/* Main */}
      <div style={{ flex: 1, paddingBottom: 72 }} className="md:pb-0">
        <main style={{ padding: "28px 32px", maxWidth: 1000, margin: "0 auto" }} className="max-md:p-4">{children}</main>
      </div>

      {/* Mobile nav */}
      <nav style={{ position: "fixed", bottom: 0, left: 0, right: 0, height: 60, background: "rgba(255,255,255,.96)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", borderTop: "1.5px solid #EDEBE7", display: "flex", zIndex: 50 }} className="md:hidden">
        {MOB.map((item) => (
          <Link key={item.href} href={item.href} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 3, fontSize: 10, fontWeight: p === item.href ? 600 : 500, color: p === item.href ? "#C4531A" : "#9B9590", textDecoration: "none", transition: "color .15s" }}>
            <span dangerouslySetInnerHTML={{ __html: item.icon }} style={{ display: "flex" }} />
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
