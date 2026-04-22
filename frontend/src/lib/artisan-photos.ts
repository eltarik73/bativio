/**
 * Fallback visuels artisan : SVG inline (data URI) avec dégradé + icône métier.
 * Remplace les anciennes photos Unsplash (identité générique "template SaaS").
 * Couleurs alignées sur palette Bativio (terre/anthracite/mousse/or).
 */

interface MetierVisual {
  gradient: string;       // 2 stops hex
  icon: string;           // SVG path
  label: string;
}

const METIER_VISUALS: Record<string, MetierVisual> = {
  plombier:     { gradient: "#3B82F6,#1E3A8A", icon: "M12 2a4 4 0 0 0-4 4v6H4v2h4v6a4 4 0 0 0 8 0v-6h4v-2h-4V6a4 4 0 0 0-4-4zm-2 4a2 2 0 1 1 4 0v6h-4V6z", label: "Plombier" },
  electricien:  { gradient: "#F59E0B,#B45309", icon: "M13 2L3 14h7l-1 8 10-12h-7l1-8z", label: "Electricien" },
  peintre:      { gradient: "#EC4899,#9D174D", icon: "M18 2l-8 8-4-4-4 4 4 4 8-8 4-4zm-8 8l-4 4 8 8 4-4-8-8z", label: "Peintre" },
  macon:        { gradient: "#78716C,#44403C", icon: "M3 7h18v2H3V7zm0 4h6v6H3v-6zm8 0h6v6h-6v-6zm8 0h2v6h-2v-6z", label: "Macon" },
  carreleur:    { gradient: "#0EA5E9,#075985", icon: "M3 3h8v8H3V3zm10 0h8v8h-8V3zM3 13h8v8H3v-8zm10 0h8v8h-8v-8z", label: "Carreleur" },
  menuisier:    { gradient: "#A16207,#713F12", icon: "M3 6h18v3H3V6zm0 5h18v3H3v-3zm0 5h18v3H3v-3z", label: "Menuisier" },
  couvreur:     { gradient: "#991B1B,#450A0A", icon: "M3 12L12 3l9 9v9H3v-9zm3 3v4h12v-4l-6-6-6 6z", label: "Couvreur" },
  chauffagiste: { gradient: "#DC2626,#7F1D1D", icon: "M12 2C8 6 6 9 6 13a6 6 0 0 0 12 0c0-4-2-7-6-11zm0 17a4 4 0 0 1-4-4c0-2 1-4 4-7 3 3 4 5 4 7a4 4 0 0 1-4 4z", label: "Chauffagiste" },
  serrurier:    { gradient: "#1F2937,#0F172A", icon: "M12 2a5 5 0 0 0-5 5v3H5v12h14V10h-2V7a5 5 0 0 0-5-5zm-3 5a3 3 0 1 1 6 0v3H9V7zm3 7a2 2 0 1 1 0 4 2 2 0 0 1 0-4z", label: "Serrurier" },
  cuisiniste:   { gradient: "#059669,#064E3B", icon: "M4 4h16v2H4V4zm0 4h16v12H4V8zm2 2v8h12v-8H6zm3 1h6v2H9v-2z", label: "Cuisiniste" },
};

const DEFAULT_METIER: MetierVisual = {
  gradient: "#C4531A,#8B3A12",
  icon: "M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 16.8l-6.2 4.5 2.4-7.4L2 9.4h7.6z",
  label: "Artisan",
};

function buildSvgDataUri(v: MetierVisual, size = 400): string {
  const [c1, c2] = v.gradient.split(",");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}">
<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
<stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/>
</linearGradient></defs>
<rect width="${size}" height="${size}" fill="url(#g)"/>
<g transform="translate(${size * 0.3} ${size * 0.3}) scale(${size * 0.017})" fill="#ffffff" fill-opacity="0.85">
<path d="${v.icon}"/>
</g>
</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function normalizeMetier(s: string): string {
  return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "-");
}

export function getArtisanPhoto(artisan: {
  photos?: { url?: string }[] | null;
  metierNom?: string | null;
  metierSlug?: string | null;
}): string {
  // 1. First real photo from gallery (hors placeholder)
  if (artisan.photos && artisan.photos.length > 0) {
    const first = artisan.photos[0];
    const url = typeof first === "string" ? first : first?.url;
    if (url && !url.includes("placehold")) return url;
  }

  // 2. SVG visual by metier
  const metier = artisan.metierSlug || artisan.metierNom;
  if (metier) {
    const slug = normalizeMetier(metier);
    if (METIER_VISUALS[slug]) return buildSvgDataUri(METIER_VISUALS[slug]);
  }

  // 3. Generic fallback (terre)
  return buildSvgDataUri(DEFAULT_METIER);
}

export const FALLBACK_PHOTO = buildSvgDataUri(DEFAULT_METIER);
