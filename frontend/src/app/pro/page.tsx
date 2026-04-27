/**
 * Landing /pro/ — racine du cluster B2B SEO.
 *
 * Cible : "logiciel devis facture artisan", "logiciel BTP 2026",
 * "facturation electronique artisan", "Bativio".
 */
import type { Metadata } from "next";
import Link from "next/link";
import { safeJsonLd } from "@/lib/html-escape";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Bativio Pro — Logiciel devis facture conforme 2026 pour artisans",
  description: "Bativio est le logiciel tout-en-un pour artisans du bâtiment : devis, factures, planning, et facturation électronique conforme à la réforme 2026 via Invoquo. Essai gratuit.",
  keywords: "logiciel artisan, logiciel BTP, logiciel devis facture artisan, facturation electronique 2026, Bativio, Invoquo, plateforme agreee, artisan batiment",
  alternates: { canonical: "https://www.bativio.fr/pro" },
  openGraph: {
    title: "Bativio Pro — Conforme 2026 pour artisans BTP",
    description: "Devis, factures, planning, conformite electronique. Tout-en-un pour artisans du batiment. Essai gratuit.",
    url: "https://www.bativio.fr/pro",
    type: "website",
    locale: "fr_FR",
    images: [{ url: "https://www.bativio.fr/og-image.png", width: 1200, height: 630, alt: "Bativio Pro" }],
  },
  twitter: { card: "summary_large_image", title: "Bativio Pro — Artisans BTP", description: "Logiciel devis facture conforme 2026. Essai gratuit." },
};

const FAQ = [
  { q: "Bativio est-il vraiment gratuit pour démarrer ?", a: "Oui, le plan Gratuit permet de créer une fiche annuaire et de recevoir des demandes de devis sans aucun frais. Vous payez uniquement si vous voulez débloquer la facturation, le site internet pro ou les fonctionnalités avancées." },
  { q: "Bativio est-il une plateforme agréée (PA) ?", a: "Bativio n'est pas directement immatriculé comme plateforme agréée par la DGFiP, mais nous sommes connectés à Invoquo, une plateforme agréée. Pour vous, c'est transparent : vous saisissez vos factures dans Bativio, elles sont émises et reçues automatiquement via la PA Invoquo." },
  { q: "Que se passe-t-il après le 1er septembre 2026 ?", a: "À partir du 1er septembre 2026, toutes les entreprises (y compris les TPE) doivent pouvoir RECEVOIR des factures électroniques. L'émission devient obligatoire pour les grandes entreprises. Bativio est prêt dès maintenant." },
  { q: "Quand l'émission devient-elle obligatoire pour les artisans TPE ?", a: "Le 1er septembre 2027 pour les TPE/PME et micro-entreprises. Vous avez donc 1 an supplémentaire après la réception, mais nous vous recommandons d'anticiper pour éviter les sanctions de 50 € par facture non conforme." },
  { q: "Est-ce que je peux migrer mes anciennes factures ?", a: "Oui, vous pouvez importer vos factures historiques en CSV ou les laisser dans votre ancien outil. Les factures émises avant la bascule électronique restent valides au format papier ou PDF." },
  { q: "Puis-je essayer sans m'engager ?", a: "Oui, l'inscription est gratuite et sans engagement. Le plan Gratuit est utilisable à vie. Les plans payants peuvent être annulés à tout moment depuis votre espace." },
  { q: "Bativio fonctionne-t-il sur mobile ?", a: "Oui, Bativio est une PWA (Progressive Web App) installable sur iPhone et Android. Vous pouvez créer un devis sur chantier depuis votre téléphone." },
  { q: "Quelles aides existent pour la facturation électronique ?", a: "Le ministère a annoncé un dispositif de soutien aux TPE (jusqu'à 500 € de credit fiscal pour la mise en conformité). Bativio inclut la facturation electronique dans ses plans Starter et superieurs (a partir de 19 €/mois)." },
];

