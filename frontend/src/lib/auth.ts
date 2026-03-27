const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";

let accessToken: string | null = null;

export function setAccessToken(token: string | null) {
  accessToken = token;
}

export function getAccessToken() {
  return accessToken;
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
          headers["Authorization"] = `Bearer ${accessToken}`;
          res = await fetch(`${API_URL}${path}`, { ...options, headers });
        } else {
          logout();
          throw new Error("Session expir\u00e9e");
        }
      } catch {
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
  try {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error);
    accessToken = json.data.accessToken;
    localStorage.setItem("bativio_refresh", json.data.refreshToken);
    return json.data;
  } catch (err) {
    // Mode demo : si le backend est indisponible, simuler la connexion
    if (err instanceof TypeError && err.message.includes("fetch")) {
      console.log("[DEMO] Backend indisponible, connexion simul\u00e9e");
      accessToken = "demo-token";
      localStorage.setItem("bativio_refresh", "demo-refresh");
      return { accessToken: "demo-token", refreshToken: "demo-refresh", artisan: { slug: "demo" } };
    }
    throw err;
  }
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
  try {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!json.success) {
      const msg = typeof json.error === "string" ? json.error : "Erreur lors de l'inscription";
      throw new Error(msg);
    }
    accessToken = json.data.accessToken;
    localStorage.setItem("bativio_refresh", json.data.refreshToken);
    return json.data;
  } catch (err) {
    // Mode demo : si le backend est indisponible, simuler l'inscription
    if (err instanceof TypeError) {
      console.log("[DEMO] Backend indisponible, inscription simul\u00e9e pour", data.nomAffichage);
      accessToken = "demo-token";
      localStorage.setItem("bativio_refresh", "demo-refresh");
      localStorage.setItem("bativio_demo_artisan", JSON.stringify(data));
      return { accessToken: "demo-token", refreshToken: "demo-refresh", artisan: { slug: "demo", nomAffichage: data.nomAffichage } };
    }
    throw err;
  }
}

export async function sendMagicLink(email: string) {
  try {
    const res = await fetch(`${API_URL}/auth/magic-link`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error);
    return json.data;
  } catch (err) {
    if (err instanceof TypeError) {
      console.log("[DEMO] Magic link simul\u00e9 pour", email);
      return "ok";
    }
    throw err;
  }
}
