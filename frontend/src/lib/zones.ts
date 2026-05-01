// Zones SEO Bativio — extended geographical coverage
// Generated from seo/research/04-communes-quartiers.md (334 zones, INSEE-verified)

export type ZoneType = "intramuros" | "commune-deleguee" | "banlieue" | "agglo" | "bassin";

export interface Zone {
  name: string;
  cp: string;
  insee?: string;
  type: ZoneType;
  pop: number;
  slug: string;
}

export interface VilleZones {
  ville: string;
  villeSlug: string;
  departement: string;
  codeDept: string;
  lat?: number;
  lng?: number;
  zones: Zone[];
}

export const ZONES_SEO: Record<string, VilleZones> = {
  chambery: {
    ville: "Chambéry",
    villeSlug: "chambery",
    departement: "Savoie",
    codeDept: "73",
    lat: 45.5646,
    lng: 5.9178,
    zones: [
      // Quartiers intramuros — non publiés en top-level (collision possible)
      { name: "Centre-Ville / Carré Curial", cp: "73000", type: "intramuros", pop: 6000, slug: "centre-ville" },
      { name: "Vieille Ville / Château", cp: "73000", type: "intramuros", pop: 4000, slug: "vieille-ville" },
      { name: "Les Hauts de Chambéry", cp: "73000", type: "intramuros", pop: 10000, slug: "les-hauts-de-chambery" },
      { name: "Le Biollay", cp: "73000", type: "intramuros", pop: 5000, slug: "le-biollay" },
      { name: "Mérande", cp: "73000", type: "intramuros", pop: 3000, slug: "merande" },
      { name: "Chambéry-le-Vieux", cp: "73000", type: "intramuros", pop: 3500, slug: "chambery-le-vieux" },
      { name: "Bissy", cp: "73000", type: "intramuros", pop: 3000, slug: "bissy" },

      // Banlieue immédiate
      { name: "Cognin", cp: "73160", insee: "73087", type: "banlieue", pop: 6200, slug: "cognin" },
      { name: "Bassens", cp: "73000", insee: "73031", type: "banlieue", pop: 3800, slug: "bassens" },
      { name: "Saint-Alban-Leysse", cp: "73230", insee: "73213", type: "banlieue", pop: 5800, slug: "saint-alban-leysse" },
      { name: "La Motte-Servolex", cp: "73290", insee: "73179", type: "banlieue", pop: 12200, slug: "la-motte-servolex" },
      { name: "Sonnaz", cp: "73000", insee: "73288", type: "banlieue", pop: 2400, slug: "sonnaz" },
      { name: "Voglans", cp: "73420", insee: "73331", type: "banlieue", pop: 1700, slug: "voglans" },
      { name: "Barberaz", cp: "73000", insee: "73027", type: "banlieue", pop: 4700, slug: "barberaz" },
      { name: "Challes-les-Eaux", cp: "73190", insee: "73064", type: "banlieue", pop: 5200, slug: "challes-les-eaux" },
      { name: "Jacob-Bellecombette", cp: "73000", insee: "73137", type: "banlieue", pop: 3800, slug: "jacob-bellecombette" },
      { name: "Vimines", cp: "73160", insee: "73329", type: "banlieue", pop: 2200, slug: "vimines" },
      { name: "La Ravoire", cp: "73490", insee: "73213", type: "banlieue", pop: 8800, slug: "la-ravoire" },

      // Agglo (Aix-les-Bains et bassin)
      { name: "Aix-les-Bains", cp: "73100", insee: "73008", type: "agglo", pop: 30800, slug: "aix-les-bains" },
      { name: "Le Bourget-du-Lac", cp: "73370", insee: "73051", type: "agglo", pop: 5100, slug: "le-bourget-du-lac" },
      { name: "Tresserve", cp: "73100", insee: "73297", type: "agglo", pop: 2900, slug: "tresserve" },
      { name: "Grésy-sur-Aix", cp: "73100", insee: "73128", type: "agglo", pop: 5200, slug: "gresy-sur-aix" },
      { name: "Drumettaz-Clarafond", cp: "73420", insee: "73108", type: "agglo", pop: 2500, slug: "drumettaz-clarafond" },

      // Bassin économique
      { name: "Albertville", cp: "73200", insee: "73011", type: "bassin", pop: 19000, slug: "albertville" },
      { name: "Montmélian", cp: "73800", insee: "73171", type: "bassin", pop: 4000, slug: "montmelian" },
      { name: "Saint-Pierre-d'Albigny", cp: "73250", insee: "73257", type: "bassin", pop: 4000, slug: "saint-pierre-d-albigny" },
      { name: "Le Pont-de-Beauvoisin", cp: "73330", insee: "73199", type: "bassin", pop: 3200, slug: "le-pont-de-beauvoisin" },
      { name: "Yenne", cp: "73170", insee: "73340", type: "bassin", pop: 3000, slug: "yenne" },
      { name: "Saint-Jean-de-Maurienne", cp: "73300", insee: "73248", type: "bassin", pop: 7800, slug: "saint-jean-de-maurienne" },
      { name: "La Bridoire", cp: "73520", insee: "73053", type: "bassin", pop: 800, slug: "la-bridoire" },
    ],
  },

  annecy: {
    ville: "Annecy",
    villeSlug: "annecy",
    departement: "Haute-Savoie",
    codeDept: "74",
    lat: 45.8992,
    lng: 6.1294,
    zones: [
      // Communes déléguées (ex-villes fusionnées en 2017)
      { name: "Annecy-le-Vieux", cp: "74940", type: "commune-deleguee", pop: 21000, slug: "annecy-le-vieux" },
      { name: "Cran-Gevrier", cp: "74960", type: "commune-deleguee", pop: 18000, slug: "cran-gevrier" },
      { name: "Seynod", cp: "74600", type: "commune-deleguee", pop: 20000, slug: "seynod" },
      { name: "Meythet", cp: "74960", type: "commune-deleguee", pop: 8700, slug: "meythet" },
      { name: "Pringy", cp: "74370", type: "commune-deleguee", pop: 3800, slug: "pringy" },

      // Banlieue
      { name: "Argonay", cp: "74370", insee: "74019", type: "banlieue", pop: 3100, slug: "argonay" },
      { name: "Épagny-Metz-Tessy", cp: "74330", insee: "74112", type: "banlieue", pop: 7700, slug: "epagny-metz-tessy" },
      { name: "Poisy", cp: "74330", insee: "74211", type: "banlieue", pop: 8000, slug: "poisy" },
      { name: "Sevrier", cp: "74320", insee: "74272", type: "banlieue", pop: 4200, slug: "sevrier" },
      { name: "Saint-Jorioz", cp: "74410", insee: "74242", type: "banlieue", pop: 6100, slug: "saint-jorioz" },
      { name: "Veyrier-du-Lac", cp: "74290", insee: "74302", type: "banlieue", pop: 2200, slug: "veyrier-du-lac" },
      { name: "Chavanod", cp: "74650", insee: "74067", type: "banlieue", pop: 2500, slug: "chavanod" },

      // Agglo
      { name: "Faverges-Seythenex", cp: "74210", insee: "74123", type: "agglo", pop: 7600, slug: "faverges-seythenex" },
      { name: "Alby-sur-Chéran", cp: "74540", insee: "74002", type: "agglo", pop: 2100, slug: "alby-sur-cheran" },
      { name: "Rumilly", cp: "74150", insee: "74225", type: "agglo", pop: 16000, slug: "rumilly" },
      { name: "Cruseilles", cp: "74350", insee: "74096", type: "agglo", pop: 4700, slug: "cruseilles" },
      { name: "La Roche-sur-Foron", cp: "74800", insee: "74224", type: "agglo", pop: 11700, slug: "la-roche-sur-foron" },
      { name: "Thônes", cp: "74230", insee: "74280", type: "agglo", pop: 6700, slug: "thones" },

      // Bassin
      { name: "Annemasse", cp: "74100", insee: "74012", type: "bassin", pop: 38000, slug: "annemasse" },
      { name: "Saint-Julien-en-Genevois", cp: "74160", insee: "74243", type: "bassin", pop: 14800, slug: "saint-julien-en-genevois" },
      { name: "Bonneville", cp: "74130", insee: "74042", type: "bassin", pop: 13100, slug: "bonneville" },
      { name: "Sallanches", cp: "74700", insee: "74256", type: "bassin", pop: 16800, slug: "sallanches" },
      { name: "Cluses", cp: "74300", insee: "74081", type: "bassin", pop: 17700, slug: "cluses" },
      { name: "Thonon-les-Bains", cp: "74200", insee: "74281", type: "bassin", pop: 36100, slug: "thonon-les-bains" },
      { name: "Évian-les-Bains", cp: "74500", insee: "74119", type: "bassin", pop: 8900, slug: "evian-les-bains" },
    ],
  },

  grenoble: {
    ville: "Grenoble",
    villeSlug: "grenoble",
    departement: "Isère",
    codeDept: "38",
    lat: 45.1885,
    lng: 5.7245,
    zones: [
      // Banlieue immédiate
      { name: "Saint-Martin-d'Hères", cp: "38400", insee: "38421", type: "banlieue", pop: 38800, slug: "saint-martin-d-heres" },
      { name: "Échirolles", cp: "38130", insee: "38151", type: "banlieue", pop: 36700, slug: "echirolles" },
      { name: "Fontaine", cp: "38600", insee: "38169", type: "banlieue", pop: 23200, slug: "fontaine" },
      { name: "Saint-Égrève", cp: "38120", insee: "38382", type: "banlieue", pop: 16700, slug: "saint-egreve" },
      { name: "Meylan", cp: "38240", insee: "38229", type: "banlieue", pop: 17800, slug: "meylan" },
      { name: "Eybens", cp: "38320", insee: "38158", type: "banlieue", pop: 9900, slug: "eybens" },
      { name: "La Tronche", cp: "38700", insee: "38516", type: "banlieue", pop: 7000, slug: "la-tronche" },
      { name: "Seyssins", cp: "38180", insee: "38485", type: "banlieue", pop: 7200, slug: "seyssins" },
      { name: "Seyssinet-Pariset", cp: "38170", insee: "38486", type: "banlieue", pop: 12200, slug: "seyssinet-pariset" },
      { name: "Saint-Martin-le-Vinoux", cp: "38950", insee: "38422", type: "banlieue", pop: 5800, slug: "saint-martin-le-vinoux" },
      { name: "Pont-de-Claix", cp: "38800", insee: "38317", type: "banlieue", pop: 12000, slug: "pont-de-claix" },
      { name: "Sassenage", cp: "38360", insee: "38474", type: "banlieue", pop: 11700, slug: "sassenage" },
      { name: "Gières", cp: "38610", insee: "38179", type: "banlieue", pop: 6700, slug: "gieres" },
      { name: "Corenc", cp: "38700", insee: "38126", type: "banlieue", pop: 4100, slug: "corenc" },

      // Agglo
      { name: "Voiron", cp: "38500", insee: "38563", type: "agglo", pop: 21000, slug: "voiron" },
      { name: "Voreppe", cp: "38340", insee: "38565", type: "agglo", pop: 9700, slug: "voreppe" },
      { name: "Vif", cp: "38450", insee: "38545", type: "agglo", pop: 8400, slug: "vif" },
      { name: "Crolles", cp: "38920", insee: "38140", type: "agglo", pop: 8700, slug: "crolles" },
      { name: "Villard-Bonnot", cp: "38190", insee: "38547", type: "agglo", pop: 7600, slug: "villard-bonnot" },
      { name: "Domène", cp: "38420", insee: "38150", type: "agglo", pop: 6800, slug: "domene" },
      { name: "Vizille", cp: "38220", insee: "38562", type: "agglo", pop: 7700, slug: "vizille" },
      { name: "Saint-Ismier", cp: "38330", insee: "38397", type: "agglo", pop: 7100, slug: "saint-ismier" },
      { name: "Montbonnot-Saint-Martin", cp: "38330", insee: "38249", type: "agglo", pop: 5100, slug: "montbonnot-saint-martin" },
      { name: "Claix", cp: "38640", insee: "38111", type: "agglo", pop: 8200, slug: "claix" },
      { name: "Varces-Allières-et-Risset", cp: "38760", insee: "38524", type: "agglo", pop: 8000, slug: "varces-allieres-et-risset" },
      { name: "Tullins", cp: "38210", insee: "38520", type: "agglo", pop: 7800, slug: "tullins" },
      { name: "Moirans", cp: "38430", insee: "38239", type: "agglo", pop: 8200, slug: "moirans" },
      { name: "Saint-Marcellin", cp: "38160", insee: "38416", type: "agglo", pop: 8400, slug: "saint-marcellin" },

      // Bassin
      { name: "Allevard", cp: "38580", insee: "38006", type: "bassin", pop: 4200, slug: "allevard" },
      { name: "Villard-de-Lans", cp: "38250", insee: "38548", type: "bassin", pop: 4100, slug: "villard-de-lans" },
      { name: "La Mure", cp: "38350", insee: "38269", type: "bassin", pop: 5100, slug: "la-mure" },
      { name: "Bourg-d'Oisans", cp: "38520", insee: "38052", type: "bassin", pop: 3100, slug: "bourg-d-oisans" },
      { name: "Vinay", cp: "38470", insee: "38559", type: "bassin", pop: 4100, slug: "vinay" },
      { name: "Pontcharra", cp: "38530", insee: "38314", type: "bassin", pop: 7200, slug: "pontcharra" },
    ],
  },

  lyon: {
    ville: "Lyon",
    villeSlug: "lyon",
    departement: "Rhône",
    codeDept: "69",
    lat: 45.7640,
    lng: 4.8357,
    zones: [
      // Arrondissements (slug "lyon-Xe" — pas de collision)
      { name: "Lyon 1er", cp: "69001", insee: "69381", type: "intramuros", pop: 28800, slug: "lyon-1er" },
      { name: "Lyon 2e", cp: "69002", insee: "69382", type: "intramuros", pop: 32100, slug: "lyon-2e" },
      { name: "Lyon 3e", cp: "69003", insee: "69383", type: "intramuros", pop: 105100, slug: "lyon-3e" },
      { name: "Lyon 4e", cp: "69004", insee: "69384", type: "intramuros", pop: 36400, slug: "lyon-4e" },
      { name: "Lyon 5e", cp: "69005", insee: "69385", type: "intramuros", pop: 47200, slug: "lyon-5e" },
      { name: "Lyon 6e", cp: "69006", insee: "69386", type: "intramuros", pop: 51100, slug: "lyon-6e" },
      { name: "Lyon 7e", cp: "69007", insee: "69387", type: "intramuros", pop: 87100, slug: "lyon-7e" },
      { name: "Lyon 8e", cp: "69008", insee: "69388", type: "intramuros", pop: 86400, slug: "lyon-8e" },
      { name: "Lyon 9e", cp: "69009", insee: "69389", type: "intramuros", pop: 51800, slug: "lyon-9e" },

      // Métropole 1ère couronne
      { name: "Villeurbanne", cp: "69100", insee: "69266", type: "banlieue", pop: 156800, slug: "villeurbanne" },
      { name: "Caluire-et-Cuire", cp: "69300", insee: "69034", type: "banlieue", pop: 43100, slug: "caluire-et-cuire" },
      { name: "Vénissieux", cp: "69200", insee: "69259", type: "banlieue", pop: 65100, slug: "venissieux" },
      { name: "Vaulx-en-Velin", cp: "69120", insee: "69256", type: "banlieue", pop: 53100, slug: "vaulx-en-velin" },
      { name: "Bron", cp: "69500", insee: "69029", type: "banlieue", pop: 41000, slug: "bron" },
      { name: "Saint-Priest", cp: "69800", insee: "69290", type: "banlieue", pop: 47800, slug: "saint-priest" },
      { name: "Décines-Charpieu", cp: "69150", insee: "69275", type: "banlieue", pop: 28700, slug: "decines-charpieu" },
      { name: "Meyzieu", cp: "69330", insee: "69282", type: "banlieue", pop: 33700, slug: "meyzieu" },
      { name: "Rillieux-la-Pape", cp: "69140", insee: "69286", type: "banlieue", pop: 31200, slug: "rillieux-la-pape" },
      { name: "Tassin-la-Demi-Lune", cp: "69160", insee: "69249", type: "banlieue", pop: 22100, slug: "tassin-la-demi-lune" },
      { name: "Oullins", cp: "69600", insee: "69149", type: "banlieue", pop: 26600, slug: "oullins" },
      { name: "Pierre-Bénite", cp: "69310", insee: "69152", type: "banlieue", pop: 10700, slug: "pierre-benite" },
      { name: "Saint-Fons", cp: "69190", insee: "69199", type: "banlieue", pop: 19200, slug: "saint-fons" },
      { name: "Sainte-Foy-lès-Lyon", cp: "69110", insee: "69202", type: "banlieue", pop: 22400, slug: "sainte-foy-les-lyon" },
      { name: "Francheville", cp: "69340", insee: "69089", type: "banlieue", pop: 13800, slug: "francheville" },
      { name: "Écully", cp: "69130", insee: "69081", type: "banlieue", pop: 18700, slug: "ecully" },
      { name: "Saint-Genis-Laval", cp: "69230", insee: "69204", type: "banlieue", pop: 22000, slug: "saint-genis-laval" },
      { name: "Craponne", cp: "69290", insee: "69069", type: "banlieue", pop: 11600, slug: "craponne" },
      { name: "Chassieu", cp: "69680", insee: "69271", type: "banlieue", pop: 11100, slug: "chassieu" },
      { name: "Genas", cp: "69740", insee: "69277", type: "banlieue", pop: 13100, slug: "genas" },
      { name: "Mions", cp: "69780", insee: "69283", type: "banlieue", pop: 14200, slug: "mions" },
      { name: "Corbas", cp: "69960", insee: "69273", type: "banlieue", pop: 11700, slug: "corbas" },
      { name: "Feyzin", cp: "69320", insee: "69276", type: "banlieue", pop: 10100, slug: "feyzin" },
      { name: "Givors", cp: "69700", insee: "69091", type: "banlieue", pop: 19800, slug: "givors" },
      { name: "Grigny", cp: "69520", insee: "69094", type: "banlieue", pop: 8800, slug: "grigny" },
      { name: "Charbonnières-les-Bains", cp: "69260", insee: "69044", type: "banlieue", pop: 5200, slug: "charbonnieres-les-bains" },
      { name: "Dardilly", cp: "69570", insee: "69072", type: "banlieue", pop: 8900, slug: "dardilly" },
      { name: "Limonest", cp: "69760", insee: "69116", type: "banlieue", pop: 3700, slug: "limonest" },
      { name: "Sathonay-Camp", cp: "69580", insee: "69292", type: "banlieue", pop: 5700, slug: "sathonay-camp" },

      // Bassin
      { name: "Villefranche-sur-Saône", cp: "69400", insee: "69264", type: "bassin", pop: 36700, slug: "villefranche-sur-saone" },
      { name: "Anse", cp: "69480", insee: "69009", type: "bassin", pop: 8400, slug: "anse" },
      { name: "Belleville-en-Beaujolais", cp: "69220", insee: "69019", type: "bassin", pop: 13600, slug: "belleville-en-beaujolais" },
      { name: "Tarare", cp: "69170", insee: "69243", type: "bassin", pop: 11100, slug: "tarare" },
      { name: "L'Isle-d'Abeau", cp: "38080", insee: "38193", type: "bassin", pop: 17200, slug: "l-isle-d-abeau" },
      { name: "Bourgoin-Jallieu", cp: "38300", insee: "38053", type: "bassin", pop: 28800, slug: "bourgoin-jallieu" },
      { name: "Brignais", cp: "69530", insee: "69027", type: "bassin", pop: 12200, slug: "brignais" },
      { name: "Chaponost", cp: "69630", insee: "69043", type: "bassin", pop: 9100, slug: "chaponost" },
      { name: "Mornant", cp: "69440", insee: "69141", type: "bassin", pop: 6200, slug: "mornant" },
    ],
  },

  valence: {
    ville: "Valence",
    villeSlug: "valence",
    departement: "Drôme",
    codeDept: "26",
    lat: 44.9334,
    lng: 4.8924,
    zones: [
      // Banlieue
      { name: "Bourg-lès-Valence", cp: "26500", insee: "26058", type: "banlieue", pop: 19700, slug: "bourg-les-valence" },
      { name: "Bourg-de-Péage", cp: "26300", insee: "26057", type: "banlieue", pop: 10600, slug: "bourg-de-peage" },
      { name: "Portes-lès-Valence", cp: "26800", insee: "26252", type: "banlieue", pop: 10400, slug: "portes-les-valence" },
      { name: "Saint-Marcel-lès-Valence", cp: "26320", insee: "26313", type: "banlieue", pop: 5800, slug: "saint-marcel-les-valence" },
      { name: "Saint-Péray", cp: "07130", insee: "07281", type: "banlieue", pop: 7800, slug: "saint-peray" },
      { name: "Guilherand-Granges", cp: "07500", insee: "07102", type: "banlieue", pop: 11600, slug: "guilherand-granges" },
      { name: "Châteauneuf-sur-Isère", cp: "26300", insee: "26085", type: "banlieue", pop: 3600, slug: "chateauneuf-sur-isere" },
      { name: "Beaumont-lès-Valence", cp: "26760", insee: "26035", type: "banlieue", pop: 4100, slug: "beaumont-les-valence" },
      { name: "Étoile-sur-Rhône", cp: "26800", insee: "26124", type: "banlieue", pop: 5300, slug: "etoile-sur-rhone" },
      { name: "Chabeuil", cp: "26120", insee: "26064", type: "banlieue", pop: 7100, slug: "chabeuil" },
      { name: "Montélier", cp: "26120", insee: "26197", type: "banlieue", pop: 3700, slug: "montelier" },

      // Agglo
      { name: "Romans-sur-Isère", cp: "26100", insee: "26281", type: "agglo", pop: 33700, slug: "romans-sur-isere" },
      { name: "Tain-l'Hermitage", cp: "26600", insee: "26347", type: "agglo", pop: 5700, slug: "tain-l-hermitage" },
      { name: "Tournon-sur-Rhône", cp: "07300", insee: "07324", type: "agglo", pop: 11100, slug: "tournon-sur-rhone" },
      { name: "Privas", cp: "07000", insee: "07186", type: "agglo", pop: 8100, slug: "privas" },
      { name: "Crest", cp: "26400", insee: "26108", type: "agglo", pop: 8100, slug: "crest" },
      { name: "Livron-sur-Drôme", cp: "26250", insee: "26165", type: "agglo", pop: 9100, slug: "livron-sur-drome" },
      { name: "Loriol-sur-Drôme", cp: "26270", insee: "26166", type: "agglo", pop: 6600, slug: "loriol-sur-drome" },

      // Bassin
      { name: "Montélimar", cp: "26200", insee: "26198", type: "bassin", pop: 39800, slug: "montelimar" },
      { name: "Pierrelatte", cp: "26700", insee: "26235", type: "bassin", pop: 13800, slug: "pierrelatte" },
      { name: "Aubenas", cp: "07200", insee: "07019", type: "bassin", pop: 12200, slug: "aubenas" },
      { name: "Annonay", cp: "07100", insee: "07010", type: "bassin", pop: 16100, slug: "annonay" },
      { name: "Die", cp: "26150", insee: "26113", type: "bassin", pop: 4600, slug: "die" },
    ],
  },
};

