import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { safeJsonLd } from "@/lib/html-escape";

export const metadata: Metadata = {
  title: "Artisan RGE MaPrimeRénov' — Aide rénovation énergétique 2026",
  description:
    "Tous les artisans Bativio certifiés RGE pour MaPrimeRénov' en Rhône-Alpes. Isolation, pompe à chaleur, chaudière biomasse, fenêtres : comparez les devis et bénéficiez des aides de l'État.",
  alternates: { canonical: "https://www.bativio.fr/maprimerenov" },
  openGraph: {
    title: "Artisans RGE MaPrimeRénov' — Rhône-Alpes",
    description: "Comparez les artisans certifiés pour vos aides rénovation.",
    url: "https://www.bativio.fr/maprimerenov",
  },
};

const TRAVAUX_ELIGIBLES = [
  {
    nom: "Isolation des combles perdus",
    aide: "jusqu'à 25 €/m²",
    detail: "Laine de verre, ouate de cellulose, fibre de bois. Résistance thermique R ≥ 7 en toiture.",
    metier: "Isolateur / Plaquiste",
    slug: "plaquiste",
  },
  {
    nom: "Isolation des murs par l'extérieur (ITE)",
    aide: "jusqu'à 75 €/m²",
    detail: "Polystyrène expansé, laine de roche, fibre de bois. Travaux lourds mais forte efficacité.",
    metier: "Maçon / Façadier",
    slug: "macon",
  },
  {
    nom: "Pompe à chaleur air-eau",
    aide: "jusqu'à 4 000 €",
    detail: "Remplace chaudière fioul ou gaz. Idéal maisons individuelles en Rhône-Alpes (climat adapté).",
    metier: "Chauffagiste",
    slug: "chauffagiste",
  },
  {
    nom: "Pompe à chaleur géothermique",
    aide: "jusqu'à 11 000 €",
    detail: "Forage vertical ou captage horizontal. Investissement lourd mais aides maximales.",
    metier: "Chauffagiste",
    slug: "chauffagiste",
  },
  {
    nom: "Chaudière biomasse (pellets / granulés)",
    aide: "jusqu'à 11 000 €",
    detail: "Remplace chaudière fioul. Rentable en Savoie / Haute-Savoie (bois local disponible).",
    metier: "Chauffagiste",
    slug: "chauffagiste",
  },
  {
    nom: "Chauffe-eau solaire individuel",
    aide: "jusqu'à 4 000 €",
    detail: "Panneaux solaires thermiques + ballon. Rentable Drôme, Ardèche (ensoleillement).",
    metier: "Plombier-Chauffagiste",
    slug: "plombier",
  },
  {
    nom: "Ventilation double flux",
    aide: "jusqu'à 2 500 €",
    detail: "Récupération de chaleur sur air extrait. Obligatoire en maison passive (RE 2020).",
    metier: "Chauffagiste",
    slug: "chauffagiste",
  },
  {
    nom: "Remplacement des fenêtres (double ou triple vitrage)",
    aide: "jusqu'à 100 €/fenêtre",
    detail: "Uw ≤ 1,3 W/m².K. Amélioration confort thermique + phonique.",
    metier: "Menuisier",
    slug: "menuisier",
  },
];

const MONTANTS_PLAFOND = [
  { profil: "Ménage très modeste (MaPrimeRénov' Bleu)", plafond: "Plafond maximum des aides" },
  { profil: "Ménage modeste (MaPrimeRénov' Jaune)", plafond: "Aides réduites" },
  { profil: "Ménage intermédiaire (MaPrimeRénov' Violet)", plafond: "Aides standards" },
  { profil: "Ménage aisé (MaPrimeRénov' Rose)", plafond: "Aides limitées (gestes d'ampleur uniquement)" },
];

