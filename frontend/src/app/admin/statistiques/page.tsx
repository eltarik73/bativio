"use client";

/**
 * /admin/statistiques — vraies stats temps reel (pas de mock).
 *
 * Fetch :
 * - /api/v1/admin/stats : KPIs (artisans, inscriptions, devis, revenus,
 *   plans, villes, en-attente)
 * - /api/v1/admin/clicks : tracking clics sortants (CTA partenaires,
 *   appels telephone, vues vitrines)
 *
 * Inclus aussi ClicksOutbound (section live des clics).
 */

import { useEffect, useState } from "react";
import ClicksOutbound from "@/components/admin/ClicksOutbound";
import { authFetch } from "@/lib/auth";

interface AdminStats {
  totalArtisansActif: number;
  totalArtisansAll: number;
  inscriptionsThisMonth: number;
  inscriptionsLastMonth: number;
  inscriptionsDeltaPct: number | null;
  totalDevisThisMonth: number;
  totalDevisLastMonth: number;
  devisDeltaPct: number | null;
  artisansEnAttente: number;
  revenusEstimes: number;
  plans: Record<string, number>;
  villes: Array<{ slug: string; count: number }>;
  generatedAt: string;
}

const C: React.CSSProperties = {
  background: "#fff",
  borderRadius: 14,
  border: "1px solid var(--sable,#E8D5C0)",
  padding: 20,
};

function formatDelta(d: number | null): { label: string; positive: boolean } | null {
  if (d === null) return null;
  if (d === 0) return { label: "= 0%", positive: true };
  return { label: (d > 0 ? "+" : "") + d + "%", positive: d > 0 };
}

const PLAN_COLORS: Record<string, string> = {
  GRATUIT: "#9B9590",
  STARTER: "#22c55e",
  PRO: "#3b82f6",
  BUSINESS: "#8b5cf6",
};

const VILLE_NOMS: Record<string, string> = {
  chambery: "Chambéry",
  annecy: "Annecy",
  grenoble: "Grenoble",
  lyon: "Lyon",
  valence: "Valence",
  autres: "Autres villes",
};

