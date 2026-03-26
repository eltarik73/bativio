import { Metadata } from "next";
import ArtisanCard from "@/components/ArtisanCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { MOCK_VILLES, MOCK_ARTISANS, MOCK_METIERS } from "@/lib/mock-data";
import { VILLES } from "@/lib/constants";
import VilleClient from "./VilleClient";

export function generateStaticParams() {
  return VILLES.map((v) => ({ ville: v.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ ville: string }> }): Promise<Metadata> {
  const { ville: villeSlug } = await params;
  const ville = MOCK_VILLES.find((v) => v.slug === villeSlug);
  const nom = ville?.nom || villeSlug;
  return {
    title: `Artisans du batiment a ${nom}`,
    description: `Trouvez les meilleurs artisans du batiment a ${nom}. Plombier, electricien, peintre, macon... Devis gratuit, zero commission.`,
  };
}

export default async function VillePage({ params }: { params: Promise<{ ville: string }> }) {
  const { ville: villeSlug } = await params;
  const ville = MOCK_VILLES.find((v) => v.slug === villeSlug);
  const artisans = MOCK_ARTISANS.filter(
    (a) => a.ville.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z]/g, "") === villeSlug
  );

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
              Artisans du batiment a <em className="not-italic text-or">{ville?.nom || villeSlug}</em>
            </h1>
            <p className="text-sm text-white/40">
              {artisans.length} artisan{artisans.length > 1 ? "s" : ""} disponible{artisans.length > 1 ? "s" : ""}
            </p>
          </div>
        </section>

        {/* Filters + Grid (client) */}
        <VilleClient artisans={artisans} villeSlug={villeSlug} metiers={MOCK_METIERS} />

        {/* SEO content */}
        {ville?.contenuSeo && (
          <section className="px-7 py-12 max-md:px-4 border-t border-g100">
            <div className="max-w-[800px] mx-auto">
              <h2 className="font-display text-lg font-bold text-anthracite mb-3">
                Artisans du batiment a {ville.nom}
              </h2>
              <p className="text-[13px] text-g500 leading-relaxed">{ville.contenuSeo}</p>
            </div>
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
