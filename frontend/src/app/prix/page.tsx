import Link from "next/link";
import { prisma } from "@/lib/prisma";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Prix travaux 2026 Rhône-Alpes — Base tarifaire artisans",
  description: "Consultez les prix moyens des travaux par métier en Rhône-Alpes en 2026. Plus de 250 prestations : plomberie, électricité, peinture, carrelage, maçonnerie, menuiserie, couverture, chauffage, serrurerie. Prix HT bas/moyen/haut.",
  openGraph: {
    title: "Prix travaux 2026 Rhône-Alpes — Bativio",
    description: "Base tarifaire 2026 : 250 prestations chiffrées par artisans vérifiés.",
  },
};

const METIERS_INFO: Record<string, { nom: string; emoji: string; description: string }> = {
  plombier: { nom: "Plombier", emoji: "🔧", description: "Plomberie sanitaire, chauffe-eau, salle de bain" },
  electricien: { nom: "Électricien", emoji: "⚡", description: "Tableau électrique, prises, domotique, mise aux normes" },
  peintre: { nom: "Peintre", emoji: "🎨", description: "Peinture intérieure, façades, papier peint, crépi" },
  carreleur: { nom: "Carreleur", emoji: "🔲", description: "Carrelage sol/mur, faïence, parquet, sol souple" },
  macon: { nom: "Maçon", emoji: "🧱", description: "Gros œuvre, extension, ouvertures, dalles, chapes" },
  menuisier: { nom: "Menuisier", emoji: "🪵", description: "Fenêtres, portes, parquet, escaliers, agencement" },
  couvreur: { nom: "Couvreur", emoji: "🏠", description: "Toiture, tuiles, ardoises, zinguerie, gouttières" },
  chauffagiste: { nom: "Chauffagiste", emoji: "🔥", description: "Chaudière, pompe à chaleur, climatisation, plancher chauffant" },
  serrurier: { nom: "Serrurier", emoji: "🔑", description: "Serrures, portes blindées, portails, dépannage" },
  cuisiniste: { nom: "Cuisiniste", emoji: "🍳", description: "Cuisines équipées, salles de bain, aménagement" },
};

