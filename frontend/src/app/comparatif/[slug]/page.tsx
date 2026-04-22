import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface Row {
  label: string;
  bativio: string;
  them: string;
  winner: "bativio" | "them" | "tie";
}

interface Comparatif {
  slug: string;
  theirName: string;
  theirDomain: string;
  heroHook: string;
  oneLiner: string;
  rows: Row[];
  painPoints: string[];
  strengths: string[];
  verdict: string;
}

const COMPARATIFS: Record<string, Comparatif> = {
  pagesjaunes: {
    slug: "pagesjaunes",
    theirName: "PagesJaunes",
    theirDomain: "pagesjaunes.fr",
    heroHook: "PagesJaunes vous enferme 12 mois à 67 €/mois. Bativio = 19 €/mois sans engagement.",
    oneLiner: "Géant généraliste de l'annuaire, PagesJaunes propose des fiches pour tous les métiers — mais au prix fort et avec un engagement contraignant.",
    rows: [
      { label: "Prix artisan", bativio: "0 à 59 €/mois", them: "25 à 300 €/mois HT", winner: "bativio" },
      { label: "Engagement", bativio: "Aucun, résiliation en 1 clic", them: "12 mois + préavis 4 mois", winner: "bativio" },
      { label: "Verticalisation BTP", bativio: "100 % BTP Rhône-Alpes", them: "Généraliste tous métiers", winner: "bativio" },
      { label: "Vérification SIRET/NAF", bativio: "Automatique à l'inscription", them: "Non vérifié au signup", winner: "bativio" },
      { label: "Certificat RGE/Décennale", bativio: "Badges visibles sur profil", them: "Non structuré", winner: "bativio" },
      { label: "Devis IA instantané", bativio: "Oui (fourchette prix en 2 min)", them: "Non", winner: "bativio" },
      { label: "Facturation électronique 2026", bativio: "Intégrée (Invoquo, PA agréée)", them: "Non", winner: "bativio" },
      { label: "Volume visiteurs/mois", bativio: "En croissance (focus Rhône-Alpes)", them: "15 M/mois (1 Français sur 3)", winner: "them" },
      { label: "Ancienneté marque", bativio: "Depuis 2025", them: "Depuis 1887", winner: "them" },
      { label: "Avis clients vérifiés", bativio: "Post-chantier uniquement", them: "18 M d'avis (mélange)", winner: "bativio" },
    ],
    painPoints: [
      "Engagement 12 mois + préavis 4 mois = contrat piège selon UFC-Que Choisir",
      "Prix opaque : les commerciaux négocient au cas par cas (25 € à 300 €/mois)",
      "Pub invasive et UX datée des années 2010",
      "Pas d'outil pro intégré (pas de CRM, pas d'agenda, pas de devis)",
      "Avis non vérifiés post-chantier (faux avis documentés)",
    ],
    strengths: [
      "Notoriété massive : 15 M visiteurs/mois en France",
      "Référencement SEO historique très fort",
      "Couvre absolument tous les métiers, pas seulement BTP",
    ],
    verdict: "PagesJaunes est pertinent pour un artisan qui veut du volume national à prix fort. Pour un artisan BTP Rhône-Alpes qui veut un outil moderne + facturation conforme + aucun engagement : Bativio est 4 à 10× moins cher et techniquement 5 ans plus avancé.",
  },
  habitatpresto: {
    slug: "habitatpresto",
    theirName: "Habitatpresto",
    theirDomain: "habitatpresto.com",
    heroHook: "Habitatpresto vend votre lead à 5 concurrents. Bativio = 1 lead, 1 artisan choisi.",
    oneLiner: "Habitatpresto est un générateur de leads : le particulier fait une demande, 5 artisans reçoivent le même lead et se battent pour le décrocher.",
    rows: [
      { label: "Prix artisan", bativio: "0 à 59 €/mois fixe", them: "70 à 220 €/mois + 30 €/lead", winner: "bativio" },
      { label: "Lead partagé", bativio: "Non, lead exclusif par artisan choisi", them: "Oui, 5 artisans reçoivent le même lead", winner: "bativio" },
      { label: "Engagement", bativio: "Aucun, résiliation 1 clic", them: "6 à 12 mois + 50 % du restant si rupture", winner: "bativio" },
      { label: "Qualité des leads", bativio: "Scoring IA pré-qualification", them: "Beaucoup de leads hors zone (>1h30 route)", winner: "bativio" },
      { label: "Conversion réelle", bativio: "Lead qualifié par IA", them: "~10 % selon Custplace (2,2/5)", winner: "bativio" },
      { label: "Commission sur chantier", bativio: "0 %", them: "0 %", winner: "tie" },
      { label: "Magazine SEO", bativio: "En cours de développement", them: "40+ guides prix (gros levier)", winner: "them" },
      { label: "App mobile artisan", bativio: "Roadmap", them: "Oui (notifs temps réel)", winner: "them" },
      { label: "Facturation intégrée", bativio: "Oui (Invoquo)", them: "Non", winner: "bativio" },
      { label: "Support client", bativio: "Email + téléphone direct", them: "Prélèvements maintenus malgré résiliation LRAR (Trustpilot 2,2 pros)", winner: "bativio" },
    ],
    painPoints: [
      "Résiliation quasi-impossible (prélèvements maintenus malgré LRAR)",
      "Lead partagé à 5 artisans = course à la réactivité, pas à la qualité",
      "Zones rurales délaissées",
      "Aucun feedback post-chantier sur les leads reçus",
      "Trustpilot 4,1/5 côté particuliers mais 2,2/5 côté pros (Custplace)",
    ],
    strengths: [
      "Magazine SEO puissant (40+ guides de prix)",
      "App mobile pro avec notifications temps réel",
      "Promesse marketing claire : 5 devis en 48h",
      "Segmentation verticalité 40+ métiers",
    ],
    verdict: "Habitatpresto est un modèle extractif (abonnement + lead payant). Bativio propose un abonnement fixe + leads non-partagés + outil de gestion intégré — pour le même tarif mensuel ou moins.",
  },
  starofservice: {
    slug: "starofservice",
    theirName: "Star of Service",
    theirDomain: "starofservice.com",
    heroHook: "Star of Service facture 17 € par conversation ouverte, même sans deal. Bativio = abonnement fixe, aucune surfacturation.",
    oneLiner: "Star of Service fonctionne sur un modèle de crédits : chaque demande de contact coûte ~17 € à l'artisan, avec des renouvellements automatiques qui ont fait l'objet de milliers de signalements.",
    rows: [
      { label: "Prix artisan", bativio: "0 à 59 €/mois fixe", them: "~17 €/conversation (crédits)", winner: "bativio" },
      { label: "Prix caché", bativio: "Aucun, tarif affiché", them: "Prix crédit doublé en 2 ans (5 € → 9 €)", winner: "bativio" },
      { label: "Résiliation", bativio: "1 clic depuis dashboard", them: "Suppression CB bloquée, préavis 2 semaines par email", winner: "bativio" },
      { label: "Lead partagé", bativio: "Non, 1 lead = 1 artisan choisi", them: "Oui, 5 à 10 concurrents sur le même lead", winner: "bativio" },
      { label: "Profils vérifiés", bativio: "SIRET INSEE + NAF BTP auto", them: "Profils fantômes (artisans listés sans autorisation)", winner: "bativio" },
      { label: "Signalements arnaque", bativio: "0", them: "21 sur Signal-Arnaques (jusqu'à 900 € prélevés non autorisés)", winner: "bativio" },
      { label: "Questionnaire de qualification", bativio: "IA ~5 questions ciblées métier", them: "~10 questions standardisées", winner: "bativio" },
      { label: "Support client", bativio: "Email + téléphone", them: "Inexistant (plaintes Trustpilot massives)", winner: "bativio" },
      { label: "Intégration agenda/messagerie", bativio: "Agenda natif + messagerie", them: "Oui", winner: "tie" },
      { label: "Facturation 2026", bativio: "Invoquo PA agréée intégrée", them: "Non", winner: "bativio" },
    ],
    painPoints: [
      "Système de crédits avec prélèvements automatiques non autorisés (21 signalements Signal-Arnaques)",
      "Résiliation quasi-impossible (suppression carte bloquée)",
      "Leads partagés avec 5 à 10 concurrents",
      "Profils fantômes : artisans listés sans leur autorisation",
      "Pas de vérification RGE / Qualibat / SIRET",
      "Support client inexistant",
    ],
    strengths: [
      "Couverture nationale de tous les métiers",
      "Questionnaire de qualification détaillé",
      "Visibilité SEO par profil",
    ],
    verdict: "Star of Service a une réputation sérieusement dégradée (Trustpilot très faible, signalements multiples). Pour un artisan BTP, le rapport qualité/prix et la confiance sont nettement en faveur de Bativio.",
  },
};

