export interface Palette {
  id: string;
  nom: string;
  primary: string;
  accent: string;
}

export interface TemplateConfig {
  id: string;
  nom: string;
  description: string;
}

export const PALETTES: Palette[] = [
  { id: "terre", nom: "Terre", primary: "#C4531A", accent: "#E8A84C" },
  { id: "bleu", nom: "Bleu Pro", primary: "#2563EB", accent: "#60A5FA" },
  { id: "vert", nom: "Vert Nature", primary: "#059669", accent: "#34D399" },
  { id: "anthracite", nom: "Anthracite", primary: "#1C1C1E", accent: "#C4531A" },
  { id: "bordeaux", nom: "Bordeaux", primary: "#881337", accent: "#FDA4AF" },
  { id: "marine", nom: "Marine", primary: "#1E3A5F", accent: "#E8A84C" },
  { id: "bois", nom: "Bois", primary: "#7C5E3C", accent: "#D4A76A" },
  { id: "ardoise", nom: "Ardoise", primary: "#475569", accent: "#94A3B8" },
];

export const TEMPLATES: TemplateConfig[] = [
  { id: "classique", nom: "Classique", description: "Hero plein \u00e9cran + sections verticales" },
  { id: "portfolio", nom: "Portfolio", description: "Split screen + galerie masonry" },
  { id: "moderne", nom: "Moderne", description: "Bento grid + modal devis" },
  { id: "vitrine", nom: "Vitrine", description: "Slider photos + look magazine" },
];

export const PHOTO_LAYOUTS = [
  { id: "grid", nom: "Grille", icon: "\u25A6" },
  { id: "masonry", nom: "Masonry", icon: "\u2593" },
  { id: "slider", nom: "Slider", icon: "\u25B6" },
  { id: "before-after", nom: "Avant/Apr\u00e8s", icon: "\u21C4" },
] as const;

export type PhotoLayoutType = "grid" | "masonry" | "slider" | "before-after";
export type TemplateId = "classique" | "portfolio" | "moderne" | "vitrine";
