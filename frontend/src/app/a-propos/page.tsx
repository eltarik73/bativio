import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { safeJsonLd } from "@/lib/html-escape";

export const metadata: Metadata = {
  title: "À propos de Bativio — La plateforme artisans Rhône-Alpes",
  description:
    "Bativio connecte les particuliers de Rhône-Alpes avec des artisans du bâtiment vérifiés. Histoire, équipe, valeurs : zéro commission, transparence, qualité.",
  alternates: { canonical: "https://www.bativio.fr/a-propos" },
  openGraph: {
    title: "À propos de Bativio",
    description: "L'équipe et l'histoire derrière Bativio.",
    url: "https://www.bativio.fr/a-propos",
    images: [{ url: "https://www.bativio.fr/og-image.png", width: 1200, height: 630 }],
  },
};

export default function AProposPage() {
  return (
    <>
      <Navbar />
      <main style={{ background: "var(--creme, #FAF8F5)", paddingBottom: 80 }}>
        {/* Hero */}
        <section style={{ background: "var(--bois, #3D2E1F)", padding: "64px 32px 56px", color: "#fff", textAlign: "center" }}>
          <div style={{ maxWidth: 720, margin: "0 auto" }}>
            <p style={{ fontSize: 12, letterSpacing: 2, color: "var(--argile, #D4956B)", textTransform: "uppercase", marginBottom: 14, fontWeight: 600 }}>À propos</p>
            <h1 style={{ fontFamily: "'Fraunces',serif", fontSize: "clamp(32px,4.5vw,48px)", fontWeight: 700, lineHeight: 1.1, marginBottom: 18 }}>
              La plateforme qui rend{" "}
              <span style={{ fontStyle: "italic", color: "var(--argile, #D4956B)", fontWeight: 400 }}>visibles</span>
              <br />les artisans de Rh&ocirc;ne-Alpes.
            </h1>
            <p style={{ fontSize: 17, color: "rgba(255,255,255,.78)", lineHeight: 1.6, maxWidth: 560, margin: "0 auto" }}>
              Bativio connecte les particuliers et les artisans du b&acirc;timent dans une relation directe, sans interm&eacute;diaire ni commission cach&eacute;e.
            </p>
          </div>
        </section>

        {/* Histoire */}
        <section style={{ maxWidth: 760, margin: "56px auto 0", padding: "0 24px" }}>
          <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 28, color: "var(--bois)", marginBottom: 18, fontWeight: 700 }}>Notre histoire</h2>
          <div style={{ fontSize: 16, color: "var(--bois-mid, #6B6560)", lineHeight: 1.75, marginBottom: 32 }}>
            <p style={{ marginBottom: 18 }}>
              Bativio est n&eacute; d&apos;un constat simple en 2025&nbsp;: en Rh&ocirc;ne-Alpes, trouver un artisan fiable rel&egrave;ve souvent du parcours du combattant. Les annuaires existants prennent jusqu&apos;&agrave; 20&thinsp;% de commission sur les travaux, les artisans paient pour des leads non qualifi&eacute;s, et les particuliers attendent des semaines pour un devis.
            </p>
            <p style={{ marginBottom: 18 }}>
              Nous avons cr&eacute;&eacute; Bativio comme une plateforme &agrave; <strong>z&eacute;ro commission</strong>&nbsp;: l&apos;artisan re&ccedil;oit l&apos;int&eacute;gralit&eacute; du prix factur&eacute; au client. Notre mod&egrave;le repose uniquement sur un abonnement mensuel transparent (19&euro; &agrave; 59&euro;), proportionn&eacute; aux fonctionnalit&eacute;s utilis&eacute;es.
            </p>
            <p>
              Nous outillons l&apos;artisan avec une vitrine pro, une g&eacute;n&eacute;ration de devis assist&eacute;e par IA, un agenda, une facturation &eacute;lectronique conforme &agrave; l&apos;obligation septembre 2026, et un acc&egrave;s &agrave; des demandes clients qualifi&eacute;es.
            </p>
          </div>

          {/* Valeurs */}
          <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 28, color: "var(--bois)", marginBottom: 18, fontWeight: 700 }}>Nos valeurs</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginBottom: 40 }}>
            {[
              { titre: "Z\u00e9ro commission", desc: "Pas un centime pr\u00e9lev\u00e9 sur les travaux. Le prix devis = le prix pay\u00e9." },
              { titre: "Artisans v\u00e9rifi\u00e9s", desc: "SIRET valid\u00e9, assurance d\u00e9cennale et qualifications contr\u00f4l\u00e9es avant publication." },
              { titre: "Local Rh\u00f4ne-Alpes", desc: "5 villes couvertes, des artisans qui connaissent les sp\u00e9cificit\u00e9s du b\u00e2ti local." },
              { titre: "Transparence prix", desc: "Estimations IA fond\u00e9es sur 500 prestations BTP et tarifs march\u00e9 r\u00e9els." },
            ].map((v, i) => (
              <div key={i} style={{ background: "#fff", border: "1px solid #EDEBE7", borderRadius: 14, padding: 20 }}>
                <h3 style={{ fontFamily: "'Fraunces',serif", fontSize: 17, color: "var(--bois)", marginBottom: 8, fontWeight: 600 }}>{v.titre}</h3>
                <p style={{ fontSize: 14, color: "var(--bois-mid)", lineHeight: 1.55 }}>{v.desc}</p>
              </div>
            ))}
          </div>

          {/* Equipe / Fondateur */}
          <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 28, color: "var(--bois)", marginBottom: 18, fontWeight: 700 }}>L&apos;\u00e9quipe</h2>
          <div style={{ background: "#fff", border: "1px solid #EDEBE7", borderRadius: 14, padding: 24, display: "flex", gap: 20, alignItems: "flex-start", flexWrap: "wrap", marginBottom: 32 }}>
            <div style={{ width: 96, height: 96, borderRadius: "50%", background: "linear-gradient(135deg,#C4531A,#C9943A)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Fraunces',serif", fontSize: 32, fontWeight: 700, flexShrink: 0 }}>TB</div>
            <div style={{ flex: 1, minWidth: 200 }}>
              <h3 style={{ fontFamily: "'Fraunces',serif", fontSize: 20, color: "var(--bois)", marginBottom: 4, fontWeight: 600 }}>Tarik Bouzeggou</h3>
              <p style={{ fontSize: 14, color: "var(--terre)", marginBottom: 10, fontWeight: 600 }}>Fondateur &amp; CEO</p>
              <p style={{ fontSize: 14, color: "var(--bois-mid)", lineHeight: 1.6, marginBottom: 12 }}>
                Entrepreneur tech bas&eacute; &agrave; Chamb&eacute;ry. Apr&egrave;s plusieurs SaaS B2B, Tarik fonde Bativio en 2025 pour casser l&apos;opacit&eacute; du march&eacute; des travaux en Rh&ocirc;ne-Alpes. Sa conviction&nbsp;: l&apos;artisan local m&eacute;rite mieux que les leads payants &agrave; 50&euro;.
              </p>
              <a href="mailto:contact@bativio.fr" style={{ fontSize: 13, color: "var(--terre)", textDecoration: "none", borderBottom: "1px solid var(--terre)" }}>contact@bativio.fr</a>
            </div>
          </div>

          {/* Chiffres clés */}
          <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 28, color: "var(--bois)", marginBottom: 18, fontWeight: 700 }}>Chiffres cl&eacute;s</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px,1fr))", gap: 14, marginBottom: 40 }}>
            {[
              { num: "500+", label: "prestations BTP catalogue" },
              { num: "10", label: "m\u00e9tiers du b\u00e2timent" },
              { num: "5", label: "villes couvertes" },
              { num: "0\u2009%", label: "commission" },
            ].map((c, i) => (
              <div key={i} style={{ background: "var(--bois)", color: "#fff", borderRadius: 14, padding: 20, textAlign: "center" }}>
                <div style={{ fontFamily: "'Fraunces',serif", fontSize: 36, fontWeight: 700, color: "var(--argile, #D4956B)" }}>{c.num}</div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,.65)", marginTop: 4 }}>{c.label}</div>
              </div>
            ))}
          </div>

          <div style={{ background: "var(--bois)", color: "#fff", borderRadius: 14, padding: 28, textAlign: "center" }}>
            <h3 style={{ fontFamily: "'Fraunces',serif", fontSize: 22, marginBottom: 10, fontWeight: 600 }}>Une question, un partenariat&nbsp;?</h3>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,.7)", marginBottom: 18 }}>L&apos;\u00e9quipe r&eacute;pond sous 24h ouvr&eacute;es.</p>
            <Link href="mailto:contact@bativio.fr" style={{ display: "inline-block", background: "var(--terre)", color: "#fff", padding: "12px 26px", borderRadius: 10, textDecoration: "none", fontWeight: 600 }}>Nous contacter</Link>
          </div>
        </section>
      </main>
      <Footer />

      {/* JSON-LD Organization + Person founder + AboutPage */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: safeJsonLd([
            {
              "@context": "https://schema.org",
              "@type": "AboutPage",
              name: "À propos de Bativio",
              url: "https://www.bativio.fr/a-propos",
            },
            {
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Bativio",
              url: "https://www.bativio.fr",
              logo: "https://www.bativio.fr/og-image.png",
              foundingDate: "2025",
              founder: {
                "@type": "Person",
                name: "Tarik Bouzeggou",
                jobTitle: "Fondateur & CEO",
                email: "contact@bativio.fr",
              },
              areaServed: { "@type": "State", name: "Rhône-Alpes" },
              contactPoint: {
                "@type": "ContactPoint",
                email: "contact@bativio.fr",
                contactType: "customer support",
                areaServed: "FR",
                availableLanguage: "fr",
              },
            },
          ]),
        }}
      />
    </>
  );
}
