import { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PricingGrid from "@/components/pricing/PricingGrid";

export const metadata: Metadata = {
  title: "Tarifs Bativio — Abonnements artisans du bâtiment",
  description: "De 0€ à 59€/mois, sans commission. Facturation, site internet, CRM, IA. Conforme réforme 2026.",
  alternates: { canonical: "https://www.bativio.fr/tarifs" },
};

export default function TarifsPage() {
  return (
    <>
      <Navbar />
      <main style={{ background: "#fff", minHeight: "100dvh" }}>
        <PricingGrid />
      </main>
      <Footer />
    </>
  );
}
