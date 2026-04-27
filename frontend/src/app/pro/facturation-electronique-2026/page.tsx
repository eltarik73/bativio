/**
 * Pilier 1 du cluster /pro/ : Facturation electronique 2026 - guide exhaustif (3000+ mots).
 *
 * Cible SEO : "facturation electronique 2026", "reforme facturation electronique",
 * "obligation facture electronique septembre 2026", "calendrier facture electronique".
 */
import type { Metadata } from "next";
import Link from "next/link";
import { safeJsonLd } from "@/lib/html-escape";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Facturation électronique 2026 : guide complet pour artisans",
  description: "Facturation électronique obligatoire dès septembre 2026 : calendrier, plateforme agréée, sanctions (50€/facture). Le guide pratique pour les artisans du bâtiment.",
  keywords: "facturation electronique 2026, facture electronique obligatoire, reforme facturation electronique, calendrier 2026, plateforme agreee, Factur-X, sanction facture electronique, e-reporting",
  alternates: { canonical: "https://www.bativio.fr/pro/facturation-electronique-2026" },
  openGraph: {
    title: "Facturation électronique 2026 — Guide complet artisans | Bativio",
    description: "Calendrier officiel, plateformes agréées, sanctions, mentions obligatoires. Le guide de la réforme 2026 pour les artisans du bâtiment.",
    url: "https://www.bativio.fr/pro/facturation-electronique-2026",
    type: "article",
    locale: "fr_FR",
    images: [{ url: "https://www.bativio.fr/og-image.png", width: 1200, height: 630, alt: "Réforme facturation électronique 2026" }],
  },
  twitter: { card: "summary_large_image", title: "Facturation électronique 2026", description: "Guide complet pour artisans du bâtiment." },
};

const FAQ = [
  { q: "Suis-je concerné par la facturation électronique en tant qu'artisan ?", a: "Oui, à partir du 1er septembre 2026 vous devez pouvoir RECEVOIR des factures électroniques (que vous soyez auto-entrepreneur, TPE ou PME). L'émission devient obligatoire pour vous le 1er septembre 2027. Toutes les entreprises françaises assujetties à la TVA sont concernées, sans exception." },
  { q: "Que se passe-t-il si je continue à émettre des factures papier après septembre 2027 ?", a: "Vous risquez une amende de 50 € par facture non conforme, avec un plafond annuel de 15 000 €. Vos clients professionnels ne pourront plus déduire la TVA de vos factures non électroniques. Concrètement, vous deviendrez infréquentable pour les entreprises B2B." },
  { q: "Quelle est la différence entre PA et PDP ?", a: "C'est le même service : PDP (Plateforme de Dématérialisation Partenaire) est l'ancien nom, PA (Plateforme Agréée) est le nouveau nom officiel utilisé depuis 2024. Les deux désignent les opérateurs immatriculés par la DGFiP pour émettre, recevoir et transmettre les factures électroniques." },
  { q: "Dois-je obligatoirement choisir une plateforme agréée ?", a: "Oui. Vous devez désigner UNE plateforme agréée comme votre destinataire pour recevoir les factures de vos fournisseurs (sinon le PPF, Portail Public de Facturation, sera utilisé par défaut, mais sans les services à valeur ajoutée). Pour émettre, vous passerez aussi par une PA." },
  { q: "Le PPF (portail public de facturation) est-il gratuit ?", a: "Le PPF est l'infrastructure publique fournie par la DGFiP. Il sert de routeur entre les plateformes agréées et permet de recevoir et émettre des factures. Son utilisation directe (sans PA) est en cours d'évolution : initialement prévu gratuit, son rôle se limite désormais à l'annuaire et au transit. Une PA reste recommandée pour la valeur ajoutée." },
  { q: "Est-ce que je dois acheter un logiciel cher pour me mettre en conformité ?", a: "Non, plusieurs solutions existent à prix réduit pour les TPE/artisans. Bativio inclut la facturation électronique conforme dès le plan Starter à 19 €/mois (via la PA Invoquo). Comparez les coûts : un logiciel comptable généraliste type Pennylane coûte 30-60 €/mois et n'est pas adapté aux artisans BTP." },
  { q: "Que faire si je suis en franchise de TVA ?", a: "Vous êtes quand même concerné par la facturation électronique pour les transactions B2B (avec d'autres entreprises). Pour les transactions B2C (particuliers), vous restez libre du format. Le e-reporting (transmission des données de transaction) s'applique aussi en franchise de TVA." },
  { q: "Comment fonctionne le e-reporting ?", a: "Le e-reporting est la transmission automatique à la DGFiP des données de transactions (factures B2C, opérations internationales) et des données de paiement (encaissements). Il est obligatoire en parallèle de la facturation électronique. Les plateformes agréées le font automatiquement." },
];

