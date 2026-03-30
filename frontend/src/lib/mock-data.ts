import type { ArtisanPublic, VilleData, MetierData } from "./api";

export const MOCK_VILLES: VilleData[] = [
  { id: "1", nom: "Chambéry", slug: "chambery", codePostal: "73000", departement: "Savoie", contenuSeo: "Chambéry, capitale historique de la Savoie, abrite un patrimoine architectural riche entre Vieux-Chambéry et quartiers modernes comme Bissy ou Cognin. Les artisans du bâtiment y sont particulièrement sollicités pour la rénovation d'immeubles anciens et les projets de construction neuve.", nombreArtisans: 5 },
  { id: "2", nom: "Annecy", slug: "annecy", codePostal: "74000", departement: "Haute-Savoie", contenuSeo: "Annecy, la Venise des Alpes, séduit par son lac et sa vieille ville pittoresque. Les artisans accompagnent la rénovation du centre historique et les constructions dans les quartiers résidentiels.", nombreArtisans: 0 },
  { id: "3", nom: "Grenoble", slug: "grenoble", codePostal: "38000", departement: "Isère", contenuSeo: "Grenoble, capitale des Alpes, est un pôle universitaire et technologique majeur. La rénovation énergétique constitue un marché important pour les artisans.", nombreArtisans: 0 },
  { id: "4", nom: "Lyon", slug: "lyon", codePostal: "69000", departement: "Rhône", contenuSeo: "Lyon, deuxième métropole de France, offre un marché du bâtiment dynamique et diversifié.", nombreArtisans: 0 },
  { id: "5", nom: "Valence", slug: "valence", codePostal: "26000", departement: "Drôme", contenuSeo: "Valence, porte du Midi, bénéficie d'un cadre de vie attractif entre Rhône et Vercors.", nombreArtisans: 0 },
];

