import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import UrgenceFab from "@/components/UrgenceFab";
import { safeJsonLd } from "@/lib/html-escape";
import type { PublishableZone } from "@/lib/zones";

const METIERS_PRIORITAIRES = [
  { slug: "plombier", nom: "Plombier", icone: "\u{1F527}" },
  { slug: "electricien", nom: "Électricien", icone: "⚡" },
  { slug: "peintre", nom: "Peintre", icone: "\u{1F3A8}" },
  { slug: "macon", nom: "Maçon", icone: "\u{1F9F1}" },
  { slug: "carreleur", nom: "Carreleur", icone: "\u{1F532}" },
  { slug: "menuisier", nom: "Menuisier", icone: "\u{1FA9A}" },
  { slug: "couvreur", nom: "Couvreur", icone: "\u{1F3E0}" },
  { slug: "chauffagiste", nom: "Chauffagiste", icone: "\u{1F525}" },
];

function typeLabel(type: PublishableZone["type"]): string {
  switch (type) {
    case "intramuros": return "Quartier";
    case "commune-deleguee": return "Commune déléguée";
    case "banlieue": return "Commune";
    case "agglo": return "Commune de l'agglomération";
    case "bassin": return "Commune du bassin";
  }
}

export default function ZoneHubContent({ zone }: { zone: PublishableZone }) {
  const baseUrl = "https://www.bativio.fr";
  const url = `${baseUrl}/${zone.slug}`;

  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section style={{ background: "var(--bois, #3D2E1F)", padding: "48px 32px 40px", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: -120, right: -80, width: 400, height: 400, borderRadius: "50%", background: "rgba(196,83,26,.06)" }} />
          <div style={{ maxWidth: 720, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}>
            <nav style={{ fontSize: 13, color: "rgba(255,255,255,.75)", marginBottom: 16 }}>
              <Link href="/" style={{ color: "rgba(255,255,255,.75)" }}>Accueil</Link>
              <span style={{ margin: "0 6px" }}>/</span>
              <Link href={`/${zone.villeMereSlug}`} style={{ color: "rgba(255,255,255,.75)" }}>{zone.villeMere}</Link>
              <span style={{ margin: "0 6px" }}>/</span>
              <span style={{ color: "rgba(255,255,255,.7)" }}>{zone.name}</span>
            </nav>
            <h1 style={{ fontFamily: "'Fraunces',serif", fontSize: "clamp(26px,4vw,38px)", fontWeight: 700, color: "#fff", lineHeight: 1.15, letterSpacing: -0.5, marginBottom: 12 }}>
              Artisans du b&acirc;timent &agrave; <span className="calli" style={{ color: "var(--argile, #D4956B)" }}>{zone.name}</span>
            </h1>
            <p style={{ fontSize: 15, color: "rgba(255,255,255,.75)", lineHeight: 1.6, marginBottom: 8 }}>
              {typeLabel(zone.type)} de {zone.villeMere} ({zone.codeDept} {zone.departement}) &middot; {zone.pop.toLocaleString("fr-FR")} habitants
            </p>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,.55)" }}>
              Trouvez un artisan qualifi&eacute; pr&egrave;s de chez vous. Devis gratuit, z&eacute;ro commission.
            </p>
          </div>
        </section>

        {/* Liste des métiers */}
        <section style={{ padding: "56px 24px", background: "var(--creme, #FAF8F5)" }}>
          <div style={{ maxWidth: 1000, margin: "0 auto" }}>
            <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: "clamp(22px,3vw,30px)", fontWeight: 700, color: "var(--anthracite, #1C1C1E)", marginBottom: 8, textAlign: "center" }}>
              Trouvez un artisan &agrave; {zone.name}
            </h2>
            <p style={{ fontSize: 14, color: "var(--anthracite-light, #6B6B6E)", marginBottom: 32, textAlign: "center" }}>
              S&eacute;lectionnez le m&eacute;tier dont vous avez besoin
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
              {METIERS_PRIORITAIRES.map((m) => (
                <Link
                  key={m.slug}
                  href={`/${zone.slug}/${m.slug}`}
                  className="bv-card"
                  style={{ display: "flex", alignItems: "center", gap: 14, padding: "18px 20px", background: "#fff", border: "1px solid var(--sable, #E8D5C0)", borderRadius: 12, textDecoration: "none", color: "var(--anthracite, #1C1C1E)", transition: "transform 200ms ease, box-shadow 200ms ease" }}
                >
                  <span style={{ fontSize: 28 }}>{m.icone}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 15 }}>{m.nom}</div>
                    <div style={{ fontSize: 12, color: "var(--anthracite-light, #6B6B6E)", marginTop: 2 }}>
                      {m.nom} &agrave; {zone.name}
                    </div>
                  </div>
                  <span style={{ fontSize: 18, color: "var(--terre, #C4531A)" }}>&rarr;</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Lien vers la ville mère */}
        <section style={{ padding: "40px 24px", borderTop: "1px solid var(--sable,#E8D5C0)", background: "#fff" }}>
          <div style={{ maxWidth: 720, margin: "0 auto", textAlign: "center" }}>
            <p style={{ fontSize: 14, color: "var(--anthracite-light, #6B6B6E)", marginBottom: 8 }}>
              {zone.name} fait partie du bassin de {zone.villeMere}.
            </p>
            <Link
              href={`/${zone.villeMereSlug}`}
              style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 18px", background: "var(--terre, #C4531A)", color: "#fff", textDecoration: "none", borderRadius: 8, fontSize: 14, fontWeight: 500 }}
            >
              Voir tous les artisans &agrave; {zone.villeMere} &rarr;
            </Link>
          </div>
        </section>
      </main>
      <Footer />
      <UrgenceFab />

      {/* JSON-LD ItemList métiers */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: safeJsonLd({
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: `Artisans du bâtiment à ${zone.name}`,
            itemListElement: METIERS_PRIORITAIRES.map((m, i) => ({
              "@type": "ListItem",
              position: i + 1,
              name: `${m.nom} à ${zone.name}`,
              url: `${baseUrl}/${zone.slug}/${m.slug}`,
            })),
          }),
        }}
      />
      {/* JSON-LD BreadcrumbList */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: safeJsonLd({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Accueil", item: `${baseUrl}/` },
              { "@type": "ListItem", position: 2, name: zone.villeMere, item: `${baseUrl}/${zone.villeMereSlug}` },
              { "@type": "ListItem", position: 3, name: zone.name, item: url },
            ],
          }),
        }}
      />
      {/* JSON-LD Place */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: safeJsonLd({
            "@context": "https://schema.org",
            "@type": "Place",
            name: zone.name,
            address: {
              "@type": "PostalAddress",
              addressLocality: zone.name,
              postalCode: zone.cp,
              addressRegion: zone.departement,
              addressCountry: "FR",
            },
            containedInPlace: {
              "@type": "AdministrativeArea",
              name: zone.villeMere,
            },
          }),
        }}
      />
    </>
  );
}
