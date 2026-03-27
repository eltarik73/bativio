import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Rejoignez Bativio \u2014 D\u00e9veloppez votre activit\u00e9 artisan",
  description: "Cr\u00e9ez votre page pro en 3 minutes. Recevez des demandes de devis qualifi\u00e9es. Z\u00e9ro commission, abonnement fixe.",
};

const PLANS = [
  { name: "Gratuit", price: "0\u20AC", per: "", desc: "Pour d\u00e9marrer", feats: ["Fiche annuaire", "Formulaire devis", "3 photos", "2 badges"], pop: false },
  { name: "Essentiel", price: "19\u20AC", per: "/mois", desc: "Visible et joignable", feats: ["10 photos + avant/apr\u00e8s", "Agenda + RDV", "SMS rappel", "Badges illimit\u00e9s"], pop: false },
  { name: "Pro", price: "49\u20AC", per: "/mois", desc: "Vitrine compl\u00e8te", feats: ["URL perso (site vitrine)", "Photos illimit\u00e9es", "Mini-CRM", "Facturation PA", "Export comptable"], pop: true },
  { name: "Pro+", price: "79\u20AC", per: "/mois", desc: "Augment\u00e9 par l\u2019IA", feats: ["Agent IA r\u00e9pondeur", "Devis IA automatique", "Cr\u00e9ation factures", "Support d\u00e9di\u00e9"], pop: false },
];

const FAQ = [
  { q: "Est-ce vraiment gratuit ?", a: "Oui, le plan Gratuit est gratuit \u00e0 vie. Vous pouvez \u00e9voluer vers un plan payant quand vous le souhaitez." },
  { q: "Combien de temps pour cr\u00e9er ma page ?", a: "3 minutes. Entrez votre SIREN, on r\u00e9cup\u00e8re vos infos automatiquement." },
  { q: "Y a-t-il des commissions ?", a: "Non, jamais. Abonnement fixe, z\u00e9ro commission sur les devis ou les chantiers." },
  { q: "Mes clients peuvent me trouver comment ?", a: "Via l\u2019annuaire Bativio, votre URL personnalis\u00e9e, et Google gr\u00e2ce au SEO int\u00e9gr\u00e9." },
  { q: "C\u2019est quoi Invoquo ?", a: "Notre module de facturation \u00e9lectronique, bient\u00f4t disponible pour vous mettre en conformit\u00e9 avec la r\u00e9forme 2026." },
];

const CK = <svg width="15" height="15" fill="none" stroke="#E8A84C" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" /></svg>;

