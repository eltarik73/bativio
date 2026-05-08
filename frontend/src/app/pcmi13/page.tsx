import { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { safeJsonLd } from "@/lib/html-escape";

export const revalidate = 3600;

const TITLE = "PCMI13 — Formulaire Cerfa attestation parasismique en Rhône-Alpes";
const DESCRIPTION =
  "Formulaire PCMI13 (Cerfa 13406) à joindre à votre permis de construire en zone sismique 3, 4 ou 5. Architectes et BET certifiés à Chambéry, Annecy, Grenoble, Lyon, Valence. Devis gratuit sous 48h.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "pcmi13", "pcmi 13", "cerfa pcmi13", "formulaire pcmi13",
    "attestation parasismique", "attestation sismique",
    "permis de construire zone sismique", "Eurocode 8",
    "PC12", "AT2", "Cerfa 13406", "Cerfa 13409",
    "BET structure", "architecte parasismique",
    "Chambéry", "Annecy", "Grenoble", "Lyon", "Valence",
    "Savoie", "Haute-Savoie", "Isère", "Rhône", "Drôme",
  ],
  alternates: { canonical: "https://www.bativio.fr/pcmi13" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "https://www.bativio.fr/pcmi13",
    type: "article",
    images: [{ url: "https://www.bativio.fr/og-image.png", width: 1200, height: 630 }],
  },
};

const FAQ = [
  {
    question: "Qu'est-ce que le formulaire PCMI13 ?",
    answer:
      "PCMI13 est l'attestation parasismique imposée par le décret n° 2010-1255 du 22 octobre 2010. Il s'agit d'une pièce complémentaire (PC = Pièce Complémentaire, MI = Maison Individuelle, 13) à joindre au dossier de demande de permis de construire (Cerfa 13406) en zone sismique 3, 4 ou 5. Le formulaire certifie que la conception du projet respecte les règles de l'Eurocode 8 (NF EN 1998-1).",
  },
  {
    question: "Qui peut signer le PCMI13 ?",
    answer:
      "Un architecte inscrit à l'Ordre, un bureau d'études techniques (BET) structure qualifié OPQIBI 2202 ou 2204, ou un maître d'œuvre disposant des compétences en calcul parasismique. La signature engage la responsabilité décennale du professionnel.",
  },
  {
    question: "Différence PCMI13 / PC12 / AT2 ?",
    answer:
      "PCMI13 = maison individuelle (Cerfa 13406) — le cas courant pour les particuliers. PC12 = Cerfa 13409 pour les autres permis (logement collectif, ERP, professionnel). AT2 = aménagement spécifique (lotissement, ouvrage technique).",
  },
  {
    question: "Quelles villes Rhône-Alpes sont concernées ?",
    answer:
      "Toute la Savoie (zone 4), Haute-Savoie (zone 4), Isère (zones 3-4), partie est de la Drôme (zone 3) et tout le Rhône (zone 3). En pratique, Chambéry, Annecy, Grenoble, Lyon et Valence sont toutes concernées par l'obligation PCMI13.",
  },
  {
    question: "Combien de temps pour obtenir le PCMI13 ?",
    answer:
      "2 à 4 semaines en standard, 48-72h en urgence (avec majoration). Anticipez : ne déposez pas votre permis sans le PCMI13 signé, la mairie suspendra l'instruction (article R. 431-16-c du code de l'urbanisme).",
  },
];

const ZONES_SISMIQUES_PRINCIPALES = [
  { ville: "Chambéry", slug: "chambery", zone: 4, departement: "Savoie" },
  { ville: "Annecy", slug: "annecy", zone: 4, departement: "Haute-Savoie" },
  { ville: "Grenoble", slug: "grenoble", zone: 4, departement: "Isère" },
  { ville: "Lyon", slug: "lyon", zone: 3, departement: "Rhône" },
  { ville: "Valence", slug: "valence", zone: 3, departement: "Drôme" },
];

