"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

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

  if (loading)
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}
      >
        <div
          style={{
            width: 32,
            height: 32,
            border: "3px solid #E0DDD8",
            borderTopColor: "#C4531A",
            borderRadius: "50%",
            animation: "spin .6s linear infinite",
          }}
        />
      </div>
    );

  if (!isAuthenticated) return null;
  if (requireAdmin && !isAdmin) return null;

  return <>{children}</>;
}
