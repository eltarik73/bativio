import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Plan du site — Toutes les pages Bativio",
  description:
    "Plan complet du site Bativio : pages particuliers, artisans, villes Rhône-Alpes, comparatifs, guides, contact. Navigation accessible.",
  alternates: { canonical: "https://www.bativio.fr/plan-du-site" },
};

interface Section {
  title: string;
  links: { href: string; label: string; note?: string }[];
}

const SECTIONS: Section[] = [
  {
    title: "Pour les particuliers",
    links: [
      { href: "/", label: "Annuaire artisans" },
      { href: "/urgence", label: "Urgence 24/7", note: "Plombier, électricien, serrurier, chauffagiste, couvreur" },
      { href: "/demande", label: "Estimation IA gratuite" },
      { href: "/maprimerenov", label: "Artisans RGE MaPrimeRénov'" },
      { href: "/prix", label: "Prix travaux 2026" },
      { href: "/faq", label: "FAQ" },
      { href: "/guides", label: "Guides pratiques" },
    ],
  },
  {
    title: "Villes Rhône-Alpes",
    links: [
      { href: "/chambery", label: "Chambéry (73000)" },
      { href: "/annecy", label: "Annecy (74000)" },
      { href: "/grenoble", label: "Grenoble (38000)" },
      { href: "/lyon", label: "Lyon (69000)" },
      { href: "/valence", label: "Valence (26000)" },
    ],
  },
  {
    title: "Métiers du bâtiment",
    links: [
      { href: "/metiers", label: "Tous les métiers" },
      { href: "/prix/plombier", label: "Prix plombier" },
      { href: "/prix/electricien", label: "Prix électricien" },
      { href: "/prix/peintre", label: "Prix peintre" },
      { href: "/prix/carreleur", label: "Prix carreleur" },
      { href: "/prix/macon", label: "Prix maçon" },
      { href: "/prix/menuisier", label: "Prix menuisier" },
      { href: "/prix/couvreur", label: "Prix couvreur" },
      { href: "/prix/chauffagiste", label: "Prix chauffagiste" },
      { href: "/prix/serrurier", label: "Prix serrurier" },
      { href: "/prix/cuisiniste", label: "Prix cuisiniste" },
    ],
  },
  {
    title: "Guides pratiques",
    links: [
      { href: "/guides", label: "Accueil guides" },
      { href: "/guides/trouver-bon-artisan", label: "Comment trouver un bon artisan" },
      { href: "/guides/prix-renovation-salle-bain", label: "Prix rénovation salle de bain" },
      { href: "/guides/maprimerenov-demarches", label: "MaPrimeRénov' démarches" },
    ],
  },
  {
    title: "Pour les artisans",
    links: [
      { href: "/artisan", label: "Présentation SaaS artisan" },
      { href: "/tarifs", label: "Tarifs (Gratuit à 59 €/mois)" },
      { href: "/facturation-electronique", label: "Facturation électronique 2026" },
      { href: "/inscription", label: "Créer mon compte" },
      { href: "/connexion", label: "Se connecter" },
      { href: "/rejoindre", label: "Rejoindre l'équipe" },
    ],
  },
  {
    title: "Comparatifs concurrence",
    links: [
      { href: "/comparatif/pagesjaunes", label: "Bativio vs PagesJaunes" },
      { href: "/comparatif/habitatpresto", label: "Bativio vs Habitatpresto" },
      { href: "/comparatif/starofservice", label: "Bativio vs Star of Service" },
      { href: "/comparatif/obat", label: "Bativio vs Obat" },
      { href: "/comparatif/tolteck", label: "Bativio vs Tolteck" },
    ],
  },
  {
    title: "Bativio",
    links: [
      { href: "/a-propos", label: "À propos" },
      { href: "/contact", label: "Contact" },
      { href: "/mentions-legales", label: "Mentions légales" },
      { href: "/cgu", label: "Conditions générales" },
      { href: "/sitemap.xml", label: "Sitemap XML (pour moteurs)" },
      { href: "/llms.txt", label: "llms.txt (pour LLMs)" },
      { href: "/robots.txt", label: "robots.txt" },
    ],
  },
];

export default function PlanDuSitePage() {
  return (
    <>
      <Navbar />
      <main style={{ background: "var(--creme,#FAF8F5)", paddingBottom: 80 }}>
        <section style={{ maxWidth: 960, margin: "0 auto", padding: "48px 24px" }}>
          <nav style={{ fontSize: 13, color: "var(--pierre,#9C958D)", marginBottom: 12 }}>
            <Link href="/" style={{ color: "var(--pierre,#9C958D)", textDecoration: "none" }}>Accueil</Link>
            <span style={{ margin: "0 6px" }}>/</span>
            <span>Plan du site</span>
          </nav>
          <h1 style={{ fontFamily: "'Fraunces',serif", fontSize: "clamp(28px,4vw,40px)", fontWeight: 700, lineHeight: 1.15, color: "var(--anthracite,#1C1C1E)", marginBottom: 12 }}>
            Plan du site
          </h1>
          <p style={{ fontSize: 16, color: "var(--bois-mid,#5C4A3A)", marginBottom: 36, lineHeight: 1.55 }}>
            Toutes les pages de Bativio, organisées par thème. Utilisez cette page pour naviguer rapidement ou pour une indexation complète.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 24 }}>
            {SECTIONS.map((s, i) => (
              <div key={i} style={{ background: "#fff", border: "1px solid var(--sable,#E8D5C0)", borderRadius: 14, padding: "24px 24px" }}>
                <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 18, fontWeight: 600, color: "var(--terre,#C4531A)", marginBottom: 14 }}>
                  {s.title}
                </h2>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {s.links.map((l) => (
                    <li key={l.href} style={{ marginBottom: 8 }}>
                      <Link href={l.href} style={{ fontSize: 14, color: "var(--anthracite,#1C1C1E)", textDecoration: "none", fontWeight: 500, lineHeight: 1.4 }}>
                        {l.label}
                      </Link>
                      {l.note && (
                        <div style={{ fontSize: 12, color: "var(--pierre,#9C958D)", marginTop: 2 }}>
                          {l.note}
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