const METIERS_COUVERTS = [
  "Plombier", "Électricien", "Peintre", "Maçon", "Carreleur",
  "Menuisier", "Couvreur", "Charpentier", "Chauffagiste", "Plâtrier",
  "Solier", "Vitrier", "Isolation", "Terrassier", "Démolition",
  "Cuisiniste", "Salle de bain", "Façadier", "Étancheur", "Serrurier",
  "Climaticien", "Domoticien", "Paysagiste", "Élagueur", "Piscine",
  "Cheminée", "Photovoltaïque", "Pompes à chaleur",
];

export default function ProLandingPage() {
  return (
    <>
      {/* Breadcrumb */}
      <nav aria-label="Fil d'Ariane" style={{ fontSize: 13, color: "#9C958D", marginBottom: 24 }}>
        <Link href="/" style={{ color: "inherit", textDecoration: "none" }}>Accueil</Link>
        <span style={{ margin: "0 8px" }}>›</span>
        <span style={{ color: "#3D2E1F" }}>Pro</span>
      </nav>

      {/* Hero */}
      <section style={{ marginBottom: 48 }}>
        <h1 style={{ fontFamily: "'Fraunces',serif", fontSize: "clamp(28px,4vw,42px)", fontWeight: 700, color: "#1C1C1E", lineHeight: 1.15, marginBottom: 16, maxWidth: 800 }}>
          Bativio Pro &mdash; La plateforme conforme 2026 pour artisans du b&acirc;timent
        </h1>
        <p style={{ fontSize: 17, color: "#6B6560", lineHeight: 1.6, maxWidth: 720 }}>
          Devis, factures, planning et conformit&eacute; &eacute;lectronique r&eacute;forme 2026 :
          tout-en-un pour les artisans du b&acirc;timent en Rh&ocirc;ne-Alpes.
          Connect&eacute; &agrave; Invoquo, plateforme agr&eacute;&eacute;e.
          Essai gratuit, sans engagement, &agrave; partir de 19 &euro;/mois.
        </p>
      </section>

      {/* Section 1 : Pitch */}
      <section style={{ background: "#fff", padding: 32, borderRadius: 12, marginBottom: 32 }}>
        <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 22, fontWeight: 700, color: "#1C1C1E", marginBottom: 16 }}>
          Pour qui est Bativio Pro ?
        </h2>
        <p style={{ fontSize: 15, color: "#3D2E1F", lineHeight: 1.7, marginBottom: 12 }}>
          Bativio Pro est con&ccedil;u pour les <strong>artisans du b&acirc;timent</strong> qui veulent
          d&eacute;velopper leur activit&eacute; sans perdre de temps avec la paperasse. Auto-entrepreneurs,
          TPE et PME du BTP en Rh&ocirc;ne-Alpes (Savoie, Haute-Savoie, Is&egrave;re, Rh&ocirc;ne, Dr&ocirc;me)
          y trouvent un outil int&eacute;gr&eacute; qui combine :
        </p>
        <ul style={{ fontSize: 15, color: "#3D2E1F", lineHeight: 1.7, paddingLeft: 24 }}>
          <li><strong>Visibilit&eacute; locale</strong> : votre fiche artisan apparait dans l&apos;annuaire Bativio (ranking SEO local optimis&eacute; sur "plombier Lyon", "&eacute;lectricien Chamb&eacute;ry", etc.)</li>
          <li><strong>Acquisition de clients</strong> : recevez chaque semaine des demandes de devis qualifi&eacute;es directement dans votre messagerie</li>
          <li><strong>Devis et factures conformes</strong> : g&eacute;n&eacute;rez vos documents en 30 secondes, format Factur-X conforme 2026 via Invoquo</li>
          <li><strong>Planning et CRM</strong> : suivez vos chantiers, vos rendez-vous, votre carnet client</li>
          <li><strong>Z&eacute;ro commission</strong> : contrairement &agrave; PagesJaunes ou Travaux.com, vous ne payez aucun pourcentage sur le prix de vos chantiers</li>
        </ul>
      </section>

      {/* Section 2 : Pourquoi 2026 change tout */}
      <section style={{ background: "#fff", padding: 32, borderRadius: 12, marginBottom: 32 }}>
        <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 22, fontWeight: 700, color: "#1C1C1E", marginBottom: 16 }}>
          Pourquoi septembre 2026 change tout pour les artisans
        </h2>
        <p style={{ fontSize: 15, color: "#3D2E1F", lineHeight: 1.7, marginBottom: 12 }}>
          La <strong>r&eacute;forme de la facturation &eacute;lectronique</strong>, vot&eacute;e en
          loi de finances 2024, entre en vigueur progressivement &agrave; partir du
          <strong> 1er septembre 2026</strong>. Toutes les entreprises fran&ccedil;aises
          assujetties &agrave; la TVA seront concern&eacute;es, y compris les artisans
          auto-entrepreneurs.
        </p>
        <h3 style={{ fontFamily: "'Fraunces',serif", fontSize: 17, fontWeight: 700, color: "#C4531A", marginTop: 20, marginBottom: 8 }}>
          Calendrier officiel
        </h3>
        <ul style={{ fontSize: 15, color: "#3D2E1F", lineHeight: 1.7, paddingLeft: 24, marginBottom: 16 }}>
          <li><strong>1er septembre 2026</strong> : R&eacute;ception &eacute;lectronique obligatoire pour TOUTES les entreprises (TPE, PME, ETI, GE)</li>
          <li><strong>1er septembre 2026</strong> : &Eacute;mission &eacute;lectronique obligatoire pour les <strong>grandes entreprises et ETI</strong></li>
          <li><strong>1er septembre 2027</strong> : &Eacute;mission &eacute;lectronique obligatoire pour les <strong>TPE/PME et micro-entreprises</strong> (la plupart des artisans)</li>
        </ul>
        <h3 style={{ fontFamily: "'Fraunces',serif", fontSize: 17, fontWeight: 700, color: "#C4531A", marginTop: 20, marginBottom: 8 }}>
          Sanctions encourues
        </h3>
        <ul style={{ fontSize: 15, color: "#3D2E1F", lineHeight: 1.7, paddingLeft: 24 }}>
          <li><strong>50 &euro; par facture</strong> non &eacute;mise au format &eacute;lectronique (plafond 15 000 &euro;/an)</li>
          <li><strong>500 &euro;</strong> pour absence de d&eacute;signation d&apos;une plateforme agr&eacute;&eacute;e (PA)</li>
          <li><strong>250 &euro; par manquement</strong> au e-reporting (transmission des donn&eacute;es de transactions et de paiement &agrave; la DGFiP)</li>
        </ul>
        <p style={{ fontSize: 14, color: "#6B6560", lineHeight: 1.6, marginTop: 16 }}>
          &rarr; <Link href="/pro/facturation-electronique-2026" style={{ color: "#C4531A", textDecoration: "underline" }}>
            Lire le guide complet sur la r&eacute;forme 2026
          </Link>
        </p>
      </section>

      {/* Section 3 : Notre solution */}
      <section style={{ background: "#fff", padding: 32, borderRadius: 12, marginBottom: 32 }}>
        <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 22, fontWeight: 700, color: "#1C1C1E", marginBottom: 16 }}>
          Notre solution : Bativio + Invoquo
        </h2>
        <p style={{ fontSize: 15, color: "#3D2E1F", lineHeight: 1.7, marginBottom: 16 }}>
          La majorit&eacute; des plateformes agr&eacute;&eacute;es disponibles aujourd&apos;hui sont
          des <strong>logiciels comptables</strong> g&eacute;n&eacute;ralistes (Pennylane, Dougs,
          Sage, EBP). Ils sont puissants mais inadapt&eacute;s aux artisans qui n&apos;ont
          pas besoin d&apos;un outil expert-comptable, juste d&apos;un outil
          <strong> simple et conforme</strong>.
        </p>
        <p style={{ fontSize: 15, color: "#3D2E1F", lineHeight: 1.7, marginBottom: 16 }}>
          Bativio fait le pont entre vos besoins op&eacute;rationnels (devis-facture rapide,
          gestion des chantiers) et la conformit&eacute; r&eacute;glementaire (PA Invoquo).
          Concr&egrave;tement :
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 12, marginBottom: 16 }}>
          {[
            { title: "Devis en 30 sec", desc: "Catalogue de prestations, calcul TVA auto, envoi par email avec lien de signature" },
            { title: "Factures Factur-X", desc: "Format hybride PDF + XML CII conforme norme europ&eacute;enne EN16931" },
            { title: "Connecteur PA", desc: "&Eacute;mission et r&eacute;ception via Invoquo immatricul&eacute;e DGFiP" },
            { title: "Multi-TVA BTP", desc: "Gestion native 5,5 / 10 / 20 % et auto-liquidation sous-traitance" },
            { title: "Carnet clients", desc: "Recherche INSEE par SIRET, fiche client compl&egrave;te, historique" },
            { title: "Tableau de bord", desc: "CA mois/ann&eacute;e, encaiss&eacute;, impay&eacute;s, taux de conversion devis" },
          ].map((b) => (
            <div key={b.title} style={{ padding: 16, background: "#FAF8F5", borderRadius: 8, border: "1px solid #E8D5C0" }}>
              <div style={{ fontWeight: 700, color: "#C4531A", marginBottom: 6 }}>{b.title}</div>
              <div style={{ fontSize: 13, color: "#6B6560", lineHeight: 1.5 }} dangerouslySetInnerHTML={{ __html: b.desc }} />
            </div>
          ))}
        </div>
      </section>

      {/* Section 4 : Pour quels metiers */}
      <section style={{ background: "#fff", padding: 32, borderRadius: 12, marginBottom: 32 }}>
        <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 22, fontWeight: 700, color: "#1C1C1E", marginBottom: 12 }}>
          Pour quels m&eacute;tiers du b&acirc;timent ?
        </h2>
        <p style={{ fontSize: 15, color: "#3D2E1F", lineHeight: 1.6, marginBottom: 16 }}>
          Bativio couvre l&apos;ensemble des corps d&apos;&eacute;tat du b&acirc;timent
          (gros-&oelig;uvre, second-&oelig;uvre, finitions, &eacute;quipements,
          sp&eacute;cialit&eacute;s) :
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {METIERS_COUVERTS.map((m) => (
            <span key={m} style={{ padding: "6px 12px", background: "#FAF8F5", border: "1px solid #E8D5C0", borderRadius: 99, fontSize: 13, color: "#3D2E1F" }}>
              {m}
            </span>
          ))}
        </div>
      </section>

      {/* Section 5 : Tarification */}
      <section style={{ background: "#fff", padding: 32, borderRadius: 12, marginBottom: 32 }}>
        <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 22, fontWeight: 700, color: "#1C1C1E", marginBottom: 12 }}>
          Tarification simple, sans engagement
        </h2>
        <p style={{ fontSize: 15, color: "#3D2E1F", lineHeight: 1.7, marginBottom: 20 }}>
          Quatre plans pour s&apos;adapter &agrave; tous les besoins, du d&eacute;marrage &agrave;
          l&apos;activit&eacute; structur&eacute;e. Aucune commission sur vos chantiers.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12 }}>
          {[
            { name: "Gratuit", price: "0 €", target: "Pour d&eacute;marrer", feats: ["Fiche annuaire", "R&eacute;ception devis", "3 photos"] },
            { name: "Starter", price: "19 €", target: "Conformit&eacute; PA", feats: ["Tout Gratuit +", "Facturation &eacute;lectronique", "Devis et factures illimit&eacute;s"], popular: false },
            { name: "Pro", price: "39 €", target: "Site internet + CRM", feats: ["Tout Starter +", "Site internet pro", "Avis clients v&eacute;rifi&eacute;s", "Agenda RDV"], popular: true },
            { name: "Business", price: "59 €", target: "IA + SEO local", feats: ["Tout Pro +", "Devis IA", "SEO local optimis&eacute;", "SMS notifications"] },
          ].map((p) => (
            <div key={p.name} style={{ padding: 18, background: p.popular ? "#FAF8F5" : "#fff", border: "2px solid " + (p.popular ? "#C4531A" : "#E8D5C0"), borderRadius: 12, position: "relative" }}>
              {p.popular && <span style={{ position: "absolute", top: -10, left: 12, padding: "2px 8px", background: "#C4531A", color: "#fff", fontSize: 10, fontWeight: 700, borderRadius: 99 }}>POPULAIRE</span>}
              <div style={{ fontWeight: 700, color: "#1C1C1E", marginBottom: 4 }}>{p.name}</div>
              <div style={{ fontFamily: "'Fraunces',serif", fontSize: 24, fontWeight: 700, color: "#C4531A" }}>{p.price}<span style={{ fontSize: 13, color: "#6B6560", fontWeight: 400 }}>/mois</span></div>
              <div style={{ fontSize: 12, color: "#9C958D", marginBottom: 10 }} dangerouslySetInnerHTML={{ __html: p.target }} />
              <ul style={{ fontSize: 13, color: "#3D2E1F", paddingLeft: 18, lineHeight: 1.6 }}>
                {p.feats.map((f) => <li key={f} dangerouslySetInnerHTML={{ __html: f }} />)}
              </ul>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 20, textAlign: "center" }}>
          <Link href="/tarifs" style={{ color: "#C4531A", textDecoration: "underline", fontSize: 14, fontWeight: 600 }}>
            Voir le d&eacute;tail des plans &rarr;
          </Link>
        </div>
      </section>

      {/* Section 6 : FAQ */}
      <section style={{ background: "#fff", padding: 32, borderRadius: 12, marginBottom: 32 }}>
        <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 22, fontWeight: 700, color: "#1C1C1E", marginBottom: 16 }}>
          Questions fr&eacute;quentes
        </h2>
        {FAQ.map((f, i) => (
          <div key={i} style={{ borderBottom: "1px solid #EDEBE7", padding: "16px 0" }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: "#1C1C1E", marginBottom: 6 }}>{f.q}</h3>
            <p style={{ fontSize: 14, color: "#6B6560", lineHeight: 1.6 }}>{f.a}</p>
          </div>
        ))}
      </section>

      {/* JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd({
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "Bativio",
        url: "https://www.bativio.fr",
        logo: "https://www.bativio.fr/og-image.png",
        description: "Plateforme tout-en-un pour artisans du bâtiment : devis, factures, facturation électronique conforme 2026.",
        areaServed: { "@type": "AdministrativeArea", name: "Auvergne-Rhône-Alpes" },
      }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd({
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name: "Bativio Pro",
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web, iOS, Android",
        url: "https://www.bativio.fr/pro",
        offers: [
          { "@type": "Offer", name: "Gratuit", price: "0", priceCurrency: "EUR" },
          { "@type": "Offer", name: "Starter", price: "19", priceCurrency: "EUR", priceSpecification: { "@type": "UnitPriceSpecification", price: "19", priceCurrency: "EUR", referenceQuantity: { "@type": "QuantitativeValue", value: "1", unitCode: "MON" } } },
          { "@type": "Offer", name: "Pro", price: "39", priceCurrency: "EUR" },
          { "@type": "Offer", name: "Business", price: "59", priceCurrency: "EUR" },
        ],
        provider: { "@type": "Organization", name: "Bativio" },
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
        ],
      }) }} />
    </>
  );
}
