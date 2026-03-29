const DEFAULT_PHOTOS: Record<string, string> = {
  plombier: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&h=400&fit=crop",
  electricien: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=400&h=400&fit=crop",
  peintre: "https://images.unsplash.com/photo-1562259929-b4e1fd3aef09?w=400&h=400&fit=crop",
  macon: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&h=400&fit=crop",
  carreleur: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=400&h=400&fit=crop",
  menuisier: "https://images.unsplash.com/photo-1588854337236-6889d631faa8?w=400&h=400&fit=crop",
  couvreur: "https://images.unsplash.com/photo-1632759145351-1d592919f522?w=400&h=400&fit=crop",
  chauffagiste: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&h=400&fit=crop",
  serrurier: "https://images.unsplash.com/photo-1595341888016-a392ef81b7de?w=400&h=400&fit=crop",
  cuisiniste: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop",
};

const FALLBACK = "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&h=400&fit=crop";

export function getArtisanPhoto(artisan: { photos?: { url?: string }[] | null; metierNom?: string | null; metierSlug?: string | null }): string {
  // 1. First photo from gallery
  if (artisan.photos && artisan.photos.length > 0) {
    const first = artisan.photos[0];
    const url = typeof first === "string" ? first : first?.url;
    if (url && !url.includes("placehold")) return url;
  }

  // 2. Default photo by metier
  const metier = artisan.metierSlug || artisan.metierNom;
  if (metier) {
    const slug = metier.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/\s+/g, "-");
    if (DEFAULT_PHOTOS[slug]) return DEFAULT_PHOTOS[slug];
  }

  // 3. Generic fallback
  return FALLBACK;
}

export { FALLBACK as FALLBACK_PHOTO };
