"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems: { href: string; label: string; icon: string; badge?: string }[] = [
  { href: "/dashboard", label: "Tableau de bord", icon: "&#9776;" },
  { href: "/dashboard/profil", label: "Mon profil", icon: "&#128100;" },
  { href: "/dashboard/photos", label: "Mes photos", icon: "&#128247;" },
  { href: "/dashboard/devis", label: "Demandes de devis", icon: "&#128196;" },
  { href: "/dashboard/facturation", label: "Facturation", icon: "&#128203;", badge: "Bient\u00f4t" },
  { href: "/dashboard/rdv", label: "Mes RDV", icon: "&#128197;" },
  { href: "/dashboard/parametres", label: "Param\u00e8tres", icon: "&#9881;" },
];

const mobileNav = [
  { href: "/dashboard", label: "Accueil", icon: "&#9776;" },
  { href: "/dashboard/photos", label: "Photos", icon: "&#128247;" },
  { href: "/dashboard/devis", label: "Devis", icon: "&#128196;" },
  { href: "/dashboard/rdv", label: "RDV", icon: "&#128197;" },
  { href: "/dashboard/profil", label: "Profil", icon: "&#128100;" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-creme">
      {/* Sidebar desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-g100 p-6">
        <Link href="/" className="font-display text-xl font-bold text-terre mb-8">
          Bativio
        </Link>
        <nav className="flex-1 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                pathname === item.href
                  ? "bg-[rgba(196,83,26,.07)] text-terre font-medium"
                  : "text-g400 hover:bg-g50 hover:text-anthracite"
              }`}
            >
              <span dangerouslySetInnerHTML={{ __html: item.icon }} />
              {item.label}
              {item.badge && <span style={{ marginLeft: "auto", fontSize: 9, fontWeight: 600, padding: "2px 7px", borderRadius: 10, background: "rgba(232,168,76,.12)", color: "#E8A84C" }}>{item.badge}</span>}
            </Link>
          ))}
        </nav>
        <div className="pt-4 border-t border-black/5 mt-4">
          <Link
            href="/chambery/martin-plomberie"
            target="_blank"
            className="flex items-center gap-2 text-sm text-g400 hover:text-terre transition-colors"
          >
            &#8599; Voir ma page
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 pb-20 md:pb-0">
        <header className="bg-white border-b border-g100 px-6 py-4">
          <p className="text-sm text-g400">Bonjour !</p>
        </header>
        <main className="p-4 md:p-8">{children}</main>
      </div>

      {/* Bottom nav mobile */}
      <nav className="fixed bottom-0 left-0 right-0 md:hidden bg-white border-t border-g100 flex z-50">
        {mobileNav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex-1 flex flex-col items-center py-3 text-xs ${
              pathname === item.href ? "text-terre" : "text-g400"
            }`}
          >
            <span dangerouslySetInnerHTML={{ __html: item.icon }} className="text-lg" />
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
