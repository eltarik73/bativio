import { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PricingGrid from "@/components/pricing/PricingGrid";
import SocialProofStrip from "@/components/pricing/SocialProofStrip";

export const metadata: Metadata = {
  title: "Tarifs — Abonnements artisans du bâtiment",
  description: "De 0€ à 59€/mois, sans commission. Facturation, site internet, CRM, IA. Conforme réforme 2026.",
  alternates: { canonical: "https://www.bativio.fr/tarifs" },
};

const COMPARATIFS = [
  { slug: "pagesjaunes", name: "PagesJaunes", hook: "25 à 300 €/mois avec engagement 12 mois" },
  { slug: "habitatpresto", name: "Habitatpresto", hook: "70 à 220 €/mois + 30 €/lead partagé à 5 pros" },
  { slug: "starofservice", name: "Star of Service", hook: "17 €/conversation, 21 signalements Signal-Arnaques" },
];

export default function TarifsPage() {
  return (
    <>
      <Navbar />
      <main style={{ background: "#fff", minHeight: "100dvh" }}>
        <SocialProofStrip />
        <header style={{ maxWidth: 880, margin: "0 auto", padding: "48px 24px 0", textAlign: "center" }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: "var(--terre,#C4531A)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 14 }}>
            Tarifs &mdash; Sans engagement
          </p>
          <h1 style={{ fontFamily: "'Fraunces',serif", fontSize: "clamp(30px,4.5vw,46px)", fontWeight: 700, color: "var(--anthracite,#1C1C1E)", lineHeight: 1.1, letterSpacing: -0.5, marginBottom: 16 }}>
            Tarifs Bativio &mdash; Abonnements pour artisans du b&acirc;timent
          </h1>
          <p style={{ fontSize: 17, color: "var(--bois-mid,#5C4A3A)", lineHeight: 1.5, maxWidth: 640, margin: "0 auto" }}>
            De <strong>0&nbsp;&euro; &agrave; 59&nbsp;&euro;/mois</strong>, sans commission sur vos chantiers. Facturation &eacute;lectronique 2026 incluse, site internet, CRM et IA selon le plan choisi. Annulable &agrave; tout moment.
          </p>
        </header>
        <PricingGrid />

        <section style={{ background: "var(--creme,#FAF8F5)", padding: "64px 24px" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: "clamp(26px,3.5vw,36px)", fontWeight: 600, color: "var(--anthracite,#1C1C1E)", marginBottom: 12, textAlign: "center" }}>
              Comparez Bativio à la concurrence
            </h2>
            <p style={{ textAlign: "center", fontSize: 15, color: "var(--bois-mid,#5C4A3A)", marginBottom: 40, maxWidth: 640, margin: "0 auto 40px" }}>
              Transparence totale. Voici comment Bativio se positionne face aux principaux acteurs du marché.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 18 }}>
              {COMPARATIFS.map((c) => (
                <Link
                  key={c.slug}
                  href={`/comparatif/${c.slug}`}
                  style={{
                    background: "#fff",
                    border: "1px solid var(--sable,#E8D5C0)",
                    borderRadius: 14,
                    padding: "24px 22px",
                    textDecoration: "none",
                    transition: "transform .2s, border-color .2s",
                    display: "block",
                  }}
                >
                  <p style={{ fontSize: 12, fontWeight: 600, color: "var(--terre,#C4531A)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>
                    Comparatif
                  </p>
                  <p style={{ fontFamily: "'Fraunces',serif", fontSize: 22, fontWeight: 600, color: "var(--anthracite,#1C1C1E)", marginBottom: 10 }}>
                    Bativio <span style={{ color: "var(--pierre,#9C958D)", fontWeight: 400 }}>vs</span> {c.name}
                  </p>
                  <p style={{ fontSize: 13, color: "var(--bois-mid,#5C4A3A)", lineHeight: 1.4, marginBottom: 14 }}>
                    {c.hook}
                  </p>
                  <p style={{ fontSize: 13, fontWeight: 600, color: "var(--terre,#C4531A)" }}>Voir le détail →</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section style={{ background: "var(--anthracite,#1C1C1E)", padding: "56px 24px", color: "#fff", textAlign: "center" }}>
          <div style={{ maxWidth: 720, margin: "0 auto" }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,.5)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 14 }}>
              Besoin d&apos;aide pour choisir ?
            </p>
            <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 28, fontWeight: 600, marginBottom: 14 }}>
              On vous rappelle gratuitement
            </h2>
            <p style={{ fontSize: 15, color: "rgba(255,255,255,.7)", marginBottom: 28, lineHeight: 1.5 }}>
              Notre équipe basée à Chambéry vous explique le fonctionnement, vous aide à choisir le bon plan et configure votre espace. Sans pression, sans engagement.
            </p>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
              <a href="tel:+33479000000" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 28px", background: "var(--terre,#C4531A)", color: "#fff", borderRadius: 99, fontSize: 15, fontWeight: 600, textDecoration: "none" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                04 79 00 00 00
              </a>
              <a href="mailto:contact@bativio.fr" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 28px", background: "transparent", color: "#fff", borderRadius: 99, fontSize: 15, fontWeight: 600, textDecoration: "none", border: "1px solid rgba(255,255,255,.2)" }}>
                contact@bativio.fr
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
