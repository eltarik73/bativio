import { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Tarifs Bativio — Abonnements artisans du bâtiment",
  description: "Découvrez nos offres : Gratuit, Essentiel 19€, Pro 49€, Pro+ 79€. Zéro commission, zéro frais cachés.",
  alternates: { canonical: "https://bativio.fr/tarifs" },
};

const PLANS = [
  {
    name: "Gratuit", price: "0€", per: "", desc: "Pour découvrir Bativio", pop: false,
    features: [
      { label: "Fiche annuaire", ok: true },
      { label: "Formulaire de devis", ok: true },
      { label: "Photos chantiers", ok: true, detail: "3 max" },
      { label: "Badges qualifications", ok: true, detail: "2 max" },
      { label: "Vitrine personnalisée", ok: false },
      { label: "Agenda & RDV en ligne", ok: false },
      { label: "SMS notifications", ok: false },
      { label: "Devis IA", ok: false },
      { label: "Agent IA répondeur", ok: false },
      { label: "Support", ok: false, detail: "—" },
    ],
  },
  {
    name: "Essentiel", price: "19€", per: "/mois", desc: "Pour être visible et joignable", pop: false,
    features: [
      { label: "Fiche annuaire", ok: true },
      { label: "Formulaire de devis", ok: true },
      { label: "Photos chantiers", ok: true, detail: "10" },
      { label: "Badges qualifications", ok: true, detail: "Illimité" },
      { label: "Vitrine personnalisée", ok: false },
      { label: "Agenda & RDV en ligne", ok: true },
      { label: "SMS notifications", ok: false },
      { label: "Devis IA", ok: false },
      { label: "Agent IA répondeur", ok: false },
      { label: "Support", ok: true, detail: "Email" },
    ],
  },
  {
    name: "Pro", price: "49€", per: "/mois", desc: "Votre site vitrine complet", pop: true,
    features: [
      { label: "Fiche annuaire", ok: true },
      { label: "Formulaire de devis", ok: true },
      { label: "Photos chantiers", ok: true, detail: "Illimité" },
      { label: "Badges qualifications", ok: true, detail: "Illimité" },
      { label: "Vitrine personnalisée", ok: true },
      { label: "Agenda & RDV en ligne", ok: true },
      { label: "SMS notifications", ok: false },
      { label: "Devis IA", ok: false },
      { label: "Agent IA répondeur", ok: false },
      { label: "Support", ok: true, detail: "Prioritaire" },
    ],
  },
  {
    name: "Pro+", price: "79€", per: "/mois", desc: "L'artisan boosté par l'IA", pop: false,
    features: [
      { label: "Fiche annuaire", ok: true },
      { label: "Formulaire de devis", ok: true },
      { label: "Photos chantiers", ok: true, detail: "Illimité" },
      { label: "Badges qualifications", ok: true, detail: "Illimité" },
      { label: "Vitrine personnalisée", ok: true },
      { label: "Agenda & RDV en ligne", ok: true },
      { label: "SMS notifications", ok: true, detail: "30/mois" },
      { label: "Devis IA", ok: true },
      { label: "Agent IA répondeur", ok: true, detail: "Bientôt" },
      { label: "Support", ok: true, detail: "Dédié" },
    ],
  },
];

