"use client";

import { useEffect, useState, createContext, useContext, useCallback } from "react";
import { initAuth, getCachedArtisan, setCachedArtisan, type ArtisanSessionData } from "@/lib/auth";

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
  const [loading, setLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);
  const [artisan, setArtisanState] = useState<ArtisanSessionData | null>(null);

  const setArtisan = useCallback((a: ArtisanSessionData | null) => {
    setArtisanState(a);
    setCachedArtisan(a);
    setIsAuth(!!a);
  }, []);

  const refreshAuth = useCallback(async () => {
    // Re-read from the cached module-level variable (set by login/register)
    const cached = getCachedArtisan();
    if (cached) {
      setArtisanState(cached);
      setIsAuth(true);
      setLoading(false);
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
  }, []);

  useEffect(() => {
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
      })
      .catch(() => {
        setIsAuth(false);
        setArtisanState(null);
        setLoading(false);
      });
  }, []);

  return (
    <AuthContext.Provider value={{ isAuth, loading, artisan, setArtisan, refreshAuth }}>
      {children}
    </AuthContext.Provider>
  );
}
