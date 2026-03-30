import { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Facturation électronique pour artisans — Bativio est prêt",
  description:
    "Obligation sept. 2026 : recevez et émettez vos factures électroniques. Bativio est connecté à une plateforme agréée. Conforme, simple, intégré.",
  alternates: { canonical: "https://bativio.fr/facturation-electronique" },
};

const TIMELINE = [
  {
    date: "Sept. 2026",
    title: "Réception obligatoire",
    desc: "Toutes les entreprises doivent pouvoir recevoir des factures électroniques.",
    active: true,
  },
  {
    date: "Sept. 2027",
    title: "Émission obligatoire — grandes entreprises",
    desc: "Les grandes entreprises et ETI doivent émettre leurs factures au format électronique.",
    active: false,
  },
  {
    date: "Sept. 2028",
    title: "Émission obligatoire — TPE/PME",
    desc: "Toutes les entreprises, y compris les artisans, doivent émettre des factures électroniques.",
    active: false,
  },
];

const STEPS = [
  {
    num: "1",
    title: "Inscrivez-vous sur Bativio",
    desc: "Créez votre compte gratuitement en 3 minutes avec votre numéro SIRET.",
    icon: (
      <svg width="28" height="28" fill="none" stroke="#C4531A" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M19 8v6M22 11h-6" />
      </svg>
    ),
  },
  {
    num: "2",
    title: "Activez le module facturation",
    desc: "Un clic suffit pour activer la facturation électronique depuis votre dashboard.",
    icon: (
      <svg width="28" height="28" fill="none" stroke="#C4531A" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M9 12l2 2 4-4" />
        <rect x="3" y="3" width="18" height="18" rx="3" />
      </svg>
    ),
  },
  {
    num: "3",
    title: "Recevez et envoyez en conformité",
    desc: "Vos factures sont transmises via une plateforme agréée par l'État. Rien à gérer.",
    icon: (
      <svg width="28" height="28" fill="none" stroke="#C4531A" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
      </svg>
    ),
  },
];

const FEATURES = [
  {
    title: "Conforme",
    desc: "Connecté à une plateforme certifiée par l'État. Vos factures respectent les formats réglementaires.",
    icon: (
      <svg width="24" height="24" fill="none" stroke="#C4531A" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
  },
  {
    title: "Automatique",
    desc: "Réception, émission et suivi de statut gérés automatiquement. Zéro saisie manuelle inutile.",
    icon: (
      <svg width="24" height="24" fill="none" stroke="#C4531A" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
      </svg>
    ),
  },
  {
    title: "Tout-en-un",
    desc: "Visibilité, gestion client et facturation dans un seul outil. Pas besoin de logiciel supplémentaire.",
    icon: (
      <svg width="24" height="24" fill="none" stroke="#C4531A" strokeWidth="2" viewBox="0 0 24 24">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <path d="M8 21h8M12 17v4" />
      </svg>
    ),
  },
  {
    title: "Connecté PA",
    desc: "Bativio transmet vos factures via Invoquo, opérateur de dématérialisation connecté au portail public.",
    icon: (
      <svg width="24" height="24" fill="none" stroke="#C4531A" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
      </svg>
    ),
  },
];

const FAQ = [
  {
    q: "Qu'est-ce que la facturation électronique ?",
    a: "C'est l'obligation pour toutes les entreprises d'émettre et de recevoir leurs factures dans un format structuré (Factur-X, UBL ou CII), transmis via une plateforme agréée par l'État. Ce n'est pas un simple PDF envoyé par email.",
  },
  {
    q: "Mon entreprise est-elle concernée ?",
    a: "Oui. À partir de septembre 2026, toutes les entreprises assujetties à la TVA — y compris les artisans, auto-entrepreneurs et TPE — doivent pouvoir recevoir des factures électroniques. L'obligation d'émettre s'applique aux TPE/PME à partir de septembre 2028.",
  },
  {
    q: "Qu'est-ce qu'une plateforme agréée ?",
    a: "Une plateforme de dématérialisation partenaire (PDP) est un opérateur privé agréé par l'administration fiscale pour transmettre les factures électroniques entre entreprises et vers le portail public de facturation.",
  },
  {
    q: "Combien ça coûte ?",
    a: "La réception de factures est incluse dès le plan Essentiel à 19€/mois. L'émission et la création de factures sont disponibles dans les plans Pro (49€) et Pro+ (79€). Zéro commission, zéro frais par facture.",
  },
  {
    q: "Bativio est-il conforme ?",
    a: "Bativio est connecté à Invoquo, un opérateur de dématérialisation qui assure la transmission de vos factures via les API du portail public de facturation. Vos factures sont conformes aux formats réglementaires exigés.",
  },
];

function JsonLd() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.a,
      },
    })),
  };

  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Bativio",
    url: "https://bativio.fr",
    logo: "https://bativio.fr/og-image.png",
    description:
      "Plateforme de visibilité et de gestion pour artisans du bâtiment en Rhône-Alpes. Annuaire, vitrines, facturation électronique.",
    sameAs: [],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      availableLanguage: "French",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />
    </>
  );
}