const FAQ = [
  { q: "Est-ce que Bativio prend une commission ?", a: "Non, jamais. Zéro commission sur vos devis et vos chantiers. Vous gardez 100% de vos revenus." },
  { q: "Puis-je changer de plan ?", a: "Oui, à tout moment depuis votre dashboard. Upgrade instantané, downgrade en fin de période." },
  { q: "Y a-t-il un engagement ?", a: "Non, sans engagement. Vous pouvez annuler à tout moment. Pas de frais cachés." },
  { q: "Comment fonctionne le devis IA ?", a: "Décrivez les travaux du client, l'IA génère un devis structuré avec les bons postes et prix du marché. Vous ajustez et envoyez." },
  { q: "Comment fonctionne la facturation électronique ?", a: "Bativio sera connecté à une plateforme certifiée par l'État via Invoquo. Disponible prochainement." },
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
          <p style={{ fontSize: 17, color: "#6B6560", marginTop: 12, maxWidth: 520, margin: "12px auto 0" }}>
            Zéro commission. Zéro frais cachés. Vous savez exactement ce que vous payez.
          </p>
        </section>

        {/* Plans */}
        <section style={{ padding: "0 32px 64px", maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 20 }} className="max-md:grid-cols-2 max-[640px]:grid-cols-1">
            {PLANS.map((p) => (
              <div key={p.name} style={{
                background: "#fff", borderRadius: 16, padding: "28px 24px", position: "relative",
                border: p.pop ? "2px solid #C4531A" : "1px solid #E5E0DB",
                boxShadow: p.pop ? "0 4px 20px rgba(196,83,26,.12)" : "0 1px 3px rgba(0,0,0,.06)",
              }}>
                {p.pop && (
                  <div style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", background: "#C4531A", color: "#fff", padding: "4px 16px", borderRadius: 20, fontSize: 12, fontWeight: 600 }}>Le + populaire</div>
                )}
                <div style={{ fontFamily: "'Fraunces',serif", fontSize: 20, fontWeight: 700, color: "#1C1C1E" }}>{p.name}</div>
                <div style={{ marginTop: 8 }}>
                  <span style={{ fontFamily: "'Fraunces',serif", fontSize: 36, fontWeight: 700, color: "#C4531A" }}>{p.price}</span>
                  {p.per && <span style={{ fontSize: 15, color: "#9B9590" }}>{p.per}</span>}
                </div>
                <p style={{ fontSize: 13, color: "#9B9590", marginTop: 4 }}>{p.desc}</p>
                <div style={{ margin: "20px 0", height: 1, background: "#F0EDEA" }} />
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {p.features.map((f) => (
                    <li key={f.label} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 0", fontSize: 14, color: f.ok ? "#1C1C1E" : "#C5C0B9" }}>
                      <span style={{ fontSize: 14, flexShrink: 0 }}>{f.ok ? "✅" : "—"}</span>
                      <span>{f.label}</span>
                      {f.detail && <span style={{ marginLeft: "auto", fontSize: 12, color: "#9B9590", fontWeight: 500 }}>{f.detail}</span>}
                    </li>
                  ))}
                </ul>
                <Link href="/inscription" style={{
                  display: "block", textAlign: "center", marginTop: 20, padding: "12px 0", borderRadius: 12, fontSize: 14, fontWeight: 600, textDecoration: "none",
                  background: p.pop ? "#C4531A" : "transparent", color: p.pop ? "#fff" : "#C4531A",
                  border: p.pop ? "none" : "1.5px solid #C4531A",
                }}>
                  {p.price === "0€" ? "Commencer gratuitement" : `Choisir ${p.name}`}
                </Link>
              </div>
            ))}
          </div>
          <p style={{ textAlign: "center", fontSize: 14, color: "#9B9590", marginTop: 24 }}>
            Pas de commission. Pas de coût par devis. Pas de frais cachés. <strong style={{ color: "#6B6560" }}>Jamais.</strong>
          </p>
        </section>

        {/* FAQ */}
        <section style={{ padding: "64px 32px", background: "#fff" }}>
          <div style={{ maxWidth: 700, margin: "0 auto" }}>
            <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 28, fontWeight: 700, color: "#1C1C1E", textAlign: "center", marginBottom: 32 }}>Questions fréquentes</h2>
            {FAQ.map((f, i) => (
              <div key={i} style={{ padding: "20px 0", borderBottom: i < FAQ.length - 1 ? "1px solid #F0EDEA" : "none" }}>
                <h3 style={{ fontSize: 16, fontWeight: 600, color: "#1C1C1E", marginBottom: 8 }}>{f.q}</h3>
                <p style={{ fontSize: 15, color: "#6B6560", lineHeight: 1.6 }}>{f.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section style={{ padding: "64px 32px", textAlign: "center", background: "#1C1C1E" }}>
          <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 28, fontWeight: 700, color: "#fff" }}>Prêt à développer votre activité ?</h2>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,.5)", marginTop: 8 }}>Inscrivez-vous gratuitement. Sans engagement.</p>
          <Link href="/inscription" style={{ display: "inline-block", marginTop: 24, padding: "14px 32px", background: "#C4531A", color: "#fff", borderRadius: 12, fontSize: 16, fontWeight: 600, textDecoration: "none" }}>Créer ma page gratuitement</Link>
        </section>
      </main>
      <Footer />
    </>
  );
}
