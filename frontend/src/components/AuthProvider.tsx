"use client";

import { useEffect, useState, createContext, useContext, useCallback, useRef } from "react";
import { initAuth, getAccessToken, getCachedArtisan, setCachedArtisan, type ArtisanSessionData } from "@/lib/auth";

interface AuthContextType {
  isAuth: boolean;
  loading: boolean;
  artisan: ArtisanSessionData | null;
  setArtisan: (artisan: ArtisanSessionData | null) => void;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  isAuth: false,
  loading: true,
  artisan: null,
  setArtisan: () => {},
  refreshAuth: async () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  // On mount, check if tokens already exist (e.g. set by register/login before
  // a client-side navigation to /dashboard). This avoids the flash where
  // isAuth is false for one render cycle before the useEffect runs.
  const [loading, setLoading] = useState(() => {
    // If we already have an access token and cached artisan in memory
    // (set synchronously by register/login), skip the loading state.
    if (typeof window !== "undefined" && getAccessToken() && getCachedArtisan()) {
      return false;
    }
    return true;
  });
  const [isAuth, setIsAuth] = useState(() => {
    if (typeof window !== "undefined" && getAccessToken() && getCachedArtisan()) {
      return true;
    }
    return false;
  });
  const [artisan, setArtisanState] = useState<ArtisanSessionData | null>(() => {
    if (typeof window !== "undefined" && getAccessToken() && getCachedArtisan()) {
      return getCachedArtisan();
    }
    return null;
  });

  // Track whether initAuth has already resolved to avoid re-running it
  // when refreshAuth is called after login/register.
  const initDone = useRef(false);

  const setArtisan = useCallback((a: ArtisanSessionData | null) => {
    setArtisanState(a);
    setCachedArtisan(a);
    setIsAuth(!!a);
  }, []);

  const refreshAuth = useCallback(async () => {
    // Re-read from the cached module-level variable (set by login/register)
    const cached = getCachedArtisan();
    if (cached && getAccessToken()) {
      setArtisanState(cached);
      setIsAuth(true);
      setLoading(false);
      initDone.current = true;
      return;
    }
    // Otherwise try full init
    try {
      const result = await initAuth();
      if (result) {
        setArtisanState(result);
        setIsAuth(true);
      } else {
        setIsAuth(false);
        setArtisanState(null);
      }
    } catch {
      setIsAuth(false);
      setArtisanState(null);
    }
    setLoading(false);
    initDone.current = true;
  }, []);

  useEffect(() => {
    // If state was already initialized from memory (register/login just
    // happened in this SPA session), skip the async initAuth call.
    if (initDone.current || (getAccessToken() && getCachedArtisan())) {
      initDone.current = true;
      // Ensure state is set even if the lazy initializers ran
      const cached = getCachedArtisan();
      if (cached) {
        setArtisanState(cached);
        setIsAuth(true);
      }
      setLoading(false);
      return;
    }

    initAuth()
      .then((result) => {
        if (result) {
          setArtisanState(result);
          setIsAuth(true);
        } else {
          setIsAuth(false);
          setArtisanState(null);
        }
        setLoading(false);
        initDone.current = true;
      })
      .catch(() => {
        setIsAuth(false);
        setArtisanState(null);
        setLoading(false);
        initDone.current = true;
      });
  }, []);

  return (
    <AuthContext.Provider value={{ isAuth, loading, artisan, setArtisan, refreshAuth }}>
      {children}
    </AuthContext.Provider>
  );
}
