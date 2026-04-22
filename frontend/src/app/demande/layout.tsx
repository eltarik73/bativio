import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Décrire mon projet — Estimation IA gratuite",
  description:
    "Décrivez votre projet de travaux en 2 minutes. L'IA Bativio estime le prix immédiatement et envoie votre demande aux meilleurs artisans Rhône-Alpes.",
  alternates: { canonical: "https://www.bativio.fr/demande" },
  openGraph: {
    title: "Décrire mon projet de travaux — Bativio",
    description: "Estimation IA en 2 min, devis artisans sous 24h. Zéro commission.",
    url: "https://www.bativio.fr/demande",
    images: [{ url: "https://www.bativio.fr/og-image.png", width: 1200, height: 630 }],
  },
  robots: { index: true, follow: true },
};

export default function DemandeLayout({ children }: { children: React.ReactNode }) {
  return children;
}
