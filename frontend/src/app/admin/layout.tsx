"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: "&#128202;" },
  { href: "/admin/artisans", label: "Artisans", icon: "&#128100;" },
  { href: "/admin/villes", label: "Villes", icon: "&#127961;" },
  { href: "/admin/metiers", label: "M\u00e9tiers", icon: "&#128295;" },
  { href: "/admin/seo", label: "Contenu SEO", icon: "&#128196;" },
  { href: "/admin/abonnements", label: "Abonnements", icon: "&#128179;" },
  { href: "/admin/statistiques", label: "Statistiques", icon: "&#128200;" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuth, loading, artisan } = useAuth();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (!isAuth) {
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
    <div className="flex min-h-screen bg-g50">
      <aside className="hidden md:flex flex-col w-64 bg-anthracite text-white p-6">
        <Link href="/admin" className="font-display text-xl font-bold text-or mb-8">
          Bativio Admin
        </Link>
        <nav className="flex-1 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                pathname === item.href
                  ? "bg-white/10 text-white font-medium"
                  : "text-white/50 hover:bg-white/5 hover:text-white/80"
              }`}
            >
              <span dangerouslySetInnerHTML={{ __html: item.icon }} />
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <div className="flex-1">
        <header className="bg-white border-b border-g100 px-6 py-4">
          <p className="text-sm text-g400">Administration Bativio</p>
        </header>
        <main className="p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
