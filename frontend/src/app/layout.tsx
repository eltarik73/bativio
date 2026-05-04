import type { Metadata, Viewport } from "next";
import { Fraunces, Karla, Playfair_Display } from "next/font/google";
import { AuthProvider } from "@/context/AuthContext";
import CookieBanner from "@/components/CookieBanner";
import { safeJsonLd } from "@/lib/html-escape";
import "./globals.css";

// Enriched Organization schema for E-E-A-T (Expertise, Authority, Trust).
// Google uses founder + sameAs to build a knowledge panel — even an empty
// sameAs is fine, what matters is that the author/founder is named.
const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Bativio",
  alternateName: ["Bativio.fr", "Bativio Annuaire Artisans"],
  url: "https://www.bativio.fr",
  // Logo absolu PNG carré ≥ 112×112 (guidelines Google) pour le knowledge
  // panel et les SERP. Le SVG est aussi listé dans `image` pour les bots
  // capables (les LLM en particulier).
  logo: {
    "@type": "ImageObject",
    url: "https://www.bativio.fr/icons/icon-512.png",
    width: 512,
    height: 512,
  },
  image: [
    "https://www.bativio.fr/og-image.png",
    "https://www.bativio.fr/icons/icon-512.png",
    "https://www.bativio.fr/icons/logo.svg",
  ],
  description: "Annuaire et plateforme SaaS pour artisans du bâtiment en région Rhône-Alpes. Zéro commission, sans engagement, conforme facturation électronique 2026.",
  foundingDate: "2025",
  founder: {
    "@type": "Person",
    name: "Tarik Boudefar",
    jobTitle: "Fondateur",
  },
  knowsAbout: [
    "Annuaire artisans du bâtiment",
    "Facturation électronique 2026",
    "MaPrimeRénov'",
    "Devis travaux",
    "Plombier",
    "Électricien",
    "Maçon",
    "Couvreur",
    "Peintre",
    "Carreleur",
  ],
  areaServed: [
    { "@type": "City", name: "Chambéry", "@id": "https://www.wikidata.org/wiki/Q6612" },
    { "@type": "City", name: "Annecy", "@id": "https://www.wikidata.org/wiki/Q47554" },
    { "@type": "City", name: "Grenoble", "@id": "https://www.wikidata.org/wiki/Q6604" },
    { "@type": "City", name: "Lyon", "@id": "https://www.wikidata.org/wiki/Q456" },
    { "@type": "City", name: "Valence", "@id": "https://www.wikidata.org/wiki/Q11999" },
    { "@type": "AdministrativeArea", name: "Auvergne-Rhône-Alpes" },
  ],
  address: {
    "@type": "PostalAddress",
    addressLocality: "Chambéry",
    addressRegion: "Savoie",
    postalCode: "73000",
    addressCountry: "FR",
  },
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer support",
    email: "contact@bativio.fr",
    availableLanguage: "French",
    areaServed: "FR",
  },
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Bativio",
  url: "https://www.bativio.fr",
  inLanguage: "fr-FR",
  potentialAction: {
    "@type": "SearchAction",
    target: { "@type": "EntryPoint", urlTemplate: "https://www.bativio.fr/{ville}" },
    "query-input": "required name=ville",
  },
};

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
});

const karla = Karla({
  variable: "--font-karla",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["italic"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
  themeColor: "#C4531A",
};

export const metadata: Metadata = {
  title: {
    default: "Bativio — Artisans du bâtiment en Rhône-Alpes",
    template: "%s | Bativio",
  },
  description:
    "Trouvez votre artisan du bâtiment en Rhône-Alpes. Profils vérifiés, avis clients, devis gratuit. Zéro commission.",
  metadataBase: new URL("https://www.bativio.fr"),
  alternates: { canonical: "/" },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Bativio",
  },
  // Next.js detects app/icon.svg + app/icon.png + app/apple-icon.png
  // automatically and emits the right <link rel="icon"> tags. We add the
  // explicit overrides below so that even bots that read metadata first
  // (Google, social previews) pick up the Bativio mark — never the default
  // Next.js / Vercel favicon.
  icons: {
    icon: [
      { url: "/icons/icon.svg", type: "image/svg+xml" },
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    shortcut: ["/icons/icon-192.png"],
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "Bativio",
    url: "https://www.bativio.fr",
    images: [{ url: "https://www.bativio.fr/og-image.png", width: 1200, height: 630, alt: "Bativio — La plateforme des artisans du bâtiment" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${fraunces.variable} ${karla.variable} ${playfair.variable}`}>
      <head>
        {/*
          Preconnect/DNS-prefetch pour ouvrir les sockets TLS aux origines
          tierces critiques avant que le HTML ne les demande explicitement.
          Gain mesurable sur le LCP (jusqu'à -300 ms sur 4G mobile).
          - res.cloudinary.com : toutes les photos artisan
          - api.bativio.fr : si plus tard une API séparée du Vercel host
          - invoquo.vercel.app : iframe facturation électronique embarquée
        */}
        <link rel="preconnect" href="https://res.cloudinary.com" crossOrigin="" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        <link rel="dns-prefetch" href="https://invoquo.vercel.app" />
      </head>
      <body className="min-h-screen flex flex-col bg-creme text-anthracite font-body antialiased">
        <AuthProvider>{children}</AuthProvider>
        <CookieBanner />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(organizationJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(websiteJsonLd) }} />
      </body>
    </html>
  );
}
