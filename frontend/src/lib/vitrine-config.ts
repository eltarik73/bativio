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
  { id: "classique", nom: "Classique", description: "Hero plein écran + sections verticales" },
  { id: "portfolio", nom: "Portfolio", description: "Split screen + galerie masonry" },
  { id: "moderne", nom: "Moderne", description: "Bento grid + modal devis" },
  { id: "vitrine", nom: "Vitrine", description: "Slider photos + look magazine" },
];

export const PHOTO_LAYOUTS = [
  { id: "grid", nom: "Grille", icon: "▦" },
  { id: "masonry", nom: "Masonry", icon: "▓" },
  { id: "slider", nom: "Slider", icon: "▶" },
  { id: "before-after", nom: "Avant/Après", icon: "⇄" },
] as const;

export type PhotoLayoutType = "grid" | "masonry" | "slider" | "before-after";
export type TemplateId = "classique" | "portfolio" | "moderne" | "vitrine";

/* ── Vitrine sections config (Business) ── */

export interface VitrineConfig {
  sections: Record<string, boolean>;
  ordre: string[];
}

export const VITRINE_SECTIONS = [
  { id: "hero", label: "En-t\u00eate", locked: true },
  { id: "services", label: "Services / Prestations" },
  { id: "photos", label: "R\u00e9alisations / Photos" },
  { id: "description", label: "\u00c0 propos" },
  { id: "avis", label: "Avis clients" },
  { id: "devis", label: "Formulaire de devis", locked: true },
  { id: "horaires", label: "Horaires d'ouverture" },
  { id: "zone", label: "Zone d'intervention" },
  { id: "contact", label: "Coordonn\u00e9es" },
  { id: "faq", label: "FAQ (g\u00e9n\u00e9r\u00e9e par IA)" },
] as const;

export const DEFAULT_VITRINE_CONFIG: VitrineConfig = {
  sections: {
    hero: true,
    services: true,
    photos: true,
    avis: true,
    description: true,
    horaires: true,
    zone: true,
    devis: true,
    contact: true,
    faq: false,
  },
  ordre: ["hero", "services", "photos", "description", "avis", "devis", "horaires", "zone", "contact"],
};

export function getVitrineConfig(raw: unknown): VitrineConfig {
  if (!raw || typeof raw !== "object") return DEFAULT_VITRINE_CONFIG;
  const obj = raw as Record<string, unknown>;
  return {
    sections: { ...DEFAULT_VITRINE_CONFIG.sections, ...(typeof obj.sections === "object" ? obj.sections as Record<string, boolean> : {}) },
    ordre: Array.isArray(obj.ordre) && obj.ordre.length > 0 ? obj.ordre as string[] : DEFAULT_VITRINE_CONFIG.ordre,
  };
}

/* ── SEO Generated type ── */

export interface SeoGenerated {
  title: string;
  metaDescription: string;
  aboutText: string;
  faq: Array<{ question: string; answer: string }>;
  keywords: string[];
}
