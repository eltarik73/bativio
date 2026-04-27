import type { Metadata, Viewport } from "next";
import { Fraunces, Karla } from "next/font/google";
import { AuthProvider } from "@/context/AuthContext";
import CookieBanner from "@/components/CookieBanner";
import Analytics from "@/components/Analytics";
import { Analytics as VercelAnalytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

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
    "Artisan du bâtiment vérifié en Rhône-Alpes : plombier, électricien, peintre, maçon, chauffagiste. Devis gratuit 24h, avis clients réels, zéro commission.",
  metadataBase: new URL("https://www.bativio.fr"),
  alternates: {
    canonical: "/",
    // Préparation hreflang : 1 langue (fr-FR) + x-default (best practice Google même monolangue)
    languages: {
      "fr-FR": "https://www.bativio.fr",
      "x-default": "https://www.bativio.fr",
    },
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Bativio",
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icons/icon-192.png", type: "image/png", sizes: "192x192" },
    ],
    shortcut: "/icon.svg",
    apple: "/icons/icon-192.png",
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "Bativio",
    url: "https://www.bativio.fr",
    images: [{ url: "https://www.bativio.fr/og-image.png", width: 1200, height: 630, alt: "Bativio — La plateforme des artisans du bâtiment" }],
  },
  // Twitter Card : améliore preview sur X (ex-Twitter), Slack, Discord
  twitter: {
    card: "summary_large_image",
    title: "Bativio — Artisans du bâtiment en Rhône-Alpes",
    description:
      "Trouvez votre artisan vérifié en Rhône-Alpes. Devis gratuit, zéro commission.",
    images: ["https://www.bativio.fr/og-image.png"],
    creator: "@bativio",
    site: "@bativio",
  },
  // Verification meta-tags (Google Search Console, Bing Webmaster, Yandex)
  // Pilotables par env vars sans toucher au code
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
    other: {
      "msvalidate.01": process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION || "",
      "yandex-verification": process.env.NEXT_PUBLIC_YANDEX_SITE_VERIFICATION || "",
    },
  },
  // Author + publisher pour rich results E-E-A-T (Experience, Expertise, Authoritativeness, Trust)
  authors: [{ name: "Bativio", url: "https://www.bativio.fr" }],
  publisher: "Bativio",
  category: "business",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${fraunces.variable} ${karla.variable}`}>
      <body className="min-h-screen flex flex-col bg-creme text-anthracite font-body antialiased">
        <AuthProvider>{children}</AuthProvider>
        <CookieBanner />
        {/* Vercel Analytics : trafic page-views, RGPD-friendly, sans cookies tiers */}
        <VercelAnalytics />
        {/* Vercel Speed Insights : Core Web Vitals (LCP, INP, CLS) en temps reel */}
        <SpeedInsights />
        {/* Google Analytics 4 (optionnel, charge uniquement si NEXT_PUBLIC_GA_ID est defini) */}
        <Analytics />
      </body>
    </html>
  );
}