export default async function PrixIndexPage() {
  const metiers = await prisma.cataloguePrestation.groupBy({
    by: ["metierSlug"],
    _count: true,
    _avg: { prixHtMoyen: true },
  }).catch(() => []);

  return (
    <>
      <Navbar />
      <section className="cinema-light" style={{ padding: "72px 32px 48px", textAlign: "center", position: "relative" }}>
        <div className="cinema-blob-light cinema-blob-light-1" style={{ opacity: .3 }} />
        <div style={{ maxWidth: 820, margin: "0 auto", position: "relative", zIndex: 10 }}>
          <div className="liquid-glass" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 14px", borderRadius: 999, marginBottom: 20, fontSize: 12, fontWeight: 500, color: "var(--terre-deep)", letterSpacing: 0.3 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--terre)" }} />
            Base tarifaire 2026 — Rhône-Alpes
          </div>
          <h1 style={{ fontFamily: "'Fraunces',serif", fontSize: "clamp(34px,5vw,54px)", fontWeight: 600, color: "var(--bois)", lineHeight: 1.05, letterSpacing: -1, marginBottom: 16 }}>
            Prix travaux <span style={{ fontStyle: "italic", fontWeight: 400, color: "var(--terre)" }}>transparents</span>.
          </h1>
          <p style={{ fontSize: 17, color: "var(--bois-mid)", lineHeight: 1.55, maxWidth: 620, margin: "0 auto" }}>
            250 prestations chiffrées par nos artisans vérifiés. Fourchettes de prix réelles HT mises à jour mensuellement.
          </p>
        </div>
      </section>

      {/* Answer Capsule (GEO 2026) — extractible par les LLMs */}
      <section
        aria-label="Reponse rapide prix travaux Rhone-Alpes 2026"
        style={{ background: "var(--creme,#FAF8F5)", padding: "32px 24px 0" }}
      >
        <div style={{ maxWidth: 800, margin: "0 auto", background: "#fff", border: "1px solid #E8D5C0", borderRadius: 12, padding: "24px 28px" }}>
          <p style={{ fontSize: 16, color: "#1C1C1E", lineHeight: 1.6, margin: 0 }}>
            <strong>
              En Rhône-Alpes en 2026, les fourchettes moyennes constatées sont
            </strong>{" "}
            : plombier 55-90 €/h, électricien 50-85 €/h (tableau aux normes
            1&nbsp;200-2&nbsp;800 €), peintre 25-45 €/m², maçon 350-550 €/jour,
            carreleur 40-80 €/m², chauffagiste entretien chaudière 120-180 €.
            La TVA est à 10 % en rénovation logement &gt; 2 ans, 5,5 % pour les
            travaux d&apos;amélioration énergétique éligibles MaPrimeRénov&apos;.
            Devis gratuit 24 h sur Bativio.
          </p>
        </div>
      </section>

      <section style={{ padding: "48px 32px 80px", background: "var(--blanc)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 26, fontWeight: 600, color: "var(--bois)", marginBottom: 6 }}>
            Choisissez un <span style={{ fontStyle: "italic", color: "var(--terre)" }}>métier</span>
          </h2>
          <p style={{ fontSize: 14, color: "var(--pierre)", marginBottom: 28 }}>Prix bas / moyen / haut + détails par prestation.</p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 16 }}>
            {Object.entries(METIERS_INFO).map(([slug, info]) => {
              const stats = metiers.find((m) => m.metierSlug === slug);
              return (
                <Link
                  key={slug}
                  href={`/prix/${slug}`}
                  style={{ background: "#fff", borderRadius: 16, border: "1px solid #E8D5C0", padding: 20, textDecoration: "none", transition: "all .2s", display: "block" }}
                >
                  <div style={{ fontSize: 32, marginBottom: 10 }}>{info.emoji}</div>
                  <h3 style={{ fontFamily: "'Fraunces',serif", fontSize: 18, fontWeight: 600, color: "var(--bois)", marginBottom: 4 }}>{info.nom}</h3>
                  <p style={{ fontSize: 12, color: "var(--bois-mid)", marginBottom: 12, lineHeight: 1.45 }}>{info.description}</p>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, paddingTop: 10, borderTop: "1px solid #F2EAE0" }}>
                    <span style={{ fontSize: 11, color: "var(--pierre)" }}>{stats?._count ?? 0} prestations</span>
                    {stats?._avg.prixHtMoyen && (
                      <span style={{ fontSize: 11, color: "var(--terre)", fontWeight: 600, marginLeft: "auto" }}>
                        ~{Math.round(stats._avg.prixHtMoyen).toLocaleString("fr-FR")} € moy.
                      </span>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>

          <div style={{ marginTop: 48, padding: 24, background: "var(--creme)", borderRadius: 16, textAlign: "center" }}>
            <h3 style={{ fontFamily: "'Fraunces',serif", fontSize: 20, fontWeight: 600, color: "var(--bois)", marginBottom: 6 }}>
              Besoin d&apos;un <span style={{ fontStyle: "italic", color: "var(--terre)" }}>devis personnalisé</span> ?
            </h3>
            <p style={{ fontSize: 14, color: "var(--bois-mid)", marginBottom: 16, maxWidth: 520, margin: "0 auto 16px" }}>
              Notre assistant IA qualifie votre projet en 5 questions et vous met en relation avec les meilleurs artisans de votre ville.
            </p>
            <Link href="/demande" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 28px", background: "var(--terre)", color: "#fff", borderRadius: 12, fontSize: 15, fontWeight: 600, textDecoration: "none", boxShadow: "0 10px 30px rgba(196,83,26,.22)" }}>
              Décrire mon projet
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M5 12h14M13 5l7 7-7 7" /></svg>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
