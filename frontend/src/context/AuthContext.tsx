"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  type ReactNode,
} from "react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";

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

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getStoredTokens() {
  if (typeof window === "undefined") return { token: null, refresh: null };
  return {
    token: localStorage.getItem("bativio_token"),
    refresh: localStorage.getItem("bativio_refresh"),
  };
}

function getStoredUser(): User | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem("bativio_user");
    if (raw) return JSON.parse(raw) as User;
  } catch {
    // corrupted
  }
  return null;
}

function storeSession(accessToken: string, refreshToken: string) {
  localStorage.setItem("bativio_token", accessToken);
  localStorage.setItem("bativio_refresh", refreshToken);
}

function storeUser(user: User) {
  localStorage.setItem("bativio_user", JSON.stringify(user));
}

function clearSession() {
  localStorage.removeItem("bativio_token");
  localStorage.removeItem("bativio_refresh");
  localStorage.removeItem("bativio_user");
}

/** Decode JWT payload without a library. */
function decodeJwtPayload(token: string): { exp?: number } | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const payload = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
}

function isTokenExpired(token: string): boolean {
  const payload = decodeJwtPayload(token);
  if (!payload?.exp) return true;
  return payload.exp * 1000 <= Date.now();
}

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

export function AuthProvider({ children }: { children: ReactNode }) {
  // Initialise state synchronously from localStorage so there is no flash.
  const [user, setUser] = useState<User | null>(() => getStoredUser());
  const [loading, setLoading] = useState(true);

  // Track current access token in a ref so fetchWithAuth always has the latest
  // without causing re-renders.
  const tokenRef = useRef<string | null>(
    typeof window !== "undefined"
      ? localStorage.getItem("bativio_token")
      : null,
  );

  // Mutex for token refresh to prevent concurrent refresh calls.
  const refreshPromiseRef = useRef<Promise<string | null> | null>(null);

  // ------------------------------------------------------------------
  // Token refresh
  // ------------------------------------------------------------------
  const doRefresh = useCallback(async (): Promise<string | null> => {
    const refreshToken = localStorage.getItem("bativio_refresh");
    if (!refreshToken) return null;
    try {
      const res = await fetch(`${API_URL}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });
      const json = await res.json();
      if (json.success) {
        const newAccess: string = json.data.accessToken;
        const newRefresh: string = json.data.refreshToken;
        storeSession(newAccess, newRefresh);
        tokenRef.current = newAccess;
        return newAccess;
      }
      return null;
    } catch {
      return null;
    }
  }, []);

  /** Deduplicated refresh: if a refresh is already in-flight, reuse it. */
  const refreshAccessToken = useCallback(async (): Promise<string | null> => {
    if (!refreshPromiseRef.current) {
      refreshPromiseRef.current = doRefresh().finally(() => {
        refreshPromiseRef.current = null;
      });
    }
    return refreshPromiseRef.current;
  }, [doRefresh]);

  // ------------------------------------------------------------------
  // Fetch user profile
  // ------------------------------------------------------------------
  const fetchMe = useCallback(
    async (accessToken: string): Promise<User | null> => {
      try {
        const res = await fetch(`${API_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const json = await res.json();
        if (json.success && json.data) return json.data as User;
        return null;
      } catch {
        return null;
      }
    },
    [],
  );

  // ------------------------------------------------------------------
  // Init on mount
  // ------------------------------------------------------------------
  useEffect(() => {
    let cancelled = false;

    async function init() {
      const { token, refresh } = getStoredTokens();

      // No refresh token => no session at all
      if (!refresh) {
        clearSession();
        if (!cancelled) {
          setUser(null);
          tokenRef.current = null;
          setLoading(false);
        }
        return;
      }

      let accessToken = token;

      // If access token is missing or expired, attempt refresh
      if (!accessToken || isTokenExpired(accessToken)) {
        accessToken = await refreshAccessToken();
        if (!accessToken) {
          clearSession();
          if (!cancelled) {
            setUser(null);
            tokenRef.current = null;
            setLoading(false);
          }
          return;
        }
      }

      tokenRef.current = accessToken;

      // Fetch fresh user profile
      const freshUser = await fetchMe(accessToken);
      if (!cancelled) {
        if (freshUser) {
          setUser(freshUser);
          storeUser(freshUser);
        } else {
          // Token was valid but /me failed — keep stored user if available
          const stored = getStoredUser();
          if (stored) {
            setUser(stored);
          } else {
            clearSession();
            setUser(null);
            tokenRef.current = null;
          }
        }
        setLoading(false);
      }
    }

    init();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ------------------------------------------------------------------
  // Login
  // ------------------------------------------------------------------
  const login = useCallback(
    async (email: string, password: string): Promise<User> => {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const json = await res.json();
      if (!json.success)
        throw new Error(json.error || "Identifiants incorrects");

      const accessToken: string = json.data.accessToken;
      const refreshToken: string = json.data.refreshToken;
      storeSession(accessToken, refreshToken);
      tokenRef.current = accessToken;

      // Fetch full profile
      let profile: User | null = null;
      if (json.data.artisan) {
        profile = json.data.artisan as User;
      }
      // Always try /me for the freshest data
      const meUser = await fetchMe(accessToken);
      if (meUser) profile = meUser;

      if (!profile) {
        // Build a minimal user from the login response
        profile = {
          id: "",
          email,
          role: json.data.role || "ARTISAN",
          nomAffichage: "",
          plan: "GRATUIT",
          profilCompletion: 0,
          actif: false,
        };
      }

      storeUser(profile);
      setUser(profile);
      setLoading(false);
      return profile;
    },
    [fetchMe],
  );

  // ------------------------------------------------------------------
  // Logout (no redirect — caller handles it)
  // ------------------------------------------------------------------
  const logout = useCallback(() => {
    clearSession();
    tokenRef.current = null;
    setUser(null);
  }, []);

  // ------------------------------------------------------------------
  // Update user (for profile edits etc.)
  // ------------------------------------------------------------------
  const updateUser = useCallback((u: User) => {
    setUser(u);
    storeUser(u);
  }, []);

  // ------------------------------------------------------------------
  // fetchWithAuth
  // ------------------------------------------------------------------
  const fetchWithAuth = useCallback(
    async (path: string, options?: RequestInit): Promise<unknown> => {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        ...(options?.headers as Record<string, string>),
      };

      // Attach current access token
      if (tokenRef.current) {
        headers["Authorization"] = `Bearer ${tokenRef.current}`;
      }

      let res = await fetch(`${API_URL}${path}`, { ...options, headers });

      // On 401, try refreshing the token and retry once
      if (res.status === 401) {
        const newToken = await refreshAccessToken();
        if (newToken) {
          headers["Authorization"] = `Bearer ${newToken}`;
          res = await fetch(`${API_URL}${path}`, { ...options, headers });
        } else {
          // Refresh failed — session is gone
          clearSession();
          tokenRef.current = null;
          setUser(null);
          throw new Error("Session expir\u00e9e");
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
    },
    [refreshAccessToken],
  );

  // ------------------------------------------------------------------
  // Derived state
  // ------------------------------------------------------------------
  const isAuthenticated = !!user;
  const isAdmin = user?.role === "ADMIN";

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated,
        isAdmin,
        login,
        logout,
        updateUser,
        fetchWithAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