export default function Pcmi13HubPage() {
  const baseUrl = "https://www.bativio.fr";
  const url = `${baseUrl}/pcmi13`;

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: TITLE,
    description: DESCRIPTION,
    datePublished: "2026-05-04",
    dateModified: "2026-05-04",
    author: { "@type": "Organization", name: "Bativio" },
    publisher: {
      "@type": "Organization",
      name: "Bativio",
      logo: { "@type": "ImageObject", url: `${baseUrl}/icons/icon-512.png` },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Accueil", item: `${baseUrl}/` },
      { "@type": "ListItem", position: 2, name: "PCMI13", item: url },
    ],
  };

  return (
    <>
      <Navbar />
      <main>
        <section style={{ background: "var(--bois,#3D2E1F)", padding: "56px 24px 48px", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: -120, right: -80, width: 400, height: 400, borderRadius: "50%", background: "rgba(196,83,26,.06)" }} />
          <div style={{ maxWidth: 760, margin: "0 auto", position: "relative", zIndex: 1 }}>
            <nav style={{ fontSize: 13, color: "rgba(255,255,255,.7)", marginBottom: 14 }}>
              <Link href="/" style={{ color: "rgba(255,255,255,.7)" }}>Accueil</Link>
              <span style={{ margin: "0 6px" }}>/</span>
              <span style={{ color: "rgba(255,255,255,.55)" }}>PCMI13</span>
            </nav>
            <span style={{ display: "inline-block", padding: "5px 12px", borderRadius: 20, background: "rgba(201,148,58,.18)", color: "#E8A84C", fontSize: 11, fontWeight: 700, letterSpacing: 1.4, textTransform: "uppercase", marginBottom: 18 }}>
              Cerfa 13406 · Permis de construire
            </span>
            <h1 style={{ fontFamily: "'Fraunces',serif", fontSize: "clamp(28px,4.4vw,42px)", fontWeight: 700, color: "#fff", lineHeight: 1.12, letterSpacing: -0.5, marginBottom: 14 }}>
              PCMI13&nbsp;: formulaire Cerfa attestation parasismique
            </h1>
            <p style={{ fontSize: 16, color: "rgba(255,255,255,.78)", lineHeight: 1.65, maxWidth: 640 }}>
              Le <strong>PCMI13</strong> (Cerfa 13406) est obligatoire à joindre à toute demande de permis de construire de maison individuelle en zone sismique 3, 4 ou 5. Bativio référence les architectes et bureaux d&apos;études certifiés en Rhône-Alpes.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 24 }}>
              <Link href="/demande" style={{ padding: "12px 22px", borderRadius: 10, background: "var(--terre,#C4531A)", color: "#fff", fontSize: 15, fontWeight: 600, textDecoration: "none" }}>
                Demander un PCMI13
              </Link>
              <Link href="/attestation-sismique" style={{ padding: "12px 22px", borderRadius: 10, border: "1px solid rgba(255,255,255,.25)", color: "#fff", fontSize: 15, fontWeight: 600, textDecoration: "none" }}>
                Guide complet
              </Link>
            </div>
          </div>
        </section>

        <section style={{ padding: "56px 24px", background: "var(--creme,#FAF8F5)" }}>
          <div style={{ maxWidth: 1080, margin: "0 auto" }}>
            <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: "clamp(22px,3vw,30px)", fontWeight: 700, color: "var(--anthracite,#1C1C1E)", marginBottom: 24, textAlign: "center" }}>
              PCMI13 par ville en Rhône-Alpes
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14 }}>
              {ZONES_SISMIQUES_PRINCIPALES.map((v) => (
                <Link
                  key={v.slug}
                  href={`/pcmi13/${v.slug}`}
                  style={{ padding: "20px", borderRadius: 14, background: "#fff", border: "1px solid var(--sable,#E8D5C0)", textDecoration: "none", transition: "border-color .2s" }}
                >
                  <div style={{ fontSize: 11, fontWeight: 700, color: "var(--terre,#C4531A)", textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 6 }}>
                    Zone sismique {v.zone}
                  </div>
                  <div style={{ fontFamily: "'Fraunces',serif", fontSize: 18, fontWeight: 700, color: "var(--bois,#3D2E1F)", marginBottom: 4 }}>
                    PCMI13 à {v.ville}
                  </div>
                  <div style={{ fontSize: 13, color: "var(--pierre,#9C958D)" }}>{v.departement}</div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section style={{ padding: "56px 24px", background: "#fff", borderTop: "1px solid var(--sable,#E8D5C0)", borderBottom: "1px solid var(--sable,#E8D5C0)" }}>
          <div style={{ maxWidth: 760, margin: "0 auto" }}>
            <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: "clamp(22px,3vw,30px)", fontWeight: 700, color: "var(--anthracite,#1C1C1E)", marginBottom: 14 }}>
              À quoi sert le PCMI13
            </h2>
            <p style={{ fontSize: 15, color: "var(--bois-mid,#5C4A3A)", lineHeight: 1.75, marginBottom: 14 }}>
              Le formulaire <strong>PCMI13</strong> est une <strong>attestation parasismique</strong> imposée par le décret n° 2010-1255 du 22 octobre 2010. Il certifie que la conception de votre projet de maison individuelle respecte l&apos;<strong>Eurocode 8</strong> (NF EN 1998-1), la norme européenne de construction parasismique.
            </p>
            <p style={{ fontSize: 15, color: "var(--bois-mid,#5C4A3A)", lineHeight: 1.75, marginBottom: 14 }}>
              Ce document est <strong>obligatoire à joindre au dossier de demande de permis de construire</strong> (Cerfa 13406) si votre terrain se situe en zone sismique 3 (modérée), 4 (moyenne) ou 5 (forte). En Rhône-Alpes, la quasi-totalité du territoire est concernée — Savoie et Haute-Savoie en zone 4, Isère partagée 3-4, Rhône et Drôme en zone 3.
            </p>
            <p style={{ fontSize: 15, color: "var(--bois-mid,#5C4A3A)", lineHeight: 1.75 }}>
              Sans PCMI13 signé par un professionnel habilité (architecte, BET structure OPQIBI), votre dossier sera <strong>incomplet</strong> et la mairie suspendra l&apos;instruction (article R. 431-16-c du code de l&apos;urbanisme).
            </p>
          </div>
        </section>

        <section style={{ padding: "56px 24px", background: "var(--creme,#FAF8F5)" }}>
          <div style={{ maxWidth: 760, margin: "0 auto" }}>
            <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: "clamp(22px,3vw,30px)", fontWeight: 700, color: "var(--anthracite,#1C1C1E)", marginBottom: 24 }}>
              Questions fréquentes — PCMI13
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {FAQ.map((f, i) => (
                <details key={i} style={{ background: "#fff", borderRadius: 12, border: "1px solid var(--sable,#E8D5C0)", padding: "16px 20px" }}>
                  <summary style={{ cursor: "pointer", fontSize: 15, fontWeight: 600, color: "var(--bois,#3D2E1F)", listStyle: "none" }}>
                    {f.question}
                  </summary>
                  <p style={{ fontSize: 14, color: "var(--bois-mid,#5C4A3A)", lineHeight: 1.65, marginTop: 12 }}>
                    {f.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section style={{ padding: "56px 24px", background: "var(--bois,#3D2E1F)" }}>
          <div style={{ maxWidth: 640, margin: "0 auto", textAlign: "center" }}>
            <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: "clamp(22px,3vw,30px)", fontWeight: 700, color: "#fff", marginBottom: 12 }}>
              Lancez votre demande PCMI13
            </h2>
            <p style={{ fontSize: 15, color: "rgba(255,255,255,.78)", marginBottom: 24, lineHeight: 1.65 }}>
              Devis gratuit sous 48h. Aucune commission Bativio.
            </p>
            <Link href="/demande" style={{ display: "inline-block", padding: "14px 32px", borderRadius: 10, background: "var(--terre,#C4531A)", color: "#fff", fontSize: 16, fontWeight: 600, textDecoration: "none" }}>
              Demander mon PCMI13
            </Link>
          </div>
        </section>
      </main>
      <Footer />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbJsonLd) }} />
    </>
  );
}
