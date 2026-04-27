import { Metadata } from "next";
import { notFound } from "next/navigation";
import ArtisanCard from "@/components/ArtisanCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { MOCK_VILLES, MOCK_ARTISANS, MOCK_METIERS } from "@/lib/mock-data";
import { getVille, getMetiers } from "@/lib/api";
import type { ArtisanPublic, MetierData } from "@/lib/api";
import { VILLES, VILLES_SECONDAIRES, METIERS_TOP_SEO } from "@/lib/constants";
import VilleClient from "./VilleClient";
import { safeJsonLd, sanitizeAdminHtml } from "@/lib/html-escape";
import { prisma } from "@/lib/prisma";
import MetierVilleListing from "./MetierVilleListing";
import LocalMetierVillePage from "./LocalMetierVillePage";

/**
 * Helper : detecte si un slug correspond a un combo {metier_top_seo}-{ville_secondaire}.
 * Retourne {metier, ville} si match, sinon null.
 */
function matchLocalMetierVille(slug: string): { metierSlug: string; villeSlug: string } | null {
  for (const m of METIERS_TOP_SEO) {
    if (slug.startsWith(m + "-")) {
      const v = slug.slice(m.length + 1);
      if (VILLES_SECONDAIRES.some((vs) => vs.slug === v)) {
        return { metierSlug: m, villeSlug: v };
      }
    }
  }
  return null;
}

export const revalidate = 3600;

// SEO: lister TOUS les slugs valides + interdire les autres → vrai HTTP 404
// Inclut villes principales + metier-ville composites depuis DB (artisans Business).
export const dynamicParams = false; // CRITICAL: tout slug non listé = HTTP 404 propre

export async function generateStaticParams() {
  const params: { ville: string }[] = VILLES.map((v) => ({ ville: v.slug }));

  // Combos statiques : METIERS_TOP_SEO x VILLES_SECONDAIRES (long tail SEO local)
  // Ex: electricien-aix-les-bains, plombier-saint-jean-de-maurienne, etc.
  for (const metier of METIERS_TOP_SEO) {
    for (const v of VILLES_SECONDAIRES) {
      params.push({ ville: `${metier}-${v.slug}` });
    }
  }

  try {
    // Composites dynamiques depuis DB (artisans Business avec metierSlugSeo + villeSlug)
    const composites = await prisma.artisan.findMany({
      where: { actif: true, deletedAt: null, metierSlugSeo: { not: null }, villeSlug: { not: null } },
      select: { metierSlugSeo: true, villeSlug: true },
      distinct: ["metierSlugSeo", "villeSlug"],
    });
    const existing = new Set(params.map((p) => p.ville));
    for (const c of composites) {
      if (c.metierSlugSeo && c.villeSlug) {
        const slug = `${c.metierSlugSeo}-${c.villeSlug}`;
        if (!existing.has(slug)) {
          params.push({ ville: slug });
          existing.add(slug);
        }
      }
    }
  } catch {
    /* fallback : juste les villes statiques + combos METIERS_TOP_SEO */
  }
  return params;
}

