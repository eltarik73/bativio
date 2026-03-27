"use client";

import { useEffect, useState, createContext, useContext } from "react";
import { initAuth } from "@/lib/auth";

const AuthContext = createContext<{ isAuth: boolean; loading: boolean }>({ isAuth: false, loading: true });

export function useAuth() {
  return useContext(AuthContext);
}

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    try {
      initAuth()
        .then((ok) => { setIsAuth(ok); setLoading(false); })
        .catch(() => { setIsAuth(false); setLoading(false); });
    } catch {
      setIsAuth(false); setLoading(false);
    }
  }, []);

  return <AuthContext.Provider value={{ isAuth, loading }}>{children}</AuthContext.Provider>;
}
