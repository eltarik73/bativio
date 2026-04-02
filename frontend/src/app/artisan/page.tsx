import { Metadata } from "next";
import Link from "next/link";
import PricingGrid from "@/components/pricing/PricingGrid";
import Footer from "@/components/Footer";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Bativio pour les artisans — Le seul outil tout-en-un",
  description: "Annuaire, facturation, site internet, CRM, IA. Zéro commission, abonnement fixe. Conforme réforme 2026.",
  alternates: { canonical: "https://bativio.fr/artisan" },
};

const FlagFR = () => <svg width="20" height="14" viewBox="0 0 22 16" fill="none"><rect x="0.5" y="0.5" width="21" height="15" rx="2" fill="#fff" stroke="#E8D5C0" strokeWidth="0.5" /><rect x="1" y="1" width="6.67" height="14" fill="#002395" /><rect x="7.67" y="1" width="6.67" height="14" fill="#fff" /><rect x="14.33" y="1" width="6.67" height="14" fill="#ED2939" /></svg>;
const FlagEU = () => <svg width="20" height="14" viewBox="0 0 22 16" fill="none"><rect x="0.5" y="0.5" width="21" height="15" rx="2" fill="#003399" stroke="#E8D5C0" strokeWidth="0.5" />{[3.2,3.9,5.5,8,10.5,12.1,12.8,12.1,10.5,8,5.5,3.9].map((cy,i) => <circle key={i} cx={[11,13.5,15.1,15.8,15.1,13.5,11,8.5,6.9,6.2,6.9,8.5][i]} cy={cy} r="0.7" fill="#FFCC00" />)}</svg>;

