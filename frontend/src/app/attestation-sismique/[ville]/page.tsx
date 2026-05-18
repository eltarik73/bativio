import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ExternalCtaButton from "@/components/ExternalCtaButton";
import { safeJsonLd } from "@/lib/html-escape";
import { VILLES } from "@/lib/constants";
import { findPublishableZone, getAllPublishableZones, ZONES_SEO } from "@/lib/zones";

export const revalidate = 3600;

// Génère statiquement /attestation-sismique/{ville} pour les 5 villes principales
// + toutes les zones publiables. Les zones sismiques 3-4-5 d'Auvergne-Rhône-Alpes
// = ~100 pages.
export function generateStaticParams() {
  const params: { ville: string }[] = VILLES.map((v) => ({ ville: v.slug }));
  for (const z of getAllPublishableZones()) {
    params.push({ ville: z.slug });
  }
  return params;
}

interface VilleInfo {
  nom: string;
  cp: string;
  departement: string;
  zoneSismique: number;
}

const ZONES_SISMIQUES: Record<string, number> = {
  // Savoie / Haute-Savoie / Isère / Drôme = mostly zone 3-4
  "73": 4, "74": 4, "38": 4, "26": 3, "07": 3, "69": 3,
};

function resolveVille(slug: string): VilleInfo | null {
  const principal = VILLES.find((v) => v.slug === slug);
  if (principal) {
    return {
      nom: principal.nom,
      cp: principal.codePostal,
      departement: principal.departement,
      zoneSismique: ZONES_SISMIQUES[principal.codePostal.slice(0, 2)] || 3,
    };
  }
  const zone = findPublishableZone(slug);
  if (zone) {
    return {
      nom: zone.name,
      cp: zone.cp,
      departement: zone.departement,
      zoneSismique: ZONES_SISMIQUES[zone.cp.slice(0, 2)] || 3,
    };
  }
  return null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ ville: string }>;
}): Promise<Metadata> {
  const { ville } = await params;
  const info = resolveVille(ville);
  if (!info) return { title: "Page introuvable" };

  const title = `Attestation sismique ${info.nom} (PCMI13) — Artisans certifiés`;
  const description = `Attestation parasismique PCMI13 à ${info.nom} (${info.cp}, zone sismique ${info.zoneSismique}). Trouvez un architecte ou BET certifié pour votre permis de construire. Devis gratuit, délai 48h.`;

  return {
    title,
    description,
    keywords: [
      `attestation sismique ${info.nom.toLowerCase()}`,
      `pcmi13 ${info.nom.toLowerCase()}`,
      `pcmi 13 ${info.nom.toLowerCase()}`,
      `attestation parasismique ${info.nom.toLowerCase()}`,
      `permis de construire ${info.nom.toLowerCase()} zone sismique`,
      `cerfa pcmi13 ${info.nom.toLowerCase()}`,
      `at2 ${info.nom.toLowerCase()}`,
      `pc12 ${info.nom.toLowerCase()}`,
      `eurocode 8 ${info.nom.toLowerCase()}`,
      `bureau etudes parasismique ${info.nom.toLowerCase()}`,
      `architecte parasismique ${info.nom.toLowerCase()}`,
      `zone sismique ${info.zoneSismique} ${info.nom.toLowerCase()}`,
      `${info.nom.toLowerCase()} ${info.cp}`,
    ],
    alternates: {
      canonical: `https://www.bativio.fr/attestation-sismique/${ville}`,
    },
    openGraph: {
      title,
      description,
      url: `https://www.bativio.fr/attestation-sismique/${ville}`,
      type: "article",
      images: [{ url: "https://www.bativio.fr/og-image.png", width: 1200, height: 630 }],
    },
  };
}

