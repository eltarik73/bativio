"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { DashboardFeatureGate } from "@/components/DashboardFeatureGate";
import { CHANTIER_COLORS } from "@/lib/planning-config";

/* ── Types ── */
interface ChantierData {
  id: string;
  nom: string;
  adresse: string | null;
  ville: string | null;
  clientNom: string | null;
  clientTelephone: string | null;
  couleur: string;
  dateDebut: string;
  dateFin: string;
  heureDebut: string | null;
  heureFin: string | null;
  notes: string | null;
  statut: string;
  montantDevis: number | null;
}

interface RdvData {
  id: string;
  clientNom: string;
  clientTelephone: string;
  clientEmail?: string;
  dateDebut: string;
  dateFin: string;
  dureeMinutes: number;
  objet: string;
  statut: string;
  notes?: string;
  adresse?: string;
}

/* ── Helpers ── */
const JOURS_COURT = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
const JOURS_FULL = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
const MOIS = [
  "janvier", "f\u00e9vrier", "mars", "avril", "mai", "juin",
  "juillet", "ao\u00fbt", "septembre", "octobre", "novembre", "d\u00e9cembre",
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

function weekLabel(monday: Date): string {
  const sunday = addDays(monday, 6);
  if (monday.getMonth() === sunday.getMonth()) {
    return `${monday.getDate()} \u2013 ${sunday.getDate()} ${MOIS[monday.getMonth()]} ${monday.getFullYear()}`;
  }
  return `${monday.getDate()} ${MOIS[monday.getMonth()]} \u2013 ${sunday.getDate()} ${MOIS[sunday.getMonth()]} ${sunday.getFullYear()}`;
}

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function daysBetween(start: Date, end: Date): number {
  const s = new Date(start); s.setHours(0, 0, 0, 0);
  const e = new Date(end); e.setHours(0, 0, 0, 0);
  return Math.round((e.getTime() - s.getTime()) / 86400000);
}

/* ── Page ── */
export default function AgendaPage() {
  return <DashboardFeatureGate feature="agenda"><PlanningContent /></DashboardFeatureGate>;
}

function PlanningContent() {
  const { fetchWithAuth } = useAuth();
  const [monday, setMonday] = useState(() => getMonday(new Date()));
  const [chantiers, setChantiers] = useState<ChantierData[]>([]);
  const [rdvs, setRdvs] = useState<RdvData[]>([]);
  const [loading, setLoading] = useState(true);
  const [mobileDay, setMobileDay] = useState(() => new Date().getDay() === 0 ? 6 : new Date().getDay() - 1);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({
    nom: "", adresse: "", ville: "", clientNom: "", clientTelephone: "",
    couleur: "#C4531A", dateDebut: "", dateFin: "", heureDebut: "", heureFin: "",
    notes: "", statut: "PLANIFIE",
  });
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  // RDV form
  const [showRdvForm, setShowRdvForm] = useState(false);
  const [rdvForm, setRdvForm] = useState({ clientNom: "", clientTelephone: "", date: "", heure: "", objet: "" });
  const [rdvSaving, setRdvSaving] = useState(false);
  const [rdvError, setRdvError] = useState("");

  // Detail
  const [detailChantier, setDetailChantier] = useState<ChantierData | null>(null);
  const [expandedRdv, setExpandedRdv] = useState<string | null>(null);

  const days = Array.from({ length: 7 }, (_, i) => addDays(monday, i));
  const todayStr = fmtDate(new Date());

  const fetchData = useCallback(async (mon: Date) => {
    setLoading(true);
    try {
      const start = fmtDate(mon);
      const end = fmtDate(addDays(mon, 6));
      const data = await fetchWithAuth(`/artisans/me/chantiers?start=${start}&end=${end}`);
      const d = data as { chantiers: ChantierData[]; rdvs: RdvData[] };
      setChantiers(d.chantiers || []);
      setRdvs(d.rdvs || []);
    } catch {
      setChantiers([]);
      setRdvs([]);
    } finally {
      setLoading(false);
    }
  }, [fetchWithAuth]);

  useEffect(() => { fetchData(monday); }, [monday, fetchData]);

  const prevWeek = () => setMonday(m => addDays(m, -7));
  const nextWeek = () => setMonday(m => addDays(m, 7));
  const goToday = () => { setMonday(getMonday(new Date())); setMobileDay(new Date().getDay() === 0 ? 6 : new Date().getDay() - 1); };

  /* ── Chantier CRUD ── */
  const openNewChantier = (dayIndex?: number) => {
    const d = dayIndex !== undefined ? fmtDate(days[dayIndex]) : fmtDate(days[0]);
    setEditId(null);
    setForm({ nom: "", adresse: "", ville: "", clientNom: "", clientTelephone: "", couleur: CHANTIER_COLORS[Math.floor(Math.random() * CHANTIER_COLORS.length)].hex, dateDebut: d, dateFin: d, heureDebut: "", heureFin: "", notes: "", statut: "PLANIFIE" });
    setFormError("");
    setShowModal(true);
  };

  const openEditChantier = (c: ChantierData) => {
    setEditId(c.id);
    setForm({
      nom: c.nom, adresse: c.adresse || "", ville: c.ville || "",
      clientNom: c.clientNom || "", clientTelephone: c.clientTelephone || "",
      couleur: c.couleur, dateDebut: c.dateDebut.slice(0, 10), dateFin: c.dateFin.slice(0, 10),
      heureDebut: c.heureDebut || "", heureFin: c.heureFin || "",
      notes: c.notes || "", statut: c.statut,
    });
    setFormError("");
    setDetailChantier(null);
    setShowModal(true);
  };

  const saveChantier = async () => {
    if (!form.nom || !form.dateDebut || !form.dateFin) { setFormError("Nom et dates sont obligatoires"); return; }
    setSaving(true);
    setFormError("");
    try {
      const url = editId ? `/artisans/me/chantiers/${editId}` : "/artisans/me/chantiers";
      await fetchWithAuth(url, {
        method: editId ? "PUT" : "POST",
        body: JSON.stringify(form),
      });
      setShowModal(false);
      await fetchData(monday);
    } catch (e) {
      setFormError(e instanceof Error ? e.message : "Erreur");
    } finally {
      setSaving(false);
    }
  };

  const deleteChantier = async (id: string) => {
    if (!confirm("Supprimer ce chantier ?")) return;
    try {
      await fetchWithAuth(`/artisans/me/chantiers/${id}`, { method: "DELETE" });
      setDetailChantier(null);
      await fetchData(monday);
    } catch { /* silent */ }
  };

  /* ── RDV ── */
  const handleAddRdv = async () => {
    if (!rdvForm.clientNom || !rdvForm.date || !rdvForm.heure || !rdvForm.objet) {
      setRdvError("Remplissez tous les champs obligatoires."); return;
    }
    setRdvSaving(true);
    setRdvError("");
    try {
      await fetchWithAuth("/artisans/me/rdv", {
        method: "POST",
        body: JSON.stringify({ clientNom: rdvForm.clientNom, clientTelephone: rdvForm.clientTelephone, date: rdvForm.date, heureDebut: rdvForm.heure, objet: rdvForm.objet }),
      });
      setRdvForm({ clientNom: "", clientTelephone: "", date: "", heure: "", objet: "" });
      setShowRdvForm(false);
      await fetchData(monday);
    } catch (e) {
      setRdvError(e instanceof Error ? e.message : "Erreur");
    } finally {
      setRdvSaving(false);
    }
  };

  const handleRdvAction = async (rdvId: string, action: string) => {
    try {
      await fetchWithAuth(`/artisans/me/rdv/${rdvId}/${action}`, { method: "PUT" });
      await fetchData(monday);
      setExpandedRdv(null);
    } catch { /* silent */ }
  };

  /* ── Compute chantier bars for week view ── */
  function getChantierBars() {
    return chantiers.map((c) => {
      const cStart = new Date(c.dateDebut); cStart.setHours(0, 0, 0, 0);
      const cEnd = new Date(c.dateFin); cEnd.setHours(0, 0, 0, 0);
      const monDate = new Date(monday); monDate.setHours(0, 0, 0, 0);
      const sunDate = addDays(monDate, 6); sunDate.setHours(0, 0, 0, 0);

      const visStart = cStart < monDate ? monDate : cStart;
      const visEnd = cEnd > sunDate ? sunDate : cEnd;

      const colStart = daysBetween(monDate, visStart);
      const colSpan = daysBetween(visStart, visEnd) + 1;

      return { ...c, colStart: Math.max(0, colStart), colSpan: Math.min(colSpan, 7 - Math.max(0, colStart)) };
    }).filter(b => b.colSpan > 0);
  }

  /* ── Get RDVs for a specific day ── */
  function getRdvsForDay(dayStr: string) {
    return rdvs.filter(r => r.dateDebut?.slice(0, 10) === dayStr)
      .sort((a, b) => (a.dateDebut || "").localeCompare(b.dateDebut || ""));
  }

  /* ── Get chantiers for a specific day (mobile) ── */
  function getChantiersForDay(dayStr: string) {
    const d = new Date(dayStr); d.setHours(0, 0, 0, 0);
    return chantiers.filter(c => {
      const s = new Date(c.dateDebut); s.setHours(0, 0, 0, 0);
      const e = new Date(c.dateFin); e.setHours(0, 0, 0, 0);
      return d >= s && d <= e;
    });
  }

  const bars = getChantierBars();

  const CARD: React.CSSProperties = {
    background: "#fff", borderRadius: 14, border: "1px solid #EDEBE7", overflow: "hidden",
  };

  const RDV_STATUT: Record<string, { bg: string; border: string; text: string; label: string }> = {
    EN_ATTENTE: { bg: "#FFF7ED", border: "#FDBA74", text: "#9A3412", label: "En attente" },
    CONFIRME: { bg: "#F0FDF4", border: "#86EFAC", text: "#166534", label: "Confirm\u00e9" },
    ANNULE: { bg: "#FEF2F2", border: "#FCA5A5", text: "#991B1B", label: "Annul\u00e9" },
    TERMINE: { bg: "#F9FAFB", border: "#D1D5DB", text: "#6B7280", label: "Termin\u00e9" },
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 24 }}>
        <h1 style={{ fontFamily: "'Fraunces',serif", fontSize: 26, fontWeight: 700, color: "var(--bois,#3D2E1F)", margin: 0 }}>Planning</h1>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <Link href="/dashboard/agenda/disponibilites" style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "10px 16px", borderRadius: 10, fontSize: 13, fontWeight: 600, border: "1px solid #E8D5C0", background: "#fff", color: "var(--bois,#3D2E1F)", textDecoration: "none" }}>
            <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
            Disponibilit&eacute;s
          </Link>
          <button onClick={() => setShowRdvForm(v => !v)} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "10px 16px", borderRadius: 10, fontSize: 13, fontWeight: 600, border: "1px solid #E8D5C0", background: "#fff", color: "var(--bois,#3D2E1F)", cursor: "pointer" }}>
            <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
            + RDV
          </button>
          <button onClick={() => openNewChantier()} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "10px 16px", borderRadius: 10, fontSize: 13, fontWeight: 600, background: "#C4531A", color: "#fff", border: "none", cursor: "pointer" }}>
            <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>
            + Chantier
          </button>
        </div>
      </div>

      {/* RDV inline form */}
      {showRdvForm && (
        <div style={{ ...CARD, padding: 20, marginBottom: 16 }}>
          <h3 style={{ fontFamily: "'Fraunces',serif", fontSize: 16, fontWeight: 700, color: "var(--bois,#3D2E1F)", marginBottom: 12 }}>Nouveau RDV</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(180px,1fr))", gap: 10 }}>
            <input value={rdvForm.clientNom} onChange={e => setRdvForm(f => ({ ...f, clientNom: e.target.value }))} placeholder="Nom du client *" style={inputStyle} />
            <input value={rdvForm.clientTelephone} onChange={e => setRdvForm(f => ({ ...f, clientTelephone: e.target.value }))} placeholder="T\u00e9l\u00e9phone" style={inputStyle} />
            <input type="date" value={rdvForm.date} onChange={e => setRdvForm(f => ({ ...f, date: e.target.value }))} style={inputStyle} />
            <input type="time" value={rdvForm.heure} onChange={e => setRdvForm(f => ({ ...f, heure: e.target.value }))} style={inputStyle} />
            <input value={rdvForm.objet} onChange={e => setRdvForm(f => ({ ...f, objet: e.target.value }))} placeholder="Objet *" style={{ ...inputStyle, gridColumn: "1 / -1" }} />
          </div>
          {rdvError && <p style={{ color: "#DC2626", fontSize: 12, marginTop: 8 }}>{rdvError}</p>}
          <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
            <button onClick={handleAddRdv} disabled={rdvSaving} style={{ ...btnPrimary, opacity: rdvSaving ? 0.6 : 1 }}>{rdvSaving ? "..." : "Cr\u00e9er"}</button>
            <button onClick={() => setShowRdvForm(false)} style={btnSecondary}>Annuler</button>
          </div>
        </div>
      )}

      {/* Week nav */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
        <button onClick={prevWeek} style={navBtn} aria-label="Semaine pr\u00e9c\u00e9dente">
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6"/></svg>
        </button>
        <div style={{ textAlign: "center", flex: 1 }}>
          <span style={{ fontFamily: "'Fraunces',serif", fontSize: 16, fontWeight: 700, color: "var(--bois,#3D2E1F)" }}>{weekLabel(monday)}</span>
          {fmtDate(monday) !== fmtDate(getMonday(new Date())) && (
            <button onClick={goToday} style={{ display: "block", margin: "4px auto 0", fontSize: 12, fontWeight: 600, color: "#C4531A", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>
              Aujourd&apos;hui
            </button>
          )}
        </div>
        <button onClick={nextWeek} style={navBtn} aria-label="Semaine suivante">
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg>
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: 60, color: "#9C958D", fontSize: 14 }}>Chargement...</div>
      ) : (
        <>
          {/* ── DESKTOP: Week grid ── */}
          <div className="max-md:hidden" style={CARD}>
            {/* Day headers */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", borderBottom: "1px solid #EDEBE7" }}>
              {days.map((d, i) => {
                const isToday = fmtDate(d) === todayStr;
                return (
                  <div key={i} style={{ padding: "10px 6px", textAlign: "center", background: isToday ? "rgba(196,83,26,.06)" : "transparent", borderRight: i < 6 ? "1px solid #EDEBE7" : "none", cursor: "pointer" }} onClick={() => openNewChantier(i)}>
                    <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, color: isToday ? "#C4531A" : "#9B9590" }}>{JOURS_COURT[d.getDay()]}</div>
                    <div style={{ fontFamily: "'Fraunces',serif", fontSize: 20, fontWeight: 700, color: isToday ? "#C4531A" : "#1C1C1E" }}>{d.getDate()}</div>
                  </div>
                );
              })}
            </div>

            {/* Chantier bars */}
            {bars.length > 0 && (
              <div style={{ padding: "8px 6px 4px", display: "flex", flexDirection: "column", gap: 4 }}>
                {bars.map((b) => (
                  <div
                    key={b.id}
                    onClick={() => setDetailChantier(b)}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(7,1fr)",
                      cursor: "pointer",
                    }}
                  >
                    <div style={{
                      gridColumn: `${b.colStart + 1} / span ${b.colSpan}`,
                      background: b.couleur,
                      color: "#fff",
                      borderRadius: 8,
                      padding: "6px 10px",
                      fontSize: 12,
                      fontWeight: 600,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      minHeight: 32,
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      opacity: b.statut === "ANNULE" ? 0.4 : b.statut === "TERMINE" ? 0.6 : 1,
                    }}>
                      <span>{b.nom}</span>
                      {b.adresse && <span style={{ opacity: 0.7, fontSize: 11 }}>{b.adresse}</span>}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* RDVs per day */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", minHeight: 120 }}>
              {days.map((d, i) => {
                const dayStr = fmtDate(d);
                const dayRdvs = getRdvsForDay(dayStr);
                return (
                  <div key={i} style={{ borderRight: i < 6 ? "1px solid #EDEBE7" : "none", padding: 6 }}>
                    {dayRdvs.map(r => {
                      const st = RDV_STATUT[r.statut] || RDV_STATUT.EN_ATTENTE;
                      const time = r.dateDebut ? new Date(r.dateDebut).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }) : "";
                      return (
                        <div key={r.id} onClick={() => setExpandedRdv(expandedRdv === r.id ? null : r.id)} style={{ padding: "5px 6px", marginBottom: 4, borderRadius: 6, background: st.bg, border: `1px solid ${st.border}`, cursor: "pointer", fontSize: 11 }}>
                          <div style={{ fontWeight: 700, color: st.text }}>{time}</div>
                          <div style={{ fontWeight: 600, color: "#3D2E1F", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{r.clientNom}</div>
                          <div style={{ color: "#6B6560", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{r.objet}</div>
                          {expandedRdv === r.id && (
                            <div style={{ marginTop: 6, paddingTop: 6, borderTop: `1px solid ${st.border}` }}>
                              {r.clientTelephone && <div><a href={`tel:${r.clientTelephone}`} style={{ color: "#C4531A", fontWeight: 600 }}>{r.clientTelephone}</a></div>}
                              {r.notes && <div style={{ color: "#6B6560", marginTop: 2 }}>{r.notes}</div>}
                              <div style={{ display: "flex", gap: 4, marginTop: 6, flexWrap: "wrap" }}>
                                {r.statut === "EN_ATTENTE" && <button onClick={(e) => { e.stopPropagation(); handleRdvAction(r.id, "confirmer"); }} style={{ ...miniBtn, background: "#22c55e", color: "#fff" }}>Confirmer</button>}
                                {(r.statut === "EN_ATTENTE" || r.statut === "CONFIRME") && <button onClick={(e) => { e.stopPropagation(); handleRdvAction(r.id, "annuler"); }} style={{ ...miniBtn, background: "#FEF2F2", color: "#991B1B", border: "1px solid #FCA5A5" }}>Annuler</button>}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                    {dayRdvs.length === 0 && bars.filter(b => {
                      const dayIdx = i;
                      return dayIdx >= b.colStart && dayIdx < b.colStart + b.colSpan;
                    }).length === 0 && (
                      <div style={{ padding: "12px 0", textAlign: "center", fontSize: 11, color: "#C5C0B9" }}>-</div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── MOBILE: Day tabs + list ── */}
          <div className="md:hidden">
            {/* Day tabs */}
            <div style={{ display: "flex", gap: 4, overflowX: "auto", paddingBottom: 8, marginBottom: 12 }} className="hide-scroll">
              {days.map((d, i) => {
                const isToday = fmtDate(d) === todayStr;
                const isActive = i === mobileDay;
                return (
                  <button key={i} onClick={() => setMobileDay(i)} style={{
                    padding: "8px 12px", borderRadius: 10, fontSize: 12, fontWeight: 700, whiteSpace: "nowrap", cursor: "pointer", transition: "all .15s",
                    background: isActive ? "#C4531A" : isToday ? "rgba(196,83,26,.08)" : "#fff",
                    color: isActive ? "#fff" : isToday ? "#C4531A" : "#3D2E1F",
                    border: isActive ? "none" : "1px solid #EDEBE7",
                    minWidth: 58, textAlign: "center",
                  }}>
                    <div>{JOURS_COURT[d.getDay()]}</div>
                    <div style={{ fontSize: 16 }}>{d.getDate()}</div>
                  </button>
                );
              })}
            </div>

            {/* Selected day title */}
            <div style={{ fontSize: 15, fontWeight: 700, color: "#3D2E1F", marginBottom: 12, fontFamily: "'Fraunces',serif" }}>
              {JOURS_FULL[days[mobileDay].getDay()]} {days[mobileDay].getDate()} {MOIS[days[mobileDay].getMonth()]}
            </div>

            {/* Day content */}
            {(() => {
              const dayStr = fmtDate(days[mobileDay]);
              const dayChantiers = getChantiersForDay(dayStr);
              const dayRdvs = getRdvsForDay(dayStr);

              if (dayChantiers.length === 0 && dayRdvs.length === 0) {
                return (
                  <div style={{ textAlign: "center", padding: "36px 16px", background: "#fff", borderRadius: 14, border: "1px solid #EDEBE7" }}>
                    <p style={{ fontSize: 14, color: "#9C958D" }}>Rien de pr&eacute;vu ce jour</p>
                    <button onClick={() => openNewChantier(mobileDay)} style={{ marginTop: 12, ...btnPrimary }}>+ Ajouter un chantier</button>
                  </div>
                );
              }

              return (
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {/* Chantiers */}
                  {dayChantiers.map(c => {
                    const cStart = new Date(c.dateDebut); cStart.setHours(0, 0, 0, 0);
                    const cEnd = new Date(c.dateFin); cEnd.setHours(0, 0, 0, 0);
                    const span = daysBetween(cStart, cEnd) + 1;
                    return (
                      <div key={c.id} onClick={() => setDetailChantier(c)} style={{ padding: "12px 14px", borderRadius: 12, background: "#fff", borderLeft: `4px solid ${c.couleur}`, border: `1px solid ${c.couleur}33`, cursor: "pointer" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <div style={{ width: 10, height: 10, borderRadius: "50%", background: c.couleur, flexShrink: 0 }} />
                          <span style={{ fontSize: 14, fontWeight: 700, color: "#3D2E1F" }}>{c.nom}</span>
                        </div>
                        {c.adresse && <div style={{ fontSize: 12, color: "#6B6560", marginTop: 4, paddingLeft: 18 }}>{c.adresse}{c.ville ? ` \u2013 ${c.ville}` : ""}</div>}
                        <div style={{ fontSize: 11, color: "#9C958D", marginTop: 4, paddingLeft: 18 }}>
                          {span > 1 ? `${span} jours` : "1 jour"}{c.heureDebut ? ` \u00b7 ${c.heureDebut}${c.heureFin ? `\u2013${c.heureFin}` : ""}` : ""}
                          {c.clientNom ? ` \u00b7 ${c.clientNom}` : ""}
                        </div>
                      </div>
                    );
                  })}

                  {/* RDVs */}
                  {dayRdvs.map(r => {
                    const st = RDV_STATUT[r.statut] || RDV_STATUT.EN_ATTENTE;
                    const time = r.dateDebut ? new Date(r.dateDebut).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }) : "";
                    return (
                      <div key={r.id} onClick={() => setExpandedRdv(expandedRdv === r.id ? null : r.id)} style={{ padding: "12px 14px", borderRadius: 12, background: st.bg, border: `1px solid ${st.border}`, cursor: "pointer" }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                          <div>
                            <span style={{ fontSize: 12, fontWeight: 700, color: st.text }}>{time}</span>
                            <span style={{ fontSize: 14, fontWeight: 600, color: "#3D2E1F", marginLeft: 8 }}>{r.clientNom}</span>
                          </div>
                          <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 4, background: `${st.border}`, color: st.text }}>{st.label}</span>
                        </div>
                        <div style={{ fontSize: 12, color: "#6B6560", marginTop: 4 }}>{r.objet}</div>
                        {expandedRdv === r.id && (
                          <div style={{ marginTop: 8, paddingTop: 8, borderTop: `1px solid ${st.border}` }}>
                            {r.clientTelephone && <a href={`tel:${r.clientTelephone}`} style={{ fontSize: 13, color: "#C4531A", fontWeight: 600 }}>{r.clientTelephone}</a>}
                            {r.notes && <div style={{ fontSize: 12, color: "#6B6560", marginTop: 4 }}>{r.notes}</div>}
                            <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
                              {r.statut === "EN_ATTENTE" && <button onClick={(e) => { e.stopPropagation(); handleRdvAction(r.id, "confirmer"); }} style={{ ...miniBtn, background: "#22c55e", color: "#fff" }}>Confirmer</button>}
                              {(r.statut === "EN_ATTENTE" || r.statut === "CONFIRME") && <button onClick={(e) => { e.stopPropagation(); handleRdvAction(r.id, "annuler"); }} style={{ ...miniBtn, background: "#FEF2F2", color: "#991B1B" }}>Annuler</button>}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })()}
          </div>

          {/* Empty state */}
          {chantiers.length === 0 && rdvs.length === 0 && (
            <div style={{ textAlign: "center", padding: "40px 20px", marginTop: 20, background: "#fff", borderRadius: 14, border: "1px solid #EDEBE7" }} className="max-md:hidden">
              <svg width="44" height="44" fill="none" stroke="#C5C0B9" strokeWidth="1.5" viewBox="0 0 24 24" style={{ margin: "0 auto 12px" }}><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
              <p style={{ fontFamily: "'Fraunces',serif", fontSize: 17, fontWeight: 700, color: "#3D2E1F", marginBottom: 6 }}>Aucun chantier cette semaine</p>
              <p style={{ fontSize: 13, color: "#9C958D", maxWidth: 360, margin: "0 auto 16px" }}>
                Ajoutez vos chantiers pour organiser votre semaine. Les RDV clients apparaissent aussi ici.
              </p>
              <button onClick={() => openNewChantier()} style={btnPrimary}>+ Ajouter un chantier</button>
            </div>
          )}
        </>
      )}

      {/* ── Chantier detail panel ── */}
      {detailChantier && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.4)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }} onClick={() => setDetailChantier(null)}>
          <div onClick={e => e.stopPropagation()} style={{ background: "#fff", borderRadius: 16, padding: 28, maxWidth: 440, width: "100%", maxHeight: "80vh", overflow: "auto" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <div style={{ width: 14, height: 14, borderRadius: "50%", background: detailChantier.couleur }} />
              <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 20, fontWeight: 700, color: "#3D2E1F", margin: 0 }}>{detailChantier.nom}</h2>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 13, color: "#6B6560" }}>
              <div><span style={{ fontWeight: 600, color: "#3D2E1F" }}>P&eacute;riode :</span> {new Date(detailChantier.dateDebut).toLocaleDateString("fr-FR")} &rarr; {new Date(detailChantier.dateFin).toLocaleDateString("fr-FR")}</div>
              {detailChantier.heureDebut && <div><span style={{ fontWeight: 600, color: "#3D2E1F" }}>Horaires :</span> {detailChantier.heureDebut}{detailChantier.heureFin ? ` \u2013 ${detailChantier.heureFin}` : ""}</div>}
              {detailChantier.adresse && <div><span style={{ fontWeight: 600, color: "#3D2E1F" }}>Adresse :</span> {detailChantier.adresse}{detailChantier.ville ? `, ${detailChantier.ville}` : ""}</div>}
              {detailChantier.clientNom && <div><span style={{ fontWeight: 600, color: "#3D2E1F" }}>Client :</span> {detailChantier.clientNom}{detailChantier.clientTelephone ? ` \u2013 ` : ""}{detailChantier.clientTelephone && <a href={`tel:${detailChantier.clientTelephone}`} style={{ color: "#C4531A", fontWeight: 600 }}>{detailChantier.clientTelephone}</a>}</div>}
              {detailChantier.notes && <div><span style={{ fontWeight: 600, color: "#3D2E1F" }}>Notes :</span> {detailChantier.notes}</div>}
              {detailChantier.montantDevis != null && <div><span style={{ fontWeight: 600, color: "#3D2E1F" }}>Montant :</span> {detailChantier.montantDevis.toLocaleString("fr-FR")} &euro;</div>}
              <div><span style={{ fontWeight: 600, color: "#3D2E1F" }}>Statut :</span> {detailChantier.statut.replace("_", " ")}</div>
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
              <button onClick={() => openEditChantier(detailChantier)} style={btnPrimary}>Modifier</button>
              <button onClick={() => deleteChantier(detailChantier.id)} style={{ ...btnSecondary, color: "#DC2626", borderColor: "#FCA5A5" }}>Supprimer</button>
              <button onClick={() => setDetailChantier(null)} style={btnSecondary}>Fermer</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Chantier form modal ── */}
      {showModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.4)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }} onClick={() => setShowModal(false)}>
          <div onClick={e => e.stopPropagation()} style={{ background: "#fff", borderRadius: 16, padding: 28, maxWidth: 480, width: "100%", maxHeight: "85vh", overflow: "auto" }}>
            <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 20, fontWeight: 700, color: "#3D2E1F", marginBottom: 20 }}>
              {editId ? "Modifier le chantier" : "Nouveau chantier"}
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {/* Nom */}
              <div>
                <label style={labelStyle}>Nom du chantier *</label>
                <input value={form.nom} onChange={e => setForm(f => ({ ...f, nom: e.target.value }))} placeholder="R&eacute;novation SDB Dupont" style={inputStyle} />
              </div>

              {/* Couleur */}
              <div>
                <label style={labelStyle}>Couleur</label>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {CHANTIER_COLORS.map(c => (
                    <button key={c.hex} type="button" onClick={() => setForm(f => ({ ...f, couleur: c.hex }))} style={{ width: 32, height: 32, borderRadius: 8, background: c.hex, border: form.couleur === c.hex ? "3px solid #1C1C1E" : "2px solid transparent", cursor: "pointer", transition: "all .1s" }} title={c.label} />
                  ))}
                </div>
              </div>

              {/* Dates */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div>
                  <label style={labelStyle}>Date d&eacute;but *</label>
                  <input type="date" value={form.dateDebut} onChange={e => setForm(f => ({ ...f, dateDebut: e.target.value }))} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Date fin *</label>
                  <input type="date" value={form.dateFin} onChange={e => setForm(f => ({ ...f, dateFin: e.target.value }))} style={inputStyle} />
                </div>
              </div>

              {/* Heures */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div>
                  <label style={labelStyle}>Heure d&eacute;but</label>
                  <input type="time" value={form.heureDebut} onChange={e => setForm(f => ({ ...f, heureDebut: e.target.value }))} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Heure fin</label>
                  <input type="time" value={form.heureFin} onChange={e => setForm(f => ({ ...f, heureFin: e.target.value }))} style={inputStyle} />
                </div>
              </div>

              {/* Adresse */}
              <div>
                <label style={labelStyle}>Adresse</label>
                <input value={form.adresse} onChange={e => setForm(f => ({ ...f, adresse: e.target.value }))} placeholder="12 rue des Alpes" style={inputStyle} />
              </div>

              {/* Client */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div>
                  <label style={labelStyle}>Client</label>
                  <input value={form.clientNom} onChange={e => setForm(f => ({ ...f, clientNom: e.target.value }))} placeholder="Nom" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>T&eacute;l client</label>
                  <input value={form.clientTelephone} onChange={e => setForm(f => ({ ...f, clientTelephone: e.target.value }))} placeholder="06..." style={inputStyle} />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label style={labelStyle}>Notes</label>
                <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="Infos compl&eacute;mentaires..." rows={2} style={{ ...inputStyle, resize: "vertical" }} />
              </div>

              {/* Statut (edit only) */}
              {editId && (
                <div>
                  <label style={labelStyle}>Statut</label>
                  <select value={form.statut} onChange={e => setForm(f => ({ ...f, statut: e.target.value }))} style={inputStyle}>
                    <option value="PLANIFIE">Planifi&eacute;</option>
                    <option value="EN_COURS">En cours</option>
                    <option value="TERMINE">Termin&eacute;</option>
                    <option value="ANNULE">Annul&eacute;</option>
                    <option value="REPORTE">Report&eacute;</option>
                  </select>
                </div>
              )}
            </div>

            {formError && <p style={{ color: "#DC2626", fontSize: 12, marginTop: 10 }}>{formError}</p>}

            <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
              <button onClick={saveChantier} disabled={saving} style={{ ...btnPrimary, opacity: saving ? 0.6 : 1 }}>{saving ? "..." : editId ? "Enregistrer" : "Cr\u00e9er le chantier"}</button>
              <button onClick={() => setShowModal(false)} style={btnSecondary}>Annuler</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Shared styles ── */
const inputStyle: React.CSSProperties = {
  width: "100%", padding: "10px 12px", borderRadius: 8,
  border: "1px solid #E8D5C0", fontSize: 14, outline: "none",
  fontFamily: "'Karla',sans-serif", background: "#fff",
};

const labelStyle: React.CSSProperties = {
  display: "block", fontSize: 12, fontWeight: 600,
  color: "#5C4A3A", marginBottom: 4,
};

const btnPrimary: React.CSSProperties = {
  padding: "10px 20px", borderRadius: 10, fontSize: 13, fontWeight: 600,
  background: "#C4531A", color: "#fff", border: "none", cursor: "pointer",
};

const btnSecondary: React.CSSProperties = {
  padding: "10px 20px", borderRadius: 10, fontSize: 13, fontWeight: 600,
  background: "#F7F5F2", color: "#5C4A3A", border: "1px solid #E8D5C0", cursor: "pointer",
};

const navBtn: React.CSSProperties = {
  display: "inline-flex", alignItems: "center", justifyContent: "center",
  width: 36, height: 36, borderRadius: 8, background: "#fff",
  border: "1px solid #E8D5C0", cursor: "pointer",
};

const miniBtn: React.CSSProperties = {
  padding: "4px 10px", borderRadius: 6, fontSize: 11,
  fontWeight: 700, border: "none", cursor: "pointer",
};
