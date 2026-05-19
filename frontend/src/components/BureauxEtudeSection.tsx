/**
 * BureauxEtudeSection — Section affichee sur les pages /attestation-sismique
 * et /attestation-sismique/[ville].
 *
 * Server Component : fetch direct DB des artisans metier "bureau-etude"
 * (incluant AZ TECH (monpcmi13)). Affiche une liste sobre avec lien vers
 * leur vitrine Bativio.
 *
 * Les BET attestation sismique font souvent leur travail a distance
 * (formulaire en ligne, livre par email), donc on les affiche partout
 * meme si leur adresse physique n'est pas dans la ville cible.
 */

import Link from "next/link";
import { prisma } from "@/lib/prisma";

interface Props {
  /** Nom de la ville cible pour le titre (ex "Chambéry"). Si null = page générale. */
  villeNom?: string | null;
}

type BureauRow = {
  id: string;
  slug: string;
  nomAffichage: string;
  description: string | null;
  ville: string | null;
  experienceAnnees: number | null;
  noteMoyenne: number;
  nombreAvis: number;
  photos: { url: string }[];
};

export default async function BureauxEtudeSection({ villeNom }: Props) {
  // Try/catch : ce composant est rendu en SSG/ISR (revalidate=3600). Si la
  // DB est indisponible au build (CI sans DATABASE_URL, network blip, etc.),
  // on retourne null plutot que de planter tout le build. La page reste
  // valide, juste sans cette section bureau-etude.
  let bureaux: BureauRow[] = [];
  try {
    bureaux = await prisma.artisan.findMany({
      where: {
        actif: true,
        visible: true,
        deletedAt: null,
        metier: { slug: "bureau-etude" },
        NOT: { slug: { startsWith: "test-" } },
      },
      select: {
        id: true,
        slug: true,
        nomAffichage: true,
        description: true,
        ville: true,
        experienceAnnees: true,
        noteMoyenne: true,
        nombreAvis: true,
        photos: {
          select: { url: true },
          take: 1,
          orderBy: { ordre: "asc" },
        },
      },
      orderBy: { experienceAnnees: "desc" },
      take: 6,
    });
  } catch (e) {
    console.warn("[BureauxEtudeSection] DB unavailable, skipping section:", e instanceof Error ? e.message : e);
    return null;
  }

  if (bureaux.length === 0) return null;

  const titre = villeNom
    ? `Bureaux d'étude qualifiés à ${villeNom}`
    : "Bureaux d'étude qualifiés en Rhône-Alpes";

  return (
    <section style={{ padding: "56px 24px", background: "#fff", borderTop: "1px solid var(--sable,#E8D5C0)" }}>
      <div style={{ maxWidth: 920, margin: "0 auto" }}>
        <div style={{ marginBottom: 28, maxWidth: 680 }}>
          <span style={{ display: "inline-block", padding: "4px 12px", borderRadius: 20, background: "rgba(73,103,65,.10)", color: "var(--mousse,#4A6741)", fontSize: 11, fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 12 }}>
            Bureau d&apos;étude — BET / Architecte
          </span>
          <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: "clamp(22px,3vw,30px)", fontWeight: 700, color: "var(--anthracite,#1C1C1E)", lineHeight: 1.25, margin: 0, marginBottom: 8 }}>
            {titre}
          </h2>
          <p style={{ fontSize: 14, color: "var(--bois-mid,#5C4A3A)", lineHeight: 1.6, margin: 0 }}>
            Professionnels habilités à rédiger votre attestation sismique
            (Cerfa PCMI13) conforme Eurocode 8.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 16 }}>
          {bureaux.map((b) => {
            const photo = b.photos[0]?.url;
            const villeSlug = (b.ville || "chambery")
              .toLowerCase()
              .normalize("NFD")
              .replace(/[̀-ͯ]/g, "")
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/^-|-$/g, "");
            const url = `/${villeSlug}/${b.slug}`;
            const desc = (b.description || "Bureau d'étude technique qualifié pour attestation sismique et études parasismiques.").slice(0, 140);
            return (
              <Link
                key={b.id}
                href={url}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  background: "var(--creme,#FAF8F5)",
                  border: "1px solid var(--sable,#E8D5C0)",
                  borderRadius: 14,
                  padding: 20,
                  textDecoration: "none",
                  color: "inherit",
                  transition: "transform .15s, box-shadow .15s",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 12 }}>
                  {photo ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={photo}
                      alt={b.nomAffichage}
                      width={56}
                      height={56}
                      style={{ width: 56, height: 56, borderRadius: 12, objectFit: "cover", flexShrink: 0 }}
                    />
                  ) : (
                    <div style={{ width: 56, height: 56, borderRadius: 12, background: "var(--mousse,#4A6741)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Fraunces',serif", fontSize: 22, fontWeight: 700, flexShrink: 0 }}>
                      {b.nomAffichage.charAt(0)}
                    </div>
                  )}
                  <div style={{ minWidth: 0 }}>
                    <h3 style={{ fontFamily: "'Fraunces',serif", fontSize: 16, fontWeight: 700, color: "var(--anthracite,#1C1C1E)", margin: 0, marginBottom: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {b.nomAffichage}
                    </h3>
                    <div style={{ fontSize: 12, color: "var(--pierre,#9C958D)", display: "flex", alignItems: "center", gap: 6 }}>
                      {b.ville && <span>{b.ville}</span>}
                      {b.experienceAnnees && b.experienceAnnees > 0 ? (
                        <>
                          <span style={{ width: 3, height: 3, borderRadius: "50%", background: "var(--pierre,#9C958D)" }} />
                          <span>{b.experienceAnnees} ans</span>
                        </>
                      ) : null}
                    </div>
                  </div>
                </div>
                <p style={{ fontSize: 13, color: "var(--bois-mid,#5C4A3A)", lineHeight: 1.5, margin: 0, flex: 1 }}>
                  {desc}
                  {desc.length === 140 ? "…" : ""}
                </p>
                <div style={{ marginTop: 12, fontSize: 13, color: "var(--terre,#C4531A)", fontWeight: 600 }}>
                  Voir le profil →
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
