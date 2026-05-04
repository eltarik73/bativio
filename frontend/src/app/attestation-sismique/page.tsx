import { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { safeJsonLd } from "@/lib/html-escape";

export const revalidate = 3600;

const TITLE = "Attestation sismique PCMI13 — Artisans certifiés Rhône-Alpes";
const DESCRIPTION =
  "Trouvez un artisan certifié pour votre attestation sismique (formulaire PCMI13) en Rhône-Alpes. Permis de construire en zone sismique : Chambéry, Annecy, Grenoble. Devis gratuit.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "attestation sismique",
    "PCMI13",
    "PCMI-13",
    "permis de construire zone sismique",
    "attestation parasismique",
    "Cerfa 13409",
    "norme parasismique Eurocode 8",
    "zone sismique 3",
    "zone sismique 4",
    "Chambéry",
    "Annecy",
    "Grenoble",
    "Rhône-Alpes",
  ],
  alternates: { canonical: "https://www.bativio.fr/attestation-sismique" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "https://www.bativio.fr/attestation-sismique",
    type: "article",
    images: [{ url: "https://www.bativio.fr/og-image.png", width: 1200, height: 630 }],
  },
};

const FAQ = [
  {
    question: "Qu'est-ce que l'attestation sismique PCMI13 ?",
    answer:
      "L'attestation sismique (formulaire Cerfa PCMI13) est un document obligatoire à joindre à votre demande de permis de construire pour une maison individuelle située en zone sismique 3, 4 ou 5. Elle certifie que votre projet respecte les règles parasismiques de l'Eurocode 8 (norme NF EN 1998).",
  },
  {
    question: "Qui peut établir une attestation sismique ?",
    answer:
      "L'attestation sismique doit être rédigée par un professionnel qualifié : architecte, bureau d'études techniques (BET) structure, ou maître d'œuvre disposant des compétences en calcul parasismique. Sur Bativio, les artisans portant le badge 'Attestation sismique' ont fourni les justificatifs nécessaires.",
  },
  {
    question: "Quelles communes sont concernées en Rhône-Alpes ?",
    answer:
      "Une grande partie du territoire est en zone sismique 3 (modérée) ou 4 (moyenne) : Chambéry et la Savoie, Annecy et la Haute-Savoie, Grenoble et l'Isère sont presque intégralement classés. Les Alpes-Maritimes et le sud du Rhône sont en zone 4. La carte officielle est consultable sur georisques.gouv.fr.",
  },
  {
    question: "Combien coûte une attestation sismique ?",
    answer:
      "Le coût varie de 300 € à 1 500 € selon la complexité du projet (surface, terrain, fondations, hauteur). Pour une maison individuelle simple en zone 3, comptez 400 à 700 €. Demandez plusieurs devis : un BET peut être plus cher mais plus rapide qu'un architecte saturé.",
  },
  {
    question: "Quand faut-il fournir l'attestation au dossier de permis ?",
    answer:
      "L'attestation doit être jointe dès le dépôt du dossier de demande de permis de construire. Sans elle, la mairie peut suspendre l'instruction du dossier (article R. 431-16-c du code de l'urbanisme). Anticipez : prévoyez 2 à 4 semaines pour obtenir le document.",
  },
  {
    question: "L'attestation est-elle aussi exigée pour les rénovations ?",
    answer:
      "Pour une rénovation lourde modifiant la structure (extension, surélévation, remplacement de murs porteurs) en zone sismique 3, 4 ou 5, l'attestation est généralement exigée. Pour les travaux simples (peinture, sols, plomberie), elle ne l'est pas. Vérifiez avec votre mairie ou un BET.",
  },
];

