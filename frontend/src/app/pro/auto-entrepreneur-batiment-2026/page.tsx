/**
 * Satellite 4 : Auto-entrepreneur du batiment et facturation 2026 (~1800 mots).
 *
 * Cible SEO : "auto-entrepreneur batiment 2026", "facturation electronique micro-entreprise BTP",
 * "franchise TVA artisan 2026", "auto-entrepreneur PA designation".
 */
import type { Metadata } from "next";
import Link from "next/link";
import { safeJsonLd } from "@/lib/html-escape";

export const revalidate = 604800;

export const metadata: Metadata = {
  title: "Auto-entrepreneur du bâtiment et facturation 2026 : ce qui change",
  description: "Auto-entrepreneur dans le BTP : quelles obligations en 2026 ? Plateforme agréée, franchise de TVA, mentions, sanctions. Guide spécifique Bativio.",
  keywords: "auto-entrepreneur batiment 2026, micro-entreprise BTP facturation, franchise TVA artisan, auto-entrepreneur PA, mention 293 B, plafond auto-entrepreneur",
  alternates: { canonical: "https://www.bativio.fr/pro/auto-entrepreneur-batiment-2026" },
  openGraph: {
    title: "Auto-entrepreneur du bâtiment et facturation 2026 | Bativio",
    description: "Calendrier, franchise TVA, mentions, choix de PA : guide spécifique micro-entreprise BTP.",
    url: "https://www.bativio.fr/pro/auto-entrepreneur-batiment-2026",
    type: "article",
    locale: "fr_FR",
    images: [{ url: "https://www.bativio.fr/og-image.png", width: 1200, height: 630, alt: "Auto-entrepreneur BTP 2026" }],
  },
  twitter: { card: "summary_large_image", title: "Auto-entrepreneur BTP et 2026", description: "Vos obligations expliquées." },
};

const FAQ = [
  { q: "Auto-entrepreneur en franchise de TVA, je suis vraiment concerné par 2026 ?", a: "OUI, sans exception. La franchise de TVA (article 293 B du CGI) ne vous dispense PAS de la facturation électronique. Vous devez : (1) recevoir vos factures fournisseurs en électronique dès septembre 2026, (2) émettre vos factures B2B en électronique dès septembre 2027, (3) faire le e-reporting de vos transactions B2C automatiquement via votre PA." },
  { q: "Je facture uniquement des particuliers, ai-je besoin d'une PA ?", a: "Vous n'avez pas l'obligation d'émettre vos factures B2C en format électronique. MAIS vous devez faire le e-reporting des transactions et des paiements à la DGFiP. Le e-reporting passe par une PA. Donc oui, vous devez désigner une PA dans l'annuaire central, même pour du B2C exclusif." },
  { q: "Le plafond de la franchise de TVA évolue en 2026 ?", a: "Les seuils 2026 restent : 36 800 € HT/an pour les prestations de services BTP (main d'œuvre principalement), 91 900 € HT/an pour les ventes de biens (matériaux). Si vous dépassez en 2 années consécutives, vous basculez assujetti à la TVA l'année suivante. Le ministère a annoncé une stabilité des seuils pour la durée du quinquennat." },
  { q: "Combien coûte une PA quand on est auto-entrepreneur avec peu de factures ?", a: "Le PPF (Portail Public de Facturation) est techniquement gratuit mais sans valeur ajoutée. Pour une vraie solution opérationnelle, comptez 19 €/mois (Bativio Starter) à 30 €/mois (Pennylane). Sur l'année, ~228 €. À comparer aux ~50-100 € d'amende que vous risqueriez par facture non conforme." },
  { q: "Puis-je rester sur Word/Excel pour mes factures jusqu'en 2027 ?", a: "Non, vous devez impérativement basculer sur un logiciel compatible Factur-X (ou un autre format conforme) avant septembre 2027. Word et Excel ne génèrent pas le XML structuré requis. La transition prend en moyenne 1 mois (création de catalogue, configuration), donc commencez à anticiper dès le printemps 2027." },
  { q: "Bativio Gratuit suffit-il pour un auto-entrepreneur BTP ?", a: "Le plan Gratuit permet d'avoir une fiche annuaire et de recevoir des demandes de devis (5 leads/mois). Mais pour ÉMETTRE des factures conformes Factur-X, il faut basculer sur Starter (19 €/mois) qui inclut la facturation électronique via Invoquo. Le plan Gratuit ne suffit pas pour la conformité 2026/2027." },
];

