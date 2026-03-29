import { Metadata } from "next";
import ArtisanCard from "@/components/ArtisanCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { MOCK_VILLES, MOCK_ARTISANS, MOCK_METIERS } from "@/lib/mock-data";
import { getVille, getMetiers } from "@/lib/api";
import type { ArtisanPublic, MetierData } from "@/lib/api";
import { VILLES } from "@/lib/constants";
import VilleClient from "./VilleClient";

export function generateStaticParams() {
  return VILLES.map((v) => ({ ville: v.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ ville: string }> }): Promise<Metadata> {
  const { ville: villeSlug } = await params;
  let nom = villeSlug;
  let seoTitle = "";
  let seoDesc = "";
  try {
    const data = await getVille(villeSlug);
    // getVille returns { ville: {...}, artisans: [...] } or { nom, slug, ... }
    const villeObj = (data as unknown as Record<string, unknown>).ville as Record<string, unknown> || data;
    nom = (villeObj.nom as string) || (data.nom as string) || villeSlug;
    seoTitle = (villeObj.seoTitle as string) || "";
    seoDesc = (villeObj.seoDescription as string) || "";
  } catch {
    const mock = MOCK_VILLES.find((v) => v.slug === villeSlug);
    nom = mock?.nom || villeSlug;
  }
  const title = seoTitle || `Artisans du bâtiment à ${nom} | Bativio`;
  const description = seoDesc || `Trouvez les meilleurs artisans du bâtiment à ${nom}. Plombier, électricien, peintre, maçon. Devis gratuit, zéro commission.`;
  return {
    title,
    description,
    alternates: { canonical: `https://bativio.fr/${villeSlug}` },
    openGraph: {
      title,
      description,
      url: `https://bativio.fr/${villeSlug}`,
      images: [{ url: "https://bativio.fr/og-image.png", width: 1200, height: 630 }],
    },
  };
}

export default async function VillePage({ params }: { params: Promise<{ ville: string }> }) {
  const { ville: villeSlug } = await params;

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

  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="bg-anthracite px-7 pt-10 pb-12 max-md:px-4 max-md:pt-7 max-md:pb-9 relative overflow-hidden">
          <div className="absolute -top-[120px] -right-[80px] w-[400px] h-[400px] rounded-full bg-[rgba(196,83,26,.06)]" />
          <div className="absolute -bottom-[100px] -left-[60px] w-[340px] h-[340px] rounded-full bg-[rgba(232,168,76,.04)]" />
          <div className="max-w-[680px] mx-auto text-center relative z-[1]">
            <h1 className="font-display text-[clamp(26px,4vw,38px)] font-bold text-white leading-[1.15] tracking-[-0.5px] mb-2">
              Artisans du b&acirc;timent &agrave; <em className="not-italic text-or">{ville?.nom || villeSlug}</em>
            </h1>
            <p className="text-sm text-white/40">
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
              dangerouslySetInnerHTML={{ __html: ville.contenuSeo }}
            />
          </section>
        )}
      </main>
      <Footer />

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: `Artisans du batiment a ${ville?.nom || villeSlug}`,
            itemListElement: artisans.map((a, i) => ({
              "@type": "ListItem",
              position: i + 1,
              item: {
                "@type": "LocalBusiness",
                name: a.nomAffichage,
                url: `https://bativio.fr/${villeSlug}/${a.slug}`,
              },
            })),
          }),
        }}
      />
    </>
  );
}
