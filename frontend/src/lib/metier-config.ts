export const METIER_COLORS: Record<string, string> = {
  // GROS OEUVRE
  macon: "rgba(125,101,68,.9)",
  couvreur: "rgba(163,68,15,.9)",
  charpentier: "rgba(139,90,43,.9)",
  terrassier: "rgba(120,100,60,.9)",
  demolition: "rgba(100,80,60,.9)",
  // SECOND OEUVRE
  plombier: "rgba(41,128,179,.9)",
  electricien: "rgba(180,140,10,.9)",
  peintre: "rgba(192,57,43,.9)",
  carreleur: "rgba(4,120,87,.9)",
  menuisier: "rgba(107,66,38,.9)",
  chauffagiste: "rgba(185,28,28,.9)",
  platrier: "rgba(150,140,130,.9)",
  solier: "rgba(140,100,70,.9)",
  vitrier: "rgba(70,130,180,.9)",
  isolation: "rgba(60,140,100,.9)",
  // SPECIALITES
  serrurier: "rgba(74,85,104,.9)",
  cuisiniste: "rgba(124,58,237,.9)",
  paysagiste: "rgba(34,139,34,.9)",
  pisciniste: "rgba(0,120,190,.9)",
  domoticien: "rgba(100,80,160,.9)",
  alarme: "rgba(180,60,60,.9)",
  ramoneur: "rgba(80,80,80,.9)",
  // EXTERIEUR
  cloturiste: "rgba(110,90,70,.9)",
  "paysagiste-ext": "rgba(85,130,50,.9)",
  assainissement: "rgba(50,110,140,.9)",
  etancheite: "rgba(60,100,150,.9)",
  // AUTRE
  autre: "rgba(100,100,100,.9)",
};

