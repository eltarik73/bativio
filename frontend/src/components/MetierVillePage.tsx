import Link from "next/link";
import ArtisanCard from "@/components/ArtisanCard";
import { VILLES, METIERS } from "@/lib/constants";
import type { ArtisanPublic } from "@/lib/api";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function villeNom(slug: string): string {
  const v = VILLES.find((v) => v.slug === slug);
  return v?.nom ?? capitalize(slug);
}

export function metierNom(slug: string): string {
  const m = METIERS.find((m) => m.slug === slug);
  return m?.nom ?? capitalize(slug);
}

// ---------------------------------------------------------------------------
// SEO content per metier
// ---------------------------------------------------------------------------

export const METIER_SEO_CONTENT: Record<
  string,
  { intro: string; faq: Array<{ q: string; a: string }> }
> = {
  plombier: {
    intro:
      "Trouver un plombier fiable est essentiel pour vos travaux de plomberie, qu'il s'agisse d'une fuite urgente, de la renovation d'une salle de bain ou de l'installation d'un chauffe-eau. A {ville}, les plombiers inscrits sur Bativio sont tous verifies : numero SIRET valide, assurance decennale, et avis clients authentiques. Que vous ayez besoin d'un depannage rapide un dimanche matin ou d'un devis pour refaire toute votre tuyauterie, notre annuaire vous permet de comparer les artisans de votre secteur et de les contacter directement. Chaque plombier a sa fiche detaillee avec ses specialites (plomberie sanitaire, chauffage, debouchage, installation VMC), ses tarifs indicatifs et les photos de ses realisations. En passant par Bativio, vous beneficiez d'un service 100% gratuit pour le particulier, sans commission ni frais caches. Les plombiers paient un abonnement mensuel fixe pour etre visibles, ce qui garantit leur motivation a vous fournir un service de qualite. La reactivite est cle dans le metier de plombier : grace aux notifications instantanees, votre demande de devis est transmise en temps reel a l'artisan qui peut vous rappeler dans les minutes qui suivent.",
    faq: [
      {
        q: "Comment trouver un bon plombier a {ville} ?",
        a: "Sur Bativio, tous les plombiers a {ville} sont verifies par leur numero SIRET et references. Consultez leur fiche, comparez les avis clients et demandez un devis gratuit en 2 minutes. Vous recevez generalement une reponse dans l'heure.",
      },
      {
        q: "Combien coute un depannage plomberie a {ville} ?",
        a: "Un depannage simple (fuite, robinet, WC bouche) coute entre 80 et 150 euros en moyenne a {ville}. Pour des interventions plus complexes comme un remplacement de chauffe-eau ou une renovation de salle de bain, comptez entre 500 et 3000 euros selon l'ampleur des travaux. Demandez un devis gratuit pour obtenir un prix exact.",
      },
      {
        q: "Les plombiers Bativio sont-ils assures ?",
        a: "Oui, chaque artisan inscrit sur Bativio est verifie via son numero SIRET aupres de la base officielle. Les plombiers qui affichent le badge assurance decennale ont fourni une attestation valide. C'est votre garantie en cas de malfacon.",
      },
    ],
  },
  electricien: {
    intro:
      "Un probleme electrique ne peut pas attendre. Que ce soit pour une panne de courant, la mise aux normes de votre tableau electrique ou l'installation de prises et eclairages dans un logement neuf, les electriciens de {ville} inscrits sur Bativio sont la pour intervenir rapidement et en toute securite. L'electricite est un domaine ou le professionnalisme est non-negociable : un travail mal fait peut entrainer des risques d'incendie ou d'electrocution. C'est pourquoi chaque electricien de notre annuaire est verifie et affiche clairement ses qualifications (Qualifelec, habilitation electrique, certification NF C 15-100). Sur Bativio, vous pouvez consulter les specialites de chaque electricien : installation electrique complete, domotique, mise en conformite, interphone, VMC, panneaux solaires. Les photos de chantiers realises et les avis clients vous aident a faire votre choix en toute confiance. Demandez votre devis gratuitement : l'electricien recoit votre demande instantanement et peut vous proposer un creneau d'intervention dans les 24 heures. Aucune commission n'est prelevee sur les travaux — vous payez directement votre artisan au juste prix.",
    faq: [
      {
        q: "Comment choisir un electricien qualifie a {ville} ?",
        a: "Verifiez que l'electricien possede une qualification Qualifelec ou une habilitation electrique a jour. Sur Bativio, ces certifications sont affichees sous forme de badges verifies sur chaque fiche artisan. Comparez les avis clients et demandez plusieurs devis pour trouver le bon rapport qualite-prix.",
      },
      {
        q: "Quel est le prix d'une mise aux normes electriques ?",
        a: "A {ville}, une mise aux normes d'un tableau electrique coute entre 600 et 1500 euros. Pour une renovation electrique complete d'un appartement de 60m2, comptez entre 3000 et 6000 euros. Ces prix varient selon l'etat de l'installation existante et les travaux necessaires.",
      },
      {
        q: "Un electricien peut-il intervenir en urgence a {ville} ?",
        a: "Oui, de nombreux electriciens sur Bativio proposent des interventions d'urgence a {ville} et ses environs. Envoyez votre demande via le formulaire de devis en precisant l'urgence : l'artisan est notifie immediatement par SMS et peut generalement intervenir dans la journee.",
      },
    ],
  },
  peintre: {
    intro:
      "Un coup de peinture transforme completement un interieur. Que vous souhaitiez rafraichir un appartement avant une mise en location, repenser la decoration de votre maison ou preparer les murs d'un local commercial, les peintres de {ville} inscrits sur Bativio sont des professionnels experimentes prets a realiser vos projets. La peinture est un metier qui requiert precision et savoir-faire : preparation des supports, choix des produits adaptes (mat, satine, laque, peinture ecologique), protection du mobilier et finitions impeccables. Sur Bativio, chaque peintre presente ses specialites : peinture interieure, peinture exterieure, ravalement de facade, pose de papier peint, enduits decoratifs, peinture sur boiseries. Les galeries avant/apres vous permettent de juger de la qualite du travail avant de vous engager. Demandez un devis gratuit en decrivant votre projet : surface a peindre, type de pieces, etat actuel des murs. Le peintre vous contacte rapidement avec une proposition detaillee. Tous les devis sont sans engagement et sans commission Bativio — vous traitez directement avec l'artisan.",
    faq: [
      {
        q: "Combien coute la peinture d'un appartement a {ville} ?",
        a: "A {ville}, le prix moyen de la peinture interieure est de 25 a 40 euros par m2 (fourniture et pose). Pour un appartement de 70m2, comptez entre 2500 et 5000 euros selon l'etat des murs et le type de peinture choisi. Demandez un devis gratuit sur Bativio pour obtenir un chiffrage precis.",
      },
      {
        q: "Quelle peinture choisir pour une piece humide ?",
        a: "Pour une salle de bain ou une cuisine, optez pour une peinture specifique pieces humides (glycero ou acrylique speciale) avec une finition satinee ou brillante qui resiste a l'humidite et se nettoie facilement. Les peintres de Bativio peuvent vous conseiller sur le meilleur produit adapte a votre piece.",
      },
      {
        q: "En combien de temps un peintre peut-il refaire un appartement ?",
        a: "Un peintre professionnel peut rafraichir un appartement de 60 a 80m2 en 3 a 5 jours ouvrables en moyenne. Ce delai inclut la preparation des supports, l'application de deux couches et les finitions. Pour des travaux plus importants (enduits, papier peint), prevoyez une semaine.",
      },
    ],
  },
  macon: {
    intro:
      "La maconnerie est le fondement de tout projet de construction ou de renovation. Que vous envisagiez une extension de maison, la construction d'un mur de cloture, la realisation d'une dalle beton ou la renovation d'une facade en pierre, les macons de {ville} inscrits sur Bativio maitrisent toutes les techniques du gros oeuvre. Le metier de macon exige robustesse, precision et connaissance approfondie des materiaux : parpaings, briques, pierres naturelles, beton arme, beton cellulaire. Chaque macon sur Bativio affiche ses specialites et les photos de ses chantiers precedents, vous permettant de juger de la qualite de son travail. Les macons de {ville} interviennent sur un large perimetre : construction neuve, renovation de batiments anciens, amenagement exterieur (terrasses, murets, escaliers), ouverture de murs porteurs. Avant tout chantier, un bon macon etablit un devis detaille avec les quantites de materiaux, la duree estimee des travaux et le cout de la main-d'oeuvre. Sur Bativio, la demande de devis est gratuite et sans engagement — comparez plusieurs artisans pour trouver celui qui correspond le mieux a votre projet et votre budget.",
    faq: [
      {
        q: "Quel est le prix d'un macon a {ville} ?",
        a: "A {ville}, le tarif horaire d'un macon varie entre 40 et 60 euros de l'heure. Pour une dalle beton de 20m2, comptez entre 1500 et 3000 euros. Une extension de maison peut couter entre 1000 et 2000 euros du m2 selon la complexite. Demandez un devis gratuit sur Bativio pour un chiffrage adapte a votre projet.",
      },
      {
        q: "Faut-il un permis de construire pour des travaux de maconnerie ?",
        a: "Cela depend de la nature des travaux. Une declaration prealable suffit pour les travaux modifiant l'aspect exterieur ou creant moins de 20m2 de surface. Au-dela de 20m2 (ou 40m2 en zone PLU), un permis de construire est necessaire. Votre macon peut vous accompagner dans ces demarches administratives.",
      },
      {
        q: "Comment verifier la qualite d'un macon avant de l'engager ?",
        a: "Sur Bativio, verifiez les badges de certification (Qualibat, assurance decennale), consultez les photos de chantiers realises et lisez les avis des clients precedents. N'hesitez pas a demander des references et a visiter un chantier en cours si possible. Un bon macon fournit toujours un devis detaille avant de commencer.",
      },
    ],
  },
  carreleur: {
    intro:
      "La pose de carrelage est un art qui requiert precision millimetrique et expertise technique. Que vous souhaitiez carreler une salle de bain, une cuisine, un salon ou une terrasse exterieure, les carreleurs de {ville} inscrits sur Bativio sont des specialistes qualifies qui assurent une pose impeccable et durable. Le choix du carrelage est vaste : gres cerame, faience, mosaique, carreaux de ciment, pierre naturelle, grands formats. Un bon carreleur vous conseille sur le materiau adapte a chaque piece en tenant compte de l'usage, de l'humidite et de l'esthetique souhaitee. Sur Bativio, chaque carreleur presente ses realisations en photos avant/apres, ce qui vous permet d'apprecier la qualite de ses calepinages et finitions. La preparation du support est une etape cruciale : ragréage, mise a niveau, etancheite sous carrelage en piece humide. Un carreleur professionnel ne neglige jamais cette phase, gage de durabilite de votre revetement. Demandez un devis gratuit sur Bativio en precisant la surface, le type de carrelage souhaite et l'etat du support actuel. Les carreleurs de {ville} vous repondent rapidement avec un devis detaille — comparez et choisissez en toute serenite.",
    faq: [
      {
        q: "Quel est le prix de la pose de carrelage a {ville} ?",
        a: "A {ville}, la pose de carrelage coute en moyenne entre 30 et 60 euros du m2 (pose seule, hors fourniture). Le prix du carrelage lui-meme varie de 15 a 100 euros du m2 selon le materiau choisi. Pour une salle de bain complete de 8m2, comptez entre 800 et 2500 euros tout compris.",
      },
      {
        q: "Combien de temps pour carreler une salle de bain ?",
        a: "Un carreleur professionnel met en moyenne 3 a 5 jours pour carreler une salle de bain standard (sols + murs). Ce delai comprend la preparation du support, la pose, les coupes et les joints. Pour des motifs complexes ou de la mosaique, prevoyez un jour supplementaire.",
      },
      {
        q: "Peut-on poser du carrelage sur un ancien carrelage ?",
        a: "Oui, c'est possible sous certaines conditions : l'ancien carrelage doit etre bien adherent, plan et propre. Un primaire d'accrochage est indispensable. Votre carreleur sur Bativio pourra evaluer la faisabilite lors d'une visite technique gratuite et vous conseiller sur la meilleure solution.",
      },
    ],
  },
  menuisier: {
    intro:
      "Le menuisier est l'artisan du bois par excellence. De la fabrication de meubles sur mesure a la pose de fenetres, de portes interieures, d'escaliers ou de placards, les menuisiers de {ville} inscrits sur Bativio allient savoir-faire traditionnel et techniques modernes. Le bois apporte chaleur et caractere a votre interieur, et un menuisier qualifie sait sublimer ce materiau noble. Les menuisiers de Bativio interviennent sur des projets tres varies : agencement de dressing et de cuisines, fabrication de bibliotheques encastrees, pose de parquet, installation de portes blindees, fabrication de portails et clotures en bois. Chaque artisan affiche ses specialites et ses certifications (Qualibat bois, RGE pour les fenetres). Les photos de realisations vous donnent un apercu concret de leur travail. Qu'il s'agisse d'un projet de renovation ou de creation, votre menuisier a {ville} vous accompagne de la conception a la pose. Demandez un devis gratuit sur Bativio en detaillant votre projet : dimensions, essence de bois souhaitee, finitions. Vous recevez des propositions personnalisees sans engagement et sans commission.",
    faq: [
      {
        q: "Combien coute un menuisier a {ville} ?",
        a: "A {ville}, le tarif horaire d'un menuisier varie entre 40 et 55 euros de l'heure. Pour un placard sur mesure, comptez entre 800 et 2500 euros. La pose de fenetres en bois coute entre 300 et 800 euros par fenetre (hors fourniture). Demandez un devis gratuit sur Bativio pour un chiffrage precis.",
      },
      {
        q: "Quel type de bois choisir pour des meubles sur mesure ?",
        a: "Le choix depend de l'usage et du budget. Le chene est resistant et noble, ideal pour les meubles de salon. Le hetre convient bien aux escaliers. Le pin est plus economique pour les rangements. Votre menuisier sur Bativio vous conseillera sur l'essence la plus adaptee a votre projet et votre budget.",
      },
      {
        q: "Un menuisier peut-il poser des fenetres PVC ou aluminium ?",
        a: "Oui, de nombreux menuisiers sur Bativio sont aussi poseurs de menuiseries exterieures (bois, PVC, aluminium). Verifiez les specialites indiquees sur sa fiche. Pour beneficier d'aides a la renovation energetique (MaPrimeRenov), choisissez un menuisier certifie RGE.",
      },
    ],
  },
  couvreur: {
    intro:
      "La toiture est l'element protecteur de votre maison. Une couverture en bon etat est essentielle pour eviter les infiltrations, les deperditions de chaleur et les degats des eaux. Les couvreurs de {ville} inscrits sur Bativio sont des specialistes de la toiture qui interviennent pour tous types de travaux : reparation de fuites, remplacement de tuiles cassees, refection complete de toiture, pose de gouttieres, installation de Velux, demoussage et traitement hydrofuge. Le metier de couvreur exige un savoir-faire technique pointu et un strict respect des regles de securite. C'est pourquoi chaque couvreur sur Bativio est verifie et affiche ses certifications (Qualibat couverture, assurance decennale). Les conditions climatiques en region Rhone-Alpes — neige en hiver, orages violents en ete — sollicitent fortement les toitures. Un entretien regulier par un professionnel previent les degradations couteuses. Sur Bativio, consultez les specialites de chaque couvreur (tuiles, ardoises, zinc, bac acier, toiture vegetalisee), les photos de chantiers et les avis clients. Demandez un devis gratuit pour votre projet de toiture : l'artisan peut generalement effectuer une visite d'evaluation dans la semaine.",
    faq: [
      {
        q: "Combien coute la refection d'une toiture a {ville} ?",
        a: "A {ville}, la refection complete d'une toiture coute entre 100 et 250 euros du m2 selon le materiau (tuiles mecaniques, tuiles plates, ardoises) et la complexite (cheminee, Velux, pente). Pour une maison de 100m2 de toiture, le budget se situe entre 10 000 et 25 000 euros. Un devis precis necessite une visite technique.",
      },
      {
        q: "Comment detecter une fuite de toiture ?",
        a: "Les signes d'alerte sont : taches d'humidite au plafond, moisissures dans les combles, tuiles deplacees ou cassees visibles depuis l'exterieur. En cas de suspicion de fuite, contactez rapidement un couvreur sur Bativio pour un diagnostic. Une intervention rapide evite des degats bien plus importants et couteux.",
      },
      {
        q: "A quelle frequence faut-il entretenir sa toiture ?",
        a: "Il est recommande de faire inspecter et entretenir sa toiture tous les 2 a 3 ans, et apres chaque evenement climatique majeur (tempete, grele, forte neige). Un demoussage et un traitement hydrofuge prolongent la duree de vie de votre couverture de 10 a 15 ans.",
      },
    ],
  },
  chauffagiste: {
    intro:
      "Le chauffage represente le premier poste de depense energetique d'un logement. Faire appel a un chauffagiste qualifie a {ville} est indispensable pour installer, entretenir ou reparer votre systeme de chauffage dans les regles de l'art. Les chauffagistes inscrits sur Bativio maitrisent toutes les technologies : chaudieres gaz a condensation, pompes a chaleur, poeles a bois et a granules, planchers chauffants, radiateurs, chauffe-eau thermodynamiques. La region Rhone-Alpes connait des hivers rigoureux, ce qui rend un systeme de chauffage performant d'autant plus crucial. Un chauffagiste certifie peut aussi vous faire beneficier des aides a la renovation energetique (MaPrimeRenov, CEE) en choisissant des equipements performants et en realisant une installation conforme aux normes. Sur Bativio, chaque chauffagiste affiche ses qualifications : RGE (Reconnu Garant de l'Environnement), Qualipac (pompes a chaleur), Qualibois (bois-energie), Qualigaz. Ces labels sont votre garantie d'un travail de qualite et de l'eligibilite aux aides financieres. L'entretien annuel de votre chaudiere est obligatoire — planifiez-le facilement en contactant un chauffagiste sur Bativio.",
    faq: [
      {
        q: "Combien coute l'installation d'une pompe a chaleur a {ville} ?",
        a: "A {ville}, l'installation d'une pompe a chaleur air-eau coute entre 8 000 et 15 000 euros. Une pompe a chaleur air-air (climatisation reversible) revient entre 3 000 et 6 000 euros. Les aides MaPrimeRenov et CEE peuvent couvrir jusqu'a 50% du cout si vous passez par un installateur certifie RGE, disponible sur Bativio.",
      },
      {
        q: "A quelle frequence faut-il entretenir sa chaudiere ?",
        a: "L'entretien annuel de la chaudiere (gaz, fioul, bois) est obligatoire par la loi. Il garantit la securite, optimise les performances et prolonge la duree de vie de l'appareil. Sur Bativio, contactez un chauffagiste a {ville} pour planifier votre entretien — vous recevez une attestation conforme a la reglementation.",
      },
      {
        q: "Quel chauffage choisir pour une maison a {ville} ?",
        a: "En region Rhone-Alpes, la pompe a chaleur est le choix le plus populaire pour les constructions neuves. Pour la renovation, une chaudiere gaz a condensation ou un poele a granules offrent un excellent rapport performance-prix. Un chauffagiste RGE sur Bativio peut realiser un bilan thermique gratuit pour vous orienter vers la meilleure solution.",
      },
    ],
  },
};