const NORMS = [
  { icon: <FlagFR />, label: "Conforme réforme 2026" },
  { icon: <FlagEU />, label: "Norme européenne e-invoicing" },
  { icon: <svg width="16" height="16" fill="none" stroke="#4A6741" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" /></svg>, label: "Émission & réception PA" },
  { icon: <svg width="16" height="16" fill="none" stroke="#4A6741" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>, label: "PA certifiée par l'État" },
];

const FEATURES = [
  { title: "Annuaire gratuit", desc: "Soyez trouvé par des clients de votre ville. Profil, photos, avis.", plan: "Gratuit", color: "var(--sable)" },
  { title: "Facturation conforme", desc: "Factures et devis illimités. Réception et émission PA.", plan: "Starter 19€", color: "var(--argile)" },
  { title: "Site internet + CRM", desc: "Votre site pro personnalisé. CRM clients, agenda, RDV en ligne.", plan: "Pro 39€", color: "var(--terre)" },
  { title: "IA + SEO local", desc: "Devis IA automatisé, agent répondeur, SEO optimisé.", plan: "Business 59€", color: "var(--bois)" },
];

const TESTIMONIALS_ARTISAN = [
  { text: "L'annuaire m'a apporté mes premiers clients en 2 semaines.", name: "Marc T.", role: "Plombier, Chambéry", initials: "MT" },
  { text: "Un seul outil pour tout gérer : factures, site, clients. Enfin.", name: "Léa B.", role: "Peintre, Grenoble", initials: "LB" },
  { text: "J'ai commencé gratuit. Aujourd'hui en Pro, mes demandes ont doublé.", name: "Ahmed K.", role: "Électricien, Lyon", initials: "AK" },
];

export default function ArtisanLandingPage() {
  return (
    <>
      {/* ─── NAV DARK ─── */}
      <nav style={{ position: "sticky", top: 0, zIndex: 100, background: "var(--anthracite)", padding: "0 32px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link href="/" style={{ fontFamily: "'Fraunces',serif", fontSize: 24, fontWeight: 700, color: "var(--terre)", letterSpacing: -0.5 }}>Bativio</Link>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <Link href="#pricing" style={{ fontSize: 14, fontWeight: 500, color: "rgba(255,255,255,.6)" }}>Tarifs</Link>
          <Link href="/" style={{ fontSize: 14, fontWeight: 500, color: "rgba(255,255,255,.6)" }}>Annuaire</Link>
          <Link href="/connexion" style={{ fontSize: 14, fontWeight: 500, color: "rgba(255,255,255,.6)" }}>Connexion</Link>
          <Link href="/inscription" style={{ padding: "10px 22px", borderRadius: 99, background: "var(--terre)", color: "#fff", fontSize: 13, fontWeight: 600 }}>Créer ma page</Link>
        </div>
      </nav>

      {/* ─── HERO DARK ─── */}
      <section style={{ background: "var(--anthracite)", padding: "80px 32px 72px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -160, right: -100, width: 600, height: 600, borderRadius: "50%", background: "rgba(196,83,26,.06)" }} />
        <div style={{ position: "absolute", bottom: -140, left: -80, width: 500, height: 500, borderRadius: "50%", background: "rgba(201,148,58,.04)" }} />
        <div style={{ maxWidth: 700, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <h1 style={{ fontFamily: "'Fraunces',serif", fontSize: "clamp(30px,5vw,46px)", fontWeight: 700, color: "#fff", lineHeight: 1.12, letterSpacing: -0.5, marginBottom: 16 }}>
            Le seul outil <span className="calli" style={{ color: "var(--argile)" }}>tout-en-un</span> pour l&apos;artisan du b&acirc;timent
          </h1>
          <p style={{ fontSize: 18, color: "rgba(255,255,255,.55)", marginBottom: 32, lineHeight: 1.6 }}>
            Annuaire, facturation, site internet, CRM, IA. Tout ce qu&apos;il faut pour trouver des clients et g&eacute;rer votre activit&eacute;.
          </p>
          <Link href="/inscription" style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "16px 36px", background: "var(--terre)", color: "#fff", borderRadius: 99, fontSize: 16, fontWeight: 600 }}>
            Cr&eacute;er ma page gratuitement
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
          </Link>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 20, marginTop: 28, flexWrap: "wrap" }}>
            {[
              { icon: <FlagFR />, label: "Conforme France" },
              { icon: <FlagEU />, label: "Norme UE" },
              { label: "Zéro commission" },
            ].map((b) => (
              <span key={b.label} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 500, color: "rgba(255,255,255,.5)" }}>
                {b.icon} {b.label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ─── BARRE NORMES ─── */}
      <section style={{ background: "var(--blanc)", padding: "16px 32px", borderBottom: "1px solid var(--sable)" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", justifyContent: "center", gap: 28, flexWrap: "wrap" }}>
          {NORMS.map((n) => (
            <div key={n.label} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 500, color: "var(--bois-mid)" }}>
              {n.icon} {n.label}
            </div>
          ))}
        </div>
      </section>

      {/* ─── ANNUAIRE ─── */}
      <section style={{ background: "var(--creme)", padding: "72px 32px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "center" }}>
          <div>
            <div style={{ width: 40, height: 2, background: "var(--terre)", marginBottom: 16, borderRadius: 1 }} />
            <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: "clamp(24px,3.5vw,32px)", fontWeight: 700, color: "var(--bois)", lineHeight: 1.2, marginBottom: 16 }}>
              Soyez trouv&eacute; par des clients qui cherchent <span className="calli">un artisan</span>
            </h2>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 12, marginBottom: 24 }}>
              {["Référencement local dans l'annuaire Bativio", "Avis clients vérifiés sur votre profil", "Demandes de devis directes — notification immédiate"].map((f) => (
                <li key={f} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 15, color: "var(--bois-mid)", lineHeight: 1.5 }}>
                  <svg width="18" height="18" fill="none" stroke="var(--mousse)" strokeWidth="2.5" viewBox="0 0 24 24" style={{ flexShrink: 0, marginTop: 2 }}><path d="M5 13l4 4L19 7" /></svg>
                  {f}
                </li>
              ))}
            </ul>
            <div style={{ display: "flex", gap: 20, fontSize: 14 }}>
              <div><span style={{ fontFamily: "'Fraunces',serif", fontSize: 28, fontWeight: 700, color: "var(--terre)" }}>+30%</span><br /><span style={{ color: "var(--pierre)", fontSize: 12 }}>de demandes en moyenne</span></div>
              <div><span style={{ fontFamily: "'Fraunces',serif", fontSize: 28, fontWeight: 700, color: "var(--terre)" }}>24h</span><br /><span style={{ color: "var(--pierre)", fontSize: 12 }}>d&eacute;lai moyen de r&eacute;ponse</span></div>
            </div>
          </div>
          <div style={{ background: "var(--blanc)", borderRadius: 16, border: "1px solid var(--sable)", padding: 24, boxShadow: "0 4px 24px rgba(0,0,0,.04)" }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: "var(--pierre)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>Annuaire Bativio</div>
            {["Martin Plomberie", "Dupont Peinture", "Élec Savoie"].map((name, i) => (
              <div key={name} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 0", borderBottom: i < 2 ? "1px solid var(--sable)" : "none" }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: `linear-gradient(135deg, var(--terre), var(--argile))`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Fraunces',serif", fontSize: 12, fontWeight: 700, color: "#fff" }}>{name.split(" ").map(w => w[0]).join("")}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "var(--bois)" }}>{name}</div>
                  <div style={{ fontSize: 12, color: "var(--pierre)" }}>Chamb&eacute;ry</div>
                </div>
                <div style={{ display: "flex", gap: 1 }}>
                  {[1,2,3,4,5].map(s => <svg key={s} width="12" height="12" viewBox="0 0 20 20" fill="var(--or)"><path d="M10 1l2.39 4.84 5.34.78-3.87 3.77.91 5.33L10 13.27l-4.77 2.51.91-5.33L2.27 6.68l5.34-.78L10 1z" /></svg>)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FACTURATION ─── */}
      <section style={{ background: "var(--blanc)", padding: "72px 32px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "center" }}>
          <div style={{ background: "var(--creme)", borderRadius: 16, border: "1px solid var(--sable)", padding: 24, boxShadow: "0 4px 24px rgba(0,0,0,.04)", order: 1 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: "var(--pierre)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>Factures r&eacute;centes</div>
            {[
              { ref: "FAC-2026-042", client: "M. Dupont", amount: "1 850€", status: "Payée", statusColor: "var(--mousse)" },
              { ref: "FAC-2026-041", client: "Mme Lambert", amount: "3 200€", status: "En attente", statusColor: "var(--or)" },
              { ref: "DEV-2026-018", client: "SCI Alpes", amount: "5 400€", status: "Envoyé", statusColor: "var(--terre)" },
            ].map((f) => (
              <div key={f.ref} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid var(--sable)" }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "var(--bois)" }}>{f.ref}</div>
                  <div style={{ fontSize: 12, color: "var(--pierre)" }}>{f.client}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "var(--bois)" }}>{f.amount}</div>
                  <span style={{ fontSize: 11, fontWeight: 600, color: f.statusColor }}>{f.status}</span>
                </div>
              </div>
            ))}
          </div>
          <div style={{ order: 2 }}>
            <div style={{ width: 40, height: 2, background: "var(--terre)", marginBottom: 16, borderRadius: 1 }} />
            <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: "clamp(24px,3.5vw,32px)", fontWeight: 700, color: "var(--bois)", lineHeight: 1.2, marginBottom: 16 }}>
              Finis les papiers, les relances et <span className="calli">les oublis</span>
            </h2>
            <p style={{ fontSize: 15, color: "var(--bois-mid)", lineHeight: 1.6 }}>
              Factures, devis, transmission PA automatique. Tout est conforme &agrave; la r&eacute;forme 2026, sans rien &agrave; g&eacute;rer.
            </p>
          </div>
        </div>
      </section>

      {/* ─── TOUT-EN-UN ─── */}
      <section style={{ background: "var(--creme)", padding: "72px 32px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div style={{ width: 40, height: 2, background: "var(--terre)", margin: "0 auto 16px", borderRadius: 1 }} />
            <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: "clamp(24px,4vw,32px)", fontWeight: 700, color: "var(--bois)" }}>
              Un outil qui <span className="calli">grandit</span> avec vous
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 16 }}>
            {FEATURES.map((f) => (
              <div key={f.title} style={{ background: "var(--blanc)", borderRadius: 14, border: "1px solid var(--sable)", padding: 24, transition: "all .2s" }}>
                <span style={{ display: "inline-block", fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 99, background: f.color, color: f.color === "var(--bois)" ? "#fff" : "var(--bois)", marginBottom: 12, opacity: f.color === "var(--sable)" ? 1 : 0.85 }}>{f.plan}</span>
                <h3 style={{ fontFamily: "'Fraunces',serif", fontSize: 17, fontWeight: 700, color: "var(--bois)", marginBottom: 6 }}>{f.title}</h3>
                <p style={{ fontSize: 14, color: "var(--bois-mid)", lineHeight: 1.5 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PRICING ─── */}
      <section id="pricing" style={{ background: "var(--blanc)", scrollMarginTop: 64 }}>
        <PricingGrid />
      </section>

      {/* ─── TÉMOIGNAGES ARTISANS ─── */}
      <section style={{ background: "var(--creme)", padding: "72px 32px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div style={{ width: 40, height: 2, background: "var(--terre)", margin: "0 auto 16px", borderRadius: 1 }} />
            <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: "clamp(24px,4vw,32px)", fontWeight: 700, color: "var(--bois)" }}>
              Ils nous font confiance
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20 }}>
            {TESTIMONIALS_ARTISAN.map((t) => (
              <div key={t.name} style={{ background: "var(--blanc)", borderRadius: 14, border: "1px solid var(--sable)", padding: 28 }}>
                <div style={{ display: "flex", gap: 2, marginBottom: 14 }}>
                  {[1,2,3,4,5].map(s => <svg key={s} width="16" height="16" viewBox="0 0 20 20" fill="var(--or)"><path d="M10 1l2.39 4.84 5.34.78-3.87 3.77.91 5.33L10 13.27l-4.77 2.51.91-5.33L2.27 6.68l5.34-.78L10 1z" /></svg>)}
                </div>
                <p style={{ fontSize: 15, color: "var(--bois-mid)", lineHeight: 1.6, fontStyle: "italic", marginBottom: 16 }}>&ldquo;{t.text}&rdquo;</p>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 38, height: 38, borderRadius: "50%", background: "linear-gradient(135deg, var(--terre), var(--argile))", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Fraunces',serif", fontSize: 13, fontWeight: 700, color: "#fff" }}>{t.initials}</div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "var(--bois)" }}>{t.name}</div>
                    <div style={{ fontSize: 12, color: "var(--pierre)" }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA FINAL ─── */}
      <section style={{ background: "var(--anthracite)", padding: "72px 32px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -80, left: "50%", transform: "translateX(-50%)", width: 500, height: 500, borderRadius: "50%", background: "rgba(196,83,26,.05)" }} />
        <div style={{ position: "relative", zIndex: 1, maxWidth: 600, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: "clamp(24px,4vw,34px)", fontWeight: 700, color: "#fff", marginBottom: 12 }}>
            Le seul outil dont votre activit&eacute; a <span className="calli" style={{ color: "var(--argile)" }}>besoin</span>
          </h2>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,.5)", marginBottom: 28, lineHeight: 1.6 }}>
            Rejoignez les artisans qui font confiance &agrave; Bativio
          </p>
          <Link href="/inscription" style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "16px 36px", background: "var(--terre)", color: "#fff", borderRadius: 99, fontSize: 16, fontWeight: 600 }}>
            Cr&eacute;er ma page gratuitement
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
          </Link>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,.3)", marginTop: 14 }}>Sans engagement &middot; Z&eacute;ro commission</p>
        </div>
      </section>

      <Footer />
    </>
  );
}
