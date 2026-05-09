import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { safeJsonLd } from "@/lib/html-escape";
import { VILLES } from "@/lib/constants";
import { findPublishableZone, getAllPublishableZones } from "@/lib/zones";

export const revalidate = 3600;

export function generateStaticParams() {
  const params: { ville: string }[] = VILLES.map((v) => ({ ville: v.slug }));
  for (const z of getAllPublishableZones()) {
    params.push({ ville: z.slug });
  }
  return params;
}

const ZONES_SISMIQUES: Record<string, number> = {
  "73": 4, "74": 4, "38": 4, "26": 3, "07": 3, "69": 3,
};

interface VilleInfo { nom: string; cp: string; departement: string; zoneSismique: number; }

function resolveVille(slug: string): VilleInfo | null {
  const principal = VILLES.find((v) => v.slug === slug);
  if (principal) {
    return { nom: principal.nom, cp: principal.codePostal, departement: principal.departement, zoneSismique: ZONES_SISMIQUES[principal.codePostal.slice(0, 2)] || 3 };
  }
  const zone = findPublishableZone(slug);
  if (zone) {
    return { nom: zone.name, cp: zone.cp, departement: zone.departement, zoneSismique: ZONES_SISMIQUES[zone.cp.slice(0, 2)] || 3 };
  }
  return null;
}

export async function generateMetadata({ params }: { params: Promise<{ ville: string }> }): Promise<Metadata> {
  const { ville } = await params;
  const info = resolveVille(ville);
  if (!info) return { title: "Page introuvable" };

  const title = `PCMI13 ${info.nom} — Formulaire Cerfa attestation parasismique`;
  const description = `Formulaire PCMI13 (Cerfa) pour permis de construire à ${info.nom} (${info.cp}). Attestation parasismique obligatoire en zone sismique ${info.zoneSismique}. Architectes et BET certifiés. Délai 48h.`;

  return {
    title,
    description,
    keywords: [
      `pcmi13 ${info.nom.toLowerCase()}`,
      `pcmi 13 ${info.nom.toLowerCase()}`,
      `cerfa pcmi13`,
      `formulaire pcmi13 ${info.nom.toLowerCase()}`,
      `pcmi13 cerfa ${info.nom.toLowerCase()}`,
      `attestation sismique ${info.nom.toLowerCase()}`,
      `pc12 ${info.nom.toLowerCase()}`,
      `at2 ${info.nom.toLowerCase()}`,
      `permis construire pcmi13 ${info.nom.toLowerCase()}`,
      `eurocode 8 ${info.nom.toLowerCase()}`,
      `bet structure ${info.nom.toLowerCase()}`,
      `architecte parasismique ${info.nom.toLowerCase()}`,
      `${info.nom.toLowerCase()} ${info.cp} pcmi13`,
    ],
    alternates: {
      canonical: `https://www.bativio.fr/pcmi13/${ville}`,
    },
    openGraph: {
      title,
      description,
      url: `https://www.bativio.fr/pcmi13/${ville}`,
      type: "article",
    },
  };
}