// ---------------------------------------------------------------------------
// Tier-based publication system
// ---------------------------------------------------------------------------
// Sprint 1 = tier 1 (~25 zones, 200 pages)
// Sprint 2 = tier 2 (~60 zones, 480 pages cumul)
// Sprint 3 = tier 3 (~120 zones, 960 pages cumul)
// Sprint 4 = tier 4 (toutes zones, ~2000 pages cumul)

export function getZoneTier(zone: Zone): 1 | 2 | 3 | 4 | 5 {
  // Tier 5 = quartiers intramuros sans préfixage (collision possible) — pas publié top-level
  if (zone.type === "intramuros" && !zone.slug.startsWith("lyon-")) return 5;
  // Tier 1 = arrondissements Lyon + très grosses banlieues + commune-deleguee Annecy >18k
  if (zone.slug.startsWith("lyon-") && zone.type === "intramuros") return 1;
  if (zone.pop >= 40000) return 1;
  if (zone.type === "commune-deleguee" && zone.pop >= 18000) return 1;
  // Tier 2 = banlieues 15k-40k + agglo principales
  if (zone.pop >= 15000) return 2;
  // Tier 3 = banlieues + agglo 5k-15k
  if (zone.pop >= 5000) return 3;
  // Tier 4 = petites communes <5k
  return 4;
}