export const MOCK_METIERS: MetierData[] = [
  { id: "1", nom: "Plombier", slug: "plombier", icone: "\u{1F527}", nombreArtisans: 1 },
  { id: "2", nom: "Électricien", slug: "electricien", icone: "⚡", nombreArtisans: 1 },
  { id: "3", nom: "Peintre", slug: "peintre", icone: "\u{1F3A8}", nombreArtisans: 1 },
  { id: "4", nom: "Maçon", slug: "macon", icone: "\u{1F9F1}", nombreArtisans: 1 },
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
    ville: "Chambéry", noteMoyenne: 4.8, nombreAvis: 47,
    description: "Plombier-chauffagiste depuis 15 ans. Dépannage urgent, rénovation salle de bain, installation chauffage.",
    telephone: "04 79 12 34 56", adresse: "Chambéry", codePostal: "73000", zoneRayonKm: 25, experienceAnnees: 15, plan: "PRO",
    templateId: "classique", colorPrimary: "#C4531A", colorAccent: "#E8A84C", photoLayout: "grid",
    badgesNoms: ["RGE", "Qualibat"],
    services: [
      { id: "s1", titre: "Dépannage", description: "Intervention rapide pour fuites, canalisations bouchées.", prixIndicatif: "À partir de 80€", ordre: 0 },
      { id: "s2", titre: "Rénovation SDB", description: "Conception et réalisation complète.", prixIndicatif: "Sur devis", ordre: 1 },
      { id: "s3", titre: "Chauffage", description: "Pose de chaudières gaz, pompes à chaleur.", prixIndicatif: "Sur devis", ordre: 2 },
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
    zones: ["Chambéry", "Cognin", "Bissy", "La Motte-Servolex", "Bassens", "Saint-Alban-Leysse"],
  },
  {
    id: "2", nomAffichage: "Élec Savoie", slug: "elec-savoie", metierNom: "Électricien", metierIcone: "⚡",
    ville: "Chambéry", noteMoyenne: 4.9, nombreAvis: 32,
    description: "Électricien qualifié à Chambéry. Tous travaux électriques dans le respect des normes NF C 15-100.",
    telephone: "04 79 23 45 67", adresse: "Chambéry", codePostal: "73000", zoneRayonKm: 25, experienceAnnees: 8, plan: "ESSENTIEL",
    badgesNoms: ["Qualifelec"],
    services: [
      { id: "s4", titre: "Mise aux normes", description: "Diagnostic et mise en conformité de votre installation.", prixIndicatif: "À partir de 500€", ordre: 0 },
      { id: "s5", titre: "Domotique", description: "Maison connectée, éclairage intelligent.", prixIndicatif: "Sur devis", ordre: 1 },
      { id: "s6", titre: "Tableau électrique", description: "Remplacement et mise à niveau.", prixIndicatif: "Sur devis", ordre: 2 },
    ],
    photos: [], horaires: [], zones: ["Chambéry", "Aix-les-Bains"],
  },
  {
    id: "3", nomAffichage: "Dupont Peinture", slug: "dupont-peinture", metierNom: "Peintre", metierIcone: "\u{1F3A8}",
    ville: "Chambéry", noteMoyenne: 4.7, nombreAvis: 28,
    description: "Peinture décorative, ravalement de façades, pose de revêtements muraux. Devis gratuit.",
    telephone: "04 79 34 56 78", adresse: "Chambéry", codePostal: "73000", zoneRayonKm: 25, experienceAnnees: 12, plan: "GRATUIT",
    badgesNoms: ["Qualibat"],
    services: [
      { id: "s7", titre: "Décoration", description: "Peinture intérieure, finitions soignées.", prixIndicatif: "À partir de 25€/m²", ordre: 0 },
      { id: "s8", titre: "Façade", description: "Ravalement, nettoyage et protection.", prixIndicatif: "Sur devis", ordre: 1 },
      { id: "s9", titre: "Revêtements", description: "Papier peint, enduit décoratif.", prixIndicatif: "Sur devis", ordre: 2 },
    ],
    photos: [], horaires: [], zones: ["Chambéry", "Cognin"],
  },
  {
    id: "4", nomAffichage: "Alpes Maçonnerie", slug: "alpes-maconnerie", metierNom: "Maçon", metierIcone: "\u{1F9F1}",
    ville: "Chambéry", noteMoyenne: 4.6, nombreAvis: 53,
    description: "Construction traditionnelle savoyarde et rénovation du bâti ancien depuis 20 ans.",
    telephone: "04 79 45 67 89", adresse: "Chambéry", codePostal: "73000", zoneRayonKm: 25, experienceAnnees: 20, plan: "BUSINESS",
    badgesNoms: ["Qualibat", "CAPEB"],
    services: [
      { id: "s10", titre: "Construction", description: "Gros œuvre complet : fondations, murs, dalles.", prixIndicatif: "Sur devis", ordre: 0 },
      { id: "s11", titre: "Rénovation", description: "Restauration de murs en pierre, joints à la chaux.", prixIndicatif: "Sur devis", ordre: 1 },
      { id: "s12", titre: "Pierre", description: "Taille de pierre, murs traditionnels.", prixIndicatif: "Sur devis", ordre: 2 },
    ],
    photos: [], horaires: [], zones: ["Chambéry", "Cognin"],
  },
  {
    id: "5", nomAffichage: "Savoie Carrelage", slug: "savoie-carrelage", metierNom: "Carreleur", metierIcone: "\u{1F532}",
    ville: "Chambéry", noteMoyenne: 4.5, nombreAvis: 19,
    description: "Carreleur professionnel à Chambéry, pose tous types de carrelages et faïences.",
    telephone: "04 79 56 78 90", adresse: "Chambéry", codePostal: "73000", zoneRayonKm: 25, experienceAnnees: 6, plan: "ESSENTIEL",
    badgesNoms: ["Assurance décennale"],
    services: [
      { id: "s13", titre: "Carrelage", description: "Sol et mur, tous formats et matériaux.", prixIndicatif: "À partir de 35€/m²", ordre: 0 },
      { id: "s14", titre: "Faïence", description: "Pose de faïence et mosaïque.", prixIndicatif: "Sur devis", ordre: 1 },
      { id: "s15", titre: "Mosaïque", description: "Création de motifs personnalisés.", prixIndicatif: "Sur devis", ordre: 2 },
    ],
    photos: [], horaires: [], zones: ["Chambéry", "Cognin"],
  },
];
