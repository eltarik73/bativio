"use client";

import { useAuth } from "@/context/AuthContext";
import { FeatureGate } from "@/components/FeatureGate";
import type { FeatureKey, PlanType } from "@/lib/plans";

export function DashboardFeatureGate({ feature, children }: { feature: FeatureKey; children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "40vh" }}>
        <div style={{ width: 32, height: 32, border: "3px solid #E5E0DB", borderTopColor: "#C4531A", borderRadius: "50%", animation: "spin .8s linear infinite" }} />
      </div>
    );
  }

  const plan = ((user?.plan as string) || "GRATUIT") as PlanType;

  return (
    <FeatureGate feature={feature} plan={plan}>
      {children}
    </FeatureGate>
  );
}
