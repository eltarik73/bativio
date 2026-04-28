/**
 * Layout commun /pro/* : cluster B2B SEO pour artisans.
 *
 * - Nav laterale (5 liens cluster + glossaire futur)
 * - Breadcrumb auto
 * - CTA persistant en bas
 * - Footer SEO specifique cluster
 */
import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: { template: "%s | Bativio Pro", default: "Bativio Pro — Artisans BTP" },
};

const NAV_PRO = [
  { href: "/pro", label: "Vue d'ensemble" },
  { href: "/pro/facturation-electronique-2026", label: "Réforme 2026" },
  { href: "/pro/plateforme-agreee-artisan", label: "Plateforme agréée" },
  { href: "/pro/comparatif-pa", label: "Comparatif PA" },
  { href: "/pro/facture-electronique-btp", label: "Spécificités BTP" },
  { href: "/pro/mentions-obligatoires-2026", label: "Mentions obligatoires" },
  { href: "/pro/glossaire", label: "Glossaire" },
];

export default function ProLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main style={{ background: "#FAF8F5", minHeight: "100dvh" }}>
        {/* Header cluster */}
        <header style={{ background: "#1C1C1E", borderBottom: "1px solid #3D2E1F", padding: "20px 32px" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <nav aria-label="Navigation Bativio Pro" style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
              {NAV_PRO.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  style={{
                    padding: "6px 12px",
                    fontSize: 13,
                    color: "rgba(255,255,255,.7)",
                    textDecoration: "none",
                    borderRadius: 6,
                    transition: "background .15s",
                  }}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </header>

        {/* Contenu cluster */}
        <div style={{ padding: "32px" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            {children}
          </div>
        </div>

        {/* CTA persistant */}
        <section style={{ background: "linear-gradient(135deg, #C4531A, #8B3A12)", padding: "40px 32px", color: "#fff" }}>
          <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
            <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 26, fontWeight: 700, marginBottom: 8 }}>
              Bativio + Invoquo : la solution conforme 2026 pour artisans
            </h2>
            <p style={{ fontSize: 15, opacity: 0.9, marginBottom: 20, maxWidth: 600, marginInline: "auto" }}>
              Devis, factures, planning, conformité électronique. Une seule plateforme,
              connectée à une plateforme agréée. À partir de 19 €/mois.
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/inscription" style={{ display: "inline-block", padding: "12px 24px", background: "#fff", color: "#C4531A", borderRadius: 8, fontWeight: 600, fontSize: 14, textDecoration: "none" }}>
                Créer ma page gratuitement
              </Link>
              <Link href="/tarifs" style={{ display: "inline-block", padding: "12px 24px", background: "transparent", color: "#fff", border: "1px solid rgba(255,255,255,.4)", borderRadius: 8, fontWeight: 600, fontSize: 14, textDecoration: "none" }}>
                Voir les tarifs
              </Link>
            </div>
          </div>
        </section>

        {/* Footer SEO cluster */}
        <section style={{ background: "#1C1C1E", padding: "32px", color: "rgba(255,255,255,.6)" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 12, color: "rgba(255,255,255,.85)" }}>
              Toutes les pages Bativio Pro
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 16, fontSize: 13 }}>
              {NAV_PRO.map((item) => (
                <Link key={item.href} href={item.href} style={{ color: "inherit", textDecoration: "underline" }}>
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
