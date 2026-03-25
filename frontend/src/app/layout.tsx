import type { Metadata } from "next";
import { Fraunces, Karla } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
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
    default: "Bativio -- La plateforme des artisans du batiment",
    template: "%s | Bativio",
  },
  description:
    "Trouvez les meilleurs artisans du batiment pres de chez vous. Plombier, electricien, peintre, macon... Comparez, contactez, zero commission.",
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
        <Navbar />
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
