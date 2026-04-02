"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const DOT: Record<string, string> = {
  NOUVEAU: "#dc2626",
  VU: "#E8A84C",
  REPONDU: "#2563EB",
  ACCEPTE: "#16a34a",
  REFUSE: "#9B9590",
  ARCHIVE: "#C5C0B9",
};

const LABEL: Record<string, string> = {
  NOUVEAU: "Nouveau",
  VU: "En cours",
  REPONDU: "Devis envoy\u00e9",
  ACCEPTE: "Accept\u00e9e",
  REFUSE: "Refus\u00e9e",
  ARCHIVE: "Archiv\u00e9e",
};

const BG: Record<string, string> = {
  NOUVEAU: "rgba(220,38,38,.08)",
  VU: "rgba(232,168,76,.08)",
  REPONDU: "rgba(37,99,235,.08)",
  ACCEPTE: "rgba(22,163,74,.08)",
  REFUSE: "rgba(155,149,144,.08)",
  ARCHIVE: "rgba(197,192,185,.08)",
};

const TABS = [
  { key: "TOUS", label: "Toutes" },
  { key: "NOUVEAU", label: "Nouvelles" },
  { key: "VU", label: "En cours" },
  { key: "REPONDU", label: "Devis envoy\u00e9" },
  { key: "ACCEPTE", label: "Accept\u00e9es" },
];

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Demande {
  id: string;
  nomClient: string;
  telephoneClient: string;
  emailClient: string;
  clientVille?: string;
  descriptionBesoin: string;
  urgence?: string;
  statut: string;
  reponduAt: string | null;
  createdAt: string;
  messageCount: number;
  lastMessageAt: string | null;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function timeAgo(iso: string): string {
  const d = new Date(iso);
  const now = Date.now();
  const diff = now - d.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "\u00C0 l\u2019instant";
  if (mins < 60) return `il y a ${mins} min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `il y a ${hours}h`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "Hier";
  if (days < 7) return `il y a ${days} jours`;
  return d.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
}

function initials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function excerpt(text: string, max: number = 60): string {
  if (!text) return "";
  if (text.length <= max) return text;
  return text.slice(0, max).trimEnd() + "\u2026";
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function DemandesPage() {
  const { fetchWithAuth } = useAuth();
  const router = useRouter();
  const [demandes, setDemandes] = useState<Demande[]>([]);
  const [filter, setFilter] = useState("TOUS");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [total, setTotal] = useState(0);

  const fetchDemandes = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), size: "20" });
      if (filter !== "TOUS") params.set("status", filter);
      const data = (await fetchWithAuth(`/artisan/demandes?${params}`)) as {
        demandes?: Demande[];
        pagination?: { total: number; totalPages: number };
      };
      setDemandes(data.demandes || []);
      setTotalPages(data.pagination?.totalPages || 0);
      setTotal(data.pagination?.total || 0);
    } catch {
      /* empty */
    } finally {
      setLoading(false);
    }
  }, [page, filter, fetchWithAuth]);

  useEffect(() => {
    fetchDemandes();
  }, [fetchDemandes]);

  const newCount = demandes.filter((d) => d.statut === "NOUVEAU").length;

  return (
    <div style={{ maxWidth: 800, margin: "0 auto" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 20,
        }}
      >
        <h1
          style={{
            fontFamily: "'Fraunces',serif",
            fontSize: 24,
            fontWeight: 700,
            color: "var(--bois,#3D2E1F)",
          }}
        >
          Demandes de devis
        </h1>
        {total > 0 && (
          <span
            style={{
              background: "var(--sable,#E8D5C0)",
              color: "var(--bois,#3D2E1F)",
              fontSize: 12,
              fontWeight: 700,
              padding: "4px 12px",
              borderRadius: 10,
            }}
          >
            {total}
          </span>
        )}
        {newCount > 0 && (
          <span
            style={{
              background: "#dc2626",
              color: "#fff",
              fontSize: 12,
              fontWeight: 700,
              padding: "3px 10px",
              borderRadius: 10,
            }}
          >
            {newCount} nouvelle{newCount > 1 ? "s" : ""}
          </span>
        )}
      </div>

      {/* Filter tabs */}
      <div
        style={{
          display: "flex",
          gap: 8,
          marginBottom: 24,
          overflowX: "auto",
        }}
        className="hide-scroll"
      >
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => {
              setFilter(tab.key);
              setPage(0);
            }}
            style={{
              padding: "8px 18px",
              borderRadius: 20,
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              whiteSpace: "nowrap",
              transition: "all .15s",
              background: filter === tab.key ? "#1C1C1E" : "#fff",
              color: filter === tab.key ? "#fff" : "var(--pierre,#9C958D)",
              border:
                filter !== tab.key
                  ? "1.5px solid var(--sable,#E8D5C0)"
                  : "none",
            }}
          >
            {tab.label}
          </button>
        ))}
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
      ) : demandes.length > 0 ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {demandes.map((d) => {
            const isNew = d.statut === "NOUVEAU";
            return (
              <div
                key={d.id}
                onClick={() => router.push(`/dashboard/demandes/${d.id}`)}
                className="stat-card-hover"
                style={{
                  background: "#fff",
                  borderRadius: 14,
                  border: isNew
                    ? "1.5px solid var(--terre,#C4531A)"
                    : "1px solid var(--sable,#E8D5C0)",
                  padding: "18px 20px",
                  cursor: "pointer",
                  transition: "all .2s",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 14,
                  position: "relative",
                }}
              >
                {/* Red dot for new */}
                {isNew && (
                  <span
                    style={{
                      position: "absolute",
                      top: 10,
                      right: 10,
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      background: "#dc2626",
                      animation: "pulse 1.5s infinite",
                    }}
                  />
                )}

                {/* Avatar */}
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: "50%",
                    background:
                      "linear-gradient(135deg, var(--terre,#C4531A), var(--argile,#D4733A))",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontSize: 14,
                    fontWeight: 700,
                    fontFamily: "'Karla',sans-serif",
                    flexShrink: 0,
                  }}
                >
                  {initials(d.nomClient)}
                </div>

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      marginBottom: 4,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 15,
                        fontWeight: 700,
                        color: "var(--bois,#3D2E1F)",
                      }}
                    >
                      {d.nomClient}
                    </span>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 600,
                        padding: "2px 8px",
                        borderRadius: 4,
                        background: BG[d.statut] || BG.ARCHIVE,
                        color: DOT[d.statut] || "#9B9590",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {LABEL[d.statut] || d.statut}
                    </span>
                    {d.urgence === "urgent" && (
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 700,
                          padding: "2px 8px",
                          borderRadius: 4,
                          background: "rgba(220,38,38,.1)",
                          color: "#dc2626",
                          textTransform: "uppercase",
                          letterSpacing: 0.5,
                        }}
                      >
                        Urgent
                      </span>
                    )}
                    <span
                      style={{
                        fontSize: 12,
                        color: "var(--pierre,#9C958D)",
                        marginLeft: "auto",
                        whiteSpace: "nowrap",
                        flexShrink: 0,
                      }}
                    >
                      {timeAgo(d.createdAt)}
                    </span>
                  </div>
                  <p
                    style={{
                      fontSize: 14,
                      color: "var(--pierre,#9C958D)",
                      lineHeight: 1.4,
                      margin: 0,
                    }}
                  >
                    {excerpt(d.descriptionBesoin, 60)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div style={{ textAlign: "center", padding: "56px 20px" }}>
          <svg
            width="56"
            height="56"
            fill="none"
            stroke="var(--sable,#E8D5C0)"
            strokeWidth="1"
            viewBox="0 0 24 24"
            style={{ margin: "0 auto 16px" }}
          >
            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
          </svg>
          <p style={{ fontSize: 15, color: "var(--pierre,#9C958D)" }}>
            Aucune demande de devis
          </p>
          <p
            style={{
              fontSize: 13,
              color: "var(--pierre,#9C958D)",
              opacity: 0.6,
              marginTop: 4,
            }}
          >
            Les nouvelles demandes appara&icirc;tront ici.
          </p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 12,
            marginTop: 24,
          }}
        >
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            style={{
              fontSize: 14,
              color: "var(--pierre,#9C958D)",
              background: "none",
              border: "none",
              cursor: "pointer",
              opacity: page === 0 ? 0.3 : 1,
            }}
          >
            Pr&eacute;c&eacute;dent
          </button>
          <span style={{ fontSize: 14, color: "var(--pierre,#9C958D)" }}>
            Page {page + 1} / {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
            style={{
              fontSize: 14,
              color: "var(--pierre,#9C958D)",
              background: "none",
              border: "none",
              cursor: "pointer",
              opacity: page >= totalPages - 1 ? 0.3 : 1,
            }}
          >
            Suivant
          </button>
        </div>
      )}
    </div>
  );
}
