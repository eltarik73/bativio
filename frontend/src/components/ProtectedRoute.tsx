"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

function FullscreenState({ title, sub, cta }: { title: string; sub: string; cta?: { href: string; label: string } }) {
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
      {cta && (
        <Link href={cta.href} style={{ marginTop: 8, padding: "10px 22px", background: "var(--terre,#C4531A)", color: "#fff", borderRadius: 99, fontSize: 13, fontWeight: 600, textDecoration: "none" }}>
          {cta.label}
        </Link>
      )}
    </div>
  );
}

export default function ProtectedRoute({
  children,
  requireAdmin = false,
}: {
  children: React.ReactNode;
  requireAdmin?: boolean;
}) {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) router.replace("/connexion");
      else if (requireAdmin && !isAdmin) router.replace("/dashboard");
    }
  }, [loading, isAuthenticated, isAdmin, requireAdmin, router]);

  if (loading) {
    return (
      <FullscreenState
        title="Chargement de votre espace…"
        sub="On vérifie votre session Bativio."
      />
    );
  }

  if (!isAuthenticated) {
    return (
      <FullscreenState
        title="Session expirée"
        sub="Votre session a expiré. Reconnectez-vous pour accéder à votre espace."
        cta={{ href: "/connexion", label: "Se connecter" }}
      />
    );
  }

  if (requireAdmin && !isAdmin) {
    return (
      <FullscreenState
        title="Accès restreint"
        sub="Cette page est réservée à l'équipe Bativio. Retour au tableau de bord."
        cta={{ href: "/dashboard", label: "Retour dashboard" }}
      />
    );
  }

  return <>{children}</>;
}
