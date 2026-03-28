import type { Metadata } from "next";
import { Fraunces, Karla } from "next/font/google";
import { AuthProvider } from "@/context/AuthContext";
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
    default: "Bativio \u2014 Artisans du b\u00e2timent en Rh\u00f4ne-Alpes",
    template: "%s | Bativio",
  },
  description:
    "Trouvez votre artisan du b\u00e2timent en Rh\u00f4ne-Alpes. Profils v\u00e9rifi\u00e9s, avis clients, devis gratuit. Z\u00e9ro commission.",
  metadataBase: new URL("https://bativio.fr"),
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "Bativio",
    url: "https://bativio.fr",
    images: [{ url: "https://bativio.fr/og-image.png", width: 1200, height: 630, alt: "Bativio \u2014 La plateforme des artisans du b\u00e2timent" }],
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
