"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { fadeUp } from "@/lib/motion";

const TESTIMONIALS = [
  { text: "J'ai trouvé un électricien de confiance en 5 minutes. Travaux impeccables.", name: "Sophie L.", role: "Particulier, Annecy", initials: "SL" },
  { text: "Depuis que je suis sur Bativio, j'ai 30% de demandes de devis en plus.", name: "Jean M.", role: "Plombier, Chambéry", initials: "JM" },
  { text: "Simple, rapide, et surtout gratuit. Je recommande à tous les artisans du coin.", name: "Pierre D.", role: "Peintre, Grenoble", initials: "PD" },
];

const VILLES = ["Chambéry", "Annecy", "Grenoble", "Lyon", "Valence", "Aix-les-Bains", "Saint-Étienne", "Voiron"];

const STATS = [
  { value: "1 200+", label: "Artisans vérifiés" },
  { value: "4,8", suffix: "★", label: "Note moyenne clients" },
  { value: "24h", label: "Devis garantis" },
  { value: "0€", label: "Commission artisan" },
];

const STEPS = [
  { n: "01", title: "Décrivez votre besoin", desc: "Métier, ville, projet en quelques mots." },
  { n: "02", title: "Comparez les artisans", desc: "Profils, photos, avis, badges de qualification." },
  { n: "03", title: "Recevez votre devis", desc: "Réponse sous 24h garantie, sans engagement." },
];

