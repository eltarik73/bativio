import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { safeJsonLd } from "@/lib/html-escape";

export const metadata: Metadata = {
  title: "Urgence artisan 24/7 — Plombier, électricien, serrurier",
  description:
    "Besoin d'un artisan en urgence en Rhône-Alpes ? Fuite d'eau, panne électrique, porte claquée, chaudière HS : appelez directement un artisan vérifié disponible 24/7.",
  alternates: { canonical: "https://www.bativio.fr/urgence" },
  openGraph: {
    title: "Urgence artisan 24/7 en Rhône-Alpes",
    description: "Fuite, électricité, serrurerie : intervention rapide.",
    url: "https://www.bativio.fr/urgence",
  },
};

const URGENCES = [
  {
    metier: "Plombier",
    slug: "plombier",
    emoji: "💧",
    cases: ["Fuite d'eau", "Chauffe-eau en panne", "WC bouché urgent", "Dégât des eaux", "Rupture canalisation"],
    delai: "< 1h la plupart du temps",
  },
  {
    metier: "Électricien",
    slug: "electricien",
    emoji: "⚡",
    cases: ["Disjoncteur qui saute", "Panne de courant générale", "Prise qui fume", "Tableau électrique HS", "Court-circuit"],
    delai: "< 2h en soirée / week-end",
  },
  {
    metier: "Serrurier",
    slug: "serrurier",
    emoji: "🔑",
    cases: ["Porte claquée", "Clé perdue", "Serrure cassée", "Effraction : remplacement en urgence"],
    delai: "< 30 min en centre-ville",
  },
  {
    metier: "Chauffagiste",
    slug: "chauffagiste",
    emoji: "🔥",
    cases: ["Chaudière en panne", "Pas d'eau chaude", "Pompe à chaleur HS", "Fuite gaz (sécurité : coupez + appelez pompiers)"],
    delai: "< 3h en hiver",
  },
  {
    metier: "Couvreur",
    slug: "couvreur",
    emoji: "🏠",
    cases: ["Fuite toiture post-tempête", "Tuile arrachée", "Gouttière effondrée", "Bâche d'urgence"],
    delai: "Selon météo, bâchage immédiat",
  },
];

const VILLES = [
  { slug: "chambery", nom: "Chambéry" },
  { slug: "annecy", nom: "Annecy" },
  { slug: "grenoble", nom: "Grenoble" },
  { slug: "lyon", nom: "Lyon" },
  { slug: "valence", nom: "Valence" },
];

