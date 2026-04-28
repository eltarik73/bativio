/**
 * Satellite 3 : Devis electronique artisan (~1800 mots).
 *
 * Cible SEO : "devis electronique artisan", "devis obligatoire 2026",
 * "signature electronique devis", "devis automatique BTP", "mention obligatoire devis".
 */
import type { Metadata } from "next";
import Link from "next/link";
import { safeJsonLd } from "@/lib/html-escape";

export const revalidate = 604800;

export const metadata: Metadata = {
  title: "Devis électronique artisan : obligatoire en 2026 ?",
  description: "Le devis électronique n'est pas (encore) obligatoire en 2026, mais devient un standard. Cadre légal, mentions, signature électronique. Guide Bativio.",
  keywords: "devis electronique artisan, devis obligatoire 2026, signature electronique devis, devis automatique BTP, mention obligatoire devis, devis BTP electronique",
  alternates: { canonical: "https://www.bativio.fr/pro/devis-electronique-artisan" },
  openGraph: {
    title: "Devis électronique artisan : obligatoire en 2026 ? | Bativio",
    description: "Cadre légal, mentions obligatoires, signature électronique. Le guide pratique pour artisans.",
    url: "https://www.bativio.fr/pro/devis-electronique-artisan",
    type: "article",
    locale: "fr_FR",
    images: [{ url: "https://www.bativio.fr/og-image.png", width: 1200, height: 630, alt: "Devis électronique artisan" }],
  },
  twitter: { card: "summary_large_image", title: "Devis électronique artisan", description: "Obligatoire en 2026 ? Cadre légal et bonnes pratiques." },
};

const FAQ = [
  { q: "Le devis électronique est-il obligatoire en 2026 comme la facture ?", a: "Non. La réforme 2026/2027 concerne uniquement les FACTURES (et l'e-reporting). Le devis reste libre de format : papier, PDF email, devis électronique signé. Mais en pratique, beaucoup d'artisans basculent vers l'électronique en même temps que la facture pour homogénéiser leur processus." },
  { q: "Un devis signé électroniquement a-t-il la même valeur qu'un devis papier signé ?", a: "Oui, si la signature respecte le règlement européen eIDAS. Trois niveaux existent : signature simple (clic 'J'accepte'), signature avancée (avec authentification), signature qualifiée (équivalent papier). Pour un devis BTP < 50 000 €, la signature avancée suffit largement et est juridiquement opposable." },
  { q: "Quelle est la durée légale de validité d'un devis ?", a: "Par défaut, un devis est valable 3 mois (jurisprudence Code civil). Vous pouvez raccourcir ou allonger cette durée en l'indiquant explicitement (ex: 'Validité 30 jours'). Pour le BTP, 30 à 90 jours est l'usage. Au-delà, les prix matériaux peuvent avoir évolué et vous pouvez refacturer." },
  { q: "Faut-il faire signer le devis avant les travaux ?", a: "OUI, c'est même obligatoire pour les marchés > 1 500 € TTC pour les particuliers (loi Châtel 2008). Sans devis signé, vous ne pouvez pas réclamer le paiement. La signature peut être manuscrite (papier) ou électronique. Bativio inclut la signature électronique en quelques clics." },
  { q: "Le devis et la facture peuvent-ils utiliser le même format Factur-X ?", a: "Non. Factur-X est spécifique aux factures. Le devis utilise un format libre (PDF, Word, papier). Vous pouvez en revanche conserver une présentation visuelle similaire pour cohérence : Bativio génère devis et factures avec le même template visuel pour votre client." },
  { q: "Devis automatisé : quel intérêt ?", a: "Un devis automatisé (via catalogue de prestations + calcul TVA + envoi email auto) divise par 5 le temps de production : 30 secondes au lieu de 15 minutes. Sur un volume de 10 devis/mois, vous économisez 2h30/mois soit 30h/an. C'est l'équivalent d'une journée et demie de chantier facturée en plus." },
];

