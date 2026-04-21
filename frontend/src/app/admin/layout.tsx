"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: '<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>' },
  { href: "/admin/demandes-projets", label: "Demandes projets", icon: '<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M3 8l9 6 9-6M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>' },
  { href: "/admin/artisans", label: "Artisans", icon: '<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 4-7 8-7s8 3 8 7"/></svg>' },
  { href: "/admin/villes", label: "Villes", icon: '<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M3 21h18M5 21V7l8-4v18M13 21V3l6 3v15"/><path d="M9 9h1M9 13h1M9 17h1"/></svg>' },
  { href: "/admin/metiers", label: "Métiers", icon: '<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/></svg>' },
  { href: "/admin/seo", label: "Contenu SEO", icon: '<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/></svg>' },
  { href: "/admin/abonnements", label: "Abonnements", icon: '<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><rect x="1" y="4" width="22" height="16" rx="2"/><path d="M1 10h22"/></svg>' },
  { href: "/admin/validations", label: "Validations", icon: '<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="10"/></svg>' },
  { href: "/admin/statistiques", label: "Statistiques", icon: '<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M18 20V10M12 20V4M6 20v-6"/></svg>' },
  { href: "/admin/couts-ia", label: "Coûts IA", icon: '<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>' },
  { href: "/admin/parametres", label: "Param\u00e8tres", icon: '<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <ProtectedRoute requireAdmin>
      <div style={{ display: "flex", minHeight: "100dvh", background: "#FAF8F5" }}>
        <aside style={{ width: 260, flexShrink: 0, background: "#1C1C1E", display: "flex", flexDirection: "column", height: "100dvh", position: "sticky", top: 0, overflow: "hidden" }} className="hidden md:flex">
          <Link href="/admin" style={{ textDecoration: "none", padding: "24px 16px 0 30px", marginBottom: 36, display: "flex", alignItems: "baseline", gap: 8, flexShrink: 0 }}>
            <span style={{ fontFamily: "'Fraunces',serif", fontSize: 18, fontWeight: 700, color: "#fff", letterSpacing: -0.3 }}>Bativio</span>
            <span style={{ fontSize: 11, color: "rgba(255,255,255,.4)", fontWeight: 500 }}>Admin</span>
          </Link>
          <nav style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 2, padding: "0 16px" }}>
            {navItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  style={{
                    display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", borderRadius: 10,
                    fontSize: 14, fontWeight: active ? 600 : 500,
                    color: active ? "#fff" : "rgba(255,255,255,.6)",
                    background: active ? "rgba(255,255,255,.08)" : "transparent",
                    borderLeft: active ? "3px solid #C4531A" : "3px solid transparent",
                    textDecoration: "none", transition: "all .15s",
                  }}
                >
                  <span dangerouslySetInnerHTML={{ __html: item.icon }} style={{ display: "flex", flexShrink: 0, width: 20, height: 20 }} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div style={{ flexShrink: 0, borderTop: "1px solid rgba(255,255,255,.08)", padding: "16px 16px 20px" }}>
            <button
              onClick={handleLogout}
              className="admin-logout-btn"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "10px 14px",
                borderRadius: 10,
                fontSize: 13,
                fontWeight: 600,
                color: "rgba(255,255,255,.4)",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                width: "100%",
                transition: "all .15s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "#DC2626"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,255,255,.4)"; }}
            >
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" /></svg>
              Se déconnecter
            </button>
          </div>
        </aside>
        <div style={{ flex: 1 }}>
          <header style={{ background: "#fff", borderBottom: "1.5px solid #EDEBE7", padding: "16px 32px" }}>
            <p style={{ fontSize: 14, color: "var(--pierre,#9C958D)", fontWeight: 500 }}>Tableau de bord &middot; Vue d&apos;ensemble de votre plateforme</p>
          </header>
          <main style={{ padding: "28px 32px", maxWidth: 1200, margin: "0 auto" }} className="max-md:p-4">{children}</main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
