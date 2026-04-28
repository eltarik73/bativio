import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page introuvable — Bativio",
  description: "La page que vous cherchez n'existe pas ou a été déplacée. Retrouvez les artisans Bativio en Rhône-Alpes.",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <main className="flex items-center justify-center min-h-[70dvh]" style={{ background: "var(--creme, #FAF8F5)", padding: "60px 24px" }}>
      <div className="text-center" style={{ maxWidth: 560 }}>
        <p style={{ fontFamily: "'Fraunces',serif", fontSize: 96, fontWeight: 700, color: "rgba(196,83,26,.18)", lineHeight: 1, margin: 0 }}>404</p>
        <h1 style={{ marginTop: 16, fontFamily: "'Fraunces',serif", fontSize: 28, fontWeight: 700, color: "var(--bois, #3D2E1F)", letterSpacing: -0.5 }}>
          Page introuvable
        </h1>
        <p style={{ marginTop: 12, fontSize: 15, color: "var(--bois-mid, #6B6560)", lineHeight: 1.6 }}>
          La page que vous cherchez n&apos;existe pas, a été déplacée ou n&apos;est plus disponible.
        </p>

        <div style={{ marginTop: 32, display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 8, minHeight: 44, padding: "12px 24px", background: "var(--terre, #C4531A)", color: "#fff", borderRadius: 10, textDecoration: "none", fontWeight: 600, fontSize: 14 }}>
            Retour à l&apos;accueil
          </Link>
          <Link href="/demande" style={{ display: "inline-flex", alignItems: "center", gap: 8, minHeight: 44, padding: "12px 24px", background: "#fff", color: "var(--bois, #3D2E1F)", border: "1px solid #EDEBE7", borderRadius: 10, textDecoration: "none", fontWeight: 600, fontSize: 14 }}>
            Décrire mon projet
          </Link>
        </div>

        {/* Liens utiles SEO + UX */}
        <div style={{ marginTop: 48, paddingTop: 32, borderTop: "1px solid #EDEBE7" }}>
          <p style={{ fontSize: 12, color: "var(--pierre, #9C958D)", textTransform: "uppercase", letterSpacing: 1.5, fontWeight: 600, marginBottom: 16 }}>
            Vous cherchez peut-être
          </p>
          <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
            {[
              { href: "/lyon", label: "Artisans Lyon" },
              { href: "/chambery", label: "Artisans Chambéry" },
              { href: "/annecy", label: "Artisans Annecy" },
              { href: "/grenoble", label: "Artisans Grenoble" },
              { href: "/valence", label: "Artisans Valence" },
              { href: "/artisans-rhone-alpes", label: "Annuaire région" },
              { href: "/pro", label: "Bativio Pro (artisans)" },
              { href: "/tarifs", label: "Tarifs" },
              { href: "/a-propos", label: "À propos" },
            ].map((l) => (
              <Link key={l.href} href={l.href} style={{ fontSize: 13, color: "var(--terre, #C4531A)", padding: "6px 12px", border: "1px solid rgba(196,83,26,.2)", borderRadius: 99, textDecoration: "none" }}>
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
