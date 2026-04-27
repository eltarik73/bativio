/**
 * Hub geographique unifie `/artisans-{slug}`.
 *
 * Le slug peut etre :
 *  - une ville (hub ou secondaire) : ex /artisans-chambery, /artisans-aix-les-bains
 *  - un departement : ex /artisans-savoie, /artisans-haute-savoie
 *
 * Le routing detecte automatiquement le type (1 fichier, 2 layouts).
 *
 * Cible SEO : "artisans Chambery", "artisans Savoie", "artisans 73", etc.
 * (long tail geographique au-dela des pages /[ville] existantes).
 *
 * Cache : ISR 24h.
 */
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ALL_VILLES, METIERS } from "@/lib/constants";
import {
  getCityNeighbors,
  DEPARTEMENT_BY_SLUG,
  DEPARTEMENTS_COUVERTS,
  getVillesByDepartementSlug,
} from "@/lib/seo/cities-graph";
import { prisma } from "@/lib/prisma";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { safeJsonLd } from "@/lib/html-escape";

export const revalidate = 86400; // 24h ISR
export const dynamicParams = false;

const TOP_METIERS_SEO = ["plombier", "electricien", "peintre", "macon", "carreleur", "menuisier", "couvreur", "chauffagiste"];

export function generateStaticParams() {
  return [
    ...ALL_VILLES.map((v) => ({ slug: v.slug })),
    ...DEPARTEMENTS_COUVERTS.map((d) => ({ slug: d.slug })),
  ];
}

type SlugKind =
  | { kind: "ville"; ville: typeof ALL_VILLES[number] }
  | { kind: "departement"; dept: typeof DEPARTEMENTS_COUVERTS[number] }
  | { kind: "unknown" };

function detectSlugKind(slug: string): SlugKind {
  const ville = ALL_VILLES.find((v) => v.slug === slug);
  if (ville) return { kind: "ville", ville };
  const dept = DEPARTEMENTS_COUVERTS.find((d) => d.slug === slug);
  if (dept) return { kind: "departement", dept };
  return { kind: "unknown" };
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const k = detectSlugKind(slug);
  if (k.kind === "unknown") return { title: "Page introuvable" };

  if (k.kind === "ville") {
    const ville = k.ville;
    let nbArtisans = 0;
    try {
      nbArtisans = await prisma.artisan.count({ where: { actif: true, deletedAt: null, villeSlug: slug } });
    } catch { /* ignore */ }
    const cpPart = "codePostal" in ville ? ` (${ville.codePostal})` : "";
    const title = `Artisans à ${ville.nom}${cpPart} — Tous les métiers du bâtiment`;
    const description = nbArtisans > 0
      ? `${nbArtisans} artisan${nbArtisans > 1 ? "s" : ""} certifié${nbArtisans > 1 ? "s" : ""} à ${ville.nom} : plombier, électricien, peintre, maçon, chauffagiste. Devis gratuits, avis vérifiés, zéro commission.`
      : `Trouvez votre artisan certifié à ${ville.nom} (${ville.departement}) : plombier, électricien, peintre, maçon, chauffagiste. Devis gratuit en 24h, profils vérifiés, zéro commission.`;
    return {
      title,
      description,
      keywords: `artisans ${ville.nom}, plombier ${ville.nom}, electricien ${ville.nom}, peintre ${ville.nom}, macon ${ville.nom}, artisan ${ville.nom}, batiment ${ville.nom}`,
      alternates: { canonical: `https://www.bativio.fr/artisans-${slug}` },
      openGraph: {
        title: `Artisans à ${ville.nom} | Bativio`,
        description,
        url: `https://www.bativio.fr/artisans-${slug}`,
        type: "website",
        locale: "fr_FR",
        images: [{ url: "https://www.bativio.fr/og-image.png", width: 1200, height: 630, alt: `Artisans à ${ville.nom}` }],
      },
      twitter: { card: "summary_large_image", title: `Artisans ${ville.nom} | Bativio`, description },
    };
  }

  // departement
  const dept = k.dept;
  let total = 0;
  try {
    const villesSlugs = getVillesByDepartementSlug(dept.slug).map((v) => v.slug);
    total = await prisma.artisan.count({ where: { actif: true, deletedAt: null, villeSlug: { in: villesSlugs } } });
  } catch { /* ignore */ }
  const title = `Artisans en ${dept.name} (${dept.code}) — Annuaire du bâtiment`;
  const description = `Tous les artisans certifiés du bâtiment en ${dept.name} : plombier, électricien, peintre, maçon à ${dept.chefLieu} et toutes les communes du ${dept.code}. ${total > 0 ? `${total} professionnels vérifiés. ` : ""}Devis gratuit, zéro commission.`;
  return {
    title,
    description,
    keywords: `artisans ${dept.name}, artisans ${dept.code}, plombier ${dept.name}, electricien ${dept.name}, peintre ${dept.name}, batiment ${dept.code}`,
    alternates: { canonical: `https://www.bativio.fr/artisans-${dept.slug}` },
    openGraph: {
      title: `Artisans en ${dept.name} | Bativio`,
      description,
      url: `https://www.bativio.fr/artisans-${dept.slug}`,
      type: "website",
      locale: "fr_FR",
      images: [{ url: "https://www.bativio.fr/og-image.png", width: 1200, height: 630, alt: `Artisans en ${dept.name}` }],
    },
    twitter: { card: "summary_large_image", title: `Artisans ${dept.name} | Bativio`, description },
  };
}