export default function DemoLanding() {
  return (
    <>
      <Navbar />

      {/* ─── HERO DARK CINEMATIC ─── */}
      <section className="cinema-dark" style={{ minHeight: "92vh", padding: "100px 32px 80px", textAlign: "center", position: "relative" }}>
        <div className="cinema-blob cinema-blob-1" />
        <div className="cinema-blob cinema-blob-2" />
        <div className="cinema-grid" />

        <div style={{ maxWidth: 900, margin: "0 auto", position: "relative", zIndex: 10 }}>
          <motion.div
            {...fadeUp(0)}
            className="liquid-glass-dark"
            style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 18px", borderRadius: 999, marginBottom: 28, fontSize: 13, fontWeight: 500, color: "rgba(255,255,255,.85)", letterSpacing: 0.3 }}
          >
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--or)", boxShadow: "0 0 12px var(--or)" }} />
            Nouveau — Facturation électronique intégrée
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ opacity: .5 }}><path d="M9 18l6-6-6-6" /></svg>
          </motion.div>

          <motion.h1
            {...fadeUp(0.08)}
            style={{
              fontFamily: "'Fraunces',serif",
              fontSize: "clamp(44px,7vw,88px)",
              fontWeight: 500,
              color: "#fff",
              lineHeight: 1,
              letterSpacing: -2,
              marginBottom: 24,
            }}
          >
            L&apos;artisan{" "}
            <span style={{ fontStyle: "italic", fontWeight: 400, color: "var(--or)", fontFamily: "'Fraunces',serif" }}>idéal</span>
            <br />
            près de chez vous.
          </motion.h1>

          <motion.p
            {...fadeUp(0.16)}
            style={{ fontSize: 19, color: "rgba(255,255,255,.65)", marginBottom: 40, lineHeight: 1.55, maxWidth: 620, margin: "0 auto 40px" }}
          >
            Des artisans de confiance, vérifiés et notés par leurs clients.
            <br />
            Devis gratuit en 24h — zéro commission.
          </motion.p>

          <motion.div
            {...fadeUp(0.24)}
            style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap", marginBottom: 50 }}
          >
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              style={{ background: "var(--terre)", color: "#fff", padding: "16px 32px", borderRadius: 12, fontSize: 16, fontWeight: 600, border: "none", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 10, fontFamily: "inherit" }}
            >
              Trouver un artisan
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M5 12h14M13 5l7 7-7 7" /></svg>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="liquid-glass-dark"
              style={{ color: "#fff", padding: "16px 32px", borderRadius: 12, fontSize: 16, fontWeight: 500, border: "none", cursor: "pointer", fontFamily: "inherit" }}
            >
              Je suis artisan
            </motion.button>
          </motion.div>

          {/* Stats inline */}
          <motion.div
            {...fadeUp(0.32)}
            className="liquid-glass-dark"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4,1fr)",
              borderRadius: 20,
              padding: "28px 24px",
              maxWidth: 720,
              margin: "0 auto",
              gap: 8,
            }}
          >
            {STATS.map((s, i) => (
              <div key={s.label} style={{ textAlign: "center", borderRight: i < 3 ? "1px solid rgba(255,255,255,.08)" : "none", padding: "0 8px" }}>
                <div style={{ fontFamily: "'Fraunces',serif", fontSize: 28, fontWeight: 600, color: "#fff", letterSpacing: -1, lineHeight: 1.1 }}>
                  {s.value}{s.suffix && <span style={{ color: "var(--or)", marginLeft: 2 }}>{s.suffix}</span>}
                </div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,.45)", marginTop: 6, letterSpacing: .3, textTransform: "uppercase" }}>{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── MARQUEE VILLES ─── */}
      <section style={{ background: "#0d0a07", padding: "40px 0", borderTop: "1px solid rgba(255,255,255,.05)", borderBottom: "1px solid rgba(255,255,255,.05)" }}>
        <div style={{ marginBottom: 16, textAlign: "center", fontSize: 11, letterSpacing: 3, color: "rgba(255,255,255,.3)", textTransform: "uppercase" }}>
          Disponible dans toute la Rhône-Alpes
        </div>
        <div className="marquee-mask" style={{ overflow: "hidden" }}>
          <div className="marquee" style={{ display: "flex", gap: 48, whiteSpace: "nowrap", width: "max-content" }}>
            {[...VILLES, ...VILLES, ...VILLES].map((v, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, fontFamily: "'Fraunces',serif", fontSize: 28, fontWeight: 500, color: "rgba(255,255,255,.75)", letterSpacing: -.3 }}>
                {v}
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--terre)" }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CHESS SECTION (video + content) ─── */}
      <section style={{ background: "#0d0a07", padding: "120px 32px", color: "#fff" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
          <motion.div
            {...fadeUp(0)}
            className="liquid-glass-dark"
            style={{ aspectRatio: "4/3", borderRadius: 24, overflow: "hidden", position: "relative", background: "linear-gradient(135deg, #2a1a10 0%, #1a1008 100%)" }}
          >
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ width: 96, height: 96, borderRadius: "50%", background: "rgba(196,83,26,.2)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", border: "1px solid rgba(196,83,26,.3)" }}>
                  <svg width="40" height="40" fill="var(--or)" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                </div>
                <div style={{ fontSize: 14, color: "rgba(255,255,255,.4)", letterSpacing: 1 }}>APERÇU VITRINE ARTISAN</div>
              </div>
            </div>
          </motion.div>

          <div>
            <motion.div {...fadeUp(0)} className="liquid-glass-dark" style={{ display: "inline-block", padding: "6px 14px", borderRadius: 999, fontSize: 12, color: "var(--or)", fontWeight: 600, letterSpacing: .5, marginBottom: 20 }}>
              VITRINE ARTISAN
            </motion.div>
            <motion.h2 {...fadeUp(0.08)} style={{ fontFamily: "'Fraunces',serif", fontSize: "clamp(32px,4vw,52px)", fontWeight: 500, color: "#fff", lineHeight: 1.1, letterSpacing: -1, marginBottom: 20 }}>
              Une présence pro{" "}
              <span style={{ fontStyle: "italic", fontWeight: 400, color: "var(--or)" }}>soignée</span>
              <br />
              sans lever le petit doigt.
            </motion.h2>
            <motion.p {...fadeUp(0.16)} style={{ fontSize: 17, color: "rgba(255,255,255,.65)", lineHeight: 1.6, marginBottom: 28 }}>
              Chaque artisan dispose de sa mini-vitrine publique : photos, avis, badges de qualification, formulaire de devis. Partageable sur Google, WhatsApp, cartes de visite.
            </motion.p>
            <motion.ul {...fadeUp(0.24)} style={{ listStyle: "none", padding: 0, margin: "0 0 32px" }}>
              {["Optimisée SEO par ville et métier", "4 templates au choix (Classique, Moderne, Portfolio, Vitrine)", "Mise à jour en un clic depuis l'espace pro"].map((t) => (
                <li key={t} style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 15, color: "rgba(255,255,255,.75)", marginBottom: 12 }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--terre)" }} />
                  {t}
                </li>
              ))}
            </motion.ul>
            <motion.div {...fadeUp(0.32)}>
              <Link href="/inscription" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 28px", background: "var(--terre)", color: "#fff", borderRadius: 12, fontSize: 15, fontWeight: 600 }}>
                Créer ma vitrine
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M5 12h14M13 5l7 7-7 7" /></svg>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── STEPS ─── */}
      <section style={{ background: "#0d0a07", padding: "120px 32px", color: "#fff" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <motion.div {...fadeUp(0)} style={{ textAlign: "center", marginBottom: 72 }}>
            <div style={{ fontSize: 12, letterSpacing: 3, color: "rgba(255,255,255,.4)", textTransform: "uppercase", marginBottom: 16 }}>Process</div>
            <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: "clamp(36px,5vw,56px)", fontWeight: 500, letterSpacing: -1, lineHeight: 1.05 }}>
              Trois étapes,{" "}
              <span style={{ fontStyle: "italic", fontWeight: 400, color: "var(--or)" }}>zéro friction</span>.
            </h2>
          </motion.div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 24 }}>
            {STEPS.map((s, i) => (
              <motion.div
                key={s.n}
                {...fadeUp(i * 0.1)}
                className="liquid-glass-dark"
                style={{ padding: 36, borderRadius: 20 }}
              >
                <div style={{ fontFamily: "'Fraunces',serif", fontSize: 48, fontWeight: 300, color: "var(--or)", letterSpacing: -2, marginBottom: 20, lineHeight: 1 }}>{s.n}</div>
                <h3 style={{ fontFamily: "'Fraunces',serif", fontSize: 22, fontWeight: 500, color: "#fff", marginBottom: 10 }}>{s.title}</h3>
                <p style={{ fontSize: 15, color: "rgba(255,255,255,.6)", lineHeight: 1.6 }}>{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <section style={{ background: "#0d0a07", padding: "120px 32px", color: "#fff", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "20%", right: "-200px", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(196,83,26,.12) 0%, transparent 70%)", pointerEvents: "none", filter: "blur(60px)" }} />
        <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative" }}>
          <motion.div {...fadeUp(0)} style={{ textAlign: "center", marginBottom: 72 }}>
            <div style={{ fontSize: 12, letterSpacing: 3, color: "rgba(255,255,255,.4)", textTransform: "uppercase", marginBottom: 16 }}>Témoignages</div>
            <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: "clamp(36px,5vw,56px)", fontWeight: 500, letterSpacing: -1, lineHeight: 1.05 }}>
              La confiance{" "}
              <span style={{ fontStyle: "italic", fontWeight: 400, color: "var(--or)" }}>partagée</span>
              <br />
              de nos clients.
            </h2>
          </motion.div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 24 }}>
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={t.name}
                {...fadeUp(i * 0.1)}
                className="liquid-glass-dark"
                style={{
                  borderRadius: 24,
                  padding: 36,
                  display: "flex",
                  flexDirection: "column",
                  transform: i === 1 ? "translateY(-24px)" : undefined,
                }}
              >
                <div style={{ display: "flex", gap: 3, marginBottom: 20 }}>
                  {[1,2,3,4,5].map((s) => (
                    <svg key={s} width="16" height="16" viewBox="0 0 20 20" fill="var(--or)"><path d="M10 1l2.39 4.84 5.34.78-3.87 3.77.91 5.33L10 13.27l-4.77 2.51.91-5.33L2.27 6.68l5.34-.78L10 1z" /></svg>
                  ))}
                </div>
                <p style={{ fontFamily: "'Fraunces',serif", fontSize: 19, color: "#fff", lineHeight: 1.5, fontWeight: 400, flex: 1, letterSpacing: -.3 }}>&ldquo;{t.text}&rdquo;</p>
                <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 28, paddingTop: 22, borderTop: "1px solid rgba(255,255,255,.08)" }}>
                  <div style={{ width: 44, height: 44, borderRadius: "50%", background: "linear-gradient(135deg, var(--terre), var(--or))", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Fraunces',serif", fontSize: 15, fontWeight: 600, color: "#fff" }}>{t.initials}</div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "#fff" }}>{t.name}</div>
                    <div style={{ fontSize: 12, color: "rgba(255,255,255,.5)" }}>{t.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA FINAL ─── */}
      <section className="cinema-dark" style={{ padding: "140px 32px", textAlign: "center", position: "relative" }}>
        <div className="cinema-blob cinema-blob-1" style={{ opacity: .3 }} />
        <div style={{ maxWidth: 780, margin: "0 auto", position: "relative", zIndex: 10 }}>
          <motion.h2 {...fadeUp(0)} style={{ fontFamily: "'Fraunces',serif", fontSize: "clamp(40px,6vw,72px)", fontWeight: 500, color: "#fff", lineHeight: 1.05, letterSpacing: -2, marginBottom: 24 }}>
            Prêt à rejoindre{" "}
            <span style={{ fontStyle: "italic", fontWeight: 400, color: "var(--or)" }}>Bativio</span> ?
          </motion.h2>
          <motion.p {...fadeUp(0.08)} style={{ fontSize: 19, color: "rgba(255,255,255,.65)", marginBottom: 36 }}>
            Rejoignez 1 200+ artisans qui développent leur activité en Rhône-Alpes. Inscription gratuite, sans carte bancaire.
          </motion.p>
          <motion.div {...fadeUp(0.16)} style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/inscription" style={{ background: "var(--terre)", color: "#fff", padding: "18px 36px", borderRadius: 14, fontSize: 16, fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 10 }}>
              Créer mon compte
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M5 12h14M13 5l7 7-7 7" /></svg>
            </Link>
            <Link href="/tarifs" className="liquid-glass-dark" style={{ color: "#fff", padding: "18px 36px", borderRadius: 14, fontSize: 16, fontWeight: 500 }}>
              Voir les tarifs
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </>
  );
}