export default function RejoindrePage() {
  return (
    <div style={{ background: "#fff" }}>
      {/* Nav light */}
      <nav style={{ padding: "0 32px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #EDEBE7" }}>
        <Link href="/" style={{ fontFamily: "'Fraunces',serif", fontSize: 22, fontWeight: 700, color: "#C4531A", textDecoration: "none" }}>Bativio</Link>
        <Link href="/connexion" style={{ fontSize: 14, color: "#6B6560", textDecoration: "none" }}>Se connecter</Link>
      </nav>

      {/* Hero */}
      <section style={{ background: "#1C1C1E", padding: "72px 32px 80px", position: "relative", overflow: "hidden", textAlign: "center" }}>
        <div style={{ position: "absolute", top: -100, right: -60, width: 400, height: 400, borderRadius: "50%", background: "rgba(196,83,26,.06)" }} />
        <div style={{ position: "relative", zIndex: 1, maxWidth: 700, margin: "0 auto" }}>
          <h1 style={{ fontFamily: "'Fraunces',serif", fontSize: "clamp(32px,5vw,48px)", fontWeight: 700, color: "#fff", lineHeight: 1.1, letterSpacing: -0.5, marginBottom: 14 }}>
            D&eacute;veloppez votre activit&eacute; avec <span style={{ color: "#E8A84C" }}>Bativio</span>
          </h1>
          <p style={{ fontSize: 18, color: "rgba(255,255,255,.5)", marginBottom: 32 }}>La plateforme des artisans du b&acirc;timent en Rh&ocirc;ne-Alpes</p>
          <Link href="/inscription" style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "18px 36px", background: "#C4531A", color: "#fff", borderRadius: 14, fontSize: 17, fontWeight: 600, textDecoration: "none", transition: "all .2s" }}>
            Cr&eacute;er ma page gratuitement
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
          </Link>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,.3)", marginTop: 16 }}>Gratuit &middot; Sans engagement &middot; 3 minutes</p>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,.35)", marginTop: 20 }}>Rejoignez les artisans de Chamb&eacute;ry, Annecy, Grenoble, Lyon et Valence</p>
        </div>
      </section>

      {/* Pourquoi */}
      <section style={{ padding: "64px 32px", maxWidth: 1000, margin: "0 auto" }}>
        <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 28, fontWeight: 700, color: "#1C1C1E", textAlign: "center", marginBottom: 48 }}>Pourquoi Bativio ?</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 24 }}>
          {[
            { icon: "&#127760;", title: "Votre vitrine pro en ligne", desc: "Page publique avec vos r\u00e9alisations, avis clients, coordonn\u00e9es. Visible sur Google." },
            { icon: "&#128172;", title: "Des demandes qualifi\u00e9es", desc: "Clients de votre ville qui cherchent vos services. Notification imm\u00e9diate par email et SMS." },
            { icon: "&#128176;", title: "Z\u00e9ro commission, toujours", desc: "Abonnement fixe, pas de co\u00fbt par devis. Vos revenus restent vos revenus." },
          ].map((item) => (
            <div key={item.title} style={{ textAlign: "center", padding: 24 }}>
              <div style={{ fontSize: 40, marginBottom: 16 }} dangerouslySetInnerHTML={{ __html: item.icon }} />
              <h3 style={{ fontFamily: "'Fraunces',serif", fontSize: 18, fontWeight: 700, color: "#1C1C1E", marginBottom: 8 }}>{item.title}</h3>
              <p style={{ fontSize: 14, color: "#6B6560", lineHeight: 1.6 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Comment ca marche */}
      <section style={{ background: "#FAF8F5", padding: "64px 32px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 28, fontWeight: 700, color: "#1C1C1E", textAlign: "center", marginBottom: 48 }}>Comment &ccedil;a marche</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16 }}>
            {[
              { n: "1", label: "Entrez votre SIREN", desc: "On r\u00e9cup\u00e8re vos infos automatiquement" },
              { n: "2", label: "Personnalisez votre profil", desc: "Photos, services, badges" },
              { n: "3", label: "Recevez des demandes", desc: "Clients de votre ville" },
              { n: "4", label: "D\u00e9veloppez votre activit\u00e9", desc: "Avis, visibilit\u00e9, facturation" },
            ].map((s) => (
              <div key={s.n} style={{ textAlign: "center" }}>
                <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#fff", border: "2px solid #C4531A", display: "inline-flex", alignItems: "center", justifyContent: "center", fontFamily: "'Fraunces',serif", fontSize: 20, fontWeight: 700, color: "#C4531A", marginBottom: 14 }}>{s.n}</div>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: "#1C1C1E", marginBottom: 4 }}>{s.label}</h3>
                <p style={{ fontSize: 13, color: "#9B9590" }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section style={{ background: "#1C1C1E", padding: "64px 32px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 28, fontWeight: 700, color: "#fff", textAlign: "center", marginBottom: 8 }}>Nos offres</h2>
          <p style={{ textAlign: "center", fontSize: 15, color: "rgba(255,255,255,.4)", marginBottom: 40 }}>Commencez gratuitement, &eacute;voluez quand vous &ecirc;tes pr&ecirc;t</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14 }}>
            {PLANS.map((p) => (
              <div key={p.name} style={{ background: p.pop ? "rgba(196,83,26,.05)" : "rgba(255,255,255,.03)", border: p.pop ? "2px solid #C4531A" : "1px solid rgba(255,255,255,.06)", borderRadius: 16, padding: "28px 22px", display: "flex", flexDirection: "column", position: "relative" }}>
                {p.pop && <div style={{ position: "absolute", top: -10, left: "50%", transform: "translateX(-50%)", background: "#C4531A", color: "#fff", fontSize: 10, fontWeight: 600, padding: "3px 14px", borderRadius: 20, whiteSpace: "nowrap", textTransform: "uppercase", letterSpacing: 0.5 }}>Le + populaire</div>}
                <div style={{ fontFamily: "'Fraunces',serif", fontSize: 19, fontWeight: 600, color: "#fff" }}>{p.name}</div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 3, margin: "8px 0 4px" }}>
                  <span style={{ fontFamily: "'Fraunces',serif", fontSize: 34, fontWeight: 700, color: "#fff" }}>{p.price}</span>
                  {p.per && <span style={{ fontSize: 14, color: "rgba(255,255,255,.35)" }}>{p.per}</span>}
                </div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,.3)", marginBottom: 18 }}>{p.desc}</div>
                <ul style={{ listStyle: "none", flex: 1, marginBottom: 20 }}>
                  {p.feats.map((f) => (
                    <li key={f} style={{ fontSize: 13, padding: "4px 0", display: "flex", alignItems: "flex-start", gap: 6, color: "rgba(255,255,255,.5)" }}>{CK}<span>{f}</span></li>
                  ))}
                </ul>
                <Link href="/inscription" style={{ display: "block", textAlign: "center", padding: 12, borderRadius: 10, fontSize: 14, fontWeight: 600, textDecoration: "none", ...(p.pop ? { background: "#C4531A", color: "#fff" } : { border: "1px solid rgba(255,255,255,.12)", color: "rgba(255,255,255,.6)" }) }}>
                  {p.price === "0\u20AC" ? "Commencer" : "Choisir"}
                </Link>
              </div>
            ))}
          </div>
          <p style={{ textAlign: "center", fontSize: 13, color: "rgba(255,255,255,.25)", marginTop: 24 }}>Pas de commission. Pas de co&ucirc;t par devis. <strong style={{ color: "rgba(255,255,255,.4)" }}>Jamais.</strong></p>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: "64px 32px", maxWidth: 700, margin: "0 auto" }}>
        <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 28, fontWeight: 700, color: "#1C1C1E", textAlign: "center", marginBottom: 40 }}>Questions fr&eacute;quentes</h2>
        {FAQ.map((f, i) => (
          <div key={i} style={{ borderBottom: "1px solid #EDEBE7", padding: "20px 0" }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: "#1C1C1E", marginBottom: 8 }}>{f.q}</h3>
            <p style={{ fontSize: 15, color: "#6B6560", lineHeight: 1.6 }}>{f.a}</p>
          </div>
        ))}
      </section>

      {/* CTA final */}
      <section style={{ background: "#1C1C1E", padding: "56px 32px", textAlign: "center" }}>
        <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 28, fontWeight: 700, color: "#fff", marginBottom: 12 }}>Pr&ecirc;t &agrave; d&eacute;velopper votre activit&eacute; ?</h2>
        <p style={{ fontSize: 15, color: "rgba(255,255,255,.4)", marginBottom: 28 }}>Rejoignez les artisans qui font confiance &agrave; Bativio</p>
        <Link href="/inscription" style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "18px 36px", background: "#C4531A", color: "#fff", borderRadius: 14, fontSize: 17, fontWeight: 600, textDecoration: "none" }}>
          Cr&eacute;er ma page gratuitement
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
        </Link>
        <p style={{ fontSize: 12, color: "rgba(255,255,255,.25)", marginTop: 16 }}>Gratuit &middot; Sans carte bancaire &middot; Lancement &agrave; Chamb&eacute;ry</p>
      </section>

      {/* Footer mini */}
      <footer style={{ padding: "20px 32px", textAlign: "center", fontSize: 12, color: "#9B9590" }}>
        &copy; 2026 Bativio &middot; Z&eacute;ro commission.
      </footer>
    </div>
  );
}