export default function MaPrimeRenovPage() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Tous les artisans Bativio sont-ils certifiés RGE ?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Non, seuls les artisans qui ont obtenu la certification RGE (Reconnu Garant de l'Environnement) affichent le badge RGE sur leur profil. Filtrez les résultats par badge pour ne voir que les artisans RGE si vous souhaitez bénéficier de MaPrimeRénov' ou de la TVA réduite à 5,5 %.",
        },
      },
      {
        "@type": "Question",
        name: "Combien puis-je toucher de MaPrimeRénov' en 2026 ?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Le montant dépend de vos revenus (bleu, jaune, violet, rose) et des travaux. Pour une pompe à chaleur air-eau, un ménage très modeste peut toucher jusqu'à 4 000 €. Pour un bouquet de travaux (isolation + chauffage), un accompagnement Mon Accompagnateur Rénov' peut ajouter 1 200 €.",
        },
      },
      {
        "@type": "Question",
        name: "Dois-je avancer les frais ?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Non, depuis 2024 les ménages modestes et très modestes peuvent demander une avance de 70 % du montant de l'aide directement versée à l'artisan. L'artisan applique cette avance sur le devis initial. Sinon, vous avancez les frais et l'ANAH vous rembourse après travaux (sous 2 à 4 semaines).",
        },
      },
      {
        "@type": "Question",
        name: "Quelles aides puis-je cumuler avec MaPrimeRénov' ?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "MaPrimeRénov' est cumulable avec : l'éco-PTZ (prêt à taux zéro jusqu'à 50 000 €), la TVA réduite à 5,5 %, les CEE (Certificats d'Économies d'Énergie), les aides locales (Région Auvergne-Rhône-Alpes, département, commune). Non cumulable avec le crédit d'impôt transition énergétique (CITE supprimé).",
        },
      },
    ],
  };

  return (
    <>
      <Navbar />
      <main style={{ background: "var(--creme,#FAF8F5)", paddingBottom: 80 }}>
        <section style={{ background: "linear-gradient(135deg, #4A6741 0%, #3D5632 100%)", padding: "56px 24px 48px", color: "#fff", textAlign: "center" }}>
          <div style={{ maxWidth: 720, margin: "0 auto" }}>
            <p style={{ fontSize: 12, letterSpacing: 2, color: "rgba(255,255,255,.75)", textTransform: "uppercase", marginBottom: 14, fontWeight: 600 }}>
              Rénovation énergétique 2026
            </p>
            <h1 style={{ fontFamily: "'Fraunces',serif", fontSize: "clamp(30px,4.5vw,48px)", fontWeight: 700, lineHeight: 1.1, marginBottom: 18 }}>
              Artisans RGE pour <span className="calli" style={{ color: "#fbbf24" }}>MaPrimeRénov&apos;</span>
            </h1>
            <p style={{ fontSize: 17, lineHeight: 1.55, color: "rgba(255,255,255,.85)", marginBottom: 28, maxWidth: 580, margin: "0 auto 28px" }}>
              Bénéficiez des aides de l&apos;État pour vos travaux de rénovation énergétique en Rhône-Alpes. Tous nos artisans RGE sont vérifiés.
            </p>
            <Link href="/demande" style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "14px 28px", background: "#fff", color: "#3D5632", borderRadius: 99, fontSize: 15, fontWeight: 600, textDecoration: "none" }}>
              Estimer mon projet (2 min) →
            </Link>
          </div>
        </section>

        {/* Answer Capsule GEO 2026 — extractible par les LLMs */}
        <section
          aria-label="Reponse rapide MaPrimeRenov 2026"
          style={{ maxWidth: 800, margin: "0 auto", padding: "32px 24px 0" }}
        >
          <div style={{ background: "#FAF8F5", border: "1px solid #E8D5C0", borderRadius: 12, padding: "24px 28px" }}>
            <p style={{ fontSize: 16, color: "#1C1C1E", lineHeight: 1.6, margin: 0 }}>
              <strong>MaPrimeRénov&apos; est l&apos;aide principale de l&apos;État
              pour la rénovation énergétique des logements en France</strong>,
              accessible aux propriétaires occupants, bailleurs et copropriétaires.
              Le montant 2026 va de 600&nbsp;€ (chaudière à granulés) à 11&nbsp;000&nbsp;€
              (pompe à chaleur géothermique) selon revenus et travaux. Bativio
              référence uniquement des artisans RGE certifiés en Rhône-Alpes,
              indispensables pour bénéficier de l&apos;aide.
            </p>
          </div>
        </section>

        <section style={{ maxWidth: 1000, margin: "0 auto", padding: "48px 24px" }}>
          <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: "clamp(24px,3.2vw,32px)", fontWeight: 600, color: "var(--anthracite,#1C1C1E)", marginBottom: 24 }}>
            Travaux éligibles en 2026
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 16 }}>
            {TRAVAUX_ELIGIBLES.map((t, i) => (
              <div key={i} style={{ background: "#fff", border: "1px solid var(--sable,#E8D5C0)", borderRadius: 12, padding: "20px 20px" }}>
                <h3 style={{ fontSize: 16, fontWeight: 600, color: "var(--anthracite,#1C1C1E)", marginBottom: 6 }}>{t.nom}</h3>
                <p style={{ fontSize: 14, fontWeight: 700, color: "var(--mousse,#4A6741)", marginBottom: 8 }}>{t.aide}</p>
                <p style={{ fontSize: 13, lineHeight: 1.5, color: "var(--bois-mid,#5C4A3A)", marginBottom: 12 }}>{t.detail}</p>
                <p style={{ fontSize: 11, color: "var(--pierre,#9C958D)", textTransform: "uppercase", letterSpacing: 0.5 }}>
                  Métier : <span style={{ color: "var(--terre,#C4531A)", fontWeight: 600 }}>{t.metier}</span>
                </p>
              </div>
            ))}
          </div>
        </section>

        <section style={{ background: "#fff", borderTop: "1px solid var(--sable,#E8D5C0)", borderBottom: "1px solid var(--sable,#E8D5C0)", padding: "48px 24px" }}>
          <div style={{ maxWidth: 760, margin: "0 auto" }}>
            <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 26, fontWeight: 600, color: "var(--anthracite,#1C1C1E)", marginBottom: 18 }}>
              Quel montant d&apos;aide selon vos revenus ?
            </h2>
            <p style={{ fontSize: 15, lineHeight: 1.55, color: "var(--bois-mid,#5C4A3A)", marginBottom: 24 }}>
              MaPrimeRénov&apos; est divisée en 4 catégories selon votre revenu fiscal de référence.
              Les plafonds varient selon la composition du ménage et la zone géographique (Île-de-France ou autres régions).
            </p>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {MONTANTS_PLAFOND.map((m, i) => (
                <li key={i} style={{ padding: "12px 0", borderBottom: i < MONTANTS_PLAFOND.length - 1 ? "1px solid var(--sable,#E8D5C0)" : "none" }}>
                  <p style={{ fontSize: 14, fontWeight: 600, color: "var(--bois,#3D2E1F)" }}>{m.profil}</p>
                  <p style={{ fontSize: 13, color: "var(--bois-mid,#5C4A3A)" }}>{m.plafond}</p>
                </li>
              ))}
            </ul>
            <p style={{ fontSize: 12, color: "var(--pierre,#9C958D)", marginTop: 16, fontStyle: "italic" }}>
              Simulation exacte sur <a href="https://france-renov.gouv.fr/aides/simulateur" target="_blank" rel="noopener noreferrer" style={{ color: "var(--terre,#C4531A)", textDecoration: "underline" }}>france-renov.gouv.fr</a>.
            </p>
          </div>
        </section>

        <section style={{ maxWidth: 760, margin: "0 auto", padding: "48px 24px", textAlign: "center" }}>
          <div style={{ background: "var(--anthracite,#1C1C1E)", borderRadius: 18, padding: "32px 28px", color: "#fff" }}>
            <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 24, fontWeight: 600, marginBottom: 12 }}>
              Comparez les artisans RGE près de chez vous
            </h2>
            <p style={{ fontSize: 15, color: "rgba(255,255,255,.75)", marginBottom: 22, lineHeight: 1.5 }}>
              Utilisez notre estimation IA pour décrire votre projet. Vous recevez 3 devis d&apos;artisans RGE en Rhône-Alpes sous 24h.
            </p>
            <div style={{ display: "inline-flex", gap: 10, flexWrap: "wrap", justifyContent: "center" }}>
              <Link href="/demande" style={{ padding: "12px 24px", background: "var(--terre,#C4531A)", color: "#fff", borderRadius: 99, fontSize: 14, fontWeight: 600, textDecoration: "none" }}>
                Estimer mon projet
              </Link>
              <Link href="/" style={{ padding: "12px 24px", background: "transparent", color: "#fff", borderRadius: 99, fontSize: 14, fontWeight: 600, textDecoration: "none", border: "1px solid rgba(255,255,255,.2)" }}>
                Voir l&apos;annuaire
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(faqJsonLd) }} />
    </>
  );
}
