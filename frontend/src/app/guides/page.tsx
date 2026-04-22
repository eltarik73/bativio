import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Guides travaux et rénovation — Conseils pratiques Bativio",
  description:
    "Guides pratiques pour vos travaux : trouver un bon artisan, estimer le prix d'une rénovation, comprendre MaPrimeRénov', éviter les arnaques, lire un devis.",
  alternates: { canonical: "https://www.bativio.fr/guides" },
  openGraph: {
    title: "Guides travaux Bativio",
    description: "Conseils pratiques particuliers + artisans.",
    url: "https://www.bativio.fr/guides",
  },
};

const GUIDES = [
  {
    slug: "trouver-bon-artisan",
    title: "Comment trouver un bon artisan en Rhône-Alpes en 2026",
    excerpt: "8 critères pour identifier un artisan sérieux : SIRET, décennale, RGE, devis détaillé, ancienneté. Exemples concrets Chambéry/Annecy/Lyon.",
    readTime: 8,
  },
  {
    slug: "prix-renovation-salle-bain",
    title: "Prix d'une rénovation de salle de bain 2026",
    excerpt: "Fourchettes détaillées par surface et niveau de gamme. Plomberie, carrelage, sanitaires, électricité. Avec ou sans douche italienne.",
    readTime: 6,
  },
  {
    slug: "maprimerenov-demarches",
    title: "MaPrimeRénov' 2026 : démarches et astuces",
    excerpt: "Guide complet : éligibilité, DPE, devis, dépôt de dossier, travaux, paiement, contrôle. Astuces pour maximiser l'aide.",
    readTime: 7,
  },
];

export default function GuidesIndexPage() {
  return (
    <>
      <Navbar />
      <main style={{ background: "var(--creme,#FAF8F5)", paddingBottom: 80 }}>
        <section style={{ background: "var(--bois,#3D2E1F)", padding: "56px 24px 48px", color: "#fff", textAlign: "center" }}>
          <div style={{ maxWidth: 720, margin: "0 auto" }}>
            <p style={{ fontSize: 12, letterSpacing: 2, color: "var(--argile,#D4956B)", textTransform: "uppercase", marginBottom: 14, fontWeight: 600 }}>
              Guides pratiques
            </p>
            <h1 style={{ fontFamily: "'Fraunces',serif", fontSize: "clamp(30px,4.5vw,44px)", fontWeight: 700, lineHeight: 1.15, marginBottom: 16 }}>
              Conseils travaux et rénovation
            </h1>
            <p style={{ fontSize: 16, lineHeight: 1.55, color: "rgba(255,255,255,.8)", maxWidth: 520, margin: "0 auto" }}>
              Tout ce que particuliers et artisans doivent savoir avant de signer un devis.
            </p>
          </div>
        </section>

        <section style={{ maxWidth: 1000, margin: "0 auto", padding: "48px 24px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 20 }}>
            {GUIDES.map((g) => (
              <Link
                key={g.slug}
                href={`/guides/${g.slug}`}
                style={{
                  display: "block",
                  background: "#fff",
                  border: "1px solid var(--sable,#E8D5C0)",
                  borderRadius: 14,
                  padding: "24px 24px",
                  textDecoration: "none",
                  transition: "transform .2s, border-color .2s",
                }}
              >
                <p style={{ fontSize: 11, fontWeight: 600, color: "var(--terre,#C4531A)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>
                  Guide · {g.readTime} min
                </p>
                <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 20, fontWeight: 600, color: "var(--anthracite,#1C1C1E)", marginBottom: 10, lineHeight: 1.3 }}>
                  {g.title}
                </h2>
                <p style={{ fontSize: 14, color: "var(--bois-mid,#5C4A3A)", lineHeight: 1.55, marginBottom: 14 }}>
                  {g.excerpt}
                </p>
                <p style={{ fontSize: 13, fontWeight: 600, color: "var(--terre,#C4531A)" }}>Lire le guide →</p>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
