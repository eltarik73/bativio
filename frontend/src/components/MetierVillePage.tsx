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
  serrurier: {
    intro:
      "Un probleme de serrure peut survenir a tout moment : porte claquee, cle cassee dans la serrure, tentative d'effraction ou simplement besoin de renforcer la securite de votre logement. Les serruriers de {ville} inscrits sur Bativio interviennent rapidement pour tous vos besoins en serrurerie et metallerie. Que ce soit pour un depannage en urgence, le remplacement d'une serrure, l'installation d'une porte blindee ou la reparation d'un volet roulant, nos artisans sont qualifies et verifies. Sur Bativio, chaque serrurier affiche ses specialites, ses tarifs indicatifs et les avis de ses clients precedents. La transparence tarifaire est essentielle dans ce metier : un bon serrurier fournit toujours un devis avant d'intervenir, meme en urgence. Demandez un devis gratuit sur Bativio et recevez une reponse rapide — les serruriers de {ville} sont notifies instantanement de votre demande.",
    faq: [
      {
        q: "Combien coute un depannage serrurier a {ville} ?",
        a: "A {ville}, un depannage serrurerie (ouverture de porte simple) coute entre 80 et 200 euros en heures ouvrees, et entre 150 et 350 euros la nuit ou le week-end. Le remplacement d'une serrure coute entre 100 et 400 euros selon le modele. Demandez un devis gratuit sur Bativio pour eviter les mauvaises surprises.",
      },
      {
        q: "Comment eviter les serruriers malhonnetes a {ville} ?",
        a: "Sur Bativio, tous les serruriers sont verifies par leur numero SIRET. Consultez les avis clients, verifiez les badges de certification et exigez toujours un devis ecrit avant intervention. Un serrurier serieux ne facture jamais sans devis prealable.",
      },
      {
        q: "Un serrurier peut-il installer une porte blindee ?",
        a: "Oui, la plupart des serruriers sur Bativio proposent la fourniture et la pose de portes blindees certifiees A2P. Comptez entre 1 500 et 4 000 euros selon le niveau de certification (BP1, BP2, BP3). Demandez un devis pour obtenir un chiffrage precis adapte a votre logement.",
      },
    ],
  },
  cuisiniste: {
    intro:
      "Amenager ou renover une cuisine est un projet qui transforme votre quotidien. Les cuisinistes de {ville} inscrits sur Bativio vous accompagnent de la conception a la pose de votre cuisine sur mesure. Qu'il s'agisse d'une cuisine equipee standard, d'un agencement haut de gamme ou d'une simple renovation de facades, nos artisans cuisinistes sont a votre ecoute pour creer l'espace qui vous ressemble. Un bon cuisiniste gere l'ensemble du projet : prise de mesures, conception 3D, choix des materiaux, coordination des corps de metier (plomberie, electricite), fabrication et pose. Sur Bativio, consultez les realisations de chaque cuisiniste, comparez les styles et demandez un devis gratuit sans engagement.",
    faq: [
      {
        q: "Combien coute une cuisine sur mesure a {ville} ?",
        a: "A {ville}, une cuisine equipee complete coute entre 5 000 et 15 000 euros pour une gamme standard, et entre 15 000 et 40 000 euros pour du haut de gamme. Ce prix inclut generalement les meubles, le plan de travail, l'electromenager et la pose. Demandez un devis gratuit sur Bativio.",
      },
      {
        q: "Combien de temps pour installer une cuisine ?",
        a: "La pose d'une cuisine complete prend en moyenne 3 a 5 jours. Ajoutez 2 a 4 semaines de delai de fabrication pour du sur-mesure. Les travaux annexes (plomberie, electricite, carrelage) peuvent allonger le chantier d'une semaine supplementaire.",
      },
      {
        q: "Un cuisiniste gere-t-il aussi la plomberie et l'electricite ?",
        a: "Oui, la plupart des cuisinistes sur Bativio coordonnent l'ensemble des corps de metier necessaires. Certains disposent de leurs propres equipes plomberie/electricite, d'autres travaillent avec des partenaires de confiance. Verifiez les prestations incluses dans le devis.",
      },
    ],
  },
  charpentier: {
    intro:
      "La charpente est l'ossature de votre toiture et la garantie de la solidite de votre habitation. Que vous construisiez une maison neuve, envisagiez une surelevation ou ayez besoin de reparer une charpente endommagee, les charpentiers de {ville} inscrits sur Bativio maitrisent toutes les techniques : charpente traditionnelle en bois massif, charpente industrielle en fermettes, lamelle-colle. Le metier de charpentier exige une expertise pointue : calcul des charges, choix des essences de bois, traitement contre les insectes xylophages et les champignons. Sur Bativio, chaque charpentier affiche ses qualifications (Qualibat charpente bois, assurance decennale) et ses realisations photographiees. Le traitement preventif ou curatif de la charpente est essentiel en region Rhone-Alpes, ou l'humidite peut favoriser les degradations. Demandez un devis gratuit pour votre projet de charpente — l'artisan peut generalement effectuer un diagnostic sur place dans la semaine.",
    faq: [
      {
        q: "Combien coute une charpente neuve a {ville} ?",
        a: "A {ville}, une charpente traditionnelle coute entre 60 et 120 euros du m2, tandis qu'une charpente industrielle (fermettes) revient entre 40 et 80 euros du m2. Pour une maison de 100m2 au sol, le budget charpente se situe entre 5 000 et 15 000 euros selon la complexite et les materiaux choisis.",
      },
      {
        q: "Comment savoir si ma charpente a besoin d'un traitement ?",
        a: "Les signes d'alerte sont : sciure au sol sous la charpente, petits trous dans le bois, poutres qui sonnent creux, traces de moisissures. Un diagnostic professionnel est recommande tous les 5 ans. Sur Bativio, demandez un devis gratuit pour un diagnostic charpente a {ville}.",
      },
      {
        q: "Peut-on surelevation une maison a {ville} ?",
        a: "Oui, la surelevation est une solution pour gagner de la surface habitable sans emprise au sol supplementaire. Un permis de construire est necessaire. Le cout varie entre 1 500 et 2 500 euros du m2. Un charpentier qualifie sur Bativio peut evaluer la faisabilite et vous accompagner dans les demarches.",
      },
    ],
  },
  terrassier: {
    intro:
      "Le terrassement est la premiere etape de tout projet de construction. Les terrassiers de {ville} inscrits sur Bativio realisent les travaux de preparation de terrain indispensables avant la construction : decaissement, nivellement, creusement de fondations, creation de voies d'acces, pose de reseaux (VRD : Voirie et Reseaux Divers). Un terrassier qualifie intervient egalement pour l'assainissement, le drainage, la viabilisation de terrain et l'amenagement de plateformes. Sur Bativio, chaque terrassier affiche son parc de machines (mini-pelle, tractopelle, camion-benne), ses specialites et ses realisations. Le terrassement est un metier technique qui necessite une connaissance approfondie des sols et des reglementations locales. Demandez un devis gratuit pour votre projet de terrassement a {ville}.",
    faq: [
      {
        q: "Combien coute un terrassement a {ville} ?",
        a: "A {ville}, le terrassement coute en moyenne entre 25 et 55 euros du m3 selon la nature du sol et l'accessibilite du terrain. Pour un terrain de 200m2, comptez entre 2 000 et 8 000 euros. L'evacuation des terres represente un cout supplementaire de 15 a 30 euros du m3.",
      },
      {
        q: "Faut-il un permis pour des travaux de terrassement ?",
        a: "Les travaux de terrassement simples (nivellement, decaissement) ne necessitent generalement pas de permis. En revanche, si le terrassement s'inscrit dans un projet de construction, le permis de construire couvre ces travaux. Pour les VRD, des autorisations specifiques peuvent etre requises.",
      },
      {
        q: "Quand faire realiser un terrassement ?",
        a: "La periode ideale est le printemps ou le debut d'ete, quand le sol est sec mais pas trop dur. Evitez les periodes de gel ou de fortes pluies. Un terrassier sur Bativio peut vous conseiller sur le meilleur moment selon votre projet.",
      },
    ],
  },
  demolition: {
    intro:
      "La demolition et le curage sont des etapes prealables indispensables a de nombreux projets de renovation ou de reconstruction. Les entreprises de demolition de {ville} inscrites sur Bativio realisent tous types de travaux : demolition partielle ou totale de batiments, curage d'interieur avant renovation, desamiantage, deconstruction selective pour recyclage des materiaux. La demolition est un metier qui exige rigueur et respect des normes de securite : diagnostic amiante prealable obligatoire, gestion des dechets selon la reglementation, protection des structures mitoyennes. Sur Bativio, chaque entreprise de demolition affiche ses certifications, son materiel et ses references. Demandez un devis gratuit pour votre projet de demolition ou de curage a {ville}.",
    faq: [
      {
        q: "Combien coute une demolition a {ville} ?",
        a: "A {ville}, le curage d'un appartement coute entre 30 et 60 euros du m2. La demolition complete d'une maison revient entre 80 et 150 euros du m2 selon la complexite (amiante, accessibilite, tri des dechets). Demandez un devis gratuit sur Bativio pour un chiffrage precis.",
      },
      {
        q: "Un diagnostic amiante est-il obligatoire avant demolition ?",
        a: "Oui, un diagnostic amiante est obligatoire avant tous travaux de demolition sur les batiments construits avant juillet 1997. Ce diagnostic doit etre realise par un diagnostiqueur certifie. En cas de presence d'amiante, une entreprise specialisee devra intervenir.",
      },
      {
        q: "Que deviennent les dechets de demolition ?",
        a: "Les dechets de demolition doivent etre tries et achemines vers des centres de traitement agrees. Un bon professionnel pratique la deconstruction selective pour maximiser le recyclage (beton, metaux, bois). Les entreprises sur Bativio assurent la gestion complete des dechets conformement a la reglementation.",
      },
    ],
  },
  platrier: {
    intro:
      "Le platrier-plaquiste est l'artisan des finitions interieures. Les platriers de {ville} inscrits sur Bativio realisent la pose de plaques de platre (BA13), la creation de cloisons, les faux plafonds, le doublage des murs et les enduits de finition. Que vous souhaitiez redistribuer les pieces de votre appartement, creer un faux plafond avec spots integres, isoler vos murs par l'interieur ou simplement reprendre des enduits fissures, un platrier qualifie intervient avec precision et rapidite. Sur Bativio, chaque platrier affiche ses specialites : cloisons seches, plafonds suspendus, isolation, enduits traditionnels a la chaux. Les photos de realisations vous permettent de juger de la qualite des finitions. Demandez un devis gratuit — les platriers de {ville} vous repondent rapidement avec une proposition detaillee.",
    faq: [
      {
        q: "Combien coute la pose de placoplatre a {ville} ?",
        a: "A {ville}, la pose de cloisons en placoplatre coute entre 25 et 50 euros du m2 (fourniture et pose). Un faux plafond revient entre 30 et 60 euros du m2. Le doublage isolant (placo + isolant) coute entre 35 et 70 euros du m2. Demandez un devis gratuit sur Bativio.",
      },
      {
        q: "Combien de temps pour creer une cloison ?",
        a: "Un platrier professionnel peut monter une cloison standard (3m x 2,50m) en une journee, finitions comprises. Pour un projet complet de redistribution de pieces (3-4 cloisons), comptez 3 a 5 jours de travaux. Les finitions (bandes, enduit, poncage) representent environ la moitie du temps.",
      },
      {
        q: "Quelle difference entre cloison seche et cloison maconnee ?",
        a: "La cloison seche (placo) est plus rapide a poser, plus legere et offre de bonnes performances acoustiques. La cloison maconnee (briques, carreaux de platre) est plus solide et offre une meilleure isolation phonique. Un platrier sur Bativio vous conseillera la meilleure solution selon votre projet.",
      },
    ],
  },
  solier: {
    intro:
      "Le solier est le specialiste des revetements de sol souples et semi-rigides. Les soliers de {ville} inscrits sur Bativio posent tous types de revetements : parquet flottant, parquet massif, sols vinyles (PVC), lino, moquette, sol stratifie, resine de sol, beton cire. Choisir le bon revetement de sol est essentiel pour le confort, l'esthetique et la durabilite de vos pieces. Un solier professionnel prepare le support (ragréage, mise a niveau), pose le revetement selon les regles de l'art et assure des finitions impeccables (plinthes, seuils, joints). Sur Bativio, consultez les realisations de chaque solier, comparez les specialites et demandez un devis gratuit en precisant la surface et le type de revetement souhaite.",
    faq: [
      {
        q: "Combien coute la pose de parquet a {ville} ?",
        a: "A {ville}, la pose de parquet flottant coute entre 15 et 35 euros du m2 (pose seule). Le parquet massif pose colle revient entre 30 et 60 euros du m2. Ajoutez le cout du parquet lui-meme (15 a 100 euros du m2 selon l'essence et la qualite). Demandez un devis gratuit sur Bativio.",
      },
      {
        q: "Quel revetement de sol choisir pour une piece humide ?",
        a: "Pour une salle de bain ou une cuisine, privilegiez un sol vinyle (PVC), un sol en resine ou un parquet massif traite pour pieces humides. Le parquet flottant standard et la moquette sont deconseilles. Un solier sur Bativio peut vous conseiller le meilleur choix selon votre usage et votre budget.",
      },
      {
        q: "Faut-il un ragréage avant la pose d'un revetement de sol ?",
        a: "Un ragréage est necessaire si le support presente des irregularites de plus de 2mm par metre. Cette etape est cruciale pour garantir une pose durable et un rendu esthetique parfait. Votre solier sur Bativio evaluera l'etat du support lors d'une visite technique.",
      },
    ],
  },
  vitrier: {
    intro:
      "Le vitrier-miroitier est le specialiste du verre dans l'habitat. Les vitriers de {ville} inscrits sur Bativio interviennent pour le remplacement de vitres cassees, la pose de double vitrage, l'installation de miroirs sur mesure, la creation de parois de douche en verre et la pose de credences en verre. Une vitre cassee represente un risque de securite et une deperdition de chaleur immediate : les vitriers de Bativio peuvent intervenir rapidement pour un depannage. Pour les projets de renovation energetique, le remplacement de simples vitrages par du double ou triple vitrage ameliore significativement l'isolation thermique et acoustique de votre logement. Demandez un devis gratuit sur Bativio pour tous vos travaux de vitrerie a {ville}.",
    faq: [
      {
        q: "Combien coute un remplacement de vitre a {ville} ?",
        a: "A {ville}, le remplacement d'une vitre simple coute entre 80 et 200 euros. Pour un double vitrage, comptez entre 150 et 400 euros par fenetre selon les dimensions. La pose d'une paroi de douche en verre revient entre 500 et 1 500 euros. Demandez un devis gratuit sur Bativio.",
      },
      {
        q: "Faut-il remplacer le simple vitrage par du double vitrage ?",
        a: "Oui, le remplacement du simple vitrage par du double vitrage reduit les deperditions de chaleur de 40% et ameliore fortement le confort acoustique. Les aides MaPrimeRenov peuvent couvrir une partie du cout si vous passez par un artisan certifie RGE.",
      },
      {
        q: "Un vitrier intervient-il en urgence ?",
        a: "Oui, la plupart des vitriers sur Bativio proposent des interventions d'urgence pour les vitres cassees (securite, intemperies). Envoyez votre demande via le formulaire de devis en precisant l'urgence : l'artisan est notifie immediatement et peut generalement intervenir dans la journee.",
      },
    ],
  },
  isolation: {
    intro:
      "L'isolation est le premier levier pour reduire vos factures d'energie et ameliorer le confort de votre logement. Les specialistes de l'isolation a {ville} inscrits sur Bativio realisent tous types d'isolation : combles perdus ou amenages, murs par l'interieur (ITI) ou par l'exterieur (ITE), planchers bas, toitures-terrasses. En region Rhone-Alpes, ou les hivers sont rigoureux et les etes de plus en plus chauds, une bonne isolation est doublement avantageuse. Les artisans certifies RGE sur Bativio vous permettent de beneficier des aides financieres (MaPrimeRenov, CEE, eco-pret a taux zero). Sur Bativio, chaque specialiste affiche ses certifications, les materiaux utilises (laine de verre, laine de roche, ouate de cellulose, polystyrene, fibre de bois) et ses realisations. Demandez un devis gratuit pour votre projet d'isolation a {ville}.",
    faq: [
      {
        q: "Combien coute l'isolation des combles a {ville} ?",
        a: "A {ville}, l'isolation des combles perdus par soufflage coute entre 20 et 35 euros du m2. L'isolation des combles amenages (sous rampants) revient entre 40 et 80 euros du m2. L'ITE (isolation par l'exterieur) coute entre 100 et 200 euros du m2. Les aides peuvent couvrir jusqu'a 75% du cout pour les foyers modestes.",
      },
      {
        q: "Quelles aides pour l'isolation en 2026 ?",
        a: "MaPrimeRenov, les CEE (Certificats d'Economies d'Energie), l'eco-pret a taux zero et les aides locales sont disponibles pour les travaux d'isolation. Pour en beneficier, les travaux doivent etre realises par un artisan certifie RGE. Les specialistes isolation sur Bativio sont souvent certifies RGE.",
      },
      {
        q: "Quelle est la meilleure isolation pour une maison ?",
        a: "Le choix depend de la zone a isoler et de votre budget. Pour les combles : ouate de cellulose ou laine de roche soufflee. Pour les murs par l'interieur : laine de verre ou fibre de bois. Pour l'ITE : polystyrene expanse ou fibre de bois. Un professionnel sur Bativio peut realiser un audit energetique pour vous conseiller.",
      },
    ],
  },
  paysagiste: {
    intro:
      "Le paysagiste est l'artisan qui transforme vos espaces exterieurs en veritables lieux de vie. Les paysagistes de {ville} inscrits sur Bativio concoivent et realisent l'amenagement de vos jardins, terrasses et espaces verts. Creation de jardins, entretien regulier, elagage d'arbres, plantation de haies, installation d'arrosage automatique, engazonnement : nos paysagistes interviennent sur tous types de projets. Un paysagiste qualifie prend en compte l'exposition, le type de sol, le climat local et vos envies pour creer un espace harmonieux et facile a entretenir. Sur Bativio, consultez les realisations avant/apres de chaque paysagiste et demandez un devis gratuit. Les paysagistes de {ville} vous proposent des amenagements adaptes au climat de la region Rhone-Alpes.",
    faq: [
      {
        q: "Combien coute un amenagement de jardin a {ville} ?",
        a: "A {ville}, un amenagement de jardin complet (conception, plantation, engazonnement) coute entre 30 et 80 euros du m2 selon la complexite. Un entretien regulier revient entre 25 et 45 euros de l'heure. L'elagage d'un arbre coute entre 200 et 800 euros selon la taille et l'accessibilite.",
      },
      {
        q: "A quelle periode planter un jardin en Rhone-Alpes ?",
        a: "En region Rhone-Alpes, la meilleure periode de plantation est l'automne (octobre-novembre) ou le printemps (mars-avril). Evitez les periodes de gel et de secheresse. Un paysagiste sur Bativio peut vous etablir un plan de plantation adapte au climat local.",
      },
      {
        q: "Un paysagiste peut-il aussi amenager une terrasse ?",
        a: "De nombreux paysagistes sur Bativio realisent egalement les amenagements de terrasses (bois, pierre, composite), les murets, les escaliers exterieurs et les eclairages de jardin. Verifiez les specialites indiquees sur la fiche de chaque artisan.",
      },
    ],
  },
  pisciniste: {
    intro:
      "Faire construire ou renover une piscine est un projet qui valorise votre propriete et ameliore votre qualite de vie. Les piscinistes de {ville} inscrits sur Bativio sont des specialistes de la construction, la renovation et l'entretien de piscines. Piscine coque, piscine beton, piscine naturelle, spa : nos artisans maitrisent toutes les techniques. Un pisciniste qualifie gere l'ensemble du projet : etude de faisabilite, terrassement, construction, installation des equipements (filtration, chauffage, traitement), mise en eau et mise en service. Sur Bativio, chaque pisciniste affiche ses realisations et ses specialites. Demandez un devis gratuit pour votre projet de piscine a {ville}.",
    faq: [
      {
        q: "Combien coute une piscine a {ville} ?",
        a: "A {ville}, une piscine coque coute entre 15 000 et 30 000 euros pose comprise. Une piscine en beton sur mesure revient entre 25 000 et 60 000 euros. Ajoutez environ 5 000 euros pour les equipements (filtration, chauffage). Demandez un devis gratuit sur Bativio pour un chiffrage precis.",
      },
      {
        q: "Faut-il un permis de construire pour une piscine ?",
        a: "Une declaration prealable suffit pour les piscines de 10 a 100m2. Au-dela de 100m2 ou avec un abri de plus de 1,80m de hauteur, un permis de construire est necessaire. Les piscines de moins de 10m2 non couvertes ne necessitent aucune formalite.",
      },
      {
        q: "Quel entretien pour une piscine ?",
        a: "L'entretien regulier comprend le controle du pH, le nettoyage du filtre, l'aspiration du fond et le traitement de l'eau. Un contrat d'entretien annuel coute entre 1 000 et 2 000 euros. Les piscinistes sur Bativio proposent des formules d'entretien adaptees a vos besoins.",
      },
    ],
  },
  domoticien: {
    intro:
      "La domotique transforme votre maison en un espace intelligent, confortable et econome en energie. Les domoticiens de {ville} inscrits sur Bativio concoivent et installent des systemes de maison connectee : eclairage automatise, volets roulants connectes, thermostat intelligent, systeme audio multiroom, controle a distance via smartphone. Un domoticien qualifie integre harmonieusement les differents equipements pour creer une experience fluide et intuitive. Sur Bativio, chaque domoticien affiche ses certifications, les marques qu'il maitrise (Somfy, KNX, Legrand, Hager) et ses realisations. Demandez un devis gratuit pour votre projet de maison connectee a {ville}.",
    faq: [
      {
        q: "Combien coute une installation domotique a {ville} ?",
        a: "A {ville}, une installation domotique de base (eclairage + volets + thermostat connectes) coute entre 2 000 et 5 000 euros. Un systeme complet (securite, audio, video, automatismes) peut atteindre 10 000 a 30 000 euros selon la surface et la complexite. Demandez un devis gratuit sur Bativio.",
      },
      {
        q: "Peut-on installer de la domotique dans une maison ancienne ?",
        a: "Oui, les solutions domotiques sans fil (Z-Wave, Zigbee, Wi-Fi) permettent d'equiper une maison ancienne sans travaux lourds. Un domoticien sur Bativio peut evaluer votre installation existante et proposer les solutions les plus adaptees a votre configuration.",
      },
      {
        q: "La domotique permet-elle de faire des economies d'energie ?",
        a: "Oui, un systeme domotique bien configure peut reduire votre consommation energetique de 15 a 30%. La programmation du chauffage, la gestion automatique de l'eclairage et le pilotage des volets selon l'ensoleillement sont les principaux leviers d'economie.",
      },
    ],
  },
  alarme: {
    intro:
      "La securite de votre domicile ou de vos locaux professionnels est une priorite. Les specialistes en alarme et videosurveillance de {ville} inscrits sur Bativio installent des systemes de protection adaptes a vos besoins : alarme anti-intrusion, videosurveillance, controle d'acces, telesurveillance. Un installateur qualifie realise une etude de securite de vos locaux, propose un systeme sur mesure et assure l'installation, la mise en service et la maintenance. Sur Bativio, chaque specialiste affiche ses certifications (APSAD, NF Service), les marques qu'il installe et ses references. Demandez un devis gratuit pour securiser votre habitation ou votre local professionnel a {ville}.",
    faq: [
      {
        q: "Combien coute une alarme maison a {ville} ?",
        a: "A {ville}, une alarme anti-intrusion (centrale + detecteurs + sirene) coute entre 500 et 2 000 euros pose comprise. Un systeme de videosurveillance (4 cameras + enregistreur) revient entre 1 000 et 3 000 euros. La telesurveillance coute entre 20 et 50 euros par mois en supplement.",
      },
      {
        q: "A-t-on le droit d'installer des cameras chez soi ?",
        a: "Oui, vous pouvez installer des cameras a l'interieur de votre domicile et filmant votre propriete privee sans autorisation. En revanche, les cameras ne doivent pas filmer la voie publique ni la propriete de vos voisins. Pour des locaux professionnels, des obligations supplementaires s'appliquent (CNIL, information des salaries).",
      },
      {
        q: "Quelle alarme choisir : filaire ou sans fil ?",
        a: "L'alarme sans fil est plus simple a installer, ideale en renovation. L'alarme filaire est plus fiable (pas de risque de brouillage, pas de piles a changer) et recommandee en construction neuve. Un specialiste sur Bativio vous conseillera la meilleure solution selon votre configuration.",
      },
    ],
  },
  ramoneur: {
    intro:
      "Le ramonage est une obligation legale pour tous les foyers equipes d'un appareil de chauffage a combustion (cheminee, poele, chaudiere). Les ramoneurs de {ville} inscrits sur Bativio realisent le ramonage mecanique des conduits de fumee, l'entretien des poeles a bois et a granules, le diagnostic des conduits et les travaux de fumisterie. Un ramonage regulier previent les risques d'incendie et d'intoxication au monoxyde de carbone, et ameliore le rendement de votre appareil de chauffage. En region Rhone-Alpes, le ramonage est obligatoire au moins une fois par an (deux fois pour le bois). Sur Bativio, chaque ramoneur affiche ses certifications et ses tarifs. Demandez un devis gratuit pour votre ramonage a {ville}.",
    faq: [
      {
        q: "Combien coute un ramonage a {ville} ?",
        a: "A {ville}, un ramonage de cheminee ou poele coute entre 50 et 90 euros. Le ramonage d'un conduit de chaudiere gaz ou fioul revient entre 60 et 120 euros. Un certificat de ramonage est delivre apres l'intervention, document exige par votre assurance en cas de sinistre.",
      },
      {
        q: "Le ramonage est-il obligatoire ?",
        a: "Oui, le ramonage est obligatoire au moins une fois par an pour tous les conduits de fumee en activite. Pour les appareils a bois (cheminee, poele), deux ramonages par an sont exiges dont un pendant la periode de chauffe. Le defaut de ramonage peut entrainer une amende et la non-prise en charge par l'assurance en cas d'incendie.",
      },
      {
        q: "Quand faire ramoner sa cheminee ?",
        a: "Le meilleur moment est en fin d'ete ou debut d'automne, avant la reprise de la saison de chauffe. Le second ramonage annuel (pour le bois) se fait en cours d'hiver. Reservez votre ramoneur a {ville} a l'avance sur Bativio car les creneaux se remplissent vite en automne.",
      },
    ],
  },
  cloturiste: {
    intro:
      "La cloture delimitie votre propriete, assure votre intimite et securise votre terrain. Les cloturistes de {ville} inscrits sur Bativio installent tous types de clotures et portails : cloture en grillage, panneaux rigides, palissade bois, cloture aluminium, portail battant ou coulissant, motorisation de portail. Un cloturiste professionnel prend en compte la reglementation locale (PLU, hauteur maximale, distance avec le voisinage), realise le bornage si necessaire et assure une pose durable. Sur Bativio, consultez les realisations de chaque cloturiste et demandez un devis gratuit pour votre projet de cloture ou de portail a {ville}.",
    faq: [
      {
        q: "Combien coute une cloture a {ville} ?",
        a: "A {ville}, une cloture en grillage rigide coute entre 30 et 60 euros du metre lineaire pose. Une cloture en aluminium revient entre 100 et 250 euros du metre lineaire. Un portail battant standard coute entre 800 et 3 000 euros pose comprise. La motorisation ajoute 500 a 1 500 euros.",
      },
      {
        q: "Faut-il une autorisation pour poser une cloture ?",
        a: "Dans la plupart des communes, une declaration prealable de travaux est necessaire pour installer une cloture. Verifiez le PLU de votre commune pour les contraintes de hauteur, de materiaux et de couleur. Votre cloturiste sur Bativio peut vous accompagner dans ces demarches.",
      },
      {
        q: "Quelle cloture choisir pour un jardin ?",
        a: "Le choix depend de vos priorites : grillage rigide pour un bon rapport qualite-prix, aluminium pour le design et la durabilite, bois pour le charme naturel. Un cloturiste sur Bativio vous conseillera la meilleure solution selon votre terrain, votre budget et le style de votre maison.",
      },
    ],
  },
  "paysagiste-ext": {
    intro:
      "L'amenagement exterieur transforme vos espaces de vie en prolongement naturel de votre maison. Les specialistes de l'amenagement exterieur a {ville} inscrits sur Bativio concoivent et realisent terrasses (bois, pierre, composite, beton), allees de jardin, cours en gravier ou pave, murets decoratifs, escaliers exterieurs et eclairages d'ambiance. Un amenagement exterieur bien pense valorise votre propriete et cree des espaces conviviaux pour profiter des beaux jours. Sur Bativio, chaque artisan affiche ses realisations avant/apres et ses specialites. Demandez un devis gratuit pour votre projet d'amenagement exterieur a {ville}.",
    faq: [
      {
        q: "Combien coute une terrasse a {ville} ?",
        a: "A {ville}, une terrasse en bois coute entre 80 et 150 euros du m2 pose comprise. Une terrasse en composite revient entre 100 et 200 euros du m2. Une terrasse en pierre naturelle ou en pave coute entre 60 et 120 euros du m2. Demandez un devis gratuit sur Bativio pour un chiffrage precis.",
      },
      {
        q: "Quel materiau choisir pour une terrasse ?",
        a: "Le bois (pin traite, exotique) offre chaleur et esthetique mais demande un entretien annuel. Le composite est sans entretien mais plus couteux. La pierre naturelle est durable et noble. Le gres cerame sur plots est tendance et facile a poser. Un specialiste sur Bativio vous conseillera selon votre usage et votre budget.",
      },
      {
        q: "Faut-il un permis pour amenager une terrasse ?",
        a: "Une terrasse de plain-pied (moins de 60cm de hauteur) ne necessite generalement aucune formalite. Une terrasse surelevee de plus de 60cm ou couverte necessite une declaration prealable ou un permis de construire selon la surface. Verifiez le PLU de votre commune.",
      },
    ],
  },
  assainissement: {
    intro:
      "L'assainissement est un enjeu de sante publique et de protection de l'environnement. Les specialistes de l'assainissement a {ville} inscrits sur Bativio realisent l'installation, l'entretien et la mise aux normes des systemes d'assainissement : raccordement au tout-a-l'egout, installation de fosses septiques et micro-stations d'epuration, vidange, curage de canalisations, diagnostic assainissement. En zone non raccordee au reseau collectif, l'assainissement non collectif (ANC) est obligatoire. Un diagnostic assainissement est requis lors de la vente d'un bien immobilier. Sur Bativio, chaque specialiste affiche ses certifications et ses references. Demandez un devis gratuit pour vos travaux d'assainissement a {ville}.",
    faq: [
      {
        q: "Combien coute l'installation d'une fosse septique a {ville} ?",
        a: "A {ville}, l'installation d'une fosse toutes eaux coute entre 3 000 et 8 000 euros. Une micro-station d'epuration revient entre 6 000 et 15 000 euros. La vidange d'une fosse septique coute entre 150 et 400 euros. Demandez un devis gratuit sur Bativio pour un chiffrage precis.",
      },
      {
        q: "A quelle frequence vidanger une fosse septique ?",
        a: "La vidange d'une fosse toutes eaux doit etre effectuee tous les 3 a 4 ans en moyenne, ou quand le niveau de boues atteint 50% du volume. Une micro-station necessite un entretien plus frequent (1 a 2 fois par an). Un specialiste sur Bativio peut etablir un contrat d'entretien adapte.",
      },
      {
        q: "Le diagnostic assainissement est-il obligatoire ?",
        a: "Oui, un diagnostic assainissement est obligatoire lors de la vente d'un bien immobilier en assainissement non collectif. Ce diagnostic est valable 3 ans et doit etre realise par le SPANC (Service Public d'Assainissement Non Collectif) de votre commune.",
      },
    ],
  },
  etancheite: {
    intro:
      "L'etancheite est essentielle pour proteger votre batiment contre les infiltrations d'eau et les degats qui en decoulent. Les specialistes en etancheite a {ville} inscrits sur Bativio traitent tous les problemes d'impermeabilisation : toitures-terrasses, balcons, fondations, sous-sols, salles de bain, facades. Une etancheite defaillante entraine des infiltrations, des moisissures et des degradations structurelles couteuses a reparer. Les etancheurs qualifies utilisent differentes techniques selon le support : membrane bitumineuse, resine polyurethane, etancheite liquide, cuvelage. Sur Bativio, chaque specialiste affiche ses certifications (Qualibat etancheite), ses references et ses realisations. Demandez un devis gratuit pour vos travaux d'etancheite a {ville}.",
    faq: [
      {
        q: "Combien coute l'etancheite d'une toiture-terrasse a {ville} ?",
        a: "A {ville}, l'etancheite d'une toiture-terrasse coute entre 40 et 100 euros du m2 selon la technique utilisee (membrane bitumineuse, resine, PVC). Pour un balcon, comptez entre 50 et 120 euros du m2. Le cuvelage d'un sous-sol revient entre 150 et 300 euros du m2.",
      },
      {
        q: "Comment detecter un probleme d'etancheite ?",
        a: "Les signes d'alerte sont : taches d'humidite persistantes, moisissures, salpetre sur les murs, odeur de moisi, peinture qui cloque. Une detection precoce evite des reparations couteuses. Un specialiste en etancheite sur Bativio peut realiser un diagnostic complet de votre batiment.",
      },
      {
        q: "Quelle garantie pour des travaux d'etancheite ?",
        a: "Les travaux d'etancheite sont couverts par la garantie decennale (10 ans). C'est une obligation legale pour l'artisan. Verifiez que votre etancheur sur Bativio affiche le badge assurance decennale. Les membranes d'etancheite elles-memes ont une duree de vie de 15 a 30 ans selon le materiau.",
      },
    ],
  },
};

// ---------------------------------------------------------------------------
// Known metier slugs (for routing disambiguation)
// ---------------------------------------------------------------------------

export const METIER_SLUGS = new Set([
  // GROS OEUVRE
  "macon",
  "couvreur",
  "charpentier",
  "terrassier",
  "demolition",
  // SECOND OEUVRE
  "plombier",
  "electricien",
  "peintre",
  "carreleur",
  "menuisier",
  "chauffagiste",
  "platrier",
  "solier",
  "vitrier",
  "isolation",
  // SPECIALITES
  "serrurier",
  "cuisiniste",
  "paysagiste",
  "pisciniste",
  "domoticien",
  "alarme",
  "ramoneur",
  // EXTERIEUR
  "cloturiste",
  "paysagiste-ext",
  "assainissement",
  "etancheite",
  // AUTRE
  "autre",
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
        url: `https://www.bativio.fr/${ville}/${a.slug}`,
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
      url: "https://www.bativio.fr",
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
        item: "https://www.bativio.fr",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: vNom,
        item: `https://www.bativio.fr/${ville}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: mNom,
        item: `https://www.bativio.fr/${ville}/${metier}`,
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
