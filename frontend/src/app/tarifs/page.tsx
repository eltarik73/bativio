import { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PricingGrid from "@/components/pricing/PricingGrid";

export const metadata: Metadata = {
  title: "Tarifs Bativio — Abonnements artisans du bâtiment",
  description: "De 0€ à 59€/mois, sans commission. Facturation électronique 2026 incluse, site internet pro, CRM, devis IA. Sans engagement, annulable à tout moment.",
  alternates: { canonical: "https://www.bativio.fr/tarifs" },
};

export default function TarifsPage() {
  return (
    <>
      <Navbar />
      <main style={{ background: "#fff", minHeight: "100dvh" }}>
        {/* H1 SEO : non visible visuellement (sr-only) car la maquette PricingGrid affiche
            son propre titre stylise. Le H1 reste indispensable pour Google et l'accessibilite. */}
        <h1 className="sr-only">Tarifs Bativio &mdash; Abonnements artisans du b&acirc;timent en Rh&ocirc;ne-Alpes</h1>
        <PricingGrid />
      </main>
      <Footer />
    </>
  );
}
