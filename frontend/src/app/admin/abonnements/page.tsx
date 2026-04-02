"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

const C: React.CSSProperties = { background: "#fff", borderRadius: 14, border: "1px solid var(--sable,#E8D5C0)", overflow: "hidden" };

const PLAN_PRICES: Record<string, number> = { GRATUIT: 0, STARTER: 19, ESSENTIEL: 19, PRO: 39, BUSINESS: 59, PRO_PLUS: 59 };
const PLAN_LABELS: Record<string, string> = { GRATUIT: "Gratuit", STARTER: "Starter", ESSENTIEL: "Starter", PRO: "Pro", BUSINESS: "Business", PRO_PLUS: "Business" };

interface ArtisanSub {
  id: string;
  nomAffichage: string;
  plan: string;
  actif: boolean;
  createdAt: string;
}

export default function AbonnementsPage() {
  const { fetchWithAuth } = useAuth();
  const [artisans, setArtisans] = useState<ArtisanSub[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWithAuth("/admin/artisans?size=100")
      .then((data) => {
        const d = data as { artisans?: ArtisanSub[] };
        setArtisans(d.artisans || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [fetchWithAuth]);

  const payants = artisans.filter((a) => a.plan !== "GRATUIT");
  const gratuits = artisans.filter((a) => a.plan === "GRATUIT");
  const mrr = artisans.reduce((s, a) => s + (PLAN_PRICES[a.plan] || 0), 0);

  return (
    <div>
      <h1 style={{ fontFamily: "'Fraunces',serif", fontSize: 24, fontWeight: 700, color: "var(--bois,#3D2E1F)", marginBottom: 20 }}>Abonnements</h1>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginBottom: 24 }}>
        <div style={{ ...C, padding: 20 }}><div style={{ fontFamily: "'Fraunces',serif", fontSize: 28, fontWeight: 800, color: "var(--bois,#3D2E1F)" }}>{mrr}€</div><div style={{ fontSize: 13, color: "var(--pierre,#9C958D)", marginTop: 4 }}>MRR total</div></div>
        <div style={{ ...C, padding: 20 }}><div style={{ fontFamily: "'Fraunces',serif", fontSize: 28, fontWeight: 800, color: "#22c55e" }}>{payants.length}</div><div style={{ fontSize: 13, color: "var(--pierre,#9C958D)", marginTop: 4 }}>Abonnés payants</div></div>
        <div style={{ ...C, padding: 20 }}><div style={{ fontFamily: "'Fraunces',serif", fontSize: 28, fontWeight: 800, color: "#E8A84C" }}>{gratuits.length}</div><div style={{ fontSize: 13, color: "var(--pierre,#9C958D)", marginTop: 4 }}>Plan gratuit</div></div>
      </div>
      <div style={C}>
        {loading ? (
          <div style={{ padding: 32, textAlign: "center", color: "var(--pierre,#9C958D)" }}>Chargement...</div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead><tr style={{ borderBottom: "1px solid var(--sable,#E8D5C0)" }}>
              {["Artisan", "Plan", "Prix", "Statut", "Inscription"].map((h) => <th key={h} style={{ textAlign: "left", padding: "12px 20px", fontSize: 12, fontWeight: 600, color: "var(--pierre,#9C958D)", textTransform: "uppercase" }}>{h}</th>)}
            </tr></thead>
            <tbody>
              {artisans.length === 0 ? (
                <tr><td colSpan={5} style={{ padding: 32, textAlign: "center", color: "var(--pierre,#9C958D)" }}>Aucun artisan inscrit</td></tr>
              ) : artisans.map((a) => {
                const planLabel = PLAN_LABELS[a.plan] || a.plan;
                const prix = PLAN_PRICES[a.plan] || 0;
                const bg = planLabel === "Pro" ? "rgba(196,83,26,.08)" : planLabel === "Business" ? "rgba(61,46,31,.08)" : planLabel === "Starter" ? "rgba(74,103,65,.08)" : "var(--sable-light,#F2EAE0)";
                const color = planLabel === "Pro" ? "var(--terre,#C4531A)" : planLabel === "Business" ? "var(--bois,#3D2E1F)" : planLabel === "Starter" ? "var(--mousse,#4A6741)" : "var(--pierre,#9C958D)";
                return (
                  <tr key={a.id} style={{ borderBottom: "1px solid #F7F5F2" }}>
                    <td style={{ padding: "14px 20px", fontSize: 14, fontWeight: 600, color: "var(--bois,#3D2E1F)" }}>{a.nomAffichage}</td>
                    <td style={{ padding: "14px 20px" }}><span style={{ fontSize: 12, fontWeight: 600, padding: "3px 10px", borderRadius: 6, background: bg, color }}>{planLabel}</span></td>
                    <td style={{ padding: "14px 20px", fontSize: 14, color: "var(--bois,#3D2E1F)", fontWeight: 600 }}>{prix}€{prix > 0 ? "/mois" : ""}</td>
                    <td style={{ padding: "14px 20px" }}><span style={{ fontSize: 12, fontWeight: 600, padding: "3px 10px", borderRadius: 6, background: a.actif ? "rgba(34,197,94,.08)" : "rgba(232,168,76,.08)", color: a.actif ? "#16a34a" : "#E8A84C" }}>{a.actif ? "Actif" : "Inactif"}</span></td>
                    <td style={{ padding: "14px 20px", fontSize: 13, color: "#C5C0B9" }}>{new Date(a.createdAt).toLocaleDateString("fr-FR")}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
