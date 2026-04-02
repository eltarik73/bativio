import { type NextRequest } from "next/server";
import { apiSuccess, apiError } from "@/lib/api-response";

interface GeoCommune {
  nom: string;
  code: string;
  codesPostaux: string[];
  departement?: { nom: string; code: string };
  region?: { nom: string };
  population?: number;
  centre?: { type: string; coordinates: [number, number] };
  _score?: number;
}

interface CommuneNormalized {
  nom: string;
  codeInsee: string;
  codesPostaux: string[];
  departement: string;
  codeDepartement: string;
  region: string;
  population: number;
  latitude: number | null;
  longitude: number | null;
  slug: string;
}

function slugify(str: string): string {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function normalize(c: GeoCommune): CommuneNormalized {
  // geo.api.gouv.fr returns coordinates as [longitude, latitude] (GeoJSON order)
  const lon = c.centre?.coordinates?.[0] ?? null;
  const lat = c.centre?.coordinates?.[1] ?? null;

  return {
    nom: c.nom,
    codeInsee: c.code,
    codesPostaux: c.codesPostaux || [],
    departement: c.departement?.nom || "",
    codeDepartement: c.departement?.code || "",
    region: c.region?.nom || "",
    population: c.population || 0,
    latitude: lat,
    longitude: lon,
    slug: slugify(c.nom),
  };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const nom = searchParams.get("nom");
    const codePostal = searchParams.get("codePostal");
    const lat = searchParams.get("lat");
    const lon = searchParams.get("lon");
    const limit = parseInt(searchParams.get("limit") || "7", 10);

    const fields =
      "nom,code,codesPostaux,departement,region,population,centre";

    let url: string;

    if (lat && lon) {
      // Reverse geocoding
      url = `https://geo.api.gouv.fr/communes?lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}&fields=${fields}&limit=${limit}`;
    } else if (codePostal) {
      url = `https://geo.api.gouv.fr/communes?codePostal=${encodeURIComponent(codePostal)}&fields=${fields}&limit=${limit}`;
    } else if (nom) {
      url = `https://geo.api.gouv.fr/communes?nom=${encodeURIComponent(nom)}&fields=${fields}&boost=population&limit=${limit}`;
    } else {
      return apiError("Paramètre requis : nom, codePostal, ou lat+lon", 400);
    }

    const res = await fetch(url, {
      next: { revalidate: 86400 }, // cache 24h
    });

    if (!res.ok) {
      return apiError("Erreur lors de la requête geo.api.gouv.fr", 502);
    }

    const data: GeoCommune[] = await res.json();
    const communes = data.map(normalize);

    return apiSuccess(communes);
  } catch (error) {
    console.error("GET /api/v1/public/geo/communes error:", error);
    return apiError("Erreur interne du serveur", 500);
  }
}
