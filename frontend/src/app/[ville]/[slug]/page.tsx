import { Metadata } from "next";
import { MOCK_ARTISANS, MOCK_VILLES } from "@/lib/mock-data";
import { VILLES } from "@/lib/constants";
import { METIER_COLORS, METIER_PHOTOS, METIER_ICONS } from "@/lib/metier-config";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DevisForm from "@/components/DevisForm";
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
  };
}

const jourNoms = ["", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];

export default async function ArtisanPage({ params }: { params: Promise<{ ville: string; slug: string }> }) {
  const { ville: villeSlug, slug } = await params;
  const artisan = MOCK_ARTISANS.find((a) => a.slug === slug);
  if (!artisan) notFound();

  const ms = artisan.metierNom.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z]/g, "");
  const photo = METIER_PHOTOS[ms] || METIER_PHOTOS.plombier;
  const color = METIER_COLORS[ms] || METIER_COLORS.plombier;

  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="bg-anthracite text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={photo} alt="" className="w-full h-full object-cover" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-anthracite/70 via-anthracite/85 to-anthracite" />
          <div className="relative z-[1] max-w-[800px] mx-auto px-7 pt-16 pb-20 max-md:px-4 max-md:pt-10 max-md:pb-14">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-or text-anthracite px-3 py-[5px] rounded-full text-sm font-bold font-display flex items-center gap-[5px]">
                <svg className="w-[14px] h-[14px] fill-anthracite" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                {artisan.noteMoyenne.toFixed(1)}
              </div>
              <span className="text-white/50 text-sm">{artisan.nombreAvis} avis</span>
            </div>
            <h1 className="font-display text-[clamp(32px,5vw,56px)] font-bold leading-tight tracking-[-0.5px]">
              {artisan.nomAffichage}
            </h1>
            <p className="mt-2 text-white/50 text-lg">
              {artisan.metierNom} a {artisan.ville}
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <a href="#devis" className="px-7 py-3.5 bg-terre text-white rounded-[10px] font-semibold text-sm hover:bg-terre-light transition-all text-center">
                Devis gratuit
              </a>
              <a href={`tel:${artisan.telephone.replace(/\s/g, "")}`} className="px-7 py-3.5 border border-white/20 text-white rounded-[10px] font-semibold text-sm hover:bg-white/10 transition-all text-center">
                {artisan.telephone}
              </a>
            </div>
          </div>
        </section>

        {/* Badges */}
        {artisan.badgesNoms.length > 0 && (
          <section className="bg-anthracite-light py-4">
            <div className="max-w-[800px] mx-auto px-7 max-md:px-4">
              <div className="flex gap-3 overflow-x-auto hide-scroll">
                {artisan.badgesNoms.map((badge) => (
                  <span key={badge} className="bg-white/85 backdrop-blur-xl text-anthracite text-sm px-4 py-[6px] rounded-full whitespace-nowrap flex-shrink-0 font-medium">
                    {badge}
                  </span>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Presentation */}
        <section className="py-16 bg-creme max-md:py-10">
          <div className="max-w-[800px] mx-auto px-7 max-md:px-4">
            <div className="grid md:grid-cols-3 gap-10">
              <div className="md:col-span-2">
                <div className="w-10 h-[2px] bg-terre mb-4" />
                <h2 className="font-display text-xl font-bold text-anthracite mb-4">Presentation</h2>
                <p className="text-g500 text-sm leading-relaxed">{artisan.description}</p>
              </div>
              <div className="flex flex-col gap-6">
                {artisan.experienceAnnees && (
                  <div className="text-center">
                    <p className="font-display text-3xl font-bold text-terre">{artisan.experienceAnnees}</p>
                    <p className="text-xs text-g400">annees d&apos;experience</p>
                  </div>
                )}
                <div className="text-center">
                  <p className="font-display text-3xl font-bold text-terre">{artisan.nombreAvis}</p>
                  <p className="text-xs text-g400">avis clients</p>
                </div>
                <div className="text-center">
                  <p className="font-display text-3xl font-bold text-terre">{artisan.zoneRayonKm} km</p>
                  <p className="text-xs text-g400">rayon d&apos;intervention</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Services */}
        {artisan.services.length > 0 && (
          <section className="py-16 bg-white max-md:py-10">
            <div className="max-w-[800px] mx-auto px-7 max-md:px-4">
              <div className="w-10 h-[2px] bg-terre mb-4" />
              <h2 className="font-display text-xl font-bold text-anthracite mb-8">Services</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {artisan.services.map((s, i) => (
                  <div
                    key={s.id}
                    className={`rounded-[14px] p-6 border ${
                      i === 0 ? "bg-anthracite text-white border-transparent md:col-span-2" : "bg-g50 border-g100"
                    }`}
                  >
                    <h3 className={`font-display text-[15px] font-bold ${i === 0 ? "text-white" : "text-anthracite"}`}>
                      {s.titre}
                    </h3>
                    <p className={`mt-2 text-xs leading-relaxed ${i === 0 ? "text-white/60" : "text-g500"}`}>
                      {s.description}
                    </p>
                    {s.prixIndicatif && (
                      <p className={`mt-3 text-xs font-semibold ${i === 0 ? "text-or" : "text-terre"}`}>
                        {s.prixIndicatif}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Zone intervention */}
        {artisan.zones.length > 0 && (
          <section className="py-16 bg-creme max-md:py-10">
            <div className="max-w-[800px] mx-auto px-7 max-md:px-4">
              <div className="w-10 h-[2px] bg-terre mb-4" />
              <h2 className="font-display text-xl font-bold text-anthracite mb-6">Zone d&apos;intervention</h2>
              <div className="flex flex-wrap gap-2">
                {artisan.zones.map((z) => (
                  <span key={z} className="px-4 py-[7px] bg-white rounded-full text-xs text-g500 border border-g100">
                    {z}
                  </span>
                ))}
              </div>
              <p className="mt-4 text-xs text-g400">
                Rayon d&apos;intervention : {artisan.zoneRayonKm} km autour de {artisan.ville}
              </p>
            </div>
          </section>
        )}

        {/* Contact / Devis */}
        <section id="devis" className="py-16 max-md:py-10">
          <div className="max-w-[800px] mx-auto px-7 max-md:px-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-[14px] p-8 border border-g100">
                <h2 className="font-display text-xl font-bold text-anthracite mb-6">Demander un devis</h2>
                <DevisForm slug={slug} />
              </div>
              <div className="bg-anthracite rounded-[14px] p-8 text-white">
                <h2 className="font-display text-xl font-bold mb-6">Contact</h2>
                <div className="space-y-5">
                  <div>
                    <p className="text-white/40 text-xs">Telephone</p>
                    <a href={`tel:${artisan.telephone.replace(/\s/g, "")}`} className="text-lg font-medium hover:text-or transition-colors">
                      {artisan.telephone}
                    </a>
                  </div>
                  <div>
                    <p className="text-white/40 text-xs">Adresse</p>
                    <p className="text-sm">{artisan.adresse}, {artisan.codePostal} {artisan.ville}</p>
                  </div>
                  {artisan.horaires.length > 0 && (
                    <div>
                      <p className="text-white/40 text-xs mb-2">Horaires</p>
                      <div className="space-y-[3px]">
                        {artisan.horaires.map((h) => (
                          <div key={h.jourSemaine} className="flex justify-between text-xs">
                            <span className="text-white/60">{jourNoms[h.jourSemaine]}</span>
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
        <div className="py-4 bg-g50 text-center">
          <p className="text-[10px] text-g400">
            {artisan.nomAffichage} &middot; Propulse par Bativio
          </p>
        </div>

        {/* Sticky CTA mobile */}
        <div className="fixed bottom-0 left-0 right-0 md:hidden bg-white/90 backdrop-blur-xl border-t border-g100 p-3 flex gap-3 z-50">
          <a
            href={`tel:${artisan.telephone.replace(/\s/g, "")}`}
            className="flex-1 py-3 bg-anthracite text-white rounded-lg text-center font-semibold text-sm"
          >
            Appeler
          </a>
          <a
            href="#devis"
            className="flex-1 py-3 bg-terre text-white rounded-lg text-center font-semibold text-sm"
          >
            Devis gratuit
          </a>
        </div>
      </main>
      <Footer />

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
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: artisan.noteMoyenne,
              reviewCount: artisan.nombreAvis,
              bestRating: 5,
            },
          }),
        }}
      />
    </>
  );
}
