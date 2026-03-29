"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

/* ── Types ── */
interface Rdv {
  id: string;
  clientNom: string;
  clientTelephone?: string;
  clientEmail?: string;
  date: string; // ISO date
  heureDebut: string; // "08:00"
  heureFin: string; // "09:00"
  objet: string;
  statut: "EN_ATTENTE" | "CONFIRME" | "ANNULE" | "TERMINE";
  notes?: string;
}

/* ── Helpers ── */
const JOURS = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
const MOIS = [
  "janvier", "février", "mars", "avril", "mai", "juin",
  "juillet", "août", "septembre", "octobre", "novembre", "décembre",
];

function getMonday(d: Date): Date {
  const date = new Date(d);
  const day = date.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  date.setDate(date.getDate() + diff);
  date.setHours(0, 0, 0, 0);
  return date;
}

function addDays(d: Date, n: number): Date {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
}

function fmtDate(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function fmtDayLabel(d: Date): string {
  return `${JOURS[d.getDay()]} ${d.getDate()} ${MOIS[d.getMonth()]}`;
}

function weekLabel(monday: Date): string {
  const sunday = addDays(monday, 6);
  if (monday.getMonth() === sunday.getMonth()) {
    return `${monday.getDate()} – ${sunday.getDate()} ${MOIS[monday.getMonth()]} ${monday.getFullYear()}`;
  }
  return `${monday.getDate()} ${MOIS[monday.getMonth()]} – ${sunday.getDate()} ${MOIS[sunday.getMonth()]} ${sunday.getFullYear()}`;
}

const STATUT_STYLES: Record<string, { bg: string; border: string; text: string; badge?: string; badgeBg?: string; strike?: boolean }> = {
  EN_ATTENTE: { bg: "#FFF7ED", border: "#FDBA74", text: "#9A3412", badge: "En attente", badgeBg: "#FDBA74" },
  CONFIRME: { bg: "#F0FDF4", border: "#86EFAC", text: "#166534", badge: "Confirmé", badgeBg: "#86EFAC" },
  ANNULE: { bg: "#FEF2F2", border: "#FCA5A5", text: "#991B1B", badge: "Annulé", badgeBg: "#FCA5A5", strike: true },
  TERMINE: { bg: "#F9FAFB", border: "#D1D5DB", text: "#6B7280", badge: "Terminé", badgeBg: "#D1D5DB" },
};

/* ── Component ── */
export default function AgendaPage() {
  const { fetchWithAuth } = useAuth();

  const [monday, setMonday] = useState<Date>(() => getMonday(new Date()));
  const [rdvs, setRdvs] = useState<Rdv[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Inline form state
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ clientNom: "", clientTelephone: "", date: "", heure: "", objet: "" });
  const [formError, setFormError] = useState("");
  const [formSaving, setFormSaving] = useState(false);

  const fetchRdvs = useCallback(async (mon: Date) => {
    setLoading(true);
    try {
      const from = fmtDate(mon);
      const to = fmtDate(addDays(mon, 6));
      const data = await fetchWithAuth(`/artisans/me/rdv?from=${from}&to=${to}`);
      const list = Array.isArray(data) ? data : (data as { content?: Rdv[] })?.content || [];
      setRdvs(list as Rdv[]);
    } catch {
      setRdvs([]);
    } finally {
      setLoading(false);
    }
  }, [fetchWithAuth]);

  useEffect(() => {
    fetchRdvs(monday);
  }, [monday, fetchRdvs]);

  const prevWeek = () => setMonday((m) => addDays(m, -7));
  const nextWeek = () => setMonday((m) => addDays(m, 7));
  const goToday = () => setMonday(getMonday(new Date()));

  /* Actions */
  const handleAction = async (rdvId: string, action: "confirmer" | "annuler" | "reporter") => {
    setActionLoading(rdvId);
    try {
      await fetchWithAuth(`/artisans/me/rdv/${rdvId}/${action}`, { method: "PUT" });
      await fetchRdvs(monday);
      setExpandedId(null);
    } catch {
      // silent
    } finally {
      setActionLoading(null);
    }
  };

  /* Add RDV */
  const handleAddRdv = async () => {
    setFormError("");
    if (!form.clientNom || !form.date || !form.heure || !form.objet) {
      setFormError("Veuillez remplir tous les champs obligatoires.");
      return;
    }
    setFormSaving(true);
    try {
      await fetchWithAuth("/artisans/me/rdv", {
        method: "POST",
        body: JSON.stringify({
          clientNom: form.clientNom,
          clientTelephone: form.clientTelephone,
          date: form.date,
          heureDebut: form.heure,
          objet: form.objet,
        }),
      });
      setForm({ clientNom: "", clientTelephone: "", date: "", heure: "", objet: "" });
      setShowForm(false);
      await fetchRdvs(monday);
    } catch (e: unknown) {
      setFormError(e instanceof Error ? e.message : "Erreur lors de la création du RDV.");
    } finally {
      setFormSaving(false);
    }
  };

  /* Group RDVs by date */
  const days = Array.from({ length: 7 }, (_, i) => addDays(monday, i));
  const rdvsByDate: Record<string, Rdv[]> = {};
  for (const d of days) rdvsByDate[fmtDate(d)] = [];
  for (const r of rdvs) {
    const key = r.date?.slice(0, 10);
    if (rdvsByDate[key]) rdvsByDate[key].push(r);
    else rdvsByDate[key] = [r];
  }

  const todayStr = fmtDate(new Date());

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 28 }}>
        <h1 style={{ fontFamily: "'Fraunces',serif", fontSize: 26, fontWeight: 700, color: "#1C1C1E", margin: 0 }}>
          Agenda
        </h1>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <Link
            href="/dashboard/agenda/disponibilites"
            style={{
              display: "inline-flex", alignItems: "center", gap: 6, padding: "10px 18px",
              borderRadius: 10, fontSize: 13, fontWeight: 600,
              border: "1.5px solid #EDEBE7", background: "#fff", color: "#1C1C1E",
              textDecoration: "none", transition: "all .15s",
            }}
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
            Mes disponibilités
          </Link>
          <button
            onClick={() => setShowForm((v) => !v)}
            style={{
              display: "inline-flex", alignItems: "center", gap: 6, padding: "10px 18px",
              borderRadius: 10, fontSize: 13, fontWeight: 600,
              background: "#C4531A", color: "#fff", border: "none", cursor: "pointer",
              transition: "all .15s",
            }}
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>
            Ajouter un RDV
          </button>
        </div>
      </div>

      {/* Inline add form */}
      {showForm && (
        <div style={{
          background: "#fff", borderRadius: 14, border: "1.5px solid #EDEBE7", padding: 24,
          marginBottom: 20, boxShadow: "0 4px 24px rgba(28,28,30,.04)",
        }}>
          <h3 style={{ fontFamily: "'Fraunces',serif", fontSize: 17, fontWeight: 700, color: "#1C1C1E", marginBottom: 16 }}>
            Nouveau rendez-vous
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: 12 }}>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#6B6560", marginBottom: 4 }}>Nom du client *</label>
              <input
                value={form.clientNom}
                onChange={(e) => setForm((f) => ({ ...f, clientNom: e.target.value }))}
                placeholder="Jean Dupont"
                style={{
                  width: "100%", padding: "10px 12px", borderRadius: 8, border: "1.5px solid #EDEBE7",
                  fontSize: 14, outline: "none", fontFamily: "'Karla',sans-serif",
                }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#6B6560", marginBottom: 4 }}>Téléphone</label>
              <input
                value={form.clientTelephone}
                onChange={(e) => setForm((f) => ({ ...f, clientTelephone: e.target.value }))}
                placeholder="06 12 34 56 78"
                style={{
                  width: "100%", padding: "10px 12px", borderRadius: 8, border: "1.5px solid #EDEBE7",
                  fontSize: 14, outline: "none", fontFamily: "'Karla',sans-serif",
                }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#6B6560", marginBottom: 4 }}>Date *</label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                style={{
                  width: "100%", padding: "10px 12px", borderRadius: 8, border: "1.5px solid #EDEBE7",
                  fontSize: 14, outline: "none", fontFamily: "'Karla',sans-serif",
                }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#6B6560", marginBottom: 4 }}>Heure *</label>
              <input
                type="time"
                value={form.heure}
                onChange={(e) => setForm((f) => ({ ...f, heure: e.target.value }))}
                style={{
                  width: "100%", padding: "10px 12px", borderRadius: 8, border: "1.5px solid #EDEBE7",
                  fontSize: 14, outline: "none", fontFamily: "'Karla',sans-serif",
                }}
              />
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#6B6560", marginBottom: 4 }}>Objet *</label>
              <input
                value={form.objet}
                onChange={(e) => setForm((f) => ({ ...f, objet: e.target.value }))}
                placeholder="Installation chauffe-eau, dépannage..."
                style={{
                  width: "100%", padding: "10px 12px", borderRadius: 8, border: "1.5px solid #EDEBE7",
                  fontSize: 14, outline: "none", fontFamily: "'Karla',sans-serif",
                }}
              />
            </div>
          </div>
          {formError && (
            <p style={{ color: "#DC2626", fontSize: 13, marginTop: 10 }}>{formError}</p>
          )}
          <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
            <button
              onClick={handleAddRdv}
              disabled={formSaving}
              style={{
                padding: "10px 22px", borderRadius: 10, fontSize: 13, fontWeight: 600,
                background: "#C4531A", color: "#fff", border: "none", cursor: "pointer",
                opacity: formSaving ? 0.6 : 1, transition: "all .15s",
              }}
            >
              {formSaving ? "Enregistrement..." : "Créer le RDV"}
            </button>
            <button
              onClick={() => { setShowForm(false); setFormError(""); }}
              style={{
                padding: "10px 22px", borderRadius: 10, fontSize: 13, fontWeight: 600,
                background: "#F7F5F2", color: "#6B6560", border: "none", cursor: "pointer",
                transition: "all .15s",
              }}
            >
              Annuler
            </button>
          </div>
        </div>
      )}

      {/* Week navigation */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
        marginBottom: 20, flexWrap: "wrap",
      }}>
        <button
          onClick={prevWeek}
          style={{
            display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 14px",
            borderRadius: 8, fontSize: 13, fontWeight: 600, background: "#fff",
            border: "1.5px solid #EDEBE7", color: "#6B6560", cursor: "pointer",
          }}
        >
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6"/></svg>
          Semaine précédente
        </button>

        <div style={{ textAlign: "center" }}>
          <span style={{ fontFamily: "'Fraunces',serif", fontSize: 16, fontWeight: 700, color: "#1C1C1E" }}>
            {weekLabel(monday)}
          </span>
          {fmtDate(monday) !== fmtDate(getMonday(new Date())) && (
            <button
              onClick={goToday}
              style={{
                display: "block", margin: "4px auto 0", fontSize: 12, fontWeight: 600,
                color: "#C4531A", background: "none", border: "none", cursor: "pointer",
                textDecoration: "underline",
              }}
            >
              Aujourd&apos;hui
            </button>
          )}
        </div>

        <button
          onClick={nextWeek}
          style={{
            display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 14px",
            borderRadius: 8, fontSize: 13, fontWeight: 600, background: "#fff",
            border: "1.5px solid #EDEBE7", color: "#6B6560", cursor: "pointer",
          }}
        >
          Semaine suivante
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg>
        </button>
      </div>

      {/* Week grid */}
      {loading ? (
        <div style={{ textAlign: "center", padding: 60, color: "#9B9590", fontSize: 14 }}>
          Chargement...
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 10 }} className="max-md:!grid-cols-1">
          {days.map((day) => {
            const key = fmtDate(day);
            const isToday = key === todayStr;
            const dayRdvs = (rdvsByDate[key] || []).sort((a, b) => (a.heureDebut || "").localeCompare(b.heureDebut || ""));

            return (
              <div
                key={key}
                style={{
                  background: isToday ? "rgba(196,83,26,.04)" : "#fff",
                  borderRadius: 14,
                  border: isToday ? "1.5px solid #C4531A" : "1.5px solid #EDEBE7",
                  overflow: "hidden",
                  minHeight: 180,
                }}
              >
                {/* Day header */}
                <div style={{
                  padding: "10px 12px",
                  background: isToday ? "rgba(196,83,26,.08)" : "#F7F5F2",
                  borderBottom: "1px solid #EDEBE7",
                  textAlign: "center",
                }}>
                  <div style={{
                    fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5,
                    color: isToday ? "#C4531A" : "#9B9590",
                  }}>
                    {JOURS[day.getDay()]}
                  </div>
                  <div style={{
                    fontFamily: "'Fraunces',serif", fontSize: 18, fontWeight: 700,
                    color: isToday ? "#C4531A" : "#1C1C1E",
                  }}>
                    {day.getDate()}
                  </div>
                  <div style={{ fontSize: 11, color: "#9B9590" }}>
                    {MOIS[day.getMonth()]}
                  </div>
                </div>

                {/* RDV list */}
                <div style={{ padding: 8, display: "flex", flexDirection: "column", gap: 6 }}>
                  {dayRdvs.length === 0 && (
                    <div style={{ padding: "16px 4px", textAlign: "center", fontSize: 12, color: "#C5C0B9" }}>
                      Aucun RDV
                    </div>
                  )}
                  {dayRdvs.map((rdv) => {
                    const st = STATUT_STYLES[rdv.statut] || STATUT_STYLES.EN_ATTENTE;
                    const isExpanded = expandedId === rdv.id;

                    return (
                      <div key={rdv.id}>
                        <button
                          onClick={() => setExpandedId(isExpanded ? null : rdv.id)}
                          style={{
                            width: "100%", textAlign: "left", padding: "8px 10px",
                            borderRadius: 8, background: st.bg,
                            border: `1px solid ${st.border}`, cursor: "pointer",
                            transition: "all .15s",
                          }}
                        >
                          {/* Status badge */}
                          {st.badge && (
                            <span style={{
                              display: "inline-block", fontSize: 9, fontWeight: 700,
                              padding: "2px 7px", borderRadius: 4, background: st.badgeBg,
                              color: st.text, marginBottom: 4, textTransform: "uppercase",
                              letterSpacing: 0.3,
                            }}>
                              {st.badge}
                            </span>
                          )}
                          <div style={{
                            fontSize: 11, fontWeight: 700, color: st.text,
                            textDecoration: st.strike ? "line-through" : "none",
                          }}>
                            {rdv.heureDebut}{rdv.heureFin ? ` – ${rdv.heureFin}` : ""}
                          </div>
                          <div style={{
                            fontSize: 12, fontWeight: 600, color: "#1C1C1E", marginTop: 2,
                            textDecoration: st.strike ? "line-through" : "none",
                            whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                          }}>
                            {rdv.clientNom}
                          </div>
                          <div style={{
                            fontSize: 11, color: "#6B6560", marginTop: 1,
                            whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                            textDecoration: st.strike ? "line-through" : "none",
                          }}>
                            {rdv.objet}
                          </div>
                        </button>

                        {/* Expanded details */}
                        {isExpanded && (
                          <div style={{
                            padding: "10px 10px 8px", marginTop: 4,
                            background: "#fff", borderRadius: 8, border: "1px solid #EDEBE7",
                            fontSize: 12,
                          }}>
                            {rdv.clientTelephone && (
                              <div style={{ marginBottom: 4 }}>
                                <span style={{ color: "#9B9590" }}>Tél : </span>
                                <a href={`tel:${rdv.clientTelephone}`} style={{ color: "#C4531A", fontWeight: 600 }}>
                                  {rdv.clientTelephone}
                                </a>
                              </div>
                            )}
                            {rdv.clientEmail && (
                              <div style={{ marginBottom: 4 }}>
                                <span style={{ color: "#9B9590" }}>Email : </span>
                                <span style={{ color: "#1C1C1E" }}>{rdv.clientEmail}</span>
                              </div>
                            )}
                            {rdv.notes && (
                              <div style={{ marginBottom: 4 }}>
                                <span style={{ color: "#9B9590" }}>Notes : </span>
                                <span style={{ color: "#1C1C1E" }}>{rdv.notes}</span>
                              </div>
                            )}
                            <div style={{
                              display: "flex", gap: 6, marginTop: 8, flexWrap: "wrap",
                            }}>
                              {rdv.statut === "EN_ATTENTE" && (
                                <button
                                  onClick={() => handleAction(rdv.id, "confirmer")}
                                  disabled={actionLoading === rdv.id}
                                  style={{
                                    padding: "6px 12px", borderRadius: 6, fontSize: 11,
                                    fontWeight: 700, background: "#22c55e", color: "#fff",
                                    border: "none", cursor: "pointer",
                                    opacity: actionLoading === rdv.id ? 0.6 : 1,
                                  }}
                                >
                                  Confirmer
                                </button>
                              )}
                              {(rdv.statut === "EN_ATTENTE" || rdv.statut === "CONFIRME") && (
                                <>
                                  <button
                                    onClick={() => handleAction(rdv.id, "annuler")}
                                    disabled={actionLoading === rdv.id}
                                    style={{
                                      padding: "6px 12px", borderRadius: 6, fontSize: 11,
                                      fontWeight: 700, background: "#FEF2F2", color: "#991B1B",
                                      border: "1px solid #FCA5A5", cursor: "pointer",
                                      opacity: actionLoading === rdv.id ? 0.6 : 1,
                                    }}
                                  >
                                    Annuler
                                  </button>
                                  <button
                                    onClick={() => handleAction(rdv.id, "reporter")}
                                    disabled={actionLoading === rdv.id}
                                    style={{
                                      padding: "6px 12px", borderRadius: 6, fontSize: 11,
                                      fontWeight: 700, background: "#FFF7ED", color: "#9A3412",
                                      border: "1px solid #FDBA74", cursor: "pointer",
                                      opacity: actionLoading === rdv.id ? 0.6 : 1,
                                    }}
                                  >
                                    Reporter
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Empty state */}
      {!loading && rdvs.length === 0 && (
        <div style={{
          textAlign: "center", padding: "48px 20px", marginTop: 20,
          background: "#fff", borderRadius: 14, border: "1.5px solid #EDEBE7",
        }}>
          <svg width="48" height="48" fill="none" stroke="#C5C0B9" strokeWidth="1.5" viewBox="0 0 24 24" style={{ margin: "0 auto 16px" }}>
            <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
          </svg>
          <p style={{ fontFamily: "'Fraunces',serif", fontSize: 18, fontWeight: 700, color: "#1C1C1E", marginBottom: 6 }}>
            Aucun RDV cette semaine
          </p>
          <p style={{ fontSize: 14, color: "#9B9590", maxWidth: 380, margin: "0 auto" }}>
            Configurez vos disponibilités pour que vos clients puissent prendre rendez-vous directement en ligne.
          </p>
          <Link
            href="/dashboard/agenda/disponibilites"
            style={{
              display: "inline-block", marginTop: 16, padding: "10px 22px",
              borderRadius: 10, fontSize: 13, fontWeight: 600,
              background: "#C4531A", color: "#fff", textDecoration: "none",
            }}
          >
            Configurer mes disponibilités
          </Link>
        </div>
      )}
    </div>
  );
}
