const API_URL = "/api/v1";

let accessToken: string | null = null;

// Artisan data cached in memory for use across components
let cachedArtisan: ArtisanSessionData | null = null;

// Mutex for token refresh: prevents concurrent refresh calls from racing
// When multiple authFetch calls get 401 simultaneously, only one refresh
// request is sent; the others await the same promise.
let refreshPromise: Promise<boolean> | null = null;

export interface ArtisanSessionData {
  id: string;
  email: string;
  role: string;
  nomAffichage: string;
  metierNom: string | null;
  ville: string | null;
  slug: string | null;
  plan: string;
  profilCompletion: number;
  telephone: string | null;
  description: string | null;
  actif: boolean;
  [key: string]: unknown;
}

export function setAccessToken(token: string | null) {
  accessToken = token;
}

export function getAccessToken() {
  return accessToken;
}

export function getCachedArtisan(): ArtisanSessionData | null {
  return cachedArtisan;
}

export function setCachedArtisan(artisan: ArtisanSessionData | null) {
  cachedArtisan = artisan;
  persistUser(artisan);
}

// Restore user data from localStorage (synchronous, for instant hydration)
export function getStoredUser(): ArtisanSessionData | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem("bativio_user");
    if (raw) return JSON.parse(raw) as ArtisanSessionData;
  } catch {
    // corrupted data, ignore
  }
  return null;
}

// Persist user data to localStorage
function persistUser(artisan: ArtisanSessionData | null) {
  if (typeof window === "undefined") return;
  if (artisan) {
    localStorage.setItem("bativio_user", JSON.stringify(artisan));
  } else {
    localStorage.removeItem("bativio_user");
  }
}

// Restaurer la session au chargement de la page
export async function initAuth(): Promise<ArtisanSessionData | null> {
  if (typeof window === "undefined") return null;
  const refreshToken = localStorage.getItem("bativio_refresh");
  if (!refreshToken) {
    // No refresh token — clear any stale user data
    localStorage.removeItem("bativio_user");
    return null;
  }

  // Return stored user data immediately as a starting point
  // (will be updated below after network calls)
  const storedUser = getStoredUser();

  try {
    const res = await fetch(`${API_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });
    const json = await res.json();
    if (json.success) {
      accessToken = json.data.accessToken;
      localStorage.setItem("bativio_refresh", json.data.refreshToken);
      // Fetch artisan profile after token refresh
      try {
        const meRes = await fetch(`${API_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const meJson = await meRes.json();
        if (meJson.success && meJson.data) {
          cachedArtisan = meJson.data as ArtisanSessionData;
          persistUser(cachedArtisan);
          return cachedArtisan;
        }
      } catch {
        // Token is valid but profile fetch failed - use stored data if available
        if (storedUser) {
          cachedArtisan = storedUser;
          return cachedArtisan;
        }
      }
      // Tokens refreshed but no profile data — use stored user or minimal fallback
      if (storedUser) {
        cachedArtisan = storedUser;
        return cachedArtisan;
      }
      return { id: "", email: "", role: "", nomAffichage: "", metierNom: null, ville: null, slug: null, plan: "GRATUIT", profilCompletion: 0, telephone: null, description: null, actif: false } as ArtisanSessionData;
    }
    localStorage.removeItem("bativio_refresh");
    localStorage.removeItem("bativio_user");
    return null;
  } catch {
    // Network error — if we have stored user data AND a refresh token, stay authenticated
    if (storedUser) {
      cachedArtisan = storedUser;
      return cachedArtisan;
    }
    return null;
  }
}

// Perform a single token refresh, deduplicating concurrent calls.
// Returns true if refresh succeeded, false otherwise.
async function doTokenRefresh(): Promise<boolean> {
  const refreshToken = localStorage.getItem("bativio_refresh");
  if (!refreshToken) return false;
  try {
    const refreshRes = await fetch(`${API_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });
    const refreshJson = await refreshRes.json();
    if (refreshJson.success) {
      accessToken = refreshJson.data.accessToken;
      localStorage.setItem("bativio_refresh", refreshJson.data.refreshToken);
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

export async function authFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options?.headers as Record<string, string>),
  };
  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }

  let res = await fetch(`${API_URL}${path}`, { ...options, headers });

  if (res.status === 401) {
    // Try to refresh the token. This handles both cases:
    // 1. accessToken expired (was set but server rejected it)
    // 2. accessToken was null (page refreshed, initAuth hasn't run yet)
    // In both cases, attempt a refresh if we have a refresh token.
    const hasRefreshToken = typeof window !== "undefined" && !!localStorage.getItem("bativio_refresh");
    if (hasRefreshToken) {
      // Deduplicate concurrent refresh calls: if a refresh is already in
      // progress, await the existing promise instead of firing another one.
      if (!refreshPromise) {
        refreshPromise = doTokenRefresh().finally(() => { refreshPromise = null; });
      }
      const refreshed = await refreshPromise;

      if (refreshed) {
        headers["Authorization"] = `Bearer ${accessToken}`;
        res = await fetch(`${API_URL}${path}`, { ...options, headers });
      } else {
        logout();
        throw new Error("Session expir\u00e9e");
      }
    }
  }

  let json;
  try {
    json = await res.json();
  } catch {
    throw new Error(`Erreur serveur (${res.status})`);
  }
  if (!json.success) throw new Error(json.error || "Erreur serveur");
  return json.data;
}

export function logout() {
  accessToken = null;
  cachedArtisan = null;
  if (typeof window !== "undefined") {
    localStorage.removeItem("bativio_refresh");
    localStorage.removeItem("bativio_user");
    window.location.href = "/connexion";
  }
}

export async function login(email: string, password: string) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.error || "Identifiants incorrects");
  accessToken = json.data.accessToken;
  localStorage.setItem("bativio_refresh", json.data.refreshToken);
  if (json.data.artisan) {
    cachedArtisan = json.data.artisan as ArtisanSessionData;
    persistUser(cachedArtisan);
  } else {
    // Artisan data missing from login response (backend may have failed to
    // load it). Fetch it immediately so the dashboard has data on first render.
    try {
      const meRes = await fetch(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const meJson = await meRes.json();
      if (meJson.success && meJson.data) {
        cachedArtisan = meJson.data as ArtisanSessionData;
        persistUser(cachedArtisan);
      }
    } catch {
      // Will be fetched by initAuth on next page load
    }
  }
  return json.data;
}

export async function register(data: {
  email: string;
  password: string;
  siret: string;
  nomAffichage: string;
  telephone: string;
  metierId?: string;
  ville?: string;
  zoneRayonKm?: number;
}) {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!json.success) {
    throw new Error(typeof json.error === "string" ? json.error : "Erreur lors de l'inscription");
  }
  accessToken = json.data.accessToken;
  localStorage.setItem("bativio_refresh", json.data.refreshToken);
  if (json.data.artisan) {
    cachedArtisan = json.data.artisan as ArtisanSessionData;
    persistUser(cachedArtisan);
  }
  return json.data;
}

export async function sendMagicLink(email: string) {
  const res = await fetch(`${API_URL}/auth/magic-link`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.error || "Erreur");
  return json.data;
}