interface ArtisanLite {
  id: string; slug: string; nomAffichage: string; metierNom: string | null; metierSlug: string | null;
  noteMoyenne: number; nombreAvis: number; experienceAnnees: number | null;
}

async function fetchArtisansByMetier(villeSlug: string): Promise<Map<string, ArtisanLite[]>> {
  try {
    const artisans = await prisma.artisan.findMany({
      where: { actif: true, visible: true, deletedAt: null, villeSlug },
      select: {
        id: true, slug: true, nomAffichage: true, noteMoyenne: true, nombreAvis: true, experienceAnnees: true,
        metier: { select: { nom: true, slug: true } },
      },
      take: 200,
    });
    const map = new Map<string, ArtisanLite[]>();
    for (const a of artisans) {
      const ms = a.metier?.slug || "autre";
      if (!map.has(ms)) map.set(ms, []);
      map.get(ms)!.push({
        id: a.id, slug: a.slug, nomAffichage: a.nomAffichage,
        metierNom: a.metier?.nom || null, metierSlug: ms,
        noteMoyenne: a.noteMoyenne, nombreAvis: a.nombreAvis, experienceAnnees: a.experienceAnnees,
      });
    }
    return map;
  } catch { return new Map(); }
}

export default async function HubGeoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const k = detectSlugKind(slug);
  if (k.kind === "unknown") notFound();

  // ============================== HUB VILLE ==============================
  if (k.kind === "ville") {
    const ville = k.ville;
    const isHub = "codePostal" in ville && ville.parentSlug === ville.slug;
    const cp = "codePostal" in ville ? ville.codePostal : "";

    const artisansByMetier = await fetchArtisansByMetier(slug);
    const totalArtisans = [...artisansByMetier.values()].reduce((s, arr) => s + arr.length, 0);

    const metiersOrdered: { slug: string; nom: string; artisans: ArtisanLite[] }[] = [];
    const seen = new Set(artisansByMetier.keys());
    for (const ms of TOP_METIERS_SEO) {
      const m = METIERS.find((x) => x.slug === ms);
      if (!m) continue;
      metiersOrdered.push({ slug: ms, nom: m.nom, artisans: artisansByMetier.get(ms) || [] });
      seen.delete(ms);
    }
    for (const ms of [...seen]) {
      const m = METIERS.find((x) => x.slug === ms);
      if (m) metiersOrdered.push({ slug: ms, nom: m.nom, artisans: artisansByMetier.get(ms) || [] });
    }

    const voisines = getCityNeighbors(slug, 6).map((vs) => ALL_VILLES.find((v) => v.slug === vs)!).filter(Boolean);
    const dept = DEPARTEMENT_BY_SLUG[slug];

    return (
      <>
        <Navbar />
        <main style={{ background: "#FAF8F5", minHeight: "100dvh" }}>
          <section style={{ background: "#3D2E1F", padding: "48px 32px 40px" }}>
            <div style={{ maxWidth: 1100, margin: "0 auto" }}>
              <nav aria-label="Fil d'Ariane" style={{ fontSize: 13, color: "rgba(255,255,255,.6)", marginBottom: 16 }}>
                <Link href="/" style={{ color: "inherit", textDecoration: "none" }}>Accueil</Link>
                <span style={{ margin: "0 8px" }}>›</span>
                <Link href="/artisans-rhone-alpes" style={{ color: "inherit", textDecoration: "none" }}>Artisans Rhône-Alpes</Link>
                {dept && (<>
                  <span style={{ margin: "0 8px" }}>›</span>
                  <Link href={`/artisans-${dept.slug}`} style={{ color: "inherit", textDecoration: "none" }}>{dept.name}</Link>
                </>)}
                <span style={{ margin: "0 8px" }}>›</span>
                <span style={{ color: "rgba(255,255,255,.85)" }}>{ville.nom}</span>
              </nav>
              <h1 style={{ fontFamily: "'Fraunces',serif", fontSize: "clamp(28px,4vw,42px)", fontWeight: 700, color: "#fff", lineHeight: 1.15, marginBottom: 12 }}>
                Artisans du b&acirc;timent &agrave; {ville.nom}
              </h1>
              <p style={{ fontSize: 16, color: "rgba(255,255,255,.7)", maxWidth: 720 }}>
                {ville.nom}{cp ? ` (${cp}, ${ville.departement})` : ""} &mdash; {totalArtisans > 0
                  ? `${totalArtisans} professionnel${totalArtisans > 1 ? "s" : ""} verifie${totalArtisans > 1 ? "s" : ""}, regroupe${totalArtisans > 1 ? "s" : ""} par metier.`
                  : `decouvrez nos artisans certifies pour vos travaux.`}
                {" "}Devis gratuits, avis verifies, zero commission.
              </p>
            </div>
          </section>

          <section style={{ padding: "48px 32px" }}>
            <div style={{ maxWidth: 1100, margin: "0 auto" }}>
              {metiersOrdered.map((m) => (
                <div key={m.slug} style={{ marginBottom: 40 }}>
                  <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 22, fontWeight: 700, color: "#1C1C1E", marginBottom: 8 }}>
                    {m.nom}s &agrave; {ville.nom}
                  </h2>
                  <p style={{ fontSize: 14, color: "#6B6560", marginBottom: 16 }}>
                    {m.artisans.length > 0
                      ? `${m.artisans.length} ${m.nom.toLowerCase()}${m.artisans.length > 1 ? "s" : ""} disponible${m.artisans.length > 1 ? "s" : ""}.`
                      : `Aucun ${m.nom.toLowerCase()} pour le moment a ${ville.nom}. Decouvrez nos artisans dans les villes voisines.`}
                  </p>
                  {m.artisans.length > 0 && (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: 12, marginBottom: 12 }}>
                      {m.artisans.slice(0, 6).map((a) => (
                        <Link key={a.id} href={`/${slug}/${a.slug}`} style={{ display: "block", padding: 16, background: "#fff", border: "1px solid #E8D5C0", borderRadius: 12, textDecoration: "none", color: "#1C1C1E" }}>
                          <div style={{ fontWeight: 600, marginBottom: 4 }}>{a.nomAffichage}</div>
                          <div style={{ fontSize: 13, color: "#6B6560" }}>
                            {a.noteMoyenne > 0 && <>★ {a.noteMoyenne.toFixed(1)} ({a.nombreAvis}) · </>}
                            {a.experienceAnnees ? `${a.experienceAnnees} ans d'exp.` : "Profil verifie"}
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                  {isHub && (
                    <Link href={`/${slug}/${m.slug}`} style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, color: "#C4531A", textDecoration: "none", fontWeight: 600 }}>
                      Voir tous les {m.nom.toLowerCase()}s &agrave; {ville.nom} &rarr;
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </section>

          {voisines.length > 0 && (
            <section style={{ background: "#fff", padding: "32px", borderTop: "1px solid #E8D5C0" }}>
              <div style={{ maxWidth: 1100, margin: "0 auto" }}>
                <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 18, fontWeight: 700, color: "#1C1C1E", marginBottom: 12 }}>
                  Artisans dans les villes voisines de {ville.nom}
                </h2>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {voisines.map((v) => (
                    <Link key={v.slug} href={`/artisans-${v.slug}`} style={{ padding: "8px 14px", background: "#FAF8F5", border: "1px solid #E8D5C0", borderRadius: 99, fontSize: 13, color: "#3D2E1F", textDecoration: "none", fontWeight: 500 }}>
                      Artisans &agrave; {v.nom}
                    </Link>
                  ))}
                </div>
                {dept && (
                  <p style={{ marginTop: 16, fontSize: 13 }}>
                    <Link href={`/artisans-${dept.slug}`} style={{ color: "#C4531A", textDecoration: "underline" }}>
                      Voir tous les artisans en {dept.name} &rarr;
                    </Link>
                  </p>
                )}
              </div>
            </section>
          )}
        </main>
        <Footer />

        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Accueil", item: "https://www.bativio.fr" },
            { "@type": "ListItem", position: 2, name: "Artisans Rhône-Alpes", item: "https://www.bativio.fr/artisans-rhone-alpes" },
            ...(dept ? [{ "@type": "ListItem", position: 3, name: dept.name, item: `https://www.bativio.fr/artisans-${dept.slug}` }] : []),
            { "@type": "ListItem", position: dept ? 4 : 3, name: ville.nom, item: `https://www.bativio.fr/artisans-${slug}` },
          ],
        }) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: `Artisans du bâtiment à ${ville.nom}`,
          url: `https://www.bativio.fr/artisans-${slug}`,
          about: {
            "@type": "Place",
            name: ville.nom,
            ...(cp ? { address: { "@type": "PostalAddress", addressLocality: ville.nom, postalCode: cp, addressRegion: ville.departement, addressCountry: "FR" } } : {}),
          },
        }) }} />
      </>
    );
  }

  // ============================== HUB DEPARTEMENT ==============================
  const dept = k.dept;
  const villes = getVillesByDepartementSlug(dept.slug);
  const artisansByVille: Record<string, number> = {};
  try {
    const counts = await prisma.artisan.groupBy({
      by: ["villeSlug"],
      where: { actif: true, deletedAt: null, villeSlug: { in: villes.map((v) => v.slug) } },
      _count: { id: true },
    });
    for (const c of counts) if (c.villeSlug) artisansByVille[c.villeSlug] = c._count.id;
  } catch { /* ignore */ }

  const total = Object.values(artisansByVille).reduce((s, n) => s + n, 0);
  const villesSorted = [...villes].sort((a, b) => {
    const aHub = "codePostal" in a && a.parentSlug === a.slug ? 1 : 0;
    const bHub = "codePostal" in b && b.parentSlug === b.slug ? 1 : 0;
    if (aHub !== bHub) return bHub - aHub;
    return (artisansByVille[b.slug] || 0) - (artisansByVille[a.slug] || 0);
  });

  return (
    <>
      <Navbar />
      <main style={{ background: "#FAF8F5", minHeight: "100dvh" }}>
        <section style={{ background: "#3D2E1F", padding: "48px 32px 40px" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <nav aria-label="Fil d'Ariane" style={{ fontSize: 13, color: "rgba(255,255,255,.6)", marginBottom: 16 }}>
              <Link href="/" style={{ color: "inherit", textDecoration: "none" }}>Accueil</Link>
              <span style={{ margin: "0 8px" }}>›</span>
              <Link href="/artisans-rhone-alpes" style={{ color: "inherit", textDecoration: "none" }}>Artisans Rhône-Alpes</Link>
              <span style={{ margin: "0 8px" }}>›</span>
              <span style={{ color: "rgba(255,255,255,.85)" }}>{dept.name}</span>
            </nav>
            <h1 style={{ fontFamily: "'Fraunces',serif", fontSize: "clamp(28px,4vw,42px)", fontWeight: 700, color: "#fff", lineHeight: 1.15, marginBottom: 12 }}>
              Artisans du b&acirc;timent en {dept.name} ({dept.code})
            </h1>
            <p style={{ fontSize: 16, color: "rgba(255,255,255,.7)", maxWidth: 720 }}>
              Annuaire des artisans certifies sur l&apos;ensemble du departement {dept.name}.
              Plombiers, electriciens, peintres, macons et tous les corps de metier
              du batiment a {dept.chefLieu} et alentours. {total > 0 ? `${total} profil${total > 1 ? "s" : ""} verifie${total > 1 ? "s" : ""}.` : ""}
              Devis gratuits, zero commission.
            </p>
          </div>
        </section>

        <section style={{ padding: "48px 32px" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 22, fontWeight: 700, color: "#1C1C1E", marginBottom: 20 }}>
              Communes couvertes en {dept.name}
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 12 }}>
              {villesSorted.map((v) => {
                const nb = artisansByVille[v.slug] || 0;
                const isHub = "codePostal" in v && v.parentSlug === v.slug;
                return (
                  <Link key={v.slug} href={`/artisans-${v.slug}`} style={{ display: "block", padding: 18, background: "#fff", border: "1px solid " + (isHub ? "#C4531A" : "#E8D5C0"), borderRadius: 12, textDecoration: "none", color: "#1C1C1E", position: "relative" }}>
                    {isHub && (
                      <span style={{ position: "absolute", top: -8, right: 12, background: "#C4531A", color: "#fff", fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 99, textTransform: "uppercase", letterSpacing: 0.5 }}>
                        Hub
                      </span>
                    )}
                    <div style={{ fontWeight: 600, marginBottom: 4 }}>{v.nom}</div>
                    <div style={{ fontSize: 13, color: "#6B6560" }}>
                      {"codePostal" in v ? `${v.codePostal} · ` : ""}{nb} artisan{nb !== 1 ? "s" : ""}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        <section style={{ background: "#fff", padding: "32px", borderTop: "1px solid #E8D5C0" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 18, fontWeight: 700, color: "#1C1C1E", marginBottom: 12 }}>
              Autres d&eacute;partements en Rh&ocirc;ne-Alpes
            </h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {DEPARTEMENTS_COUVERTS.filter((d) => d.slug !== dept.slug).map((d) => (
                <Link key={d.slug} href={`/artisans-${d.slug}`} style={{ padding: "8px 14px", background: "#FAF8F5", border: "1px solid #E8D5C0", borderRadius: 99, fontSize: 13, color: "#3D2E1F", textDecoration: "none", fontWeight: 500 }}>
                  Artisans en {d.name} ({d.code})
                </Link>
              ))}
            </div>
            <p style={{ marginTop: 16, fontSize: 13 }}>
              <Link href="/artisans-rhone-alpes" style={{ color: "#C4531A", textDecoration: "underline" }}>
                Voir tous les artisans en Rh&ocirc;ne-Alpes &rarr;
              </Link>
            </p>
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
          { "@type": "ListItem", position: 3, name: dept.name, item: `https://www.bativio.fr/artisans-${dept.slug}` },
        ],
      }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd({
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: `Artisans en ${dept.name}`,
        url: `https://www.bativio.fr/artisans-${dept.slug}`,
        about: { "@type": "AdministrativeArea", name: dept.name, addressCountry: "FR" },
      }) }} />
    </>
  );
}
