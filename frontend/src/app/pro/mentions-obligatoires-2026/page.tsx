/**
 * Pilier 4 du cluster /pro/ : mentions obligatoires factures 2026 (1500-2000 mots).
 *
 * Cible SEO : "mentions obligatoires facture 2026", "checklist facture electronique",
 * "facture artisan 2026 mentions", "auto-entrepreneur facture obligatoire".
 */
import type { Metadata } from "next";
import Link from "next/link";
import { safeJsonLd } from "@/lib/html-escape";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Mentions obligatoires facture 2026 : checklist pour artisans",
  description: "Les 4 nouvelles mentions obligatoires sur les factures dès 2026 : SIREN client, adresse de livraison, catégorie d'opération, paiement TVA. Checklist complète pour artisans.",
  keywords: "mentions obligatoires facture 2026, checklist facture electronique, facture artisan obligatoire, auto-entrepreneur facture, SIREN client, adresse livraison, categorie operation",
  alternates: { canonical: "https://www.bativio.fr/pro/mentions-obligatoires-2026" },
  openGraph: {
    title: "Mentions obligatoires facture 2026 — Checklist artisans | Bativio",
    description: "Toutes les mentions à inclure sur vos factures à partir de 2026, avec checklist imprimable.",
    url: "https://www.bativio.fr/pro/mentions-obligatoires-2026",
    type: "article",
    locale: "fr_FR",
    images: [{ url: "https://www.bativio.fr/og-image.png", width: 1200, height: 630, alt: "Mentions obligatoires facture 2026" }],
  },
  twitter: { card: "summary_large_image", title: "Mentions obligatoires facture 2026", description: "Checklist complète pour artisans." },
};

const FAQ = [
  { q: "Que se passe-t-il si je ne mets pas une mention obligatoire ?", a: "Une facture incomplète peut être refusée par votre client (qui ne pourra pas déduire la TVA). Sur le plan fiscal, vous risquez une amende de 15 € par mention manquante (plafonnée à 1/4 du montant de la facture). En cas de contrôle, l'administration peut redresser la TVA déduite à tort." },
  { q: "Suis-je concerné si je suis auto-entrepreneur en franchise de TVA ?", a: "Oui, vous devez respecter la majorité des mentions (identification, numéro de facture, date, désignation des prestations, montants). Vous devez en plus indiquer la mention 'TVA non applicable, art. 293 B du CGI'. Vous n'avez pas à indiquer un numéro de TVA intracommunautaire." },
  { q: "Le SIREN du client était-il déjà obligatoire avant 2026 ?", a: "Pour les transactions B2B, l'adresse du client était obligatoire mais pas son SIREN explicite. Depuis 2026, le SIREN devient obligatoire en plus de l'adresse. Pour les transactions B2C (particuliers), le SIREN ne s'applique évidemment pas." },
  { q: "Comment savoir le SIREN de mon client ?", a: "Plusieurs moyens : demande directe au client, recherche par nom sur https://annuaire-entreprises.data.gouv.fr (gratuit), ou via Bativio (recherche INSEE intégrée par nom ou raison sociale dans l'écran client)." },
  { q: "Que veut dire 'catégorie d'opération' ?", a: "C'est l'indication du type de transaction : 'Livraison de biens', 'Prestation de services', ou 'Mixte' (pour les chantiers BTP qui combinent matériaux + main d'œuvre). Cette mention permet à la DGFiP de classifier les flux de TVA. Bativio le détecte automatiquement selon votre catalogue de prestations." },
  { q: "Que veut dire 'option pour le paiement de la TVA d'après les débits' ?", a: "Par défaut, la TVA est due lors de l'encaissement (paiement réel par le client). Mais vous pouvez opter pour la 'TVA sur les débits' : la TVA est due dès l'émission de la facture. Cette option (utile pour les chantiers longs) doit être indiquée explicitement sur la facture si vous l'avez choisie." },
];

