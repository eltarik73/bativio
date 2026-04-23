"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";

function LoadingState({ title, sub }: { title: string; sub: string }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "60vh",
        padding: "40px 24px",
        textAlign: "center",
        gap: 18,
      }}
    >
      <div
        style={{
          width: 36,
          height: 36,
          border: "3px solid #E0DDD8",
          borderTopColor: "#C4531A",
          borderRadius: "50%",
          animation: "spin .6s linear infinite",
        }}
      />
      <div>
        <p style={{ fontFamily: "'Fraunces',serif", fontSize: 18, fontWeight: 600, color: "var(--anthracite,#1C1C1E)", marginBottom: 6 }}>
          {title}
        </p>
        <p style={{ fontSize: 13, color: "var(--pierre,#9C958D)", maxWidth: 420 }}>
          {sub}
        </p>
      </div>
    </div>
  );
}

function ActionState({
  title,
  sub,
  cta,
  requireLogout,
}: {
  title: string;
  sub: string;
  cta: { href: string; label: string };
  requireLogout?: boolean;
}) {
  const handleClick = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!requireLogout) return; // Link classique
    e.preventDefault();
    // Force logout serveur (clear cookie) puis hard navigation
    try {
      await fetch("/api/v1/auth/logout", { method: "POST", credentials: "include" }).catch(() => {});
    } catch {
      // ignore
    }
    // Hard nav pour bypasser le cache Next.js client-side routing + RSC prefetch
    window.location.href = cta.href;
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "60vh",
        padding: "40px 24px",
        textAlign: "center",
        gap: 18,
      }}
    >
      <div style={{ fontSize: 44 }}>🔒</div>
      <div>
        <p style={{ fontFamily: "'Fraunces',serif", fontSize: 22, fontWeight: 600, color: "var(--anthracite,#1C1C1E)", marginBottom: 8 }}>
          {title}
        </p>
        <p style={{ fontSize: 14, color: "var(--bois-mid,#5C4A3A)", maxWidth: 440, lineHeight: 1.55 }}>
          {sub}
        </p>
      </div>
      {/* <a> classique (pas <Link>) pour éviter le prefetch RSC qui peut causer une boucle */}
      <a
        href={cta.href}
        onClick={handleClick}
        style={{ marginTop: 4, padding: "12px 28px", background: "var(--terre,#C4531A)", color: "#fff", borderRadius: 99, fontSize: 14, fontWeight: 600, textDecoration: "none" }}
      >
        {cta.label}
      </a>
    </div>
  );
}

/**
 * ProtectedRoute — plus de router.replace auto (cause des boucles quand middleware
 * redirige /connexion → /dashboard). Affiche un état clair avec bouton à cliquer.
 * Grace period 2.5s pour laisser fetchMe se terminer avant de déclarer "non auth".
 */
export default function ProtectedRoute({
  children,
  requireAdmin = false,
}: {
  children: React.ReactNode;
  requireAdmin?: boolean;
}) {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const [graceElapsed, setGraceElapsed] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setGraceElapsed(true), 2500);
    return () => clearTimeout(t);
  }, []);

  // Pendant le chargement OU pendant la grace period → afficher loading
  if (loading || (!isAuthenticated && !graceElapsed)) {
    return (
      <LoadingState
        title="Chargement de votre espace…"
        sub="On vérifie votre session Bativio."
      />
    );
  }

  if (!isAuthenticated) {
    return (
      <ActionState
        title="Connexion requise"
        sub="Pour accéder à cette page, connectez-vous à votre espace artisan."
        // Route serveur qui clear le cookie (Set-Cookie) puis redirect 303 → bypass cache + Safari
        cta={{ href: "/api/v1/auth/logout?next=/connexion", label: "Se connecter" }}
      />
    );
  }

  if (requireAdmin && !isAdmin) {
    return (
      <ActionState
        title="Accès restreint"
        sub="Cette section est réservée à l'équipe Bativio. Retour au tableau de bord."
        cta={{ href: "/dashboard", label: "Retour dashboard" }}
      />
    );
  }

  return <>{children}</>;
}
