import type { Metadata, Viewport } from "next";
import { Fraunces, Karla } from "next/font/google";
import { AuthProvider } from "@/context/AuthContext";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["opsz"],
  style: ["normal", "italic"],
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
  maximumScale: 1,
  userScalable: false,
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
    <html lang="fr" className={`${fraunces.variable} ${karla.variable}`}>
      <body className="min-h-screen flex flex-col bg-creme text-anthracite font-body antialiased">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
