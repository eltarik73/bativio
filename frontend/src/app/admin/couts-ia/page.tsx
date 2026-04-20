"use client";

import { useEffect, useState } from "react";
import { authFetch } from "@/lib/auth";

interface Total {
  calls: number;
  costEur: number;
  tokensIn: number;
  tokensOut: number;
  tokensCacheRead: number;
}

interface ByAgent {
  agent: string;
  _sum: { costEur: number | null; tokensIn: number | null; tokensOut: number | null; tokensCacheRead: number | null };
  _count: { _all: number };
}

interface ByModel {
  model: string;
  _sum: { costEur: number | null; tokensIn: number | null; tokensOut: number | null };
  _count: { _all: number };
}

interface Last {
  id: string;
  agent: string;
  model: string;
  tokensIn: number;
  tokensOut: number;
  tokensCacheRead: number | null;
  costEur: number;
  success: boolean;
  errorMessage: string | null;
  latencyMs: number | null;
  createdAt: string;
}

interface Data {
  period: { days: number; since: string };
  total: Total;
  byAgent: ByAgent[];
  byModel: ByModel[];
  last50: Last[];
}

export default function CoutsIaPage() {
  const [days, setDays] = useState(30);
  const [data, setData] = useState<Data | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    authFetch<Data>(`/admin/couts-ia?days=${days}`)
      .then((body) => {
        if (cancelled) return;
        setData(body);
        setLoading(false);
      })
      .catch(() => !cancelled && setLoading(false));
    return () => { cancelled = true; };
  }, [days]);

  if (loading) return <p style={{ color: "#6B6560", padding: 24 }}>Chargement…</p>;
  if (!data) return <p style={{ color: "#6B6560", padding: 24 }}>Aucune donnée</p>;

  const totalEur = data.total.costEur.toFixed(2);
  const cacheRatio = data.total.tokensIn > 0
    ? Math.round((data.total.tokensCacheRead / (data.total.tokensIn + data.total.tokensCacheRead)) * 100)
    : 0;

  return (
    <div>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontFamily: "'Fraunces',serif", fontSize: 28, color: "#1C1C1E", margin: 0 }}>Coûts IA</h1>
          <p style={{ color: "#6B6560", fontSize: 14, margin: "4px 0 0" }}>Usage Claude API — monitoring en temps réel</p>
        </div>
        <select
          value={days}
          onChange={(e) => setDays(parseInt(e.target.value, 10))}
          style={{ padding: "8px 14px", border: "1px solid #EDEBE7", borderRadius: 10, background: "#fff", fontSize: 14 }}
        >
          <option value={1}>24 h</option>
          <option value={7}>7 jours</option>
          <option value={30}>30 jours</option>
          <option value={90}>90 jours</option>
        </select>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 32 }}>
        <Stat label="Coût total" value={`${totalEur} €`} accent />
        <Stat label="Appels" value={String(data.total.calls)} />
        <Stat label="Tokens out" value={data.total.tokensOut.toLocaleString("fr-FR")} />
        <Stat label="Cache hit" value={`${cacheRatio}%`} />
      </div>

      <section style={{ background: "#fff", border: "1px solid #EDEBE7", borderRadius: 14, padding: 24, marginBottom: 24 }}>
        <h2 style={{ fontSize: 16, color: "#1C1C1E", marginTop: 0, marginBottom: 16 }}>Par agent</h2>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #EDEBE7" }}>
              <Th>Agent</Th>
              <Th right>Appels</Th>
              <Th right>Tokens in</Th>
              <Th right>Tokens out</Th>
              <Th right>Cache read</Th>
              <Th right>Coût</Th>
              <Th right>Coût / appel</Th>
            </tr>
          </thead>
          <tbody>
            {data.byAgent.map((row) => {
              const totalCost = row._sum.costEur ?? 0;
              const avgCost = row._count._all > 0 ? totalCost / row._count._all : 0;
              return (
                <tr key={row.agent} style={{ borderBottom: "1px solid #FAF8F5" }}>
                  <Td strong>{row.agent}</Td>
                  <Td right>{row._count._all}</Td>
                  <Td right>{(row._sum.tokensIn ?? 0).toLocaleString("fr-FR")}</Td>
                  <Td right>{(row._sum.tokensOut ?? 0).toLocaleString("fr-FR")}</Td>
                  <Td right>{(row._sum.tokensCacheRead ?? 0).toLocaleString("fr-FR")}</Td>
                  <Td right strong>{totalCost.toFixed(2)} €</Td>
                  <Td right>{avgCost.toFixed(4)} €</Td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>

      <section style={{ background: "#fff", border: "1px solid #EDEBE7", borderRadius: 14, padding: 24, marginBottom: 24 }}>
        <h2 style={{ fontSize: 16, color: "#1C1C1E", marginTop: 0, marginBottom: 16 }}>Par modèle</h2>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #EDEBE7" }}>
              <Th>Modèle</Th>
              <Th right>Appels</Th>
              <Th right>Tokens out</Th>
              <Th right>Coût</Th>
            </tr>
          </thead>
          <tbody>
            {data.byModel.map((row) => (
              <tr key={row.model} style={{ borderBottom: "1px solid #FAF8F5" }}>
                <Td strong>{row.model}</Td>
                <Td right>{row._count._all}</Td>
                <Td right>{(row._sum.tokensOut ?? 0).toLocaleString("fr-FR")}</Td>
                <Td right strong>{(row._sum.costEur ?? 0).toFixed(2)} €</Td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section style={{ background: "#fff", border: "1px solid #EDEBE7", borderRadius: 14, padding: 24 }}>
        <h2 style={{ fontSize: 16, color: "#1C1C1E", marginTop: 0, marginBottom: 16 }}>Derniers appels (50)</h2>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #EDEBE7" }}>
                <Th>Date</Th>
                <Th>Agent</Th>
                <Th>Modèle</Th>
                <Th right>In</Th>
                <Th right>Out</Th>
                <Th right>Cache</Th>
                <Th right>Latence</Th>
                <Th right>Coût</Th>
                <Th>Statut</Th>
              </tr>
            </thead>
            <tbody>
              {data.last50.map((r) => (
                <tr key={r.id} style={{ borderBottom: "1px solid #FAF8F5" }}>
                  <Td>{new Date(r.createdAt).toLocaleString("fr-FR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })}</Td>
                  <Td>{r.agent}</Td>
                  <Td>{r.model.replace("claude-", "")}</Td>
                  <Td right>{r.tokensIn}</Td>
                  <Td right>{r.tokensOut}</Td>
                  <Td right>{r.tokensCacheRead ?? "—"}</Td>
                  <Td right>{r.latencyMs ? `${Math.round(r.latencyMs / 100) / 10}s` : "—"}</Td>
                  <Td right>{r.costEur.toFixed(4)} €</Td>
                  <Td>{r.success ? <span style={{ color: "#4A6741" }}>OK</span> : <span style={{ color: "#C4531A" }} title={r.errorMessage ?? ""}>Erreur</span>}</Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div style={{ background: "#fff", border: "1px solid #EDEBE7", borderRadius: 14, padding: 20 }}>
      <div style={{ fontSize: 11, letterSpacing: 1, color: "#9C958D", textTransform: "uppercase", marginBottom: 6, fontWeight: 600 }}>{label}</div>
      <div style={{ fontFamily: "'Fraunces',serif", fontSize: 24, color: accent ? "#C4531A" : "#1C1C1E", fontWeight: 600 }}>{value}</div>
    </div>
  );
}

function Th({ children, right }: { children: React.ReactNode; right?: boolean }) {
  return (
    <th style={{ padding: "10px 12px", textAlign: right ? "right" : "left", fontSize: 11, color: "#9C958D", textTransform: "uppercase", fontWeight: 600, letterSpacing: 0.5 }}>
      {children}
    </th>
  );
}

function Td({ children, right, strong }: { children: React.ReactNode; right?: boolean; strong?: boolean }) {
  return (
    <td style={{ padding: "10px 12px", textAlign: right ? "right" : "left", color: "#3D2E1F", fontWeight: strong ? 600 : 400 }}>
      {children}
    </td>
  );
}