export default function DevisElectroniqueArtisanPage() {
  return (
    <>
      <nav aria-label="Fil d'Ariane" style={{ fontSize: 13, color: "#9C958D", marginBottom: 24 }}>
        <Link href="/" style={{ color: "inherit", textDecoration: "none" }}>Accueil</Link>
        <span style={{ margin: "0 8px" }}>›</span>
        <Link href="/pro" style={{ color: "inherit", textDecoration: "none" }}>Pro</Link>
        <span style={{ margin: "0 8px" }}>›</span>
        <span style={{ color: "#3D2E1F" }}>Devis électronique</span>
      </nav>

      <article style={{ maxWidth: 800, margin: "0 auto" }}>
        <header style={{ marginBottom: 32 }}>
          <h1 style={{ fontFamily: "'Fraunces',serif", fontSize: "clamp(28px,4vw,40px)", fontWeight: 700, color: "#1C1C1E", lineHeight: 1.15, marginBottom: 16 }}>
            Devis &eacute;lectronique artisan : obligatoire en 2026 ?
          </h1>
          <p style={{ fontSize: 17, color: "#6B6560", lineHeight: 1.6 }}>
            Le devis &eacute;lectronique n&apos;est pas obligatoire en 2026 (contrairement
            &agrave; la facture), mais devient le standard pour les artisans qui veulent
            gagner du temps et professionnaliser leur image. Cadre l&eacute;gal, mentions,
            signature &eacute;lectronique : le guide complet.
          </p>
          <div style={{ fontSize: 12, color: "#9C958D", marginTop: 12 }}>
            Mis &agrave; jour le 28 avril 2026 &middot; Lecture 7 min
          </div>
        </header>

        {/* 1. Devis vs facture */}
        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 24, fontWeight: 700, color: "#1C1C1E", marginBottom: 14 }}>
            1. Devis vs facture : la diff&eacute;rence l&eacute;gale
          </h2>
          <p style={{ fontSize: 15, color: "#3D2E1F", lineHeight: 1.7, marginBottom: 12 }}>
            Avant de parler &eacute;lectronique, rappelons la diff&eacute;rence entre devis
            et facture :
          </p>
          <ul style={{ fontSize: 15, color: "#3D2E1F", lineHeight: 1.7, paddingLeft: 24, marginBottom: 12 }}>
            <li><strong>Le devis</strong> est une proposition commerciale chiffrée et descriptive, &eacute;mise <strong>avant</strong> la r&eacute;alisation des travaux. Il engage l&apos;artisan sur le prix et la prestation s&apos;il est sign&eacute; par le client.</li>
            <li><strong>La facture</strong> est un document fiscal &eacute;mis <strong>apr&egrave;s</strong> la r&eacute;alisation des travaux (ou par tranches pour les chantiers longs). Elle d&eacute;clenche l&apos;exigibilit&eacute; de la TVA et l&apos;obligation de paiement par le client.</li>
          </ul>
          <p style={{ fontSize: 15, color: "#3D2E1F", lineHeight: 1.7 }}>
            La <strong>r&eacute;forme 2026/2027</strong> concerne uniquement les factures
            (et l&apos;e-reporting). Le devis reste juridiquement libre dans son format.
            C&apos;est une diff&eacute;rence cl&eacute; trop souvent ignor&eacute;e.
          </p>
        </section>

        {/* 2. Le devis et la reforme 2026 */}
        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 24, fontWeight: 700, color: "#1C1C1E", marginBottom: 14 }}>
            2. Le devis est-il concern&eacute; par la r&eacute;forme 2026 ?
          </h2>
          <p style={{ fontSize: 15, color: "#3D2E1F", lineHeight: 1.7, marginBottom: 12 }}>
            <strong>R&eacute;ponse claire : NON, le devis n&apos;est PAS soumis &agrave;
            l&apos;obligation de format &eacute;lectronique 2026.</strong>
            Vous pouvez continuer &agrave; envoyer vos devis :
          </p>
          <ul style={{ fontSize: 15, color: "#3D2E1F", lineHeight: 1.7, paddingLeft: 24, marginBottom: 12 }}>
            <li>En version papier (rendez-vous client physique avec impression)</li>
            <li>En PDF par email (la pratique la plus r&eacute;pandue depuis 2010)</li>
            <li>En lien web partag&eacute; (devis g&eacute;n&eacute;r&eacute; en ligne par votre logiciel)</li>
            <li>En document &eacute;lectronique sign&eacute; (eIDAS)</li>
          </ul>
          <p style={{ fontSize: 15, color: "#3D2E1F", lineHeight: 1.7, marginBottom: 12 }}>
            <strong>Mais dans les faits</strong>, le devis &eacute;lectronique sign&eacute;
            sera de plus en plus standard pour 3 raisons :
          </p>
          <ol style={{ fontSize: 15, color: "#3D2E1F", lineHeight: 1.7, paddingLeft: 24 }}>
            <li>Si votre client est une entreprise B2B avec processus &eacute;lectronique pour les factures, il appr&eacute;ciera la coh&eacute;rence sur le devis aussi.</li>
            <li>Le gain de temps op&eacute;rationnel (devis &eacute;mis en 30 sec au lieu de 15 min) est massif.</li>
            <li>La signature &eacute;lectronique acc&eacute;l&egrave;re la conversion (40 % de devis sign&eacute;s en moyenne sous 24h vs 12 jours en papier).</li>
          </ol>
        </section>

        {/* 3. Mentions obligatoires devis */}
        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 24, fontWeight: 700, color: "#1C1C1E", marginBottom: 14 }}>
            3. Les mentions obligatoires sur un devis artisan
          </h2>
          <p style={{ fontSize: 15, color: "#3D2E1F", lineHeight: 1.7, marginBottom: 12 }}>
            Un devis artisan doit contenir les mentions suivantes (CGI art. 289, Code de
            la consommation art. L111-1 et L111-2, et arr&ecirc;t&eacute; du 2 mars 1990
            pour le BTP) :
          </p>
          <div style={{ background: "#FAF8F5", border: "1px solid #E8D5C0", borderRadius: 12, padding: 16, marginBottom: 16 }}>
            <ul style={{ fontSize: 14, color: "#3D2E1F", lineHeight: 1.8, paddingLeft: 18 }}>
              <li><strong>Le mot &laquo; Devis &raquo;</strong> en t&ecirc;te du document</li>
              <li><strong>Date d&apos;&eacute;mission</strong> du devis</li>
              <li><strong>Identit&eacute; vendeur</strong> : nom, adresse, SIRET, forme juridique, num&eacute;ro de TVA intra (sauf franchise)</li>
              <li><strong>Identit&eacute; client</strong> : nom, adresse, SIREN si B2B</li>
              <li><strong>Adresse du chantier</strong> si diff&eacute;rente de l&apos;adresse client</li>
              <li><strong>Description d&eacute;taill&eacute;e</strong> de chaque prestation : quantit&eacute;, dur&eacute;e, mat&eacute;riaux, qualit&eacute;</li>
              <li><strong>Prix unitaire HT</strong> de chaque prestation</li>
              <li><strong>Quantit&eacute;</strong> et <strong>total HT</strong> par ligne</li>
              <li><strong>Taux de TVA</strong> applicable par ligne (5,5 / 10 / 20 %)</li>
              <li><strong>Total HT, TVA, TTC</strong> du devis</li>
              <li><strong>Dur&eacute;e de validit&eacute;</strong> du devis (par d&eacute;faut 3 mois)</li>
              <li><strong>D&eacute;lais d&apos;ex&eacute;cution</strong> ou date de d&eacute;but pr&eacute;visionnelle</li>
              <li><strong>Modalit&eacute;s de paiement</strong> : acompte demand&eacute; (si oui), &eacute;ch&eacute;ances de situation, paiement final</li>
              <li><strong>Conditions de r&eacute;tractation</strong> 14 jours pour les particuliers (Loi Hamon)</li>
              <li><strong>Garantie d&eacute;cennale</strong> ou biennale selon la nature des travaux</li>
              <li><strong>Mention</strong> &laquo; Devis gratuit, sans engagement &raquo; (sauf si payant : alors prix mentionn&eacute;)</li>
              <li><strong>Espaces signature</strong> : client + artisan</li>
            </ul>
          </div>
          <p style={{ fontSize: 14, color: "#6B6560", lineHeight: 1.6, fontStyle: "italic" }}>
            Sp&eacute;cificit&eacute; BTP &gt; 1 500 &euro; TTC : le devis est obligatoire et doit
            mentionner le mot &laquo; Devis &raquo; en t&ecirc;te. Pour les d&eacute;pannages
            d&apos;urgence (plomberie, &eacute;lectricit&eacute;), le devis peut &ecirc;tre verbal
            mais doit &ecirc;tre confirm&eacute; par &eacute;crit dans les 8 jours.
          </p>
        </section>

        {/* 4. Signature electronique */}
        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 24, fontWeight: 700, color: "#1C1C1E", marginBottom: 14 }}>
            4. La signature &eacute;lectronique du devis
          </h2>
          <p style={{ fontSize: 15, color: "#3D2E1F", lineHeight: 1.7, marginBottom: 12 }}>
            Le r&egrave;glement europ&eacute;en <strong>eIDAS</strong> (n&deg; 910/2014)
            d&eacute;finit 3 niveaux de signature &eacute;lectronique, du plus simple au
            plus contraignant :
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12, marginBottom: 16 }}>
            <div style={{ background: "#fff", border: "1px solid #E8D5C0", borderRadius: 12, padding: 16 }}>
              <div style={{ fontWeight: 700, color: "#1C1C1E", marginBottom: 6 }}>1. Simple</div>
              <p style={{ fontSize: 13, color: "#6B6560", lineHeight: 1.5, marginBottom: 8 }}>
                Clic sur bouton &laquo; J&apos;accepte &raquo;, scan signature manuscrite,
                acceptation par email.
              </p>
              <p style={{ fontSize: 13, color: "#6B6560", lineHeight: 1.5, marginBottom: 0 }}>
                <strong>Suffisant</strong> pour un devis BTP &lt; 5 000 &euro;.
              </p>
            </div>
            <div style={{ background: "#fff", border: "1px solid #C4531A", borderRadius: 12, padding: 16 }}>
              <div style={{ fontWeight: 700, color: "#C4531A", marginBottom: 6 }}>2. Avanc&eacute;e</div>
              <p style={{ fontSize: 13, color: "#6B6560", lineHeight: 1.5, marginBottom: 8 }}>
                Avec authentification du signataire (SMS OTP, email v&eacute;rifi&eacute;, IP, horodatage qualifi&eacute;).
              </p>
              <p style={{ fontSize: 13, color: "#6B6560", lineHeight: 1.5, marginBottom: 0 }}>
                <strong>Recommand&eacute;</strong> pour devis BTP 5 000 - 50 000 &euro;.
              </p>
            </div>
            <div style={{ background: "#fff", border: "1px solid #E8D5C0", borderRadius: 12, padding: 16 }}>
              <div style={{ fontWeight: 700, color: "#1C1C1E", marginBottom: 6 }}>3. Qualifi&eacute;e</div>
              <p style={{ fontSize: 13, color: "#6B6560", lineHeight: 1.5, marginBottom: 8 }}>
                Avec certificat qualifi&eacute; d&eacute;livr&eacute; par un prestataire eIDAS (DocuSign Qualified, Universign QES).
              </p>
              <p style={{ fontSize: 13, color: "#6B6560", lineHeight: 1.5, marginBottom: 0 }}>
                <strong>Pour</strong> devis &gt; 50 000 &euro; ou march&eacute;s sensibles.
              </p>
            </div>
          </div>
          <p style={{ fontSize: 15, color: "#3D2E1F", lineHeight: 1.7 }}>
            La majorit&eacute; des artisans utilisent la <strong>signature avanc&eacute;e</strong>,
            int&eacute;gr&eacute;e par d&eacute;faut dans Bativio (envoi du devis par lien email,
            authentification SMS du client, horodatage). Juridiquement opposable, simple
            d&apos;usage, gratuite dans le plan Pro de Bativio.
          </p>
        </section>

        {/* 5. Devis automatise */}
        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 24, fontWeight: 700, color: "#1C1C1E", marginBottom: 14 }}>
            5. Devis automatis&eacute; : int&eacute;r&ecirc;t pour les artisans
          </h2>
          <p style={{ fontSize: 15, color: "#3D2E1F", lineHeight: 1.7, marginBottom: 12 }}>
            Au-del&agrave; de la conformit&eacute; et de la signature, l&apos;automatisation
            du devis offre 4 b&eacute;n&eacute;fices op&eacute;rationnels concrets :
          </p>
          <ul style={{ fontSize: 15, color: "#3D2E1F", lineHeight: 1.7, paddingLeft: 24, marginBottom: 12 }}>
            <li><strong>Gain de temps</strong> : 30 secondes par devis (catalogue + calcul auto + envoi) au lieu de 10-15 min en saisie manuelle. Sur 10 devis/mois = 2h30 &eacute;conomis&eacute;es.</li>
            <li><strong>Coh&eacute;rence visuelle</strong> : tous vos devis ont le m&ecirc;me design pro, votre logo, vos couleurs. Image professionnelle renforc&eacute;e.</li>
            <li><strong>Suivi de conversion</strong> : vous savez quand le client a ouvert le devis, combien de fois il l&apos;a relu, quand il a sign&eacute; (analytics).</li>
            <li><strong>Relance automatique</strong> : si pas de signature sous 48h, le client re&ccedil;oit un email de rappel automatique. Le taux de conversion grimpe de 35 % (donn&eacute;es Bativio).</li>
          </ul>
          <p style={{ fontSize: 15, color: "#3D2E1F", lineHeight: 1.7 }}>
            Pour 19 &euro;/mois (Bativio Starter), vous &eacute;mettez devis et factures
            illimit&eacute;s, automatis&eacute;s, conformes. Le ROI est presque imm&eacute;diat
            d&egrave;s 1 chantier par mois.
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
            <li><Link href="/pro/factur-x-artisan" style={{ color: "#C4531A" }}>Factur-X expliqu&eacute; aux artisans</Link></li>
            <li><Link href="/pro/mentions-obligatoires-2026" style={{ color: "#C4531A" }}>Mentions obligatoires sur les factures</Link></li>
            <li><Link href="/pro/glossaire" style={{ color: "#C4531A" }}>Glossaire de la facturation &eacute;lectronique</Link></li>
          </ul>
        </section>
      </article>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd({
        "@context": "https://schema.org",
        "@type": "Article",
        headline: "Devis électronique artisan : obligatoire en 2026 ?",
        description: "Cadre légal, mentions obligatoires, signature électronique, automatisation pour artisans BTP.",
        author: { "@type": "Organization", name: "Bativio" },
        publisher: { "@type": "Organization", name: "Bativio" },
        datePublished: "2026-04-28",
        dateModified: "2026-04-28",
        mainEntityOfPage: { "@type": "WebPage", "@id": "https://www.bativio.fr/pro/devis-electronique-artisan" },
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
          { "@type": "ListItem", position: 3, name: "Devis électronique", item: "https://www.bativio.fr/pro/devis-electronique-artisan" },
        ],
      }) }} />
    </>
  );
}
