import { Metadata } from "next";
import { MOCK_ARTISANS } from "@/lib/mock-data";
import { VILLES } from "@/lib/constants";
import { METIER_PHOTOS } from "@/lib/metier-config";
import { getArtisan } from "@/lib/api";
import type { ArtisanPublic } from "@/lib/api";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import VitrineClassique from "@/components/vitrines/VitrineClassique";
import VitrinePortfolio from "@/components/vitrines/VitrinePortfolio";
import VitrineModerne from "@/components/vitrines/VitrineModerne";
import VitrineVitrine from "@/components/vitrines/VitrineVitrine";
import { notFound } from "next/navigation";

// SSG pour les artisans mock, SSR dynamique pour les nouveaux
export function generateStaticParams() {
  const p: { ville: string; slug: string }[] = [];
  for (const v of VILLES) {
    MOCK_ARTISANS.filter((a) => a.ville && a.ville.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z]/g, "") === v.slug)
      .forEach((a) => p.push({ ville: v.slug, slug: a.slug }));
  }
  return p;
}

// Permettre les pages dynamiques (artisans crees via API)
export const dynamicParams = true;

async function fetchArtisan(slug: string): Promise<ArtisanPublic | null> {
  // D'abord essayer le backend
  try {
    const a = await getArtisan(slug);
    if (a) return a;
  } catch { /* fallback mock */ }
  // Fallback mock
  return MOCK_ARTISANS.find((x) => x.slug === slug) || null;
}

export async function generateMetadata({ params }: { params: Promise<{ ville: string; slug: string }> }): Promise<Metadata> {
  const { ville: villeParam, slug } = await params;
  const a = await fetchArtisan(slug);
  if (!a) return { title: "Artisan introuvable" };
  const ms = (a.metierNom || "plombier").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z]/g, "");
  const metierImg = METIER_PHOTOS[ms] || METIER_PHOTOS.plombier;
  const ogImage = (a.photos && a.photos.length > 0) ? a.photos[0].url : metierImg;
  const seoDesc = a.seoDescription;
  const metaDesc = seoDesc || `${a.nomAffichage}, ${(a.metierNom || "artisan").toLowerCase()} \u00e0 ${a.ville || villeParam}. ${a.description || ""} Devis gratuit.`;
  return {
    title: `${a.nomAffichage} \u2014 ${a.metierNom || "Artisan"} \u00e0 ${a.ville || villeParam} | Bativio`,
    description: metaDesc.length > 160 ? metaDesc.substring(0, 157) + "..." : metaDesc,
    alternates: { canonical: `https://bativio.fr/${villeParam}/${a.slug}` },
    openGraph: {
      title: `${a.nomAffichage} \u2014 ${a.metierNom || "Artisan"} \u00e0 ${a.ville || villeParam}`,
      description: `Devis gratuit \u00b7 \u2605 ${a.noteMoyenne || 0}/5${a.experienceAnnees ? " \u00b7 " + a.experienceAnnees + " ans" : ""}`,
      url: `https://bativio.fr/${villeParam}/${a.slug}`,
      images: [{ url: ogImage, width: 800, height: 600, alt: `${a.nomAffichage} - ${a.metierNom || "Artisan"} \u00e0 ${a.ville || villeParam}` }],
    },
  };
}

export default async function ArtisanPage({ params }: { params: Promise<{ ville: string; slug: string }> }) {
  const { ville: villeSlug, slug } = await params;
  const a = await fetchArtisan(slug);
  if (!a) notFound();

  const ms = (a.metierNom || "plombier").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z]/g, "");
  const photo = METIER_PHOTOS[ms] || METIER_PHOTOS.plombier;
  const primary = a.colorPrimary || "#C4531A";
  const accent = a.colorAccent || "#E8A84C";
  const villeInfo = VILLES.find((v) => v.slug === villeSlug);
  const lat = villeInfo?.lat ?? 45.5646;
  const lng = villeInfo?.lng ?? 5.9178;

  const cssVars = { "--v-primary": primary, "--v-accent": accent } as React.CSSProperties;

  return (
    <>
      <Navbar />
      <main style={{ ...cssVars }}>
        {a.templateId === "portfolio" ? (
          <VitrinePortfolio a={a} photo={photo} primary={primary} accent={accent} villeSlug={villeSlug} />
        ) : a.templateId === "moderne" ? (
          <VitrineModerne a={a} photo={photo} primary={primary} accent={accent} villeSlug={villeSlug} />
        ) : a.templateId === "vitrine" ? (
          <VitrineVitrine a={a} photo={photo} primary={primary} accent={accent} villeSlug={villeSlug} />
        ) : (
          <VitrineClassique a={a} photo={photo} primary={primary} accent={accent} villeSlug={villeSlug} />
        )}

        <div style={{ padding: 16, textAlign: "center", background: "#F7F5F2", fontSize: 12, color: "#9B9590" }}>
          {a.nomAffichage} &middot; Propuls&eacute; par Bativio
        </div>

        <div className="artisan-cta-mobile">
          {a.telephone && <a href={`tel:${a.telephone.replace(/\s/g, "")}`} className="call">Appeler</a>}
          <a href="#devis" className="devis" style={{ background: primary }}>Devis gratuit</a>
        </div>
      </main>
      <Footer />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org", "@type": "LocalBusiness",
        name: a.nomAffichage, description: a.description || "", telephone: a.telephone || "",
        url: `https://bativio.fr/${villeSlug}/${a.slug}`,
        image: photo,
        address: { "@type": "PostalAddress", streetAddress: a.adresse || "", addressLocality: a.ville || villeSlug, postalCode: a.codePostal || "", addressCountry: "FR" },
        geo: { "@type": "GeoCoordinates", latitude: lat, longitude: lng },
        areaServed: { "@type": "GeoCircle", geoMidpoint: { "@type": "GeoCoordinates", latitude: lat, longitude: lng }, geoRadius: `${a.zoneRayonKm || 25}000` },
        aggregateRating: a.nombreAvis > 0 ? { "@type": "AggregateRating", ratingValue: a.noteMoyenne, reviewCount: a.nombreAvis, bestRating: 5 } : undefined,
        priceRange: "$$",
        ...((a.horaires ?? []).length > 0 ? { openingHoursSpecification: (a.horaires ?? []).filter((h) => h.ouvert && h.heureOuverture).map((h) => ({ "@type": "OpeningHoursSpecification", dayOfWeek: ["", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"][h.jourSemaine], opens: h.heureOuverture, closes: h.heureFermeture })) } : {}),
        ...((a.services ?? []).length > 0 ? { hasOfferCatalog: { "@type": "OfferCatalog", name: "Services", itemListElement: (a.services ?? []).map((s) => ({ "@type": "Offer", name: s.titre, description: s.description })) } } : {}),
      }) }} />
    </>
  );
}