export default function FacturationElectroniquePage() {
  return (
    <>
      <Navbar />
      <JsonLd />
      <main style={{ background: "#FAF8F5", minHeight: "100vh" }}>
        {/* Hero */}
        <section
          style={{
            background: "#1C1C1E",
            padding: "80px 32px 72px",
            textAlign: "center",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: -120,
              right: -80,
              width: 450,
              height: 450,
              borderRadius: "50%",
              background: "rgba(196,83,26,.06)",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: -80,
              left: -60,
              width: 300,
              height: 300,
              borderRadius: "50%",
              background: "rgba(232,168,76,.04)",
            }}
          />
          <div style={{ position: "relative", zIndex: 1, maxWidth: 740, margin: "0 auto" }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: "rgba(232,168,76,.15)",
                padding: "6px 16px",
                borderRadius: 20,
                fontSize: 13,
                fontWeight: 600,
                color: "#E8A84C",
                marginBottom: 24,
              }}
            >
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
              </svg>
              Obligation septembre 2026
            </div>
            <h1
              style={{
                fontFamily: "'Fraunces',serif",
                fontSize: "clamp(30px,5vw,46px)",
                fontWeight: 700,
                color: "#fff",
                lineHeight: 1.12,
                letterSpacing: -0.5,
                marginBottom: 16,
              }}
            >
              Facturation électronique —{" "}
              <span style={{ color: "#E8A84C" }}>Votre entreprise est-elle prête ?</span>
            </h1>
            <p
              style={{
                fontSize: 18,
                color: "rgba(255,255,255,.55)",
                lineHeight: 1.6,
                maxWidth: 580,
                margin: "0 auto 32px",
              }}
            >
              À partir de septembre 2026, toutes les entreprises doivent pouvoir recevoir des
              factures électroniques. Bativio est connecté à une plateforme agréée pour vous
              simplifier la mise en conformité.
            </p>
            <Link
              href="/inscription"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                padding: "16px 32px",
                background: "#C4531A",
                color: "#fff",
                borderRadius: 12,
                fontSize: 16,
                fontWeight: 600,
                textDecoration: "none",
                transition: "all .2s",
              }}
            >
              Activer la facturation
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,.3)", marginTop: 14 }}>
              Gratuit pour commencer &middot; Sans engagement
            </p>
          </div>
        </section>

        {/* Timeline */}
        <section style={{ padding: "72px 32px", maxWidth: 800, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div style={{ width: 40, height: 2, background: "#C4531A", margin: "0 auto 16px" }} />
            <h2
              style={{
                fontFamily: "'Fraunces',serif",
                fontSize: "clamp(24px,4vw,34px)",
                fontWeight: 700,
                color: "#1C1C1E",
              }}
            >
              Le calendrier de la réforme
            </h2>
            <p style={{ fontSize: 16, color: "#6B6560", marginTop: 8 }}>
              Les échéances à connaître pour votre entreprise.
            </p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 0, position: "relative" }}>
            {/* Vertical line */}
            <div
              style={{
                position: "absolute",
                left: 19,
                top: 0,
                bottom: 0,
                width: 2,
                background: "#E5E0DB",
              }}
            />
            {TIMELINE.map((t, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  gap: 24,
                  paddingBottom: i < TIMELINE.length - 1 ? 40 : 0,
                  position: "relative",
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    background: t.active ? "#C4531A" : "#fff",
                    border: t.active ? "none" : "2px solid #E5E0DB",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    position: "relative",
                    zIndex: 1,
                  }}
                >
                  <svg
                    width="16"
                    height="16"
                    fill="none"
                    stroke={t.active ? "#fff" : "#9B9590"}
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 6v6l4 2" />
                  </svg>
                </div>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      display: "inline-block",
                      background: t.active ? "rgba(196,83,26,.08)" : "rgba(0,0,0,.04)",
                      padding: "4px 12px",
                      borderRadius: 6,
                      fontSize: 13,
                      fontWeight: 700,
                      color: t.active ? "#C4531A" : "#6B6560",
                      marginBottom: 8,
                    }}
                  >
                    {t.date}
                  </div>
                  <h3 style={{ fontSize: 18, fontWeight: 700, color: "#1C1C1E", marginBottom: 6 }}>
                    {t.title}
                  </h3>
                  <p style={{ fontSize: 15, color: "#6B6560", lineHeight: 1.6 }}>{t.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* How it works — 3 steps */}
        <section style={{ padding: "72px 32px", background: "#fff" }}>
          <div style={{ maxWidth: 900, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 48 }}>
              <div style={{ width: 40, height: 2, background: "#C4531A", margin: "0 auto 16px" }} />
              <h2
                style={{
                  fontFamily: "'Fraunces',serif",
                  fontSize: "clamp(24px,4vw,34px)",
                  fontWeight: 700,
                  color: "#1C1C1E",
                }}
              >
                Comment ça marche ?
              </h2>
              <p style={{ fontSize: 16, color: "#6B6560", marginTop: 8 }}>
                Trois étapes pour être en conformité.
              </p>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 28,
              }}
              className="max-md:grid-cols-1"
            >
              {STEPS.map((s) => (
                <div
                  key={s.num}
                  style={{
                    background: "#FAF8F5",
                    borderRadius: 16,
                    padding: "32px 28px",
                    textAlign: "center",
                    border: "1px solid #E5E0DB",
                  }}
                >
                  <div
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: "50%",
                      background: "rgba(196,83,26,.08)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 16px",
                    }}
                  >
                    {s.icon}
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: "#C4531A",
                      textTransform: "uppercase",
                      letterSpacing: 1,
                      marginBottom: 8,
                    }}
                  >
                    Étape {s.num}
                  </div>
                  <h3 style={{ fontSize: 18, fontWeight: 700, color: "#1C1C1E", marginBottom: 8 }}>
                    {s.title}
                  </h3>
                  <p style={{ fontSize: 15, color: "#6B6560", lineHeight: 1.6 }}>{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section style={{ padding: "72px 32px" }}>
          <div style={{ maxWidth: 900, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 48 }}>
              <div style={{ width: 40, height: 2, background: "#C4531A", margin: "0 auto 16px" }} />
              <h2
                style={{
                  fontFamily: "'Fraunces',serif",
                  fontSize: "clamp(24px,4vw,34px)",
                  fontWeight: 700,
                  color: "#1C1C1E",
                }}
              >
                Pourquoi choisir Bativio ?
              </h2>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: 24,
              }}
              className="max-md:grid-cols-1"
            >
              {FEATURES.map((f) => (
                <div
                  key={f.title}
                  style={{
                    background: "#fff",
                    borderRadius: 16,
                    padding: "28px 24px",
                    border: "1px solid #E5E0DB",
                    display: "flex",
                    gap: 16,
                    alignItems: "flex-start",
                  }}
                >
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 12,
                      background: "rgba(196,83,26,.08)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    {f.icon}
                  </div>
                  <div>
                    <h3 style={{ fontSize: 17, fontWeight: 700, color: "#1C1C1E", marginBottom: 6 }}>
                      {f.title}
                    </h3>
                    <p style={{ fontSize: 15, color: "#6B6560", lineHeight: 1.6 }}>{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section style={{ padding: "72px 32px", background: "#fff" }}>
          <div style={{ maxWidth: 700, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 40 }}>
              <div style={{ width: 40, height: 2, background: "#C4531A", margin: "0 auto 16px" }} />
              <h2
                style={{
                  fontFamily: "'Fraunces',serif",
                  fontSize: "clamp(24px,4vw,34px)",
                  fontWeight: 700,
                  color: "#1C1C1E",
                }}
              >
                Questions fréquentes
              </h2>
            </div>
            {FAQ.map((f, i) => (
              <div
                key={i}
                style={{
                  padding: "20px 0",
                  borderBottom: i < FAQ.length - 1 ? "1px solid #F0EDEA" : "none",
                }}
              >
                <h3 style={{ fontSize: 16, fontWeight: 600, color: "#1C1C1E", marginBottom: 8 }}>
                  {f.q}
                </h3>
                <p style={{ fontSize: 15, color: "#6B6560", lineHeight: 1.6 }}>{f.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA bottom */}
        <section
          style={{
            padding: "72px 32px",
            textAlign: "center",
            background: "#1C1C1E",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: -60,
              left: "50%",
              transform: "translateX(-50%)",
              width: 500,
              height: 500,
              borderRadius: "50%",
              background: "rgba(196,83,26,.05)",
            }}
          />
          <div style={{ position: "relative", zIndex: 1, maxWidth: 600, margin: "0 auto" }}>
            <h2
              style={{
                fontFamily: "'Fraunces',serif",
                fontSize: "clamp(24px,4vw,34px)",
                fontWeight: 700,
                color: "#fff",
                marginBottom: 12,
              }}
            >
              Prêt à vous mettre en conformité ?
            </h2>
            <p
              style={{
                fontSize: 16,
                color: "rgba(255,255,255,.5)",
                marginBottom: 28,
                lineHeight: 1.6,
              }}
            >
              Inscrivez-vous gratuitement et activez la facturation électronique en un clic.
              Bativio s'occupe du reste.
            </p>
            <Link
              href="/inscription"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                padding: "16px 32px",
                background: "#C4531A",
                color: "#fff",
                borderRadius: 12,
                fontSize: 16,
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              Créer mon compte gratuitement
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,.3)", marginTop: 14 }}>
              Sans engagement &middot; Zéro commission
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
