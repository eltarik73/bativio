"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";

export interface User {
  id: string;
  email: string;
  role: string;
  nomAffichage: string;
  metierNom?: string | null;
  ville?: string | null;
  slug?: string | null;
  plan: string;
  profilCompletion: number;
  telephone?: string | null;
  description?: string | null;
  actif: boolean;
  [key: string]: unknown;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<User>;
  logout: () => void;
  updateUser: (user: User) => void;
  fetchWithAuth: (path: string, options?: RequestInit) => Promise<unknown>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch current user from session cookie
  const fetchMe = useCallback(async (): Promise<User | null> => {
    try {
      const res = await fetch("/api/v1/auth/me", { credentials: "include" });
      const json = await res.json();
      if (json.success && json.data) return json.data as User;
      return null;
    } catch {
      return null;
    }
  }, []);

  // Init on mount — skip /auth/me si visiteur anonyme (signal cookie compagnon)
  // Le JWT lui-même reste HttpOnly (sécurité). Le cookie "bativio-logged" non-HttpOnly
  // est posé en parallèle au login uniquement comme signal client.
  // → Évite -1 requête /auth/me par visiteur public, sans casser l'auth post-login.
  useEffect(() => {
    let cancelled = false;
    const hasLoggedCookie = typeof document !== "undefined" &&
      document.cookie.split(";").some((c) => c.trim().startsWith("bativio-logged="));
    if (!hasLoggedCookie) {
      setUser(null);
      setLoading(false);
      return;
    }
    fetchMe().then((u) => {
      if (!cancelled) {
        setUser(u);
        setLoading(false);
      }
    });
    return () => { cancelled = true; };
  }, [fetchMe]);

  // Login
  const login = useCallback(async (email: string, password: string): Promise<User> => {
    const res = await fetch("/api/v1/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error || "Identifiants incorrects");

    // Cookie is set server-side. Fetch fresh profile.
    const profile = await fetchMe();
    if (profile) {
      setUser(profile);
      setLoading(false);
      return profile;
    }

    // Fallback from login response
    const u: User = {
      id: json.data.id || "",
      email: json.data.email || email,
      role: json.data.role || "ARTISAN",
      nomAffichage: json.data.nomAffichage || json.data.nom || "",
      plan: json.data.plan || "GRATUIT",
      profilCompletion: json.data.profilCompletion || 0,
      actif: json.data.actif ?? false,
    };
    setUser(u);
    setLoading(false);
    return u;
  }, [fetchMe]);

  // Logout
  const logout = useCallback(async () => {
    await fetch("/api/v1/auth/logout", { method: "POST", credentials: "include" }).catch(() => {});
    setUser(null);
    // Clear any legacy localStorage
    if (typeof window !== "undefined") {
      localStorage.removeItem("bativio_token");
      localStorage.removeItem("bativio_refresh");
      localStorage.removeItem("bativio_user");
    }
  }, []);

  // Update user locally
  const updateUser = useCallback((u: User) => {
    setUser(u);
  }, []);

  // Authenticated fetch — cookies are automatic, no Authorization header needed
  const fetchWithAuth = useCallback(async (path: string, options?: RequestInit): Promise<unknown> => {
    const headers: Record<string, string> = {
      ...(options?.headers as Record<string, string>),
    };
    // Only set Content-Type for JSON bodies (not for FormData/multipart)
    if (!(options?.body instanceof FormData)) {
      headers["Content-Type"] = headers["Content-Type"] || "application/json";
    }

    const res = await fetch(`/api/v1${path}`, {
      ...options,
      headers,
      credentials: "include",
    });

    if (res.status === 401) {
      // Try to refresh session by re-calling /auth/me
      try {
        const meRes = await fetch("/api/v1/auth/me", { credentials: "include" });
        if (meRes.ok) {
          const meData = await meRes.json();
          if (meData.success && meData.data) {
            setUser(meData.data);
            // Retry the original request
            const retryRes = await fetch(`/api/v1${path}`, { ...options, headers, credentials: "include" });
            if (retryRes.ok) {
              const retryJson = await retryRes.json();
              if (retryJson.success) return retryJson.data;
            }
          }
        }
      } catch { /* ignore */ }
      // Session truly expired
      setUser(null);
      if (typeof window !== "undefined" && !path.includes("/auth/")) {
        window.location.href = "/connexion?expired=true";
      }
      throw new Error("Session expirée");
    }

    let json;
    try {
      json = await res.json();
    } catch {
      throw new Error(`Erreur serveur (${res.status})`);
    }
    if (!json.success) throw new Error(json.error || "Erreur serveur");
    return json.data;
  }, []);

  const isAuthenticated = !!user;
  const isAdmin = user?.role === "ADMIN";

  return (
    <AuthContext.Provider
      value={{ user, loading, isAuthenticated, isAdmin, login, logout, updateUser, fetchWithAuth }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
