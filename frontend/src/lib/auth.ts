const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";

let accessToken: string | null = null;

export function setAccessToken(token: string | null) {
  accessToken = token;
}

export function getAccessToken() {
  return accessToken;
}

// Restaurer la session au chargement de la page
export async function initAuth(): Promise<boolean> {
  if (typeof window === "undefined") return false;
  const refreshToken = localStorage.getItem("bativio_refresh");
  if (!refreshToken) return false;
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
      return true;
    }
    localStorage.removeItem("bativio_refresh");
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

  if (res.status === 401 && accessToken) {
    const refreshToken = localStorage.getItem("bativio_refresh");
    if (refreshToken) {
      const refreshRes = await fetch(`${API_URL}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });
      const refreshJson = await refreshRes.json();
      if (refreshJson.success) {
        accessToken = refreshJson.data.accessToken;
        localStorage.setItem("bativio_refresh", refreshJson.data.refreshToken);
        headers["Authorization"] = `Bearer ${accessToken}`;
        res = await fetch(`${API_URL}${path}`, { ...options, headers });
      } else {
        logout();
        throw new Error("Session expir\u00e9e");
      }
    }
  }

  const json = await res.json();
  if (!json.success) throw new Error(json.error || "Erreur serveur");
  return json.data;
}

export function logout() {
  accessToken = null;
  localStorage.removeItem("bativio_refresh");
  window.location.href = "/connexion";
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