export async function generateMetadata({ params }: { params: Promise<{ ville: string }> }): Promise<Metadata> {
  const { ville: villeSlug } = await params;

  // SEO: lowercase enforce + 404 immédiat pour slugs invalides
  if (villeSlug !== villeSlug.toLowerCase()) {
    notFound();
  }

  // 1) Check if this is a static metier-ville combo (METIER_TOP x VILLE_SECONDAIRE)
  const localCombo = matchLocalMetierVille(villeSlug);
  if (localCombo) {
    const ville = VILLES_SECONDAIRES.find((v) => v.slug === localCombo.villeSlug)!;
    const metierLabel = localCombo.metierSlug.charAt(0).toUpperCase() + localCombo.metierSlug.slice(1);
    const { getTitleHook, getDescription } = await import("@/lib/seo-local");
    const hook = getTitleHook(localCombo.metierSlug, localCombo.villeSlug);
    // Title : hook discret + nom metier + ville + CP + accroche
    const title = `${metierLabel} ${ville.nom} (${ville.codePostal}) ${hook.emoji} ${hook.suffix}`;
    const description = getDescription(metierLabel, ville.nom, ville.codePostal);
    return {
      title,
      description,
      keywords: `${metierLabel.toLowerCase()} ${ville.nom}, ${metierLabel.toLowerCase()} ${ville.codePostal}, devis ${metierLabel.toLowerCase()} ${ville.nom}, artisan ${ville.nom}, bativio`,
      alternates: { canonical: `https://www.bativio.fr/${villeSlug}` },
      openGraph: {
        title: `${metierLabel} à ${ville.nom} (${ville.codePostal}) | Bativio`,
        description,
        url: `https://www.bativio.fr/${villeSlug}`,
        type: "website",
        locale: "fr_FR",
      },
      twitter: {
        card: "summary_large_image",
        title: `${metierLabel} ${ville.nom} | Devis gratuit`,
        description,
      },
    };
  }

  // 2) Check if this is a metier-ville composite slug (depuis DB)
  const knownVille = VILLES.find((v) => v.slug === villeSlug);
  if (!knownVille) {
    // Try metier-ville lookup
    const match = await prisma.artisan.findFirst({
      where: { actif: true, deletedAt: null, metierSlugSeo: { not: null }, villeSlug: { not: null } },
      select: { metierSlugSeo: true, villeSlug: true, ville: true, metier: { select: { nom: true } } },
    }).then(async () => {
      const combos = await prisma.artisan.findMany({
        where: { actif: true, deletedAt: null, metierSlugSeo: { not: null }, villeSlug: { not: null } },
        select: { metierSlugSeo: true, villeSlug: true, ville: true, metier: { select: { nom: true } } },
        distinct: ["metierSlugSeo", "villeSlug"],
      });
      for (const c of combos) {
        if (c.metierSlugSeo && c.villeSlug && `${c.metierSlugSeo}-${c.villeSlug}` === villeSlug) return c;
      }
      return null;
    });

    if (match) {
      const metierName = match.metier?.nom || match.metierSlugSeo || "";
      const villeName = match.ville || match.villeSlug || "";
      const title = `${metierName} \u00e0 ${villeName} \u2014 Devis gratuit`;
      const description = `Trouvez les meilleurs ${metierName.toLowerCase()}s à ${villeName}. Comparez les artisans, demandez un devis gratuit.`;
      return { title, description, alternates: { canonical: `https://www.bativio.fr/${villeSlug}` }, openGraph: { title, description, url: `https://www.bativio.fr/${villeSlug}` } };
    }
    // Pas une ville connue ET pas un metier-ville → 404 immédiat
    notFound();
  }

  let nom = villeSlug;
  let seoTitle = "";
  let seoDesc = "";
  try {
    const data = await getVille(villeSlug);
    const villeObj = (data as unknown as Record<string, unknown>).ville as Record<string, unknown> || data;
    nom = (villeObj.nom as string) || (data.nom as string) || villeSlug;
    seoTitle = (villeObj.seoTitle as string) || "";
    seoDesc = (villeObj.seoDescription as string) || "";
  } catch {
    const mock = MOCK_VILLES.find((v) => v.slug === villeSlug);
    nom = mock?.nom || villeSlug;
  }
  const title = seoTitle || `Artisans du bâtiment à ${nom}`;
  const description = seoDesc || `Trouvez les meilleurs artisans du bâtiment à ${nom}. Plombier, électricien, peintre, maçon. Devis gratuit, zéro commission.`;
  return {
    title,
    description,
    alternates: { canonical: `https://www.bativio.fr/${villeSlug}` },
    openGraph: {
      title,
      description,
      url: `https://www.bativio.fr/${villeSlug}`,
      images: [{ url: "https://www.bativio.fr/og-image.png", width: 1200, height: 630 }],
    },
  };
}

