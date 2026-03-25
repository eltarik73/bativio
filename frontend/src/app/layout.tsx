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
    default: "Bativio — La plateforme des artisans du bâtiment",
    template: "%s | Bativio",
  },
  description:
    "Trouvez les meilleurs artisans du bâtiment près de chez vous. Plombier, électricien, peintre, maçon... Comparez, contactez, zéro commission.",
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
