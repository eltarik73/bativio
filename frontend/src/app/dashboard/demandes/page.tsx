"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

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
  REPONDU: "Devis envoyé",
  ACCEPTE: "Acceptée",
  REFUSE: "Refusée",
  ARCHIVE: "Archivée",
};

const BG: Record<string, string> = {
  NOUVEAU: "rgba(220,38,38,.08)",
  VU: "rgba(232,168,76,.08)",
  REPONDU: "rgba(37,99,235,.08)",
  ACCEPTE: "rgba(22,163,74,.08)",
  REFUSE: "rgba(155,149,144,.08)",
  ARCHIVE: "rgba(197,192,185,.08)",
};

const ACTIVE_STATUSES = ["NOUVEAU", "VU", "REPONDU"];
const ARCHIVED_STATUSES = ["ACCEPTE", "REFUSE", "ARCHIVE"];

interface Demande {
  id: string;
  nomClient: string | null;
  telephoneClient: string | null;
  emailClient: string | null;
  clientVille?: string;
  descriptionBesoin: string;
  urgence?: string;
  statut: string;
  reponduAt: string | null;
  createdAt: string;
  messageCount: number;
  lastMessageAt: string | null;
  masque?: boolean;
}

function timeAgo(iso: string): string {
  const d = new Date(iso);
  const diff = Date.now() - d.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "À l'instant";
  if (mins < 60) return `il y a ${mins} min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `il y a ${hours}h`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "Hier";
  if (days < 7) return `il y a ${days} jours`;
  return d.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
}

function initials(name: string): string {
  return name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
}

function excerpt(text: string, max = 60): string {
  if (!text) return "";
  return text.length <= max ? text : text.slice(0, max).trimEnd() + "…";
}

export default function DemandesPage() {
  const { fetchWithAuth } = useAuth();
  const router = useRouter();
  const [demandes, setDemandes] = useState<Demande[]>([]);
  const [tab, setTab] = useState<"active" | "archived">("active");
  const [loading, setLoading] = useState(true);
  const [masqueCount, setMasqueCount] = useState(0);
  const [toast, setToast] = useState<{ message: string; undoId?: string } | null>(null);

  const fetchDemandes = useCallback(async () => {
    setLoading(true);
    try {
      const data = (await fetchWithAuth("/artisan/demandes?size=100")) as {
        demandes?: Demande[];
        masqueCount?: number;
      };
      setDemandes(data.demandes || []);
      setMasqueCount(data.masqueCount || 0);
    } catch { /* empty */ } finally {
      setLoading(false);
    }
  }, [fetchWithAuth]);

  useEffect(() => { fetchDemandes(); }, [fetchDemandes]);

  const handleArchive = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await fetchWithAuth(`/artisan/demandes/${id}/status`, {
        method: "PUT",
        body: JSON.stringify({ status: "ARCHIVE" }),
      });
      setDemandes((prev) => prev.map((d) => d.id === id ? { ...d, statut: "ARCHIVE" } : d));
      setToast({ message: "Demande archivée", undoId: id });
      setTimeout(() => setToast(null), 5000);
    } catch { /* empty */ }
  };

  const handleUnarchive = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await fetchWithAuth(`/artisan/demandes/${id}/status`, {
        method: "PUT",
        body: JSON.stringify({ status: "VU" }),
      });
      setDemandes((prev) => prev.map((d) => d.id === id ? { ...d, statut: "VU" } : d));
      setToast({ message: "Demande remise en cours" });
      setTimeout(() => setToast(null), 3000);
    } catch { /* empty */ }
  };

  const handleUndoArchive = async (id: string) => {
    try {
      await fetchWithAuth(`/artisan/demandes/${id}/status`, {
        method: "PUT",
        body: JSON.stringify({ status: "VU" }),
      });
      setDemandes((prev) => prev.map((d) => d.id === id ? { ...d, statut: "VU" } : d));
      setToast(null);
    } catch { /* empty */ }
  };

  const activeDemandes = demandes.filter((d) => ACTIVE_STATUSES.includes(d.statut));
  const archivedDemandes = demandes.filter((d) => ARCHIVED_STATUSES.includes(d.statut));
  const displayed = tab === "active" ? activeDemandes : archivedDemandes;
  const newCount = demandes.filter((d) => d.statut === "NOUVEAU").length;

  return (
    <div style={{ maxWidth: 800, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
        <h1 style={{ fontFamily: "'Fraunces',serif", fontSize: 24, fontWeight: 700, color: "var(--bois,#3D2E1F)" }}>
          Demandes de devis
        </h1>
        {newCount > 0 && (
          <span style={{ background: "#dc2626", color: "#fff", fontSize: 12, fontWeight: 700, padding: "3px 10px", borderRadius: 10 }}>
            {newCount} nouvelle{newCount > 1 ? "s" : ""}
          </span>
        )}
      </div>

      {/* Tabs: En cours / Archivées */}
      <div style={{ display: "flex", gap: 0, marginBottom: 24, borderBottom: "1px solid var(--sable,#E8D5C0)" }}>
        <button
          onClick={() => setTab("active")}
          style={{
            padding: "10px 20px", fontSize: 14, fontWeight: 600, cursor: "pointer",
            background: "none", border: "none", borderBottom: tab === "active" ? "2px solid var(--terre,#C4531A)" : "2px solid transparent",
            color: tab === "active" ? "var(--terre,#C4531A)" : "var(--pierre,#9C958D)",
            fontFamily: "'Karla',sans-serif", transition: "all .15s",
          }}
        >
          En cours ({activeDemandes.length})
        </button>
        <button
          onClick={() => setTab("archived")}
          style={{
            padding: "10px 20px", fontSize: 14, fontWeight: 600, cursor: "pointer",
            background: "none", border: "none", borderBottom: tab === "archived" ? "2px solid var(--terre,#C4531A)" : "2px solid transparent",
            color: tab === "archived" ? "var(--terre,#C4531A)" : "var(--pierre,#9C958D)",
            fontFamily: "'Karla',sans-serif", transition: "all .15s",
          }}
        >
          Archivées ({archivedDemandes.length})
        </button>
      </div>

      {/* Masked leads banner */}
      {masqueCount > 0 && tab === "active" && (
        <div style={{ background: "rgba(196,83,26,.06)", border: "1px solid rgba(196,83,26,.15)", borderRadius: 12, padding: 16, marginBottom: 20, display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <span style={{ fontSize: 20 }}>🔒</span>
          <span style={{ flex: 1, minWidth: 200, fontSize: 14, color: "var(--bois,#3D2E1F)", lineHeight: 1.5 }}>
            <strong>{masqueCount} client{masqueCount > 1 ? "s" : ""}</strong> vous {masqueCount > 1 ? "ont" : "a"} contacté mais {masqueCount > 1 ? "leurs" : "ses"} coordonnées sont masquées.
          </span>
          <a href="/dashboard/abonnement" style={{ display: "inline-block", padding: "10px 22px", background: "var(--terre,#C4531A)", color: "#fff", borderRadius: 8, fontSize: 14, fontWeight: 700, textDecoration: "none", whiteSpace: "nowrap" }}>
            Débloquer →
          </a>
        </div>
      )}

      {/* List */}
      {loading ? (
        <div style={{ textAlign: "center", padding: 40, color: "var(--pierre,#9C958D)", fontSize: 14 }}>Chargement...</div>
      ) : displayed.length > 0 ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {displayed.map((d) => {
            const isNew = d.statut === "NOUVEAU";
            const isMasked = d.masque === true;
            const isArchived = ARCHIVED_STATUSES.includes(d.statut);
            return (
              <div
                key={d.id}
                onClick={() => router.push(`/dashboard/devis/${d.id}`)}
                style={{
                  background: "#fff", borderRadius: 14,
                  border: isMasked ? "1px solid rgba(196,83,26,.15)" : isNew ? "1.5px solid var(--terre,#C4531A)" : "1px solid var(--sable,#E8D5C0)",
                  padding: "18px 20px", cursor: "pointer", transition: "all .2s",
                  display: "flex", alignItems: "flex-start", gap: 14, position: "relative",
                  opacity: isArchived ? 0.7 : 1,
                }}
              >
                {/* Indicator */}
                {isMasked ? (
                  <span style={{ position: "absolute", top: 10, right: 10, fontSize: 14 }}>🔒</span>
                ) : isNew && (
                  <span style={{ position: "absolute", top: 10, right: 10, width: 10, height: 10, borderRadius: "50%", background: "#dc2626", animation: "pulse 1.5s infinite" }} />
                )}

                {/* Avatar */}
                <div style={{
                  width: 44, height: 44, borderRadius: "50%",
                  background: isMasked ? "var(--sable,#E8D5C0)" : "linear-gradient(135deg, var(--terre,#C4531A), var(--argile,#D4733A))",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: isMasked ? "var(--pierre,#9C958D)" : "#fff", fontSize: 14, fontWeight: 700, flexShrink: 0,
                }}>
                  {isMasked ? "🔒" : initials(d.nomClient || "?")}
                </div>

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 15, fontWeight: 700, color: isMasked ? "var(--pierre,#9C958D)" : "var(--bois,#3D2E1F)" }}>
                      {isMasked ? "●●●●●●●●" : d.nomClient}
                    </span>
                    {isMasked ? (
                      <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 4, background: "rgba(196,83,26,.06)", color: "var(--terre,#C4531A)", whiteSpace: "nowrap" }}>
                        Coordonnées masquées
                      </span>
                    ) : (
                      <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 4, background: BG[d.statut] || BG.ARCHIVE, color: DOT[d.statut] || "#9B9590", whiteSpace: "nowrap" }}>
                        {LABEL[d.statut] || d.statut}
                      </span>
                    )}
                    {d.urgence === "urgent" && (
                      <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 4, background: "rgba(220,38,38,.1)", color: "#dc2626", textTransform: "uppercase", letterSpacing: 0.5 }}>
                        Urgent
                      </span>
                    )}
                    <span style={{ fontSize: 12, color: "var(--pierre,#9C958D)", marginLeft: "auto", whiteSpace: "nowrap", flexShrink: 0 }}>
                      {timeAgo(d.createdAt)}
                    </span>
                  </div>
                  <p style={{ fontSize: 14, color: "var(--pierre,#9C958D)", lineHeight: 1.4, margin: 0 }}>
                    {excerpt(d.descriptionBesoin, 60)}
                  </p>

                  {/* Action buttons */}
                  <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
                    {!isArchived && !isMasked && (
                      <button
                        onClick={(e) => handleArchive(d.id, e)}
                        style={{ fontSize: 12, color: "var(--pierre,#9C958D)", background: "none", border: "none", cursor: "pointer", fontFamily: "'Karla',sans-serif", padding: "2px 0" }}
                        onMouseEnter={(e) => { e.currentTarget.style.color = "var(--terre,#C4531A)"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.color = "var(--pierre,#9C958D)"; }}
                      >
                        Archiver
                      </button>
                    )}
                    {isArchived && (
                      <button
                        onClick={(e) => handleUnarchive(d.id, e)}
                        style={{ fontSize: 12, color: "var(--terre,#C4531A)", background: "none", border: "none", cursor: "pointer", fontFamily: "'Karla',sans-serif", fontWeight: 500, padding: "2px 0" }}
                      >
                        Remettre en cours
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div style={{ textAlign: "center", padding: "56px 20px" }}>
          <svg width="56" height="56" fill="none" stroke="var(--sable,#E8D5C0)" strokeWidth="1" viewBox="0 0 24 24" style={{ margin: "0 auto 16px" }}>
            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
          </svg>
          <p style={{ fontSize: 15, color: "var(--pierre,#9C958D)" }}>
            {tab === "active" ? "Aucune demande en cours" : "Aucune demande archivée"}
          </p>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div style={{
          position: "fixed", bottom: 80, left: "50%", transform: "translateX(-50%)",
          background: "var(--bois,#3D2E1F)", color: "#fff", padding: "12px 20px", borderRadius: 10,
          fontSize: 14, fontWeight: 500, boxShadow: "0 4px 20px rgba(0,0,0,.15)", zIndex: 999,
          display: "flex", alignItems: "center", gap: 12, animation: "slideUp .3s ease",
        }}>
          {toast.message}
          {toast.undoId && (
            <button
              onClick={() => handleUndoArchive(toast.undoId!)}
              style={{ color: "var(--argile,#D4956B)", background: "none", border: "none", cursor: "pointer", fontWeight: 600, fontSize: 13, fontFamily: "'Karla',sans-serif" }}
            >
              Annuler
            </button>
          )}
          <style>{`@keyframes slideUp{from{opacity:0;transform:translateX(-50%) translateY(8px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}`}</style>
        </div>
      )}

      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}`}</style>
    </div>
  );
}
