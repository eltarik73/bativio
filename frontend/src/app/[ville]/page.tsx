import { Metadata } from "next";
import { notFound } from "next/navigation";
import ArtisanCard from "@/components/ArtisanCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { MOCK_VILLES, MOCK_ARTISANS, MOCK_METIERS } from "@/lib/mock-data";
import { getVille, getMetiers } from "@/lib/api";
import type { ArtisanPublic, MetierData } from "@/lib/api";
import { VILLES } from "@/lib/constants";
import VilleClient from "./VilleClient";
import { safeJsonLd, sanitizeAdminHtml } from "@/lib/html-escape";
import { prisma } from "@/lib/prisma";
import MetierVilleListing from "./MetierVilleListing";

export const revalidate = 3600;

export function generateStaticParams() {
  return VILLES.map((v) => ({ ville: v.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ ville: string }> }): Promise<Metadata> {
  const { ville: villeSlug } = await params;

  // SEO: lowercase enforce + 404 immédiat pour slugs invalides
  if (villeSlug !== villeSlug.toLowerCase()) {
    notFound();
  }

  // Check if this is a metier-ville composite slug
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

  // Essayer le backend, fallback mock
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

        {/* SEO content */}
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
