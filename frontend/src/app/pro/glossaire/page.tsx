/**
 * Glossaire de la facturation electronique 2026.
 *
 * Cible SEO : "glossaire facturation electronique", "PA PDP definition",
 * "qu'est-ce qu'une plateforme agreee", "Factur-X explication", "PPF DGFiP".
 *
 * Schema : DefinedTermSet pour rich results glossaire.
 */
import type { Metadata } from "next";
import Link from "next/link";
import { safeJsonLd } from "@/lib/html-escape";

export const revalidate = 604800; // 7 jours - contenu peu volatile

export const metadata: Metadata = {
  title: "Glossaire facturation électronique 2026 : tous les termes",
  description: "PA, PDP, OD, SC, PPF, Factur-X, e-reporting, Peppol… Tous les termes techniques de la réforme 2026 expliqués simplement aux artisans.",
  keywords: "glossaire facturation electronique, PA definition, PDP definition, PPF, DGFiP, AIFE, Factur-X, UBL, CII, Peppol, e-invoicing, e-reporting, B2B B2C B2G",
  alternates: { canonical: "https://www.bativio.fr/pro/glossaire" },
  openGraph: {
    title: "Glossaire facturation électronique 2026 | Bativio",
    description: "Tous les termes techniques de la réforme 2026 expliqués simplement aux artisans.",
    url: "https://www.bativio.fr/pro/glossaire",
    type: "article",
    locale: "fr_FR",
    images: [{ url: "https://www.bativio.fr/og-image.png", width: 1200, height: 630, alt: "Glossaire facturation électronique 2026" }],
  },
  twitter: { card: "summary_large_image", title: "Glossaire facturation électronique 2026", description: "PA, PDP, PPF, Factur-X, e-reporting expliqués." },
};

interface Term {
  id: string;
  term: string;
  acronym?: string;
  short: string;
  long: string;
  related?: string[]; // ids autres termes
  link?: { href: string; label: string }; // lien vers page /pro
}