export default function AttestationSismiquePage() {
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
      logo: { "@type": "ImageObject", url: "https://www.bativio.fr/icons/icon-512.png" },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": "https://www.bativio.fr/attestation-sismique" },
  };

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Attestation sismique PCMI13",
    name: "Attestation parasismique pour permis de construire",
    description:
      "Mise en relation avec des artisans qualifiés pour rédiger une attestation sismique (Cerfa PCMI13) à joindre à un permis de construire en zone sismique 3, 4 ou 5.",
    provider: {
      "@type": "Organization",
      name: "Bativio",
      url: "https://www.bativio.fr",
    },
    areaServed: [
      { "@type": "AdministrativeArea", name: "Auvergne-Rhône-Alpes" },
      { "@type": "City", name: "Chambéry" },
      { "@type": "City", name: "Annecy" },
      { "@type": "City", name: "Grenoble" },
    ],
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
      { "@type": "ListItem", position: 1, name: "Accueil", item: "https://www.bativio.fr/" },
      { "@type": "ListItem", position: 2, name: "Attestation sismique", item: "https://www.bativio.fr/attestation-sismique" },
    ],
  };

  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section style={{ background: "var(--bois,#3D2E1F)", padding: "56px 24px 48px", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: -120, right: -80, width: 400, height: 400, borderRadius: "50%", background: "rgba(196,83,26,.06)" }} />
          <div style={{ maxWidth: 760, margin: "0 auto", position: "relative", zIndex: 1 }}>
            <nav style={{ fontSize: 13, color: "rgba(255,255,255,.7)", marginBottom: 14 }}>
              <Link href="/" style={{ color: "rgba(255,255,255,.7)" }}>Accueil</Link>
              <span style={{ margin: "0 6px" }}>/</span>
              <span style={{ color: "rgba(255,255,255,.55)" }}>Attestation sismique</span>
            </nav>
            <span style={{ display: "inline-block", padding: "5px 12px", borderRadius: 20, background: "rgba(201,148,58,.18)", color: "#E8A84C", fontSize: 11, fontWeight: 700, letterSpacing: 1.4, textTransform: "uppercase", marginBottom: 18 }}>
              Cerfa PCMI13 · Permis de construire
            </span>
            <h1 style={{ fontFamily: "'Fraunces',serif", fontSize: "clamp(28px,4.4vw,42px)", fontWeight: 700, color: "#fff", lineHeight: 1.12, letterSpacing: -0.5, marginBottom: 14 }}>
              Attestation sismique PCMI13&nbsp;: trouvez un artisan certifié en Rhône-Alpes
            </h1>
            <p style={{ fontSize: 16, color: "rgba(255,255,255,.78)", lineHeight: 1.65, maxWidth: 640 }}>
              Document obligatoire pour tout permis de construire en zone sismique 3, 4 ou 5. Bativio référence des artisans (architectes, BET, maîtres d&apos;œuvre) qualifiés pour rédiger votre attestation parasismique conforme à l&apos;Eurocode 8.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 24 }}>
              <Link
                href="/chambery"
                style={{ padding: "12px 22px", borderRadius: 10, background: "var(--terre,#C4531A)", color: "#fff", fontSize: 15, fontWeight: 600, textDecoration: "none" }}
              >
                Trouver un artisan à Chambéry
              </Link>
              <Link
                href="/grenoble"
                style={{ padding: "12px 22px", borderRadius: 10, border: "1px solid rgba(255,255,255,.25)", color: "#fff", fontSize: 15, fontWeight: 600, textDecoration: "none" }}
              >
                À Grenoble
              </Link>
              <Link
                href="/annecy"
                style={{ padding: "12px 22px", borderRadius: 10, border: "1px solid rgba(255,255,255,.25)", color: "#fff", fontSize: 15, fontWeight: 600, textDecoration: "none" }}
              >
                À Annecy
              </Link>
            </div>
          </div>
        </section>

        {/* Pourquoi */}
        <section style={{ padding: "56px 24px", background: "var(--creme,#FAF8F5)" }}>
          <div style={{ maxWidth: 760, margin: "0 auto" }}>
            <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: "clamp(22px,3vw,30px)", fontWeight: 700, color: "var(--anthracite,#1C1C1E)", marginBottom: 14 }}>
              Pourquoi cette attestation est obligatoire
            </h2>
            <p style={{ fontSize: 15, color: "var(--bois-mid,#5C4A3A)", lineHeight: 1.75, marginBottom: 14 }}>
              La France compte 5 zones de sismicité (1 très faible à 5 forte). En Rhône-Alpes, la quasi-totalité des départements alpins (Savoie, Haute-Savoie, Isère, partie est de la Drôme) est classée en zone 3 ou 4. Tout projet de construction de maison individuelle dans ces zones doit respecter l&apos;Eurocode 8 (NF EN 1998).
            </p>
            <p style={{ fontSize: 15, color: "var(--bois-mid,#5C4A3A)", lineHeight: 1.75, marginBottom: 14 }}>
              L&apos;attestation sismique (formulaire Cerfa <strong>PCMI13</strong> pour les maisons individuelles) doit être jointe au dossier de permis de construire. Elle est rédigée et signée par un professionnel qualifié&nbsp;: architecte, bureau d&apos;études techniques structure, ou maître d&apos;œuvre disposant des compétences en calcul parasismique.
            </p>
            <p style={{ fontSize: 15, color: "var(--bois-mid,#5C4A3A)", lineHeight: 1.75 }}>
              Sans cette attestation, la mairie peut suspendre l&apos;instruction de votre dossier (article R. 431-16-c du code de l&apos;urbanisme).
            </p>
          </div>
        </section>

        {/* Étapes */}
        <section style={{ padding: "56px 24px", background: "#fff", borderTop: "1px solid var(--sable,#E8D5C0)", borderBottom: "1px solid var(--sable,#E8D5C0)" }}>
          <div style={{ maxWidth: 760, margin: "0 auto" }}>
            <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: "clamp(22px,3vw,30px)", fontWeight: 700, color: "var(--anthracite,#1C1C1E)", marginBottom: 28 }}>
              Comment l&apos;obtenir avec Bativio
            </h2>
            <ol style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 18 }}>
              {[
                { n: 1, t: "Décrivez votre projet", d: "Surface, terrain, zone sismique de votre commune (consultable sur georisques.gouv.fr)." },
                { n: 2, t: "Recevez 3 devis qualifiés", d: "Les artisans Bativio portant le badge 'Attestation sismique' (BET, architectes) vous répondent sous 48h." },
                { n: 3, t: "Comparez et choisissez", d: "Prix, délai, références sur des projets similaires en Rhône-Alpes." },
                { n: 4, t: "Recevez votre attestation signée", d: "Document Cerfa PCMI13 prêt à joindre à votre dossier permis. Comptez 2 à 4 semaines de délai." },
              ].map((e) => (
                <li key={e.n} style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                  <span style={{ flexShrink: 0, width: 36, height: 36, borderRadius: "50%", background: "var(--terre,#C4531A)", color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontFamily: "'Fraunces',serif" }}>{e.n}</span>
                  <div>
                    <h3 style={{ fontSize: 17, fontWeight: 700, color: "var(--bois,#3D2E1F)", marginBottom: 3 }}>{e.t}</h3>
                    <p style={{ fontSize: 14, color: "var(--bois-mid,#5C4A3A)", lineHeight: 1.6 }}>{e.d}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* FAQ */}
        <section style={{ padding: "56px 24px", background: "var(--creme,#FAF8F5)" }}>
          <div style={{ maxWidth: 760, margin: "0 auto" }}>
            <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: "clamp(22px,3vw,30px)", fontWeight: 700, color: "var(--anthracite,#1C1C1E)", marginBottom: 24 }}>
              Questions fréquentes
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

        {/* CTA */}
        <section style={{ padding: "56px 24px", background: "var(--bois,#3D2E1F)" }}>
          <div style={{ maxWidth: 640, margin: "0 auto", textAlign: "center" }}>
            <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: "clamp(22px,3vw,30px)", fontWeight: 700, color: "#fff", marginBottom: 12 }}>
              Lancez votre demande
            </h2>
            <p style={{ fontSize: 15, color: "rgba(255,255,255,.78)", marginBottom: 24, lineHeight: 1.65 }}>
              Devis gratuit. Réponse sous 48h. Aucune commission Bativio.
            </p>
            <Link
              href="/demande"
              style={{ display: "inline-block", padding: "14px 32px", borderRadius: 10, background: "var(--terre,#C4531A)", color: "#fff", fontSize: 16, fontWeight: 600, textDecoration: "none" }}
            >
              Demander un devis pour mon attestation
            </Link>
          </div>
        </section>
      </main>
      <Footer />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(serviceJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbJsonLd) }}
      />
    </>
  );
}
