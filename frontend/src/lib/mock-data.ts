import type { ArtisanPublic, VilleData, MetierData } from "./api";

export const MOCK_VILLES: VilleData[] = [
  { id: "1", nom: "Chamb\u00e9ry", slug: "chambery", codePostal: "73000", departement: "Savoie", contenuSeo: "Chamb\u00e9ry, capitale historique de la Savoie, abrite un patrimoine architectural riche entre Vieux-Chamb\u00e9ry et quartiers modernes comme Bissy ou Cognin. Les artisans du b\u00e2timent y sont particuli\u00e8rement sollicit\u00e9s pour la r\u00e9novation d'immeubles anciens et les projets de construction neuve.", nombreArtisans: 5 },
  { id: "2", nom: "Annecy", slug: "annecy", codePostal: "74000", departement: "Haute-Savoie", contenuSeo: "Annecy, la Venise des Alpes, s\u00e9duit par son lac et sa vieille ville pittoresque. Les artisans accompagnent la r\u00e9novation du centre historique et les constructions dans les quartiers r\u00e9sidentiels.", nombreArtisans: 0 },
  { id: "3", nom: "Grenoble", slug: "grenoble", codePostal: "38000", departement: "Is\u00e8re", contenuSeo: "Grenoble, capitale des Alpes, est un p\u00f4le universitaire et technologique majeur. La r\u00e9novation \u00e9nerg\u00e9tique constitue un march\u00e9 important pour les artisans.", nombreArtisans: 0 },
  { id: "4", nom: "Lyon", slug: "lyon", codePostal: "69000", departement: "Rh\u00f4ne", contenuSeo: "Lyon, deuxi\u00e8me m\u00e9tropole de France, offre un march\u00e9 du b\u00e2timent dynamique et diversifi\u00e9.", nombreArtisans: 0 },
  { id: "5", nom: "Valence", slug: "valence", codePostal: "26000", departement: "Dr\u00f4me", contenuSeo: "Valence, porte du Midi, b\u00e9n\u00e9ficie d'un cadre de vie attractif entre Rh\u00f4ne et Vercors.", nombreArtisans: 0 },
];

