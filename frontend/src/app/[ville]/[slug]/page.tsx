import { Metadata } from "next";
import { MOCK_ARTISANS } from "@/lib/mock-data";
import { VILLES } from "@/lib/constants";
import { METIER_PHOTOS } from "@/lib/metier-config";
import { getArtisan } from "@/lib/api";
import type { ArtisanPublic } from "@/lib/api";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { safeJsonLd } from "@/lib/html-escape";
import VitrineClassique from "@/components/vitrines/VitrineClassique";
import VitrinePortfolio from "@/components/vitrines/VitrinePortfolio";
import VitrineModerne from "@/components/vitrines/VitrineModerne";
import VitrineVitrine from "@/components/vitrines/VitrineVitrine";
import VitrineBusiness from "@/components/vitrines/VitrineBusiness";
import { getEffectivePlan } from "@/lib/plan-gates";
import type { SeoGenerated } from "@/lib/vitrine-config";
import MetierVillePageComponent, {
  METIER_SLUGS,
  villeNom,
  metierNom,
} from "@/components/MetierVillePage";
import { notFound } from "next/navigation";

export const revalidate = 3600;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getApiBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

function isMetierSlug(slug: string): boolean {
  return METIER_SLUGS.has(slug);
}

// ---------------------------------------------------------------------------
// SSG: artisans mock + all ville x metier combos (40 pages)
// ---------------------------------------------------------------------------

export function generateStaticParams() {
  const p: { ville: string; slug: string }[] = [];

  // Artisan pages (from mock data)
  for (const v of VILLES) {
    MOCK_ARTISANS.filter(
      (a) =>
        a.ville &&
        a.ville
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/[^a-z]/g, "") === v.slug
    ).forEach((a) => p.push({ ville: v.slug, slug: a.slug }));
  }

  // Metier pages: 5 villes x 28 metiers = 140 pages
  const villeSlugs = ["chambery", "annecy", "grenoble", "lyon", "valence"];
  for (const ville of villeSlugs) {
    for (const metier of METIER_SLUGS) {
      p.push({ ville, slug: metier });
    }
  }

  return p;
}

// Permettre les pages dynamiques (artisans crees via API)
export const dynamicParams = true;

// ---------------------------------------------------------------------------
// Fetch artisan (for vitrine pages)
// ---------------------------------------------------------------------------

async function fetchArtisan(slug: string): Promise<ArtisanPublic | null> {
  // D'abord essayer le backend
  try {
    const a = await getArtisan(slug);
    if (a) return a;
  } catch {
    /* fallback mock */
  }
  // Fallback mock
  return MOCK_ARTISANS.find((x) => x.slug === slug) || null;
}

// ---------------------------------------------------------------------------
// Metadata: dispatch based on slug type
// ---------------------------------------------------------------------------

export async function generateMetadata({
  params,
}: {
  params: Promise<{ ville: string; slug: string }>;
}): Promise<Metadata> {
  const { ville: villeParam, slug } = await params;

  // ── Metier page metadata ──
  if (isMetierSlug(slug)) {
    const vNom = villeNom(villeParam);
    const mNom = metierNom(slug);
    const title = `${mNom} \u00e0 ${vNom} \u2014 Artisans v\u00e9rifi\u00e9s`;
    const description = `Trouvez un ${mNom.toLowerCase()} qualifi\u00e9 \u00e0 ${vNom}. Artisans v\u00e9rifi\u00e9s, devis gratuit en 2 minutes. Z\u00e9ro commission.`;

    return {
      title,
      description,
      alternates: {
        canonical: `https://www.bativio.fr/${villeParam}/${slug}`,
      },
      openGraph: {
        title,
        description,
        url: `https://www.bativio.fr/${villeParam}/${slug}`,
        images: [
          {
            url: "https://www.bativio.fr/og-image.png",
            width: 1200,
            height: 630,
          },
        ],
      },
    };
  }

  // ── Artisan vitrine metadata ──
  const a = await fetchArtisan(slug);
  if (!a) return { title: "Artisan introuvable" };
  const ms = (a.metierNom || "plombier")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z]/g, "");
  const metierImg = METIER_PHOTOS[ms] || METIER_PHOTOS.plombier;
  const ogImage =
    a.photos && a.photos.length > 0 ? a.photos[0].url : metierImg;

  // Use AI-generated SEO if available
  const seoGen = a.seoGenerated as SeoGenerated | null;
  const isWhiteLabel = getEffectivePlan({ plan: a.plan, planOverride: a.planOverride, planOverrideExpireAt: a.planOverrideExpireAt }) === "business";

  const seoTitle = seoGen?.title || `${a.nomAffichage} \u2014 ${a.metierNom || "Artisan"} \u00e0 ${a.ville || villeParam}`;
  // Business white-label: absolute title (bypass layout template "| Bativio")
  const title = isWhiteLabel ? { absolute: seoTitle } : seoTitle;

  const seoDesc = seoGen?.metaDescription || a.seoDescription;
  const expPart = a.experienceAnnees ? ` ${a.experienceAnnees} ans d'exp\u00e9rience.` : "";
  const metaDesc =
    seoDesc ||
    `${a.nomAffichage}, ${(a.metierNom || "artisan").toLowerCase()} \u00e0 ${a.ville || villeParam}.${expPart} ${a.description || ""} Devis gratuit.`;
  return {
    title,
    description:
      metaDesc.length > 160 ? metaDesc.substring(0, 157) + "..." : metaDesc,
    alternates: {
      canonical: `https://www.bativio.fr/${villeParam}/${a.slug}`,
    },
    openGraph: {
      title: seoTitle,
      description: `Devis gratuit \u00b7 \u2605 ${a.noteMoyenne || 0}/5${a.experienceAnnees ? " \u00b7 " + a.experienceAnnees + " ans" : ""}`,
      url: `https://www.bativio.fr/${villeParam}/${a.slug}`,
      images: [
        {
          url: ogImage,
          width: 800,
          height: 600,
          alt: `${a.nomAffichage} - ${a.metierNom || "Artisan"} \u00e0 ${a.ville || villeParam}`,
        },
      ],
    },
  };
}