// ---------------------------------------------------------------------------
// Known metier slugs (for routing disambiguation)
// ---------------------------------------------------------------------------

export const METIER_SLUGS = new Set([
  "plombier",
  "electricien",
  "peintre",
  "macon",
  "carreleur",
  "menuisier",
  "couvreur",
  "chauffagiste",
]);

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function MetierVillePage({
  ville,
  metier,
  artisans,
}: {
  ville: string;
  metier: string;
  artisans: ArtisanPublic[];
}) {
  const vNom = villeNom(ville);
  const mNom = metierNom(metier);

  // ---- SEO content ----
  const seoContent = METIER_SEO_CONTENT[metier];
  const intro = seoContent?.intro.replace(/\{ville\}/g, vNom) ?? "";
  const faq =
    seoContent?.faq.map((f) => ({
      q: f.q.replace(/\{ville\}/g, vNom),
      a: f.a.replace(/\{ville\}/g, vNom),
    })) ?? [];

  // ---- JSON-LD ----
  const jsonLdItemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${mNom} a ${vNom}`,
    numberOfItems: artisans.length,
    itemListElement: artisans.map((a, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "LocalBusiness",
        name: a.nomAffichage,
        url: `https://bativio.fr/${ville}/${a.slug}`,
        ...(a.description ? { description: a.description } : {}),
        ...(a.noteMoyenne > 0
          ? {
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: a.noteMoyenne,
                reviewCount: a.nombreAvis,
              },
            }
          : {}),
      },
    })),
  };

  const jsonLdService = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `${mNom} a ${vNom}`,
    description: `Trouvez un ${mNom.toLowerCase()} qualifie a ${vNom}. Devis gratuit, artisans verifies, zero commission.`,
    areaServed: {
      "@type": "City",
      name: vNom,
    },
    provider: {
      "@type": "Organization",
      name: "Bativio",
      url: "https://bativio.fr",
    },
  };

  const jsonLdFaq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.a,
      },
    })),
  };

  const jsonLdBreadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Accueil",
        item: "https://bativio.fr",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: vNom,
        item: `https://bativio.fr/${ville}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: mNom,
        item: `https://bativio.fr/${ville}/${metier}`,
      },
    ],
  };

  return (
    <>
      <main className="min-h-screen bg-creme">
        {/* ── Breadcrumbs ─────────────────────────────────────────── */}
        <nav aria-label="Fil d'Ariane" className="px-7 pt-5 pb-0 max-md:px-4">
          <ol className="flex items-center gap-1.5 text-sm text-g400 max-w-[1080px] mx-auto">
            <li>
              <Link href="/" className="hover:text-terre transition-colors">
                Accueil
              </Link>
            </li>
            <li aria-hidden="true" className="text-g300">
              &rsaquo;
            </li>
            <li>
              <Link
                href={`/${ville}`}
                className="hover:text-terre transition-colors"
              >
                {vNom}
              </Link>
            </li>
            <li aria-hidden="true" className="text-g300">
              &rsaquo;
            </li>
            <li className="text-anthracite font-medium">{mNom}</li>
          </ol>
        </nav>

        {/* ── Hero ────────────────────────────────────────────────── */}
        <section className="bg-anthracite px-7 mt-4 pt-10 pb-12 max-md:px-4 max-md:pt-7 max-md:pb-9 relative overflow-hidden rounded-2xl max-w-[1120px] mx-auto">
          <div className="absolute -top-[120px] -right-[80px] w-[400px] h-[400px] rounded-full bg-[rgba(196,83,26,.06)]" />
          <div className="absolute -bottom-[100px] -left-[60px] w-[340px] h-[340px] rounded-full bg-[rgba(232,168,76,.04)]" />
          <div className="max-w-[680px] mx-auto text-center relative z-[1]">
            <h1 className="font-display text-[clamp(24px,4vw,36px)] font-bold text-white leading-[1.15] tracking-[-0.5px] mb-2">
              {mNom} &agrave;{" "}
              <em className="not-italic text-or">{vNom}</em> &mdash; Artisans
              v&eacute;rifi&eacute;s sur Bativio
            </h1>
            <p className="text-sm text-white/50 mt-3 max-w-[480px] mx-auto">
              Comparez les {mNom.toLowerCase()}s de {vNom}, consultez les avis
              et demandez un devis gratuit en 2&nbsp;minutes. Z&eacute;ro
              commission.
            </p>
          </div>
        </section>

        {/* ── Artisan grid ────────────────────────────────────────── */}
        <section className="px-7 py-10 max-md:px-4">
          <div className="max-w-[1080px] mx-auto">
            <h2 className="font-display text-xl font-semibold text-anthracite mb-1">
              {artisans.length > 0
                ? `${artisans.length} ${mNom.toLowerCase()}${artisans.length > 1 ? "s" : ""} \u00e0 ${vNom}`
                : `${mNom}s \u00e0 ${vNom}`}
            </h2>
            <div className="w-10 h-0.5 bg-terre mb-6" />

            {artisans.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {artisans.map((a) => (
                  <ArtisanCard
                    key={a.id || a.slug}
                    artisan={a}
                    villeSlug={ville}
                  />
                ))}
              </div>
            ) : (
              /* ── Empty state ──────────────────────────────────── */
              <div className="text-center py-16 px-6 bg-white rounded-2xl border border-g100">
                <div className="text-5xl mb-4">
                  {METIERS.find((m) => m.slug === metier)?.icone || "\uD83D\uDD27"}
                </div>
                <h3 className="font-display text-lg font-semibold text-anthracite mb-2">
                  Aucun {mNom.toLowerCase()} &agrave; {vNom} pour le moment
                </h3>
                <p className="text-g400 text-sm mb-6 max-w-[400px] mx-auto">
                  Soyez le premier {mNom.toLowerCase()} &agrave; vous inscrire
                  sur Bativio et gagnez en visibilit&eacute; aupr&egrave;s des
                  clients de {vNom}.
                </p>
                <Link
                  href="/inscription"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-terre text-white font-semibold rounded-lg hover:bg-terre-light transition-colors text-sm"
                >
                  Cr&eacute;er ma page gratuitement
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 8h10M9 4l4 4-4 4" />
                  </svg>
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* ── SEO text ────────────────────────────────────────────── */}
        {intro && (
          <section className="px-7 py-12 max-md:px-4 border-t border-g100">
            <div className="max-w-[800px] mx-auto">
              <h2 className="font-display text-lg font-semibold text-anthracite mb-4">
                Trouver un {mNom.toLowerCase()} de confiance &agrave; {vNom}
              </h2>
              <div className="w-10 h-0.5 bg-terre mb-5" />
              <p className="text-g500 text-sm leading-relaxed whitespace-pre-line">
                {intro}
              </p>
            </div>
          </section>
        )}

        {/* ── FAQ ─────────────────────────────────────────────────── */}
        {faq.length > 0 && (
          <section className="px-7 py-12 max-md:px-4 bg-white border-t border-g100">
            <div className="max-w-[800px] mx-auto">
              <h2 className="font-display text-lg font-semibold text-anthracite mb-4">
                Questions fr&eacute;quentes &mdash; {mNom} &agrave; {vNom}
              </h2>
              <div className="w-10 h-0.5 bg-terre mb-6" />
              <dl className="space-y-6">
                {faq.map((f, i) => (
                  <div key={i} className="border border-g100 rounded-xl p-5">
                    <dt className="font-display text-base font-semibold text-anthracite mb-2">
                      {f.q}
                    </dt>
                    <dd className="text-g500 text-sm leading-relaxed">
                      {f.a}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </section>
        )}

        {/* ── CTA bottom ──────────────────────────────────────────── */}
        <section className="px-7 py-14 max-md:px-4 text-center">
          <div className="max-w-[600px] mx-auto">
            <h2 className="font-display text-xl font-bold text-anthracite mb-3">
              Vous &ecirc;tes {mNom.toLowerCase()} &agrave; {vNom}&nbsp;?
            </h2>
            <p className="text-g400 text-sm mb-6">
              Rejoignez Bativio et recevez des demandes de devis de clients
              pr&egrave;s de chez vous. Inscription gratuite, z&eacute;ro
              commission.
            </p>
            <Link
              href="/inscription"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-terre text-white font-semibold rounded-lg hover:bg-terre-light transition-colors"
            >
              Inscrire mon entreprise
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 8h10M9 4l4 4-4 4" />
              </svg>
            </Link>
          </div>
        </section>
      </main>

      {/* ── JSON-LD structured data ───────────────────────────────── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdItemList) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdService) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }}
      />
    </>
  );
}
