import type { Metadata } from "next";
import { Fraunces, Karla } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["opsz"],
  display: "swap",
});

const karla = Karla({
  variable: "--font-karla",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Bativio -- Artisans du batiment en Rhone-Alpes",
    template: "%s | Bativio",
  },
  description:
    "Trouvez votre artisan du batiment en Rhone-Alpes. Profils verifies, avis clients, devis gratuit. Zero commission.",
  metadataBase: new URL("https://bativio.fr"),
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "Bativio",
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
        {children}
      </body>
    </html>
  );
}
