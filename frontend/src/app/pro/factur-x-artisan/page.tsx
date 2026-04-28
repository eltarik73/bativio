/**
 * Satellite 2 : Factur-X expliqué aux artisans (~1800 mots).
 *
 * Cible SEO : "Factur-X artisan", "format facture electronique 2026",
 * "Factur-X exemple", "logiciel Factur-X TPE", "PDF XML facture".
 */
import type { Metadata } from "next";
import Link from "next/link";
import { safeJsonLd } from "@/lib/html-escape";

export const revalidate = 604800;

export const metadata: Metadata = {
  title: "Factur-X expliqué aux artisans : format, exemple, logiciels",
  description: "Factur-X est le format hybride PDF + XML adapté aux TPE/artisans. Comment ça marche, exemples, logiciels compatibles. Guide pratique Bativio.",
  keywords: "Factur-X artisan, format facture electronique, Factur-X exemple, logiciel Factur-X TPE, PDF XML facture, EN16931, CII embarque",
  alternates: { canonical: "https://www.bativio.fr/pro/factur-x-artisan" },
  openGraph: {
    title: "Factur-X expliqué aux artisans | Bativio",
    description: "Format hybride PDF+XML : pourquoi c'est idéal pour les TPE artisans.",
    url: "https://www.bativio.fr/pro/factur-x-artisan",
    type: "article",
    locale: "fr_FR",
    images: [{ url: "https://www.bativio.fr/og-image.png", width: 1200, height: 630, alt: "Factur-X expliqué aux artisans" }],
  },
  twitter: { card: "summary_large_image", title: "Factur-X expliqué aux artisans", description: "Le format hybride PDF + XML pour TPE." },
};

const FAQ = [
  { q: "Pourquoi Factur-X et pas un simple PDF ?", a: "Un PDF classique est lisible par un humain mais pas par une machine. Factur-X embarque dans le PDF un fichier XML structuré (au format CII) qui contient toutes les données de la facture (montants HT/TVA, lignes, références client). Une PA ou un logiciel comptable peut extraire ces données automatiquement, sans saisie manuelle. C'est ce qui permet l'automatisation et la conformité." },
  { q: "Tous les logiciels acceptent-ils le Factur-X ?", a: "Oui, c'est devenu le standard de fait pour les TPE françaises depuis 2024. Les logiciels comptables (Pennylane, Dougs, EBP, Sage, Cegid, Bativio) génèrent et acceptent tous Factur-X. Les PA (plateformes agréées) le routent transparemment. Aucun risque d'incompatibilité." },
  { q: "Quelle est la différence entre Factur-X et UBL ?", a: "Factur-X = PDF lisible + XML CII embarqué. UBL = XML pur (pas de PDF associé). Les deux sont conformes à la norme européenne EN16931 et acceptés par les PA. Factur-X est préféré en France et chez les TPE/artisans pour sa double lisibilité (humain + machine). UBL est utilisé en B2G et chez les grandes entreprises avec ERP." },
  { q: "Y a-t-il plusieurs niveaux de Factur-X ?", a: "Oui. Factur-X définit 5 profils selon la richesse des données XML embarquées : MINIMUM (juste l'identification), BASIC WL (sans lignes détaillées), BASIC (lignes détaillées), EN 16931 (norme européenne complète), EXTENDED (avec extensions métier). En France, le profil minimum requis est EN 16931 BASIC pour la facturation électronique 2026/2027." },
  { q: "Puis-je créer un Factur-X manuellement ?", a: "Techniquement oui (avec des outils comme PDFBox + un générateur XML CII), mais c'est extrêmement complexe et risqué (un seul caractère mal placé invalide la facture). En pratique, vous utilisez un logiciel devis-facture qui génère le Factur-X automatiquement (Bativio, Pennylane, etc.). Le coût d'un logiciel (19-30 €/mois) est négligeable face au temps gagné et au risque évité." },
  { q: "Le Factur-X est-il valide légalement comme un PDF signé ?", a: "Oui, le Factur-X émis et transmis via une plateforme agréée a la même valeur juridique qu'une facture papier ou un PDF avec signature électronique qualifiée. C'est même plus sûr juridiquement, car le cycle de vie de la facture (émission, réception, paiement) est tracé via la PA et le PPF." },
];

