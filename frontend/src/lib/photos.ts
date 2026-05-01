// Photo de-duplication helpers
//
// Why: a vitrine page typically renders one "hero" photo (large) and a
// "gallery" of N thumbnails. If the same image appears in both — which
// happens when (a) defaults/Unsplash overlap, (b) artisans upload the
// same file twice, or (c) clients submit duplicates — the user sees the
// same photo two or three times on the same screen.
//
// We solve this by extracting a stable "image identity" from each URL
// (Unsplash photo-id, Cloudinary public_id, or URL without query string)
// and deduping/excluding by identity rather than by raw URL string.
// This is robust to size variants like ?w=1200 vs ?w=600 and to
// Cloudinary transformation prefixes like /upload/c_fill,w_800/.

const UNSPLASH_PHOTO_RE = /photo-[a-z0-9-]+/i;
const CLOUDINARY_PUBLIC_ID_RE = /\/upload\/(?:[^/]+\/)*(?:v\d+\/)?([^.?]+)/i;

/**
 * Extract a stable identity from an image URL — robust to size/transform
 * variants. Falls back to the URL without query string.
 */
export function getImageId(url: string): string {
  if (!url) return "";
  // Unsplash: keep only the photo-XXXXX-YYYYY part
  const u = url.match(UNSPLASH_PHOTO_RE);
  if (u) return `unsplash:${u[0]}`;
  // Cloudinary: keep only the public_id (last path segment, no extension/version/transforms)
  if (url.includes("res.cloudinary.com") || url.includes("/cloudinary/")) {
    const c = url.match(CLOUDINARY_PUBLIC_ID_RE);
    if (c?.[1]) return `cloudinary:${c[1].toLowerCase()}`;
  }
  // Generic: URL without query string, lowercased
  return url.split("?")[0].toLowerCase();
}

/**
 * Dedupe a list of image URLs by identity. Preserves order and keeps the
 * first occurrence of each identity. Empty/falsy URLs are dropped.
 */
export function dedupePhotos(urls: Array<string | null | undefined>): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const u of urls) {
    if (!u) continue;
    const id = getImageId(u);
    if (!id || seen.has(id)) continue;
    seen.add(id);
    out.push(u);
  }
  return out;
}

/**
 * Build a gallery list that excludes any image already used in the hero.
 * Accepts a single hero URL or an array of hero URLs (multi-hero carousels).
 * Also dedupes the gallery itself.
 */
export function buildGallery(
  gallery: Array<string | null | undefined>,
  hero: string | Array<string | null | undefined> | null | undefined
): string[] {
  const heroIds = new Set(
    (Array.isArray(hero) ? hero : [hero])
      .filter(Boolean)
      .map((u) => getImageId(u as string))
      .filter(Boolean)
  );
  return dedupePhotos(gallery).filter((u) => !heroIds.has(getImageId(u)));
}

/**
 * Test whether an image URL would be a duplicate of any in `existing`.
 * Useful at upload time to reject duplicate submissions server-side.
 */
export function isDuplicatePhoto(candidate: string, existing: string[]): boolean {
  const id = getImageId(candidate);
  if (!id) return false;
  return existing.some((u) => getImageId(u) === id);
}
