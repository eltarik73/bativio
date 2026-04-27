/**
 * Pilier 2 du cluster /pro/ : choix d'une plateforme agreee pour artisans (2000-2500 mots)
 *
 * Cible SEO : "plateforme agreee artisan", "comparatif plateforme agreee",
 * "choisir plateforme agreee", "PA artisan BTP", "PDP TPE".
 */
import type { Metadata } from "next";
import Link from "next/link";
import { safeJsonLd } from "@/lib/html-escape";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Plateforme agréée pour artisans : comment choisir en 2026",
  description: "Quelle plateforme agréée choisir quand on est artisan ? Critères, comparatif, budget, intégration logiciel devis. Guide spécifique BTP par Bativio.",
  keywords: "plateforme agreee artisan, comparatif PA, choisir plateforme agreee, PA BTP, PDP artisan, immatriculation DGFiP, Pennylane, Dougs, Azopio, Sequino, Tiime, IOPOLE",
  alternates: { canonical: "https://www.bativio.fr/pro/plateforme-agreee-artisan" },
  openGraph: {
    title: "Plateforme agréée pour artisans — Guide 2026 | Bativio",
    description: "Comparatif des PA pour artisans BTP : critères, prix, intégration. Le guide honnête par Bativio.",
    url: "https://www.bativio.fr/pro/plateforme-agreee-artisan",
    type: "article",
    locale: "fr_FR",
    images: [{ url: "https://www.bativio.fr/og-image.png", width: 1200, height: 630, alt: "Choisir une plateforme agréée artisan" }],
  },
  twitter: { card: "summary_large_image", title: "Plateforme agréée pour artisans", description: "Guide comparatif 2026." },
};

const FAQ = [
  { q: "Combien de plateformes agréées sont disponibles ?", a: "Au 16 février 2026, environ 108 plateformes ont été immatriculées ou sont en cours d'immatriculation par la DGFiP. La liste officielle évolue régulièrement, certaines plateformes étant en immatriculation 'sous réserve' (validation finale après vérification technique)." },
  { q: "Une plateforme agréée 'sous réserve' est-elle fiable ?", a: "L'immatriculation 'sous réserve' signifie que la plateforme a passé l'évaluation initiale mais doit encore prouver sa conformité technique en conditions réelles. La grande majorité des PA actuelles sont dans ce statut. Le statut définitif sera attribué après septembre 2026. Les PA sous réserve peuvent être utilisées légalement." },
  { q: "Puis-je changer de PA après en avoir choisi une ?", a: "Oui, vous pouvez changer de PA à tout moment. Vous devez juste mettre à jour votre désignation auprès de la DGFiP (l'opération se fait en quelques clics dans votre nouvelle PA). Vos archives restent dans l'ancienne PA pendant la durée légale de 10 ans." },
  { q: "Combien coûte une plateforme agréée ?", a: "Les tarifs varient énormément : de 0 € (PPF gratuit, mais sans valeur ajoutée) à 100 €/mois pour les PA premium. Pour les artisans TPE, comptez 19-40 €/mois pour une solution opérationnelle (Bativio à 19 €/mois inclut tout ; Pennylane à 30-60 €/mois mais non spécialisé BTP)." },
  { q: "Suis-je obligé d'avoir une PA ou puis-je utiliser le PPF gratuit ?", a: "Vous pouvez théoriquement utiliser uniquement le PPF (Portail Public de Facturation), mais ce n'est PAS recommandé. Le PPF se limite au transit basique : pas de valeur ajoutée (suivi de cycle de vie, intégration ERP, support, archivage à valeur probante). Pour un usage professionnel, une PA est quasi indispensable." },
  { q: "Qu'est-ce qui différencie une PA généraliste d'une PA spécialisée artisans ?", a: "Une PA généraliste (Pennylane, Dougs, Sage) gère tous types d'entreprises mais nécessite souvent un expert-comptable et n'a pas les spécificités BTP (multi-TVA 5,5/10/20 %, sous-traitance auto-liquidée, situations de travaux). Une solution spécialisée artisans (Bativio, Azopio) connaît votre métier et propose des templates de devis adaptés." },
  { q: "Que se passe-t-il si ma PA fait faillite ?", a: "La DGFiP a prévu une obligation de portabilité des données : votre PA doit pouvoir transférer vos archives à une autre PA en cas de cessation. Vos factures restent accessibles. Mieux vaut quand même choisir une PA stable et historique pour éviter les complications." },
];

