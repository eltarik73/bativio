import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { VILLES, VILLES_SECONDAIRES, METIERS_TOP_SEO, METIERS } from "@/lib/constants";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ArtisanCard from "@/components/ArtisanCard";
import { safeJsonLd } from "@/lib/html-escape";

/**
 * Page SEO long-tail : /[metier]-[ville-secondaire]
 *
 * Render quand le slug match `${metierTopSEO}-${villeSecondaireSlug}`.
 * Cible 4 metiers (METIERS_TOP_SEO) x 35 villes secondaires = 140 combinaisons.
 * Exemple : /electricien-la-bridoire, /plombier-saint-jean-de-maurienne.
 *
 * Tarik veut etre indexe sur ces requetes long-tail Google.
 */

// Maps generiques string -> entry. On type le slug en string (pas en literal)
// pour pouvoir lookup avec n'importe quelle string passee a parseSlug.
type VilleSecondaireEntry = typeof VILLES_SECONDAIRES[number];
type MetierEntry = typeof METIERS[number];
const VILLE_SECONDAIRE_BY_SLUG: Map<string, VilleSecondaireEntry> = new Map(
  VILLES_SECONDAIRES.map((v) => [v.slug as string, v]),
);
const METIER_BY_SLUG: Map<string, MetierEntry> = new Map(
  METIERS.map((m) => [m.slug as string, m]),
);

export type ParsedMetierVille = {
  metier: typeof METIERS[number];
  ville: typeof VILLES_SECONDAIRES[number];
};

/**
 * Parse un slug du type "{metierTopSEO}-{villeSecondaireSlug}".
 * Retourne null si le slug ne match aucune des 140 combinaisons.
 *
 * Itere sur les metiers TOP_SEO (4 prefixes courts) plutot que sur les villes
 * (35 slugs avec compositions ex "saint-jean-de-maurienne") pour gerer le cas
 * ou la ville a un slug compose.
 */
export function parseMetierVilleSecondaireSlug(slug: string): ParsedMetierVille | null {
  for (const metierSlug of METIERS_TOP_SEO) {
    if (slug.startsWith(metierSlug + "-")) {
      const villeSlug = slug.slice(metierSlug.length + 1);
      const ville = VILLE_SECONDAIRE_BY_SLUG.get(villeSlug);
      const metier = METIER_BY_SLUG.get(metierSlug);
      if (ville && metier) return { metier, ville };
    }
  }
  return null;
}

interface PageProps {
  parsed: ParsedMetierVille;
  fullSlug: string;
}

