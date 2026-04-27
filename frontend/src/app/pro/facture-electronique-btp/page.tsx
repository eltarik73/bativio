/**
 * Pilier 3 du cluster /pro/ : facture electronique BTP - cas particuliers (2000-2500 mots)
 *
 * Cible SEO : "facture electronique BTP", "multi-TVA artisan", "auto-liquidation TVA sous-traitance",
 * "retenue de garantie facture electronique", "situation de travaux electronique".
 */
import type { Metadata } from "next";
import Link from "next/link";
import { safeJsonLd } from "@/lib/html-escape";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Facture électronique BTP : spécificités, multi-TVA, sous-traitance",
  description: "La facture électronique dans le BTP : multi-TVA (5,5/10/20%), sous-traitance, situations de travaux, retenue de garantie. Le guide complet par Bativio.",
  keywords: "facture electronique BTP, multi-TVA artisan, auto-liquidation sous-traitance, situation de travaux, retenue de garantie, facture acompte BTP, TVA 5.5 10 20",
  alternates: { canonical: "https://www.bativio.fr/pro/facture-electronique-btp" },
  openGraph: {
    title: "Facture électronique BTP — Guide complet | Bativio",
    description: "Multi-TVA, sous-traitance, situations de travaux, retenue de garantie : tout sur la facture électronique pour artisans du bâtiment.",
    url: "https://www.bativio.fr/pro/facture-electronique-btp",
    type: "article",
    locale: "fr_FR",
    images: [{ url: "https://www.bativio.fr/og-image.png", width: 1200, height: 630, alt: "Facture électronique BTP" }],
  },
  twitter: { card: "summary_large_image", title: "Facture électronique BTP", description: "Spécificités multi-TVA, sous-traitance, retenue de garantie." },
};

const FAQ = [
  { q: "Quels taux de TVA s'appliquent dans le BTP ?", a: "3 taux : 5,5 % pour les travaux d'amélioration énergétique éligibles MaPrimeRénov' (PAC, isolation thermique, menuiseries A++), 10 % pour les travaux d'amélioration/rénovation/transformation/aménagement de logements achevés depuis plus de 2 ans (norme), 20 % pour les travaux sur logements neufs, locaux pros, ou en cas d'inéligibilité au taux réduit. Une même facture peut combiner les 3 taux." },
  { q: "Comment fonctionne l'auto-liquidation TVA en sous-traitance BTP ?", a: "Article 283 du CGI : lorsqu'un sous-traitant facture le donneur d'ordre (entreprise principale du chantier), le sous-traitant n'applique PAS la TVA. Il indique la mention 'Auto-liquidation - article 283-2 nonies du CGI' et c'est le donneur d'ordre qui collecte et paye la TVA à l'État. Évite la fraude TVA dans les chaînes de sous-traitance BTP." },
  { q: "Comment facturer une situation de travaux ?", a: "Pour les chantiers longs (> 1 mois), vous pouvez émettre des factures de situation correspondant à l'avancement des travaux (par ex : 30 % de la prestation prévue dans le devis). Chaque situation est une facture électronique conforme à part entière, mentionnant 'Facture de situation N°X sur N°Y' et le pourcentage d'avancement." },
  { q: "Comment gérer une facture d'acompte ?", a: "Une facture d'acompte est émise avant le démarrage du chantier (typiquement 30-40 % du devis). Elle doit mentionner 'Facture d'acompte' et calcule la TVA sur le montant encaissé. Lors de la facture de solde, vous déduisez les acomptes déjà facturés du total. Bativio gère automatiquement ce mécanisme." },
  { q: "Comment apparaît la retenue de garantie sur une facture électronique ?", a: "La retenue de garantie (typiquement 5 % du marché, conservée par le client pendant 1 an) doit apparaître en pied de facture comme une déduction. Elle réduit le montant à payer immédiatement mais NE modifie PAS la base TVA (la TVA est calculée sur le total HT initial). À l'expiration de la garantie, vous émettez une facture complémentaire pour récupérer la retenue." },
  { q: "Que se passe-t-il si je travaille pour un particulier ?", a: "Pour les transactions B2C (avec particuliers), vous n'êtes PAS soumis à la facturation électronique obligatoire au sens strict. Vous restez libre du format (papier, PDF email, électronique). MAIS vous devez faire le e-reporting des données de transaction à la DGFiP (transmission via votre PA). Bativio gère ça automatiquement." },
  { q: "Comment facturer un chantier en sous-traitance avec materiaux refacturés ?", a: "Si vous achetez les matériaux pour le chantier et les refacturez au donneur d'ordre, vous distinguez sur la facture : (1) les matériaux à leur prix d'achat (avec TVA collectée par le fournisseur du matériau, déductible) et (2) la main d'œuvre (en auto-liquidation pour le donneur d'ordre). Bativio sépare automatiquement les lignes." },
];

