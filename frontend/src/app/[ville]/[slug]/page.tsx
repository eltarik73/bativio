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
  const { slug } = await params;
  const a = MOCK_ARTISANS.find((x) => x.slug === slug);
  if (!a) return { title: "Artisan introuvable" };
  return {
    title: `${a.nomAffichage} \u2014 ${a.metierNom} \u00e0 ${a.ville}`,
    description: `${a.nomAffichage}, ${a.metierNom.toLowerCase()} \u00e0 ${a.ville}. ${a.description} Devis gratuit. \u2605 ${a.noteMoyenne}/5 (${a.nombreAvis} avis).`,
    openGraph: {
      title: `${a.nomAffichage} \u2014 ${a.metierNom} \u00e0 ${a.ville}`,
      description: `Devis gratuit \u00b7 \u2605 ${a.noteMoyenne}/5 \u00b7 ${a.experienceAnnees || ""} ans d'exp\u00e9rience`,
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
        <VitrineClassique a={a} photo={photo} primary={primary} accent={accent} />

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
        address: { "@type": "PostalAddress", addressLocality: a.ville, postalCode: a.codePostal, addressCountry: "FR" },
        aggregateRating: { "@type": "AggregateRating", ratingValue: a.noteMoyenne, reviewCount: a.nombreAvis, bestRating: 5 },
        priceRange: "$$",
      }) }} />
    </>
  );
}
