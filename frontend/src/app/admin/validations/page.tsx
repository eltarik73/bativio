"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";

/* ═══════════════════════════════════════════
   Admin — Artisan validation queue
   ═══════════════════════════════════════════ */

interface ScoringAnswer {
  key: string;
  label: string;
  value: number;
  chosenLabel: string;
}

interface PendingArtisan {
  id: string;
  nomAffichage: string;
  metier?: string;
  metierNom?: string;
  ville?: string;
  score?: number;
  scorePercent?: number;
  createdAt?: string;
  date?: string;
  answers?: ScoringAnswer[] | Record<string, number>;
}

interface ListResponse {
  validations?: PendingArtisan[];
  artisans?: PendingArtisan[];
  content?: PendingArtisan[];
}

// ─── Toast component ───
function Toast({ message, type, onClose }: { message: string; type: "success" | "error"; onClose: () => void }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div style={{
      position: "fixed",
      top: 24,
      right: 24,
      zIndex: 9999,
      background: type === "success" ? "var(--mousse, #4A6741)" : "#DC2626",
      color: "#fff",
      padding: "14px 24px",
      borderRadius: 10,
      fontSize: 14,
      fontWeight: 600,
      boxShadow: "0 8px 24px rgba(0,0,0,.15)",
      animation: "fadeIn .2s ease",
    }}>
      {message}
    </div>
  );
}

// ─── Spinner ───
function Spinner({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ animation: "spin 1s linear infinite" }}>
      <circle cx="12" cy="12" r="10" stroke="var(--g300, #C5C0B9)" strokeWidth="3" />
      <path d="M12 2a10 10 0 019.8 8" stroke="var(--terre, #C4531A)" strokeWidth="3" strokeLinecap="round" />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </svg>
  );
}

// Labels for scoring answer keys (same as form)
const ANSWER_KEY_LABELS: Record<string, string> = {
  anciennete: "Anciennet\u00e9",
  statut_juridique: "Statut juridique",
  assurance: "Assurance",
  effectif: "Effectif",
  labels: "Labels",
  photos: "Photos",
  avis: "Avis clients",
  presence_en_ligne: "Pr\u00e9sence en ligne",
  zone: "Zone g\u00e9ographique",
  plan: "Plan souhait\u00e9",
};

