import Link from "next/link";
import { VILLES, METIERS } from "@/lib/constants";

// Tarifs moyens HT — médianes observées Rhône-Alpes 2025/2026 (sources: artisans
// inscrits + données INSEE BTP). Affichés en TTC TVA 10 % rénovation logement >2 ans.
const TARIFS_INDICATIFS: { metierSlug: string; libelle: string; fourchette: string }[] = [
  { metierSlug: "plombier",     libelle: "Intervention plomberie (h)",          fourchette: "55 – 90 € TTC" },
  { metierSlug: "electricien",  libelle: "Tableau électrique aux normes",       fourchette: "1 200 – 2 800 € TTC" },
  { metierSlug: "peintre",      libelle: "Peinture intérieure (m²)",            fourchette: "25 – 45 € TTC" },
  { metierSlug: "macon",        libelle: "Maçonnerie travaux (j)",              fourchette: "350 – 550 € TTC" },
  { metierSlug: "couvreur",     libelle: "Démoussage toiture (m²)",             fourchette: "8 – 18 € TTC" },
  { metierSlug: "carreleur",    libelle: "Pose carrelage sol (m²)",             fourchette: "40 – 80 € TTC" },
  { metierSlug: "menuisier",    libelle: "Pose porte intérieure (u)",           fourchette: "180 – 350 € TTC" },
  { metierSlug: "chauffagiste", libelle: "Entretien chaudière annuel",          fourchette: "120 – 180 € TTC" },
];

// Métiers les plus demandés en premier (top des recherches Google sur la zone)
const TOP_METIERS_SLUGS = [
  "plombier", "electricien", "peintre", "macon",
  "couvreur", "carreleur", "menuisier", "chauffagiste",
  "platrier", "serrurier", "vitrier", "paysagiste",
];

interface Props {
  villeNom: string;
  villeSlug: string;
  departement: string;
  artisansCount: number;
}

