"use client";

import { hasFeature, getRequiredPlan, PLAN_LABELS, PLAN_PRICES, FEATURE_LABELS } from "@/lib/plans";
import type { PlanType, FeatureKey } from "@/lib/plans";
import Link from "next/link";

interface FeatureGateProps {
  feature: FeatureKey;
  plan: PlanType;
  children: React.ReactNode;
  preview?: React.ReactNode;
}

export function FeatureGate({ feature, plan, children, preview }: FeatureGateProps) {
  if (hasFeature(plan, feature)) return <>{children}</>;

  const requiredPlan = getRequiredPlan(feature);
  const requiredLabel = PLAN_LABELS[requiredPlan];
  const requiredPrice = PLAN_PRICES[requiredPlan];
  const featureLabel = FEATURE_LABELS[feature];

  return (
    <div style={{ position: "relative" }}>
      {preview && (
        <div style={{ opacity: 0.15, filter: "blur(3px)", pointerEvents: "none", userSelect: "none" }}>{preview}</div>
      )}
      <div style={preview ? { position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" } : {}}>
        <div style={{ background: "#fff", border: "1px solid #E5E0DB", borderRadius: 16, padding: 32, maxWidth: 420, margin: "0 auto", textAlign: "center", boxShadow: "0 2px 12px rgba(0,0,0,.04)" }}>
          <div style={{ width: 48, height: 48, borderRadius: "50%", background: "rgba(196,83,26,.08)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C4531A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <h3 style={{ fontFamily: "'Fraunces',serif", fontSize: 18, fontWeight: 700, color: "#1C1C1E", marginBottom: 8 }}>{featureLabel}</h3>
          <p style={{ fontSize: 14, color: "#6B6560", marginBottom: 24, lineHeight: 1.5 }}>
            Cette fonctionnalité est disponible à partir du plan {requiredLabel} à {requiredPrice}€/mois.
          </p>
          <Link href="/dashboard/parametres" style={{ display: "inline-block", background: "#C4531A", color: "#fff", padding: "12px 24px", borderRadius: 12, fontSize: 14, fontWeight: 600, textDecoration: "none" }}>
            Passer à {requiredLabel} — {requiredPrice}€/mois
          </Link>
          <Link href="/tarifs" style={{ display: "block", marginTop: 12, fontSize: 13, color: "#9B9590", textDecoration: "none" }}>
            Voir tous les plans
          </Link>
        </div>
      </div>
    </div>
  );
}
