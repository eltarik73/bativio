import { Metadata } from "next";
import { MOCK_ARTISANS } from "@/lib/mock-data";
import { VILLES } from "@/lib/constants";
import { METIER_PHOTOS } from "@/lib/metier-config";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import VitrineClassique from "@/components/vitrines/VitrineClassique";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  const p: { ville: string; slug: string }[] = [];
  for (const v of VILLES) {
    MOCK_ARTISANS.filter((a) => a.ville.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z]/g, "") === v.slug)
      .forEach((a) => p.push({ ville: v.slug, slug: a.slug }));
  }
  return p;
}

export async function generateMetadata({ params }: { params: Promise<{ ville: string; slug: string }> }): Promise<Metadata> {
  const { ville: villeParam, slug } = await params;
  const a = MOCK_ARTISANS.find((x) => x.slug === slug);
  const slugParam = villeParam;
  if (!a) return { title: "Artisan introuvable" };
  const ms = a.metierNom.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z]/g, "");
  const img = METIER_PHOTOS[ms] || METIER_PHOTOS.plombier;
  return {
    title: `${a.nomAffichage} \u2014 ${a.metierNom} \u00e0 ${a.ville}`,
    description: `${a.nomAffichage}, ${a.metierNom.toLowerCase()} \u00e0 ${a.ville}. ${a.description} Devis gratuit. \u2605 ${a.noteMoyenne}/5 (${a.nombreAvis} avis).`,
    alternates: { canonical: `/${slugParam}/${a.slug}` },
    openGraph: {
      title: `${a.nomAffichage} \u2014 ${a.metierNom} \u00e0 ${a.ville}`,
      description: `Devis gratuit \u00b7 \u2605 ${a.noteMoyenne}/5 \u00b7 ${a.experienceAnnees || ""} ans d'exp\u00e9rience`,
      url: `https://bativio.fr/${slugParam}/${a.slug}`,
      images: [{ url: img, width: 400, height: 400, alt: a.nomAffichage }],
    },
  };
}

export default async function ArtisanPage({ params }: { params: Promise<{ ville: string; slug: string }> }) {
  const { ville: villeSlug, slug } = await params;
  const a = MOCK_ARTISANS.find((x) => x.slug === slug);
  if (!a) notFound();

  const ms = a.metierNom.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z]/g, "");
  const photo = METIER_PHOTOS[ms] || METIER_PHOTOS.plombier;
  const primary = a.colorPrimary || "#C4531A";
  const accent = a.colorAccent || "#E8A84C";

  // CSS variables dynamiques pour la palette
  const cssVars = { "--v-primary": primary, "--v-accent": accent } as React.CSSProperties;

  return (
    <>
      <Navbar />
      <main style={{ ...cssVars }}>
        {/* Template dispatch — pour l'instant tous sur Classique, les 3 autres viendront */}
        <VitrineClassique a={a} photo={photo} primary={primary} accent={accent} villeSlug={villeSlug} />

        {/* Footer SIRET */}
        <div style={{ padding: 16, textAlign: "center", background: "#F7F5F2", fontSize: 12, color: "#9B9590" }}>
          {a.nomAffichage} &middot; Propuls&eacute; par Bativio
        </div>

        {/* CTA sticky mobile */}
        <div className="artisan-cta-mobile">
          <a href={`tel:${a.telephone?.replace(/\s/g, "")}`} className="call">Appeler</a>
          <a href="#devis" className="devis" style={{ background: primary }}>Devis gratuit</a>
        </div>
      </main>
      <Footer />

      {/* JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org", "@type": "LocalBusiness",
        name: a.nomAffichage, description: a.description, telephone: a.telephone,
        url: `https://bativio.fr/${villeSlug}/${a.slug}`,
        image: photo,
        address: { "@type": "PostalAddress", streetAddress: a.adresse, addressLocality: a.ville, postalCode: a.codePostal, addressCountry: "FR" },
        geo: { "@type": "GeoCoordinates", latitude: 45.5646, longitude: 5.9178 },
        areaServed: { "@type": "GeoCircle", geoMidpoint: { "@type": "GeoCoordinates", latitude: 45.5646, longitude: 5.9178 }, geoRadius: `${a.zoneRayonKm || 25}000` },
        aggregateRating: { "@type": "AggregateRating", ratingValue: a.noteMoyenne, reviewCount: a.nombreAvis, bestRating: 5 },
        priceRange: "$$",
        ...(a.horaires && a.horaires.length > 0 ? { openingHoursSpecification: a.horaires.filter((h) => h.ouvert).map((h) => ({ "@type": "OpeningHoursSpecification", dayOfWeek: ["", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"][h.jourSemaine], opens: h.heureOuverture, closes: h.heureFermeture })) } : {}),
        ...(a.services && a.services.length > 0 ? { hasOfferCatalog: { "@type": "OfferCatalog", name: "Services", itemListElement: a.services.map((s) => ({ "@type": "Offer", name: s.titre, description: s.description, ...(s.prixIndicatif ? { price: s.prixIndicatif } : {}) })) } } : {}),
      }) }} />
    </>
  );
}
