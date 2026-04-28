/**
 * Contenus uniques par ville pour l'anti-duplicate-content SEO.
 *
 * Chaque ville hub + villes secondaires importantes a son introText distinctif
 * (200-300 mots) qui mentionne :
 *  - particularités demographiques (taille, profil)
 *  - types de bati (immeubles haussmanniens Lyon, chalets HS, pavillons Valence)
 *  - travaux frequents
 *  - 1-2 specificites locales
 *
 * Si une ville n'a pas d'entree ici, fallback sur le contexte generique de
 * seo-local.ts (8 contextes : metropole / vallee / ville-thermale / etc.)
 */

export interface CityContent {
  slug: string;
  label: string;
  department: string;
  introText: string;
  popularQuartiers: string[];
  metiersDemandes: string[]; // top 5 a 10 metiers les plus recherches
}

export const CITY_CONTENTS: CityContent[] = [
  {
    slug: "chambery",
    label: "Chambéry",
    department: "Savoie",
    introText: "Préfecture de la Savoie (60 000 habitants), Chambéry est une ville de cœur historique avec un parc immobilier varié : centre médiéval avec ses bâtiments du XVIIIe siècle (quartier des Halles, place Saint-Léger, rue Croix-d'Or), résidences haussmanniennes du XIXe le long de l'avenue Maréchal Leclerc, lotissements pavillonnaires des années 70-80 sur les coteaux (Bissy, Mérande), et copropriétés récentes en périphérie. Les artisans chambériens interviennent quotidiennement sur des chantiers de rénovation thermique (mise aux normes MaPrimeRénov' et qualifelec, climat de moyenne montagne avec hivers exigeants), mise aux normes électriques NF C 15-100 dans les immeubles anciens, et rénovation de salles de bains dans les résidences thermales. La proximité du lac du Bourget et du massif des Bauges crée également une demande pour les chalets et résidences secondaires alentour. Bativio référence des plombiers, électriciens, peintres, maçons et chauffagistes de Chambéry et des communes périphériques (Cognin, La Motte-Servolex, Bassens, Jacob-Bellecombette).",
    popularQuartiers: ["Centre historique", "Mérande", "Bissy", "Faubourg Reclus", "Calamine"],
    metiersDemandes: ["plombier", "electricien", "peintre", "carreleur", "chauffagiste", "couvreur", "macon", "menuisier", "platrier", "vitrier"],
  },
  {
    slug: "aix-les-bains",
    label: "Aix-les-Bains",
    department: "Savoie",
    introText: "Station thermale historique au bord du lac du Bourget (30 000 habitants), Aix-les-Bains présente un parc immobilier hétéroclite : grands hôtels et villas Belle Époque du début du XXe siècle (quartier thermal autour des Thermes Nationaux, avenue de Tresserve), résidences hôtelières reconverties en appartements, et lotissements pavillonnaires plus récents en hauteur (Tresserve, Mouxy). Les artisans aixois sont régulièrement sollicités pour la restauration de bâti ancien (boiseries Belle Époque, ferronneries d'époque, peintures à la chaux), la rénovation énergétique PAC dans des résidences souvent secondaires, et l'entretien des piscines et terrasses bord de lac. La pression touristique et le climat tempéré du lac génèrent une demande continue toute l'année. Bativio met en relation les particuliers d'Aix-les-Bains avec des plombiers, électriciens, peintres et carreleurs vérifiés intervenant aussi sur Brison-Saint-Innocent, Tresserve et Le Bourget-du-Lac.",
    popularQuartiers: ["Centre thermal", "Marlioz", "Boncelin", "Choudy"],
    metiersDemandes: ["plombier", "electricien", "peintre", "couvreur", "macon", "carreleur", "chauffagiste", "menuisier", "vitrier"],
  },
  {
    slug: "annecy",
    label: "Annecy",
    department: "Haute-Savoie",
    introText: "Surnommée la Venise des Alpes, Annecy (130 000 habitants avec sa communauté d'agglo) combine un centre historique pittoresque (canaux, vieille ville, château) et un parc immobilier moderne en pleine expansion. Les chalets traditionnels savoyards en bois côtoient les résidences contemporaines à haute performance énergétique (label E+C-, Passivhaus). La pression foncière (prix au m² parmi les plus élevés de France hors Paris) pousse les propriétaires à optimiser chaque mètre carré : aménagement de combles, surélévation, transformation de garage en pièce de vie. Les artisans annéciens maîtrisent particulièrement la charpente traditionnelle, l'isolation thermique renforcée (climat alpin humide), la maçonnerie bord de lac (zones inondables), et la rénovation des hôtels-restaurants saisonniers. Le pôle technologique d'Annecy-le-Vieux génère également une forte demande de bureaux et locaux professionnels. Bativio couvre Annecy intra-muros et son agglomération (Cran-Gevrier, Seynod, Annecy-le-Vieux, Meythet, Pringy).",
    popularQuartiers: ["Vieille ville", "Annecy-le-Vieux", "Cran-Gevrier", "Seynod", "Les Romains"],
    metiersDemandes: ["plombier", "electricien", "peintre", "charpentier", "couvreur", "menuisier", "chauffagiste", "macon", "carreleur", "isolation"],
  },
  {
    slug: "grenoble",
    label: "Grenoble",
    department: "Isère",
    introText: "Capitale des Alpes (160 000 habitants intra-muros, 450 000 dans son aire urbaine), Grenoble combine un patrimoine architectural riche (vieux-Grenoble du XVe-XVIIe siècle autour de la place Saint-André, immeubles XIXe avenue Alsace-Lorraine) et de larges quartiers pavillonnaires en banlieue (Meylan, Saint-Martin-d'Hères, Échirolles). Les artisans grenoblois sont confrontés à des défis spécifiques : copropriétés des années 60-70 nombreuses (Villeneuve, Mistral) nécessitant des plans pluriannuels de rénovation, contrainte parasismique zone 4 (Code construction renforcé), et bâti universitaire et tertiaire dense (campus de Saint-Martin-d'Hères, Innovallée, Polygone scientifique CEA). La rénovation énergétique est particulièrement active grâce aux programmes ANRU et Action Cœur de Ville. Les chantiers de mise aux normes électriques en copropriété et de remplacement de chauffage collectif sont fréquents. Bativio met en relation des artisans qualifiés intervenant à Grenoble et dans les communes voisines (Échirolles, Saint-Martin-d'Hères, Fontaine, Meylan, Seyssins).",
    popularQuartiers: ["Vieux-Grenoble", "Île Verte", "Saint-Bruno", "Berriat", "Hoche"],
    metiersDemandes: ["plombier", "electricien", "peintre", "macon", "carreleur", "menuisier", "chauffagiste", "platrier", "couvreur", "isolation"],
  },
  {
    slug: "lyon",
    label: "Lyon",
    department: "Rhône",
    introText: "Deuxième aire urbaine de France (1,4 million d'habitants dans la métropole), Lyon présente une diversité architecturale exceptionnelle : traboules et bâtiments Renaissance du Vieux-Lyon (UNESCO), immeubles haussmanniens du Presqu'île et de la Croix-Rousse (classés au patrimoine mondial), constructions Art déco du 6e arrondissement, et quartiers contemporains de Confluence ou Gerland. Les artisans lyonnais sont quotidiennement sollicités pour la rénovation de copropriétés haussmanniennes (parquets en chêne, moulures, pierres de Lyon, ferronneries), la mise en conformité électrique des immeubles anciens, et la restauration des façades classées. La densité urbaine impose des contraintes spécifiques : accès chantier difficile en hyper-centre (rues piétonnes, places limitées), passage par syndics pour les copropriétés, gestion de l'amiante dans les bâtiments d'avant 1997. Le marché lyonnais est aussi très porteur pour la rénovation énergétique des passoires thermiques (interdiction de location G en 2025). Bativio référence des artisans intervenant sur Lyon et son agglomération (Villeurbanne, Vénissieux, Caluire-et-Cuire, Bron, Saint-Priest).",
    popularQuartiers: ["Vieux-Lyon", "Presqu'île", "Croix-Rousse", "Part-Dieu", "Confluence", "Gerland"],
    metiersDemandes: ["plombier", "electricien", "peintre", "macon", "carreleur", "menuisier", "chauffagiste", "platrier", "couvreur", "isolation"],
  },
  {
    slug: "valence",
    label: "Valence",
    department: "Drôme",
    introText: "Préfecture de la Drôme (65 000 habitants), Valence se situe au carrefour de la vallée du Rhône et des contreforts du Vercors. Son climat méditerranéen-continental (été chaud, mistral fréquent) impose des choix techniques spécifiques aux artisans : isolation thermique par l'extérieur recommandée, climatisation réversible omniprésente, protection solaire (volets, brise-soleil) sur les façades sud et ouest. Le parc immobilier mêle bâti ancien du centre historique (XVIIe-XVIIIe autour du Champ de Mars, kiosque Peynet), résidences des années 60-80 souvent à rénover thermiquement (passoires énergétiques nombreuses), et lotissements pavillonnaires modernes en périphérie. Les chantiers de rénovation énergétique sont nombreux grâce aux dispositifs MaPrimeRénov' renforcés sur la zone climatique H2c. La proximité de Romans-sur-Isère et Montélimar étend la zone d'intervention des artisans valentinois. Bativio met en relation des plombiers, électriciens, peintres, maçons et chauffagistes spécialisés dans les contraintes climatiques rhônalpines (Bourg-lès-Valence, Portes-lès-Valence, Saint-Marcel-lès-Valence).",
    popularQuartiers: ["Centre-ville", "Polygone", "Latour-Maubourg", "Valensolles", "Fontbarlettes"],
    metiersDemandes: ["plombier", "electricien", "peintre", "macon", "carreleur", "menuisier", "chauffagiste", "couvreur", "climaticien", "isolation"],
  },
  {
    slug: "albertville",
    label: "Albertville",
    department: "Savoie",
    introText: "Carrefour des vallées de la Tarentaise et de la Maurienne (20 000 habitants), Albertville est une ville-clé pour les chantiers d'intervention en montagne. Son patrimoine architectural mixte (cité médiévale de Conflans en hauteur, ville basse industrielle XIXe-XXe siècle, lotissements modernes en plaine) crée des besoins variés. Les artisans albertvillois sont rompus aux contraintes alpines : déneigement des accès chantiers en hiver, isolation thermique renforcée pour les hivers rigoureux, étanchéité hors gel des installations sanitaires en altitude (chalets de stations à proximité : Méribel, Courchevel, Les Saisies). La forte fréquentation touristique des stations voisines crée une demande continue d'entretien et de remise en état des résidences secondaires. Bativio couvre Albertville et son bassin (Ugine, Frontenex, Tournon).",
    popularQuartiers: ["Conflans", "Centre-ville", "Pré Mochaux", "Le Champ de Mars"],
    metiersDemandes: ["plombier", "electricien", "peintre", "couvreur", "charpentier", "macon", "chauffagiste", "menuisier", "carreleur", "isolation"],
  },
  {
    slug: "annemasse",
    label: "Annemasse",
    department: "Haute-Savoie",
    introText: "Aux portes de Genève (35 000 habitants), Annemasse est une ville frontalière dynamique en pleine expansion immobilière. Son parc combine bâti ancien fin XIXe (immeubles cheminots autour de la gare), résidences des années 60-70 (en cours de réhabilitation thermique massive via le Léman Express), et nombreuses constructions neuves récentes (zones d'urbanisation récente sur les Voirons et Gaillard). Les artisans annémassiens travaillent souvent pour une clientèle franco-suisse mixte aux exigences élevées (finitions soignées, équipements premium). La proximité immédiate de la frontière impose une bonne connaissance des normes techniques transfrontalières (homologations EN, suisses CCH/SIA). La forte tension foncière et la pression démographique génèrent une demande continue de rénovation, transformation et extension. Bativio référence des artisans qualifiés intervenant sur Annemasse, Ambilly, Ville-la-Grand, Étrembières, Gaillard.",
    popularQuartiers: ["Centre-ville", "Mont-Blanc", "Romagny", "Livron", "Helvétie"],
    metiersDemandes: ["plombier", "electricien", "peintre", "macon", "carreleur", "menuisier", "chauffagiste", "platrier", "isolation", "couvreur"],
  },
  {
    slug: "villeurbanne",
    label: "Villeurbanne",
    department: "Rhône",
    introText: "Ville étudiante et résidentielle accolée à Lyon (160 000 habitants, 2e ville du Rhône), Villeurbanne offre un terrain d'intervention vaste et varié : célèbres immeubles Art déco des Gratte-Ciel autour de la place Lazare-Goujon, immeubles de logement collectif des années 50-70 (Bon Coin, Croix-Luizet), maisons de ville avec petits jardins (Cusset, Charpennes), et constructions contemporaines récentes (Carré de Soie). La forte densité étudiante (4 universités à proximité, INSA, CPE Lyon) crée une demande continue de rénovation locative (kitchenettes, peinture, électricité). Les copropriétés des années 60-70 sont en plan massif de rénovation énergétique (réseaux de chaleur urbains à reconvertir, fenêtres simple vitrage à remplacer). Les artisans villeurbannais maîtrisent les contraintes des copropriétés (syndics, votes en AG, calendriers d'intervention serrés). Bativio met en relation les habitants de Villeurbanne avec des plombiers, électriciens, peintres, maçons et carreleurs vérifiés.",
    popularQuartiers: ["Gratte-Ciel", "Charpennes", "Tonkin", "Cusset", "Croix-Luizet"],
    metiersDemandes: ["plombier", "electricien", "peintre", "carreleur", "menuisier", "chauffagiste", "macon", "platrier", "isolation", "vitrier"],
  },
  {
    slug: "echirolles",
    label: "Échirolles",
    department: "Isère",
    introText: "Ville résidentielle de l'agglomération grenobloise (37 000 habitants), Échirolles présente un parc immobilier dominé par les copropriétés des années 60-80 (Village 2 olympique des JO 1968, La Luire, La Ponatière) et les pavillons des années 70 en périphérie. Les artisans échirollois sont fortement sollicités pour les opérations de réhabilitation lourde des grands ensembles (programmes ANRU, isolation thermique extérieure ITE, ravalement de façade), et la rénovation des installations électriques et chauffage des copropriétés vieillissantes. La proximité immédiate du CHU de Grenoble et de l'Université Grenoble Alpes génère également une demande continue d'aménagement de logements étudiants et professionnels de santé. Le climat de cuvette grenobloise (pollution hivernale) renforce l'intérêt pour la VMC double flux et les pompes à chaleur air-eau performantes. Bativio référence des artisans qualifiés intervenant à Échirolles, Eybens, Saint-Martin-d'Hères et Grenoble.",
    popularQuartiers: ["Village 2", "La Luire", "Centre-ville", "Frange Verte"],
    metiersDemandes: ["plombier", "electricien", "peintre", "macon", "carreleur", "menuisier", "chauffagiste", "platrier", "couvreur", "isolation"],
  },
  {
    slug: "romans-sur-isere",
    label: "Romans-sur-Isère",
    department: "Drôme",
    introText: "Capitale historique de la chaussure de luxe (33 000 habitants), Romans-sur-Isère possède un patrimoine architectural distinctif : centre historique médiéval autour de la collégiale Saint-Barnard, anciens ateliers de chaussure réhabilités en logements (Coupe, Massot, Rinaldi), et zones pavillonnaires développées dans les années 80-90. Les artisans romanais sont régulièrement sollicités pour la rénovation des immeubles bourgeois de la fin XIXe siècle (boiseries, parquets, cheminées, vitraux), la transformation de friches industrielles en lofts, et l'entretien des résidences pavillonnaires. La proximité du Vercors et du parc naturel régional génère une clientèle aisée recherchant des prestations qualitatives. Le pôle universitaire de Valence-Romans crée également une demande locative continue. Bativio met en relation des artisans qualifiés intervenant sur Romans-sur-Isère, Bourg-de-Péage, Saint-Marcellin et Tournon-sur-Rhône.",
    popularQuartiers: ["Centre historique", "Saint-Nicolas", "Les Ors", "Plein Ciel"],
    metiersDemandes: ["plombier", "electricien", "peintre", "macon", "carreleur", "menuisier", "chauffagiste", "couvreur", "platrier", "vitrier"],
  },
];

/**
 * Helper : retourne le contenu d'une ville si defini, sinon null.
 */
export function getCityContent(slug: string): CityContent | null {
  return CITY_CONTENTS.find((c) => c.slug === slug) || null;
}
