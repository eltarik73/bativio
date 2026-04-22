import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Connexion artisan",
  description: "Accédez à votre espace artisan Bativio : devis, vitrine, facturation, agenda.",
  alternates: { canonical: "https://www.bativio.fr/connexion" },
  robots: { index: false, follow: true }, // privée
};

export default function ConnexionLayout({ children }: { children: React.ReactNode }) {
  return children;
}