export default async function VillePage({ params }: { params: Promise<{ ville: string }> }) {
  const { ville: villeSlug } = await params;

  // Force lowercase URL — redirect 308 vers slug normalisé
  if (villeSlug !== villeSlug.toLowerCase()) {
    notFound(); // Next.js redirige automatiquement via not-found.tsx
  }

  // 1) Page locale METIER_TOP x VILLE_SECONDAIRE (ex: /electricien-aix-les-bains)
  const localCombo = matchLocalMetierVille(villeSlug);
  if (localCombo) {
    return <LocalMetierVillePage metierSlug={localCombo.metierSlug} villeSlug={localCombo.villeSlug} />;
  }

  // 2) Essayer le backend, fallback mock
  let ville = MOCK_VILLES.find((v) => v.slug === villeSlug);
  let artisans: ArtisanPublic[] = MOCK_ARTISANS.filter(
    (a) => a.ville.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z]/g, "") === villeSlug
  );
  let metiers: MetierData[] = MOCK_METIERS;

  try {
    const [villeData, metiersData] = await Promise.all([getVille(villeSlug), getMetiers()]);
    if (villeData) {
      ville = { id: "", nom: villeData.nom || ville?.nom || villeSlug, slug: villeSlug, codePostal: ville?.codePostal || "", departement: ville?.departement || "", contenuSeo: villeData.contenuSeo || ville?.contenuSeo || "", nombreArtisans: (villeData as { artisans?: ArtisanPublic[] }).artisans?.length || 0 };
      const apiArtisans = (villeData as { artisans?: ArtisanPublic[] }).artisans;
      if (apiArtisans && apiArtisans.length > 0) artisans = apiArtisans;
    }
    if (metiersData && metiersData.length > 0) metiers = metiersData;
  } catch { /* fallback mock */ }

  // If this slug is not a known city, check if it's a metier-ville composite slug
  const knownVille = VILLES.find((v) => v.slug === villeSlug);
  if (!knownVille && artisans.length === 0) {
    // Try to find a metier-ville match: e.g. "reparation-mobile-chambery"
    const metierVilleMatch = await prisma.artisan.findFirst({
      where: {
        actif: true,
        deletedAt: null,
      },
      select: { metierSlugSeo: true, villeSlug: true, ville: true, metier: { select: { nom: true } } },
    }).then(async () => {
      // Find all unique metierSlugSeo-villeSlug combinations
      const combos = await prisma.artisan.findMany({
        where: { actif: true, deletedAt: null, metierSlugSeo: { not: null }, villeSlug: { not: null } },
        select: { metierSlugSeo: true, villeSlug: true, ville: true, metier: { select: { nom: true } } },
        distinct: ["metierSlugSeo", "villeSlug"],
      });
      for (const c of combos) {
        if (c.metierSlugSeo && c.villeSlug && `${c.metierSlugSeo}-${c.villeSlug}` === villeSlug) {
          return { metierSlug: c.metierSlugSeo, villeSlug: c.villeSlug, metierDisplay: c.metier?.nom || c.metierSlugSeo, villeDisplay: c.ville || c.villeSlug };
        }
      }
      return null;
    });

    if (metierVilleMatch) {
      return <MetierVilleListing {...metierVilleMatch} />;
    }

    notFound();
  }

  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section style={{ background: "var(--bois, #3D2E1F)", padding: "48px 32px 40px", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: -120, right: -80, width: 400, height: 400, borderRadius: "50%", background: "rgba(196,83,26,.06)" }} />
          <div style={{ position: "absolute", bottom: -100, left: -60, width: 340, height: 340, borderRadius: "50%", background: "rgba(201,148,58,.04)" }} />
          <div style={{ maxWidth: 680, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}>
            <nav style={{ fontSize: 13, color: "rgba(255,255,255,.75)", marginBottom: 16 }}>
              <a href="/" style={{ color: "rgba(255,255,255,.75)" }}>Accueil</a> <span style={{ margin: "0 6px" }}>/</span> <span style={{ color: "rgba(255,255,255,.7)" }}>{ville?.nom || villeSlug}</span>
            </nav>
            <h1 style={{ fontFamily: "'Fraunces',serif", fontSize: "clamp(26px,4vw,38px)", fontWeight: 700, color: "#fff", lineHeight: 1.15, letterSpacing: -0.5, marginBottom: 8 }}>
              Artisans du b&acirc;timent &agrave; <span className="calli" style={{ color: "var(--argile, #D4956B)" }}>{ville?.nom || villeSlug}</span>
            </h1>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,.45)" }}>
              {artisans.length} artisan{artisans.length > 1 ? "s" : ""} disponible{artisans.length > 1 ? "s" : ""}
            </p>
          </div>
        </section>

        {/* Filters + Grid (client) */}
        <VilleClient artisans={artisans} villeSlug={villeSlug} metiers={metiers} />

        {/* SEO content : intro editoriale par ville hub (anti-thin-content + hierarchie Hn complete) */}
        <section style={{ background: "#fff", padding: "48px 32px", borderTop: "1px solid #EDEBE7" }}>
          <div style={{ maxWidth: 800, margin: "0 auto" }}>
            <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 22, fontWeight: 700, color: "#1C1C1E", marginBottom: 14 }}>
              Pourquoi passer par Bativio &agrave; {ville?.nom || villeSlug} ?
            </h2>
            <p style={{ fontSize: 15, color: "#6B6560", lineHeight: 1.7, marginBottom: 14 }}>
              Bativio met en relation les particuliers de {ville?.nom || villeSlug} avec des artisans du
              b&acirc;timent qualifi&eacute;s : plombiers, &eacute;lectriciens, peintres, ma&ccedil;ons,
              chauffagistes, couvreurs, menuisiers, carreleurs et bien d&apos;autres. Tous les profils
              ont &eacute;t&eacute; contr&ocirc;l&eacute;s un par un par notre &eacute;quipe :
              v&eacute;rification du SIRET via la base INSEE, validation de l&apos;assurance d&eacute;cennale
              en cours, et selon les m&eacute;tiers, des qualifications professionnelles
              (RGE, Qualibat, Qualifelec).
            </p>
            <p style={{ fontSize: 15, color: "#6B6560", lineHeight: 1.7, marginBottom: 14 }}>
              Vous obtenez gratuitement plusieurs devis comparatifs en moins de 24 heures, sans engagement
              et sans aucune commission pr&eacute;lev&eacute;e sur le prix de vos travaux. Vous payez
              directement votre artisan, contrairement aux autres plateformes qui prennent jusqu&apos;&agrave;
              30 % de marge cach&eacute;e.
            </p>
            <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 18, fontWeight: 700, color: "#1C1C1E", marginTop: 28, marginBottom: 14 }}>
              M&eacute;tiers les plus demand&eacute;s &agrave; {ville?.nom || villeSlug}
            </h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {["plombier","electricien","peintre","macon","carreleur","menuisier","chauffagiste","couvreur"].map((m) => (
                <a key={m} href={`/${villeSlug}/${m}`} style={{ padding: "8px 14px", background: "#FAF8F5", border: "1px solid #E8D5C0", borderRadius: 99, fontSize: 13, color: "#3D2E1F", textDecoration: "none", fontWeight: 500 }}>
                  {m.charAt(0).toUpperCase() + m.slice(1)} &agrave; {ville?.nom || villeSlug}
                </a>
              ))}
            </div>
            <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 18, fontWeight: 700, color: "#1C1C1E", marginTop: 28, marginBottom: 12 }}>
              Comment &ccedil;a marche ?
            </h2>
            <ol style={{ fontSize: 15, color: "#6B6560", lineHeight: 1.7, paddingLeft: 22 }}>
              <li>Vous d&eacute;crivez votre projet en quelques clics (formulaire ou chat IA).</li>
              <li>Vous recevez en moins de 24h plusieurs devis comparatifs d&apos;artisans
                {ville?.nom ? ` de ${ville.nom}` : ""} et alentours.</li>
              <li>Vous comparez profils, avis clients et tarifs, puis vous choisissez librement.</li>
              <li>Vous payez directement votre artisan. Z&eacute;ro commission Bativio.</li>
            </ol>
          </div>
        </section>

        {/* Bloc CMS legacy (admin-edited HTML) */}
        {ville?.contenuSeo && (
          <section className="px-7 py-12 max-md:px-4 border-t border-g100">
            <div className="max-w-[800px] mx-auto prose prose-sm prose-headings:font-display prose-headings:text-anthracite prose-p:text-g500 prose-strong:text-anthracite prose-li:text-g500"
              dangerouslySetInnerHTML={{ __html: sanitizeAdminHtml(ville.contenuSeo) }}
            />
          </section>
        )}
      </main>
      <Footer />

      {/* JSON-LD ItemList */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: safeJsonLd({
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: `Artisans du batiment a ${ville?.nom || villeSlug}`,
            itemListElement: artisans.map((a, i) => ({
              "@type": "ListItem",
              position: i + 1,
              item: {
                "@type": "LocalBusiness",
                name: a.nomAffichage,
                url: `https://www.bativio.fr/${villeSlug}/${a.slug}`,
              },
            })),
          }),
        }}
      />
      {/* JSON-LD BreadcrumbList */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: safeJsonLd({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Accueil", item: "https://www.bativio.fr" },
              { "@type": "ListItem", position: 2, name: ville?.nom || villeSlug },
            ],
          }),
        }}
      />
    </>
  );
}