export default function PlateformeAgreeArtisanPage() {
  return (
    <>
      <nav aria-label="Fil d'Ariane" style={{ fontSize: 13, color: "#9C958D", marginBottom: 24 }}>
        <Link href="/" style={{ color: "inherit", textDecoration: "none" }}>Accueil</Link>
        <span style={{ margin: "0 8px" }}>›</span>
        <Link href="/pro" style={{ color: "inherit", textDecoration: "none" }}>Pro</Link>
        <span style={{ margin: "0 8px" }}>›</span>
        <span style={{ color: "#3D2E1F" }}>Plateforme agréée</span>
      </nav>

      <article style={{ maxWidth: 800, margin: "0 auto" }}>
        <header style={{ marginBottom: 32 }}>
          <h1 style={{ fontFamily: "'Fraunces',serif", fontSize: "clamp(28px,4vw,40px)", fontWeight: 700, color: "#1C1C1E", lineHeight: 1.15, marginBottom: 16 }}>
            Plateforme agr&eacute;&eacute;e pour artisans : comment faire le bon choix
          </h1>
          <p style={{ fontSize: 17, color: "#6B6560", lineHeight: 1.6 }}>
            108 plateformes immatricul&eacute;es DGFiP, 4 sigles &agrave; conna&icirc;tre,
            5 crit&egrave;res sp&eacute;cifiques aux artisans BTP : voici notre guide
            comparatif honn&ecirc;te.
          </p>
          <div style={{ fontSize: 12, color: "#9C958D", marginTop: 12 }}>
            Mis &agrave; jour le 27 avril 2026 &middot; Lecture 9 min
          </div>
        </header>

        {/* 1. PA, PDP, OD, SC */}
        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 24, fontWeight: 700, color: "#1C1C1E", marginBottom: 14 }}>
            1. PA, PDP, OD, SC : d&eacute;m&ecirc;ler les sigles
          </h2>
          <p style={{ fontSize: 15, color: "#3D2E1F", lineHeight: 1.7, marginBottom: 12 }}>
            Avant de choisir, comprenez le vocabulaire officiel :
          </p>
          <ul style={{ fontSize: 15, color: "#3D2E1F", lineHeight: 1.7, paddingLeft: 24 }}>
            <li><strong>PA</strong> (Plateforme Agr&eacute;&eacute;e) : nom officiel actuel d&apos;un op&eacute;rateur immatricul&eacute; par la DGFiP. Synonyme de PDP.</li>
            <li><strong>PDP</strong> (Plateforme de D&eacute;mat&eacute;rialisation Partenaire) : ancien nom (utilis&eacute; jusqu&apos;en 2024). M&ecirc;me r&ocirc;le.</li>
            <li><strong>OD</strong> (Op&eacute;rateur de D&eacute;mat&eacute;rialisation) : sous-traitant non immatricul&eacute; qui propose des fonctionnalit&eacute;s &agrave; une PA. Ne peut PAS &eacute;mettre/recevoir directement.</li>
            <li><strong>SC</strong> (Solution Compatible) : logiciel qui produit des factures &eacute;lectroniques mais doit transiter par une PA pour l&apos;envoi r&eacute;el.</li>
            <li><strong>PPF</strong> (Portail Public de Facturation) : infrastructure &Eacute;tat g&eacute;r&eacute;e par AIFE. Annuaire central + transit basique. Gratuit mais sans valeur ajout&eacute;e.</li>
          </ul>
          <p style={{ fontSize: 14, color: "#6B6560", lineHeight: 1.6, marginTop: 12, fontStyle: "italic" }}>
            Pour vous : votre interlocuteur est une PA. Tout le reste est en arri&egrave;re-plan.
          </p>
        </section>

        {/* 2. Criteres */}
        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 24, fontWeight: 700, color: "#1C1C1E", marginBottom: 14 }}>
            2. Les 5 crit&egrave;res de choix pour un artisan
          </h2>
          <ol style={{ fontSize: 15, color: "#3D2E1F", lineHeight: 1.7, paddingLeft: 24 }}>
            <li>
              <strong>Int&eacute;gration logiciel devis-facture</strong> &mdash; une PA seule ne sert &agrave; rien si vous devez ressaisir vos factures dans un autre outil.
              Cherchez une solution o&ugrave; tout est int&eacute;gr&eacute; (Bativio + Invoquo, ou Pennylane standalone).
            </li>
            <li style={{ marginTop: 8 }}>
              <strong>Co&ucirc;t total mensuel</strong> &mdash; ne vous contentez pas du tarif PA. Ajoutez : abonnement logiciel devis-facture, abonnement comptable si requis, frais de paiement en ligne.
              Une solution &agrave; 19 &euro;/mois tout-inclus est souvent moins ch&egrave;re qu&apos;une combinaison de 3 outils &agrave; 10 &euro;/mois chacun.
            </li>
            <li style={{ marginTop: 8 }}>
              <strong>Sp&eacute;cificit&eacute;s BTP</strong> &mdash; multi-TVA 5,5/10/20 %, auto-liquidation, situations de travaux, retenue de garantie.
              Si la PA ne g&egrave;re pas ces cas natifs, vous passerez votre temps &agrave; corriger manuellement.
            </li>
            <li style={{ marginTop: 8 }}>
              <strong>Support en fran&ccedil;ais (humain)</strong> &mdash; en p&eacute;riode de bascule (sept. 2026), un support r&eacute;actif est crucial.
              T&eacute;l&eacute;phone, chat ou email dans la journ&eacute;e ouvr&eacute;e. M&eacute;fiance des PA &eacute;trang&egrave;res sans support FR.
            </li>
            <li style={{ marginTop: 8 }}>
              <strong>P&eacute;rennit&eacute;</strong> &mdash; pr&eacute;f&eacute;rez une PA avec immatriculation d&eacute;finitive et une entreprise &eacute;tablie depuis &ge; 2 ans.
              &Eacute;vitez les PA r&eacute;cemment cr&eacute;&eacute;es uniquement pour la r&eacute;forme : risque de cessation d&apos;activit&eacute; en cas d&apos;&eacute;chec commercial.
            </li>
          </ol>
        </section>

        {/* 3. Comparatif */}
        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 24, fontWeight: 700, color: "#1C1C1E", marginBottom: 14 }}>
            3. Comparatif des PA orient&eacute;es TPE / artisans
          </h2>
          <p style={{ fontSize: 15, color: "#3D2E1F", lineHeight: 1.7, marginBottom: 16 }}>
            Comparatif honn&ecirc;te (avec nos limites) sur les solutions les plus pertinentes
            pour un artisan du b&acirc;timent en 2026 :
          </p>
          <div style={{ overflowX: "auto", marginBottom: 16 }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, minWidth: 700 }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #C4531A", background: "#FAF8F5" }}>
                  <th style={{ textAlign: "left", padding: "10px 8px", fontWeight: 700, color: "#1C1C1E" }}>Solution</th>
                  <th style={{ textAlign: "left", padding: "10px 8px", fontWeight: 700, color: "#1C1C1E" }}>Prix /mois</th>
                  <th style={{ textAlign: "left", padding: "10px 8px", fontWeight: 700, color: "#1C1C1E" }}>Cible</th>
                  <th style={{ textAlign: "left", padding: "10px 8px", fontWeight: 700, color: "#1C1C1E" }}>BTP-friendly</th>
                  <th style={{ textAlign: "left", padding: "10px 8px", fontWeight: 700, color: "#1C1C1E" }}>Statut PA</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: "1px solid #EDEBE7" }}>
                  <td style={{ padding: "10px 8px", color: "#1C1C1E", fontWeight: 600 }}>Bativio + Invoquo</td>
                  <td style={{ padding: "10px 8px" }}>19-59 &euro;</td>
                  <td style={{ padding: "10px 8px" }}>Artisans BTP</td>
                  <td style={{ padding: "10px 8px", color: "#16a34a" }}>OUI native</td>
                  <td style={{ padding: "10px 8px" }}>PA via Invoquo</td>
                </tr>
                <tr style={{ borderBottom: "1px solid #EDEBE7" }}>
                  <td style={{ padding: "10px 8px", fontWeight: 600 }}>Pennylane</td>
                  <td style={{ padding: "10px 8px" }}>30-60 &euro;</td>
                  <td style={{ padding: "10px 8px" }}>TPE g&eacute;n&eacute;raliste</td>
                  <td style={{ padding: "10px 8px", color: "#9C958D" }}>Limit&eacute;</td>
                  <td style={{ padding: "10px 8px" }}>PA immatricul&eacute;e</td>
                </tr>
                <tr style={{ borderBottom: "1px solid #EDEBE7" }}>
                  <td style={{ padding: "10px 8px", fontWeight: 600 }}>Dougs</td>
                  <td style={{ padding: "10px 8px" }}>49-99 &euro;</td>
                  <td style={{ padding: "10px 8px" }}>TPE + expert-comptable</td>
                  <td style={{ padding: "10px 8px", color: "#9C958D" }}>Limit&eacute;</td>
                  <td style={{ padding: "10px 8px" }}>PA immatricul&eacute;e</td>
                </tr>
                <tr style={{ borderBottom: "1px solid #EDEBE7" }}>
                  <td style={{ padding: "10px 8px", fontWeight: 600 }}>Azopio</td>
                  <td style={{ padding: "10px 8px" }}>~30 &euro;</td>
                  <td style={{ padding: "10px 8px" }}>BTP, TP, PME</td>
                  <td style={{ padding: "10px 8px", color: "#16a34a" }}>OUI</td>
                  <td style={{ padding: "10px 8px" }}>PA immatricul&eacute;e</td>
                </tr>
                <tr style={{ borderBottom: "1px solid #EDEBE7" }}>
                  <td style={{ padding: "10px 8px", fontWeight: 600 }}>EBP / Sage / Cegid</td>
                  <td style={{ padding: "10px 8px" }}>50-200 &euro;</td>
                  <td style={{ padding: "10px 8px" }}>PME &eacute;tablies</td>
                  <td style={{ padding: "10px 8px", color: "#16a34a" }}>OUI</td>
                  <td style={{ padding: "10px 8px" }}>PA immatricul&eacute;e</td>
                </tr>
                <tr>
                  <td style={{ padding: "10px 8px", fontWeight: 600 }}>Sequino, Tiime, IOPOLE</td>
                  <td style={{ padding: "10px 8px" }}>varies</td>
                  <td style={{ padding: "10px 8px" }}>API/backend pour SaaS</td>
                  <td style={{ padding: "10px 8px", color: "#9C958D" }}>n/a (B2B2B)</td>
                  <td style={{ padding: "10px 8px" }}>PA immatricul&eacute;e</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p style={{ fontSize: 14, color: "#6B6560", lineHeight: 1.6, fontStyle: "italic" }}>
            Note de transparence : Bativio est notre solution. Nous nous comparons honn&ecirc;tement
            aux autres. Si Pennylane convient mieux &agrave; un cabinet d&apos;expertise comptable,
            il est plus cher mais plus puissant comptable. Si vous voulez juste &eacute;mettre
            des factures BTP simplement et rapidement, Bativio est plus adapt&eacute; et moins cher.
          </p>
        </section>

        {/* 4. Erreurs a eviter */}
        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 24, fontWeight: 700, color: "#1C1C1E", marginBottom: 14 }}>
            4. Erreurs &agrave; &eacute;viter
          </h2>
          <ul style={{ fontSize: 15, color: "#3D2E1F", lineHeight: 1.7, paddingLeft: 24 }}>
            <li><strong>Choisir uniquement sur le prix</strong> &mdash; une PA &agrave; 5 &euro;/mois sans support ni multi-TVA vous co&ucirc;tera 100 &euro;/mois en perte de temps.</li>
            <li><strong>Attendre le 31 ao&ucirc;t 2026</strong> &mdash; toutes les PA seront satur&eacute;es. Anticipez d&egrave;s mai-juin 2026.</li>
            <li><strong>Choisir une PA &eacute;trang&egrave;re sans support FR</strong> &mdash; m&ecirc;me si l&apos;immatriculation est OK, vous serez seul en cas de pb.</li>
            <li><strong>N&eacute;gliger l&apos;export des donn&eacute;es</strong> &mdash; v&eacute;rifiez que la PA permet l&apos;export Excel/PDF/FEC pour votre comptable.</li>
            <li><strong>Garder son ancien logiciel + ajouter une PA &agrave; c&ocirc;t&eacute;</strong> &mdash; double saisie garantie, erreurs assur&eacute;es. Pr&eacute;f&eacute;rez une solution int&eacute;gr&eacute;e.</li>
          </ul>
        </section>

        {/* 5. FAQ */}
        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 24, fontWeight: 700, color: "#1C1C1E", marginBottom: 14 }}>
            5. Questions fr&eacute;quentes
          </h2>
          {FAQ.map((f, i) => (
            <div key={i} style={{ borderBottom: "1px solid #EDEBE7", padding: "16px 0" }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: "#1C1C1E", marginBottom: 6 }}>{f.q}</h3>
              <p style={{ fontSize: 14, color: "#6B6560", lineHeight: 1.6 }}>{f.a}</p>
            </div>
          ))}
        </section>

        {/* A lire aussi */}
        <section style={{ background: "#fff", border: "1px solid #E8D5C0", borderRadius: 12, padding: 24, marginTop: 40 }}>
          <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 18, fontWeight: 700, color: "#1C1C1E", marginBottom: 12 }}>
            &Agrave; lire aussi
          </h2>
          <ul style={{ fontSize: 14, lineHeight: 1.8, paddingLeft: 18 }}>
            <li><Link href="/pro/facturation-electronique-2026" style={{ color: "#C4531A" }}>Facturation &eacute;lectronique 2026 : guide complet pour artisans</Link></li>
            <li><Link href="/pro/facture-electronique-btp" style={{ color: "#C4531A" }}>Facture &eacute;lectronique BTP : multi-TVA, sous-traitance, retenue</Link></li>
            <li><Link href="/pro/mentions-obligatoires-2026" style={{ color: "#C4531A" }}>Les nouvelles mentions obligatoires sur les factures d&egrave;s 2026</Link></li>
            <li><Link href="/pro/glossaire" style={{ color: "#C4531A" }}>Glossaire de la facturation &eacute;lectronique (PA, PPF, e-reporting&hellip;)</Link></li>
          </ul>
        </section>
      </article>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd({
        "@context": "https://schema.org",
        "@type": "Article",
        headline: "Plateforme agréée pour artisans : comment faire le bon choix",
        description: "Guide comparatif des plateformes agréées DGFiP pour artisans BTP en 2026.",
        author: { "@type": "Organization", name: "Bativio", url: "https://www.bativio.fr" },
        publisher: { "@type": "Organization", name: "Bativio" },
        datePublished: "2026-04-27",
        dateModified: "2026-04-27",
        mainEntityOfPage: { "@type": "WebPage", "@id": "https://www.bativio.fr/pro/plateforme-agreee-artisan" },
      }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
      }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Accueil", item: "https://www.bativio.fr" },
          { "@type": "ListItem", position: 2, name: "Pro", item: "https://www.bativio.fr/pro" },
          { "@type": "ListItem", position: 3, name: "Plateforme agréée", item: "https://www.bativio.fr/pro/plateforme-agreee-artisan" },
        ],
      }) }} />
    </>
  );
}
