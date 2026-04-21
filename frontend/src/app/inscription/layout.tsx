import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Inscription artisan — Créer ma vitrine | Bativio",
  description:
    "Créez votre profil artisan Bativio en 3 minutes. Vitrine personnalisée, demandes de devis qualifiées, facturation électronique. Plan gratuit puis 19€/mois.",
  alternates: { canonical: "https://www.bativio.fr/inscription" },
  robots: { index: false, follow: true }, // privée
};

export default function InscriptionLayout({ children }: { children: React.ReactNode }) {
  return children;
}