export default async function Pcmi13VillePage({ params }: { params: Promise<{ ville: string }> }) {
  const { ville } = await params;
  const info = resolveVille(ville);
  if (!info) notFound();

  const baseUrl = "https://www.bativio.fr";
  const url = `${baseUrl}/pcmi13/${ville}`;

  const FAQ = [
    {
      question: `Qu'est-ce que le formulaire PCMI13 à ${info.nom} ?`,
      answer: `PCMI13 est un imprimé Cerfa officiel à joindre à toute demande de permis de construire de maison individuelle (CERFA n° 13406) en zone sismique. À ${info.nom} (${info.cp}), classée zone ${info.zoneSismique}, ce formulaire certifie que votre projet respecte les règles parasismiques de l'Eurocode 8 (NF EN 1998).`,
    },
    {
      question: `Qui peut signer le PCMI13 à ${info.nom} ?`,
      answer: `Un architecte inscrit à l'Ordre, un bureau d'études techniques (BET) structure qualifié OPQIBI, ou un maître d'œuvre disposant des compétences en calcul parasismique. À ${info.nom}, plusieurs BET et architectes sont qualifiés — Bativio les référence avec le badge "Attestation sismique".`,
    },
    {
      question: `Combien coûte un PCMI13 à ${info.nom} ?`,
      answer: `Entre 350 € et 1 200 € à ${info.nom} selon la complexité du projet. Maison individuelle simple : 500-700 €. Projet avec terrain difficile, sous-sol ou hauteur importante : 800-1 500 €.`,
    },
    {
      question: `Différence entre PCMI13, PC12 et AT2 ?`,
      answer: `PCMI13 = maison individuelle (Cerfa 13406). PC12 = autres permis de construire (logement collectif, ERP, professionnel). AT2 = ouvrage spécifique. À ${info.nom}, le PCMI13 couvre 90% des demandes des particuliers.`,
    },
    {
      question: `Mon projet est-il concerné à ${info.nom} ?`,
      answer: `Oui si vous construisez ou agrandissez une maison individuelle à ${info.nom} (${info.cp}, zone ${info.zoneSismique}). Travaux modifiant la structure (extension, surélévation, ouverture mur porteur) également concernés. Travaux sans impact structurel (peinture, sols) : non concernés.`,
    },
  ];

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `PCMI13 à ${info.nom} — Formulaire Cerfa attestation parasismique`,
    description: `Tout sur le formulaire PCMI13 pour permis de construire à ${info.nom}.`,
    datePublished: "2026-05-04",
    dateModified: "2026-05-04",
    author: { "@type": "Organization", name: "Bativio" },
    publisher: { "@type": "Organization", name: "Bativio", logo: { "@type": "ImageObject", url: `${baseUrl}/icons/icon-512.png` } },
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
      { "@type": "ListItem", position: 2, name: "PCMI13", item: `${baseUrl}/pcmi13` },
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
              <Link href="/attestation-sismique" style={{ color: "rgba(255,255,255,.7)" }}>PCMI13</Link>
              <span style={{ margin: "0 6px" }}>/</span>
              <span style={{ color: "rgba(255,255,255,.55)" }}>{info.nom}</span>
            </nav>
            <span style={{ display: "inline-block", padding: "5px 12px", borderRadius: 20, background: "rgba(201,148,58,.18)", color: "#E8A84C", fontSize: 11, fontWeight: 700, letterSpacing: 1.4, textTransform: "uppercase", marginBottom: 18 }}>
              Cerfa 13406 · Zone sismique {info.zoneSismique}
            </span>
            <h1 style={{ fontFamily: "'Fraunces',serif", fontSize: "clamp(28px,4.4vw,42px)", fontWeight: 700, color: "#fff", lineHeight: 1.12, letterSpacing: -0.5, marginBottom: 14 }}>
              PCMI13 à {info.nom}&nbsp;: formulaire Cerfa et professionnels habilités
            </h1>
            <p style={{ fontSize: 16, color: "rgba(255,255,255,.78)", lineHeight: 1.65, maxWidth: 640 }}>
              Le <strong>formulaire PCMI13</strong> (Cerfa) est obligatoire à joindre à votre demande de permis de construire à {info.nom} ({info.cp}, zone sismique <strong>{info.zoneSismique}</strong>). Bativio référence les architectes, bureaux d&apos;études techniques structure et maîtres d&apos;œuvre qualifiés à {info.nom} pour le rédiger conformément à l&apos;Eurocode 8.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 24 }}>
              <Link href="/demande" style={{ padding: "12px 22px", borderRadius: 10, background: "var(--terre,#C4531A)", color: "#fff", fontSize: 15, fontWeight: 600, textDecoration: "none" }}>
                Demander un PCMI13 à {info.nom}
              </Link>
              <Link href={`/attestation-sismique/${ville}`} style={{ padding: "12px 22px", borderRadius: 10, border: "1px solid rgba(255,255,255,.25)", color: "#fff", fontSize: 15, fontWeight: 600, textDecoration: "none" }}>
                Guide complet attestation sismique
              </Link>
            </div>
          </div>
        </section>

        <section style={{ padding: "56px 24px", background: "var(--creme,#FAF8F5)" }}>
          <div style={{ maxWidth: 760, margin: "0 auto" }}>
            <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: "clamp(22px,3vw,30px)", fontWeight: 700, color: "var(--anthracite,#1C1C1E)", marginBottom: 14 }}>
              À quoi sert le PCMI13 à {info.nom}
            </h2>
            <p style={{ fontSize: 15, color: "var(--bois-mid,#5C4A3A)", lineHeight: 1.75, marginBottom: 14 }}>
              Le <strong>PCMI13</strong> (pièce complémentaire 13 du dossier de permis de construire de maison individuelle, Cerfa 13406) est l&apos;<strong>attestation parasismique</strong> exigée en zone sismique 3, 4 ou 5 par le décret n° 2010-1255 du 22 octobre 2010. Le département <strong>{info.departement}</strong> où se situe {info.nom} est classé zone {info.zoneSismique} — votre projet est donc concerné.
            </p>
            <p style={{ fontSize: 15, color: "var(--bois-mid,#5C4A3A)", lineHeight: 1.75, marginBottom: 14 }}>
              Le formulaire est rempli et signé par un <strong>contrôleur technique compétent en parasismique</strong> ou par un professionnel ayant les qualifications requises (architecte avec compétence parasismique, BET structure OPQIBI 2202 ou 2204). Il certifie que la conception du projet est conforme à l&apos;<strong>Eurocode 8</strong> (NF EN 1998-1).
            </p>
            <p style={{ fontSize: 15, color: "var(--bois-mid,#5C4A3A)", lineHeight: 1.75 }}>
              Sans PCMI13 dûment signé, votre dossier de permis de construire à {info.nom} sera <strong>incomplet</strong>. La mairie suspendra l&apos;instruction (article R. 431-16-c du code de l&apos;urbanisme) et vous demandera de compléter sous 3 mois.
            </p>
          </div>
        </section>

        <section style={{ padding: "56px 24px", background: "#fff", borderTop: "1px solid var(--sable,#E8D5C0)", borderBottom: "1px solid var(--sable,#E8D5C0)" }}>
          <div style={{ maxWidth: 760, margin: "0 auto" }}>
            <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: "clamp(22px,3vw,30px)", fontWeight: 700, color: "var(--anthracite,#1C1C1E)", marginBottom: 14 }}>
              PCMI13, PC12, AT2&nbsp;: quelle différence&nbsp;?
            </h2>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 14 }}>
              <li style={{ padding: "16px 20px", background: "var(--creme,#FAF8F5)", borderRadius: 12, border: "1px solid var(--sable,#E8D5C0)" }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: "var(--bois,#3D2E1F)", marginBottom: 6 }}>PCMI13 — Maison individuelle</h3>
                <p style={{ fontSize: 14, color: "var(--bois-mid,#5C4A3A)", lineHeight: 1.6 }}>Cerfa 13406. Pour les particuliers à {info.nom} qui construisent ou étendent une maison individuelle. C&apos;est le cas le plus courant (~90%).</p>
              </li>
              <li style={{ padding: "16px 20px", background: "var(--creme,#FAF8F5)", borderRadius: 12, border: "1px solid var(--sable,#E8D5C0)" }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: "var(--bois,#3D2E1F)", marginBottom: 6 }}>PC12 — Autres bâtiments</h3>
                <p style={{ fontSize: 14, color: "var(--bois-mid,#5C4A3A)", lineHeight: 1.6 }}>Cerfa 13409. Logement collectif, bâtiment professionnel, ERP. À {info.nom}, exigé pour tous projets autres que maison individuelle.</p>
              </li>
              <li style={{ padding: "16px 20px", background: "var(--creme,#FAF8F5)", borderRadius: 12, border: "1px solid var(--sable,#E8D5C0)" }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: "var(--bois,#3D2E1F)", marginBottom: 6 }}>AT2 — Aménagement spécifique</h3>
                <p style={{ fontSize: 14, color: "var(--bois-mid,#5C4A3A)", lineHeight: 1.6 }}>Pour des aménagements particuliers (lotissement, ouvrage technique). Plus rare.</p>
              </li>
            </ul>
          </div>
        </section>

        <section style={{ padding: "56px 24px", background: "var(--creme,#FAF8F5)" }}>
          <div style={{ maxWidth: 760, margin: "0 auto" }}>
            <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: "clamp(22px,3vw,30px)", fontWeight: 700, color: "var(--anthracite,#1C1C1E)", marginBottom: 24 }}>
              Questions fréquentes — PCMI13 à {info.nom}
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
              Devis PCMI13 à {info.nom}
            </h2>
            <p style={{ fontSize: 15, color: "rgba(255,255,255,.78)", marginBottom: 24, lineHeight: 1.65 }}>
              Comparez 3 devis gratuits sous 48h. Aucune commission Bativio.
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
