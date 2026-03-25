import type { ArtisanPublic, VilleData, MetierData } from "./api";

export const MOCK_VILLES: VilleData[] = [
  { id: "1", nom: "Chambery", slug: "chambery", codePostal: "73000", departement: "Savoie", contenuSeo: "Chambery, capitale historique de la Savoie, abrite un patrimoine architectural riche entre Vieux-Chambery et quartiers modernes comme Bissy ou Cognin. Les artisans du batiment y sont particulierement sollicites pour la renovation d'immeubles anciens et les projets de construction neuve.", nombreArtisans: 5 },
  { id: "2", nom: "Annecy", slug: "annecy", codePostal: "74000", departement: "Haute-Savoie", contenuSeo: "Annecy, la Venise des Alpes, seduit par son lac et sa vieille ville pittoresque. Les artisans accompagnent la renovation du centre historique et les constructions dans les quartiers residentiels.", nombreArtisans: 0 },
  { id: "3", nom: "Grenoble", slug: "grenoble", codePostal: "38000", departement: "Isere", contenuSeo: "Grenoble, capitale des Alpes, est un pole universitaire et technologique majeur. La renovation energetique constitue un marche important pour les artisans.", nombreArtisans: 0 },
  { id: "4", nom: "Lyon", slug: "lyon", codePostal: "69000", departement: "Rhone", contenuSeo: "Lyon, deuxieme metropole de France, offre un marche du batiment dynamique et diversifie.", nombreArtisans: 0 },
  { id: "5", nom: "Valence", slug: "valence", codePostal: "26000", departement: "Drome", contenuSeo: "Valence, porte du Midi, beneficie d'un cadre de vie attractif entre Rhone et Vercors.", nombreArtisans: 0 },
];

export const MOCK_METIERS: MetierData[] = [
  { id: "1", nom: "Plombier", slug: "plombier", icone: "\u{1F527}", nombreArtisans: 1 },
  { id: "2", nom: "Electricien", slug: "electricien", icone: "\u26A1", nombreArtisans: 1 },
  { id: "3", nom: "Peintre", slug: "peintre", icone: "\u{1F3A8}", nombreArtisans: 1 },
  { id: "4", nom: "Macon", slug: "macon", icone: "\u{1F9F1}", nombreArtisans: 1 },
  { id: "5", nom: "Carreleur", slug: "carreleur", icone: "\u{1F532}", nombreArtisans: 1 },
  { id: "6", nom: "Menuisier", slug: "menuisier", icone: "\u{1FA9A}", nombreArtisans: 0 },
  { id: "7", nom: "Couvreur", slug: "couvreur", icone: "\u{1F3E0}", nombreArtisans: 0 },
  { id: "8", nom: "Chauffagiste", slug: "chauffagiste", icone: "\u{1F525}", nombreArtisans: 0 },
  { id: "9", nom: "Serrurier", slug: "serrurier", icone: "\u{1F511}", nombreArtisans: 0 },
  { id: "10", nom: "Cuisiniste", slug: "cuisiniste", icone: "\u{1F373}", nombreArtisans: 0 },
];