export default function AutoEntrepreneurBatiment2026Page() {
  return (
    <>
      <nav aria-label="Fil d'Ariane" style={{ fontSize: 13, color: "#9C958D", marginBottom: 24 }}>
        <Link href="/" style={{ color: "inherit", textDecoration: "none" }}>Accueil</Link>
        <span style={{ margin: "0 8px" }}>›</span>
        <Link href="/pro" style={{ color: "inherit", textDecoration: "none" }}>Pro</Link>
        <span style={{ margin: "0 8px" }}>›</span>
        <span style={{ color: "#3D2E1F" }}>Auto-entrepreneur</span>
      </nav>

      <article style={{ maxWidth: 800, margin: "0 auto" }}>
        <header style={{ marginBottom: 32 }}>
          <h1 style={{ fontFamily: "'Fraunces',serif", fontSize: "clamp(28px,4vw,40px)", fontWeight: 700, color: "#1C1C1E", lineHeight: 1.15, marginBottom: 16 }}>
            Auto-entrepreneur du b&acirc;timent et facturation 2026 : ce qui change
          </h1>
          <p style={{ fontSize: 17, color: "#6B6560", lineHeight: 1.6 }}>
            Auto-entrepreneur, micro-entreprise, plombier ou &eacute;lectricien sous le seuil
            de TVA : oui, vous &ecirc;tes concern&eacute; par la r&eacute;forme 2026. Voici
            ce qu&apos;il faut savoir, sans bla-bla.
          </p>
          <div style={{ fontSize: 12, color: "#9C958D", marginTop: 12 }}>
            Mis &agrave; jour le 28 avril 2026 &middot; Lecture 9 min
          </div>
        </header>

        {/* 1. Suis-je concerne ? */}
        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 24, fontWeight: 700, color: "#1C1C1E", marginBottom: 14 }}>
            1. Auto-entrepreneur : suis-je concern&eacute; ?
          </h2>
          <p style={{ fontSize: 15, color: "#3D2E1F", lineHeight: 1.7, marginBottom: 12 }}>
            <strong>OUI, sans exception.</strong> La r&eacute;forme de la facturation
            &eacute;lectronique 2026 s&apos;applique &agrave; <em>toutes les entreprises
            fran&ccedil;aises</em> assujetties &agrave; la TVA, y compris les
            micro-entreprises et auto-entrepreneurs en franchise de TVA.
          </p>
          <p style={{ fontSize: 15, color: "#3D2E1F", lineHeight: 1.7, marginBottom: 12 }}>
            Une id&eacute;e re&ccedil;ue : &laquo; je suis en franchise de TVA, donc je ne
            suis pas concern&eacute; &raquo;. <strong>FAUX.</strong> La franchise de TVA
            (article 293 B du CGI) vous dispense de facturer la TVA &agrave; vos clients,
            mais ne vous dispense pas de respecter le format de la facture &eacute;lectronique
            ni le e-reporting.
          </p>
          <p style={{ fontSize: 15, color: "#3D2E1F", lineHeight: 1.7 }}>
            Concr&egrave;tement, en tant qu&apos;auto-entrepreneur du b&acirc;timent, vous
            avez 3 obligations en 2026/2027 :
          </p>
          <ul style={{ fontSize: 15, color: "#3D2E1F", lineHeight: 1.7, paddingLeft: 24, marginTop: 8 }}>
            <li><strong>D&eacute;signer une plateforme agr&eacute;&eacute;e</strong> dans l&apos;annuaire central avant septembre 2026.</li>
            <li><strong>Recevoir vos factures fournisseurs</strong> au format &eacute;lectronique d&egrave;s septembre 2026.</li>
            <li><strong>&Eacute;mettre vos factures B2B</strong> au format &eacute;lectronique d&egrave;s septembre 2027.</li>
          </ul>
        </section>

        {/* 2. Calendrier specifique micro */}
        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 24, fontWeight: 700, color: "#1C1C1E", marginBottom: 14 }}>
            2. Calendrier sp&eacute;cifique aux micro-entreprises
          </h2>
          <div style={{ background: "#FAF8F5", border: "1px solid #E8D5C0", borderRadius: 12, padding: 16, marginBottom: 16 }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #C4531A" }}>
                  <th style={{ textAlign: "left", padding: "8px 4px", color: "#1C1C1E" }}>Date</th>
                  <th style={{ textAlign: "left", padding: "8px 4px", color: "#1C1C1E" }}>Obligation</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: "1px solid #EDEBE7" }}>
                  <td style={{ padding: "10px 4px", color: "#C4531A", fontWeight: 700 }}>Avant 1er sept. 2026</td>
                  <td style={{ padding: "10px 4px" }}>D&eacute;signer une PA dans l&apos;annuaire central</td>
                </tr>
                <tr style={{ borderBottom: "1px solid #EDEBE7" }}>
                  <td style={{ padding: "10px 4px", color: "#C4531A", fontWeight: 700 }}>1er sept. 2026</td>
                  <td style={{ padding: "10px 4px" }}>Recevoir factures fournisseurs en &eacute;lectronique</td>
                </tr>
                <tr>
                  <td style={{ padding: "10px 4px", color: "#C4531A", fontWeight: 700 }}>1er sept. 2027</td>
                  <td style={{ padding: "10px 4px" }}>&Eacute;mettre factures B2B en &eacute;lectronique + e-reporting B2C</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p style={{ fontSize: 14, color: "#6B6560", lineHeight: 1.6, fontStyle: "italic" }}>
            Vous avez donc <strong>1 an de plus</strong> que les grandes entreprises pour
            l&apos;&eacute;mission. Mais ne attendez pas la derni&egrave;re minute : la
            transition op&eacute;rationnelle (choix PA, configuration logiciel, formation
            si vous avez un comptable) prend 1-2 mois.
          </p>
        </section>

        {/* 3. Franchise TVA */}
        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 24, fontWeight: 700, color: "#1C1C1E", marginBottom: 14 }}>
            3. Le cas de la franchise de TVA
          </h2>
          <p style={{ fontSize: 15, color: "#3D2E1F", lineHeight: 1.7, marginBottom: 12 }}>
            La <strong>franchise de TVA</strong> est le r&eacute;gime par d&eacute;faut des
            auto-entrepreneurs. Elle dispense de collecter la TVA tant que votre chiffre
            d&apos;affaires reste sous les seuils suivants (en 2026) :
          </p>
          <ul style={{ fontSize: 15, color: "#3D2E1F", lineHeight: 1.7, paddingLeft: 24, marginBottom: 12 }}>
            <li><strong>36 800 &euro; HT/an</strong> pour les prestations de services BTP (main d&apos;&oelig;uvre principalement)</li>
            <li><strong>91 900 &euro; HT/an</strong> pour les ventes de biens (mat&eacute;riaux refactur&eacute;s, par ex.)</li>
            <li>Pour les artisans BTP qui combinent les 2 (mat&eacute;riaux + main d&apos;&oelig;uvre), un seuil mixte s&apos;applique</li>
          </ul>
          <p style={{ fontSize: 15, color: "#3D2E1F", lineHeight: 1.7, marginBottom: 12 }}>
            En franchise de TVA, vos factures doivent contenir une <strong>mention
            sp&eacute;cifique</strong> :
          </p>
          <div style={{ background: "#FAF8F5", border: "1px solid #E8D5C0", borderRadius: 8, padding: 16, marginBottom: 12, fontFamily: "monospace", fontSize: 13, color: "#3D2E1F" }}>
            &laquo; TVA non applicable, art. 293 B du CGI &raquo;
          </div>
          <p style={{ fontSize: 15, color: "#3D2E1F", lineHeight: 1.7 }}>
            Sans cette mention, votre client professionnel pourrait croire que la TVA
            est incluse et la d&eacute;duire indument. C&apos;est une erreur fr&eacute;quente
            et sanctionn&eacute;e (rectification fiscale + amende). Bativio ajoute
            automatiquement cette mention si vous avez d&eacute;clar&eacute; &ecirc;tre en franchise.
          </p>
          <p style={{ fontSize: 15, color: "#3D2E1F", lineHeight: 1.7, marginTop: 12 }}>
            Autres points :
          </p>
          <ul style={{ fontSize: 15, color: "#3D2E1F", lineHeight: 1.7, paddingLeft: 24 }}>
            <li>Pas de num&eacute;ro de TVA intracommunautaire (sauf si demand&eacute; sp&eacute;cifiquement)</li>
            <li>Pas de taux de TVA sur les lignes (puisque pas applicable)</li>
            <li>Pas de d&eacute;duction de TVA sur vos achats (mat&eacute;riaux, sous-traitants)</li>
            <li>Vous restez assujetti aux <strong>autres mentions obligatoires</strong> 2026 (SIREN client, adresse livraison, cat&eacute;gorie d&apos;op&eacute;ration)</li>
          </ul>
        </section>

        {/* 4. Choisir une PA */}
        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 24, fontWeight: 700, color: "#1C1C1E", marginBottom: 14 }}>
            4. Choisir une PA quand on est auto-entrepreneur
          </h2>
          <p style={{ fontSize: 15, color: "#3D2E1F", lineHeight: 1.7, marginBottom: 12 }}>
            Crit&egrave;res sp&eacute;cifiques aux auto-entrepreneurs (en plus des
            <Link href="/pro/plateforme-agreee-artisan" style={{ color: "#C4531A", textDecoration: "underline" }}>
              {" "}5 crit&egrave;res g&eacute;n&eacute;raux
            </Link>) :
          </p>
          <ul style={{ fontSize: 15, color: "#3D2E1F", lineHeight: 1.7, paddingLeft: 24, marginBottom: 12 }}>
            <li><strong>Co&ucirc;t mensuel bas</strong> : entre 0 et 30 &euro;/mois maximum (vos marges sont limit&eacute;es). &Eacute;vitez Pennylane (60 &euro;), Dougs (99 &euro;), EBP (200 &euro;).</li>
            <li><strong>Pas d&apos;engagement annuel</strong> : si vous arr&ecirc;tez l&apos;activit&eacute; ou changez de statut, vous ne devez pas &ecirc;tre bloqu&eacute;.</li>
            <li><strong>Simplicit&eacute; UX</strong> : pas de jargon comptable. Devis et facture en 30 secondes max.</li>
            <li><strong>G&eacute;n&eacute;ration auto de la mention 293 B</strong> : pas de saisie manuelle &agrave; chaque facture.</li>
            <li><strong>Support FR avec exp&eacute;rience auto-entrepreneur</strong> : un support qui sait g&eacute;rer la franchise de TVA, la d&eacute;claration URSSAF, le passage assujetti.</li>
          </ul>
          <p style={{ fontSize: 15, color: "#3D2E1F", lineHeight: 1.7 }}>
            <strong>Notre recommandation</strong> : Bativio Starter (19 &euro;/mois) inclut tous
            ces crit&egrave;res, plus l&apos;annuaire SEO local pour gagner des clients (un
            avantage massif quand on d&eacute;bute en auto-entrepreneur).
          </p>
        </section>

        {/* 5. Bativio Gratuit suffit ? */}
        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 24, fontWeight: 700, color: "#1C1C1E", marginBottom: 14 }}>
            5. Bativio Gratuit : adapt&eacute; aux auto-entrepreneurs ?
          </h2>
          <p style={{ fontSize: 15, color: "#3D2E1F", lineHeight: 1.7, marginBottom: 12 }}>
            Le <strong>plan Gratuit de Bativio</strong> (0 &euro;/mois) est utile pour
            d&eacute;marrer mais a des limites pour la conformit&eacute; 2026 :
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 12 }}>
            <div style={{ background: "rgba(74,103,65,.05)", border: "1px solid rgba(74,103,65,.2)", borderRadius: 12, padding: 16 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#4A6741", marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>Inclus dans Gratuit</div>
              <ul style={{ fontSize: 13, color: "#3D2E1F", lineHeight: 1.6, paddingLeft: 18 }}>
                <li>Fiche annuaire SEO local</li>
                <li>R&eacute;ception 5 demandes de devis/mois</li>
                <li>3 photos de chantier</li>
                <li>Affichage page artisan publique</li>
              </ul>
            </div>
            <div style={{ background: "rgba(220,38,38,.05)", border: "1px solid rgba(220,38,38,.2)", borderRadius: 12, padding: 16 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#C4531A", marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>NON inclus (n&eacute;cessite Starter+)</div>
              <ul style={{ fontSize: 13, color: "#3D2E1F", lineHeight: 1.6, paddingLeft: 18 }}>
                <li>&Eacute;mission factures Factur-X</li>
                <li>Plateforme agr&eacute;&eacute;e (Invoquo)</li>
                <li>Devis illimit&eacute;s avec signature &eacute;lectronique</li>
                <li>e-reporting automatique</li>
              </ul>
            </div>
          </div>
          <p style={{ fontSize: 15, color: "#3D2E1F", lineHeight: 1.7 }}>
            Pour la conformit&eacute; 2026/2027, vous devez basculer sur le plan
            <strong> Starter (19 &euro;/mois)</strong>. C&apos;est le plus &eacute;conomique
            sur le march&eacute; pour un auto-entrepreneur conforme. Vous pouvez tester
            Gratuit pendant 1-2 mois pour voir l&apos;outil, puis upgrader avant
            septembre 2027.
          </p>
        </section>

        {/* 6. FAQ */}
        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 24, fontWeight: 700, color: "#1C1C1E", marginBottom: 14 }}>
            6. FAQ
          </h2>
          {FAQ.map((f, i) => (
            <div key={i} style={{ borderBottom: "1px solid #EDEBE7", padding: "16px 0" }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: "#1C1C1E", marginBottom: 6 }}>{f.q}</h3>
              <p style={{ fontSize: 14, color: "#6B6560", lineHeight: 1.6 }}>{f.a}</p>
            </div>
          ))}
        </section>

        <section style={{ background: "#fff", border: "1px solid #E8D5C0", borderRadius: 12, padding: 24, marginTop: 40 }}>
          <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 18, fontWeight: 700, color: "#1C1C1E", marginBottom: 12 }}>
            &Agrave; lire aussi
          </h2>
          <ul style={{ fontSize: 14, lineHeight: 1.8, paddingLeft: 18 }}>
            <li><Link href="/pro/facturation-electronique-2026" style={{ color: "#C4531A" }}>Guide complet r&eacute;forme 2026</Link></li>
            <li><Link href="/pro/comparatif-pa" style={{ color: "#C4531A" }}>Comparatif des plateformes agr&eacute;&eacute;es</Link></li>
            <li><Link href="/pro/sanctions-facturation-electronique" style={{ color: "#C4531A" }}>Sanctions facturation &eacute;lectronique</Link></li>
            <li><Link href="/pro/mentions-obligatoires-2026" style={{ color: "#C4531A" }}>Mentions obligatoires sur les factures</Link></li>
            <li><Link href="/pro/glossaire" style={{ color: "#C4531A" }}>Glossaire de la facturation &eacute;lectronique</Link></li>
          </ul>
        </section>
      </article>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd({
        "@context": "https://schema.org",
        "@type": "Article",
        headline: "Auto-entrepreneur du bâtiment et facturation 2026 : ce qui change",
        description: "Guide spécifique pour les micro-entreprises BTP : franchise TVA, choix de PA, calendrier.",
        author: { "@type": "Organization", name: "Bativio" },
        publisher: { "@type": "Organization", name: "Bativio" },
        datePublished: "2026-04-28",
        dateModified: "2026-04-28",
        mainEntityOfPage: { "@type": "WebPage", "@id": "https://www.bativio.fr/pro/auto-entrepreneur-batiment-2026" },
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
          { "@type": "ListItem", position: 3, name: "Auto-entrepreneur BTP", item: "https://www.bativio.fr/pro/auto-entrepreneur-batiment-2026" },
        ],
      }) }} />
    </>
  );
}