// Génère un SVG data URI à partir de la couleur + icône du métier (fini les Unsplash génériques).
// Gradient diagonal avec couleur métier + icône blanche centrale.
function buildMetierPhotoSvg(slug: string): string {
  const rgbaColor = METIER_COLORS[slug] || METIER_COLORS.autre;
  // Convert rgba(...) → couleur opaque + variante plus sombre pour gradient
  const m = rgbaColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  const [r, g, b] = m ? [parseInt(m[1]), parseInt(m[2]), parseInt(m[3])] : [60, 60, 60];
  const c1 = `rgb(${r},${g},${b})`;
  const c2 = `rgb(${Math.max(0, r - 40)},${Math.max(0, g - 40)},${Math.max(0, b - 40)})`;
  const iconPaths = METIER_ICONS[slug] || METIER_ICONS.autre;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient></defs><rect width="400" height="400" fill="url(#g)"/><g transform="translate(120 120) scale(6.67)" fill="none" stroke="#ffffff" stroke-opacity="0.95" stroke-width="1.5">${iconPaths}</g></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

// Proxy : lazy-build du data URI à la première lecture (pas de calcul si pas utilisé)
const METIER_PHOTOS_CACHE: Record<string, string> = {};
export const METIER_PHOTOS: Record<string, string> = new Proxy({} as Record<string, string>, {
  get(_, key: string) {
    if (!METIER_PHOTOS_CACHE[key]) {
      METIER_PHOTOS_CACHE[key] = buildMetierPhotoSvg(key);
    }
    return METIER_PHOTOS_CACHE[key];
  },
});

export const METIER_ICONS: Record<string, string> = {
  // GROS OEUVRE
  macon: '<rect x="2" y="14" width="20" height="4" rx="1"/><rect x="4" y="10" width="7" height="4" rx="1"/><rect x="13" y="10" width="7" height="4" rx="1"/>',
  couvreur: '<path d="M3 14l9-8 9 8" stroke-linecap="round" stroke-linejoin="round"/><path d="M5 13v7h14v-7" stroke-linecap="round"/>',
  charpentier: '<path d="M3 21h18M12 3L3 12h4v9h10v-9h4L12 3z" stroke-linejoin="round"/>',
  terrassier: '<path d="M5 20h14M7 16h10l2-4H5l2 4zM9 12V8l3-4 3 4v4" stroke-linecap="round"/>',
  demolition: '<path d="M6 18L18 6M6 6l12 12" stroke-linecap="round"/><rect x="3" y="3" width="18" height="18" rx="2"/>',
  // SECOND OEUVRE
  plombier: '<path d="M4.5 12.5l2-2a2.83 2.83 0 014 0l1 1a2.83 2.83 0 004 0l2-2" stroke-linecap="round"/><path d="M6 19v-4M18 19v-7" stroke-linecap="round"/>',
  electricien: '<path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke-linejoin="round"/>',
  peintre: '<rect x="2" y="3" width="9" height="10" rx="2"/><path d="M6.5 3v10M11 8h3.5M14.5 5h4.5v6h-4.5" stroke-linecap="round"/>',
  carreleur: '<rect x="3" y="3" width="8" height="8" rx="1"/><rect x="13" y="3" width="8" height="8" rx="1"/><rect x="3" y="13" width="8" height="8" rx="1"/><rect x="13" y="13" width="8" height="8" rx="1"/>',
  menuisier: '<rect x="8" y="2" width="8" height="20" rx="1"/><path d="M12 2v20" stroke-linecap="round"/><circle cx="16" cy="12" r="1.5"/>',
  chauffagiste: '<path d="M12 22c-4 0-8-3-8-8 0-6 8-12 8-12s8 6 8 12c0 5-4 8-8 8z" stroke-linejoin="round"/><path d="M12 22c-2 0-3-1.5-3-3 0-3 3-6 3-6s3 3 3 6c0 1.5-1 3-3 3z" stroke-linejoin="round"/>',
  platrier: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 12h18M12 3v18" stroke-linecap="round"/>',
  solier: '<rect x="2" y="14" width="20" height="6" rx="1"/><path d="M2 17h20" stroke-linecap="round"/><path d="M8 14v6M14 14v6" stroke-linecap="round"/>',
  vitrier: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 3l18 18M21 3L3 21" stroke-linecap="round" opacity=".3"/>',
  isolation: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 8h18M3 13h18M3 18h18" stroke-linecap="round" stroke-dasharray="2 2"/>',
  // SPECIALITES
  serrurier: '<circle cx="12" cy="10" r="5"/><path d="M12 15v7M10 18h4" stroke-linecap="round"/>',
  cuisiniste: '<rect x="3" y="4" width="18" height="14" rx="2"/><path d="M3 10h18M8 4v6M16 4v6" stroke-linecap="round"/>',
  paysagiste: '<path d="M12 3c-3 0-6 3-6 7 0 3 2 5 4 6v5h4v-5c2-1 4-3 4-6 0-4-3-7-6-7z" stroke-linejoin="round"/>',
  pisciniste: '<ellipse cx="12" cy="14" rx="9" ry="5"/><path d="M3 14V10c0-2.76 4.03-5 9-5s9 2.24 9 5v4" stroke-linecap="round"/>',
  domoticien: '<rect x="5" y="2" width="14" height="20" rx="3"/><path d="M12 18h0" stroke-linecap="round"/><path d="M9 8h6M9 12h6" stroke-linecap="round"/>',
  alarme: '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/><path d="M12 6v6l4 2" stroke-linecap="round"/>',
  ramoneur: '<path d="M8 21V11M16 21V7M8 11L4 7M8 11h8M16 7l4-4" stroke-linecap="round" stroke-linejoin="round"/>',
  // EXTERIEUR
  cloturiste: '<path d="M4 4v16M10 4v16M16 4v16M22 4v16M2 10h22M2 16h22" stroke-linecap="round"/>',
  "paysagiste-ext": '<path d="M2 20h20M5 20v-6h4v6M11 20v-10h4v10M17 20v-8h4v8" stroke-linecap="round" stroke-linejoin="round"/>',
  assainissement: '<path d="M12 2v6M5 14c0-3.87 3.13-7 7-7s7 3.13 7 7M3 20c0-2.76 4.03-5 9-5s9 2.24 9 5" stroke-linecap="round"/>',
  etancheite: '<path d="M12 2v5M8 7l4 5 4-5M12 12v10" stroke-linecap="round" stroke-linejoin="round"/><path d="M7 18c0-2.76 2.24-5 5-5s5 2.24 5 5" stroke-linecap="round"/>',
  // AUTRE
  autre: '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>',
};
