// Default content for Business vitrines when artisan hasn't filled in data

export interface DefaultMetierContent {
  description: string;
  services: Array<{ titre: string; description: string; prix?: string }>;
  heroPhotos: string[]; // Large Unsplash URLs
  galleryPhotos: string[];
  whyChoose: string[];
}

const DEFAULTS: Record<string, DefaultMetierContent> = {
  plombier: {
    description: "Plombier professionnel intervenant pour tous vos travaux de plomberie : d\u00e9pannage urgent, r\u00e9novation de salle de bain, installation de chauffage et chauffe-eau. Un service fiable, rapide et soign\u00e9 pour votre confort au quotidien.",
    services: [
      { titre: "D\u00e9pannage urgent", description: "Fuite d'eau, canalisation bouch\u00e9e, panne de chauffe-eau", prix: "\u00c0 partir de 80\u20ac" },
      { titre: "R\u00e9novation salle de bain", description: "Cr\u00e9ation ou r\u00e9novation compl\u00e8te de votre salle de bain", prix: "Sur devis" },
      { titre: "Installation chauffage", description: "Pose et entretien de syst\u00e8mes de chauffage", prix: "Sur devis" },
      { titre: "Chauffe-eau", description: "Installation, remplacement et entretien", prix: "\u00c0 partir de 350\u20ac" },
    ],
    heroPhotos: [
      "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=1200&h=600&fit=crop",
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=1200&h=600&fit=crop",
    ],
    galleryPhotos: [
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=600&h=400&fit=crop",
    ],
    whyChoose: ["Intervention rapide sous 2h", "Devis gratuit et sans engagement", "Travail soign\u00e9 et garanti"],
  },
  electricien: {
    description: "\u00c9lectricien qualifi\u00e9 pour tous vos travaux d'\u00e9lectricit\u00e9 : mise aux normes, installation de tableau \u00e9lectrique, prises, \u00e9clairage et domotique. S\u00e9curit\u00e9 et conformit\u00e9 assur\u00e9es.",
    services: [
      { titre: "Mise aux normes", description: "Mise en conformit\u00e9 de votre installation \u00e9lectrique", prix: "Sur devis" },
      { titre: "Tableau \u00e9lectrique", description: "Installation ou remplacement de tableau", prix: "\u00c0 partir de 600\u20ac" },
      { titre: "Prises et interrupteurs", description: "Ajout, d\u00e9placement ou remplacement", prix: "\u00c0 partir de 50\u20ac" },
      { titre: "Domotique", description: "Maison connect\u00e9e, volets roulants, \u00e9clairage intelligent", prix: "Sur devis" },
    ],
    heroPhotos: [
      "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=1200&h=600&fit=crop",
    ],
    galleryPhotos: [
      "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1555664424-778a1e5e1b48?w=600&h=400&fit=crop",
    ],
    whyChoose: ["Habilitation \u00e9lectrique \u00e0 jour", "Conformit\u00e9 NF C 15-100", "Intervention propre et rapide"],
  },
  "reparation-mobile": {
    description: "Sp\u00e9cialiste en r\u00e9paration de smartphones et tablettes. \u00c9cran cass\u00e9, batterie us\u00e9e, probl\u00e8me de charge ou bouton d\u00e9fectueux : diagnostic gratuit et r\u00e9paration rapide avec pi\u00e8ces de qualit\u00e9.",
    services: [
      { titre: "R\u00e9paration \u00e9cran", description: "Remplacement d'\u00e9cran LCD/OLED toutes marques", prix: "\u00c0 partir de 59\u20ac" },
      { titre: "Changement batterie", description: "Batterie neuve pour retrouver l'autonomie", prix: "\u00c0 partir de 39\u20ac" },
      { titre: "Connecteur de charge", description: "R\u00e9paration ou remplacement du port de charge", prix: "\u00c0 partir de 45\u20ac" },
      { titre: "Diagnostic gratuit", description: "Analyse compl\u00e8te de votre appareil", prix: "Gratuit" },
      { titre: "D\u00e9blocage & logiciel", description: "D\u00e9blocage, mise \u00e0 jour, r\u00e9cup\u00e9ration de donn\u00e9es", prix: "\u00c0 partir de 29\u20ac" },
    ],
    heroPhotos: [
      "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=1200&h=600&fit=crop",
      "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=1200&h=600&fit=crop",
    ],
    galleryPhotos: [
      "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&h=400&fit=crop",
    ],
    whyChoose: ["Diagnostic gratuit", "R\u00e9paration en 30 min", "Pi\u00e8ces de qualit\u00e9 garanties", "Toutes marques"],
  },
};

// Fallback for unknown metiers
const DEFAULT_FALLBACK: DefaultMetierContent = {
  description: "Artisan professionnel \u00e0 votre service. Travail soign\u00e9, devis gratuit et intervention rapide dans votre secteur.",
  services: [
    { titre: "Devis gratuit", description: "Estimation d\u00e9taill\u00e9e de votre projet", prix: "Gratuit" },
    { titre: "Intervention rapide", description: "Prise en charge dans les meilleurs d\u00e9lais", prix: "Sur devis" },
    { titre: "Travaux sur mesure", description: "Solutions adapt\u00e9es \u00e0 vos besoins", prix: "Sur devis" },
  ],
  heroPhotos: [
    "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&h=600&fit=crop",
  ],
  galleryPhotos: [
    "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1581094288338-2314dddb7ece?w=600&h=400&fit=crop",
  ],
  whyChoose: ["Devis gratuit sous 24h", "Travail soign\u00e9 et garanti", "Artisan de confiance"],
};

export function getDefaultContent(metierSlug: string): DefaultMetierContent {
  // Normalize slug
  const slug = metierSlug.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
  return DEFAULTS[slug] || DEFAULT_FALLBACK;
}
