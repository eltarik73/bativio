"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { getAccessToken } from "@/lib/auth";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: '<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>' },
  { href: "/admin/artisans", label: "Artisans", icon: '<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 4-7 8-7s8 3 8 7"/></svg>' },
  { href: "/admin/villes", label: "Villes", icon: '<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M3 21h18M5 21V7l8-4v18M13 21V3l6 3v15"/><path d="M9 9h1M9 13h1M9 17h1"/></svg>' },
  { href: "/admin/metiers", label: "M\u00e9tiers", icon: '<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/></svg>' },
  { href: "/admin/seo", label: "Contenu SEO", icon: '<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/></svg>' },
  { href: "/admin/abonnements", label: "Abonnements", icon: '<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><rect x="1" y="4" width="22" height="16" rx="2"/><path d="M1 10h22"/></svg>' },
  { href: "/admin/statistiques", label: "Statistiques", icon: '<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M18 20V10M12 20V4M6 20v-6"/></svg>' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuth, loading, artisan } = useAuth();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    if (loading) return;
    // Don't redirect if we have a token in memory (state might not be committed yet)
    if (!isAuth && !getAccessToken()) {
      router.push("/connexion");
      return;
    }
    if (artisan?.role !== "ADMIN") {
      router.push("/dashboard");
      return;
    }
    setAuthorized(true);
  }, [isAuth, loading, artisan, router]);

  if (loading || !authorized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-g50">
        <p className="text-sm text-g400">Chargement...</p>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#FAF8F5" }}>
      <aside style={{ width: 260, flexShrink: 0, background: "#1C1C1E", padding: "24px 16px 20px", display: "flex", flexDirection: "column" }} className="hidden md:flex">
        <Link href="/admin" style={{ fontFamily: "'Fraunces',serif", fontSize: 20, fontWeight: 700, color: "#E8A84C", textDecoration: "none", marginBottom: 36, paddingLeft: 14, display: "block", letterSpacing: -0.3 }}>
          Bativio Admin
        </Link>
        <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", borderRadius: 10,
                  fontSize: 14, fontWeight: active ? 600 : 500,
                  color: active ? "#fff" : "rgba(255,255,255,.5)",
                  background: active ? "rgba(255,255,255,.12)" : "transparent",
                  textDecoration: "none", transition: "all .15s",
                }}
              >
                <span dangerouslySetInnerHTML={{ __html: item.icon }} style={{ display: "flex", flexShrink: 0, width: 20, height: 20 }} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
      <div style={{ flex: 1 }}>
        <header style={{ background: "#fff", borderBottom: "1.5px solid #EDEBE7", padding: "16px 32px" }}>
          <p style={{ fontSize: 14, color: "#9B9590", fontWeight: 500 }}>Administration Bativio</p>
        </header>
        <main style={{ padding: "28px 32px", maxWidth: 1200, margin: "0 auto" }} className="max-md:p-4">{children}</main>
      </div>
    </div>
  );
}
