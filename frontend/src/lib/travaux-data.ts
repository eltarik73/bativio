export interface TypeTravaux {
  id: string;
  nom: string;
  slug: string;
  description: string;
  metiers: string[];
  photo: string;
  faq: { q: string; a: string }[];
}

export const TRAVAUX: TypeTravaux[] = [
  {
    id: "1", nom: "R\u00e9novation salle de bain", slug: "renovation-salle-de-bain",
    description: "La r\u00e9novation de salle de bain est l'un des projets les plus demand\u00e9s en France. Que ce soit pour remplacer une baignoire par une douche \u00e0 l'italienne, refaire le carrelage, ou moderniser la plomberie et les sanitaires, faire appel \u00e0 des artisans qualifi\u00e9s est essentiel. Le co\u00fbt moyen se situe entre 5 000 et 15 000\u20AC selon la surface et les finitions choisies. Les normes \u00e9lectriques NF C 15-100 imposent des r\u00e8gles strictes pour les volumes de s\u00e9curit\u00e9 autour de la douche et de la baignoire.",
    metiers: ["plombier", "carreleur", "peintre"],
    photo: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&h=400&fit=crop",
    faq: [
      { q: "Combien co\u00fbte une r\u00e9novation de salle de bain ?", a: "Entre 5 000 et 15 000\u20AC en moyenne, selon la surface et les finitions. Un simple rafra\u00eechissement co\u00fbte autour de 3 000\u20AC." },
      { q: "Combien de temps durent les travaux ?", a: "Comptez 2 \u00e0 4 semaines pour une r\u00e9novation compl\u00e8te, 1 semaine pour un rafra\u00eechissement." },
      { q: "Faut-il un permis pour r\u00e9nover sa salle de bain ?", a: "Non, sauf si vous modifiez la structure porteuse ou la fa\u00e7ade du b\u00e2timent." },
    ],
  },
  {
    id: "2", nom: "Installation pompe \u00e0 chaleur", slug: "installation-pompe-a-chaleur",
    description: "L'installation d'une pompe \u00e0 chaleur (PAC) air-eau ou air-air permet de r\u00e9duire votre facture \u00e9nerg\u00e9tique de 30 \u00e0 60%. C'est l'investissement le plus rentable en r\u00e9novation \u00e9nerg\u00e9tique. Les aides MaPrimeR\u00e9nov' peuvent couvrir jusqu'\u00e0 40% du co\u00fbt. Un artisan RGE est obligatoire pour en b\u00e9n\u00e9ficier.",
    metiers: ["chauffagiste"],
    photo: "https://images.unsplash.com/photo-1585129777188-94600bc7b4b3?w=600&h=400&fit=crop",
    faq: [
      { q: "Quel est le co\u00fbt d'une pompe \u00e0 chaleur ?", a: "Entre 8 000 et 16 000\u20AC pos\u00e9e, selon le type (air-eau, air-air) et la puissance." },
      { q: "Quelles aides pour installer une PAC ?", a: "MaPrimeR\u00e9nov', CEE, \u00e9co-PTZ. Un artisan RGE est requis." },
    ],
  },
  {
    id: "3", nom: "Peinture int\u00e9rieure", slug: "peinture-interieure",
    description: "La peinture int\u00e9rieure transforme instantan\u00e9ment l'atmosph\u00e8re d'une pi\u00e8ce. Un peintre professionnel garantit une pr\u00e9paration des surfaces impeccable, un choix de peintures adapt\u00e9es et des finitions soign\u00e9es. Le prix moyen est de 20 \u00e0 40\u20AC/m\u00b2 fournitures comprises.",
    metiers: ["peintre"],
    photo: "https://images.unsplash.com/photo-1562259929-b4e1fd3aef09?w=600&h=400&fit=crop",
    faq: [
      { q: "Combien co\u00fbte la peinture au m\u00b2 ?", a: "Entre 20 et 40\u20AC/m\u00b2 fournitures et main d'\u0153uvre comprises." },
    ],
  },
  {
    id: "4", nom: "Mise aux normes \u00e9lectriques", slug: "mise-aux-normes-electriques",
    description: "La mise aux normes \u00e9lectriques NF C 15-100 est obligatoire lors de la vente ou de la r\u00e9novation d'un logement. Un \u00e9lectricien qualifi\u00e9 r\u00e9alise un diagnostic, remplace le tableau \u00e9lectrique si n\u00e9cessaire, et met en conformit\u00e9 l'ensemble de l'installation.",
    metiers: ["electricien"],
    photo: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&h=400&fit=crop",
    faq: [
      { q: "Est-ce obligatoire ?", a: "Oui, lors d'une vente (diagnostic obligatoire) et recommand\u00e9 pour tout logement de plus de 15 ans." },
    ],
  },
  {
    id: "5", nom: "R\u00e9novation toiture", slug: "renovation-toiture",
    description: "La r\u00e9novation de toiture comprend le remplacement des tuiles ou ardoises endommag\u00e9es, la r\u00e9fection de l'\u00e9tanch\u00e9it\u00e9, et l'isolation par l'ext\u00e9rieur (ITE). Un couvreur certifi\u00e9 garantit la qualit\u00e9 et la durabilit\u00e9 des travaux.",
    metiers: ["couvreur"],
    photo: "https://images.unsplash.com/photo-1632759145351-1d592919f522?w=600&h=400&fit=crop",
    faq: [
      { q: "Quand faut-il r\u00e9nover sa toiture ?", a: "D\u00e8s l'apparition de fuites, de tuiles cass\u00e9es, ou apr\u00e8s 25-30 ans sans entretien." },
    ],
  },
  {
    id: "6", nom: "Pose de carrelage", slug: "pose-de-carrelage",
    description: "La pose de carrelage n\u00e9cessite un savoir-faire technique pour garantir un r\u00e9sultat esth\u00e9tique et durable. Sol ou mur, int\u00e9rieur ou ext\u00e9rieur, un carreleur professionnel ma\u00eetrise tous les formats et mat\u00e9riaux.",
    metiers: ["carreleur"],
    photo: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600&h=400&fit=crop",
    faq: [
      { q: "Quel prix pour la pose de carrelage ?", a: "Entre 30 et 60\u20AC/m\u00b2 selon le format et la complexit\u00e9 de la pose." },
    ],
  },
  {
    id: "7", nom: "D\u00e9pannage plomberie", slug: "depannage-plomberie",
    description: "Un d\u00e9pannage plomberie urgent (fuite d'eau, canalisation bouch\u00e9e, chauffe-eau en panne) n\u00e9cessite l'intervention rapide d'un plombier qualifi\u00e9. Les tarifs varient de 80 \u00e0 200\u20AC selon le type d'intervention.",
    metiers: ["plombier"],
    photo: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&h=400&fit=crop",
    faq: [
      { q: "Combien co\u00fbte un d\u00e9pannage ?", a: "\u00c0 partir de 80\u20AC pour une intervention simple, jusqu'\u00e0 200\u20AC pour une urgence week-end." },
    ],
  },
  {
    id: "8", nom: "Isolation thermique", slug: "isolation-thermique",
    description: "L'isolation thermique est le premier levier pour r\u00e9duire vos factures d'\u00e9nergie. Combles, murs, planchers : chaque zone trait\u00e9e am\u00e9liore le DPE de votre logement et votre confort.",
    metiers: ["macon", "couvreur", "chauffagiste"],
    photo: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&h=400&fit=crop",
    faq: [
      { q: "Par o\u00f9 commencer l'isolation ?", a: "Les combles (30% des d\u00e9perditions), puis les murs (25%), puis les fen\u00eatres (15%)." },
    ],
  },
  {
    id: "9", nom: "Construction extension", slug: "construction-extension",
    description: "L'extension de maison (v\u00e9randa, garage, \u00e9tage suppl\u00e9mentaire) est un projet ambitieux qui n\u00e9cessite un ma\u00e7on exp\u00e9riment\u00e9. Permis de construire obligatoire au-del\u00e0 de 20m\u00b2.",
    metiers: ["macon"],
    photo: "https://images.unsplash.com/photo-1517581177682-a085bb7ffb15?w=600&h=400&fit=crop",
    faq: [
      { q: "Faut-il un permis de construire ?", a: "Oui au-del\u00e0 de 20m\u00b2 de surface. En-dessous, une d\u00e9claration pr\u00e9alable suffit." },
    ],
  },
  {
    id: "10", nom: "R\u00e9novation cuisine", slug: "renovation-cuisine",
    description: "La r\u00e9novation de cuisine fait intervenir plusieurs corps de m\u00e9tier : plombier, \u00e9lectricien, carreleur et menuisier. Un projet complet co\u00fbte en moyenne 8 000 \u00e0 25 000\u20AC.",
    metiers: ["plombier", "electricien", "carreleur", "menuisier"],
    photo: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=400&fit=crop",
    faq: [
      { q: "Combien co\u00fbte une cuisine compl\u00e8te ?", a: "De 8 000 \u00e0 25 000\u20AC selon les finitions, les \u00e9quipements et la surface." },
    ],
  },
  {
    id: "11", nom: "Pose de parquet", slug: "pose-de-parquet",
    description: "La pose de parquet massif, contrecoll\u00e9 ou stratifi\u00e9 est un travail de pr\u00e9cision. Un menuisier professionnel garantit un sol parfaitement pos\u00e9, stable et durable.",
    metiers: ["menuisier"],
    photo: "https://images.unsplash.com/photo-1558618019-44bc87907eaa?w=600&h=400&fit=crop",
    faq: [
      { q: "Quel type de parquet choisir ?", a: "Massif pour le haut de gamme, contrecoll\u00e9 pour le rapport qualit\u00e9/prix, stratifi\u00e9 pour le budget." },
    ],
  },
  {
    id: "12", nom: "Changement de serrure", slug: "changement-de-serrure",
    description: "Le changement de serrure est n\u00e9cessaire apr\u00e8s un cambriolage, une perte de cl\u00e9s, ou pour renforcer la s\u00e9curit\u00e9 de votre logement. Un serrurier professionnel intervient rapidement et vous conseille sur le niveau de s\u00e9curit\u00e9 adapt\u00e9.",
    metiers: ["serrurier"],
    photo: "https://images.unsplash.com/photo-1558618019-44bc87907eaa?w=600&h=400&fit=crop",
    faq: [
      { q: "Combien co\u00fbte un changement de serrure ?", a: "De 80 \u00e0 300\u20AC selon le type de serrure (simple, 3 points, 5 points)." },
    ],
  },
];