const TERMS: Term[] = [
  {
    id: "pa", term: "Plateforme Agréée", acronym: "PA",
    short: "Opérateur privé immatriculé par la DGFiP pour émettre, recevoir et transmettre des factures électroniques.",
    long: "Une PA assure 4 services réglementés : émission des factures sortantes au format conforme (Factur-X, UBL, CII), réception des factures entrantes via le PPF, transmission des données de transaction et de paiement à la DGFiP (e-reporting), et archivage à valeur probante 10 ans. Au 16 février 2026, environ 108 plateformes sont immatriculées ou en cours d'immatriculation.",
    related: ["pdp", "ppf", "od", "sc"],
    link: { href: "/pro/plateforme-agreee-artisan", label: "Comment choisir sa PA" },
  },
  {
    id: "pdp", term: "Plateforme de Dématérialisation Partenaire", acronym: "PDP",
    short: "Ancien nom officiel des Plateformes Agréées (utilisé jusqu'en 2024).",
    long: "Le terme PDP a été remplacé par PA (Plateforme Agréée) lors de la révision réglementaire de 2024. Le rôle reste identique : opérateur privé immatriculé par la DGFiP pour intervenir dans la chaîne de la facturation électronique. Les deux termes sont strictement équivalents dans le langage courant.",
    related: ["pa"],
  },
  {
    id: "od", term: "Opérateur de Dématérialisation", acronym: "OD",
    short: "Sous-traitant non immatriculé qui propose des fonctionnalités à une PA.",
    long: "Un OD est une entreprise qui développe ou exploite des briques techniques pour le compte d'une PA mais n'est pas elle-même immatriculée par la DGFiP. Concrètement, un OD ne peut PAS émettre ni recevoir directement des factures électroniques pour le compte d'un client final. Il opère en backend.",
    related: ["pa", "sc"],
  },
  {
    id: "sc", term: "Solution Compatible", acronym: "SC",
    short: "Logiciel qui produit des factures électroniques mais doit transiter par une PA pour l'envoi réel.",
    long: "Une SC (Solution Compatible) est un outil de facturation classique qui sait générer des fichiers au format Factur-X ou UBL conforme. Elle peut envoyer les factures à une PA partenaire qui se chargera de la transmission via le PPF. La SC seule n'est pas suffisante pour être en conformité : il faut obligatoirement la coupler à une PA.",
    related: ["pa", "od", "factur-x"],
  },
  {
    id: "ppf", term: "Portail Public de Facturation", acronym: "PPF",
    short: "Infrastructure publique gérée par l'AIFE servant d'annuaire central et de routeur de transit.",
    long: "Le PPF est l'infrastructure d'État qui sert de point central pour la facturation électronique : il maintient l'annuaire de toutes les entreprises et de leurs PA désignées, et assure le routage des factures entre PA. Initialement prévu comme alternative gratuite, son rôle s'est limité à l'annuaire et au transit. Pour un usage professionnel, une PA reste recommandée pour la valeur ajoutée.",
    related: ["pa", "aife", "annuaire-central"],
  },
  {
    id: "dgfip", term: "Direction Générale des Finances Publiques", acronym: "DGFiP",
    short: "Administration fiscale française responsable de la mise en œuvre de la réforme.",
    long: "La DGFiP est l'administration centrale du ministère de l'Économie qui gère l'impôt, la TVA, les contrôles fiscaux et les relations avec les contribuables. Dans le cadre de la réforme 2026, c'est elle qui immatricule les Plateformes Agréées, valide leur conformité technique, et reçoit les données d'e-reporting transmises par les PA.",
  },
  {
    id: "aife", term: "Agence pour l'Informatique Financière de l'État", acronym: "AIFE",
    short: "Service de l'État responsable du PPF et de l'annuaire central.",
    long: "L'AIFE est l'agence interministérielle qui développe et exploite Chorus Pro (facturation à la sphère publique B2G depuis 2017) ainsi que le futur PPF (Portail Public de Facturation pour B2B/B2C dès 2026). C'est l'opérateur technique de l'État pour la facturation électronique.",
    related: ["ppf", "dgfip"],
  },
  {
    id: "factur-x", term: "Factur-X",
    short: "Format hybride PDF + XML embarqué, le plus utilisé par les TPE.",
    long: "Factur-X est un format européen normalisé (EN16931) qui combine un PDF lisible visuellement avec un fichier XML structuré (au format CII Cross-Industry Invoice) embarqué à l'intérieur du PDF. Avantage : la facture reste lisible comme un PDF classique pour un humain, mais un logiciel peut extraire automatiquement les données structurées. C'est le format recommandé pour les TPE et artisans.",
    related: ["ubl", "cii", "ppf"],
    link: { href: "/pro/factur-x-artisan", label: "Factur-X expliqué aux artisans" },
  },
  {
    id: "ubl", term: "Universal Business Language", acronym: "UBL",
    short: "Format XML pur utilisé en Europe pour les marchés publics et ERP gros volume.",
    long: "UBL est un standard OASIS de facture électronique au format XML pur. Il est largement utilisé dans les administrations européennes et les ERP gros volume. Il est moins lisible visuellement que Factur-X (pas de PDF associé) mais plus standard à l'international. Accepté par toutes les PA.",
    related: ["factur-x", "cii"],
  },
  {
    id: "cii", term: "Cross-Industry Invoice", acronym: "CII",
    short: "Format XML pur de l'UN/CEFACT, base technique de Factur-X.",
    long: "CII est le format de référence de l'UN/CEFACT (organisme onusien de standardisation). Il est utilisé en B2B grandes entreprises et constitue la couche technique XML embarquée dans Factur-X. Plus complet techniquement qu'UBL mais aussi plus complexe à intégrer.",
    related: ["factur-x", "ubl"],
  },
  {
    id: "peppol", term: "Peppol",
    short: "Réseau international d'échange sécurisé de factures électroniques B2B et B2G.",
    long: "Peppol (Pan-European Public Procurement OnLine) est un réseau supranational d'opérateurs (Access Points) qui permet l'échange standardisé de factures électroniques au format UBL entre entreprises et administrations dans 30+ pays. La France n'utilise pas Peppol par défaut (préfère le PPF national) mais certaines PA proposent une passerelle Peppol pour les entreprises ayant des clients étrangers.",
    related: ["ubl", "ppf"],
  },
  {
    id: "e-invoicing", term: "e-invoicing",
    short: "Émission et réception de factures électroniques (au sens strict de la réforme).",
    long: "L'e-invoicing désigne l'échange de factures structurées (XML) entre l'émetteur et le destinataire via une plateforme agréée, sans intervention papier ni email PDF non structuré. Il devient obligatoire en France à partir du 1er septembre 2026 pour la réception et progressivement pour l'émission jusqu'en septembre 2027.",
    related: ["e-reporting", "pa", "factur-x"],
    link: { href: "/pro/facturation-electronique-2026", label: "Guide réforme 2026" },
  },
  {
    id: "e-reporting", term: "e-reporting",
    short: "Transmission automatique des données de transaction et de paiement à la DGFiP.",
    long: "L'e-reporting est la déclaration en quasi temps réel à la DGFiP des données de toutes les opérations qui ne sont pas couvertes par l'e-invoicing : transactions B2C avec particuliers, opérations internationales (export, intra-UE), encaissements (date et montant des paiements reçus). C'est obligatoire en parallèle de l'e-invoicing et géré automatiquement par les PA.",
    related: ["e-invoicing", "pa", "dgfip"],
  },
  {
    id: "b2b-b2c-b2g", term: "B2B / B2C / B2G",
    short: "B2B = entreprises entre elles ; B2C = entreprise vers particulier ; B2G = entreprise vers administration.",
    long: "B2B (Business to Business) : transactions entre deux entreprises assujetties à la TVA. Soumis à l'e-invoicing dès septembre 2026. B2C (Business to Consumer) : transactions vers les particuliers. Pas d'e-invoicing obligatoire mais e-reporting obligatoire. B2G (Business to Government) : transactions vers le secteur public. Déjà obligatoirement électronique depuis 2017 via Chorus Pro.",
    related: ["e-invoicing", "e-reporting"],
  },
  {
    id: "immatriculation", term: "Immatriculation sous réserve / définitive",
    short: "Statut administratif d'une PA auprès de la DGFiP, en deux étapes.",
    long: "Une plateforme candidate est d'abord immatriculée 'sous réserve' après évaluation technique initiale (audit du dossier, conformité fonctionnelle). L'immatriculation devient 'définitive' après vérification opérationnelle en conditions réelles (typiquement au-delà de septembre 2026). Les PA sous réserve peuvent être utilisées légalement pendant la période transitoire.",
    related: ["pa", "dgfip"],
  },
  {
    id: "annuaire-central", term: "Annuaire central",
    short: "Référentiel public maintenu par le PPF qui liste toutes les entreprises et leur PA désignée.",
    long: "L'annuaire central est l'équivalent numérique du registre du commerce pour la facturation électronique. Il associe chaque SIREN à une PA destinataire (ou au PPF par défaut). Avant d'émettre une facture, votre PA consulte l'annuaire pour savoir où l'envoyer chez le destinataire. Vous devez désigner votre PA dans l'annuaire (opération faite via la PA elle-même).",
    related: ["ppf", "pa"],
  },
  {
    id: "cycle-vie", term: "Cycle de vie d'une facture",
    short: "Suite de statuts officiels que prend une facture électronique dans la chaîne PA/PPF.",
    long: "Une facture électronique passe par plusieurs statuts trackés : Déposée (envoyée par l'émetteur), Refusée (rejet technique du PPF/PA), Reçue (acceptée par le destinataire), Approuvée (validation métier du destinataire), Litigieuse (contestation), Encaissée (paiement effectif déclaré). Vous suivez ces statuts en temps réel dans votre interface de PA.",
    related: ["pa", "e-invoicing"],
  },
  {
    id: "tva-debits", term: "TVA sur les débits / sur les encaissements",
    short: "Deux régimes possibles pour le moment d'exigibilité de la TVA.",
    long: "TVA sur les encaissements (régime par défaut pour les prestations de services) : la TVA est due lors du paiement effectif par le client. TVA sur les débits (option) : la TVA est due dès l'émission de la facture. La 2e option permet de récupérer la TVA déductible plus tôt (utile pour chantiers longs avec délais de paiement étirés). Doit être indiquée explicitement sur chaque facture si choisie.",
    related: ["multi-tva"],
    link: { href: "/pro/mentions-obligatoires-2026", label: "Mentions obligatoires 2026" },
  },
  {
    id: "multi-tva", term: "Multi-TVA",
    short: "Combinaison de plusieurs taux de TVA (5,5 / 10 / 20 %) sur une même facture, fréquente en BTP.",
    long: "Le BTP est l'un des rares secteurs où une seule facture peut combiner les 3 taux de TVA français : 5,5 % (rénovation énergétique RGE), 10 % (rénovation logement > 2 ans), 20 % (neuf ou non-résidentiel). La PA et le logiciel doivent calculer un sous-total HT/TVA/TTC par taux + un total général.",
    related: ["tva-debits"],
    link: { href: "/pro/facture-electronique-btp", label: "Facture électronique BTP" },
  },
  {
    id: "retenue-garantie", term: "Retenue de garantie",
    short: "Mécanisme de garantie où le maître d'ouvrage conserve 5 % du marché pendant 1 an après réception des travaux.",
    long: "La retenue de garantie (loi du 16 juillet 1971) est une déduction du montant à payer immédiatement, conservée par le client pendant 12 mois après la réception des travaux pour garantir la bonne exécution. Sur une facture électronique, elle apparaît en pied comme déduction du TTC (sans modifier la base TVA). Peut être remplacée par une caution bancaire.",
    related: ["situation-travaux"],
    link: { href: "/pro/facture-electronique-btp", label: "Retenue de garantie BTP" },
  },
  {
    id: "situation-travaux", term: "Situation de travaux",
    short: "Facture intermédiaire correspondant à l'avancement réel d'un chantier long.",
    long: "Sur les chantiers longs (>1 mois), l'artisan émet plusieurs factures de situation à mesure de l'avancement (par ex. situation N°3 sur 5, 60 % avancé). Chaque situation est une facture électronique conforme à part entière. À la fin, une facture de solde déduit toutes les situations déjà émises.",
    related: ["facture-acompte", "retenue-garantie"],
  },
  {
    id: "facture-acompte", term: "Facture d'acompte",
    short: "Facture émise avant le démarrage d'un chantier (typiquement 30-40 % du devis signé).",
    long: "La facture d'acompte permet à l'artisan de sécuriser le financement initial d'un chantier (achat matériaux, frais de démarrage). Elle est calculée sur le montant encaissé et la TVA est immédiatement collectée. Lors de la facture de solde, les acomptes sont déduits du total. La mention 'Facture d'acompte' est obligatoire sur le document.",
    related: ["situation-travaux"],
  },
];

