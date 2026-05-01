import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { safeJsonLd } from "@/lib/html-escape";

export const metadata: Metadata = {
  title: "Contact — Bativio équipe Chambéry",
  description:
    "Contactez l'équipe Bativio basée à Chambéry. Questions particuliers, support artisans, partenariats : téléphone 04 79 00 00 00 ou email contact@bativio.fr.",
  alternates: { canonical: "https://www.bativio.fr/contact" },
  openGraph: {
    title: "Contact Bativio",
    description: "Équipe Chambéry · Support artisans + particuliers.",
    url: "https://www.bativio.fr/contact",
  },
};

// Schema ContactPage avec ContactPoint multiples (téléphone, email,
// support technique, presse, RGPD). Permet à Google d'afficher les
// coordonnées dans le knowledge panel.
const contactJsonLd = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name: "Contact Bativio",
  description: "Coordonnées de l'équipe Bativio basée à Chambéry — support artisans, particuliers, presse, RGPD.",
  url: "https://www.bativio.fr/contact",
  inLanguage: "fr-FR",
  isPartOf: { "@type": "WebSite", name: "Bativio", url: "https://www.bativio.fr" },
  mainEntity: {
    "@type": "Organization",
    name: "Bativio",
    url: "https://www.bativio.fr",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Chambéry",
      addressRegion: "Savoie",
      postalCode: "73000",
      addressCountry: "FR",
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: "+33-4-79-00-00-00",
        contactType: "customer service",
        areaServed: "FR",
        availableLanguage: "fr-FR",
        email: "contact@bativio.fr",
        hoursAvailable: {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          opens: "09:00",
          closes: "18:00",
        },
      },
      {
        "@type": "ContactPoint",
        contactType: "technical support",
        email: "contact@bativio.fr",
        areaServed: "FR",
        availableLanguage: "fr-FR",
      },
      {
        "@type": "ContactPoint",
        contactType: "press",
        email: "contact@bativio.fr",
        areaServed: "FR",
        availableLanguage: "fr-FR",
      },
      {
        "@type": "ContactPoint",
        contactType: "data protection officer",
        email: "contact@bativio.fr",
        areaServed: "FR",
        availableLanguage: "fr-FR",
      },
    ],
  },
};

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main style={{ background: "var(--creme,#FAF8F5)", paddingBottom: 80 }}>
        <section style={{ background: "var(--bois,#3D2E1F)", padding: "56px 24px 48px", color: "#fff", textAlign: "center" }}>
          <div style={{ maxWidth: 720, margin: "0 auto" }}>
            <p style={{ fontSize: 12, letterSpacing: 2, color: "var(--argile,#D4956B)", textTransform: "uppercase", marginBottom: 14, fontWeight: 600 }}>Contact</p>
            <h1 style={{ fontFamily: "'Fraunces',serif", fontSize: "clamp(30px,4.5vw,44px)", fontWeight: 700, lineHeight: 1.15, marginBottom: 16 }}>
              On vous écoute
            </h1>
            <p style={{ fontSize: 16, lineHeight: 1.55, color: "rgba(255,255,255,.8)", maxWidth: 520, margin: "0 auto" }}>
              Équipe basée à Chambéry. Réponse sous 24h ouvrées. Sans bot, sans formulaire interminable.
            </p>
          </div>
        </section>

        <section style={{ maxWidth: 980, margin: "0 auto", padding: "48px 24px", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 20 }}>
          <div style={{ background: "#fff", border: "1px solid var(--sable,#E8D5C0)", borderRadius: 14, padding: "28px 26px" }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(196,83,26,.1)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#C4531A" strokeWidth="2" strokeLinecap="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
            </div>
            <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 20, fontWeight: 600, marginBottom: 6, color: "var(--anthracite,#1C1C1E)" }}>
              Par téléphone
            </h2>
            <p style={{ fontSize: 14, color: "var(--bois-mid,#5C4A3A)", lineHeight: 1.5, marginBottom: 14 }}>
              Lun-Ven 9h-18h. Pour support artisan ou aide au choix d&apos;un abonnement.
            </p>
            <a href="tel:+33479000000" style={{ fontSize: 15, fontWeight: 600, color: "var(--terre,#C4531A)", textDecoration: "none" }}>
              04 79 00 00 00 →
            </a>
          </div>

          <div style={{ background: "#fff", border: "1px solid var(--sable,#E8D5C0)", borderRadius: 14, padding: "28px 26px" }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(74,103,65,.1)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#4A6741" strokeWidth="2" strokeLinecap="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            </div>
            <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 20, fontWeight: 600, marginBottom: 6, color: "var(--anthracite,#1C1C1E)" }}>
              Par email
            </h2>
            <p style={{ fontSize: 14, color: "var(--bois-mid,#5C4A3A)", lineHeight: 1.5, marginBottom: 14 }}>
              Pour toute question technique, partenariat, presse, ou demande RGPD.
            </p>
            <a href="mailto:contact@bativio.fr" style={{ fontSize: 15, fontWeight: 600, color: "var(--terre,#C4531A)", textDecoration: "none" }}>
              contact@bativio.fr →
            </a>
          </div>

          <div style={{ background: "#fff", border: "1px solid var(--sable,#E8D5C0)", borderRadius: 14, padding: "28px 26px" }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(28,28,30,.06)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1C1C1E" strokeWidth="2" strokeLinecap="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            </div>
            <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 20, fontWeight: 600, marginBottom: 6, color: "var(--anthracite,#1C1C1E)" }}>
              Adresse
            </h2>
            <p style={{ fontSize: 14, color: "var(--bois-mid,#5C4A3A)", lineHeight: 1.55 }}>
              Bativio<br />
              Chambéry (73000)<br />
              Savoie · Rhône-Alpes
            </p>
          </div>
        </section>

        <section style={{ maxWidth: 720, margin: "0 auto", padding: "24px 24px 48px" }}>
          <div style={{ background: "#fff", border: "1px solid var(--sable,#E8D5C0)", borderRadius: 14, padding: "28px 28px" }}>
            <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 22, fontWeight: 600, marginBottom: 16, color: "var(--anthracite,#1C1C1E)" }}>
              Quel type de demande ?
            </h2>
            <div style={{ display: "grid", gap: 14 }}>
              <div>
                <p style={{ fontSize: 14, fontWeight: 600, color: "var(--bois,#3D2E1F)", marginBottom: 4 }}>
                  Vous êtes particulier et cherchez un artisan
                </p>
                <p style={{ fontSize: 14, color: "var(--bois-mid,#5C4A3A)", lineHeight: 1.5 }}>
                  → <Link href="/" style={{ color: "var(--terre,#C4531A)", fontWeight: 500 }}>Consultez l&apos;annuaire</Link> ou <Link href="/demande" style={{ color: "var(--terre,#C4531A)", fontWeight: 500 }}>faites une estimation IA en 2 min</Link>.
                </p>
              </div>
              <div>
                <p style={{ fontSize: 14, fontWeight: 600, color: "var(--bois,#3D2E1F)", marginBottom: 4 }}>
                  Urgence immédiate (fuite, panne, porte claquée)
                </p>
                <p style={{ fontSize: 14, color: "var(--bois-mid,#5C4A3A)", lineHeight: 1.5 }}>
                  → <Link href="/urgence" style={{ color: "#dc2626", fontWeight: 500 }}>Page Urgence 24/7</Link> avec numéro direct par métier.
                </p>
              </div>
              <div>
                <p style={{ fontSize: 14, fontWeight: 600, color: "var(--bois,#3D2E1F)", marginBottom: 4 }}>
                  Vous êtes artisan BTP et souhaitez vous inscrire
                </p>
                <p style={{ fontSize: 14, color: "var(--bois-mid,#5C4A3A)", lineHeight: 1.5 }}>
                  → <Link href="/inscription" style={{ color: "var(--terre,#C4531A)", fontWeight: 500 }}>Inscription en 3 minutes</Link> (gratuit, sans CB). Questions ? Appelez-nous.
                </p>
              </div>
              <div>
                <p style={{ fontSize: 14, fontWeight: 600, color: "var(--bois,#3D2E1F)", marginBottom: 4 }}>
                  Problème avec un artisan ou un devis
                </p>
                <p style={{ fontSize: 14, color: "var(--bois-mid,#5C4A3A)", lineHeight: 1.5 }}>
                  → Email à contact@bativio.fr avec le nom de l&apos;artisan et le détail du litige. Nous enquêtons sous 48h.
                </p>
              </div>
              <div>
                <p style={{ fontSize: 14, fontWeight: 600, color: "var(--bois,#3D2E1F)", marginBottom: 4 }}>
                  Presse, partenariat, presse
                </p>
                <p style={{ fontSize: 14, color: "var(--bois-mid,#5C4A3A)", lineHeight: 1.5 }}>
                  → Email à contact@bativio.fr avec objet &laquo; Presse &raquo; ou &laquo; Partenariat &raquo;.
                </p>
              </div>
              <div>
                <p style={{ fontSize: 14, fontWeight: 600, color: "var(--bois,#3D2E1F)", marginBottom: 4 }}>
                  Demande RGPD (accès, rectification, suppression)
                </p>
                <p style={{ fontSize: 14, color: "var(--bois-mid,#5C4A3A)", lineHeight: 1.5 }}>
                  → Email à contact@bativio.fr avec &laquo; RGPD &raquo; en objet. Réponse sous 30 jours conformément au règlement UE 2016/679.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(contactJsonLd) }}
      />
    </>
  );
}
