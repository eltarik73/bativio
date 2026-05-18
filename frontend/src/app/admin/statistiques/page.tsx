"use client";

/**
 * /admin/statistiques — refonte orientee LEADS (18/05/2026, v2).
 *
 * Objectif : Tarik voit a qui Bativio genere le plus de leads, pour piloter
 * la promotion Pro/Business et reperer les artisans payants a risque.
 *
 * Fetch :
 * - /api/v1/admin/stats : KPIs globaux (artisans, inscriptions, devis, revenus, plans, villes)
 * - /api/v1/admin/leads-stats : NOUVEAU - par-artisan (vues, appels, demandes, score)
 * - ClicksOutbound : section debug en bas (tracking detaille)
 *
 * Sections :
 * 1. KPI cards (4)
 * 2. Artisans payants a risque (bandeau alerte)
 * 3. Top artisans par leads (table)
 * 4. Conversion par plan (table compacte)
 * 5. Funnel acquisition (3 barres)
 * 6. Repartition par ville (existant)
 * 7. Tracking detaille (debug)
 */

import { useEffect, useMemo, useState } from "react";
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

interface ArtisanLead {
  artisanId: string;
  slug: string;
  nomAffichage: string;
  plan: string;
  ville: string | null;
  metier: string | null;
  vues: number;
  appels: number;
  demandes: number;
  reponses: number;
  totalLeads: number;
  conversionRate: number;
  responseRate: number;
  leadScore: number;
}

interface PlanRow {
  plan: string;
  nbArtisans: number;
  vues: number;
  appels: number;
  demandes: number;
  reponses: number;
  leadsParArtisan: number;
  conversionRate: number;
}

interface AtRisqueRow {
  artisanId: string;
  slug: string;
  nomAffichage: string;
  plan: string;
  ville: string | null;
  metier: string | null;
  vues: number;
}

interface FunnelData {
  totalVues: number;
  totalAppels: number;
  totalDemandes: number;
  totalReponses: number;
  viewToCallRate: number;
  viewToDemandeRate: number;
  demandeToReponseRate: number;
}

interface LeadsStats {
  period: string;
  generatedAt: string;
  artisansByLeads: ArtisanLead[];
  planSummary: PlanRow[];
  villeFunnel: Array<{ ville: string; vues: number; demandes: number; conversionRate: number }>;
  metierFunnel: Array<{ metier: string; vues: number; demandes: number; conversionRate: number }>;
  funnel: FunnelData;
  atRisque: AtRisqueRow[];
  topPages: Array<{ sourcePage: string; vues: number }>;
}

type Period = "7d" | "30d" | "90d";

const C: React.CSSProperties = {
  background: "#fff",
  borderRadius: 14,
  border: "1px solid var(--sable,#E8D5C0)",
  padding: 20,
};

const CardNoPad: React.CSSProperties = {
  background: "#fff",
  borderRadius: 14,
  border: "1px solid var(--sable,#E8D5C0)",
  overflow: "hidden",
};