export default function FactureElectroniqueBtpPage() {
  return (
    <>
      <nav aria-label="Fil d'Ariane" style={{ fontSize: 13, color: "#9C958D", marginBottom: 24 }}>
        <Link href="/" style={{ color: "inherit", textDecoration: "none" }}>Accueil</Link>
        <span style={{ margin: "0 8px" }}>›</span>
        <Link href="/pro" style={{ color: "inherit", textDecoration: "none" }}>Pro</Link>
        <span style={{ margin: "0 8px" }}>›</span>
        <span style={{ color: "#3D2E1F" }}>Spécificités BTP</span>
      </nav>

      <article style={{ maxWidth: 800, margin: "0 auto" }}>
        <header style={{ marginBottom: 32 }}>
          <h1 style={{ fontFamily: "'Fraunces',serif", fontSize: "clamp(28px,4vw,40px)", fontWeight: 700, color: "#1C1C1E", lineHeight: 1.15, marginBottom: 16 }}>
            Facture &eacute;lectronique BTP : tout ce qui change pour les artisans
          </h1>
          <p style={{ fontSize: 17, color: "#6B6560", lineHeight: 1.6 }}>
            Multi-TVA, auto-liquidation, situations de travaux, retenue de garantie :
            les sp&eacute;cificit&eacute;s BTP que peu de plateformes g&eacute;n&eacute;ralistes
            g&egrave;rent correctement.
          </p>
          <div style={{ fontSize: 12, color: "#9C958D", marginTop: 12 }}>
            Mis &agrave; jour le 27 avril 2026 &middot; Lecture 11 min
          </div>
        </header>

        {/* 1. Pourquoi BTP est particulier */}
        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 24, fontWeight: 700, color: "#1C1C1E", marginBottom: 14 }}>
            1. Pourquoi le BTP est un cas particulier
          </h2>
          <p style={{ fontSize: 15, color: "#3D2E1F", lineHeight: 1.7, marginBottom: 12 }}>
            La facturation dans le BTP cumule plusieurs sp&eacute;cificit&eacute;s qui ne se
            retrouvent dans aucun autre secteur :
          </p>
          <ul style={{ fontSize: 15, color: "#3D2E1F", lineHeight: 1.7, paddingLeft: 24, marginBottom: 12 }}>
            <li><strong>Multi-TVA</strong> : 3 taux (5,5 / 10 / 20 %) souvent sur la m&ecirc;me facture (mat&eacute;riaux 20 %, main d&apos;&oelig;uvre 10 % en r&eacute;novation, &eacute;quipements RGE 5,5 %)</li>
            <li><strong>Sous-traitance en chaine</strong> avec auto-liquidation TVA (article 283 CGI)</li>
            <li><strong>Chantiers longs</strong> n&eacute;cessitant des factures de situation et d&apos;acompte</li>
            <li><strong>Retenue de garantie</strong> (5 % du march&eacute; pendant 1 an pour les march&eacute;s priv&eacute;s)</li>
            <li><strong>Mix B2B et B2C</strong> sur le m&ecirc;me chantier (un particulier finance un syndic professionnel)</li>
            <li><strong>Mat&eacute;riaux refactur&eacute;s</strong> en plus de la main d&apos;&oelig;uvre</li>
          </ul>
          <p style={{ fontSize: 15, color: "#3D2E1F", lineHeight: 1.7 }}>
            La plupart des plateformes agr&eacute;&eacute;es g&eacute;n&eacute;ralistes (Pennylane,
            Dougs, Sage standard) n&apos;ont pas ces cas natifs : vous devez les contourner
            manuellement, ce qui multiplie les erreurs et le temps de saisie.
          </p>
        </section>

        {/* 2. Multi-TVA */}
        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 24, fontWeight: 700, color: "#1C1C1E", marginBottom: 14 }}>
            2. La gestion du multi-TVA
          </h2>
          <p style={{ fontSize: 15, color: "#3D2E1F", lineHeight: 1.7, marginBottom: 12 }}>
            Trois taux applicables aux artisans du b&acirc;timent :
          </p>
          <div style={{ background: "#FAF8F5", border: "1px solid #E8D5C0", borderRadius: 12, padding: 16, marginBottom: 16 }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #E8D5C0" }}>
                  <th style={{ textAlign: "left", padding: "8px 4px", color: "#1C1C1E" }}>Taux</th>
                  <th style={{ textAlign: "left", padding: "8px 4px", color: "#1C1C1E" }}>Cas d&apos;application</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: "1px solid #EDEBE7" }}>
                  <td style={{ padding: "8px 4px", color: "#C4531A", fontWeight: 700 }}>5,5 %</td>
                  <td style={{ padding: "8px 4px" }}>Travaux d&apos;am&eacute;lioration &eacute;nerg&eacute;tique &eacute;ligibles MaPrimeR&eacute;nov&apos; (pompe &agrave; chaleur, isolation thermique, menuiseries A++, chaudi&egrave;re biomasse). N&eacute;cessite une attestation client + facture RGE.</td>
                </tr>
                <tr style={{ borderBottom: "1px solid #EDEBE7" }}>
                  <td style={{ padding: "8px 4px", color: "#C4531A", fontWeight: 700 }}>10 %</td>
                  <td style={{ padding: "8px 4px" }}>Travaux d&apos;am&eacute;lioration / r&eacute;novation / transformation / am&eacute;nagement de logements <strong>achev&eacute;s depuis plus de 2 ans</strong>. C&apos;est le taux par d&eacute;faut sur le r&eacute;sidentiel anciens.</td>
                </tr>
                <tr>
                  <td style={{ padding: "8px 4px", color: "#C4531A", fontWeight: 700 }}>20 %</td>
                  <td style={{ padding: "8px 4px" }}>Travaux sur logements neufs (&lt; 2 ans), locaux professionnels, am&eacute;nagement ext&eacute;rieur (terrasse, piscine, espaces verts), entretien courant.</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p style={{ fontSize: 15, color: "#3D2E1F", lineHeight: 1.7, marginBottom: 12 }}>
            <strong>Cas concret</strong> : r&eacute;novation salle de bain dans un appartement de
            1995 (logement &gt; 2 ans, donc taux 10 %) avec installation d&apos;une PAC
            air-eau (5,5 % si certifi&eacute; RGE) + carrelage (10 %) + faience murale neuve
            (10 %) + main d&apos;&oelig;uvre (10 %).
          </p>
          <p style={{ fontSize: 15, color: "#3D2E1F", lineHeight: 1.7 }}>
            Bativio s&eacute;pare automatiquement les lignes par taux et calcule la TVA
            collect&eacute;e par taux. Le bordereau de facture &eacute;lectronique pr&eacute;sente
            un sous-total HT/TVA/TTC par taux + un total g&eacute;n&eacute;ral, conforme au
            mod&egrave;le Factur-X / EN16931.
          </p>
        </section>

        {/* 3. Sous-traitance */}
        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 24, fontWeight: 700, color: "#1C1C1E", marginBottom: 14 }}>
            3. La sous-traitance dans la cha&icirc;ne &eacute;lectronique
          </h2>
          <p style={{ fontSize: 15, color: "#3D2E1F", lineHeight: 1.7, marginBottom: 12 }}>
            L&apos;article 283-2 nonies du CGI pr&eacute;voit l&apos;<strong>auto-liquidation
            de la TVA</strong> en sous-traitance BTP. Concr&egrave;tement :
          </p>
          <ul style={{ fontSize: 15, color: "#3D2E1F", lineHeight: 1.7, paddingLeft: 24, marginBottom: 12 }}>
            <li>Vous &ecirc;tes <strong>sous-traitant</strong> d&apos;une entreprise principale (donneur d&apos;ordre)</li>
            <li>Vous facturez l&apos;entreprise principale <strong>SANS TVA</strong> (montant HT uniquement)</li>
            <li>Vous indiquez sur la facture la mention obligatoire : <em>&quot;Auto-liquidation - article 283-2 nonies du CGI&quot;</em></li>
            <li>Le donneur d&apos;ordre collecte et paye la TVA &agrave; l&apos;&Eacute;tat (il la d&eacute;duit de sa propre TVA d&eacute;ductible)</li>
            <li>Vous pouvez quand m&ecirc;me d&eacute;duire la TVA de vos achats (mat&eacute;riaux, sous-traitance)</li>
          </ul>
          <p style={{ fontSize: 15, color: "#3D2E1F", lineHeight: 1.7, marginBottom: 12 }}>
            <strong>Exemple</strong> : vous &ecirc;tes plombier sous-traitant de l&apos;entreprise
            g&eacute;n&eacute;rale Dupont BTP pour un chantier d&apos;immeuble. Vous facturez
            10 000 &euro; HT &agrave; Dupont BTP (sans TVA). C&apos;est Dupont BTP qui collecte les
            2 000 &euro; de TVA aupr&egrave;s du ma&icirc;tre d&apos;ouvrage et la reverse
            &agrave; l&apos;&Eacute;tat.
          </p>
          <p style={{ fontSize: 15, color: "#3D2E1F", lineHeight: 1.7 }}>
            <strong>Attention</strong> : si vous travaillez pour un particulier directement
            (sans entreprise principale), l&apos;auto-liquidation NE s&apos;applique PAS.
            Vous facturez la TVA classiquement.
          </p>
        </section>

        {/* 4. Situations + acompte */}
        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 24, fontWeight: 700, color: "#1C1C1E", marginBottom: 14 }}>
            4. Situations de travaux et factures d&apos;acompte
          </h2>
          <p style={{ fontSize: 15, color: "#3D2E1F", lineHeight: 1.7, marginBottom: 12 }}>
            Sur les chantiers longs, vous &eacute;mettez plusieurs factures avant le solde final :
          </p>
          <ul style={{ fontSize: 15, color: "#3D2E1F", lineHeight: 1.7, paddingLeft: 24, marginBottom: 12 }}>
            <li><strong>Facture d&apos;acompte</strong> : avant le d&eacute;marrage (typiquement 30-40 % du devis). Mention &quot;Facture d&apos;acompte&quot;. TVA calcul&eacute;e sur le montant encaiss&eacute;.</li>
            <li><strong>Facture de situation</strong> : pendant le chantier, correspond &agrave; l&apos;avancement r&eacute;el (par ex. situation N&deg;3 sur 5, 60 % avanc&eacute;). Mention &quot;Facture de situation N&deg;X sur N&deg;Y&quot;.</li>
            <li><strong>Facture de solde</strong> : &agrave; la fin du chantier. D&eacute;duit les acomptes et situations d&eacute;j&agrave; factur&eacute;s.</li>
          </ul>
          <p style={{ fontSize: 15, color: "#3D2E1F", lineHeight: 1.7 }}>
            Bativio g&egrave;re ces 3 types de factures avec un workflow guid&eacute; (vous
            cliquez sur &quot;Acompte / Situation / Solde&quot; et le calcul est automatique).
            Chaque facture est &eacute;mise via Invoquo en Factur-X conforme.
          </p>
        </section>

        {/* 5. Retenue de garantie */}
        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 24, fontWeight: 700, color: "#1C1C1E", marginBottom: 14 }}>
            5. La retenue de garantie en facturation &eacute;lectronique
          </h2>
          <p style={{ fontSize: 15, color: "#3D2E1F", lineHeight: 1.7, marginBottom: 12 }}>
            La <strong>retenue de garantie</strong> (loi du 16 juillet 1971) est un m&eacute;canisme
            o&ugrave; le ma&icirc;tre d&apos;ouvrage conserve <strong>5 % du montant du march&eacute;</strong>
            pendant <strong>1 an apr&egrave;s la r&eacute;ception des travaux</strong>, &agrave;
            titre de garantie de bonne ex&eacute;cution.
          </p>
          <p style={{ fontSize: 15, color: "#3D2E1F", lineHeight: 1.7, marginBottom: 12 }}>
            Sur une facture &eacute;lectronique :
          </p>
          <ul style={{ fontSize: 15, color: "#3D2E1F", lineHeight: 1.7, paddingLeft: 24, marginBottom: 12 }}>
            <li>Le total HT et la TVA sont calcul&eacute;s sur le <strong>montant total des travaux</strong> (sans d&eacute;duction de la retenue)</li>
            <li>La retenue de garantie est mentionn&eacute;e en <strong>pied de facture</strong> comme une d&eacute;duction du montant &agrave; payer imm&eacute;diatement</li>
            <li>Le montant net &agrave; payer = TTC &minus; retenue</li>
            <li>1 an apr&egrave;s, vous &eacute;mettez une <strong>facture compl&eacute;mentaire</strong> pour r&eacute;cup&eacute;rer la retenue</li>
          </ul>
          <p style={{ fontSize: 15, color: "#3D2E1F", lineHeight: 1.7 }}>
            Vous pouvez aussi demander &agrave; remplacer la retenue par une <strong>caution
            bancaire</strong> de m&ecirc;me montant : la banque garantit votre bonne ex&eacute;cution,
            le client paye 100 % imm&eacute;diatement.
          </p>
        </section>

        {/* 6. Cas pratique */}
        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 24, fontWeight: 700, color: "#1C1C1E", marginBottom: 14 }}>
            6. Cas pratique : un chantier de r&eacute;novation salle de bain
          </h2>
          <p style={{ fontSize: 15, color: "#3D2E1F", lineHeight: 1.7, marginBottom: 12 }}>
            Sc&eacute;nario complet pour illustrer les sp&eacute;cificit&eacute;s BTP :
          </p>
          <div style={{ background: "#FAF8F5", border: "1px solid #E8D5C0", borderRadius: 12, padding: 16, marginBottom: 16, fontSize: 14, color: "#3D2E1F", lineHeight: 1.6 }}>
            <p style={{ marginBottom: 8 }}><strong>Client</strong> : M. Dupont, particulier (B2C), appartement de 1995 (donc taux 10 %)</p>
            <p style={{ marginBottom: 8 }}><strong>Chantier</strong> : r&eacute;novation salle de bain (3 semaines)</p>
            <p style={{ marginBottom: 8 }}><strong>Devis sign&eacute;</strong> : 12 000 &euro; HT / 13 200 &euro; TTC</p>
            <p style={{ marginBottom: 8 }}><strong>D&eacute;tail</strong> :</p>
            <ul style={{ paddingLeft: 24, marginBottom: 8 }}>
              <li>Plomberie (PAC instantan&eacute;e RGE) : 2 800 &euro; HT &agrave; 5,5 %</li>
              <li>Plomberie classique (robinets, &eacute;vacuation) : 1 800 &euro; HT &agrave; 10 %</li>
              <li>Main d&apos;&oelig;uvre carrelage : 4 000 &euro; HT &agrave; 10 %</li>
              <li>Mat&eacute;riaux carrelage refactur&eacute;s : 1 500 &euro; HT &agrave; 10 %</li>
              <li>Peinture / faience : 1 900 &euro; HT &agrave; 10 %</li>
            </ul>
            <p style={{ marginBottom: 8 }}><strong>Workflow Bativio</strong> :</p>
            <ol style={{ paddingLeft: 24 }}>
              <li>Facture d&apos;acompte 30 % &mdash; 3 600 &euro; HT (& TVA proportionnelle par taux)</li>
              <li>Facture de situation interm&eacute;diaire 50 % &mdash; 6 000 &euro; HT (d&eacute;duit acompte)</li>
              <li>Facture de solde &mdash; 2 400 &euro; HT (d&eacute;duit acompte + situation)</li>
              <li>Toutes &eacute;mises en Factur-X via Invoquo, e-reporting B2C automatique</li>
            </ol>
          </div>
        </section>

        {/* 7. FAQ */}
        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 24, fontWeight: 700, color: "#1C1C1E", marginBottom: 14 }}>
            7. FAQ BTP
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
            <li><Link href="/pro/facturation-electronique-2026" style={{ color: "#C4531A" }}>Facturation &eacute;lectronique 2026 : guide complet</Link></li>
            <li><Link href="/pro/plateforme-agreee-artisan" style={{ color: "#C4531A" }}>Plateforme agr&eacute;&eacute;e pour artisans : comment choisir</Link></li>
            <li><Link href="/pro/mentions-obligatoires-2026" style={{ color: "#C4531A" }}>Les nouvelles mentions obligatoires sur les factures d&egrave;s 2026</Link></li>
            <li><Link href="/pro/glossaire" style={{ color: "#C4531A" }}>Glossaire de la facturation &eacute;lectronique</Link></li>
          </ul>
        </section>
      </article>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd({
        "@context": "https://schema.org",
        "@type": "Article",
        headline: "Facture électronique BTP : tout ce qui change pour les artisans",
        description: "Multi-TVA, sous-traitance, situations de travaux, retenue de garantie : guide complet pour artisans.",
        author: { "@type": "Organization", name: "Bativio" },
        publisher: { "@type": "Organization", name: "Bativio" },
        datePublished: "2026-04-27",
        dateModified: "2026-04-27",
        mainEntityOfPage: { "@type": "WebPage", "@id": "https://www.bativio.fr/pro/facture-electronique-btp" },
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
          { "@type": "ListItem", position: 3, name: "Spécificités BTP", item: "https://www.bativio.fr/pro/facture-electronique-btp" },
        ],
      }) }} />
    </>
  );
}
