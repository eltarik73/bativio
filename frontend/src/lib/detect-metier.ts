const KEYWORDS: Record<string, string[]> = {
  carreleur: ["carrelage", "carreau", "faïence", "mosaïque", "joint", "sol carrel"],
  plombier: ["plomberie", "plombier", "robinet", "fuite", "douche", "baignoire", "wc", "toilette", "évier", "lavabo", "chauffe-eau", "tuyau", "sanitaire"],
  electricien: ["électric", "electric", "prise", "tableau", "courant", "interrupteur", "câble", "branchement", "compteur"],
  peintre: ["peinture", "peintre", "peindre", "mur", "badigeon", "enduit", "papier peint", "tapisserie"],
  macon: ["maçon", "macon", "maçonnerie", "fondation", "dalle", "mur porteur", "abattre", "ouverture", "extension", "agrandissement"],
  couvreur: ["toiture", "toit", "tuile", "ardoise", "couvreur", "étanchéité", "zinguerie", "gouttière"],
  menuisier: ["menuisier", "menuiserie", "porte", "fenêtre", "parquet", "escalier", "placard", "dressing", "cuisine sur mesure", "bois"],
  chauffagiste: ["chauffage", "chauffagiste", "radiateur", "chaudière", "climatisation", "clim", "pompe à chaleur", "pac"],
  serrurier: ["serrure", "serrurier", "verrou", "clé", "clef", "porte blindée"],
  cuisiniste: ["cuisine", "cuisiniste", "plan de travail", "îlot"],
};

export function detectMetier(description: string): string | null {
  const text = description.toLowerCase();
  let bestMatch: string | null = null;
  let bestScore = 0;
  for (const [metier, keywords] of Object.entries(KEYWORDS)) {
    const score = keywords.reduce((acc, kw) => acc + (text.includes(kw) ? kw.length : 0), 0);
    if (score > bestScore) {
      bestScore = score;
      bestMatch = metier;
    }
  }
  return bestMatch;
}

export function summarizeProjet(description: string, max: number = 60): string {
  const t = description.trim().replace(/\s+/g, " ");
  return t.length > max ? t.slice(0, max).trim() + "…" : t;
}