const PLAN_COLORS: Record<string, string> = {
  GRATUIT: "#9B9590",
  STARTER: "#22c55e",
  ESSENTIEL: "#22c55e",
  PRO: "#3b82f6",
  PRO_PLUS: "#3b82f6",
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

function formatDelta(d: number | null): { label: string; positive: boolean } | null {
  if (d === null) return null;
  if (d === 0) return { label: "= 0%", positive: true };
  return { label: (d > 0 ? "+" : "") + d + "%", positive: d > 0 };
}

function PlanPill({ plan }: { plan: string }) {
  const color = PLAN_COLORS[plan] || "#9B9590";
  return (
    <span style={{
      display: "inline-block",
      padding: "2px 8px",
      borderRadius: 4,
      fontSize: 10,
      fontWeight: 700,
      letterSpacing: 0.3,
      color: "#fff",
      background: color,
    }}>{plan}</span>
  );
}

export default function StatistiquesPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [leads, setLeads] = useState<LeadsStats | null>(null);
  const [period, setPeriod] = useState<Period>("30d");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    Promise.all([
      authFetch<AdminStats>("/admin/stats"),
      authFetch<LeadsStats>(`/admin/leads-stats?since=${period}`),
    ])
      .then(([s, l]) => {
        if (!active) return;
        setStats(s);
        setLeads(l);
      })
      .catch((e) => {
        if (active) setError(e instanceof Error ? e.message : String(e));
      })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [period]);

  const totalVillesCount = useMemo(() => {
    if (!stats) return 1;
    return stats.villes.reduce((s, v) => s + v.count, 0) || 1;
  }, [stats]);

  if (loading) {
    return (
      <div>
        <h1 style={{ fontFamily: "'Fraunces',serif", fontSize: 24, fontWeight: 700, color: "var(--bois,#3D2E1F)", marginBottom: 20 }}>Statistiques</h1>
        <div style={{ ...C, textAlign: "center", color: "#9B9590" }}>Chargement…</div>
      </div>
    );
  }

  if (error || !stats || !leads) {
    return (
      <div>
        <h1 style={{ fontFamily: "'Fraunces',serif", fontSize: 24, fontWeight: 700, color: "var(--bois,#3D2E1F)", marginBottom: 20 }}>Statistiques</h1>
        <div style={{ ...C, color: "#dc2626" }}>Erreur : {error || "données indisponibles"}</div>
      </div>
    );
  }

  const kpis = [
    {
      label: "Artisans actifs",
      value: stats.totalArtisansActif.toLocaleString("fr-FR"),
      sub: `${stats.totalArtisansAll} au total`,
      color: "var(--bois,#3D2E1F)",
    },
    {
      label: "Leads " + (period === "7d" ? "7j" : period === "30d" ? "30j" : "90j"),
      value: (leads.funnel.totalAppels + leads.funnel.totalDemandes).toLocaleString("fr-FR"),
      sub: `${leads.funnel.totalAppels} appels · ${leads.funnel.totalDemandes} demandes`,
      color: "#C4531A",
    },
    {
      label: "Vues vitrines",
      value: leads.funnel.totalVues.toLocaleString("fr-FR"),
      sub: leads.funnel.viewToDemandeRate + "% conversion en demande",
      color: "#E8A84C",
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
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4, flexWrap: "wrap", gap: 12 }}>
        <h1 style={{ fontFamily: "'Fraunces',serif", fontSize: 24, fontWeight: 700, color: "var(--bois,#3D2E1F)" }}>
          Statistiques
        </h1>
        {/* Period selector */}
        <div style={{ display: "inline-flex", border: "1px solid var(--sable,#E8D5C0)", borderRadius: 8, background: "#fff", overflow: "hidden" }}>
          {(["7d", "30d", "90d"] as Period[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              style={{
                padding: "6px 14px",
                fontSize: 12,
                fontWeight: 600,
                border: "none",
                cursor: "pointer",
                color: period === p ? "#fff" : "var(--bois,#3D2E1F)",
                background: period === p ? "var(--terre,#C4531A)" : "transparent",
                transition: "all .15s",
              }}
            >
              {p === "7d" ? "7 jours" : p === "30d" ? "30 jours" : "90 jours"}
            </button>
          ))}
        </div>
      </div>
      <p style={{ fontSize: 13, color: "var(--pierre,#9C958D)", marginBottom: 20 }}>
        Données temps réel · MAJ {new Date(leads.generatedAt).toLocaleString("fr-FR", { dateStyle: "short", timeStyle: "short" })}
      </p>

      {/* --- KPIs --- */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 24 }}>
        {kpis.map((k) => (
          <div key={k.label} style={C}>
            <span style={{ display: "block", fontFamily: "'Fraunces',serif", fontSize: 26, fontWeight: 800, color: k.color, marginBottom: 6 }}>{k.value}</span>
            <p style={{ fontSize: 13, fontWeight: 600, color: "var(--bois,#3D2E1F)" }}>{k.label}</p>
            <p style={{ fontSize: 11, color: "var(--pierre,#9C958D)", marginTop: 4 }}>{k.sub}</p>
          </div>
        ))}
      </div>

      {/* --- Bandeau alerte artisans a risque --- */}
      {leads.atRisque.length > 0 && (
        <div style={{
          marginBottom: 20,
          padding: "14px 20px",
          borderRadius: 12,
          background: "rgba(220,38,38,.06)",
          border: "1px solid rgba(220,38,38,.25)",
          color: "#991B1B",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
            <span style={{ fontFamily: "'Fraunces',serif", fontSize: 16, fontWeight: 700 }}>
              {leads.atRisque.length} artisan{leads.atRisque.length > 1 ? "s" : ""} payant{leads.atRisque.length > 1 ? "s" : ""} sans lead sur {period === "7d" ? "7j" : period === "30d" ? "30j" : "90j"}
            </span>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {leads.atRisque.map((a) => (
              <div key={a.artisanId} style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                padding: "5px 10px", background: "#fff",
                borderRadius: 8, border: "1px solid rgba(220,38,38,.2)",
                fontSize: 12,
              }}>
                <PlanPill plan={a.plan} />
                <span style={{ fontWeight: 600, color: "var(--bois,#3D2E1F)" }}>{a.nomAffichage}</span>
                {a.ville && <span style={{ color: "#9B9590" }}>· {a.ville}</span>}
                <span style={{ color: "#9B9590" }}>· {a.vues} vues</span>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 12, marginTop: 8, color: "#7F1D1D" }}>
            Appeler ces artisans avant qu&apos;ils ne résilient. Vérifier visibilité fiche, photos, prix.
          </p>
        </div>
      )}

      {/* --- Top artisans par leads --- */}
      <div style={{ ...CardNoPad, marginBottom: 16 }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid #EDEBE7", display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <span style={{ fontFamily: "'Fraunces',serif", fontSize: 17, fontWeight: 700, color: "var(--bois,#3D2E1F)" }}>
            Top artisans par leads
          </span>
          <span style={{ fontSize: 11, color: "#9B9590" }}>
            {leads.artisansByLeads.length} artisans · tri par leads totaux
          </span>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 760 }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #EDEBE7", background: "#FAF8F5" }}>
                <th style={{ textAlign: "left", padding: "10px 14px", fontSize: 11, fontWeight: 600, color: "#9B9590", textTransform: "uppercase", letterSpacing: 0.5 }}>#</th>
                <th style={{ textAlign: "left", padding: "10px 14px", fontSize: 11, fontWeight: 600, color: "#9B9590", textTransform: "uppercase", letterSpacing: 0.5 }}>Artisan</th>
                <th style={{ textAlign: "left", padding: "10px 14px", fontSize: 11, fontWeight: 600, color: "#9B9590", textTransform: "uppercase", letterSpacing: 0.5 }}>Plan</th>
                <th style={{ textAlign: "right", padding: "10px 14px", fontSize: 11, fontWeight: 600, color: "#9B9590", textTransform: "uppercase", letterSpacing: 0.5 }}>Vues</th>
                <th style={{ textAlign: "right", padding: "10px 14px", fontSize: 11, fontWeight: 600, color: "#9B9590", textTransform: "uppercase", letterSpacing: 0.5 }}>Appels</th>
                <th style={{ textAlign: "right", padding: "10px 14px", fontSize: 11, fontWeight: 600, color: "#9B9590", textTransform: "uppercase", letterSpacing: 0.5 }}>Demandes</th>
                <th style={{ textAlign: "right", padding: "10px 14px", fontSize: 11, fontWeight: 600, color: "#9B9590", textTransform: "uppercase", letterSpacing: 0.5 }}>Total leads</th>
                <th style={{ textAlign: "right", padding: "10px 14px", fontSize: 11, fontWeight: 600, color: "#9B9590", textTransform: "uppercase", letterSpacing: 0.5 }}>Conv %</th>
                <th style={{ textAlign: "right", padding: "10px 14px", fontSize: 11, fontWeight: 600, color: "#9B9590", textTransform: "uppercase", letterSpacing: 0.5 }}>Score</th>
              </tr>
            </thead>
            <tbody>
              {leads.artisansByLeads.map((a, i) => (
                <tr key={a.artisanId} style={{ borderBottom: "1px solid #F7F5F2" }}>
                  <td style={{ padding: "12px 14px", fontSize: 12, fontWeight: 600, color: i < 3 ? "#C4531A" : "#9B9590" }}>{i + 1}</td>
                  <td style={{ padding: "12px 14px" }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "var(--bois,#3D2E1F)" }}>{a.nomAffichage}</div>
                    <div style={{ fontSize: 11, color: "#9B9590", marginTop: 2 }}>
                      {a.ville || "—"}{a.metier ? ` · ${a.metier}` : ""}
                    </div>
                  </td>
                  <td style={{ padding: "12px 14px" }}><PlanPill plan={a.plan} /></td>
                  <td style={{ padding: "12px 14px", textAlign: "right", fontSize: 13, color: "var(--bois,#3D2E1F)" }}>{a.vues}</td>
                  <td style={{ padding: "12px 14px", textAlign: "right", fontSize: 13, color: "var(--bois,#3D2E1F)" }}>{a.appels}</td>
                  <td style={{ padding: "12px 14px", textAlign: "right", fontSize: 13, color: "var(--bois,#3D2E1F)" }}>{a.demandes}</td>
                  <td style={{ padding: "12px 14px", textAlign: "right", fontSize: 14, fontWeight: 700, color: a.totalLeads > 0 ? "#C4531A" : "#9B9590" }}>{a.totalLeads}</td>
                  <td style={{ padding: "12px 14px", textAlign: "right", fontSize: 12, color: "#9B9590" }}>{a.conversionRate}%</td>
                  <td style={{ padding: "12px 14px", textAlign: "right", fontSize: 12, color: "var(--bois-mid,#5C4A3A)", fontWeight: 600 }}>{a.leadScore}</td>
                </tr>
              ))}
              {leads.artisansByLeads.length === 0 && (
                <tr><td colSpan={9} style={{ padding: 20, fontSize: 13, color: "#9B9590", textAlign: "center" }}>Aucun artisan actif.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- Funnel + Conversion par plan --- */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
        {/* Funnel */}
        <div style={CardNoPad}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid #EDEBE7" }}>
            <span style={{ fontFamily: "'Fraunces',serif", fontSize: 17, fontWeight: 700, color: "var(--bois,#3D2E1F)" }}>
              Funnel acquisition
            </span>
            <p style={{ fontSize: 11, color: "#9B9590", marginTop: 2 }}>
              Vue vitrine → contact → demande devis
            </p>
          </div>
          <div style={{ padding: 20 }}>
            {(() => {
              const max = Math.max(leads.funnel.totalVues, leads.funnel.totalAppels + leads.funnel.totalDemandes, 1);
              const contacts = leads.funnel.totalAppels + leads.funnel.totalDemandes;
              const rows = [
                { label: "Vues vitrines", value: leads.funnel.totalVues, color: "#E8A84C" },
                { label: "Contacts (appels + clics devis)", value: contacts, color: "#C4531A" },
                { label: "Demandes créées", value: leads.funnel.totalDemandes, color: "#8b5cf6" },
              ];
              return rows.map((r) => {
                const pct = Math.round((r.value / max) * 100);
                return (
                  <div key={r.label} style={{ marginBottom: 12 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                      <span style={{ fontSize: 13, color: "var(--bois,#3D2E1F)", fontWeight: 500 }}>{r.label}</span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: "var(--bois,#3D2E1F)" }}>{r.value}</span>
                    </div>
                    <div style={{ height: 8, background: "#F7F5F2", borderRadius: 4, overflow: "hidden" }}>
                      <div style={{ width: pct + "%", height: "100%", background: r.color, transition: "width .3s" }} />
                    </div>
                  </div>
                );
              });
            })()}
            <p style={{ fontSize: 11, color: "#9B9590", marginTop: 12 }}>
              Conversion vue → contact : <strong style={{ color: "var(--bois,#3D2E1F)" }}>{leads.funnel.viewToCallRate + leads.funnel.viewToDemandeRate}%</strong>
              {" · "}vue → demande : <strong style={{ color: "var(--bois,#3D2E1F)" }}>{leads.funnel.viewToDemandeRate}%</strong>
            </p>
          </div>
        </div>

        {/* Conversion par plan */}
        <div style={CardNoPad}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid #EDEBE7" }}>
            <span style={{ fontFamily: "'Fraunces',serif", fontSize: 17, fontWeight: 700, color: "var(--bois,#3D2E1F)" }}>
              Conversion par plan
            </span>
            <p style={{ fontSize: 11, color: "#9B9590", marginTop: 2 }}>
              Leads moyens par artisan, par plan
            </p>
          </div>
          <div style={{ padding: "0" }}>
            {leads.planSummary.length === 0 ? (
              <div style={{ padding: 20, fontSize: 13, color: "#9B9590" }}>Aucune donnée.</div>
            ) : (() => {
              const maxLeads = Math.max(...leads.planSummary.map((p) => p.leadsParArtisan), 0.1);
              return leads.planSummary.map((p) => {
                const pct = Math.round((p.leadsParArtisan / maxLeads) * 100);
                const color = PLAN_COLORS[p.plan] || "#9B9590";
                return (
                  <div key={p.plan} style={{ padding: "12px 20px", borderBottom: "1px solid #F7F5F2" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                      <PlanPill plan={p.plan} />
                      <span style={{ flex: 1, fontSize: 12, color: "#9B9590" }}>
                        {p.nbArtisans} artisan{p.nbArtisans > 1 ? "s" : ""}
                      </span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: "var(--bois,#3D2E1F)" }}>
                        {p.leadsParArtisan} leads/artisan
                      </span>
                    </div>
                    <div style={{ height: 4, background: "#F7F5F2", borderRadius: 2, overflow: "hidden" }}>
                      <div style={{ width: pct + "%", height: "100%", background: color }} />
                    </div>
                  </div>
                );
              });
            })()}
          </div>
        </div>
      </div>

      {/* --- Top vitrines vues + Repartition par ville --- */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
        {/* Top vitrines */}
        <div style={CardNoPad}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid #EDEBE7" }}>
            <span style={{ fontFamily: "'Fraunces',serif", fontSize: 17, fontWeight: 700, color: "var(--bois,#3D2E1F)" }}>
              Top vitrines vues
            </span>
            <p style={{ fontSize: 11, color: "#9B9590", marginTop: 2 }}>
              Pages qui drainent le plus de trafic
            </p>
          </div>
          {leads.topPages.length === 0 ? (
            <div style={{ padding: 20, fontSize: 13, color: "#9B9590" }}>Aucune vue trackée.</div>
          ) : leads.topPages.map((p, i) => (
            <div key={p.sourcePage} style={{ padding: "10px 20px", borderBottom: "1px solid #F7F5F2", display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ width: 22, height: 22, borderRadius: "50%", background: i < 3 ? "#C4531A" : "#EDEBE7", color: i < 3 ? "#fff" : "#9B9590", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, flexShrink: 0 }}>{i + 1}</span>
              <span style={{ flex: 1, fontSize: 12, color: "var(--bois-mid,#5C4A3A)", fontFamily: "monospace", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={p.sourcePage}>{p.sourcePage}</span>
              <span style={{ fontSize: 13, color: "#C4531A", fontWeight: 700 }}>{p.vues}</span>
            </div>
          ))}
        </div>

        {/* Repartition par ville */}
        <div style={CardNoPad}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid #EDEBE7" }}>
            <span style={{ fontFamily: "'Fraunces',serif", fontSize: 17, fontWeight: 700, color: "var(--bois,#3D2E1F)" }}>
              Répartition par ville
            </span>
            <span style={{ fontSize: 11, color: "#9B9590", marginLeft: 8 }}>({totalVillesCount} artisans)</span>
          </div>
          {stats.villes.length === 0 ? (
            <div style={{ padding: 20, fontSize: 13, color: "#9B9590" }}>Aucun artisan actif.</div>
          ) : stats.villes.map((v, i) => (
            <div key={v.slug} style={{ padding: "10px 20px", borderBottom: "1px solid #F7F5F2", display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ width: 22, height: 22, borderRadius: "50%", background: i < 3 && v.count > 0 ? "#C4531A" : "#EDEBE7", color: i < 3 && v.count > 0 ? "#fff" : "#9B9590", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, flexShrink: 0 }}>{i + 1}</span>
              <span style={{ flex: 1, fontSize: 14, fontWeight: 600, color: "var(--bois,#3D2E1F)" }}>{VILLE_NOMS[v.slug] || v.slug}</span>
              <span style={{ fontSize: 13, color: v.count > 0 ? "#C4531A" : "#9B9590", fontWeight: 600 }}>{v.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* --- Alerte en-attente si > 0 --- */}
      {stats.artisansEnAttente > 0 && (
        <div style={{ marginBottom: 16, padding: "12px 20px", borderRadius: 12, background: "rgba(232,168,76,.08)", border: "1px solid rgba(232,168,76,.3)", color: "#92400E", fontSize: 13 }}>
          <strong>{stats.artisansEnAttente}</strong> artisan{stats.artisansEnAttente > 1 ? "s" : ""} en attente de validation.{" "}
          <a href="/admin/validations" style={{ color: "#92400E", textDecoration: "underline", fontWeight: 600 }}>Voir validations →</a>
        </div>
      )}

      {/* Inscriptions + Devis delta */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
        <div style={C}>
          <p style={{ fontSize: 12, color: "#9B9590", marginBottom: 4 }}>Inscriptions ce mois</p>
          <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
            <span style={{ fontFamily: "'Fraunces',serif", fontSize: 24, fontWeight: 800, color: "var(--bois,#3D2E1F)" }}>{stats.inscriptionsThisMonth}</span>
            {(() => {
              const d = formatDelta(stats.inscriptionsDeltaPct);
              if (!d) return null;
              return (
                <span style={{
                  fontSize: 11, fontWeight: 600,
                  color: d.positive ? "#22c55e" : "#dc2626",
                  background: d.positive ? "rgba(34,197,94,.08)" : "rgba(220,38,38,.08)",
                  padding: "2px 8px", borderRadius: 4,
                }}>{d.label}</span>
              );
            })()}
          </div>
          <p style={{ fontSize: 11, color: "#9B9590", marginTop: 4 }}>{stats.inscriptionsLastMonth} le mois précédent</p>
        </div>
        <div style={C}>
          <p style={{ fontSize: 12, color: "#9B9590", marginBottom: 4 }}>Devis ce mois</p>
          <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
            <span style={{ fontFamily: "'Fraunces',serif", fontSize: 24, fontWeight: 800, color: "var(--bois,#3D2E1F)" }}>{stats.totalDevisThisMonth}</span>
            {(() => {
              const d = formatDelta(stats.devisDeltaPct);
              if (!d) return null;
              return (
                <span style={{
                  fontSize: 11, fontWeight: 600,
                  color: d.positive ? "#22c55e" : "#dc2626",
                  background: d.positive ? "rgba(34,197,94,.08)" : "rgba(220,38,38,.08)",
                  padding: "2px 8px", borderRadius: 4,
                }}>{d.label}</span>
              );
            })()}
          </div>
          <p style={{ fontSize: 11, color: "#9B9590", marginTop: 4 }}>{stats.totalDevisLastMonth} le mois précédent</p>
        </div>
      </div>

      {/* --- Tracking detaille (debug) --- */}
      <div style={{ marginTop: 32, paddingTop: 16, borderTop: "1px dashed #E5DCC8" }}>
        <p style={{ fontSize: 11, color: "#9B9590", marginBottom: 12, textTransform: "uppercase", letterSpacing: 0.5, fontWeight: 600 }}>
          Tracking détaillé · debug / audit
        </p>
        <ClicksOutbound />
      </div>
    </div>
  );
}
