"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";

interface Subscriber {
  id: string;
  email: string;
  source: string | null;
  confirmed: boolean;
  unsubscribedAt: string | null;
  createdAt: string;
}

interface PageData {
  subscribers: Subscriber[];
  total: number;
  last30dCount: number;
  activeCount: number;
}

export default function AdminNewsletterPage() {
  const { fetchWithAuth } = useAuth();
  const [data, setData] = useState<PageData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = (await fetchWithAuth("/admin/newsletter")) as PageData;
      setData(res);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, [fetchWithAuth]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const stat: React.CSSProperties = {
    background: "#fff",
    border: "1px solid var(--sable,#E8D5C0)",
    borderRadius: 14,
    padding: "18px 20px",
    flex: 1,
    minWidth: 180,
  };

  return (
    <div>
      <h1 style={{ fontFamily: "'Fraunces',serif", fontSize: 24, fontWeight: 700, color: "var(--bois,#3D2E1F)", marginBottom: 20 }}>
        Newsletter
      </h1>

      <div style={{ display: "flex", gap: 14, marginBottom: 24, flexWrap: "wrap" }}>
        <div style={stat}>
          <p style={{ fontSize: 11, fontWeight: 600, color: "var(--pierre,#9C958D)", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6 }}>Total inscrits</p>
          <p style={{ fontFamily: "'Fraunces',serif", fontSize: 28, fontWeight: 600, color: "var(--anthracite,#1C1C1E)" }}>
            {loading ? "…" : (data?.total ?? 0).toLocaleString("fr-FR")}
          </p>
        </div>
        <div style={stat}>
          <p style={{ fontSize: 11, fontWeight: 600, color: "var(--pierre,#9C958D)", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6 }}>Actifs</p>
          <p style={{ fontFamily: "'Fraunces',serif", fontSize: 28, fontWeight: 600, color: "var(--mousse,#4A6741)" }}>
            {loading ? "…" : (data?.activeCount ?? 0).toLocaleString("fr-FR")}
          </p>
        </div>
        <div style={stat}>
          <p style={{ fontSize: 11, fontWeight: 600, color: "var(--pierre,#9C958D)", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6 }}>30 derniers jours</p>
          <p style={{ fontFamily: "'Fraunces',serif", fontSize: 28, fontWeight: 600, color: "var(--terre,#C4531A)" }}>
            +{loading ? "…" : (data?.last30dCount ?? 0).toLocaleString("fr-FR")}
          </p>
        </div>
      </div>

      <div style={{ background: "#fff", borderRadius: 14, border: "1px solid var(--sable,#E8D5C0)", overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#F7F5F2", borderBottom: "1px solid #EDEBE7" }}>
                <th style={{ textAlign: "left", padding: "14px 16px", fontSize: 11, fontWeight: 600, color: "var(--pierre,#9C958D)", textTransform: "uppercase", letterSpacing: 0.5 }}>Email</th>
                <th style={{ textAlign: "left", padding: "14px 16px", fontSize: 11, fontWeight: 600, color: "var(--pierre,#9C958D)", textTransform: "uppercase", letterSpacing: 0.5 }}>Source</th>
                <th style={{ textAlign: "left", padding: "14px 16px", fontSize: 11, fontWeight: 600, color: "var(--pierre,#9C958D)", textTransform: "uppercase", letterSpacing: 0.5 }}>Inscrit le</th>
                <th style={{ textAlign: "center", padding: "14px 16px", fontSize: 11, fontWeight: 600, color: "var(--pierre,#9C958D)", textTransform: "uppercase", letterSpacing: 0.5 }}>Statut</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={4} style={{ padding: "32px 24px", textAlign: "center", fontSize: 14, color: "var(--pierre,#9C958D)" }}>Chargement…</td></tr>
              ) : !data || data.subscribers.length === 0 ? (
                <tr><td colSpan={4} style={{ padding: "48px 24px", textAlign: "center", fontSize: 14, color: "var(--pierre,#9C958D)" }}>Aucun inscrit à la newsletter pour le moment.</td></tr>
              ) : (
                data.subscribers.map((s, idx) => (
                  <tr key={s.id} style={{ borderBottom: idx < data.subscribers.length - 1 ? "1px solid #F7F5F2" : "none" }}>
                    <td style={{ padding: "12px 16px", fontSize: 14, color: "var(--anthracite,#1C1C1E)", fontWeight: 500 }}>{s.email}</td>
                    <td style={{ padding: "12px 16px", fontSize: 13, color: "var(--bois-mid,#5C4A3A)" }}>{s.source || "-"}</td>
                    <td style={{ padding: "12px 16px", fontSize: 13, color: "var(--bois-mid,#5C4A3A)" }}>
                      {new Date(s.createdAt).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" })}
                    </td>
                    <td style={{ padding: "12px 16px", textAlign: "center" }}>
                      {s.unsubscribedAt ? (
                        <span style={{ padding: "3px 10px", borderRadius: 99, background: "rgba(156,149,141,.1)", color: "var(--pierre,#9C958D)", fontSize: 12, fontWeight: 600 }}>Désinscrit</span>
                      ) : (
                        <span style={{ padding: "3px 10px", borderRadius: 99, background: "rgba(74,103,65,.12)", color: "var(--mousse,#4A6741)", fontSize: 12, fontWeight: 600 }}>Actif</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