export default function GlossairePage() {
  return (
    <>
      <nav aria-label="Fil d'Ariane" style={{ fontSize: 13, color: "#9C958D", marginBottom: 24 }}>
        <Link href="/" style={{ color: "inherit", textDecoration: "none" }}>Accueil</Link>
        <span style={{ margin: "0 8px" }}>›</span>
        <Link href="/pro" style={{ color: "inherit", textDecoration: "none" }}>Pro</Link>
        <span style={{ margin: "0 8px" }}>›</span>
        <span style={{ color: "#3D2E1F" }}>Glossaire</span>
      </nav>

      <article style={{ maxWidth: 800, margin: "0 auto" }}>
        <header style={{ marginBottom: 32 }}>
          <h1 style={{ fontFamily: "'Fraunces',serif", fontSize: "clamp(28px,4vw,40px)", fontWeight: 700, color: "#1C1C1E", lineHeight: 1.15, marginBottom: 16 }}>
            Glossaire de la facturation &eacute;lectronique 2026
          </h1>
          <p style={{ fontSize: 17, color: "#6B6560", lineHeight: 1.6 }}>
            Tous les termes techniques de la r&eacute;forme expliqu&eacute;s simplement
            pour les artisans : PA, PDP, PPF, Factur-X, e-reporting, multi-TVA&hellip;
            22 d&eacute;finitions pour ne plus confondre les sigles.
          </p>
          <div style={{ fontSize: 12, color: "#9C958D", marginTop: 12 }}>
            Mis &agrave; jour le 27 avril 2026 &middot; {TERMS.length} entr&eacute;es
          </div>
        </header>

        {/* Table des matieres avec ancres */}
        <aside style={{ background: "#FAF8F5", border: "1px solid #E8D5C0", borderRadius: 12, padding: 20, marginBottom: 32 }}>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, color: "#9C958D", marginBottom: 12 }}>
            Acc&egrave;s rapide
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 4 }}>
            {TERMS.map((t) => (
              <a key={t.id} href={`#${t.id}`} style={{ fontSize: 13, color: "#3D2E1F", textDecoration: "none", padding: "4px 0" }}>
                {t.acronym ? `${t.acronym} — ` : ""}{t.term}
              </a>
            ))}
          </div>
        </aside>

        {/* Termes */}
        {TERMS.map((t, i) => (
          <section id={t.id} key={t.id} style={{ marginBottom: 28, paddingBottom: 28, borderBottom: i < TERMS.length - 1 ? "1px solid #EDEBE7" : "none", scrollMarginTop: 80 }}>
            <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 22, fontWeight: 700, color: "#1C1C1E", marginBottom: 8 }}>
              {t.term}{t.acronym && <span style={{ color: "#C4531A", fontWeight: 600, marginLeft: 8 }}>({t.acronym})</span>}
            </h2>
            <p style={{ fontSize: 15, color: "#3D2E1F", lineHeight: 1.6, fontWeight: 600, marginBottom: 12 }}>
              {t.short}
            </p>
            <p style={{ fontSize: 14, color: "#6B6560", lineHeight: 1.7, marginBottom: 12 }}>
              {t.long}
            </p>
            {(t.related && t.related.length > 0) && (
              <div style={{ fontSize: 13, color: "#6B6560" }}>
                <strong>Termes li&eacute;s :</strong>{" "}
                {t.related.map((rid, idx) => {
                  const r = TERMS.find((x) => x.id === rid);
                  if (!r) return null;
                  return (
                    <span key={rid}>
                      {idx > 0 && ", "}
                      <a href={`#${rid}`} style={{ color: "#C4531A", textDecoration: "none" }}>
                        {r.acronym || r.term}
                      </a>
                    </span>
                  );
                })}
              </div>
            )}
            {t.link && (
              <div style={{ fontSize: 13, color: "#6B6560", marginTop: 8 }}>
                &rarr; <Link href={t.link.href} style={{ color: "#C4531A", textDecoration: "underline" }}>{t.link.label}</Link>
              </div>
            )}
          </section>
        ))}

        {/* A lire aussi */}
        <section style={{ background: "#fff", border: "1px solid #E8D5C0", borderRadius: 12, padding: 24, marginTop: 40 }}>
          <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 18, fontWeight: 700, color: "#1C1C1E", marginBottom: 12 }}>
            &Agrave; lire aussi
          </h2>
          <ul style={{ fontSize: 14, lineHeight: 1.8, paddingLeft: 18 }}>
            <li><Link href="/pro/facturation-electronique-2026" style={{ color: "#C4531A" }}>Guide complet r&eacute;forme 2026</Link></li>
            <li><Link href="/pro/comparatif-pa" style={{ color: "#C4531A" }}>Comparatif des plateformes agr&eacute;&eacute;es 2026</Link></li>
            <li><Link href="/pro/factur-x-artisan" style={{ color: "#C4531A" }}>Factur-X expliqu&eacute; aux artisans</Link></li>
            <li><Link href="/pro/sanctions-facturation-electronique" style={{ color: "#C4531A" }}>Sanctions facturation &eacute;lectronique</Link></li>
            <li><Link href="/pro/auto-entrepreneur-batiment-2026" style={{ color: "#C4531A" }}>Auto-entrepreneur du b&acirc;timent et 2026</Link></li>
          </ul>
        </section>
      </article>

      {/* JSON-LD : DefinedTermSet */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd({
        "@context": "https://schema.org",
        "@type": "DefinedTermSet",
        name: "Glossaire de la facturation électronique 2026",
        url: "https://www.bativio.fr/pro/glossaire",
        description: "22 définitions des termes techniques de la réforme de la facturation électronique.",
        hasDefinedTerm: TERMS.map((t) => ({
          "@type": "DefinedTerm",
          "@id": `https://www.bativio.fr/pro/glossaire#${t.id}`,
          name: t.term + (t.acronym ? ` (${t.acronym})` : ""),
          description: t.short,
          inDefinedTermSet: "https://www.bativio.fr/pro/glossaire",
        })),
      }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Accueil", item: "https://www.bativio.fr" },
          { "@type": "ListItem", position: 2, name: "Pro", item: "https://www.bativio.fr/pro" },
          { "@type": "ListItem", position: 3, name: "Glossaire", item: "https://www.bativio.fr/pro/glossaire" },
        ],
      }) }} />
    </>
  );
}
