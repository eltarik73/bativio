/**
 * Hub region `/artisans-rhone-alpes` — racine du cluster geographique SEO.
 *
 * Liste tous les departements (couverts + a venir) avec compte d'artisans.
 * Maillage descendant vers /artisans-{departement} et /artisans-{ville}.
 *
 * Cible SEO : "artisans Rhone-Alpes", "artisans batiment Rhone-Alpes",
 * "annuaire artisans region".
 */
import { Metadata } from "next";
import Link from "next/link";
import {
  DEPARTEMENTS_COUVERTS,
  DEPARTEMENTS_BIENTOT,
  getVillesByDepartementSlug,
} from "@/lib/seo/cities-graph";
import { ALL_VILLES } from "@/lib/constants";
import { prisma } from "@/lib/prisma";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { safeJsonLd } from "@/lib/html-escape";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Artisans en Rhône-Alpes — Annuaire des professionnels du bâtiment",
  description: "Trouvez votre artisan certifié en Rhône-Alpes : Savoie, Haute-Savoie, Isère, Rhône, Drôme. Plombiers, électriciens, peintres, maçons. Devis gratuit, zéro commission.",
  keywords: "artisans Rhone-Alpes, artisan batiment Rhone-Alpes, plombier Rhone-Alpes, electricien Rhone-Alpes, annuaire artisans region",
  alternates: { canonical: "https://www.bativio.fr/artisans-rhone-alpes" },
  openGraph: {
    title: "Artisans en Rhône-Alpes | Bativio",
    description: "Annuaire des artisans certifiés du bâtiment en Rhône-Alpes. 5 départements couverts, profils vérifiés, devis gratuit.",
    url: "https://www.bativio.fr/artisans-rhone-alpes",
    type: "website",
    locale: "fr_FR",
    images: [{ url: "https://www.bativio.fr/og-image.png", width: 1200, height: 630, alt: "Artisans en Rhône-Alpes" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Artisans en Rhône-Alpes | Bativio",
    description: "Annuaire des artisans certifiés du bâtiment en Rhône-Alpes. Devis gratuit.",
  },
};

export default async function HubRegionPage() {
  // Compte artisans par departement
  const deptCounts: Record<string, number> = {};
  let totalRegion = 0;
  try {
    for (const d of DEPARTEMENTS_COUVERTS) {
      const villesSlugs = getVillesByDepartementSlug(d.slug).map((v) => v.slug);
      const c = await prisma.artisan.count({
        where: { actif: true, deletedAt: null, villeSlug: { in: villesSlugs } },
      });
      deptCounts[d.slug] = c;
      totalRegion += c;
    }
  } catch { /* ignore */ }

  return (
    <>
      <Navbar />
      <main style={{ background: "#FAF8F5", minHeight: "100dvh" }}>
        {/* Hero */}
        <section style={{ background: "#3D2E1F", padding: "48px 32px 40px", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: -120, right: -80, width: 400, height: 400, borderRadius: "50%", background: "rgba(196,83,26,.06)" }} />
          <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative", zIndex: 1 }}>
            <nav aria-label="Fil d'Ariane" style={{ fontSize: 13, color: "rgba(255,255,255,.6)", marginBottom: 16 }}>
              <Link href="/" style={{ color: "inherit", textDecoration: "none" }}>Accueil</Link>
              <span style={{ margin: "0 8px" }}>›</span>
              <span style={{ color: "rgba(255,255,255,.85)" }}>Artisans Rh&ocirc;ne-Alpes</span>
            </nav>
            <h1 style={{ fontFamily: "'Fraunces',serif", fontSize: "clamp(28px,4vw,42px)", fontWeight: 700, color: "#fff", lineHeight: 1.15, marginBottom: 12 }}>
              Artisans du b&acirc;timent en Rh&ocirc;ne-Alpes
            </h1>
            <p style={{ fontSize: 16, color: "rgba(255,255,255,.7)", maxWidth: 720 }}>
              Annuaire complet des artisans certifi&eacute;s sur la r&eacute;gion Rh&ocirc;ne-Alpes.
              {totalRegion > 0 ? ` ${totalRegion} professionnel${totalRegion > 1 ? "s" : ""} v&eacute;rifi&eacute;${totalRegion > 1 ? "s" : ""}.` : ""}
              {" "}Couverture des d&eacute;partements 73, 74, 38, 69, 26.
              Devis gratuits, profils v&eacute;rifi&eacute;s (SIRET, assurance d&eacute;cennale, RGE).
              Z&eacute;ro commission.
            </p>
          </div>
        </section>

        {/* Departements couverts */}
        <section style={{ padding: "48px 32px" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 22, fontWeight: 700, color: "#1C1C1E", marginBottom: 6 }}>
              D&eacute;partements couverts
            </h2>
            <p style={{ fontSize: 14, color: "#6B6560", marginBottom: 24 }}>
              5 d&eacute;partements de Rh&ocirc;ne-Alpes avec annuaire actif et villes principales list&eacute;es ci-dessous.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
              {DEPARTEMENTS_COUVERTS.map((d) => {
                const nb = deptCounts[d.slug] || 0;
                // 3 villes principales par departement (chef-lieu + 2 secondaires les plus peuplees)
                const villesDuDept = ALL_VILLES
                  .filter((v) => "codePostal" in v && (v.parentSlug === d.chefLieuSlug || v.slug === d.chefLieuSlug))
                  .slice(0, 4);
                return (
                  <Link key={d.slug} href={`/artisans-${d.slug}`} style={{ display: "block", padding: 20, background: "#fff", border: "1px solid #C4531A", borderRadius: 12, textDecoration: "none", color: "#1C1C1E" }}>
                    <div style={{ fontSize: 13, color: "#C4531A", fontWeight: 600, marginBottom: 6 }}>{d.code}</div>
                    <div style={{ fontFamily: "'Fraunces',serif", fontSize: 18, fontWeight: 700, marginBottom: 4 }}>{d.name}</div>
                    <div style={{ fontSize: 13, color: "#6B6560", marginBottom: 8 }}>Chef-lieu : {d.chefLieu}</div>
                    {villesDuDept.length > 1 && (
                      <div style={{ fontSize: 12, color: "#9C958D", marginBottom: 8 }}>
                        {villesDuDept.map((v) => v.nom).join(" · ")}
                      </div>
                    )}
                    <div style={{ fontSize: 13, color: "#6B6560" }}>
                      {nb} artisan{nb !== 1 ? "s" : ""} v&eacute;rifi&eacute;{nb !== 1 ? "s" : ""}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* Departements a venir */}
        <section style={{ background: "#fff", padding: "48px 32px", borderTop: "1px solid #E8D5C0" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 22, fontWeight: 700, color: "#1C1C1E", marginBottom: 6 }}>
              D&eacute;partements bient&ocirc;t disponibles
            </h2>
            <p style={{ fontSize: 14, color: "#6B6560", marginBottom: 24 }}>
              Ces d&eacute;partements seront couverts prochainement. Si vous &ecirc;tes artisan dans cette zone, inscrivez-vous d&eacute;s maintenant.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16 }}>
              {DEPARTEMENTS_BIENTOT.map((d) => (
                <div key={d.slug} style={{ padding: 20, background: "#FAF8F5", border: "1px dashed #E8D5C0", borderRadius: 12 }}>
                  <div style={{ fontSize: 13, color: "#6B6560", fontWeight: 600, marginBottom: 6 }}>{d.code}</div>
                  <div style={{ fontFamily: "'Fraunces',serif", fontSize: 18, fontWeight: 700, marginBottom: 8 }}>{d.name}</div>
                  <div style={{ fontSize: 12, color: "#9C958D", marginBottom: 12 }}>Bient&ocirc;t disponible</div>
                  <Link href="/inscription" style={{ display: "inline-block", padding: "8px 16px", background: "#C4531A", color: "#fff", fontSize: 13, fontWeight: 600, borderRadius: 8, textDecoration: "none" }}>
                    Je suis artisan, je m&apos;inscris
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Top metiers + villes principales */}
        <section style={{ padding: "48px 32px" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 22, fontWeight: 700, color: "#1C1C1E", marginBottom: 12 }}>
              M&eacute;tiers les plus demand&eacute;s en Rh&ocirc;ne-Alpes
            </h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 28 }}>
              {["plombier", "electricien", "peintre", "macon", "carreleur", "menuisier", "couvreur", "chauffagiste"].map((m) => (
                <Link key={m} href={`/chambery/${m}`} style={{ padding: "8px 16px", background: "#fff", border: "1px solid #E8D5C0", borderRadius: 99, fontSize: 13, color: "#3D2E1F", textDecoration: "none", fontWeight: 500 }}>
                  {m.charAt(0).toUpperCase() + m.slice(1)} en Rh&ocirc;ne-Alpes
                </Link>
              ))}
            </div>

            <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 22, fontWeight: 700, color: "#1C1C1E", marginBottom: 12 }}>
              Villes principales
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 8 }}>
              {ALL_VILLES.filter((v) => "codePostal" in v && v.parentSlug === v.slug).map((v) => (
                <Link key={v.slug} href={`/artisans-${v.slug}`} style={{ padding: "10px 14px", background: "#fff", border: "1px solid #E8D5C0", borderRadius: 8, fontSize: 14, color: "#3D2E1F", textDecoration: "none" }}>
                  Artisans &agrave; {v.nom}
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Accueil", item: "https://www.bativio.fr" },
          { "@type": "ListItem", position: 2, name: "Artisans Rhône-Alpes", item: "https://www.bativio.fr/artisans-rhone-alpes" },
        ],
      }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd({
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: "Artisans en Rhône-Alpes",
        url: "https://www.bativio.fr/artisans-rhone-alpes",
        about: { "@type": "Place", name: "Auvergne-Rhône-Alpes", addressCountry: "FR" },
      }) }} />
    </>
  );
}
