"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { DashboardFeatureGate } from "@/components/DashboardFeatureGate";

const STATUT_BADGE: Record<string, { bg: string; color: string; label: string }> = {
  BROUILLON: { bg: "rgba(155,149,144,.1)", color: "var(--bois-mid,#5C4A3A)", label: "Brouillon" },
  ENVOYE: { bg: "rgba(37,99,235,.1)", color: "#2563EB", label: "Envoy\u00e9" },
  VU: { bg: "rgba(147,51,234,.1)", color: "#9333EA", label: "Vu" },
  ACCEPTE: { bg: "rgba(22,163,74,.1)", color: "#16a34a", label: "Accept\u00e9" },
  REFUSE: { bg: "rgba(220,38,38,.1)", color: "#dc2626", label: "Refus\u00e9" },
  EXPIRE: { bg: "rgba(234,150,50,.1)", color: "#EA9632", label: "Expir\u00e9" },
};

interface DevisIA {
  id: string;
  numero: string;
  clientNom: string;
  objet: string;
  totalTTC: number;
  statut: string;
  createdAt: string;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatEuros(amount: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(amount);
}

export default function DevisIAListPage() {
  return <DashboardFeatureGate feature="devis_ia"><DevisIAListContent /></DashboardFeatureGate>;
}

function DevisIAListContent() {
  const { fetchWithAuth } = useAuth();
  const [devisList, setDevisList] = useState<DevisIA[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDevis = useCallback(async () => {
    setLoading(true);
    try {
      const data = (await fetchWithAuth("/artisans/me/devis-ia")) as
        | DevisIA[]
        | { content?: DevisIA[]; devis?: DevisIA[] };
      if (Array.isArray(data)) {
        setDevisList(data);
      } else {
        setDevisList(data.content || data.devis || []);
      }
    } catch {
      /* empty */
    } finally {
      setLoading(false);
    }
  }, [fetchWithAuth]);

  useEffect(() => {
    fetchDevis();
  }, [fetchDevis]);

  return (
    <div style={{ maxWidth: 800, margin: "0 auto" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 24,
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <h1
          style={{
            fontFamily: "'Fraunces', serif",
            fontSize: 24,
            fontWeight: 700,
            color: "var(--bois,#3D2E1F)",
          }}
        >
          Mes devis
        </h1>
        <Link
          href="/dashboard/devis-ia/nouveau"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            background: "#C4531A",
            color: "#fff",
            fontSize: 14,
            fontWeight: 600,
            padding: "10px 22px",
            borderRadius: 8,
            textDecoration: "none",
            transition: "background .15s",
          }}
        >
          Nouveau devis &#10024;
        </Link>
      </div>

      {/* List */}
      {loading ? (
        <div
          style={{
            textAlign: "center",
            padding: 40,
            color: "var(--pierre,#9C958D)",
            fontSize: 14,
          }}
        >
          Chargement...
        </div>
      ) : devisList.length > 0 ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {devisList.map((d) => {
            const badge = STATUT_BADGE[d.statut] || STATUT_BADGE.BROUILLON;
            return (
              <Link
                key={d.id}
                href={`/dashboard/devis-ia/nouveau?id=${d.id}`}
                style={{ textDecoration: "none" }}
              >
                <div
                  style={{
                    background: "#fff",
                    borderRadius: 14,
                    border: "1px solid var(--sable,#E8D5C0)",
                    padding: "20px 24px",
                    transition: "all .2s",
                    cursor: "pointer",
                  }}
                  className="stat-card-hover"
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      marginBottom: 8,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: "var(--pierre,#9C958D)",
                        fontFamily: "monospace",
                      }}
                    >
                      {d.numero}
                    </span>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 600,
                        padding: "3px 10px",
                        borderRadius: 6,
                        background: badge.bg,
                        color: badge.color,
                      }}
                    >
                      {badge.label}
                    </span>
                    <span
                      style={{
                        fontSize: 12,
                        color: "#C5C0B9",
                        marginLeft: "auto",
                      }}
                    >
                      {formatDate(d.createdAt)}
                    </span>
                  </div>
                  <div
                    style={{
                      fontSize: 16,
                      fontWeight: 700,
                      color: "var(--bois,#3D2E1F)",
                      marginBottom: 4,
                    }}
                  >
                    {d.clientNom}
                  </div>
                  {d.objet && (
                    <p
                      style={{
                        fontSize: 14,
                        color: "var(--bois-mid,#5C4A3A)",
                        lineHeight: 1.5,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {d.objet}
                    </p>
                  )}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginTop: 12,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "'Fraunces', serif",
                        fontSize: 18,
                        fontWeight: 700,
                        color: "var(--bois,#3D2E1F)",
                      }}
                    >
                      {formatEuros(d.totalTTC)}
                    </span>
                    <span
                      style={{
                        marginLeft: "auto",
                        fontSize: 13,
                        fontWeight: 600,
                        color: "#C4531A",
                      }}
                    >
                      Voir &rarr;
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div style={{ textAlign: "center", padding: "56px 20px" }}>
          <svg
            width="56"
            height="56"
            fill="none"
            stroke="#E0DDD8"
            strokeWidth="1"
            viewBox="0 0 24 24"
            style={{ margin: "0 auto 16px" }}
          >
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
            <path d="M14 2v6h6" />
            <path d="M9.5 15.5l1.5 1.5 3.5-3.5" strokeWidth="1.5" />
          </svg>
          <p style={{ fontSize: 15, color: "var(--pierre,#9C958D)" }}>Aucun devis.</p>
          <p
            style={{
              fontSize: 13,
              color: "#C5C0B9",
              marginTop: 4,
              lineHeight: 1.5,
            }}
          >
            Cr&eacute;ez votre premier devis assist&eacute; par IA.
          </p>
          <Link
            href="/dashboard/devis-ia/nouveau"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "#C4531A",
              color: "#fff",
              fontSize: 14,
              fontWeight: 600,
              padding: "10px 22px",
              borderRadius: 8,
              textDecoration: "none",
              marginTop: 20,
              transition: "background .15s",
            }}
          >
            Nouveau devis &#10024;
          </Link>
        </div>
      )}
    </div>
  );
}
