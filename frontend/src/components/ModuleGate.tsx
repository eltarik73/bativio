"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import {
  getEffectivePlan,
  hasAccess,
  DASHBOARD_MODULES,
  PLAN_LABELS,
  PLAN_PRICES,
} from "@/lib/plan-gates";

interface Props {
  moduleId: string;
  children: React.ReactNode;
}

export default function ModuleGate({ moduleId, children }: Props) {
  const { user } = useAuth();

  if (!user) return <>{children}</>;

  const effectivePlan = getEffectivePlan({
    plan: (user.plan as string) || "GRATUIT",
    planOverride: (user as Record<string, unknown>).planOverride as string | null,
    planOverrideExpireAt: (user as Record<string, unknown>).planOverrideExpireAt as string | null,
  });

  const mod = DASHBOARD_MODULES[moduleId];
  if (!mod) return <>{children}</>;

  if (hasAccess(effectivePlan, mod.requiredPlan)) {
    return <>{children}</>;
  }

  const planLabel = PLAN_LABELS[mod.requiredPlan];
  const planPrice = PLAN_PRICES[mod.requiredPlan];

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "50vh", padding: 32 }}>
      <div style={{ maxWidth: 440, textAlign: "center" }}>
        <div style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(196,83,26,.08)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
          <svg width="28" height="28" fill="none" stroke="#C4531A" strokeWidth="1.5" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
        </div>
        <h1 style={{ fontFamily: "'Fraunces',serif", fontSize: 22, fontWeight: 700, color: "#3D2E1F", marginBottom: 8 }}>{mod.label}</h1>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 14px", borderRadius: 20, background: "rgba(196,83,26,.06)", color: "#C4531A", fontSize: 13, fontWeight: 600, marginBottom: 16 }}>
          Formule {planLabel} &mdash; {planPrice}&euro;/mois
        </div>
        <p style={{ fontSize: 14, color: "#9C958D", lineHeight: 1.6, marginBottom: 24 }}>
          Passez &agrave; la formule {planLabel} pour acc&eacute;der &agrave; ce module et d&eacute;velopper votre activit&eacute;.
        </p>
        <Link href="/dashboard/abonnement" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 28px", borderRadius: 10, background: "#C4531A", color: "#fff", fontSize: 14, fontWeight: 600, textDecoration: "none" }}>
          D&eacute;couvrir la formule {planLabel}
        </Link>
        <p style={{ fontSize: 12, color: "#C5C0B9", marginTop: 16 }}>Changez de formule &agrave; tout moment, sans engagement.</p>
      </div>
    </div>
  );
}