export default function AdminValidationsPage() {
  const { fetchWithAuth } = useAuth();

  const [artisans, setArtisans] = useState<PendingArtisan[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [rejectMotif, setRejectMotif] = useState("");
  const [showRejectFor, setShowRejectFor] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const fetchValidations = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchWithAuth("/admin/validations") as ListResponse;
      setArtisans(data.validations || data.artisans || data.content || []);
    } catch {
      setArtisans([]);
    } finally {
      setLoading(false);
    }
  }, [fetchWithAuth]);

  useEffect(() => {
    fetchValidations();
  }, [fetchValidations]);

  const handleApprove = async (id: string) => {
    setActionLoading(id);
    try {
      await fetchWithAuth(`/admin/validations/${id}/approve`, { method: "POST" });
      setToast({ message: "Artisan valid\u00e9", type: "success" });
      setExpandedId(null);
      await fetchValidations();
    } catch {
      setToast({ message: "Erreur lors de la validation", type: "error" });
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id: string) => {
    if (!rejectMotif.trim()) return;
    setActionLoading(id);
    try {
      await fetchWithAuth(`/admin/validations/${id}/reject`, {
        method: "POST",
        body: JSON.stringify({ motif: rejectMotif.trim() }),
      });
      setToast({ message: "Artisan refus\u00e9", type: "success" });
      setExpandedId(null);
      setShowRejectFor(null);
      setRejectMotif("");
      await fetchValidations();
    } catch {
      setToast({ message: "Erreur lors du refus", type: "error" });
    } finally {
      setActionLoading(null);
    }
  };

  const toggleExpand = (id: string) => {
    if (expandedId === id) {
      setExpandedId(null);
      setShowRejectFor(null);
      setRejectMotif("");
    } else {
      setExpandedId(id);
      setShowRejectFor(null);
      setRejectMotif("");
    }
  };

  const formatDate = (d?: string) => {
    if (!d) return "\u2014";
    try {
      return new Date(d).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
    } catch {
      return d;
    }
  };

  // Render answers regardless of format (array or object)
  const renderAnswers = (artisan: PendingArtisan) => {
    const ans = artisan.answers;
    if (!ans) return <p style={{ fontSize: 13, color: "var(--pierre, #9C958D)" }}>Aucune r\u00e9ponse enregistr\u00e9e</p>;

    // If array format
    if (Array.isArray(ans)) {
      return (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 10 }}>
          {ans.map((a) => (
            <div key={a.key} style={{ background: "var(--g50, #F7F5F2)", borderRadius: 8, padding: "10px 14px" }}>
              <span style={{ fontSize: 12, color: "var(--pierre, #9C958D)", display: "block", marginBottom: 2 }}>
                {a.label || ANSWER_KEY_LABELS[a.key] || a.key}
              </span>
              <span style={{ fontSize: 14, fontWeight: 600, color: "var(--anthracite, #1C1C1E)" }}>
                {a.chosenLabel || a.value}
              </span>
              <span style={{ fontSize: 12, color: "var(--pierre, #9C958D)", marginLeft: 6 }}>({a.value} pts)</span>
            </div>
          ))}
        </div>
      );
    }

    // If object format { key: value }
    return (
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 10 }}>
        {Object.entries(ans).map(([key, val]) => (
          <div key={key} style={{ background: "var(--g50, #F7F5F2)", borderRadius: 8, padding: "10px 14px" }}>
            <span style={{ fontSize: 12, color: "var(--pierre, #9C958D)", display: "block", marginBottom: 2 }}>
              {ANSWER_KEY_LABELS[key] || key}
            </span>
            <span style={{ fontSize: 14, fontWeight: 600, color: "var(--anthracite, #1C1C1E)" }}>
              {val} pts
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div>
      <style>{`@keyframes fadeIn{from{opacity:0}to{opacity:1}} @keyframes spin{to{transform:rotate(360deg)}}`}</style>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 24, fontWeight: 700, color: "var(--anthracite, #1C1C1E)", marginBottom: 6 }}>
          Validations
        </h1>
        <p style={{ fontSize: 14, color: "var(--pierre, #9C958D)" }}>
          Artisans en attente de validation manuelle
        </p>
      </div>

      {/* Loading */}
      {loading && (
        <div style={{ display: "flex", justifyContent: "center", padding: 48 }}>
          <Spinner size={28} />
        </div>
      )}

      {/* Empty */}
      {!loading && artisans.length === 0 && (
        <div style={{
          background: "var(--blanc, #FFFFFF)",
          border: "1px solid var(--g100, #EDEBE7)",
          borderRadius: 14,
          padding: 48,
          textAlign: "center",
        }}>
          <p style={{ fontSize: 16, color: "var(--pierre, #9C958D)", fontWeight: 500 }}>
            Aucune demande en attente
          </p>
        </div>
      )}

      {/* List */}
      {!loading && artisans.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {artisans.map((artisan) => {
            const isExpanded = expandedId === artisan.id;
            const isShowReject = showRejectFor === artisan.id;
            const isLoading = actionLoading === artisan.id;
            const scoreDisplay = artisan.scorePercent != null ? `${artisan.scorePercent}%` : artisan.score != null ? `${artisan.score}%` : "\u2014";

            return (
              <div
                key={artisan.id}
                style={{
                  background: "var(--blanc, #FFFFFF)",
                  border: "1px solid var(--g100, #EDEBE7)",
                  borderRadius: 14,
                  overflow: "hidden",
                  transition: "box-shadow .2s",
                }}
              >
                {/* Row */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "16px 24px",
                    gap: 16,
                    flexWrap: "wrap",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 16, flex: 1, minWidth: 200 }}>
                    <div>
                      <p style={{ fontSize: 15, fontWeight: 600, color: "var(--anthracite, #1C1C1E)" }}>
                        {artisan.nomAffichage}
                      </p>
                      <p style={{ fontSize: 13, color: "var(--pierre, #9C958D)" }}>
                        {artisan.metierNom || artisan.metier || "\u2014"} &middot; {artisan.ville || "\u2014"}
                      </p>
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    {/* Score badge */}
                    <span style={{
                      background: "var(--or-light, #FDF5E8)",
                      color: "var(--or, #C9943A)",
                      fontSize: 13,
                      fontWeight: 700,
                      padding: "4px 12px",
                      borderRadius: 8,
                    }}>
                      {scoreDisplay}
                    </span>

                    {/* Date */}
                    <span style={{ fontSize: 13, color: "var(--pierre, #9C958D)", minWidth: 80 }}>
                      {formatDate(artisan.createdAt || artisan.date)}
                    </span>

                    {/* Toggle button */}
                    <button
                      type="button"
                      onClick={() => toggleExpand(artisan.id)}
                      style={{
                        background: isExpanded ? "var(--g100, #EDEBE7)" : "var(--blanc, #FFFFFF)",
                        border: "1.5px solid var(--g200, #E0DDD8)",
                        borderRadius: 8,
                        padding: "8px 18px",
                        fontSize: 13,
                        fontWeight: 600,
                        color: "var(--anthracite, #1C1C1E)",
                        cursor: "pointer",
                        transition: "all .15s",
                      }}
                    >
                      {isExpanded ? "Masquer" : "Voir"}
                    </button>
                  </div>
                </div>

                {/* Expanded detail */}
                {isExpanded && (
                  <div style={{
                    borderTop: "1px solid var(--g100, #EDEBE7)",
                    padding: 24,
                    animation: "fadeIn .2s ease",
                  }}>
                    {/* Scoring answers */}
                    <h3 style={{ fontSize: 14, fontWeight: 600, color: "var(--anthracite, #1C1C1E)", marginBottom: 14 }}>
                      R\u00e9ponses du scoring
                    </h3>
                    {renderAnswers(artisan)}

                    {/* Action buttons */}
                    <div style={{ display: "flex", gap: 12, marginTop: 24, flexWrap: "wrap", alignItems: "flex-start" }}>
                      {/* Approve */}
                      <button
                        type="button"
                        onClick={() => handleApprove(artisan.id)}
                        disabled={isLoading}
                        style={{
                          background: "var(--mousse, #4A6741)",
                          color: "#fff",
                          border: "none",
                          borderRadius: 8,
                          padding: "10px 24px",
                          fontSize: 14,
                          fontWeight: 600,
                          cursor: isLoading ? "not-allowed" : "pointer",
                          opacity: isLoading ? 0.6 : 1,
                          transition: "all .15s",
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                        }}
                      >
                        {isLoading ? <Spinner size={16} /> : null}
                        Valider
                      </button>

                      {/* Reject toggle */}
                      {!isShowReject && (
                        <button
                          type="button"
                          onClick={() => setShowRejectFor(artisan.id)}
                          disabled={isLoading}
                          style={{
                            background: "#FEF2F2",
                            color: "#DC2626",
                            border: "1.5px solid #FECACA",
                            borderRadius: 8,
                            padding: "10px 24px",
                            fontSize: 14,
                            fontWeight: 600,
                            cursor: isLoading ? "not-allowed" : "pointer",
                            opacity: isLoading ? 0.6 : 1,
                            transition: "all .15s",
                          }}
                        >
                          Refuser
                        </button>
                      )}
                    </div>

                    {/* Reject motif */}
                    {isShowReject && (
                      <div style={{ marginTop: 16, animation: "fadeIn .2s ease" }}>
                        <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--anthracite, #1C1C1E)", marginBottom: 6 }}>
                          Motif du refus <span style={{ color: "#DC2626" }}>*</span>
                        </label>
                        <textarea
                          value={rejectMotif}
                          onChange={(e) => setRejectMotif(e.target.value)}
                          placeholder="Expliquez la raison du refus..."
                          rows={3}
                          style={{
                            width: "100%",
                            padding: "12px 14px",
                            borderRadius: 10,
                            border: "1.5px solid var(--g200, #E0DDD8)",
                            fontSize: 14,
                            fontFamily: "'Karla', sans-serif",
                            color: "var(--anthracite, #1C1C1E)",
                            background: "var(--blanc, #FFFFFF)",
                            resize: "vertical",
                            outline: "none",
                          }}
                          onFocus={(e) => { e.currentTarget.style.borderColor = "var(--terre, #C4531A)"; }}
                          onBlur={(e) => { e.currentTarget.style.borderColor = "var(--g200, #E0DDD8)"; }}
                        />
                        <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
                          <button
                            type="button"
                            onClick={() => handleReject(artisan.id)}
                            disabled={isLoading || !rejectMotif.trim()}
                            style={{
                              background: "#DC2626",
                              color: "#fff",
                              border: "none",
                              borderRadius: 8,
                              padding: "10px 24px",
                              fontSize: 14,
                              fontWeight: 600,
                              cursor: isLoading || !rejectMotif.trim() ? "not-allowed" : "pointer",
                              opacity: isLoading || !rejectMotif.trim() ? 0.5 : 1,
                              transition: "all .15s",
                              display: "flex",
                              alignItems: "center",
                              gap: 8,
                            }}
                          >
                            {isLoading ? <Spinner size={16} /> : null}
                            Confirmer le refus
                          </button>
                          <button
                            type="button"
                            onClick={() => { setShowRejectFor(null); setRejectMotif(""); }}
                            style={{
                              background: "var(--g50, #F7F5F2)",
                              color: "var(--g500, #6B6560)",
                              border: "1px solid var(--g200, #E0DDD8)",
                              borderRadius: 8,
                              padding: "10px 20px",
                              fontSize: 14,
                              fontWeight: 500,
                              cursor: "pointer",
                              transition: "all .15s",
                            }}
                          >
                            Annuler
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