export const MOCK_ARTISANS: ArtisanPublic[] = [
  {
    id: "1", nomAffichage: "Martin Plomberie", slug: "martin-plomberie", metierNom: "Plombier", metierIcone: "\u{1F527}",
    ville: "Chambery", noteMoyenne: 4.8, nombreAvis: 47, description: "Plombier a Chambery depuis 15 ans, specialise en renovation de salles de bains, installation de chauffage et depannage d'urgence.",
    telephone: "04 79 12 34 56", adresse: "Chambery", codePostal: "73000", zoneRayonKm: 25, experienceAnnees: 15, plan: "PRO",
    badgesNoms: ["RGE", "Qualibat", "Assurance decennale"],
    services: [
      { id: "s1", titre: "Depannage plomberie", description: "Intervention rapide pour fuites, canalisations bouchees.", prixIndicatif: "A partir de 80\u20AC", ordre: 0 },
      { id: "s2", titre: "Renovation salle de bains", description: "Conception et realisation complete.", prixIndicatif: "Sur devis", ordre: 1 },
      { id: "s3", titre: "Installation chauffage", description: "Pose de chaudieres gaz, pompes a chaleur.", prixIndicatif: "Sur devis", ordre: 2 },
    ],
    photos: [], horaires: [
      { jourSemaine: 1, ouvert: true, heureOuverture: "08:00", heureFermeture: "18:00" },
      { jourSemaine: 2, ouvert: true, heureOuverture: "08:00", heureFermeture: "18:00" },
      { jourSemaine: 3, ouvert: true, heureOuverture: "08:00", heureFermeture: "18:00" },
      { jourSemaine: 4, ouvert: true, heureOuverture: "08:00", heureFermeture: "18:00" },
      { jourSemaine: 5, ouvert: true, heureOuverture: "08:00", heureFermeture: "18:00" },
      { jourSemaine: 6, ouvert: true, heureOuverture: "09:00", heureFermeture: "12:00" },
      { jourSemaine: 7, ouvert: false, heureOuverture: "", heureFermeture: "" },
    ],
    zones: ["Chambery", "Cognin", "Bissy", "La Motte-Servolex", "Bassens", "Saint-Alban-Leysse"],
  },
  {
    id: "2", nomAffichage: "Elec Savoie", slug: "elec-savoie", metierNom: "Electricien", metierIcone: "\u26A1",
    ville: "Chambery", noteMoyenne: 4.9, nombreAvis: 32, description: "Electricien qualifie a Chambery, tous travaux electriques dans le respect des normes NF C 15-100.",
    telephone: "04 79 23 45 67", adresse: "Chambery", codePostal: "73000", zoneRayonKm: 25, experienceAnnees: 8, plan: "ESSENTIEL",
    badgesNoms: ["Qualifelec", "Assurance decennale"], services: [], photos: [], horaires: [], zones: ["Chambery", "Aix-les-Bains"],
  },
  {
    id: "3", nomAffichage: "Dupont Peinture", slug: "dupont-peinture", metierNom: "Peintre", metierIcone: "\u{1F3A8}",
    ville: "Chambery", noteMoyenne: 4.7, nombreAvis: 28, description: "Artisan peintre a Chambery, peinture decorative, ravalement de facades, pose de revetements muraux.",
    telephone: "04 79 34 56 78", adresse: "Chambery", codePostal: "73000", zoneRayonKm: 25, experienceAnnees: 12, plan: "GRATUIT",
    badgesNoms: ["Qualibat"], services: [], photos: [], horaires: [], zones: ["Chambery", "Cognin"],
  },
  {
    id: "4", nomAffichage: "Alpes Maconnerie", slug: "alpes-maconnerie", metierNom: "Macon", metierIcone: "\u{1F9F1}",
    ville: "Chambery", noteMoyenne: 4.6, nombreAvis: 53, description: "Macon a Chambery depuis 20 ans, construction traditionnelle savoyarde et renovation du bati ancien.",
    telephone: "04 79 45 67 89", adresse: "Chambery", codePostal: "73000", zoneRayonKm: 25, experienceAnnees: 20, plan: "PRO_PLUS",
    badgesNoms: ["Qualibat", "CAPEB", "Garantie decennale"], services: [], photos: [], horaires: [], zones: ["Chambery", "Cognin"],
  },
  {
    id: "5", nomAffichage: "Savoie Carrelage", slug: "savoie-carrelage", metierNom: "Carreleur", metierIcone: "\u{1F532}",
    ville: "Chambery", noteMoyenne: 4.5, nombreAvis: 19, description: "Carreleur professionnel a Chambery, pose tous types de carrelages et faiences.",
    telephone: "04 79 56 78 90", adresse: "Chambery", codePostal: "73000", zoneRayonKm: 25, experienceAnnees: 6, plan: "ESSENTIEL",
    badgesNoms: ["Assurance decennale"], services: [], photos: [], horaires: [], zones: ["Chambery", "Cognin"],
  },
];
