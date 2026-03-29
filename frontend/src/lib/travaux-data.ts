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
    id: "1", nom: "Rénovation salle de bain", slug: "renovation-salle-de-bain",
    description: "La rénovation de salle de bain est l'un des projets les plus demandés en France. Que ce soit pour remplacer une baignoire par une douche à l'italienne, refaire le carrelage, ou moderniser la plomberie et les sanitaires, faire appel à des artisans qualifiés est essentiel. Le coût moyen se situe entre 5 000 et 15 000€ selon la surface et les finitions choisies. Les normes électriques NF C 15-100 imposent des règles strictes pour les volumes de sécurité autour de la douche et de la baignoire.",
    metiers: ["plombier", "carreleur", "peintre"],
    photo: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&h=400&fit=crop",
    faq: [
      { q: "Combien coûte une rénovation de salle de bain ?", a: "Entre 5 000 et 15 000€ en moyenne, selon la surface et les finitions. Un simple rafraîchissement coûte autour de 3 000€." },
      { q: "Combien de temps durent les travaux ?", a: "Comptez 2 à 4 semaines pour une rénovation complète, 1 semaine pour un rafraîchissement." },
      { q: "Faut-il un permis pour rénover sa salle de bain ?", a: "Non, sauf si vous modifiez la structure porteuse ou la façade du bâtiment." },
    ],
  },
  {
    id: "2", nom: "Installation pompe à chaleur", slug: "installation-pompe-a-chaleur",
    description: "L'installation d'une pompe à chaleur (PAC) air-eau ou air-air permet de réduire votre facture énergétique de 30 à 60%. C'est l'investissement le plus rentable en rénovation énergétique. Les aides MaPrimeRénov' peuvent couvrir jusqu'à 40% du coût. Un artisan RGE est obligatoire pour en bénéficier.",
    metiers: ["chauffagiste"],
    photo: "https://images.unsplash.com/photo-1585129777188-94600bc7b4b3?w=600&h=400&fit=crop",
    faq: [
      { q: "Quel est le coût d'une pompe à chaleur ?", a: "Entre 8 000 et 16 000€ posée, selon le type (air-eau, air-air) et la puissance." },
      { q: "Quelles aides pour installer une PAC ?", a: "MaPrimeRénov', CEE, éco-PTZ. Un artisan RGE est requis." },
    ],
  },
  {
    id: "3", nom: "Peinture intérieure", slug: "peinture-interieure",
    description: "La peinture intérieure transforme instantanément l'atmosphère d'une pièce. Un peintre professionnel garantit une préparation des surfaces impeccable, un choix de peintures adaptées et des finitions soignées. Le prix moyen est de 20 à 40€/m² fournitures comprises.",
    metiers: ["peintre"],
    photo: "https://images.unsplash.com/photo-1562259929-b4e1fd3aef09?w=600&h=400&fit=crop",
    faq: [
      { q: "Combien coûte la peinture au m² ?", a: "Entre 20 et 40€/m² fournitures et main d'œuvre comprises." },
    ],
  },
  {
    id: "4", nom: "Mise aux normes électriques", slug: "mise-aux-normes-electriques",
    description: "La mise aux normes électriques NF C 15-100 est obligatoire lors de la vente ou de la rénovation d'un logement. Un électricien qualifié réalise un diagnostic, remplace le tableau électrique si nécessaire, et met en conformité l'ensemble de l'installation.",
    metiers: ["electricien"],
    photo: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=600&h=400&fit=crop",
    faq: [
      { q: "Est-ce obligatoire ?", a: "Oui, lors d'une vente (diagnostic obligatoire) et recommandé pour tout logement de plus de 15 ans." },
    ],
  },
  {
    id: "5", nom: "Rénovation toiture", slug: "renovation-toiture",
    description: "La rénovation de toiture comprend le remplacement des tuiles ou ardoises endommagées, la réfection de l'étanchéité, et l'isolation par l'extérieur (ITE). Un couvreur certifié garantit la qualité et la durabilité des travaux.",
    metiers: ["couvreur"],
    photo: "https://images.unsplash.com/photo-1632759145351-1d592919f522?w=600&h=400&fit=crop",
    faq: [
      { q: "Quand faut-il rénover sa toiture ?", a: "Dès l'apparition de fuites, de tuiles cassées, ou après 25-30 ans sans entretien." },
    ],
  },
  {
    id: "6", nom: "Pose de carrelage", slug: "pose-de-carrelage",
    description: "La pose de carrelage nécessite un savoir-faire technique pour garantir un résultat esthétique et durable. Sol ou mur, intérieur ou extérieur, un carreleur professionnel maîtrise tous les formats et matériaux.",
    metiers: ["carreleur"],
    photo: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600&h=400&fit=crop",
    faq: [
      { q: "Quel prix pour la pose de carrelage ?", a: "Entre 30 et 60€/m² selon le format et la complexité de la pose." },
    ],
  },
  {
    id: "7", nom: "Dépannage plomberie", slug: "depannage-plomberie",
    description: "Un dépannage plomberie urgent (fuite d'eau, canalisation bouchée, chauffe-eau en panne) nécessite l'intervention rapide d'un plombier qualifié. Les tarifs varient de 80 à 200€ selon le type d'intervention.",
    metiers: ["plombier"],
    photo: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&h=400&fit=crop",
    faq: [
      { q: "Combien coûte un dépannage ?", a: "À partir de 80€ pour une intervention simple, jusqu'à 200€ pour une urgence week-end." },
    ],
  },
  {
    id: "8", nom: "Isolation thermique", slug: "isolation-thermique",
    description: "L'isolation thermique est le premier levier pour réduire vos factures d'énergie. Combles, murs, planchers : chaque zone traitée améliore le DPE de votre logement et votre confort.",
    metiers: ["macon", "couvreur", "chauffagiste"],
    photo: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&h=400&fit=crop",
    faq: [
      { q: "Par où commencer l'isolation ?", a: "Les combles (30% des déperditions), puis les murs (25%), puis les fenêtres (15%)." },
    ],
  },
  {
    id: "9", nom: "Construction extension", slug: "construction-extension",
    description: "L'extension de maison (véranda, garage, étage supplémentaire) est un projet ambitieux qui nécessite un maçon expérimenté. Permis de construire obligatoire au-delà de 20m².",
    metiers: ["macon"],
    photo: "https://images.unsplash.com/photo-1517581177682-a085bb7ffb15?w=600&h=400&fit=crop",
    faq: [
      { q: "Faut-il un permis de construire ?", a: "Oui au-delà de 20m² de surface. En-dessous, une déclaration préalable suffit." },
    ],
  },
  {
    id: "10", nom: "Rénovation cuisine", slug: "renovation-cuisine",
    description: "La rénovation de cuisine fait intervenir plusieurs corps de métier : plombier, électricien, carreleur et menuisier. Un projet complet coûte en moyenne 8 000 à 25 000€.",
    metiers: ["plombier", "electricien", "carreleur", "menuisier"],
    photo: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=400&fit=crop",
    faq: [
      { q: "Combien coûte une cuisine complète ?", a: "De 8 000 à 25 000€ selon les finitions, les équipements et la surface." },
    ],
  },
  {
    id: "11", nom: "Pose de parquet", slug: "pose-de-parquet",
    description: "La pose de parquet massif, contrecollé ou stratifié est un travail de précision. Un menuisier professionnel garantit un sol parfaitement posé, stable et durable.",
    metiers: ["menuisier"],
    photo: "https://images.unsplash.com/photo-1588854337236-6889d631faa8?w=600&h=400&fit=crop",
    faq: [
      { q: "Quel type de parquet choisir ?", a: "Massif pour le haut de gamme, contrecollé pour le rapport qualité/prix, stratifié pour le budget." },
    ],
  },
  {
    id: "12", nom: "Changement de serrure", slug: "changement-de-serrure",
    description: "Le changement de serrure est nécessaire après un cambriolage, une perte de clés, ou pour renforcer la sécurité de votre logement. Un serrurier professionnel intervient rapidement et vous conseille sur le niveau de sécurité adapté.",
    metiers: ["serrurier"],
    photo: "https://images.unsplash.com/photo-1588854337236-6889d631faa8?w=600&h=400&fit=crop",
    faq: [
      { q: "Combien coûte un changement de serrure ?", a: "De 80 à 300€ selon le type de serrure (simple, 3 points, 5 points)." },
    ],
  },
];
