function getBaseUrl() {
  // Client-side: relative URL works
  if (typeof window !== "undefined") return "";
  // Server-side: need absolute URL for internal API calls
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

async function fetchApi<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${getBaseUrl()}/api/v1${path}`, {
    cache: "no-store",
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });
  let json;
  try {
    json = await res.json();
  } catch {
    throw new Error(`Erreur serveur (${res.status})`);
  }
  if (!json.success) {
    throw new Error(json.error || "Erreur serveur");
  }
  return json.data;
}

export interface ArtisanPublic {
  id: string;
  nomAffichage: string;
  slug: string;
  metierNom: string;
  metierSlug: string;
  metierIcone: string;
  ville: string;
  noteMoyenne: number;
  nombreAvis: number;
  description: string;
  telephone: string;
  adresse: string;
  codePostal: string;
  zoneRayonKm: number;
  experienceAnnees: number;
  plan: string;
  planOverride?: string | null;
  planOverrideExpireAt?: string | null;
  badgesNoms: string[];
  services: ServiceData[] | null;
  photos: PhotoData[] | null;
  horaires: HoraireData[] | null;
  zones: string[] | null;
  templateId?: string;
  colorPrimary?: string;
  colorAccent?: string;
  photoLayout?: string;
  seoDescription?: string;
  seoKeywords?: string;
  vitrineConfig?: unknown;
  seoGenerated?: unknown;
  distance?: number;
}

export interface ServiceData {
  id: string;
  titre: string;
  description: string;
  prixIndicatif: string;
  ordre: number;
}

export interface PhotoData {
  id: string;
  url: string;
  titre: string | null;
  type: "SIMPLE" | "AVANT" | "APRES";
  paireId: string | null;
  ordre: number;
}

export interface HoraireData {
  jourSemaine: number;
  ouvert: boolean;
  heureOuverture: string | null;
  heureFermeture: string | null;
}

export interface VilleData {
  id: string;
  nom: string;
  slug: string;
  codePostal: string;
  departement: string;
  contenuSeo: string;
  nombreArtisans: number;
}

export interface MetierData {
  id: string;
  nom: string;
  slug: string;
  icone: string;
  nombreArtisans: number;
}

export interface PageData<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

export async function getArtisans(params?: {
  ville?: string;
  metier?: string;
  page?: number;
  size?: number;
}): Promise<PageData<ArtisanPublic>> {
  const searchParams = new URLSearchParams();
  if (params?.ville) searchParams.set("ville", params.ville);
  if (params?.metier) searchParams.set("metier", params.metier);
  if (params?.page) searchParams.set("page", String(params.page));
  if (params?.size) searchParams.set("size", String(params.size));
  const qs = searchParams.toString();
  return fetchApi(`/public/artisans${qs ? `?${qs}` : ""}`);
}

export async function getArtisan(slug: string): Promise<ArtisanPublic> {
  return fetchApi(`/public/artisans/${slug}`);
}

export async function getVilles(): Promise<VilleData[]> {
  return fetchApi("/public/villes");
}

export async function getVille(slug: string): Promise<VilleData & { artisans: ArtisanPublic[] }> {
  return fetchApi(`/public/villes/${slug}`);
}

export async function getMetiers(): Promise<MetierData[]> {
  return fetchApi("/public/metiers");
}

export async function submitDevis(
  slug: string,
  data: { nomClient: string; telephoneClient: string; emailClient?: string; descriptionBesoin: string; urgence?: string }
): Promise<string> {
  return fetchApi(`/public/artisans/${slug}/devis`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}
