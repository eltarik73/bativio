import { Metadata } from "next";
import { MOCK_ARTISANS, MOCK_VILLES } from "@/lib/mock-data";
import { VILLES } from "@/lib/constants";
import DevisForm from "@/components/DevisForm";
import StarRating from "@/components/StarRating";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  const params: { ville: string; slug: string }[] = [];
  for (const v of VILLES) {
    const artisans = MOCK_ARTISANS.filter(
      (a) => a.ville.toLowerCase().replace(/[^a-z]/g, "") === v.slug
    );
    for (const a of artisans) {
      params.push({ ville: v.slug, slug: a.slug });
    }
  }
  return params;
}

export async function generateMetadata({ params }: { params: Promise<{ ville: string; slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const artisan = MOCK_ARTISANS.find((a) => a.slug === slug);
  if (!artisan) return { title: "Artisan introuvable" };
  return {
    title: `${artisan.nomAffichage} -- ${artisan.metierNom} a ${artisan.ville}`,
    description: artisan.description,
    openGraph: {
      title: `${artisan.nomAffichage} -- ${artisan.metierNom} a ${artisan.ville} | Bativio`,
      description: artisan.description,
    },
  };
}

const jourNoms = ["", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];

export default async function ArtisanPage({ params }: { params: Promise<{ ville: string; slug: string }> }) {
  const { ville: villeSlug, slug } = await params;
  const artisan = MOCK_ARTISANS.find((a) => a.slug === slug);
  if (!artisan) notFound();

  const ville = MOCK_VILLES.find((v) => v.slug === villeSlug);

  return (
    <main>
      {/* Hero */}
      <section className="bg-anthracite text-white py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-anthracite/80 to-anthracite" />
        <div className="relative max-w-5xl mx-auto px-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="bg-or text-anthracite px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
              {artisan.noteMoyenne.toFixed(1)} <span className="text-xs">/ 5</span>
            </div>
            <span className="text-white/60 text-sm">{artisan.nombreAvis} avis</span>
          </div>
          <h1 className="font-display text-4xl md:text-7xl font-bold leading-tight">
            {artisan.nomAffichage}
          </h1>
          <p className="mt-3 text-white/70 text-lg">
            {artisan.metierIcone} {artisan.metierNom} a {artisan.ville}
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <a href="#devis" className="px-6 py-3 bg-terre text-white rounded-lg font-medium hover:bg-terre-light transition-colors text-center">
              Devis gratuit
            </a>
            <a href={`tel:${artisan.telephone.replace(/\s/g, "")}`} className="px-6 py-3 border border-white/30 text-white rounded-lg font-medium hover:bg-white/10 transition-colors text-center">
              {artisan.telephone}
            </a>
          </div>
        </div>
      </section>

      {/* Badges */}
      {artisan.badgesNoms.length > 0 && (
        <section className="bg-anthracite-light py-4">
          <div className="max-w-5xl mx-auto px-4">
            <div className="flex gap-3 overflow-x-auto pb-1">
              {artisan.badgesNoms.map((badge) => (
                <span key={badge} className="frosted text-sm px-4 py-1.5 rounded-full text-anthracite whitespace-nowrap flex-shrink-0">
                  {badge}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Presentation */}
      <section className="py-16 bg-creme">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-12">
            <div className="md:col-span-2">
              <div className="w-10 h-0.5 bg-terre mb-4" />
              <h2 className="font-display text-2xl font-bold text-anthracite mb-4">Presentation</h2>
              <p className="text-anthracite/70 leading-relaxed">{artisan.description}</p>
            </div>
            <div className="space-y-6">
              {artisan.experienceAnnees && (
                <div className="text-center">
                  <p className="font-display text-3xl font-bold text-terre">{artisan.experienceAnnees}</p>
                  <p className="text-sm text-anthracite/50">annees d&apos;experience</p>
                </div>
              )}
              <div className="text-center">
                <p className="font-display text-3xl font-bold text-terre">{artisan.nombreAvis}</p>
                <p className="text-sm text-anthracite/50">avis clients</p>
              </div>
              <div className="text-center">
                <p className="font-display text-3xl font-bold text-terre">{artisan.zoneRayonKm} km</p>
                <p className="text-sm text-anthracite/50">rayon d&apos;intervention</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      {artisan.services.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-5xl mx-auto px-4">
            <div className="w-10 h-0.5 bg-terre mb-4" />
            <h2 className="font-display text-2xl font-bold text-anthracite mb-8">Services</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {artisan.services.map((s, i) => (
                <div
                  key={s.id}
                  className={`rounded-xl p-6 ${
                    i === 0 ? "bg-anthracite text-white md:col-span-2" : "bg-creme"
                  }`}
                >
                  <h3 className={`font-display text-lg font-bold ${i === 0 ? "text-white" : "text-anthracite"}`}>
                    {s.titre}
                  </h3>
                  <p className={`mt-2 text-sm ${i === 0 ? "text-white/70" : "text-anthracite/60"}`}>
                    {s.description}
                  </p>
                  {s.prixIndicatif && (
                    <p className={`mt-3 font-medium text-sm ${i === 0 ? "text-or" : "text-terre"}`}>
                      {s.prixIndicatif}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Zone d'intervention */}
      {artisan.zones.length > 0 && (
        <section className="py-16 bg-creme">
          <div className="max-w-5xl mx-auto px-4">
            <div className="w-10 h-0.5 bg-terre mb-4" />
            <h2 className="font-display text-2xl font-bold text-anthracite mb-6">Zone d&apos;intervention</h2>
            <div className="flex flex-wrap gap-2">
              {artisan.zones.map((z) => (
                <span key={z} className="px-4 py-2 bg-white rounded-full text-sm text-anthracite/70 border border-black/5">
                  {z}
                </span>
              ))}
            </div>
            <p className="mt-4 text-sm text-anthracite/50">
              Rayon d&apos;intervention : {artisan.zoneRayonKm} km autour de {artisan.ville}
            </p>
          </div>
        </section>
      )}

      {/* Contact / Devis */}
      <section id="devis" className="py-16">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-creme rounded-xl p-8">
              <h2 className="font-display text-2xl font-bold text-anthracite mb-6">Demander un devis</h2>
              <DevisForm slug={slug} />
            </div>
            <div className="bg-anthracite rounded-xl p-8 text-white">
              <h2 className="font-display text-2xl font-bold mb-6">Contact</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-white/50 text-sm">Telephone</p>
                  <a href={`tel:${artisan.telephone.replace(/\s/g, "")}`} className="text-lg font-medium hover:text-or transition-colors">
                    {artisan.telephone}
                  </a>
                </div>
                <div>
                  <p className="text-white/50 text-sm">Adresse</p>
                  <p>{artisan.adresse}, {artisan.codePostal} {artisan.ville}</p>
                </div>
                {artisan.horaires.length > 0 && (
                  <div>
                    <p className="text-white/50 text-sm mb-2">Horaires</p>
                    <div className="space-y-1">
                      {artisan.horaires.map((h) => (
                        <div key={h.jourSemaine} className="flex justify-between text-sm">
                          <span className="text-white/70">{jourNoms[h.jourSemaine]}</span>
                          <span>{h.ouvert ? `${h.heureOuverture} - ${h.heureFermeture}` : "Ferme"}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer SIRET */}
      <section className="py-4 bg-anthracite/5 text-center">
        <p className="text-xs text-anthracite/40">
          {artisan.nomAffichage} &middot; Propulse par Bativio
        </p>
      </section>

      {/* Sticky CTA mobile */}
      <div className="fixed bottom-0 left-0 right-0 md:hidden frosted border-t border-black/5 p-3 flex gap-3 z-50">
        <a
          href={`tel:${artisan.telephone.replace(/\s/g, "")}`}
          className="flex-1 py-3 bg-anthracite text-white rounded-lg text-center font-medium text-sm"
        >
          Appeler
        </a>
        <a
          href="#devis"
          className="flex-1 py-3 bg-terre text-white rounded-lg text-center font-medium text-sm"
        >
          Devis gratuit
        </a>
      </div>

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            name: artisan.nomAffichage,
            description: artisan.description,
            telephone: artisan.telephone,
            url: `https://bativio.fr/${villeSlug}/${artisan.slug}`,
            address: {
              "@type": "PostalAddress",
              addressLocality: artisan.ville,
              postalCode: artisan.codePostal,
              addressCountry: "FR",
            },
            areaServed: {
              "@type": "GeoCircle",
              geoMidpoint: { "@type": "GeoCoordinates", latitude: ville?.slug },
              geoRadius: `${artisan.zoneRayonKm}000`,
            },
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: artisan.noteMoyenne,
              reviewCount: artisan.nombreAvis,
              bestRating: 5,
            },
          }),
        }}
      />
    </main>
  );
}