export default async function MetierVilleSecondairePage({ parsed, fullSlug }: PageProps) {
  const { metier, ville } = parsed;
  const villeHubSlug = ville.parentSlug;
  const villeHub = VILLES.find((v) => v.slug === villeHubSlug);

  // Recupere les artisans avec ce metier dans la ville hub parente.
  // Strategie : un artisan a Chambery peut aussi servir La Bridoire (proche).
  // On utilise le metier slug du model Metier (relation) pour matcher.
  const artisans = await prisma.artisan
    .findMany({
      where: {
        actif: true,
        visible: true,
        deletedAt: null,
        OR: [
          { artisanStatus: "ACTIVE" },
          { profilCompletion: { gte: 50 } },
        ],
        metier: { slug: metier.slug },
        ville: {
          // Match sur la ville secondaire OU la ville hub parente (case-insensitive)
          in: [ville.nom, villeHub?.nom || ville.parentSlug],
          mode: "insensitive",
        },
      },
      include: {
        metier: { select: { nom: true, slug: true, icone: true } },
        photos: { take: 1, orderBy: { ordre: "asc" } },
        badges: true,
      },
      take: 20,
    })
    .catch(() => []);

  const totalArtisans = artisans.length;

  // Mappe vers le shape ArtisanPublic attendu par ArtisanCard.
  // Tous les champs requis sont fournis avec des valeurs sures (chaine vide pour
  // les optionnels manquants en DB).
  const artisansForCard = artisans.map((a) => ({
    id: a.id,
    nomAffichage: a.nomAffichage,
    slug: a.slug,
    metierNom: a.metier?.nom || "",
    metierSlug: a.metier?.slug || "",
    metierIcone: a.metier?.icone || "",
    ville: a.ville || "",
    noteMoyenne: a.noteMoyenne || 0,
    nombreAvis: a.nombreAvis || 0,
    description: a.description || "",
    telephone: "",
    adresse: "",
    codePostal: a.codePostal || "",
    zoneRayonKm: 0,
    experienceAnnees: a.experienceAnnees || 0,
    plan: a.plan,
    planOverride: a.planOverride,
    planOverrideExpireAt: a.planOverrideExpireAt?.toISOString() || null,
    badgesNoms: a.badges.map((b) => b.nom),
    services: [],
    photos: a.photos.map((p) => ({ id: p.id, url: p.url, titre: p.titre || "", type: p.type as string, ordre: p.ordre, paireId: "" })),
    horaires: null,
    zones: null,
    distance: undefined,
  }));

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Accueil", item: "https://www.bativio.fr/" },
      { "@type": "ListItem", position: 2, name: villeHub?.nom || ville.departement, item: `https://www.bativio.fr/${villeHubSlug}` },
      { "@type": "ListItem", position: 3, name: `${metier.nom} a ${ville.nom}`, item: `https://www.bativio.fr/${fullSlug}` },
    ],
  };

  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${metier.nom} a ${ville.nom}`,
    description: `Liste des ${metier.nom.toLowerCase()}s verifies a ${ville.nom} (${ville.codePostal}).`,
    url: `https://www.bativio.fr/${fullSlug}`,
    isPartOf: { "@type": "WebSite", url: "https://www.bativio.fr/" },
    breadcrumb: breadcrumbJsonLd,
  };

  return (
    <>
      <Navbar />
      <main style={{ background: "var(--creme, #FAF8F5)", paddingBottom: 64 }}>
        {/* Hero */}
        <section style={{ padding: "48px 32px 32px", maxWidth: 1100, margin: "0 auto" }}>
          <nav style={{ fontSize: 13, color: "var(--pierre, #9C958D)", marginBottom: 16 }} aria-label="Fil d'Ariane">
            <Link href="/" style={{ color: "inherit", textDecoration: "none" }}>Accueil</Link>
            <span style={{ margin: "0 8px" }}>›</span>
            <Link href={`/${villeHubSlug}`} style={{ color: "inherit", textDecoration: "none" }}>{villeHub?.nom || ville.departement}</Link>
            <span style={{ margin: "0 8px" }}>›</span>
            <span style={{ color: "var(--anthracite, #1C1C1E)" }}>{metier.nom} à {ville.nom}</span>
          </nav>

          <h1 style={{ fontFamily: "'Fraunces',serif", fontSize: "clamp(28px,4.5vw,42px)", fontWeight: 700, color: "var(--anthracite, #1C1C1E)", marginBottom: 12, lineHeight: 1.1 }}>
            {metier.nom} à {ville.nom}{" "}
            <span style={{ fontStyle: "italic", fontWeight: 400, color: "var(--terre, #C4531A)", fontSize: "0.7em" }}>
              ({ville.codePostal})
            </span>
          </h1>
          <p style={{ fontSize: 16, color: "var(--bois-mid, #6B6560)", maxWidth: 700, lineHeight: 1.6 }}>
            Vous cherchez un {metier.nom.toLowerCase()} fiable à {ville.nom} ? Bativio reference
            les artisans verifies (SIRET, assurance decennale, avis clients reels) qui interviennent
            dans le secteur de {ville.nom} ({ville.departement}, {ville.codePostal}). Devis gratuit en 24h, zero commission.
          </p>
        </section>

        {/* Liste artisans */}
        <section style={{ padding: "16px 32px", maxWidth: 1100, margin: "0 auto" }}>
          {totalArtisans > 0 ? (
            <>
              <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 22, fontWeight: 700, color: "var(--anthracite, #1C1C1E)", marginBottom: 20 }}>
                {totalArtisans} {metier.nom.toLowerCase()}{totalArtisans > 1 ? "s" : ""} pres de {ville.nom}
              </h2>
              <div className="grid">
                {artisansForCard.map((a) => (
                  <ArtisanCard key={a.id} artisan={a} villeSlug={villeHubSlug} />
                ))}
              </div>
            </>
          ) : (
            <div style={{ background: "#FFFFFF", border: "1px solid var(--g100, #EDEBE7)", borderRadius: 14, padding: 28, textAlign: "center" }}>
              <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 20, fontWeight: 700, color: "var(--anthracite, #1C1C1E)", marginBottom: 10 }}>
                Bativio s&apos;etend bientot a {ville.nom}
              </h2>
              <p style={{ fontSize: 15, color: "var(--bois-mid, #6B6560)", marginBottom: 18, lineHeight: 1.55 }}>
                Aucun {metier.nom.toLowerCase()} n&apos;est encore reference a {ville.nom}.
                Consultez les artisans a{" "}
                <Link href={`/${villeHubSlug}/${metier.slug}`} style={{ color: "var(--terre, #C4531A)", fontWeight: 600 }}>
                  {villeHub?.nom || villeHubSlug}
                </Link>
                {" "}(ville la plus proche).
              </p>
              <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                <Link href={`/${villeHubSlug}/${metier.slug}`} style={{ padding: "12px 24px", background: "var(--terre, #C4531A)", color: "#fff", borderRadius: 8, textDecoration: "none", fontWeight: 600, fontSize: 14 }}>
                  Voir les {metier.nom.toLowerCase()}s a {villeHub?.nom || villeHubSlug}
                </Link>
                <Link href="/artisan" style={{ padding: "12px 24px", background: "transparent", color: "var(--anthracite, #1C1C1E)", borderRadius: 8, textDecoration: "none", fontWeight: 600, fontSize: 14, border: "1.5px solid var(--g200, #E0DDD8)" }}>
                  Je suis {metier.nom.toLowerCase()}, m&apos;inscrire
                </Link>
              </div>
            </div>
          )}
        </section>

        {/* Maillage interne : autres metiers a cette ville secondaire */}
        <section style={{ padding: "32px 32px 0", maxWidth: 1100, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 18, fontWeight: 700, color: "var(--anthracite, #1C1C1E)", marginBottom: 14 }}>
            Autres recherches a {ville.nom}
          </h2>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {METIERS_TOP_SEO.filter((m) => m !== metier.slug).map((mSlug) => {
              const m = METIER_BY_SLUG.get(mSlug);
              if (!m) return null;
              return (
                <Link key={mSlug} href={`/${mSlug}-${ville.slug}`} style={{ padding: "8px 14px", background: "var(--blanc, #FFF)", border: "1px solid var(--g200, #E0DDD8)", borderRadius: 999, fontSize: 13, color: "var(--anthracite, #1C1C1E)", textDecoration: "none", fontWeight: 500 }}>
                  {m.nom} à {ville.nom}
                </Link>
              );
            })}
          </div>
        </section>

        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(collectionJsonLd) }} />
      </main>
      <Footer />
    </>
  );
}