export default function UrgencePage() {
  const emergencyJsonLd = {
    "@context": "https://schema.org",
    "@type": "EmergencyService",
    name: "Bativio Urgence artisan",
    description: "Mise en relation 24/7 avec artisans vérifiés Rhône-Alpes pour interventions urgentes",
    areaServed: [
      { "@type": "City", name: "Chambéry" },
      { "@type": "City", name: "Annecy" },
      { "@type": "City", name: "Grenoble" },
      { "@type": "City", name: "Lyon" },
      { "@type": "City", name: "Valence" },
    ],
    availableChannel: {
      "@type": "ServiceChannel",
      serviceUrl: "https://www.bativio.fr/urgence",
      servicePhone: "+33479000000",
      availableLanguage: "fr",
    },
  };

  return (
    <>
      <Navbar />
      <main style={{ background: "var(--creme,#FAF8F5)", paddingBottom: 80 }}>
        <section
          style={{
            background: "linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)",
            padding: "64px 24px 56px",
            color: "#fff",
            textAlign: "center",
          }}
        >
          <div style={{ maxWidth: 720, margin: "0 auto" }}>
            <p style={{ fontSize: 12, letterSpacing: 3, color: "rgba(255,255,255,.85)", textTransform: "uppercase", marginBottom: 14, fontWeight: 700 }}>
              Urgence artisan · 24/7
            </p>
            <h1 style={{ fontFamily: "'Fraunces',serif", fontSize: "clamp(32px,5vw,52px)", fontWeight: 700, lineHeight: 1.1, marginBottom: 20 }}>
              Un artisan en urgence, <span className="calli" style={{ color: "#fef3c7" }}>en moins d&apos;1h</span>
            </h1>
            <p style={{ fontSize: 17, lineHeight: 1.55, color: "rgba(255,255,255,.9)", marginBottom: 28, maxWidth: 580, margin: "0 auto 28px" }}>
              Fuite d&apos;eau, panne électrique, porte claquée, chaudière HS. Les artisans Bativio Rhône-Alpes interviennent 7j/7 24h/24 dans 5 villes.
            </p>
            <a
              href="tel:+33479000000"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 12,
                padding: "18px 36px",
                background: "#fff",
                color: "#b91c1c",
                borderRadius: 99,
                fontSize: 18,
                fontWeight: 700,
                textDecoration: "none",
                boxShadow: "0 10px 40px rgba(0,0,0,.2)",
              }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              04 79 00 00 00
            </a>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,.75)", marginTop: 14 }}>
              Appel gratuit · Mise en relation immédiate
            </p>
          </div>
        </section>

        <section style={{ maxWidth: 1100, margin: "0 auto", padding: "56px 24px" }}>
          <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: "clamp(26px,3.5vw,34px)", fontWeight: 600, color: "var(--anthracite,#1C1C1E)", marginBottom: 12, textAlign: "center" }}>
            Quelle urgence avez-vous ?
          </h2>
          <p style={{ textAlign: "center", fontSize: 15, color: "var(--bois-mid,#5C4A3A)", marginBottom: 40, maxWidth: 620, margin: "0 auto 40px" }}>
            Cliquez sur le métier concerné pour voir les artisans d&apos;urgence disponibles dans votre ville.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 20 }}>
            {URGENCES.map((u) => (
              <div key={u.slug} style={{ background: "#fff", border: "1px solid var(--sable,#E8D5C0)", borderRadius: 14, padding: "24px 22px" }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>{u.emoji}</div>
                <h3 style={{ fontFamily: "'Fraunces',serif", fontSize: 22, fontWeight: 600, color: "var(--anthracite,#1C1C1E)", marginBottom: 6 }}>
                  {u.metier}
                </h3>
                <p style={{ fontSize: 12, color: "var(--terre,#C4531A)", fontWeight: 600, textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>
                  {u.delai}
                </p>
                <ul style={{ listStyle: "none", padding: 0, margin: "0 0 16px 0" }}>
                  {u.cases.map((c, i) => (
                    <li key={i} style={{ fontSize: 13, color: "var(--bois-mid,#5C4A3A)", lineHeight: 1.5, paddingLeft: 14, position: "relative", marginBottom: 4 }}>
                      <span style={{ position: "absolute", left: 0, color: "var(--terre,#C4531A)" }}>·</span>
                      {c}
                    </li>
                  ))}
                </ul>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {VILLES.map((v) => (
                    <Link
                      key={v.slug}
                      href={`/${v.slug}/${u.slug}`}
                      style={{ fontSize: 11, padding: "4px 10px", background: "var(--creme,#FAF8F5)", color: "var(--bois-mid,#5C4A3A)", borderRadius: 99, textDecoration: "none", border: "1px solid var(--sable,#E8D5C0)" }}
                    >
                      {v.nom}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section style={{ background: "#fff", borderTop: "1px solid var(--sable,#E8D5C0)", padding: "48px 24px" }}>
          <div style={{ maxWidth: 760, margin: "0 auto" }}>
            <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 24, fontWeight: 600, color: "var(--anthracite,#1C1C1E)", marginBottom: 18 }}>
              Avant d&apos;appeler : les réflexes à avoir
            </h2>
            <div style={{ display: "grid", gap: 16 }}>
              <div>
                <h3 style={{ fontSize: 15, fontWeight: 600, color: "var(--bois,#3D2E1F)", marginBottom: 4 }}>💧 Fuite d&apos;eau</h3>
                <p style={{ fontSize: 14, lineHeight: 1.55, color: "var(--bois-mid,#5C4A3A)" }}>
                  Coupez l&apos;arrivée d&apos;eau générale (compteur ou vanne d&apos;arrêt). Photographiez les dégâts pour votre assurance habitation. Si l&apos;eau atteint l&apos;installation électrique, coupez aussi le disjoncteur général.
                </p>
              </div>
              <div>
                <h3 style={{ fontSize: 15, fontWeight: 600, color: "var(--bois,#3D2E1F)", marginBottom: 4 }}>⚡ Panne électrique</h3>
                <p style={{ fontSize: 14, lineHeight: 1.55, color: "var(--bois-mid,#5C4A3A)" }}>
                  Vérifiez d&apos;abord que ce n&apos;est pas une coupure réseau (Enedis) en consultant le site d&apos;Enedis ou en appelant vos voisins. Sinon coupez le disjoncteur général et ne touchez pas au tableau si vous n&apos;êtes pas formé.
                </p>
              </div>
              <div>
                <h3 style={{ fontSize: 15, fontWeight: 600, color: "var(--bois,#3D2E1F)", marginBottom: 4 }}>🔑 Porte claquée</h3>
                <p style={{ fontSize: 14, lineHeight: 1.55, color: "var(--bois-mid,#5C4A3A)" }}>
                  Vérifiez d&apos;abord si un double de clé est chez un voisin, un proche ou au travail. Évitez les &ldquo;serruriers 24/7&rdquo; sans fiche Bativio qui pratiquent des tarifs abusifs (plusieurs centaines d&apos;euros pour 5 min de travail).
                </p>
              </div>
              <div>
                <h3 style={{ fontSize: 15, fontWeight: 600, color: "var(--bois,#3D2E1F)", marginBottom: 4 }}>🔥 Fuite de gaz</h3>
                <p style={{ fontSize: 14, lineHeight: 1.55, color: "#b91c1c", fontWeight: 500 }}>
                  Coupez immédiatement l&apos;arrivée de gaz, aérez les pièces, sortez du logement et appelez le <strong>18 (pompiers)</strong> ou le <strong>0 800 47 33 33 (GRDF)</strong>. Pas de flamme, pas d&apos;interrupteur électrique, pas de téléphone dans le logement.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section style={{ maxWidth: 720, margin: "0 auto", padding: "48px 24px", textAlign: "center" }}>
          <div style={{ background: "var(--anthracite,#1C1C1E)", borderRadius: 18, padding: "32px 28px", color: "#fff" }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,.55)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>
              Pas une urgence ?
            </p>
            <p style={{ fontSize: 17, fontFamily: "'Fraunces',serif", fontStyle: "italic", marginBottom: 18 }}>
              Pour des travaux programmés, utilisez l&apos;annuaire classique ou l&apos;estimation IA.
            </p>
            <div style={{ display: "inline-flex", gap: 10, flexWrap: "wrap", justifyContent: "center" }}>
              <Link href="/" style={{ padding: "12px 22px", background: "var(--terre,#C4531A)", color: "#fff", borderRadius: 99, fontSize: 14, fontWeight: 600, textDecoration: "none" }}>
                Annuaire artisans
              </Link>
              <Link href="/demande" style={{ padding: "12px 22px", background: "transparent", color: "#fff", borderRadius: 99, fontSize: 14, fontWeight: 600, textDecoration: "none", border: "1px solid rgba(255,255,255,.2)" }}>
                Estimation IA (2 min)
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(emergencyJsonLd) }} />
    </>
  );
}