export const MOCK_METIERS: MetierData[] = [
  { id: "1", nom: "Plombier", slug: "plombier", icone: "\u{1F527}", nombreArtisans: 1 },
  { id: "2", nom: "\u00c9lectricien", slug: "electricien", icone: "\u26A1", nombreArtisans: 1 },
  { id: "3", nom: "Peintre", slug: "peintre", icone: "\u{1F3A8}", nombreArtisans: 1 },
  { id: "4", nom: "Ma\u00e7on", slug: "macon", icone: "\u{1F9F1}", nombreArtisans: 1 },
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
    ville: "Chamb\u00e9ry", noteMoyenne: 4.8, nombreAvis: 47,
    description: "Plombier-chauffagiste depuis 15 ans. D\u00e9pannage urgent, r\u00e9novation salle de bain, installation chauffage.",
    telephone: "04 79 12 34 56", adresse: "Chamb\u00e9ry", codePostal: "73000", zoneRayonKm: 25, experienceAnnees: 15, plan: "PRO",
    templateId: "classique", colorPrimary: "#C4531A", colorAccent: "#E8A84C", photoLayout: "grid",
    badgesNoms: ["RGE", "Qualibat"],
    services: [
      { id: "s1", titre: "D\u00e9pannage", description: "Intervention rapide pour fuites, canalisations bouch\u00e9es.", prixIndicatif: "\u00c0 partir de 80\u20AC", ordre: 0 },
      { id: "s2", titre: "R\u00e9novation SDB", description: "Conception et r\u00e9alisation compl\u00e8te.", prixIndicatif: "Sur devis", ordre: 1 },
      { id: "s3", titre: "Chauffage", description: "Pose de chaudi\u00e8res gaz, pompes \u00e0 chaleur.", prixIndicatif: "Sur devis", ordre: 2 },
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
    zones: ["Chamb\u00e9ry", "Cognin", "Bissy", "La Motte-Servolex", "Bassens", "Saint-Alban-Leysse"],
  },
  {
    id: "2", nomAffichage: "\u00c9lec Savoie", slug: "elec-savoie", metierNom: "\u00c9lectricien", metierIcone: "\u26A1",
    ville: "Chamb\u00e9ry", noteMoyenne: 4.9, nombreAvis: 32,
    description: "\u00c9lectricien qualifi\u00e9 \u00e0 Chamb\u00e9ry. Tous travaux \u00e9lectriques dans le respect des normes NF C 15-100.",
    telephone: "04 79 23 45 67", adresse: "Chamb\u00e9ry", codePostal: "73000", zoneRayonKm: 25, experienceAnnees: 8, plan: "ESSENTIEL",
    badgesNoms: ["Qualifelec"],
    services: [
      { id: "s4", titre: "Mise aux normes", description: "Diagnostic et mise en conformit\u00e9 de votre installation.", prixIndicatif: "\u00c0 partir de 500\u20AC", ordre: 0 },
      { id: "s5", titre: "Domotique", description: "Maison connect\u00e9e, \u00e9clairage intelligent.", prixIndicatif: "Sur devis", ordre: 1 },
      { id: "s6", titre: "Tableau \u00e9lectrique", description: "Remplacement et mise \u00e0 niveau.", prixIndicatif: "Sur devis", ordre: 2 },
    ],
    photos: [], horaires: [], zones: ["Chamb\u00e9ry", "Aix-les-Bains"],
  },
  {
    id: "3", nomAffichage: "Dupont Peinture", slug: "dupont-peinture", metierNom: "Peintre", metierIcone: "\u{1F3A8}",
    ville: "Chamb\u00e9ry", noteMoyenne: 4.7, nombreAvis: 28,
    description: "Peinture d\u00e9corative, ravalement de fa\u00e7ades, pose de rev\u00eatements muraux. Devis gratuit.",
    telephone: "04 79 34 56 78", adresse: "Chamb\u00e9ry", codePostal: "73000", zoneRayonKm: 25, experienceAnnees: 12, plan: "GRATUIT",
    badgesNoms: ["Qualibat"],
    services: [
      { id: "s7", titre: "D\u00e9coration", description: "Peinture int\u00e9rieure, finitions soign\u00e9es.", prixIndicatif: "\u00c0 partir de 25\u20AC/m\u00b2", ordre: 0 },
      { id: "s8", titre: "Fa\u00e7ade", description: "Ravalement, nettoyage et protection.", prixIndicatif: "Sur devis", ordre: 1 },
      { id: "s9", titre: "Rev\u00eatements", description: "Papier peint, enduit d\u00e9coratif.", prixIndicatif: "Sur devis", ordre: 2 },
    ],
    photos: [], horaires: [], zones: ["Chamb\u00e9ry", "Cognin"],
  },
  {
    id: "4", nomAffichage: "Alpes Ma\u00e7onnerie", slug: "alpes-maconnerie", metierNom: "Ma\u00e7on", metierIcone: "\u{1F9F1}",
    ville: "Chamb\u00e9ry", noteMoyenne: 4.6, nombreAvis: 53,
    description: "Construction traditionnelle savoyarde et r\u00e9novation du b\u00e2ti ancien depuis 20 ans.",
    telephone: "04 79 45 67 89", adresse: "Chamb\u00e9ry", codePostal: "73000", zoneRayonKm: 25, experienceAnnees: 20, plan: "PRO_PLUS",
    badgesNoms: ["Qualibat", "CAPEB"],
    services: [
      { id: "s10", titre: "Construction", description: "Gros \u0153uvre complet : fondations, murs, dalles.", prixIndicatif: "Sur devis", ordre: 0 },
      { id: "s11", titre: "R\u00e9novation", description: "Restauration de murs en pierre, joints \u00e0 la chaux.", prixIndicatif: "Sur devis", ordre: 1 },
      { id: "s12", titre: "Pierre", description: "Taille de pierre, murs traditionnels.", prixIndicatif: "Sur devis", ordre: 2 },
    ],
    photos: [], horaires: [], zones: ["Chamb\u00e9ry", "Cognin"],
  },
  {
    id: "5", nomAffichage: "Savoie Carrelage", slug: "savoie-carrelage", metierNom: "Carreleur", metierIcone: "\u{1F532}",
    ville: "Chamb\u00e9ry", noteMoyenne: 4.5, nombreAvis: 19,
    description: "Carreleur professionnel \u00e0 Chamb\u00e9ry, pose tous types de carrelages et fa\u00efences.",
    telephone: "04 79 56 78 90", adresse: "Chamb\u00e9ry", codePostal: "73000", zoneRayonKm: 25, experienceAnnees: 6, plan: "ESSENTIEL",
    badgesNoms: ["Assurance d\u00e9cennale"],
    services: [
      { id: "s13", titre: "Carrelage", description: "Sol et mur, tous formats et mat\u00e9riaux.", prixIndicatif: "\u00c0 partir de 35\u20AC/m\u00b2", ordre: 0 },
      { id: "s14", titre: "Fa\u00efence", description: "Pose de fa\u00efence et mosa\u00efque.", prixIndicatif: "Sur devis", ordre: 1 },
      { id: "s15", titre: "Mosa\u00efque", description: "Cr\u00e9ation de motifs personnalis\u00e9s.", prixIndicatif: "Sur devis", ordre: 2 },
    ],
    photos: [], horaires: [], zones: ["Chamb\u00e9ry", "Cognin"],
  },
];