// Current publication tier — bump this each sprint to expose more pages.
// Sprint 1 (mai 2026) : tier 1 only = ~25 zones × 8 métiers = ~200 pages.
export const CURRENT_PUBLISH_TIER: 1 | 2 | 3 | 4 = 1;

export interface PublishableZone extends Zone {
  villeMere: string;
  villeMereSlug: string;
  departement: string;
  codeDept: string;
  tier: 1 | 2 | 3 | 4 | 5;
}

export function getAllPublishableZones(maxTier: number = CURRENT_PUBLISH_TIER): PublishableZone[] {
  const result: PublishableZone[] = [];
  for (const v of Object.values(ZONES_SEO)) {
    for (const z of v.zones) {
      const tier = getZoneTier(z);
      if (tier <= maxTier && tier < 5) {
        result.push({
          ...z,
          tier,
          villeMere: v.ville,
          villeMereSlug: v.villeSlug,
          departement: v.departement,
          codeDept: v.codeDept,
        });
      }
    }
  }
  return result;
}

export function findPublishableZone(slug: string): PublishableZone | undefined {
  return getAllPublishableZones(4).find((z) => z.slug === slug);
}

export function getZonesForVille(villeSlug: string): Zone[] {
  return ZONES_SEO[villeSlug]?.zones ?? [];
}

// Slugs réservés pour le routing top-level — ne doivent jamais matcher une zone
export const RESERVED_VILLE_SLUGS = new Set([
  "chambery", "annecy", "grenoble", "lyon", "valence",
]);