const TOC = [
  { id: "definition", label: "Qu'est-ce que la facturation électronique ?" },
  { id: "calendrier", label: "Calendrier officiel 2026/2027" },
  { id: "pa", label: "Qu'est-ce qu'une plateforme agréée (PA) ?" },
  { id: "formats", label: "Formats Factur-X, UBL, CII" },
  { id: "mentions", label: "Nouvelles mentions obligatoires" },
  { id: "sanctions", label: "Sanctions prévues" },
  { id: "btp", label: "Spécificités pour les artisans BTP" },
  { id: "bativio", label: "Comment Bativio + Invoquo vous mettent en conformité" },
  { id: "faq", label: "FAQ" },
];

export default function FacturationElectronique2026Page() {
  return (
    <>
      <nav aria-label="Fil d'Ariane" style={{ fontSize: 13, color: "#9C958D", marginBottom: 24 }}>
        <Link href="/" style={{ color: "inherit", textDecoration: "none" }}>Accueil</Link>
        <span style={{ margin: "0 8px" }}>›</span>
        <Link href="/pro" style={{ color: "inherit", textDecoration: "none" }}>Pro</Link>
        <span style={{ margin: "0 8px" }}>›</span>
        <span style={{ color: "#3D2E1F" }}>Réforme 2026</span>
      </nav>

      <article style={{ maxWidth: 800, margin: "0 auto" }}>
        <header style={{ marginBottom: 32 }}>
          <h1 style={{ fontFamily: "'Fraunces',serif", fontSize: "clamp(28px,4vw,40px)", fontWeight: 700, color: "#1C1C1E", lineHeight: 1.15, marginBottom: 16 }}>
            Facturation &eacute;lectronique 2026 : ce que les artisans doivent savoir
          </h1>
          <p style={{ fontSize: 17, color: "#6B6560", lineHeight: 1.6 }}>
            Calendrier officiel, plateforme agr&eacute;&eacute;e, sanctions, mentions obligatoires :
            le guide complet de la r&eacute;forme pour les artisans du b&acirc;timent.
          </p>
          <div style={{ fontSize: 12, color: "#9C958D", marginTop: 12 }}>
            Mis &agrave; jour le 27 avril 2026 &middot; Lecture 12 min
          </div>
        </header>

        {/* Sommaire */}
        <aside style={{ background: "#FAF8F5", border: "1px solid #E8D5C0", borderRadius: 8, padding: 20, marginBottom: 32 }}>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, color: "#9C958D", marginBottom: 8 }}>Sommaire</div>
          <ol style={{ paddingLeft: 18, fontSize: 14, color: "#3D2E1F", lineHeight: 1.8 }}>
            {TOC.map((t) => (
              <li key={t.id}>
                <a href={`#${t.id}`} style={{ color: "#3D2E1F", textDecoration: "none" }}>{t.label}</a>
              </li>
            ))}
          </ol>
        </aside>

        {/* 1. Definition */}
        <section id="definition" style={{ marginBottom: 32 }}>
          <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 24, fontWeight: 700, color: "#1C1C1E", marginBottom: 14 }}>
            1. Qu&apos;est-ce que la facturation &eacute;lectronique ?
          </h2>
          <p style={{ fontSize: 15, color: "#3D2E1F", lineHeight: 1.7, marginBottom: 12 }}>
            La <strong>facturation &eacute;lectronique</strong> (ou e-invoicing) est la
            transmission de factures sous forme structur&eacute;e (XML) entre l&apos;&eacute;metteur
            et le destinataire, via une <strong>plateforme agr&eacute;&eacute;e</strong> (PA),
            sans intervention papier ni email PDF.
          </p>
          <p style={{ fontSize: 15, color: "#3D2E1F", lineHeight: 1.7, marginBottom: 12 }}>
            La diff&eacute;rence majeure avec un PDF envoy&eacute; par mail :
          </p>
          <ul style={{ fontSize: 15, color: "#3D2E1F", lineHeight: 1.7, paddingLeft: 24, marginBottom: 12 }}>
            <li><strong>Format structur&eacute;</strong> : la facture contient un fichier XML lisible par machine (vs un PDF lisible uniquement par humain)</li>
            <li><strong>Transmission via PA</strong> : pas d&apos;email, transit par un op&eacute;rateur immatricul&eacute; DGFiP</li>
            <li><strong>Suivi de cycle de vie</strong> : statuts de la facture (re&ccedil;ue, refus&eacute;e, pay&eacute;e) trac&eacute;s automatiquement</li>
            <li><strong>e-reporting associ&eacute;</strong> : remont&eacute;e automatique des donn&eacute;es de transaction et de paiement &agrave; l&apos;administration fiscale</li>
          </ul>
          <p style={{ fontSize: 15, color: "#3D2E1F", lineHeight: 1.7 }}>
            La r&eacute;forme s&apos;inscrit dans le cadre du d&eacute;cret europ&eacute;en sur la
            facturation &eacute;lectronique (norme EN16931) et des objectifs de lutte contre la
            fraude TVA. Elle vise &agrave; cr&eacute;er un &eacute;cosyst&egrave;me o&ugrave; la TVA
            est d&eacute;clar&eacute;e en quasi temps r&eacute;el.
          </p>
        </section>

        {/* 2. Calendrier */}
        <section id="calendrier" style={{ marginBottom: 32 }}>
          <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 24, fontWeight: 700, color: "#1C1C1E", marginBottom: 14 }}>
            2. Calendrier officiel 2026/2027
          </h2>
          <p style={{ fontSize: 15, color: "#3D2E1F", lineHeight: 1.7, marginBottom: 16 }}>
            Le calendrier a &eacute;t&eacute; r&eacute;vis&eacute; en 2024 (loi de finances). Voici les
            dates en vigueur en 2026 :
          </p>
          <div style={{ background: "#FAF8F5", border: "1px solid #E8D5C0", borderRadius: 12, padding: 20, marginBottom: 16 }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #C4531A" }}>
                  <th style={{ textAlign: "left", padding: "8px 4px", fontWeight: 700, color: "#1C1C1E" }}>Date</th>
                  <th style={{ textAlign: "left", padding: "8px 4px", fontWeight: 700, color: "#1C1C1E" }}>Obligation</th>
                  <th style={{ textAlign: "left", padding: "8px 4px", fontWeight: 700, color: "#1C1C1E" }}>Concerne</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: "1px solid #EDEBE7" }}>
                  <td style={{ padding: "10px 4px", color: "#C4531A", fontWeight: 700 }}>1er sept. 2026</td>
                  <td style={{ padding: "10px 4px", color: "#3D2E1F" }}>R&eacute;ception &eacute;lectronique obligatoire</td>
                  <td style={{ padding: "10px 4px", color: "#3D2E1F" }}>TOUTES les entreprises</td>
                </tr>
                <tr style={{ borderBottom: "1px solid #EDEBE7" }}>
                  <td style={{ padding: "10px 4px", color: "#C4531A", fontWeight: 700 }}>1er sept. 2026</td>
                  <td style={{ padding: "10px 4px", color: "#3D2E1F" }}>&Eacute;mission &eacute;lectronique obligatoire</td>
                  <td style={{ padding: "10px 4px", color: "#3D2E1F" }}>Grandes entreprises (5 000 sal+) et ETI (250-5 000)</td>
                </tr>
                <tr>
                  <td style={{ padding: "10px 4px", color: "#C4531A", fontWeight: 700 }}>1er sept. 2027</td>
                  <td style={{ padding: "10px 4px", color: "#3D2E1F" }}>&Eacute;mission &eacute;lectronique obligatoire</td>
                  <td style={{ padding: "10px 4px", color: "#3D2E1F" }}>TPE/PME et micro-entreprises (la plupart des artisans)</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p style={{ fontSize: 14, color: "#6B6560", lineHeight: 1.6, fontStyle: "italic" }}>
            Note : pour les artisans, l&apos;&eacute;tape critique est <strong>septembre 2026</strong>
            (r&eacute;ception). M&ecirc;me si vous n&apos;&eacute;mettez pas encore en &eacute;lectronique,
            vous devez avoir d&eacute;sign&eacute; une PA pour recevoir les factures de vos fournisseurs
            (mat&eacute;riaux, sous-traitants, abonnements).
          </p>
        </section>

        {/* 3. PA */}
        <section id="pa" style={{ marginBottom: 32 }}>
          <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 24, fontWeight: 700, color: "#1C1C1E", marginBottom: 14 }}>
            3. Qu&apos;est-ce qu&apos;une plateforme agr&eacute;&eacute;e (PA) ?
          </h2>
          <p style={{ fontSize: 15, color: "#3D2E1F", lineHeight: 1.7, marginBottom: 12 }}>
            Une <strong>plateforme agr&eacute;&eacute;e</strong> (anciennement PDP, Plateforme de
            D&eacute;mat&eacute;rialisation Partenaire) est un op&eacute;rateur priv&eacute;
            immatricul&eacute; par la DGFiP qui assure :
          </p>
          <ul style={{ fontSize: 15, color: "#3D2E1F", lineHeight: 1.7, paddingLeft: 24, marginBottom: 16 }}>
            <li><strong>L&apos;&eacute;mission</strong> de vos factures sortantes au format conforme</li>
            <li><strong>La r&eacute;ception</strong> des factures entrantes de vos fournisseurs</li>
            <li><strong>La transmission</strong> &agrave; la DGFiP des donn&eacute;es de transaction et de paiement (e-reporting)</li>
            <li><strong>L&apos;archivage</strong> &agrave; valeur probante (10 ans, code commerce L123-22)</li>
            <li><strong>Le statut de cycle de vie</strong> de chaque facture (envoy&eacute;e, re&ccedil;ue, refus&eacute;e, pay&eacute;e)</li>
          </ul>
          <p style={{ fontSize: 15, color: "#3D2E1F", lineHeight: 1.7, marginBottom: 12 }}>
            Au 16 f&eacute;vrier 2026, environ <strong>108 plateformes</strong> sont
            immatricul&eacute;es ou en cours d&apos;immatriculation aupr&egrave;s de la DGFiP.
            La liste officielle est disponible sur le site impots.gouv.fr.
          </p>
          <p style={{ fontSize: 15, color: "#3D2E1F", lineHeight: 1.7 }}>
            Bativio est connect&eacute; &agrave; <strong>Invoquo</strong>, une plateforme agr&eacute;&eacute;e
            sp&eacute;cialis&eacute;e dans les TPE et artisans. Pour vous, l&apos;int&eacute;gration
            est totalement transparente : vous saisissez vos factures dans Bativio, elles partent
            automatiquement via Invoquo &agrave; la DGFiP et &agrave; vos clients.
          </p>
          <p style={{ fontSize: 14, color: "#6B6560", lineHeight: 1.6, marginTop: 12 }}>
            &rarr; <Link href="/pro/plateforme-agreee-artisan" style={{ color: "#C4531A", textDecoration: "underline" }}>
              Comment choisir sa plateforme agr&eacute;&eacute;e quand on est artisan
            </Link>
          </p>
        </section>

        {/* 4. Formats */}
        <section id="formats" style={{ marginBottom: 32 }}>
          <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 24, fontWeight: 700, color: "#1C1C1E", marginBottom: 14 }}>
            4. Les formats Factur-X, UBL et CII
          </h2>
          <p style={{ fontSize: 15, color: "#3D2E1F", lineHeight: 1.7, marginBottom: 12 }}>
            Trois formats sont accept&eacute;s par la r&eacute;forme :
          </p>
          <ul style={{ fontSize: 15, color: "#3D2E1F", lineHeight: 1.7, paddingLeft: 24, marginBottom: 16 }}>
            <li><strong>Factur-X</strong> : format hybride PDF + XML CII embarqu&eacute;. Lisible visuellement comme un PDF classique, et lisible par machine via le XML. <strong>Format le plus utilis&eacute; par les TPE</strong>, recommand&eacute; pour les artisans.</li>
            <li><strong>UBL</strong> (Universal Business Language) : format XML pur, utilis&eacute; en Europe pour les march&eacute;s publics et les ERP gros volume.</li>
            <li><strong>CII</strong> (Cross Industry Invoice) : format XML pur de l&apos;UN/CEFACT, base technique de Factur-X. Utilis&eacute; surtout en B2B grandes entreprises.</li>
          </ul>
          <p style={{ fontSize: 15, color: "#3D2E1F", lineHeight: 1.7 }}>
            Bativio &eacute;met par d&eacute;faut au format <strong>Factur-X</strong> via la PA Invoquo.
            Si l&apos;un de vos clients exige UBL ou CII (rare en BTP), le format est convertissable
            automatiquement par la PA. Vous n&apos;avez rien &agrave; configurer.
          </p>
        </section>

        {/* 5. Mentions */}
        <section id="mentions" style={{ marginBottom: 32 }}>
          <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 24, fontWeight: 700, color: "#1C1C1E", marginBottom: 14 }}>
            5. Les nouvelles mentions obligatoires
          </h2>
          <p style={{ fontSize: 15, color: "#3D2E1F", lineHeight: 1.7, marginBottom: 12 }}>
            En plus des mentions historiques (SIRET, num&eacute;ro de facture, date, montant HT/TVA/TTC,
            num&eacute;ro de TVA intracommunautaire), <strong>4 nouvelles mentions</strong> deviennent
            obligatoires en 2026/2027 :
          </p>
          <ol style={{ fontSize: 15, color: "#3D2E1F", lineHeight: 1.7, paddingLeft: 24, marginBottom: 12 }}>
            <li><strong>SIREN du client</strong> (en plus de son adresse)</li>
            <li><strong>Adresse de livraison</strong> des biens si elle diffère de l&apos;adresse de facturation</li>
            <li><strong>Cat&eacute;gorie d&apos;op&eacute;ration</strong> : livraison de biens / prestation de services / mixte</li>
            <li><strong>Mention "option pour le paiement de la TVA d&apos;apr&egrave;s les d&eacute;bits"</strong> si l&apos;artisan a opt&eacute; pour ce r&eacute;gime</li>
          </ol>
          <p style={{ fontSize: 14, color: "#6B6560", lineHeight: 1.6 }}>
            &rarr; <Link href="/pro/mentions-obligatoires-2026" style={{ color: "#C4531A", textDecoration: "underline" }}>
              Voir le d&eacute;tail des mentions obligatoires + checklist imprimable
            </Link>
          </p>
        </section>

        {/* 6. Sanctions */}
        <section id="sanctions" style={{ marginBottom: 32 }}>
          <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 24, fontWeight: 700, color: "#1C1C1E", marginBottom: 14 }}>
            6. Sanctions pr&eacute;vues
          </h2>
          <p style={{ fontSize: 15, color: "#3D2E1F", lineHeight: 1.7, marginBottom: 12 }}>
            Le non-respect de la r&eacute;forme est passible de sanctions financi&egrave;res :
          </p>
          <div style={{ background: "rgba(220,38,38,.05)", border: "1px solid rgba(220,38,38,.2)", borderRadius: 8, padding: 16, marginBottom: 16 }}>
            <ul style={{ fontSize: 15, color: "#3D2E1F", lineHeight: 1.8, paddingLeft: 24, margin: 0 }}>
              <li><strong>50 &euro; par facture</strong> non &eacute;mise au format &eacute;lectronique &mdash; plafond 15 000 &euro;/an</li>
              <li><strong>500 &euro;</strong> pour absence de d&eacute;signation d&apos;une PA aupr&egrave;s de la DGFiP</li>
              <li><strong>250 &euro; par manquement</strong> au e-reporting (transmission des donn&eacute;es)</li>
              <li><strong>Refus de d&eacute;duction TVA</strong> par votre client si la facture n&apos;est pas conforme</li>
            </ul>
          </div>
          <p style={{ fontSize: 14, color: "#6B6560", lineHeight: 1.6, fontStyle: "italic" }}>
            La p&eacute;riode 2026-2027 sera tol&eacute;rante (le minist&egrave;re a annonc&eacute;
            une mont&eacute;e en charge progressive). Les sanctions deviendront automatiques en 2028.
          </p>
        </section>

        {/* 7. BTP */}
        <section id="btp" style={{ marginBottom: 32 }}>
          <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 24, fontWeight: 700, color: "#1C1C1E", marginBottom: 14 }}>
            7. Sp&eacute;cificit&eacute;s pour les artisans BTP
          </h2>
          <p style={{ fontSize: 15, color: "#3D2E1F", lineHeight: 1.7, marginBottom: 12 }}>
            Les artisans du b&acirc;timent ont des contraintes sp&eacute;cifiques que peu de
            plateformes g&eacute;n&eacute;ralistes g&egrave;rent correctement :
          </p>
          <ul style={{ fontSize: 15, color: "#3D2E1F", lineHeight: 1.7, paddingLeft: 24, marginBottom: 12 }}>
            <li><strong>Multi-TVA</strong> : 5,5 % (logement vieux), 10 % (r&eacute;novation), 20 % (neuf et hors-logement) sur une m&ecirc;me facture</li>
            <li><strong>Auto-liquidation TVA en sous-traitance</strong> : le donneur d&apos;ordre paye la TVA, pas le sous-traitant (article 283 CGI)</li>
            <li><strong>Situations de travaux</strong> et <strong>factures d&apos;acompte</strong> sur chantiers longs</li>
            <li><strong>Retenue de garantie</strong> (5 % du march&eacute; pendant 1 an) qui modifie la base taxable</li>
            <li><strong>Forfait jours travaill&eacute;s</strong> vs facturation au m&egrave;tre carr&eacute; ou heure</li>
          </ul>
          <p style={{ fontSize: 14, color: "#6B6560", lineHeight: 1.6 }}>
            &rarr; <Link href="/pro/facture-electronique-btp" style={{ color: "#C4531A", textDecoration: "underline" }}>
              Lire le guide d&eacute;taill&eacute; sur la facture &eacute;lectronique BTP
            </Link>
          </p>
        </section>

        {/* 8. Bativio + Invoquo */}
        <section id="bativio" style={{ marginBottom: 32 }}>
          <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 24, fontWeight: 700, color: "#1C1C1E", marginBottom: 14 }}>
            8. Comment Bativio + Invoquo vous mettent en conformit&eacute;
          </h2>
          <p style={{ fontSize: 15, color: "#3D2E1F", lineHeight: 1.7, marginBottom: 12 }}>
            Bativio est l&apos;outil que vous utilisez au quotidien (devis, factures, planning,
            CRM client). Invoquo est notre <strong>partenaire plateforme agr&eacute;&eacute;e</strong>
            qui s&apos;occupe de la conformit&eacute; r&eacute;glementaire en arri&egrave;re-plan.
          </p>
          <p style={{ fontSize: 15, color: "#3D2E1F", lineHeight: 1.7, marginBottom: 12 }}>
            Concr&egrave;tement, vous :
          </p>
          <ul style={{ fontSize: 15, color: "#3D2E1F", lineHeight: 1.7, paddingLeft: 24, marginBottom: 12 }}>
            <li>Cr&eacute;ez votre devis en 30 secondes (catalogue de prestations BTP int&eacute;gr&eacute;)</li>
            <li>Convertissez le devis sign&eacute; en facture en 1 clic</li>
            <li>La facture est &eacute;mise automatiquement en Factur-X via Invoquo</li>
            <li>Votre client la re&ccedil;oit dans sa propre PA (ou le PPF par d&eacute;faut)</li>
            <li>Vous suivez le cycle de vie en temps r&eacute;el (envoy&eacute;e, re&ccedil;ue, pay&eacute;e)</li>
            <li>Le e-reporting est fait automatiquement &agrave; la DGFiP</li>
            <li>L&apos;archivage 10 ans est s&eacute;curis&eacute; chez Invoquo</li>
          </ul>
          <p style={{ fontSize: 15, color: "#3D2E1F", lineHeight: 1.7 }}>
            Tout est inclus dans l&apos;abonnement Starter (19 &euro;/mois) sans frais cach&eacute;s
            ni co&ucirc;t par facture. Aucun autre op&eacute;rateur ne propose une telle
            int&eacute;gration sp&eacute;cifique BTP &agrave; ce prix.
          </p>
        </section>

        {/* 9. FAQ */}
        <section id="faq" style={{ marginBottom: 32 }}>
          <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 24, fontWeight: 700, color: "#1C1C1E", marginBottom: 14 }}>
            9. Questions fr&eacute;quentes
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
            <li><Link href="/pro/plateforme-agreee-artisan" style={{ color: "#C4531A" }}>Plateforme agr&eacute;&eacute;e pour artisans : comment choisir</Link></li>
            <li><Link href="/pro/facture-electronique-btp" style={{ color: "#C4531A" }}>Facture &eacute;lectronique BTP : multi-TVA, sous-traitance, retenue de garantie</Link></li>
            <li><Link href="/pro/mentions-obligatoires-2026" style={{ color: "#C4531A" }}>Les nouvelles mentions obligatoires sur les factures d&egrave;s 2026</Link></li>
            <li><Link href="/pro/glossaire" style={{ color: "#C4531A" }}>Glossaire de la facturation &eacute;lectronique (PA, PPF, e-reporting&hellip;)</Link></li>
          </ul>
        </section>
      </article>

      {/* JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd({
        "@context": "https://schema.org",
        "@type": "Article",
        headline: "Facturation électronique 2026 : ce que les artisans doivent savoir",
        description: "Calendrier officiel, plateforme agréée, sanctions, mentions obligatoires : le guide complet de la réforme pour les artisans du bâtiment.",
        author: { "@type": "Organization", name: "Bativio", url: "https://www.bativio.fr" },
        publisher: { "@type": "Organization", name: "Bativio", logo: { "@type": "ImageObject", url: "https://www.bativio.fr/og-image.png" } },
        datePublished: "2026-04-27",
        dateModified: "2026-04-27",
        mainEntityOfPage: { "@type": "WebPage", "@id": "https://www.bativio.fr/pro/facturation-electronique-2026" },
        image: "https://www.bativio.fr/og-image.png",
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
          { "@type": "ListItem", position: 3, name: "Réforme 2026", item: "https://www.bativio.fr/pro/facturation-electronique-2026" },
        ],
      }) }} />
    </>
  );
}