export default function StatistiquesPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const data = await authFetch<AdminStats>("/admin/stats");
        if (active) setStats(data);
      } catch (e) {
        if (active) setError(e instanceof Error ? e.message : String(e));
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, []);

  if (loading) {
    return (
      <div>
        <h1 style={{ fontFamily: "'Fraunces',serif", fontSize: 24, fontWeight: 700, color: "var(--bois,#3D2E1F)", marginBottom: 20 }}>Statistiques</h1>
        <div style={{ ...C, textAlign: "center", color: "#9B9590" }}>Chargement…</div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div>
        <h1 style={{ fontFamily: "'Fraunces',serif", fontSize: 24, fontWeight: 700, color: "var(--bois,#3D2E1F)", marginBottom: 20 }}>Statistiques</h1>
        <div style={{ ...C, color: "#dc2626" }}>Erreur : {error || "données indisponibles"}</div>
      </div>
    );
  }

  const plansArray = Object.entries(stats.plans).map(([plan, count]) => ({ plan, count }));
  const totalPlansCount = plansArray.reduce((s, p) => s + p.count, 0) || 1;
  const totalVillesCount = stats.villes.reduce((s, v) => s + v.count, 0) || 1;

  const kpis = [
    {
      label: "Artisans actifs",
      value: stats.totalArtisansActif.toLocaleString("fr-FR"),
      sub: `${stats.totalArtisansAll} au total (inclus en attente)`,
      color: "var(--bois,#3D2E1F)",
    },
    {
      label: "Inscriptions ce mois",
      value: stats.inscriptionsThisMonth.toLocaleString("fr-FR"),
      sub: `${stats.inscriptionsLastMonth} le mois précédent`,
      color: "#C4531A",
      delta: formatDelta(stats.inscriptionsDeltaPct),
    },
    {
      label: "Devis ce mois",
      value: stats.totalDevisThisMonth.toLocaleString("fr-FR"),
      sub: `${stats.totalDevisLastMonth} le mois précédent`,
      color: "#E8A84C",
      delta: formatDelta(stats.devisDeltaPct),
    },
    {
      label: "Revenus mensuels estimés",
      value: stats.revenusEstimes.toLocaleString("fr-FR") + " €",
      sub: "Somme des plans payants actifs",
      color: "#22c55e",
    },
  ];

  return (
    <div>
      <h1 style={{ fontFamily: "'Fraunces',serif", fontSize: 24, fontWeight: 700, color: "var(--bois,#3D2E1F)", marginBottom: 4 }}>
        Statistiques
      </h1>
      <p style={{ fontSize: 13, color: "var(--pierre,#9C958D)", marginBottom: 20 }}>
        Données temps réel · dernière mise à jour {new Date(stats.generatedAt).toLocaleString("fr-FR", { dateStyle: "short", timeStyle: "short" })}
      </p>

      {/* KPI cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 24 }}>
        {kpis.map((k) => (
          <div key={k.label} style={C}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
              <span style={{ fontFamily: "'Fraunces',serif", fontSize: 26, fontWeight: 800, color: k.color }}>{k.value}</span>
              {k.delta && (
                <span style={{
                  fontSize: 11, fontWeight: 600,
                  color: k.delta.positive ? "#22c55e" : "#dc2626",
                  background: k.delta.positive ? "rgba(34,197,94,.08)" : "rgba(220,38,38,.08)",
                  padding: "2px 8px", borderRadius: 4
                }}>{k.delta.label}</span>
              )}
            </div>
            <p style={{ fontSize: 13, fontWeight: 600, color: "var(--bois,#3D2E1F)" }}>{k.label}</p>
            <p style={{ fontSize: 11, color: "var(--pierre,#9C958D)", marginTop: 4 }}>{k.sub}</p>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {/* Plans réels */}
        <div style={{ background: "#fff", borderRadius: 14, border: "1px solid var(--sable,#E8D5C0)", overflow: "hidden" }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid #EDEBE7" }}>
            <span style={{ fontFamily: "'Fraunces',serif", fontSize: 17, fontWeight: 700, color: "var(--bois,#3D2E1F)" }}>Répartition par plan</span>
            <span style={{ fontSize: 12, color: "#9B9590", marginLeft: 8 }}>({totalPlansCount} actifs)</span>
          </div>
          {plansArray.length === 0 ? (
            <div style={{ padding: 20, fontSize: 13, color: "#9B9590" }}>Aucun artisan actif.</div>
          ) : plansArray.map((p) => {
            const pct = Math.round((p.count / totalPlansCount) * 100);
            const color = PLAN_COLORS[p.plan] || "#9B9590";
            return (
              <div key={p.plan} style={{ padding: "10px 20px", borderBottom: "1px solid #F7F5F2" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
                  <span style={{ width: 10, height: 10, borderRadius: "50%", background: color }} />
                  <span style={{ flex: 1, fontSize: 14, fontWeight: 600, color: "var(--bois,#3D2E1F)" }}>{p.plan}</span>
                  <span style={{ fontSize: 13, color: "var(--bois,#3D2E1F)", fontWeight: 700 }}>{p.count}</span>
                  <span style={{ fontSize: 11, color: "#9B9590", minWidth: 36, textAlign: "right" }}>{pct}%</span>
                </div>
                <div style={{ height: 4, background: "#F7F5F2", borderRadius: 2, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${pct}%`, background: color }} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Villes réelles */}
        <div style={{ background: "#fff", borderRadius: 14, border: "1px solid var(--sable,#E8D5C0)", overflow: "hidden" }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid #EDEBE7" }}>
            <span style={{ fontFamily: "'Fraunces',serif", fontSize: 17, fontWeight: 700, color: "var(--bois,#3D2E1F)" }}>Répartition par ville</span>
            <span style={{ fontSize: 12, color: "#9B9590", marginLeft: 8 }}>({totalVillesCount} actifs)</span>
          </div>
          {stats.villes.length === 0 ? (
            <div style={{ padding: 20, fontSize: 13, color: "#9B9590" }}>Aucun artisan actif.</div>
          ) : stats.villes.map((v, i) => (
            <div key={v.slug} style={{ padding: "12px 20px", borderBottom: "1px solid #F7F5F2", display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ width: 24, height: 24, borderRadius: "50%", background: i < 3 ? "#C4531A" : "#EDEBE7", color: i < 3 ? "#fff" : "#9B9590", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, flexShrink: 0 }}>{i + 1}</span>
              <span style={{ flex: 1, fontSize: 14, fontWeight: 600, color: "var(--bois,#3D2E1F)" }}>{VILLE_NOMS[v.slug] || v.slug}</span>
              <span style={{ fontSize: 13, color: "#C4531A", fontWeight: 600 }}>{v.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Alerte en-attente si > 0 */}
      {stats.artisansEnAttente > 0 && (
        <div style={{ marginTop: 16, padding: "12px 20px", borderRadius: 12, background: "rgba(232,168,76,.08)", border: "1px solid rgba(232,168,76,.3)", color: "#92400E", fontSize: 13 }}>
          <strong>{stats.artisansEnAttente}</strong> artisan{stats.artisansEnAttente > 1 ? "s" : ""} en attente de validation.{" "}
          <a href="/admin/validations" style={{ color: "#92400E", textDecoration: "underline", fontWeight: 600 }}>Voir validations →</a>
        </div>
      )}

      {/* Section live data : clics sortants */}
      <ClicksOutbound />
    </div>
  );
}
