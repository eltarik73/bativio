import { Metadata } from "next";
import ArtisanCard from "@/components/ArtisanCard";
import { MOCK_VILLES, MOCK_ARTISANS, MOCK_METIERS } from "@/lib/mock-data";
import { VILLES } from "@/lib/constants";
import Link from "next/link";

export function generateStaticParams() {
  return VILLES.map((v) => ({ ville: v.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ ville: string }> }): Promise<Metadata> {
  const { ville: villeSlug } = await params;
  const ville = MOCK_VILLES.find((v) => v.slug === villeSlug);
  const nom = ville?.nom || villeSlug;
  return {
    title: `Artisans du batiment a ${nom}`,
    description: `Trouvez les meilleurs artisans du batiment a ${nom}. Plombier, electricien, peintre, macon... Comparez et contactez, zero commission.`,
    openGraph: {
      title: `Artisans du batiment a ${nom} | Bativio`,
      description: `${ville?.nombreArtisans || 0} artisans disponibles a ${nom}. Devis gratuit, zero commission.`,
    },
  };
}

export default async function VillePage({ params }: { params: Promise<{ ville: string }> }) {
  const { ville: villeSlug } = await params;
  const ville = MOCK_VILLES.find((v) => v.slug === villeSlug);
  const artisans = MOCK_ARTISANS.filter(
    (a) => a.ville.toLowerCase().replace(/[^a-z]/g, "") === villeSlug
  );

  return (
    <main className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="w-10 h-0.5 bg-terre mb-4" />
          <h1 className="font-display text-3xl md:text-5xl font-bold text-anthracite">
            Artisans du batiment a {ville?.nom || villeSlug}
          </h1>
          <p className="mt-2 text-anthracite/60">
            {artisans.length} artisan{artisans.length > 1 ? "s" : ""} disponible{artisans.length > 1 ? "s" : ""} a {ville?.nom || villeSlug}
          </p>
        </div>

        {/* Metier filter pills */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-8 -mx-4 px-4">
          <Link
            href={`/${villeSlug}`}
            className="px-4 py-2 bg-terre text-white rounded-full text-sm font-medium whitespace-nowrap flex-shrink-0"
          >
            Tous
          </Link>
          {MOCK_METIERS.map((m) => (
            <Link
              key={m.slug}
              href={`/${villeSlug}?metier=${m.slug}`}
              className="px-4 py-2 bg-white border border-black/10 rounded-full text-sm text-anthracite/70 hover:border-terre hover:text-terre whitespace-nowrap flex-shrink-0 transition-colors"
            >
              {m.icone} {m.nom}
            </Link>
          ))}
        </div>

        {/* Artisan grid */}
        {artisans.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {artisans.map((a) => (
              <ArtisanCard key={a.id} artisan={a} villeSlug={villeSlug} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-anthracite/50 text-lg">Aucun artisan trouve dans cette ville pour le moment.</p>
            <p className="text-anthracite/40 mt-2 text-sm">De nouveaux artisans s&apos;inscrivent chaque semaine.</p>
          </div>
        )}

        {/* SEO content */}
        {ville?.contenuSeo && (
          <div className="mt-16 pt-12 border-t border-black/5">
            <h2 className="font-display text-xl font-bold text-anthracite mb-4">
              Artisans du batiment a {ville.nom}
            </h2>
            <p className="text-anthracite/60 text-sm leading-relaxed">{ville.contenuSeo}</p>
          </div>
        )}
      </div>

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
    </main>
  );
}