export default function MentionsObligatoires2026Page() {
  return (
    <>
      <nav aria-label="Fil d'Ariane" style={{ fontSize: 13, color: "#9C958D", marginBottom: 24 }}>
        <Link href="/" style={{ color: "inherit", textDecoration: "none" }}>Accueil</Link>
        <span style={{ margin: "0 8px" }}>›</span>
        <Link href="/pro" style={{ color: "inherit", textDecoration: "none" }}>Pro</Link>
        <span style={{ margin: "0 8px" }}>›</span>
        <span style={{ color: "#3D2E1F" }}>Mentions obligatoires</span>
      </nav>

      <article style={{ maxWidth: 800, margin: "0 auto" }}>
        <header style={{ marginBottom: 32 }}>
          <h1 style={{ fontFamily: "'Fraunces',serif", fontSize: "clamp(28px,4vw,40px)", fontWeight: 700, color: "#1C1C1E", lineHeight: 1.15, marginBottom: 16 }}>
            Les nouvelles mentions obligatoires sur les factures d&egrave;s 2026
          </h1>
          <p style={{ fontSize: 17, color: "#6B6560", lineHeight: 1.6 }}>
            En plus des mentions historiques, 4 nouveaut&eacute;s deviennent obligatoires
            dans la facture &eacute;lectronique. Voici la checklist compl&egrave;te pour
            artisans + cas particuliers (auto-entrepreneur, franchise TVA).
          </p>
          <div style={{ fontSize: 12, color: "#9C958D", marginTop: 12 }}>
            Mis &agrave; jour le 27 avril 2026 &middot; Lecture 7 min
          </div>
        </header>

        {/* 1. Mentions historiques */}
        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 24, fontWeight: 700, color: "#1C1C1E", marginBottom: 14 }}>
            1. Les mentions historiques (rappel)
          </h2>
          <p style={{ fontSize: 15, color: "#3D2E1F", lineHeight: 1.7, marginBottom: 12 }}>
            Avant la r&eacute;forme 2026, ces mentions &eacute;taient d&eacute;j&agrave;
            obligatoires sur toute facture (CGI articles 242 nonies A et 289) :
          </p>
          <ul style={{ fontSize: 15, color: "#3D2E1F", lineHeight: 1.7, paddingLeft: 24 }}>
            <li><strong>Identit&eacute; du vendeur</strong> : nom commercial, adresse, SIRET/SIREN, forme juridique, capital social (si SARL/SAS), num&eacute;ro RCS</li>
            <li><strong>Identit&eacute; du client</strong> : nom et adresse</li>
            <li><strong>Num&eacute;ro de facture</strong> unique, s&eacute;quentiel, sans rupture (ex : F-2026-001)</li>
            <li><strong>Date d&apos;&eacute;mission</strong> et <strong>date d&apos;ex&eacute;cution</strong> de la prestation</li>
            <li><strong>Date d&apos;&eacute;ch&eacute;ance</strong> de paiement</li>
            <li><strong>D&eacute;signation pr&eacute;cise</strong> de chaque prestation (description, quantit&eacute;, prix unitaire HT)</li>
            <li><strong>Montant HT, taux et montant TVA, montant TTC</strong> par taux</li>
            <li><strong>Num&eacute;ro de TVA intracommunautaire</strong> du vendeur (si assujetti)</li>
            <li><strong>Conditions d&apos;escompte</strong> en cas de paiement anticip&eacute; (ou mention "Pas d&apos;escompte")</li>
            <li><strong>P&eacute;nalit&eacute;s de retard</strong> et <strong>indemnit&eacute; forfaitaire de recouvrement</strong> (40 &euro;)</li>
          </ul>
        </section>

        {/* 2. 4 nouvelles mentions */}
        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 24, fontWeight: 700, color: "#1C1C1E", marginBottom: 14 }}>
            2. Les 4 nouvelles mentions 2026
          </h2>

          <div style={{ background: "#fff", border: "2px solid #C4531A", borderRadius: 12, padding: 20, marginBottom: 16 }}>
            <h3 style={{ fontFamily: "'Fraunces',serif", fontSize: 17, fontWeight: 700, color: "#C4531A", marginBottom: 8 }}>
              1) SIREN du client (B2B uniquement)
            </h3>
            <p style={{ fontSize: 14, color: "#3D2E1F", lineHeight: 1.6, marginBottom: 8 }}>
              Pour toute transaction B2B (avec une autre entreprise), le SIREN (9 chiffres)
              ou le SIRET (14 chiffres) du client doit appara&icirc;tre sur la facture, en
              plus de son adresse.
            </p>
            <p style={{ fontSize: 13, color: "#6B6560", lineHeight: 1.6 }}>
              <strong>Pourquoi ?</strong> Permettre l&apos;identification automatique du client
              dans la cha&icirc;ne &eacute;lectronique et l&apos;annuaire de la DGFiP.
            </p>
          </div>

          <div style={{ background: "#fff", border: "2px solid #C4531A", borderRadius: 12, padding: 20, marginBottom: 16 }}>
            <h3 style={{ fontFamily: "'Fraunces',serif", fontSize: 17, fontWeight: 700, color: "#C4531A", marginBottom: 8 }}>
              2) Adresse de livraison (si diff&eacute;rente de l&apos;adresse de facturation)
            </h3>
            <p style={{ fontSize: 14, color: "#3D2E1F", lineHeight: 1.6, marginBottom: 8 }}>
              Pour le BTP : si vous facturez le si&egrave;ge social d&apos;une entreprise mais
              avez livr&eacute; les travaux sur un autre site (chantier, agence), vous devez
              mentionner l&apos;adresse du chantier en plus de l&apos;adresse de facturation.
            </p>
            <p style={{ fontSize: 13, color: "#6B6560", lineHeight: 1.6 }}>
              <strong>Pourquoi ?</strong> Justification des taux de TVA r&eacute;duits (5,5/10 %)
              li&eacute;s &agrave; la nature du logement faisant l&apos;objet des travaux.
            </p>
          </div>

          <div style={{ background: "#fff", border: "2px solid #C4531A", borderRadius: 12, padding: 20, marginBottom: 16 }}>
            <h3 style={{ fontFamily: "'Fraunces',serif", fontSize: 17, fontWeight: 700, color: "#C4531A", marginBottom: 8 }}>
              3) Cat&eacute;gorie d&apos;op&eacute;ration
            </h3>
            <p style={{ fontSize: 14, color: "#3D2E1F", lineHeight: 1.6, marginBottom: 8 }}>
              Une mention indiquant le type de transaction parmi 3 cat&eacute;gories :
            </p>
            <ul style={{ fontSize: 14, color: "#3D2E1F", lineHeight: 1.6, paddingLeft: 24, marginBottom: 8 }}>
              <li><strong>Livraison de biens</strong> (LB) : vente de mat&eacute;riaux seuls</li>
              <li><strong>Prestation de services</strong> (PS) : main d&apos;&oelig;uvre seule</li>
              <li><strong>Mixte</strong> (LBPS) : mat&eacute;riaux + main d&apos;&oelig;uvre (cas typique BTP)</li>
            </ul>
            <p style={{ fontSize: 13, color: "#6B6560", lineHeight: 1.6 }}>
              <strong>Pourquoi ?</strong> La fiscalit&eacute; (notamment le moment d&apos;exigibilit&eacute;
              de la TVA) diff&egrave;re selon la cat&eacute;gorie. Bativio d&eacute;tecte
              automatiquement le type selon votre catalogue.
            </p>
          </div>

          <div style={{ background: "#fff", border: "2px solid #C4531A", borderRadius: 12, padding: 20, marginBottom: 16 }}>
            <h3 style={{ fontFamily: "'Fraunces',serif", fontSize: 17, fontWeight: 700, color: "#C4531A", marginBottom: 8 }}>
              4) Mention &quot;Option TVA d&apos;apr&egrave;s les d&eacute;bits&quot; (si applicable)
            </h3>
            <p style={{ fontSize: 14, color: "#3D2E1F", lineHeight: 1.6, marginBottom: 8 }}>
              Si vous avez opt&eacute; pour le paiement de la TVA d&apos;apr&egrave;s les d&eacute;bits
              (TVA exigible &agrave; l&apos;&eacute;mission de la facture vs &agrave; l&apos;encaissement),
              vous devez l&apos;indiquer explicitement sur chaque facture.
            </p>
            <p style={{ fontSize: 13, color: "#6B6560", lineHeight: 1.6 }}>
              <strong>Pour qui ?</strong> Utile pour les artisans avec d&eacute;lais de paiement
              long (chantiers grandes entreprises) qui veulent r&eacute;cup&eacute;rer la TVA
              d&eacute;ductible plus t&ocirc;t. Option &agrave; faire valider par votre
              expert-comptable avant l&apos;activation.
            </p>
          </div>
        </section>

        {/* 3. Auto-entrepreneur */}
        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 24, fontWeight: 700, color: "#1C1C1E", marginBottom: 14 }}>
            3. Cas particulier de l&apos;auto-entrepreneur
          </h2>
          <p style={{ fontSize: 15, color: "#3D2E1F", lineHeight: 1.7, marginBottom: 12 }}>
            Les auto-entrepreneurs en franchise de TVA (sous le seuil 36 800 &euro; pour les
            prestations de services BTP) doivent inclure une mention sp&eacute;cifique :
          </p>
          <div style={{ background: "#FAF8F5", border: "1px solid #E8D5C0", borderRadius: 8, padding: 16, marginBottom: 12, fontFamily: "monospace", fontSize: 13 }}>
            &laquo; TVA non applicable, art. 293 B du CGI &raquo;
          </div>
          <p style={{ fontSize: 15, color: "#3D2E1F", lineHeight: 1.7 }}>
            Vous n&apos;avez pas &agrave; indiquer un num&eacute;ro de TVA intracommunautaire
            (vous n&apos;en avez pas) ni de taux de TVA. Tous les autres &eacute;l&eacute;ments
            (mentions historiques + 3 nouvelles mentions sauf option d&eacute;bits) restent
            obligatoires.
          </p>
        </section>

        {/* 4. Franchise TVA */}
        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 24, fontWeight: 700, color: "#1C1C1E", marginBottom: 14 }}>
            4. Cas particulier des artisans en franchise de TVA
          </h2>
          <p style={{ fontSize: 15, color: "#3D2E1F", lineHeight: 1.7, marginBottom: 12 }}>
            Si vous d&eacute;passez le seuil de franchise (36 800 &euro; pour services / 91 900
            &euro; pour ventes en 2026), vous devenez assujetti &agrave; la TVA et devez :
          </p>
          <ul style={{ fontSize: 15, color: "#3D2E1F", lineHeight: 1.7, paddingLeft: 24, marginBottom: 12 }}>
            <li>Demander un <strong>num&eacute;ro de TVA intracommunautaire</strong> aupr&egrave;s du SIE</li>
            <li>Facturer la TVA sur toutes vos prestations (selon les taux applicables BTP)</li>
            <li>D&eacute;clarer la TVA mensuellement ou trimestriellement (selon votre r&eacute;gime)</li>
            <li>Faire le e-reporting des donn&eacute;es de paiement &agrave; la DGFiP</li>
          </ul>
          <p style={{ fontSize: 14, color: "#6B6560", lineHeight: 1.6, fontStyle: "italic" }}>
            Si vous &ecirc;tes en limite du seuil, anticipez : un d&eacute;passement m&ecirc;me ponctuel
            entra&icirc;ne l&apos;assujettissement &agrave; la TVA r&eacute;troactivement.
          </p>
        </section>

        {/* 5. Checklist */}
        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 24, fontWeight: 700, color: "#1C1C1E", marginBottom: 14 }}>
            5. Checklist imprimable
          </h2>
          <div style={{ background: "#fff", border: "2px solid #C4531A", borderRadius: 12, padding: 24 }}>
            <h3 style={{ fontFamily: "'Fraunces',serif", fontSize: 17, fontWeight: 700, color: "#1C1C1E", marginBottom: 12 }}>
              Toute facture &eacute;mise apr&egrave;s sept. 2027 doit contenir :
            </h3>
            <ul style={{ fontSize: 14, color: "#3D2E1F", lineHeight: 2, paddingLeft: 0, listStyle: "none" }}>
              <li>&#9744; Identit&eacute; vendeur (nom, adresse, SIRET, forme juridique, capital, RCS)</li>
              <li>&#9744; Num&eacute;ro de TVA intracommunautaire vendeur (sauf franchise)</li>
              <li>&#9744; Identit&eacute; client : nom, adresse, <strong>SIREN si B2B</strong> (NEW)</li>
              <li>&#9744; <strong>Adresse de livraison si diff&eacute;rente</strong> (NEW)</li>
              <li>&#9744; Num&eacute;ro de facture unique s&eacute;quentiel</li>
              <li>&#9744; Date d&apos;&eacute;mission, date d&apos;ex&eacute;cution, date d&apos;&eacute;ch&eacute;ance</li>
              <li>&#9744; D&eacute;signation pr&eacute;cise des prestations (quantit&eacute;, PU HT)</li>
              <li>&#9744; <strong>Cat&eacute;gorie d&apos;op&eacute;ration : LB / PS / Mixte</strong> (NEW)</li>
              <li>&#9744; Montants HT, TVA, TTC par taux</li>
              <li>&#9744; Conditions d&apos;escompte (ou &quot;Pas d&apos;escompte&quot;)</li>
              <li>&#9744; P&eacute;nalit&eacute;s de retard + indemnit&eacute; forfaitaire 40 &euro;</li>
              <li>&#9744; Mention <strong>&quot;Option TVA d&apos;apr&egrave;s les d&eacute;bits&quot;</strong> si applicable (NEW)</li>
              <li>&#9744; Mention &quot;Auto-liquidation art. 283-2 nonies CGI&quot; si sous-traitance BTP</li>
              <li>&#9744; Mention &quot;TVA non applicable, art. 293 B CGI&quot; si franchise</li>
              <li>&#9744; Format &eacute;lectronique Factur-X (XML CII embarqu&eacute; dans PDF)</li>
              <li>&#9744; Transmission via plateforme agr&eacute;&eacute;e (PA)</li>
            </ul>
          </div>
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
            <li><Link href="/pro/facturation-electronique-2026" style={{ color: "#C4531A" }}>Facturation &eacute;lectronique 2026 : guide complet</Link></li>
            <li><Link href="/pro/plateforme-agreee-artisan" style={{ color: "#C4531A" }}>Plateforme agr&eacute;&eacute;e pour artisans : comment choisir</Link></li>
            <li><Link href="/pro/facture-electronique-btp" style={{ color: "#C4531A" }}>Facture &eacute;lectronique BTP : multi-TVA, sous-traitance, retenue</Link></li>
            <li><Link href="/pro/glossaire" style={{ color: "#C4531A" }}>Glossaire de la facturation &eacute;lectronique</Link></li>
          </ul>
        </section>
      </article>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd({
        "@context": "https://schema.org",
        "@type": "Article",
        headline: "Les nouvelles mentions obligatoires sur les factures dès 2026",
        description: "Checklist complète des mentions obligatoires pour les factures électroniques 2026/2027.",
        author: { "@type": "Organization", name: "Bativio" },
        publisher: { "@type": "Organization", name: "Bativio" },
        datePublished: "2026-04-27",
        dateModified: "2026-04-27",
        mainEntityOfPage: { "@type": "WebPage", "@id": "https://www.bativio.fr/pro/mentions-obligatoires-2026" },
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
          { "@type": "ListItem", position: 3, name: "Mentions obligatoires", item: "https://www.bativio.fr/pro/mentions-obligatoires-2026" },
        ],
      }) }} />
    </>
  );
}
