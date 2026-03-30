import { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PricingGrid from "@/components/pricing/PricingGrid";

export const metadata: Metadata = {
  title: "Tarifs Bativio — Abonnements artisans",
  description: "Découvrez nos formules pour artisans du bâtiment. De 0€ à 79€/mois, sans commission. Facturation électronique incluse.",
  alternates: { canonical: "https://bativio.fr/tarifs" },
};

const FAQ = [
  { q: "Est-ce que Bativio prend une commission ?", a: "Non, jamais. Zéro commission sur vos devis et vos chantiers. Vous gardez 100% de vos revenus." },
  { q: "Puis-je changer de plan ?", a: "Oui, à tout moment depuis votre dashboard. Upgrade instantané, downgrade en fin de période." },
  { q: "Y a-t-il un engagement ?", a: "Non, sans engagement. Vous pouvez annuler à tout moment. Pas de frais cachés." },
  { q: "Comment fonctionne le devis IA ?", a: "Décrivez les travaux du client, l'IA génère un devis structuré avec les bons postes et prix du marché. Vous ajustez et envoyez en 2 minutes." },
  { q: "Comment fonctionne la facturation électronique ?", a: "À partir de septembre 2026, toutes les entreprises devront recevoir leurs factures au format électronique via une Plateforme Agréée (PA). Bativio intègre directement cette fonctionnalité — c'est inclus dans votre abonnement, pas de coût supplémentaire. Dès le pack Essentiel, vous pouvez recevoir vos factures fournisseurs. Le pack Pro permet aussi d'émettre vos factures. Et le pack Pro+ donne accès à la création complète de factures, devis et avoirs." },
];

export default function TarifsPage() {
  return (
    <>
      <Navbar />
      <main style={{ background: "#FAF8F5", minHeight: "100vh" }}>
        {/* Hero */}
        <section style={{ padding: "64px 32px 40px", textAlign: "center" }}>
          <h1 style={{ fontFamily: "'Fraunces',serif", fontSize: "clamp(28px,5vw,42px)", fontWeight: 700, color: "#1C1C1E", lineHeight: 1.15 }}>
            Des prix simples, sans surprise
          </h1>
          <p style={{ fontSize: 17, color: "#6B6560", marginTop: 12, maxWidth: 520, margin: "12px auto 0", fontFamily: "'Karla',sans-serif" }}>
            Zéro commission. Zéro frais cachés. Facturation électronique incluse.
          </p>
        </section>

        {/* Pricing Grid */}
        <section style={{ padding: "0 8px 64px" }}>
          <PricingGrid />
        </section>

        {/* FAQ */}
        <section style={{ padding: "64px 32px", background: "#fff" }}>
          <div style={{ maxWidth: 700, margin: "0 auto" }}>
            <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 28, fontWeight: 700, color: "#1C1C1E", textAlign: "center", marginBottom: 32 }}>Questions fréquentes</h2>
            {FAQ.map((f, i) => (
              <div key={i} style={{ padding: "20px 0", borderBottom: i < FAQ.length - 1 ? "1px solid #F0EDEA" : "none" }}>
                <h3 style={{ fontSize: 16, fontWeight: 600, color: "#1C1C1E", marginBottom: 8, fontFamily: "'Karla',sans-serif" }}>{f.q}</h3>
                <p style={{ fontSize: 15, color: "#6B6560", lineHeight: 1.6, fontFamily: "'Karla',sans-serif" }}>{f.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section style={{ padding: "64px 32px", textAlign: "center", background: "#1C1C1E" }}>
          <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 28, fontWeight: 700, color: "#fff" }}>Prêt à développer votre activité ?</h2>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,.5)", marginTop: 8, fontFamily: "'Karla',sans-serif" }}>Inscrivez-vous gratuitement. Sans engagement.</p>
          <Link href="/inscription" style={{ display: "inline-block", marginTop: 24, padding: "14px 32px", background: "#C4531A", color: "#fff", borderRadius: 12, fontSize: 16, fontWeight: 600, textDecoration: "none", fontFamily: "'Karla',sans-serif" }}>Créer ma page gratuitement</Link>
        </section>
      </main>
      <Footer />
    </>
  );
}
