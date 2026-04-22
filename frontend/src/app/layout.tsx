import type { Metadata, Viewport } from "next";
import { Fraunces, Karla, Playfair_Display } from "next/font/google";
import { AuthProvider } from "@/context/AuthContext";
import CookieBanner from "@/components/CookieBanner";
import { safeJsonLd } from "@/lib/html-escape";
import "./globals.css";

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Bativio",
  url: "https://www.bativio.fr",
  logo: "https://www.bativio.fr/icons/icon-192.png",
  description: "Plateforme d'annuaire et de SaaS pour artisans du bâtiment en Rhône-Alpes. Zéro commission.",
  foundingDate: "2025",
  areaServed: [
    { "@type": "City", name: "Chambéry" },
    { "@type": "City", name: "Annecy" },
    { "@type": "City", name: "Grenoble" },
    { "@type": "City", name: "Lyon" },
    { "@type": "City", name: "Valence" },
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
  icons: {
    apple: "/icons/icon-192.png",
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
      <body className="min-h-screen flex flex-col bg-creme text-anthracite font-body antialiased">
        <AuthProvider>{children}</AuthProvider>
        <CookieBanner />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(organizationJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(websiteJsonLd) }} />
      </body>
    </html>
  );
}