export async function generateStaticParams() {
  return Object.keys(COMPARATIFS).map((slug) => ({ slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const c = COMPARATIFS[slug];
  if (!c) notFound(); // vrai HTTP 404 dès la metadata (anti soft-404 Google)
  return {
    title: `Bativio vs ${c.theirName} — Comparatif 2026 pour artisans BTP`,
    description: `${c.heroHook} Comparaison détaillée : prix, engagement, features, support.`,
    alternates: { canonical: `https://www.bativio.fr/comparatif/${slug}` },
    openGraph: {
      title: `Bativio vs ${c.theirName} — le comparatif`,
      description: c.heroHook,
      url: `https://www.bativio.fr/comparatif/${slug}`,
    },
  };
}

function WinnerBadge({ w }: { w: Row["winner"] }) {
  if (w === "bativio") return <span style={{ color: "#15803d", fontWeight: 600 }}>✓ Bativio</span>;
  if (w === "them") return <span style={{ color: "#b45309", fontWeight: 600 }}>→ Leur avantage</span>;
  return <span style={{ color: "var(--pierre,#9C958D)" }}>= Égalité</span>;
}

export default async function ComparatifPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = COMPARATIFS[slug];
  if (!c) notFound();

  return (
    <>
      <Navbar />
      <main style={{ background: "var(--creme,#FAF8F5)", minHeight: "100dvh" }}>
        <section style={{ maxWidth: 920, margin: "0 auto", padding: "64px 24px 48px" }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: "var(--terre,#C4531A)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 14 }}>Comparatif 2026</p>
          <h1 style={{ fontFamily: "'Fraunces',serif", fontSize: "clamp(32px,5vw,52px)", fontWeight: 700, lineHeight: 1.1, color: "var(--anthracite,#1C1C1E)", marginBottom: 18 }}>
            Bativio <span style={{ color: "var(--pierre,#9C958D)" }}>vs</span> {c.theirName}
          </h1>
          <p style={{ fontSize: 18, lineHeight: 1.5, color: "var(--bois-mid,#5C4A3A)", marginBottom: 28, maxWidth: 720 }}>
            {c.oneLiner}
          </p>
          <div style={{ background: "#fff", border: "1px solid var(--sable,#E8D5C0)", borderRadius: 16, padding: 24, marginBottom: 40 }}>
            <p style={{ fontSize: 16, fontWeight: 600, color: "var(--bois,#3D2E1F)", marginBottom: 8, fontFamily: "'Fraunces',serif", fontStyle: "italic" }}>En une phrase</p>
            <p style={{ fontSize: 18, color: "var(--anthracite,#1C1C1E)", lineHeight: 1.45 }}>{c.heroHook}</p>
          </div>
        </section>

        <section style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px 48px" }}>
          <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 28, fontWeight: 600, color: "var(--anthracite,#1C1C1E)", marginBottom: 24 }}>
            Tableau comparatif détaillé
          </h2>
          <div style={{ background: "#fff", border: "1px solid var(--sable,#E8D5C0)", borderRadius: 16, overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#FAF8F5", borderBottom: "1px solid var(--sable,#E8D5C0)" }}>
                  <th style={{ textAlign: "left", padding: "16px 18px", fontSize: 12, fontWeight: 600, color: "var(--pierre,#9C958D)", textTransform: "uppercase", letterSpacing: 0.5 }}>Critère</th>
                  <th style={{ textAlign: "left", padding: "16px 18px", fontSize: 12, fontWeight: 600, color: "var(--terre,#C4531A)", textTransform: "uppercase", letterSpacing: 0.5 }}>Bativio</th>
                  <th style={{ textAlign: "left", padding: "16px 18px", fontSize: 12, fontWeight: 600, color: "var(--pierre,#9C958D)", textTransform: "uppercase", letterSpacing: 0.5 }}>{c.theirName}</th>
                  <th style={{ textAlign: "right", padding: "16px 18px", fontSize: 12, fontWeight: 600, color: "var(--pierre,#9C958D)", textTransform: "uppercase", letterSpacing: 0.5 }}>Avantage</th>
                </tr>
              </thead>
              <tbody>
                {c.rows.map((r, i) => (
                  <tr key={i} style={{ borderBottom: i < c.rows.length - 1 ? "1px solid #F7F5F2" : "none" }}>
                    <td style={{ padding: "14px 18px", fontSize: 14, fontWeight: 600, color: "var(--bois,#3D2E1F)" }}>{r.label}</td>
                    <td style={{ padding: "14px 18px", fontSize: 14, color: "var(--anthracite,#1C1C1E)" }}>{r.bativio}</td>
                    <td style={{ padding: "14px 18px", fontSize: 14, color: "var(--bois-mid,#5C4A3A)" }}>{r.them}</td>
                    <td style={{ padding: "14px 18px", fontSize: 13, textAlign: "right" }}><WinnerBadge w={r.winner} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px 48px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
          <div>
            <h3 style={{ fontFamily: "'Fraunces',serif", fontSize: 22, fontWeight: 600, color: "var(--anthracite,#1C1C1E)", marginBottom: 16 }}>
              Ce que les artisans reprochent à {c.theirName}
            </h3>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {c.painPoints.map((p, i) => (
                <li key={i} style={{ fontSize: 14, lineHeight: 1.6, color: "var(--bois-mid,#5C4A3A)", paddingLeft: 20, position: "relative", marginBottom: 10 }}>
                  <span style={{ position: "absolute", left: 0, color: "#dc2626", fontWeight: 700 }}>×</span>{p}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 style={{ fontFamily: "'Fraunces',serif", fontSize: 22, fontWeight: 600, color: "var(--anthracite,#1C1C1E)", marginBottom: 16 }}>
              Les vraies forces de {c.theirName}
            </h3>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {c.strengths.map((s, i) => (
                <li key={i} style={{ fontSize: 14, lineHeight: 1.6, color: "var(--bois-mid,#5C4A3A)", paddingLeft: 20, position: "relative", marginBottom: 10 }}>
                  <span style={{ position: "absolute", left: 0, color: "#15803d", fontWeight: 700 }}>+</span>{s}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section style={{ maxWidth: 920, margin: "0 auto", padding: "32px 24px 64px" }}>
          <div style={{ background: "var(--anthracite,#1C1C1E)", borderRadius: 20, padding: "40px 32px", color: "#fff", textAlign: "center" }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,.6)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 14 }}>Notre verdict</p>
            <p style={{ fontSize: 18, lineHeight: 1.5, marginBottom: 28, maxWidth: 720, margin: "0 auto 28px" }}>{c.verdict}</p>
            <Link href="/inscription" style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "14px 32px", background: "var(--terre,#C4531A)", color: "#fff", borderRadius: 99, fontSize: 15, fontWeight: 600, textDecoration: "none" }}>
              Essayer Bativio gratuitement →
            </Link>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,.5)", marginTop: 14 }}>Gratuit · Sans engagement · Sans carte bancaire</p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