// ---------------------------------------------------------------------------
// Page: dispatch based on slug type
// ---------------------------------------------------------------------------

export default async function SlugPage({
  params,
}: {
  params: Promise<{ ville: string; slug: string }>;
}) {
  const { ville: villeSlug, slug } = await params;

  // ── Metier page ──
  if (isMetierSlug(slug)) {
    let artisans: ArtisanPublic[] = [];
    try {
      const baseUrl = getApiBaseUrl();
      const res = await fetch(
        `${baseUrl}/api/v1/public/artisans?ville=${villeSlug}&metier=${slug}`,
        { cache: "no-store" }
      );
      const json = await res.json();
      artisans = json.data?.content || [];
    } catch {
      /* API unavailable — show empty state */
    }

    return (
      <>
        <Navbar />
        <MetierVillePageComponent
          ville={villeSlug}
          metier={slug}
          artisans={artisans}
        />
        <Footer />
      </>
    );
  }

  // ── Artisan vitrine page ──
  const a = await fetchArtisan(slug);
  if (!a) notFound();

  const ms = (a.metierNom || "plombier")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z]/g, "");
  const photo = METIER_PHOTOS[ms] || METIER_PHOTOS.plombier;
  const primary = a.colorPrimary || "#C4531A";
  const accent = a.colorAccent || "#E8A84C";
  const villeInfo = VILLES.find((v) => v.slug === villeSlug);
  const lat = villeInfo?.lat ?? 45.5646;
  const lng = villeInfo?.lng ?? 5.9178;

  const isWhiteLabel = getEffectivePlan({
    plan: a.plan,
    planOverride: a.planOverride,
    planOverrideExpireAt: a.planOverrideExpireAt,
  }) === "business";

  // Business plan: white-label vitrine
  if (isWhiteLabel) {
    const seoGen = (a.seoGenerated || null) as SeoGenerated | null;
    const vitrineConfig = a.vitrineConfig;

    return (
      <>
        <VitrineBusiness
          a={a}
          photo={photo}
          primary={primary}
          accent={accent}
          villeSlug={villeSlug}
          vitrineConfig={vitrineConfig}
          seoGenerated={seoGen}
        />

        {/* JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: safeJsonLd({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              name: a.nomAffichage,
              description: seoGen?.metaDescription || a.description || "",
              telephone: a.telephone || "",
              url: `https://www.bativio.fr/${villeSlug}/${a.slug}`,
              image: a.photos?.[0]?.url || photo,
              address: {
                "@type": "PostalAddress",
                streetAddress: a.adresse || "",
                addressLocality: a.ville || villeSlug,
                postalCode: a.codePostal || "",
                addressCountry: "FR",
              },
              geo: { "@type": "GeoCoordinates", latitude: lat, longitude: lng },
              areaServed: {
                "@type": "GeoCircle",
                geoMidpoint: { "@type": "GeoCoordinates", latitude: lat, longitude: lng },
                geoRadius: `${a.zoneRayonKm || 25}000`,
              },
              aggregateRating:
                a.nombreAvis > 0
                  ? { "@type": "AggregateRating", ratingValue: a.noteMoyenne, reviewCount: a.nombreAvis, bestRating: 5 }
                  : undefined,
              priceRange: "$$",
            }),
          }}
        />

        {/* FAQ JSON-LD if available */}
        {seoGen?.faq && seoGen.faq.length > 0 && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: safeJsonLd({
                "@context": "https://schema.org",
                "@type": "FAQPage",
                mainEntity: seoGen.faq.map(f => ({
                  "@type": "Question",
                  name: f.question,
                  acceptedAnswer: { "@type": "Answer", text: f.answer },
                })),
              }),
            }}
          />
        )}
      </>
    );
  }

  // Non-Business: classic template with Bativio branding
  const cssVars = {
    "--v-primary": primary,
    "--v-accent": accent,
  } as React.CSSProperties;

  return (
    <>
      <Navbar />
      <main style={{ ...cssVars }}>
        {a.templateId === "portfolio" ? (
          <VitrinePortfolio
            a={a}
            photo={photo}
            primary={primary}
            accent={accent}
            villeSlug={villeSlug}
          />
        ) : a.templateId === "moderne" ? (
          <VitrineModerne
            a={a}
            photo={photo}
            primary={primary}
            accent={accent}
            villeSlug={villeSlug}
          />
        ) : a.templateId === "vitrine" ? (
          <VitrineVitrine
            a={a}
            photo={photo}
            primary={primary}
            accent={accent}
            villeSlug={villeSlug}
          />
        ) : (
          <VitrineClassique
            a={a}
            photo={photo}
            primary={primary}
            accent={accent}
            villeSlug={villeSlug}
          />
        )}

        <div
          style={{
            padding: 16,
            textAlign: "center",
            background: "#F7F5F2",
            fontSize: 12,
            color: "#9B9590",
          }}
        >
          {a.nomAffichage} &middot; Propuls&eacute; par Bativio
        </div>

        <div className="artisan-cta-mobile">
          {a.telephone && (
            <a
              href={`tel:${a.telephone.replace(/\s/g, "")}`}
              className="call"
            >
              Appeler
            </a>
          )}
          <a href="#devis" className="devis" style={{ background: primary }}>
            Devis gratuit
          </a>
        </div>
      </main>
      <Footer />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: safeJsonLd({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            name: a.nomAffichage,
            description: a.description || "",
            telephone: a.telephone || "",
            url: `https://www.bativio.fr/${villeSlug}/${a.slug}`,
            image: photo,
            address: {
              "@type": "PostalAddress",
              streetAddress: a.adresse || "",
              addressLocality: a.ville || villeSlug,
              postalCode: a.codePostal || "",
              addressCountry: "FR",
            },
            geo: {
              "@type": "GeoCoordinates",
              latitude: lat,
              longitude: lng,
            },
            areaServed: {
              "@type": "GeoCircle",
              geoMidpoint: {
                "@type": "GeoCoordinates",
                latitude: lat,
                longitude: lng,
              },
              geoRadius: `${a.zoneRayonKm || 25}000`,
            },
            aggregateRating:
              a.nombreAvis > 0
                ? {
                    "@type": "AggregateRating",
                    ratingValue: a.noteMoyenne,
                    reviewCount: a.nombreAvis,
                    bestRating: 5,
                  }
                : undefined,
            priceRange: "$$",
            ...((a.horaires ?? []).length > 0
              ? {
                  openingHoursSpecification: (a.horaires ?? [])
                    .filter((h) => h.ouvert && h.heureOuverture)
                    .map((h) => ({
                      "@type": "OpeningHoursSpecification",
                      dayOfWeek: [
                        "",
                        "Monday",
                        "Tuesday",
                        "Wednesday",
                        "Thursday",
                        "Friday",
                        "Saturday",
                        "Sunday",
                      ][h.jourSemaine],
                      opens: h.heureOuverture,
                      closes: h.heureFermeture,
                    })),
                }
              : {}),
            ...((a.services ?? []).length > 0
              ? {
                  hasOfferCatalog: {
                    "@type": "OfferCatalog",
                    name: "Services",
                    itemListElement: (a.services ?? []).map((s) => ({
                      "@type": "Offer",
                      name: s.titre,
                      description: s.description,
                    })),
                  },
                }
              : {}),
          }),
        }}
      />
    </>
  );
}
