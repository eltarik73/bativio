"use client";

/**
 * ClicksOutbound — section admin "Clics sortants & redirections".
 *
 * Fetch /api/v1/admin/clicks et affiche :
 * - 4 KPI : total / 24h / 7j / 30j
 * - Top labels (boutons CTA les plus cliqués)
 * - Top pages source (pages qui génèrent le plus de clics)
 * - Répartition par catégorie
 * - 50 derniers clics (audit / debug)
 */

import { useEffect, useState } from "react";
import { authFetch } from "@/lib/auth";

interface ClickCount {
  label?: string;
  page?: string;
  category?: string;
  count: number;
}

interface RecentClick {
  id: string;
  label: string;
  targetUrl: string;
  sourcePage: string;
  category: string | null;
  createdAt: string;
}

interface ClicksData {
  totals: { all: number; last24h: number; last7d: number; last30d: number };
  byLabel: ClickCount[];
  byPage: ClickCount[];
  byCategory: ClickCount[];
  recent: RecentClick[];
}

const Card: React.CSSProperties = {
  background: "#fff",
  borderRadius: 14,
  border: "1px solid var(--sable,#E8D5C0)",
  overflow: "hidden",
};

const SectionHeader: React.CSSProperties = {
  padding: "16px 20px",
  borderBottom: "1px solid #EDEBE7",
  fontFamily: "'Fraunces',serif",
  fontSize: 17,
  fontWeight: 700,
  color: "var(--bois,#3D2E1F)",
};

const Row: React.CSSProperties = {
  padding: "10px 20px",
  borderBottom: "1px solid #F7F5F2",
  display: "flex",
  alignItems: "center",
  gap: 12,
};

export default function ClicksOutbound() {
  const [data, setData] = useState<ClicksData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        // authFetch<T> retourne T directement (deserialise + unwrap data)
        const result = await authFetch<ClicksData>("/api/v1/admin/clicks");
        if (active) setData(result);
      } catch (e) {
        if (active) setError(e instanceof Error ? e.message : String(e));
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return (
      <div style={{ ...Card, padding: 32, textAlign: "center", color: "#9B9590" }}>
        Chargement des clics…
      </div>
    );
  }

  if (error || !data) {
    return (
      <div style={{ ...Card, padding: 32, color: "#dc2626" }}>
        Erreur de chargement : {error}
      </div>
    );
  }

  const { totals, byLabel, byPage, byCategory, recent } = data;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 24 }}>
      <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 20, fontWeight: 700, color: "var(--bois,#3D2E1F)", marginBottom: 4 }}>
        Clics sortants &amp; redirections
      </h2>
      <p style={{ fontSize: 13, color: "var(--pierre,#9C958D)", marginTop: -8 }}>
        Tracking en temps réel des boutons CTA externes (partenaires, redirections, etc.)
      </p>

      {/* 4 KPI cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16 }}>
        {[
          { label: "Total clics", value: totals.all, color: "var(--bois,#3D2E1F)" },
          { label: "Dernières 24h", value: totals.last24h, color: "#C4531A" },
          { label: "7 derniers jours", value: totals.last7d, color: "#E8A84C" },
          { label: "30 derniers jours", value: totals.last30d, color: "#4A6741" },
        ].map((kpi) => (
          <div key={kpi.label} style={{ background: "#fff", borderRadius: 14, border: "1px solid var(--sable,#E8D5C0)", padding: 20 }}>
            <span style={{ fontFamily: "'Fraunces',serif", fontSize: 28, fontWeight: 800, color: kpi.color }}>
              {kpi.value.toLocaleString("fr-FR")}
            </span>
            <p style={{ fontSize: 13, color: "var(--pierre,#9C958D)", marginTop: 6 }}>{kpi.label}</p>
          </div>
        ))}
      </div>

      {/* Top labels + Top pages */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div style={Card}>
          <div style={SectionHeader}>Top boutons cliqués (par label)</div>
          {byLabel.length === 0 ? (
            <div style={{ padding: 20, fontSize: 13, color: "#9B9590" }}>
              Aucun clic enregistré.
            </div>
          ) : (
            byLabel.map((b, i) => (
              <div key={b.label} style={Row}>
                <span style={{ width: 24, height: 24, borderRadius: "50%", background: i < 3 ? "#C4531A" : "#EDEBE7", color: i < 3 ? "#fff" : "#9B9590", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, flexShrink: 0 }}>
                  {i + 1}
                </span>
                <span style={{ flex: 1, fontSize: 13, fontWeight: 600, color: "var(--bois,#3D2E1F)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {b.label}
                </span>
                <span style={{ fontSize: 13, color: "#C4531A", fontWeight: 600 }}>
                  {b.count.toLocaleString("fr-FR")}
                </span>
              </div>
            ))
          )}
        </div>

        <div style={Card}>
          <div style={SectionHeader}>Top pages source</div>
          {byPage.length === 0 ? (
            <div style={{ padding: 20, fontSize: 13, color: "#9B9590" }}>
              Aucun clic enregistré.
            </div>
          ) : (
            byPage.map((b, i) => (
              <div key={b.page} style={Row}>
                <span style={{ width: 24, height: 24, borderRadius: "50%", background: i < 3 ? "#E8A84C" : "#EDEBE7", color: i < 3 ? "#fff" : "#9B9590", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, flexShrink: 0 }}>
                  {i + 1}
                </span>
                <span style={{ flex: 1, fontSize: 13, fontWeight: 600, color: "var(--bois,#3D2E1F)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {b.page}
                </span>
                <span style={{ fontSize: 13, color: "#C4531A", fontWeight: 600 }}>
                  {b.count.toLocaleString("fr-FR")}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* By category + Recent clicks */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 16 }}>
        <div style={Card}>
          <div style={SectionHeader}>Par catégorie</div>
          {byCategory.length === 0 ? (
            <div style={{ padding: 20, fontSize: 13, color: "#9B9590" }}>—</div>
          ) : (
            byCategory.map((c) => (
              <div key={c.category} style={Row}>
                <span style={{ flex: 1, fontSize: 13, fontWeight: 600, color: "var(--bois,#3D2E1F)" }}>
                  {c.category}
                </span>
                <span style={{ fontSize: 13, color: "#C4531A", fontWeight: 600 }}>
                  {c.count.toLocaleString("fr-FR")}
                </span>
              </div>
            ))
          )}
        </div>

        <div style={Card}>
          <div style={SectionHeader}>Derniers clics (50 max)</div>
          <div style={{ maxHeight: 400, overflowY: "auto" }}>
            {recent.length === 0 ? (
              <div style={{ padding: 20, fontSize: 13, color: "#9B9590" }}>
                Aucun clic enregistré.
              </div>
            ) : (
              recent.map((c) => {
                const date = new Date(c.createdAt);
                return (
                  <div key={c.id} style={{ ...Row, alignItems: "flex-start", flexDirection: "column", gap: 4 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, width: "100%" }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: "var(--bois,#3D2E1F)" }}>
                        {c.label}
                      </span>
                      {c.category && (
                        <span style={{ fontSize: 10, padding: "2px 6px", borderRadius: 4, background: "rgba(196,83,26,.08)", color: "#C4531A", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>
                          {c.category}
                        </span>
                      )}
                      <span style={{ marginLeft: "auto", fontSize: 11, color: "#9B9590" }}>
                        {date.toLocaleString("fr-FR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                    <div style={{ fontSize: 11, color: "#9B9590", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", width: "100%" }}>
                      {c.sourcePage} → {c.targetUrl}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