const TOC = [
  { id: "definition", label: "Qu'est-ce que Factur-X ?" },
  { id: "ideal-tpe", label: "Pourquoi c'est idéal pour les artisans" },
  { id: "anatomie", label: "Anatomie d'une facture Factur-X" },
  { id: "logiciels", label: "Logiciels qui génèrent du Factur-X" },
  { id: "exemple", label: "Exemple concret : facture de plomberie" },
  { id: "faq", label: "FAQ" },
];

export default function FacturXArtisanPage() {
  return (
    <>
      <nav aria-label="Fil d'Ariane" style={{ fontSize: 13, color: "#9C958D", marginBottom: 24 }}>
        <Link href="/" style={{ color: "inherit", textDecoration: "none" }}>Accueil</Link>
        <span style={{ margin: "0 8px" }}>›</span>
        <Link href="/pro" style={{ color: "inherit", textDecoration: "none" }}>Pro</Link>
        <span style={{ margin: "0 8px" }}>›</span>
        <span style={{ color: "#3D2E1F" }}>Factur-X</span>
      </nav>

      <article style={{ maxWidth: 800, margin: "0 auto" }}>
        <header style={{ marginBottom: 32 }}>
          <h1 style={{ fontFamily: "'Fraunces',serif", fontSize: "clamp(28px,4vw,40px)", fontWeight: 700, color: "#1C1C1E", lineHeight: 1.15, marginBottom: 16 }}>
            Factur-X expliqu&eacute; aux artisans : format, exemple, logiciels
          </h1>
          <p style={{ fontSize: 17, color: "#6B6560", lineHeight: 1.6 }}>
            Format hybride PDF + XML embarqu&eacute;, Factur-X est devenu le standard
            de la facture &eacute;lectronique pour les TPE et artisans fran&ccedil;ais.
            Comment &ccedil;a marche, &agrave; quoi &ccedil;a ressemble, et comment l&apos;adopter.
          </p>
          <div style={{ fontSize: 12, color: "#9C958D", marginTop: 12 }}>
            Mis &agrave; jour le 28 avril 2026 &middot; Lecture 8 min
          </div>
        </header>

        {/* Sommaire */}
        <aside style={{ background: "#FAF8F5", border: "1px solid #E8D5C0", borderRadius: 8, padding: 20, marginBottom: 32 }}>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, color: "#9C958D", marginBottom: 8 }}>Sommaire</div>
          <ol style={{ paddingLeft: 18, fontSize: 14, color: "#3D2E1F", lineHeight: 1.8 }}>
            {TOC.map((t) => (
              <li key={t.id}><a href={`#${t.id}`} style={{ color: "#3D2E1F", textDecoration: "none" }}>{t.label}</a></li>
            ))}
          </ol>
        </aside>

        {/* 1. Definition */}
        <section id="definition" style={{ marginBottom: 32 }}>
          <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 24, fontWeight: 700, color: "#1C1C1E", marginBottom: 14 }}>
            1. Qu&apos;est-ce que Factur-X ?
          </h2>
          <p style={{ fontSize: 15, color: "#3D2E1F", lineHeight: 1.7, marginBottom: 12 }}>
            <strong>Factur-X</strong> est un format de facture &eacute;lectronique
            <strong> hybride</strong> : un fichier PDF/A-3 classique dans lequel est
            embarqu&eacute; un fichier XML structur&eacute; au format <strong>CII</strong>
            (Cross-Industry Invoice de l&apos;UN/CEFACT).
          </p>
          <p style={{ fontSize: 15, color: "#3D2E1F", lineHeight: 1.7, marginBottom: 12 }}>
            Les deux composantes coexistent dans le m&ecirc;me fichier :
          </p>
          <ul style={{ fontSize: 15, color: "#3D2E1F", lineHeight: 1.7, paddingLeft: 24, marginBottom: 12 }}>
            <li><strong>Le PDF</strong> est lisible visuellement par n&apos;importe qui (votre client peut l&apos;ouvrir avec Adobe Reader, Aper&ccedil;u Mac, etc.). Il pr&eacute;sente la facture comme un document classique : en-t&ecirc;te, lignes, totaux, mentions l&eacute;gales.</li>
            <li><strong>Le XML embarqu&eacute;</strong> est lisible par machine. Il contient toutes les donn&eacute;es structur&eacute;es : SIREN &eacute;metteur et destinataire, num&eacute;ro de facture, dates, lignes (libell&eacute; / quantit&eacute; / PU HT / taux TVA), totaux par taux, mentions sp&eacute;ciales (auto-liquidation, etc.).</li>
          </ul>
          <p style={{ fontSize: 15, color: "#3D2E1F", lineHeight: 1.7 }}>
            Le format est conforme &agrave; la norme europ&eacute;enne <strong>EN16931</strong>
            (Directive 2014/55/UE sur la facturation &eacute;lectronique dans les march&eacute;s
            publics, &eacute;tendue au B2B priv&eacute; en France via la r&eacute;forme 2026).
            Il est co-d&eacute;velopp&eacute; depuis 2017 par <strong>FNFE-MPE</strong> (France) et
            <strong> FeRD</strong> (Allemagne, format ZUGFeRD identique).
          </p>
        </section>

        {/* 2. Pourquoi ideal artisans */}
        <section id="ideal-tpe" style={{ marginBottom: 32 }}>
          <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 24, fontWeight: 700, color: "#1C1C1E", marginBottom: 14 }}>
            2. Pourquoi Factur-X est id&eacute;al pour les artisans
          </h2>
          <p style={{ fontSize: 15, color: "#3D2E1F", lineHeight: 1.7, marginBottom: 12 }}>
            Comparé aux autres formats accept&eacute;s par la r&eacute;forme (UBL pur, CII pur),
            Factur-X pr&eacute;sente plusieurs avantages cl&eacute;s pour un artisan TPE :
          </p>
          <ul style={{ fontSize: 15, color: "#3D2E1F", lineHeight: 1.7, paddingLeft: 24, marginBottom: 12 }}>
            <li><strong>Lisibilit&eacute; humaine pr&eacute;serv&eacute;e</strong> : votre client (m&ecirc;me sans logiciel sophistiqu&eacute;) peut ouvrir le PDF et voir la facture comme avant. Pas de rupture d&apos;exp&eacute;rience.</li>
            <li><strong>Universel</strong> : tous les outils PDF gratuits (Aper&ccedil;u Mac, Adobe Reader, navigateur) ouvrent un Factur-X comme un PDF normal.</li>
            <li><strong>Archivage simple</strong> : un seul fichier &agrave; conserver (le .pdf), au lieu d&apos;un PDF + un XML s&eacute;par&eacute;s.</li>
            <li><strong>Adopt&eacute; par la majorit&eacute; des PA fran&ccedil;aises</strong> : c&apos;est le format par d&eacute;faut chez Bativio, Pennylane, Dougs, EBP, Azopio, etc.</li>
            <li><strong>Compatible Allemagne / Luxembourg</strong> : si vous avez des clients germanophones, ZUGFeRD (format identique) est utilis&eacute; l&agrave;-bas.</li>
            <li><strong>Pas besoin de g&eacute;rer 2 formats en parall&egrave;le</strong> : un seul Factur-X suffit pour la conformit&eacute; et pour l&apos;envoi par email en backup.</li>
          </ul>
          <p style={{ fontSize: 14, color: "#6B6560", lineHeight: 1.6, fontStyle: "italic" }}>
            En pratique : votre logiciel devis-facture (Bativio par exemple) g&eacute;n&egrave;re
            un Factur-X automatiquement &agrave; chaque facture. Vous ne voyez m&ecirc;me pas le
            XML embarqu&eacute;, c&apos;est totalement transparent.
          </p>
        </section>

        {/* 3. Anatomie */}
        <section id="anatomie" style={{ marginBottom: 32 }}>
          <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 24, fontWeight: 700, color: "#1C1C1E", marginBottom: 14 }}>
            3. Anatomie d&apos;une facture Factur-X
          </h2>
          <p style={{ fontSize: 15, color: "#3D2E1F", lineHeight: 1.7, marginBottom: 12 }}>
            Quand vous ouvrez un fichier Factur-X dans un visualiseur PDF, vous voyez la
            partie <strong>visible</strong>. Voici les principaux blocs et ce qui correspond
            dans le XML embarqu&eacute; :
          </p>
          <div style={{ background: "#FAF8F5", border: "1px solid #E8D5C0", borderRadius: 12, padding: 16, marginBottom: 16 }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #E8D5C0" }}>
                  <th style={{ textAlign: "left", padding: "8px 4px", color: "#1C1C1E" }}>Bloc visible (PDF)</th>
                  <th style={{ textAlign: "left", padding: "8px 4px", color: "#1C1C1E" }}>Champ XML CII</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: "1px solid #EDEBE7" }}>
                  <td style={{ padding: "8px 4px" }}>En-t&ecirc;te &eacute;metteur (nom, adresse, SIRET, TVA intra)</td>
                  <td style={{ padding: "8px 4px", fontFamily: "monospace", fontSize: 12 }}>SellerTradeParty</td>
                </tr>
                <tr style={{ borderBottom: "1px solid #EDEBE7" }}>
                  <td style={{ padding: "8px 4px" }}>En-t&ecirc;te destinataire (nom, adresse, SIREN)</td>
                  <td style={{ padding: "8px 4px", fontFamily: "monospace", fontSize: 12 }}>BuyerTradeParty</td>
                </tr>
                <tr style={{ borderBottom: "1px solid #EDEBE7" }}>
                  <td style={{ padding: "8px 4px" }}>Num&eacute;ro de facture, date, ch&eacute;ance</td>
                  <td style={{ padding: "8px 4px", fontFamily: "monospace", fontSize: 12 }}>ExchangedDocument/ID, IssueDateTime</td>
                </tr>
                <tr style={{ borderBottom: "1px solid #EDEBE7" }}>
                  <td style={{ padding: "8px 4px" }}>Lignes (libell&eacute;, qt&eacute;, PU HT, taux TVA, montant)</td>
                  <td style={{ padding: "8px 4px", fontFamily: "monospace", fontSize: 12 }}>IncludedSupplyChainTradeLineItem (1 par ligne)</td>
                </tr>
                <tr style={{ borderBottom: "1px solid #EDEBE7" }}>
                  <td style={{ padding: "8px 4px" }}>Totaux par taux de TVA</td>
                  <td style={{ padding: "8px 4px", fontFamily: "monospace", fontSize: 12 }}>ApplicableTradeTax</td>
                </tr>
                <tr style={{ borderBottom: "1px solid #EDEBE7" }}>
                  <td style={{ padding: "8px 4px" }}>Total HT, TVA, TTC</td>
                  <td style={{ padding: "8px 4px", fontFamily: "monospace", fontSize: 12 }}>SpecifiedTradeSettlementHeaderMonetarySummation</td>
                </tr>
                <tr>
                  <td style={{ padding: "8px 4px" }}>Mentions sp&eacute;ciales (auto-liquidation, escompte)</td>
                  <td style={{ padding: "8px 4px", fontFamily: "monospace", fontSize: 12 }}>IncludedNote</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p style={{ fontSize: 14, color: "#6B6560", lineHeight: 1.6 }}>
            Le XML est valid&eacute; par sch&eacute;ma XSD lors de l&apos;&eacute;mission via la PA :
            si une donn&eacute;e manque ou est mal format&eacute;e, la facture est rejet&eacute;e
            avant l&apos;envoi. Vous recevez un message d&apos;erreur clair pour corriger.
          </p>
        </section>

        {/* 4. Logiciels */}
        <section id="logiciels" style={{ marginBottom: 32 }}>
          <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 24, fontWeight: 700, color: "#1C1C1E", marginBottom: 14 }}>
            4. Logiciels qui g&eacute;n&egrave;rent du Factur-X
          </h2>
          <p style={{ fontSize: 15, color: "#3D2E1F", lineHeight: 1.7, marginBottom: 12 }}>
            En 2026, la quasi-totalit&eacute; des logiciels devis-facture professionnels
            fran&ccedil;ais g&eacute;n&egrave;rent du Factur-X. S&eacute;lection orient&eacute;e
            artisans :
          </p>
          <ul style={{ fontSize: 15, color: "#3D2E1F", lineHeight: 1.7, paddingLeft: 24, marginBottom: 12 }}>
            <li><strong>Bativio</strong> (via Invoquo) : g&eacute;n&eacute;ration native Factur-X &agrave; chaque facture, profil EN 16931 BASIC.</li>
            <li><strong>Pennylane</strong> : Factur-X par d&eacute;faut, profil EN 16931 EXTENDED disponible.</li>
            <li><strong>Dougs</strong> : Factur-X via partenaires comptables.</li>
            <li><strong>Azopio</strong> : sp&eacute;cialis&eacute; BTP, Factur-X EN 16931.</li>
            <li><strong>EBP / Sage / Cegid</strong> : modules Factur-X dans les versions r&eacute;centes.</li>
            <li><strong>QuickBooks</strong> : Factur-X depuis 2024.</li>
          </ul>
          <p style={{ fontSize: 14, color: "#6B6560", lineHeight: 1.6 }}>
            Si vous &eacute;mettiez vos factures sous Word/Excel jusqu&apos;ici, vous devez
            absolument basculer sur un logiciel compatible Factur-X avant septembre 2027.
            La g&eacute;n&eacute;ration manuelle n&apos;est pas une option r&eacute;aliste.
          </p>
        </section>

        {/* 5. Exemple */}
        <section id="exemple" style={{ marginBottom: 32 }}>
          <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 24, fontWeight: 700, color: "#1C1C1E", marginBottom: 14 }}>
            5. Exemple concret : facture de plomberie au format Factur-X
          </h2>
          <p style={{ fontSize: 15, color: "#3D2E1F", lineHeight: 1.7, marginBottom: 12 }}>
            Sc&eacute;nario : un plombier &agrave; Chamb&eacute;ry &eacute;met une facture pour
            une intervention de d&eacute;pannage chez un particulier.
          </p>
          <div style={{ background: "#FAF8F5", border: "1px solid #E8D5C0", borderRadius: 12, padding: 16, marginBottom: 16, fontSize: 14, color: "#3D2E1F", lineHeight: 1.7 }}>
            <p style={{ marginBottom: 6 }}><strong>&Eacute;metteur :</strong> SARL Plomberie Dupont, 5 rue du M&acirc;chage, 73000 Chamb&eacute;ry, SIRET 12345678901234, TVA FR12345678901</p>
            <p style={{ marginBottom: 6 }}><strong>Destinataire :</strong> M. Martin, 12 av. de la Lib&eacute;ration, 73100 Aix-les-Bains (B2C, pas de SIREN)</p>
            <p style={{ marginBottom: 6 }}><strong>Num&eacute;ro :</strong> F-2026-042 &middot; <strong>Date &eacute;mission :</strong> 28/04/2026 &middot; <strong>&Eacute;ch&eacute;ance :</strong> 28/05/2026</p>
            <p style={{ marginBottom: 6 }}><strong>Cat&eacute;gorie :</strong> Mixte (mat&eacute;riaux + main d&apos;&oelig;uvre)</p>
            <p style={{ marginTop: 12, marginBottom: 6 }}><strong>Lignes :</strong></p>
            <ul style={{ paddingLeft: 24, marginBottom: 12 }}>
              <li>Ligne 1 : D&eacute;pannage urgence robinet cuisine &mdash; 1h &times; 75&euro; = 75&euro; HT &agrave; 10 %</li>
              <li>Ligne 2 : Joint torique remplacement &mdash; 1 &times; 8&euro; = 8&euro; HT &agrave; 10 %</li>
              <li>Ligne 3 : D&eacute;placement &mdash; 1 &times; 35&euro; = 35&euro; HT &agrave; 10 %</li>
            </ul>
            <p style={{ marginBottom: 0 }}><strong>Total :</strong> 118&euro; HT + 11,80&euro; TVA (10%) = <strong>129,80&euro; TTC</strong></p>
          </div>
          <p style={{ fontSize: 14, color: "#6B6560", lineHeight: 1.6 }}>
            Le PDF visible montre cette pr&eacute;sentation tabulaire. Le XML CII embarqu&eacute;
            (invisible &agrave; l&apos;&oelig;il nu) contient les m&ecirc;mes donn&eacute;es structur&eacute;es,
            permettant &agrave; la PA de transmettre la facture, faire le e-reporting, et au
            client de l&apos;importer dans son logiciel comptable sans saisie.
          </p>
        </section>

        {/* 6. FAQ */}
        <section id="faq" style={{ marginBottom: 32 }}>
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
            <li><Link href="/pro/glossaire" style={{ color: "#C4531A" }}>Glossaire de la facturation &eacute;lectronique</Link></li>
            <li><Link href="/pro/devis-electronique-artisan" style={{ color: "#C4531A" }}>Devis &eacute;lectronique artisan : obligatoire ?</Link></li>
          </ul>
        </section>
      </article>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd({
        "@context": "https://schema.org",
        "@type": "Article",
        headline: "Factur-X expliqué aux artisans : format, exemple, logiciels",
        description: "Format hybride PDF + XML embarqué, idéal pour TPE artisans en 2026.",
        author: { "@type": "Organization", name: "Bativio" },
        publisher: { "@type": "Organization", name: "Bativio" },
        datePublished: "2026-04-28",
        dateModified: "2026-04-28",
        mainEntityOfPage: { "@type": "WebPage", "@id": "https://www.bativio.fr/pro/factur-x-artisan" },
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
          { "@type": "ListItem", position: 3, name: "Factur-X", item: "https://www.bativio.fr/pro/factur-x-artisan" },
        ],
      }) }} />
    </>
  );
}