export default async function AttestationSismiqueVillePage({
  params,
}: {
  params: Promise<{ ville: string }>;
}) {
  const { ville } = await params;
  const info = resolveVille(ville);
  if (!info) notFound();

  const baseUrl = "https://www.bativio.fr";
  const url = `${baseUrl}/attestation-sismique/${ville}`;

  // Communes alentours pour maillage interne
  const villeMere = VILLES.find((v) => v.slug === ville);
  const alentoursSlug = villeMere?.slug || (findPublishableZone(ville)?.villeMereSlug ?? "chambery");
  const alentours = (ZONES_SEO[alentoursSlug]?.zones || []).slice(0, 8);

  const FAQ = [
    {
      question: `Faut-il une attestation sismique pour construire à ${info.nom} ?`,
      answer: `${info.nom} (${info.cp}) est en zone sismique ${info.zoneSismique} selon le zonage officiel français. Toute demande de permis de construire pour une maison individuelle nécessite une attestation parasismique (PCMI13) jointe au dossier. Sans elle, la mairie de ${info.nom} peut suspendre l'instruction.`,
    },
    {
      question: `Combien coûte une attestation sismique à ${info.nom} ?`,
      answer: `À ${info.nom}, comptez entre 350 € et 1 200 € selon la complexité (surface, terrain, hauteur). Une maison standard en zone ${info.zoneSismique} se chiffre à 500-700 €. Comparez plusieurs devis sur Bativio.`,
    },
    {
      question: `Qui délivre l'attestation PCMI13 à ${info.nom} ?`,
      answer: `Architecte, bureau d'études techniques (BET) structure ou maître d'œuvre disposant des compétences en calcul parasismique selon Eurocode 8. Les artisans Bativio à ${info.nom} portant le badge "Attestation sismique" sont qualifiés.`,
    },
    {
      question: `Quel est le délai pour obtenir l'attestation à ${info.nom} ?`,
      answer: `2 à 4 semaines selon la disponibilité du professionnel. En urgence (besoin avant dépôt permis), certains BET de ${info.nom} livrent en 48-72h moyennant majoration.`,
    },
    {
      question: `L'attestation est-elle exigée pour les rénovations à ${info.nom} ?`,
      answer: `Oui pour les rénovations lourdes modifiant la structure (extension, surélévation, ouverture de mur porteur) en zone sismique ${info.zoneSismique}. Non pour les travaux simples (peinture, sols, plomberie).`,
    },
  ];

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `Attestation sismique à ${info.nom} (PCMI13) — Guide complet`,
    description: `Tout savoir sur l'attestation parasismique pour permis de construire à ${info.nom} (${info.cp}, zone sismique ${info.zoneSismique}).`,
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

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Attestation sismique PCMI13",
    name: `Attestation parasismique ${info.nom}`,
    description: `Mise en relation avec des architectes et BET certifiés à ${info.nom} pour rédiger l'attestation sismique PCMI13 (Cerfa) à joindre au permis de construire en zone sismique ${info.zoneSismique}.`,
    keywords: `attestation sismique ${info.nom}, PCMI13 ${info.nom}, parasismique ${info.nom}, permis de construire ${info.nom}, Eurocode 8`,
    provider: { "@type": "Organization", name: "Bativio", url: baseUrl },
    areaServed: {
      "@type": "City",
      name: info.nom,
      containedInPlace: { "@type": "AdministrativeArea", name: info.departement },
    },
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
      { "@type": "ListItem", position: 2, name: "Attestation sismique", item: `${baseUrl}/attestation-sismique` },
      { "@type": "ListItem", position: 3, name: info.nom, item: url },
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
              <Link href="/attestation-sismique" style={{ color: "rgba(255,255,255,.7)" }}>Attestation sismique</Link>
              <span style={{ margin: "0 6px" }}>/</span>
              <span style={{ color: "rgba(255,255,255,.55)" }}>{info.nom}</span>
            </nav>
            <span style={{ display: "inline-block", padding: "5px 12px", borderRadius: 20, background: "rgba(201,148,58,.18)", color: "#E8A84C", fontSize: 11, fontWeight: 700, letterSpacing: 1.4, textTransform: "uppercase", marginBottom: 18 }}>
              Cerfa PCMI13 · Zone sismique {info.zoneSismique}
            </span>
            <h1 style={{ fontFamily: "'Fraunces',serif", fontSize: "clamp(28px,4.4vw,42px)", fontWeight: 700, color: "#fff", lineHeight: 1.12, letterSpacing: -0.5, marginBottom: 14 }}>
              Attestation sismique à {info.nom}&nbsp;: PCMI13, devis et artisans certifiés
            </h1>
            <p style={{ fontSize: 16, color: "rgba(255,255,255,.78)", lineHeight: 1.65, maxWidth: 640 }}>
              {info.nom} ({info.cp}) est classée en <strong>zone sismique {info.zoneSismique}</strong> par le zonage officiel français. Toute demande de permis de construire pour une maison individuelle doit être accompagnée de l&apos;attestation parasismique <strong>PCMI13</strong> (Cerfa). Bativio référence les architectes, bureaux d&apos;études techniques et maîtres d&apos;œuvre certifiés à {info.nom} pour rédiger ce document conforme à l&apos;Eurocode 8.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 24 }}>
              <Link href="/demande" style={{ padding: "12px 22px", borderRadius: 10, background: "var(--terre,#C4531A)", color: "#fff", fontSize: 15, fontWeight: 600, textDecoration: "none" }}>
                Demander un devis à {info.nom}
              </Link>
              <Link href={`/${ville}`} style={{ padding: "12px 22px", borderRadius: 10, border: "1px solid rgba(255,255,255,.25)", color: "#fff", fontSize: 15, fontWeight: 600, textDecoration: "none" }}>
                Tous les artisans de {info.nom}
              </Link>
            </div>
          </div>
        </section>

        {/* Bouton partenaire monpcmi13.com — solution rapide en ligne pour
            commander l'attestation. Backlink reciproque + tracking ClickEvent. */}
        <section style={{ padding: "32px 24px", background: "#fff", borderBottom: "1px solid var(--sable,#E8D5C0)" }}>
          <div style={{ maxWidth: 760, margin: "0 auto", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 16 }}>
            <span style={{ display: "inline-block", padding: "4px 12px", borderRadius: 20, background: "rgba(73,103,65,.10)", color: "var(--mousse,#4A6741)", fontSize: 11, fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase" }}>
              Solution rapide en ligne
            </span>
            <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: "clamp(20px,2.5vw,26px)", fontWeight: 700, color: "var(--anthracite,#1C1C1E)", lineHeight: 1.25, margin: 0 }}>
              Créez votre attestation en 5 min, recevez-la dans les 24h
            </h2>
            <p style={{ fontSize: 14, color: "var(--bois-mid,#5C4A3A)", lineHeight: 1.6, maxWidth: 540, margin: 0 }}>
              Service partenaire <strong>monpcmi13.com</strong> — formulaire en ligne simple, attestation
              parasismique conforme Eurocode 8, livrée par email.
            </p>
            <ExternalCtaButton
              href="https://www.monpcmi13.com"
              trackLabel={`cta_monpcmi13_attestation_${ville}`}
              category="cta_partner"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                padding: "14px 28px",
                borderRadius: 12,
                background: "var(--mousse,#4A6741)",
                color: "#fff",
                fontSize: 15,
                fontWeight: 700,
                textDecoration: "none",
                boxShadow: "0 4px 14px rgba(73,103,65,.20)",
              }}
            >
              Créer mon attestation sur monpcmi13.com
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 17l9.2-9.2M17 17V8H8" />
              </svg>
            </ExternalCtaButton>
          </div>
        </section>

        <section style={{ padding: "56px 24px", background: "var(--creme,#FAF8F5)" }}>
          <div style={{ maxWidth: 760, margin: "0 auto" }}>
            <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: "clamp(22px,3vw,30px)", fontWeight: 700, color: "var(--anthracite,#1C1C1E)", marginBottom: 14 }}>
              Pourquoi {info.nom} est concernée
            </h2>
            <p style={{ fontSize: 15, color: "var(--bois-mid,#5C4A3A)", lineHeight: 1.75, marginBottom: 14 }}>
              Le département <strong>{info.departement}</strong> est classé en <strong>zone sismique {info.zoneSismique}</strong> selon le décret n° 2010-1255 du 22 octobre 2010. Cela signifie que tous les bâtiments neufs ou les rénovations lourdes à {info.nom} doivent respecter les règles parasismiques de l&apos;<strong>Eurocode 8</strong> (norme NF EN 1998).
            </p>
            <p style={{ fontSize: 15, color: "var(--bois-mid,#5C4A3A)", lineHeight: 1.75, marginBottom: 14 }}>
              Concrètement, si vous déposez une demande de <strong>permis de construire à {info.nom}</strong> pour une maison individuelle (CERFA n° 13406), vous devez joindre l&apos;<strong>attestation PCMI13</strong> (parfois appelée AT2 ou PC12 selon la nature du projet). Cette attestation certifie que votre projet a été conçu dans le respect des règles parasismiques.
            </p>
            <p style={{ fontSize: 15, color: "var(--bois-mid,#5C4A3A)", lineHeight: 1.75 }}>
              Sans cette attestation, la mairie de {info.nom} peut <strong>suspendre l&apos;instruction du dossier</strong> (article R. 431-16-c du code de l&apos;urbanisme). Anticipez : prévoyez 2 à 4 semaines pour obtenir le document auprès d&apos;un architecte ou d&apos;un BET certifié de {info.nom}.
            </p>
          </div>
        </section>

        <section style={{ padding: "56px 24px", background: "#fff", borderTop: "1px solid var(--sable,#E8D5C0)", borderBottom: "1px solid var(--sable,#E8D5C0)" }}>
          <div style={{ maxWidth: 760, margin: "0 auto" }}>
            <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: "clamp(22px,3vw,30px)", fontWeight: 700, color: "var(--anthracite,#1C1C1E)", marginBottom: 28 }}>
              Comment obtenir votre attestation à {info.nom}
            </h2>
            <ol style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 18 }}>
              {[
                { n: 1, t: `Décrivez votre projet à ${info.nom}`, d: `Surface, terrain (étude G2 si possible), nature du projet (neuf, extension, surélévation). Les BET de ${info.nom} demandent ces infos pour chiffrer.` },
                { n: 2, t: "Recevez 3 devis qualifiés sous 48h", d: `Les architectes et BET Bativio à ${info.nom} vous répondent rapidement. Comparez prix et délais.` },
                { n: 3, t: "Choisissez votre professionnel", d: "Vérifiez ses qualifications (OPQIBI, Qualibat, ordre des architectes), demandez des références sur des projets similaires." },
                { n: 4, t: "Recevez l'attestation signée", d: "Document Cerfa PCMI13 prêt à joindre à votre dossier de permis. Délai : 2-4 semaines en standard, 48-72h en urgence." },
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

        <section style={{ padding: "56px 24px", background: "var(--creme,#FAF8F5)" }}>
          <div style={{ maxWidth: 760, margin: "0 auto" }}>
            <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: "clamp(22px,3vw,30px)", fontWeight: 700, color: "var(--anthracite,#1C1C1E)", marginBottom: 24 }}>
              Questions fréquentes — Attestation sismique à {info.nom}
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

        {alentours.length > 0 && (
          <section style={{ padding: "56px 24px", background: "#fff", borderTop: "1px solid var(--sable,#E8D5C0)" }}>
            <div style={{ maxWidth: 1080, margin: "0 auto" }}>
              <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: "clamp(22px,3vw,30px)", fontWeight: 700, color: "var(--anthracite,#1C1C1E)", marginBottom: 24 }}>
                Attestation sismique dans les communes autour de {info.nom}
              </h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 10 }}>
                {alentours.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/attestation-sismique/${c.slug}`}
                    style={{ padding: "12px 16px", borderRadius: 10, border: "1px solid var(--sable,#E8D5C0)", background: "var(--creme,#FAF8F5)", color: "var(--bois,#3D2E1F)", fontSize: 14, fontWeight: 500, textDecoration: "none" }}
                  >
                    Attestation sismique à {c.name}
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        <section style={{ padding: "56px 24px", background: "var(--bois,#3D2E1F)" }}>
          <div style={{ maxWidth: 640, margin: "0 auto", textAlign: "center" }}>
            <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: "clamp(22px,3vw,30px)", fontWeight: 700, color: "#fff", marginBottom: 12 }}>
              Lancez votre demande à {info.nom}
            </h2>
            <p style={{ fontSize: 15, color: "rgba(255,255,255,.78)", marginBottom: 24, lineHeight: 1.65 }}>
              Devis gratuit. Réponse sous 48h. Aucune commission Bativio.
            </p>
            <Link href="/demande" style={{ display: "inline-block", padding: "14px 32px", borderRadius: 10, background: "var(--terre,#C4531A)", color: "#fff", fontSize: 16, fontWeight: 600, textDecoration: "none" }}>
              Demander un devis pour mon attestation
            </Link>
          </div>
        </section>
      </main>
      <Footer />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(serviceJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbJsonLd) }} />
    </>
  );
}