export default function VilleSeoSection({ villeNom, villeSlug, departement, artisansCount }: Props) {
  const topMetiers = METIERS.filter((m) => TOP_METIERS_SLUGS.includes(m.slug));
  const villesProches = VILLES.filter((v) => v.slug !== villeSlug);

  return (
    <section
      style={{
        background: "var(--creme,#FAF8F5)",
        borderTop: "1px solid var(--sable,#E8D5C0)",
        padding: "64px 24px",
      }}
      aria-labelledby="ville-seo-heading"
    >
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <h2
          id="ville-seo-heading"
          style={{
            fontFamily: "'Fraunces',serif",
            fontSize: "clamp(24px,3.4vw,34px)",
            fontWeight: 700,
            color: "var(--anthracite,#1C1C1E)",
            marginBottom: 14,
            lineHeight: 1.2,
          }}
        >
          Trouvez un artisan BTP à {villeNom} et en {departement}
        </h2>
        <p style={{ fontSize: 16, color: "var(--bois-mid,#5C4A3A)", lineHeight: 1.6, marginBottom: 36, maxWidth: 760 }}>
          Bativio met en relation les particuliers de {villeNom} avec des artisans du
          bâtiment qualifiés : plombiers, électriciens, peintres, maçons,
          chauffagistes, couvreurs, carreleurs, menuisiers et plus encore. Tous les
          professionnels référencés sont vérifiés (SIRET, assurance décennale,
          attestation URSSAF) et notés par leurs clients. Demandez un devis gratuit
          en 24 heures, sans engagement, et payez zéro commission sur vos travaux —
          le devis comme l&apos;intervention se règle directement avec l&apos;artisan.
        </p>

        {/* Top métiers à la ville */}
        <h3 style={{ fontFamily: "'Fraunces',serif", fontSize: 22, fontWeight: 700, color: "var(--anthracite,#1C1C1E)", marginBottom: 16 }}>
          Métiers les plus demandés à {villeNom}
        </h3>
        <ul
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill,minmax(180px,1fr))",
            gap: 10,
            marginBottom: 40,
            listStyle: "none",
            padding: 0,
          }}
        >
          {topMetiers.map((m) => (
            <li key={m.slug}>
              <Link
                href={`/${villeSlug}/${m.slug}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "12px 16px",
                  background: "#fff",
                  border: "1px solid var(--sable,#E8D5C0)",
                  borderRadius: 10,
                  textDecoration: "none",
                  fontSize: 14,
                  fontWeight: 500,
                  color: "var(--anthracite,#1C1C1E)",
                  transition: "border-color .15s, transform .15s",
                }}
              >
                <span aria-hidden="true" style={{ fontSize: 18 }}>{m.icone}</span>
                {m.nom} {villeNom}
              </Link>
            </li>
          ))}
        </ul>

        {/* Tarifs indicatifs */}
        <h3 style={{ fontFamily: "'Fraunces',serif", fontSize: 22, fontWeight: 700, color: "var(--anthracite,#1C1C1E)", marginBottom: 8 }}>
          Tarifs moyens des artisans à {villeNom}
        </h3>
        <p style={{ fontSize: 14, color: "var(--bois-mid,#5C4A3A)", marginBottom: 16, lineHeight: 1.5 }}>
          Fourchettes indicatives observées sur la zone {departement} en 2026, TVA
          incluse. Les prix réels dépendent de la nature du chantier et sont
          confirmés par devis gratuit.
        </p>
        <div style={{ background: "#fff", border: "1px solid var(--sable,#E8D5C0)", borderRadius: 12, overflow: "hidden", marginBottom: 40 }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
            <thead>
              <tr style={{ background: "var(--creme,#FAF8F5)" }}>
                <th scope="col" style={{ textAlign: "left", padding: "12px 16px", fontWeight: 600, color: "var(--anthracite,#1C1C1E)", borderBottom: "1px solid var(--sable,#E8D5C0)" }}>Prestation</th>
                <th scope="col" style={{ textAlign: "left", padding: "12px 16px", fontWeight: 600, color: "var(--anthracite,#1C1C1E)", borderBottom: "1px solid var(--sable,#E8D5C0)" }}>Fourchette {villeNom}</th>
              </tr>
            </thead>
            <tbody>
              {TARIFS_INDICATIFS.map((t, i) => (
                <tr key={t.metierSlug} style={{ borderBottom: i < TARIFS_INDICATIFS.length - 1 ? "1px solid var(--sable,#E8D5C0)" : "none" }}>
                  <td style={{ padding: "12px 16px", color: "var(--bois,#3D2E1F)" }}>
                    <Link href={`/${villeSlug}/${t.metierSlug}`} style={{ color: "var(--terre,#C4531A)", textDecoration: "none", fontWeight: 500 }}>
                      {t.libelle}
                    </Link>
                  </td>
                  <td style={{ padding: "12px 16px", color: "var(--bois-mid,#5C4A3A)" }}>{t.fourchette}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* FAQ */}
        <h3 style={{ fontFamily: "'Fraunces',serif", fontSize: 22, fontWeight: 700, color: "var(--anthracite,#1C1C1E)", marginBottom: 16 }}>
          Questions fréquentes — Artisans à {villeNom}
        </h3>
        <div style={{ display: "grid", gap: 12, marginBottom: 40 }}>
          <details style={{ background: "#fff", border: "1px solid var(--sable,#E8D5C0)", borderRadius: 10, padding: "16px 20px" }}>
            <summary style={{ fontWeight: 600, cursor: "pointer", color: "var(--anthracite,#1C1C1E)", fontSize: 15 }}>Comment trouver un bon artisan à {villeNom} ?</summary>
            <p style={{ marginTop: 10, fontSize: 14, color: "var(--bois-mid,#5C4A3A)", lineHeight: 1.6 }}>
              Sur Bativio, chaque artisan référencé à {villeNom} est vérifié : SIRET
              actif, assurance décennale en cours, attestation URSSAF. Vous pouvez
              comparer les profils, lire les avis clients réels, et demander
              jusqu&apos;à 3 devis gratuits en 24h pour comparer prix et délais.
            </p>
          </details>
          <details style={{ background: "#fff", border: "1px solid var(--sable,#E8D5C0)", borderRadius: 10, padding: "16px 20px" }}>
            <summary style={{ fontWeight: 600, cursor: "pointer", color: "var(--anthracite,#1C1C1E)", fontSize: 15 }}>Combien coûte un devis sur Bativio ?</summary>
            <p style={{ marginTop: 10, fontSize: 14, color: "var(--bois-mid,#5C4A3A)", lineHeight: 1.6 }}>
              Le devis est totalement gratuit et sans engagement, peu importe
              l&apos;artisan choisi à {villeNom}. Bativio ne prend aucune commission
              sur vos travaux : vous payez l&apos;artisan directement, au prix
              annoncé sur son devis.
            </p>
          </details>
          <details style={{ background: "#fff", border: "1px solid var(--sable,#E8D5C0)", borderRadius: 10, padding: "16px 20px" }}>
            <summary style={{ fontWeight: 600, cursor: "pointer", color: "var(--anthracite,#1C1C1E)", fontSize: 15 }}>Combien de temps pour recevoir mes devis ?</summary>
            <p style={{ marginTop: 10, fontSize: 14, color: "var(--bois-mid,#5C4A3A)", lineHeight: 1.6 }}>
              Les artisans de {villeNom} reçoivent votre demande par email et SMS
              et répondent généralement sous 24 heures ouvrées. Pour les urgences
              (fuite d&apos;eau, panne électrique, serrurerie), des artisans
              d&apos;astreinte 24/7 sont disponibles via la rubrique{" "}
              <Link href="/urgence" style={{ color: "var(--terre,#C4531A)" }}>Urgence 24/7</Link>.
            </p>
          </details>
          <details style={{ background: "#fff", border: "1px solid var(--sable,#E8D5C0)", borderRadius: 10, padding: "16px 20px" }}>
            <summary style={{ fontWeight: 600, cursor: "pointer", color: "var(--anthracite,#1C1C1E)", fontSize: 15 }}>Les artisans Bativio facturent-ils en facture électronique ?</summary>
            <p style={{ marginTop: 10, fontSize: 14, color: "var(--bois-mid,#5C4A3A)", lineHeight: 1.6 }}>
              Oui. Tous les artisans Bativio à {villeNom} sont raccordés à une
              plateforme agréée (PA) conforme à la{" "}
              <Link href="/facturation-electronique" style={{ color: "var(--terre,#C4531A)" }}>réforme de facturation électronique 2026</Link>.
              Vos factures sont conformes BOI-TVA, archivées 10 ans et signées
              cryptographiquement.
            </p>
          </details>
          <details style={{ background: "#fff", border: "1px solid var(--sable,#E8D5C0)", borderRadius: 10, padding: "16px 20px" }}>
            <summary style={{ fontWeight: 600, cursor: "pointer", color: "var(--anthracite,#1C1C1E)", fontSize: 15 }}>MaPrimeRénov&apos; et aides : comment ça fonctionne à {villeNom} ?</summary>
            <p style={{ marginTop: 10, fontSize: 14, color: "var(--bois-mid,#5C4A3A)", lineHeight: 1.6 }}>
              Les artisans RGE référencés sur Bativio à {villeNom} vous accompagnent
              pour les dossiers MaPrimeRénov&apos; et CEE. Vous pouvez filtrer par
              label RGE et obtenir un devis intégrant les aides déductibles. Voir
              notre <Link href="/maprimerenov" style={{ color: "var(--terre,#C4531A)" }}>guide MaPrimeRénov&apos;</Link>.
            </p>
          </details>
        </div>

        {/* Communes proches — internal linking */}
        <h3 style={{ fontFamily: "'Fraunces',serif", fontSize: 22, fontWeight: 700, color: "var(--anthracite,#1C1C1E)", marginBottom: 12 }}>
          Artisans dans les villes proches
        </h3>
        <p style={{ fontSize: 14, color: "var(--bois-mid,#5C4A3A)", marginBottom: 16 }}>
          Vous habitez aux alentours de {villeNom} ? Bativio couvre toute la
          région Rhône-Alpes :
        </p>
        <ul style={{ display: "flex", flexWrap: "wrap", gap: 10, listStyle: "none", padding: 0, marginBottom: 24 }}>
          {villesProches.map((v) => (
            <li key={v.slug}>
              <Link
                href={`/${v.slug}`}
                style={{
                  display: "inline-flex",
                  padding: "8px 16px",
                  background: "#fff",
                  border: "1px solid var(--sable,#E8D5C0)",
                  borderRadius: 99,
                  fontSize: 14,
                  fontWeight: 500,
                  color: "var(--anthracite,#1C1C1E)",
                  textDecoration: "none",
                }}
              >
                Artisans {v.nom} ({v.codePostal})
              </Link>
            </li>
          ))}
        </ul>

        <p style={{ fontSize: 12, color: "var(--pierre,#9C958D)", marginTop: 24, fontStyle: "italic" }}>
          {artisansCount > 0
            ? `${artisansCount} artisan${artisansCount > 1 ? "s" : ""} actuellement actif${artisansCount > 1 ? "s" : ""} à ${villeNom}.`
            : `Bativio référence de nouveaux artisans à ${villeNom} chaque semaine. Vous êtes artisan ? `}
          {artisansCount === 0 && (
            <Link href="/inscription" style={{ color: "var(--terre,#C4531A)", fontStyle: "normal" }}>
              Inscrivez-vous gratuitement
            </Link>
          )}
        </p>
      </div>
    </section>
  );
}
