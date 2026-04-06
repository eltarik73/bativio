"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { DashboardFeatureGate } from "@/components/DashboardFeatureGate";
import { CHANTIER_COLORS } from "@/lib/planning-config";

/* ── Types ── */
interface CollabData {
  id: string;
  nom: string;
  email: string | null;
  telephone: string | null;
  role: string | null;
  source: string;
  artisanBativioId: string | null;
}

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
  collaborateurs?: CollabData[];
  _invite?: boolean;
  _invitePar?: string | null;
}

interface BativioSearchResult {
  id: string;
  nomAffichage: string;
  email: string;
  metierNom: string | null;
  ville: string | null;
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
  const [viewMode, setViewMode] = useState<"jour" | "semaine" | "mois">("semaine");
  const [selectedDay, setSelectedDay] = useState(() => new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

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

  // Collaborateur
  const [showAddCollab, setShowAddCollab] = useState(false);
  const [collabTab, setCollabTab] = useState<"manuel" | "bativio" | "gmail">("manuel");
  const [collabForm, setCollabForm] = useState({ nom: "", telephone: "", role: "" });
  const [collabSaving, setCollabSaving] = useState(false);
  const [bativioQuery, setBativioQuery] = useState("");
  const [bativioResults, setBativioResults] = useState<BativioSearchResult[]>([]);
  const [bativioSearching, setBativioSearching] = useState(false);

  const days = Array.from({ length: 7 }, (_, i) => addDays(monday, i));
  const todayStr = fmtDate(new Date());

  const fetchData = useCallback(async (mon: Date, view: string) => {
    setLoading(true);
    try {
      let start: string, end: string;
      if (view === "mois") {
        const firstOfMonth = new Date(mon.getFullYear(), mon.getMonth(), 1);
        const lastOfMonth = new Date(mon.getFullYear(), mon.getMonth() + 1, 0);
        start = fmtDate(addDays(firstOfMonth, -7)); // include prev week for display
        end = fmtDate(addDays(lastOfMonth, 7)); // include next week
      } else {
        start = fmtDate(mon);
        end = fmtDate(addDays(mon, 6));
      }
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

  useEffect(() => { fetchData(monday, viewMode); }, [monday, viewMode, fetchData]);

  const navigate = (dir: -1 | 1) => {
    if (viewMode === "jour") { setSelectedDay(d => addDays(d, dir)); setMonday(m => { const nd = addDays(selectedDay, dir); return getMonday(nd); }); }
    else if (viewMode === "mois") setMonday(m => new Date(m.getFullYear(), m.getMonth() + dir, 1));
    else setMonday(m => addDays(m, dir * 7));
  };
  const prevWeek = () => navigate(-1);
  const nextWeek = () => navigate(1);
  const goToday = () => { const now = new Date(); setMonday(getMonday(now)); setSelectedDay(now); setMobileDay(now.getDay() === 0 ? 6 : now.getDay() - 1); };
  const goToDay = (d: Date) => { setSelectedDay(d); setMonday(getMonday(d)); setViewMode("jour"); };

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
      await fetchData(monday, viewMode);
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
      await fetchData(monday, viewMode);
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
      await fetchData(monday, viewMode);
    } catch (e) {
      setRdvError(e instanceof Error ? e.message : "Erreur");
    } finally {
      setRdvSaving(false);
    }
  };

  const handleRdvAction = async (rdvId: string, action: string) => {
    try {
      await fetchWithAuth(`/artisans/me/rdv/${rdvId}/${action}`, { method: "PUT" });
      await fetchData(monday, viewMode);
      setExpandedRdv(null);
    } catch { /* silent */ }
  };

  /* ── Collaborateurs ── */
  const addCollabManuel = async (chantierId: string) => {
    if (!collabForm.nom) return;
    setCollabSaving(true);
    try {
      await fetchWithAuth(`/artisans/me/chantiers/${chantierId}/collaborateurs`, {
        method: "POST",
        body: JSON.stringify({ nom: collabForm.nom, telephone: collabForm.telephone || undefined, role: collabForm.role || undefined, source: "MANUEL" }),
      });
      setCollabForm({ nom: "", telephone: "", role: "" });
      setShowAddCollab(false);
      await fetchData(monday, viewMode);
      if (detailChantier) {
        const updated = await fetchWithAuth(`/artisans/me/chantiers?start=${fmtDate(monday)}&end=${fmtDate(addDays(monday, 6))}`) as { chantiers: ChantierData[] };
        const refreshed = updated.chantiers.find(c => c.id === chantierId);
        if (refreshed) setDetailChantier(refreshed);
      }
    } catch { /* silent */ }
    finally { setCollabSaving(false); }
  };

  const addCollabBativio = async (chantierId: string, result: BativioSearchResult) => {
    setCollabSaving(true);
    try {
      await fetchWithAuth(`/artisans/me/chantiers/${chantierId}/collaborateurs`, {
        method: "POST",
        body: JSON.stringify({ nom: result.nomAffichage, email: result.email, source: "BATIVIO", artisanBativioId: result.id }),
      });
      setBativioQuery("");
      setBativioResults([]);
      setShowAddCollab(false);
      await fetchData(monday, viewMode);
      if (detailChantier) {
        const updated = await fetchWithAuth(`/artisans/me/chantiers?start=${fmtDate(monday)}&end=${fmtDate(addDays(monday, 6))}`) as { chantiers: ChantierData[] };
        const refreshed = updated.chantiers.find(c => c.id === chantierId);
        if (refreshed) setDetailChantier(refreshed);
      }
    } catch { /* silent */ }
    finally { setCollabSaving(false); }
  };

  const removeCollab = async (chantierId: string, collabId: string) => {
    try {
      await fetchWithAuth(`/artisans/me/chantiers/${chantierId}/collaborateurs/${collabId}`, { method: "DELETE" });
      await fetchData(monday, viewMode);
      if (detailChantier) {
        setDetailChantier(prev => prev ? { ...prev, collaborateurs: (prev.collaborateurs || []).filter(c => c.id !== collabId) } : null);
      }
    } catch { /* silent */ }
  };

  const searchBativio = async (q: string) => {
    setBativioQuery(q);
    if (q.length < 2) { setBativioResults([]); return; }
    setBativioSearching(true);
    try {
      const results = await fetchWithAuth(`/artisans/search?q=${encodeURIComponent(q)}`);
      setBativioResults(Array.isArray(results) ? results as BativioSearchResult[] : []);
    } catch { setBativioResults([]); }
    finally { setBativioSearching(false); }
  };

  function getInitials(name: string): string {
    return name.split(/\s+/).map(w => w[0]).join("").substring(0, 2).toUpperCase();
  }

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
            <input value={rdvForm.clientTelephone} onChange={e => setRdvForm(f => ({ ...f, clientTelephone: e.target.value }))} placeholder={"T\u00e9l\u00e9phone"} style={inputStyle} />
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

      {/* View toggle + Nav */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
        <div style={{ display: "flex", gap: 2, background: "#F3F4F6", borderRadius: 8, padding: 2 }}>
          {(["jour", "semaine", "mois"] as const).map(v => (
            <button key={v} onClick={() => setViewMode(v)} style={{ padding: "6px 12px", borderRadius: 6, fontSize: 12, fontWeight: 600, border: "none", cursor: "pointer", background: viewMode === v ? "#fff" : "transparent", color: viewMode === v ? "#3D2E1F" : "#9CA3AF", boxShadow: viewMode === v ? "0 1px 3px rgba(0,0,0,.08)" : "none" }}>
              {v === "jour" ? "Jour" : v === "semaine" ? "Semaine" : "Mois"}
            </button>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1, justifyContent: "center" }}>
          <button onClick={prevWeek} style={navBtn}><svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6"/></svg></button>
          <div style={{ textAlign: "center", position: "relative" }}>
            <button onClick={() => setShowDatePicker(p => !p)} style={{ fontFamily: "'Fraunces',serif", fontSize: 16, fontWeight: 700, color: "var(--bois,#3D2E1F)", background: "none", border: "none", cursor: "pointer" }}>
              {viewMode === "jour" ? `${JOURS_FULL[selectedDay.getDay()]} ${selectedDay.getDate()} ${MOIS[selectedDay.getMonth()]} ${selectedDay.getFullYear()}` : viewMode === "mois" ? `${MOIS[monday.getMonth()]} ${monday.getFullYear()}` : weekLabel(monday)}
            </button>
            {fmtDate(monday) !== fmtDate(getMonday(new Date())) && (
              <button onClick={goToday} style={{ display: "block", margin: "2px auto 0", fontSize: 11, fontWeight: 600, color: "#C4531A", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>Aujourd&apos;hui</button>
            )}
            {showDatePicker && (
              <div style={{ position: "absolute", top: "100%", left: "50%", transform: "translateX(-50%)", marginTop: 8, zIndex: 100, background: "#fff", borderRadius: 12, border: "1px solid #E8D5C0", padding: 12, boxShadow: "0 8px 24px rgba(0,0,0,.1)" }}>
                <input type="date" value={fmtDate(monday)} onChange={e => { const d = new Date(e.target.value); if (!isNaN(d.getTime())) { setMonday(getMonday(d)); setShowDatePicker(false); } }} style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid #E8D5C0", fontSize: 14 }} />
              </div>
            )}
          </div>
          <button onClick={nextWeek} style={navBtn}><svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg></button>
        </div>

        <div style={{ width: 80 }} />
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: 60, color: "#9C958D", fontSize: 14 }}>Chargement...</div>
      ) : (
        <>
          {/* ── DAY VIEW ── */}
          {viewMode === "jour" && (
            <div style={CARD} className="max-md:!rounded-none max-md:!border-x-0">
              <div style={{ padding: "12px 16px", borderBottom: "1px solid #EDEBE7", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontFamily: "'Fraunces',serif", fontSize: 18, fontWeight: 700, color: fmtDate(selectedDay) === todayStr ? "#C4531A" : "#3D2E1F" }}>
                  {JOURS_FULL[selectedDay.getDay()]} {selectedDay.getDate()} {MOIS[selectedDay.getMonth()]}
                </span>
                <button onClick={() => openNewChantier()} style={{ fontSize: 12, fontWeight: 600, color: "#C4531A", background: "none", border: "none", cursor: "pointer" }}>+ Ajouter</button>
              </div>

              {/* All-day chantiers */}
              {(() => {
                const ds = fmtDate(selectedDay);
                const dayChantiers = getChantiersForDay(ds);
                const dayRdvs = getRdvsForDay(ds);

                return (
                  <div style={{ padding: 16 }}>
                    {dayChantiers.length > 0 && (
                      <div style={{ marginBottom: 16 }}>
                        <div style={{ fontSize: 11, fontWeight: 600, color: "#9B9590", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 }}>Chantiers</div>
                        {dayChantiers.map(c => {
                          const cStart = new Date(c.dateDebut); cStart.setHours(0, 0, 0, 0);
                          const cEnd = new Date(c.dateFin); cEnd.setHours(0, 0, 0, 0);
                          const span = daysBetween(cStart, cEnd) + 1;
                          return (
                            <div key={c.id} onClick={() => setDetailChantier(c)} style={{ display: "flex", gap: 12, padding: "14px 16px", marginBottom: 8, borderRadius: 10, background: c._invite ? "#F9FAFB" : "#fff", borderLeft: `4px solid ${c._invite ? "#9CA3AF" : c.couleur}`, border: `1px solid ${c._invite ? "#D1D5DB" : c.couleur + "33"}`, cursor: "pointer" }}>
                              <div style={{ flex: 1 }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                                  <span style={{ fontSize: 15, fontWeight: 700, color: "#3D2E1F" }}>{c.nom}</span>
                                  {c._invite && <span style={{ fontSize: 10, color: "#9CA3AF" }}>Invit&eacute;</span>}
                                </div>
                                {c.adresse && <div style={{ fontSize: 13, color: "#6B6560" }}>{c.adresse}{c.ville ? ` \u2013 ${c.ville}` : ""}</div>}
                                <div style={{ fontSize: 12, color: "#9C958D", marginTop: 4 }}>
                                  {span > 1 ? `${span} jours` : "1 jour"}{c.heureDebut ? ` \u00b7 ${c.heureDebut}${c.heureFin ? `\u2013${c.heureFin}` : ""}` : " \u00b7 Journ\u00e9e enti\u00e8re"}
                                  {c.clientNom ? ` \u00b7 Client: ${c.clientNom}` : ""}
                                </div>
                                {c.notes && <div style={{ fontSize: 12, color: "#9C958D", marginTop: 4, fontStyle: "italic" }}>{c.notes}</div>}
                              </div>
                              {(c.collaborateurs || []).length > 0 && (
                                <div style={{ display: "flex", flexDirection: "column", gap: 2, alignItems: "flex-end" }}>
                                  {(c.collaborateurs || []).slice(0, 3).map(col => (
                                    <span key={col.id} style={{ width: 24, height: 24, borderRadius: "50%", background: col.source === "BATIVIO" ? "#C4531A" : "#6B7280", color: "#fff", fontSize: 9, fontWeight: 700, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>{getInitials(col.nom)}</span>
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {dayRdvs.length > 0 && (
                      <div>
                        <div style={{ fontSize: 11, fontWeight: 600, color: "#9B9590", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 }}>Rendez-vous</div>
                        {dayRdvs.map(r => {
                          const st = RDV_STATUT[r.statut] || RDV_STATUT.EN_ATTENTE;
                          const time = r.dateDebut ? new Date(r.dateDebut).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }) : "";
                          return (
                            <div key={r.id} onClick={() => setExpandedRdv(expandedRdv === r.id ? null : r.id)} style={{ padding: "14px 16px", marginBottom: 8, borderRadius: 10, background: st.bg, border: `1px solid ${st.border}`, cursor: "pointer" }}>
                              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                <div>
                                  <span style={{ fontSize: 14, fontWeight: 700, color: st.text }}>{time}</span>
                                  <span style={{ fontSize: 15, fontWeight: 600, color: "#3D2E1F", marginLeft: 10 }}>{r.clientNom}</span>
                                </div>
                                <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 4, background: st.border, color: st.text }}>{st.label}</span>
                              </div>
                              <div style={{ fontSize: 13, color: "#6B6560", marginTop: 4 }}>{r.objet}</div>
                              {r.adresse && <div style={{ fontSize: 12, color: "#9C958D", marginTop: 2 }}>{r.adresse}</div>}
                              {expandedRdv === r.id && (
                                <div style={{ marginTop: 10, paddingTop: 10, borderTop: `1px solid ${st.border}` }}>
                                  {r.clientTelephone && <div style={{ marginBottom: 4 }}><a href={`tel:${r.clientTelephone}`} style={{ fontSize: 14, color: "#C4531A", fontWeight: 600 }}>{r.clientTelephone}</a></div>}
                                  {r.notes && <div style={{ fontSize: 13, color: "#6B6560" }}>{r.notes}</div>}
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
                    )}

                    {dayChantiers.length === 0 && dayRdvs.length === 0 && (
                      <div style={{ textAlign: "center", padding: "40px 16px" }}>
                        <p style={{ fontSize: 14, color: "#9C958D", marginBottom: 12 }}>Rien de pr&eacute;vu ce jour</p>
                        <button onClick={() => openNewChantier()} style={btnPrimary}>+ Ajouter un chantier</button>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          )}

          {/* ── MONTH VIEW ── */}
          {viewMode === "mois" && (
            <div style={CARD}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", borderBottom: "1px solid #EDEBE7" }}>
                {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map(d => (
                  <div key={d} style={{ padding: "8px 4px", textAlign: "center", fontSize: 11, fontWeight: 700, color: "#9B9590", textTransform: "uppercase" }}>{d}</div>
                ))}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)" }}>
                {(() => {
                  const firstOfMonth = new Date(monday.getFullYear(), monday.getMonth(), 1);
                  const lastOfMonth = new Date(monday.getFullYear(), monday.getMonth() + 1, 0);
                  const startDay = firstOfMonth.getDay() === 0 ? 6 : firstOfMonth.getDay() - 1;
                  const cells: { date: Date; inMonth: boolean }[] = [];
                  for (let i = -startDay; i <= lastOfMonth.getDate() + (6 - (lastOfMonth.getDay() === 0 ? 6 : lastOfMonth.getDay() - 1)); i++) {
                    const d = new Date(firstOfMonth); d.setDate(d.getDate() + i);
                    cells.push({ date: d, inMonth: d.getMonth() === monday.getMonth() });
                  }
                  return cells.slice(0, 42).map((cell, i) => {
                    const ds = fmtDate(cell.date);
                    const isToday = ds === todayStr;
                    const dayChantiers = getChantiersForDay(ds);
                    const dayRdvs = getRdvsForDay(ds);
                    const hasEvents = dayChantiers.length > 0 || dayRdvs.length > 0;
                    return (
                      <div key={i} onClick={() => goToDay(cell.date)} style={{ padding: "6px 4px", minHeight: 64, borderRight: (i + 1) % 7 !== 0 ? "1px solid #F3F4F6" : "none", borderBottom: "1px solid #F3F4F6", cursor: "pointer", background: isToday ? "rgba(196,83,26,.04)" : "transparent", opacity: cell.inMonth ? 1 : 0.3 }}>
                        <div style={{ fontSize: 13, fontWeight: isToday ? 700 : 400, color: isToday ? "#C4531A" : "#3D2E1F", textAlign: "center", marginBottom: 4 }}>{cell.date.getDate()}</div>
                        {dayChantiers.slice(0, 2).map(c => (
                          <div key={c.id} style={{ fontSize: 9, fontWeight: 600, color: "#fff", background: c._invite ? "#9CA3AF" : c.couleur, borderRadius: 3, padding: "1px 4px", marginBottom: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.nom}</div>
                        ))}
                        {dayRdvs.slice(0, 1).map(r => (
                          <div key={r.id} style={{ fontSize: 9, color: "#6B7280", padding: "1px 4px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{r.clientNom}</div>
                        ))}
                        {hasEvents && dayChantiers.length + dayRdvs.length > 3 && (
                          <div style={{ fontSize: 8, color: "#9CA3AF", textAlign: "center" }}>+{dayChantiers.length + dayRdvs.length - 3}</div>
                        )}
                      </div>
                    );
                  });
                })()}
              </div>
            </div>
          )}

          {/* ── DESKTOP: Week grid ── */}
          {viewMode === "semaine" && <div className="max-md:hidden" style={CARD}>
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
                      background: b._invite ? "#9CA3AF" : b.couleur,
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
                      opacity: b.statut === "ANNULE" ? 0.4 : b.statut === "TERMINE" ? 0.6 : b._invite ? 0.7 : 1,
                    }}>
                      <span>{b._invite ? `\u2709 ${b.nom}` : b.nom}</span>
                      {b.adresse && <span style={{ opacity: 0.7, fontSize: 11 }}>{b.adresse}</span>}
                      {(b.collaborateurs || []).length > 0 && (
                        <span style={{ display: "inline-flex", gap: 2, marginLeft: "auto", flexShrink: 0 }}>
                          {(b.collaborateurs || []).slice(0, 3).map(col => (
                            <span key={col.id} style={{ width: 20, height: 20, borderRadius: "50%", background: "rgba(255,255,255,.3)", fontSize: 8, fontWeight: 700, display: "inline-flex", alignItems: "center", justifyContent: "center" }} title={col.nom}>
                              {getInitials(col.nom)}
                            </span>
                          ))}
                          {(b.collaborateurs || []).length > 3 && <span style={{ fontSize: 9, opacity: 0.7 }}>+{(b.collaborateurs || []).length - 3}</span>}
                        </span>
                      )}
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
          </div>}

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
                      <div key={c.id} onClick={() => setDetailChantier(c)} style={{ padding: "12px 14px", borderRadius: 12, background: c._invite ? "#F9FAFB" : "#fff", borderLeft: `4px solid ${c._invite ? "#9CA3AF" : c.couleur}`, border: `1px solid ${c._invite ? "#D1D5DB" : c.couleur + "33"}`, cursor: "pointer", opacity: c._invite ? 0.8 : 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <div style={{ width: 10, height: 10, borderRadius: "50%", background: c._invite ? "#9CA3AF" : c.couleur, flexShrink: 0 }} />
                          <span style={{ fontSize: 14, fontWeight: 700, color: "#3D2E1F" }}>{c._invite ? `\u2709 ` : ""}{c.nom}</span>
                        </div>
                        {c._invite && c._invitePar && <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 2, paddingLeft: 18 }}>Invit&eacute; par {c._invitePar}</div>}
                        {c.adresse && <div style={{ fontSize: 12, color: "#6B6560", marginTop: 4, paddingLeft: 18 }}>{c.adresse}{c.ville ? ` \u2013 ${c.ville}` : ""}</div>}
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 4, paddingLeft: 18 }}>
                          <span style={{ fontSize: 11, color: "#9C958D" }}>
                            {span > 1 ? `${span} jours` : "1 jour"}{c.heureDebut ? ` \u00b7 ${c.heureDebut}${c.heureFin ? `\u2013${c.heureFin}` : ""}` : ""}
                            {c.clientNom ? ` \u00b7 ${c.clientNom}` : ""}
                          </span>
                          {(c.collaborateurs || []).length > 0 && (
                            <span style={{ display: "inline-flex", gap: 2 }}>
                              {(c.collaborateurs || []).slice(0, 3).map(col => (
                                <span key={col.id} style={{ width: 22, height: 22, borderRadius: "50%", background: col.source === "BATIVIO" ? "#C4531A" : "#6B7280", color: "#fff", fontSize: 8, fontWeight: 700, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>{getInitials(col.nom)}</span>
                              ))}
                            </span>
                          )}
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
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.4)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }} onClick={() => { setDetailChantier(null); setShowAddCollab(false); }}>
          <div onClick={e => e.stopPropagation()} style={{ background: "#fff", borderRadius: 16, padding: 28, maxWidth: 480, width: "100%", maxHeight: "85vh", overflow: "auto" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <div style={{ width: 14, height: 14, borderRadius: "50%", background: detailChantier._invite ? "#9CA3AF" : detailChantier.couleur }} />
              <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 20, fontWeight: 700, color: "#3D2E1F", margin: 0 }}>{detailChantier.nom}</h2>
            </div>
            {detailChantier._invite && detailChantier._invitePar && (
              <div style={{ padding: "6px 12px", borderRadius: 8, background: "#F3F4F6", fontSize: 12, color: "#6B7280", marginBottom: 12 }}>
                Invit&eacute; par <strong>{detailChantier._invitePar}</strong> &mdash; lecture seule
              </div>
            )}
            <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 13, color: "#6B6560" }}>
              <div><span style={{ fontWeight: 600, color: "#3D2E1F" }}>P&eacute;riode :</span> {new Date(detailChantier.dateDebut).toLocaleDateString("fr-FR")} &rarr; {new Date(detailChantier.dateFin).toLocaleDateString("fr-FR")}</div>
              {detailChantier.heureDebut && <div><span style={{ fontWeight: 600, color: "#3D2E1F" }}>Horaires :</span> {detailChantier.heureDebut}{detailChantier.heureFin ? ` \u2013 ${detailChantier.heureFin}` : ""}</div>}
              {detailChantier.adresse && <div><span style={{ fontWeight: 600, color: "#3D2E1F" }}>Adresse :</span> {detailChantier.adresse}{detailChantier.ville ? `, ${detailChantier.ville}` : ""}</div>}
              {detailChantier.clientNom && <div><span style={{ fontWeight: 600, color: "#3D2E1F" }}>Client :</span> {detailChantier.clientNom}{detailChantier.clientTelephone ? ` \u2013 ` : ""}{detailChantier.clientTelephone && <a href={`tel:${detailChantier.clientTelephone}`} style={{ color: "#C4531A", fontWeight: 600 }}>{detailChantier.clientTelephone}</a>}</div>}
              {detailChantier.notes && <div><span style={{ fontWeight: 600, color: "#3D2E1F" }}>Notes :</span> {detailChantier.notes}</div>}
              {detailChantier.montantDevis != null && <div><span style={{ fontWeight: 600, color: "#3D2E1F" }}>Montant :</span> {detailChantier.montantDevis.toLocaleString("fr-FR")} &euro;</div>}
              <div><span style={{ fontWeight: 600, color: "#3D2E1F" }}>Statut :</span> {detailChantier.statut.replace("_", " ")}</div>
            </div>

            {/* ── Equipe / Collaborateurs ── */}
            {!detailChantier._invite && (
              <div style={{ marginTop: 20, paddingTop: 16, borderTop: "1px solid #EDEBE7" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: "#3D2E1F" }}>&Eacute;quipe</span>
                  <button onClick={() => { setShowAddCollab(v => !v); setCollabTab("manuel"); setCollabForm({ nom: "", telephone: "", role: "" }); setBativioQuery(""); setBativioResults([]); }} style={{ fontSize: 12, fontWeight: 600, color: "#C4531A", background: "none", border: "none", cursor: "pointer" }}>
                    {showAddCollab ? "Annuler" : "+ Ajouter"}
                  </button>
                </div>

                {/* Collab list */}
                {(detailChantier.collaborateurs || []).length > 0 ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {(detailChantier.collaborateurs || []).map(col => (
                      <div key={col.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "6px 10px", borderRadius: 8, background: "#FAF8F5", border: "1px solid #EDEBE7" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span style={{ width: 28, height: 28, borderRadius: "50%", background: col.source === "BATIVIO" ? "#C4531A" : "#6B7280", color: "#fff", fontSize: 10, fontWeight: 700, display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            {getInitials(col.nom)}
                          </span>
                          <div>
                            <div style={{ fontSize: 13, fontWeight: 600, color: "#3D2E1F" }}>{col.nom}</div>
                            <div style={{ fontSize: 11, color: "#9C958D" }}>
                              {col.role || "collaborateur"}{col.source === "BATIVIO" ? " \u2014 Bativio" : ""}
                              {col.telephone ? ` \u00b7 ${col.telephone}` : ""}
                            </div>
                          </div>
                        </div>
                        <button onClick={() => removeCollab(detailChantier.id, col.id)} style={{ fontSize: 16, color: "#9C958D", background: "none", border: "none", cursor: "pointer", padding: "0 4px" }}>&times;</button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ fontSize: 12, color: "#C5C0B9", fontStyle: "italic" }}>Aucun collaborateur</p>
                )}

                {/* Add collab form */}
                {showAddCollab && (
                  <div style={{ marginTop: 12, padding: 14, borderRadius: 10, background: "#FAF8F5", border: "1px solid #EDEBE7" }}>
                    {/* Tabs */}
                    <div style={{ display: "flex", gap: 4, marginBottom: 12 }}>
                      {(["manuel", "bativio", "gmail"] as const).map(t => (
                        <button key={t} onClick={() => { if (t !== "gmail") setCollabTab(t); }} style={{
                          flex: 1, padding: "6px 8px", borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: t === "gmail" ? "default" : "pointer", border: "none",
                          background: collabTab === t ? "#C4531A" : t === "gmail" ? "#F3F4F6" : "#fff",
                          color: collabTab === t ? "#fff" : t === "gmail" ? "#C5C0B9" : "#3D2E1F",
                          opacity: t === "gmail" ? 0.6 : 1,
                        }}>
                          {t === "manuel" ? "Manuel" : t === "bativio" ? "Bativio" : "Gmail"}
                        </button>
                      ))}
                    </div>

                    {collabTab === "manuel" && (
                      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        <input value={collabForm.nom} onChange={e => setCollabForm(f => ({ ...f, nom: e.target.value }))} placeholder="Nom *" style={inputStyle} />
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                          <input value={collabForm.telephone} onChange={e => setCollabForm(f => ({ ...f, telephone: e.target.value }))} placeholder="T&eacute;l&eacute;phone" style={inputStyle} />
                          <input value={collabForm.role} onChange={e => setCollabForm(f => ({ ...f, role: e.target.value }))} placeholder="R&ocirc;le" style={inputStyle} />
                        </div>
                        <button onClick={() => addCollabManuel(detailChantier.id)} disabled={collabSaving || !collabForm.nom} style={{ ...btnPrimary, opacity: collabSaving || !collabForm.nom ? 0.5 : 1, fontSize: 12, padding: "8px 16px" }}>
                          {collabSaving ? "..." : "Ajouter"}
                        </button>
                      </div>
                    )}

                    {collabTab === "bativio" && (
                      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        <input value={bativioQuery} onChange={e => searchBativio(e.target.value)} placeholder="Rechercher un artisan Bativio..." style={inputStyle} />
                        {bativioSearching && <p style={{ fontSize: 11, color: "#9C958D" }}>Recherche...</p>}
                        {bativioResults.length > 0 && (
                          <div style={{ display: "flex", flexDirection: "column", gap: 4, maxHeight: 160, overflow: "auto" }}>
                            {bativioResults.map(r => (
                              <button key={r.id} onClick={() => addCollabBativio(detailChantier.id, r)} disabled={collabSaving} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", borderRadius: 8, background: "#fff", border: "1px solid #EDEBE7", cursor: "pointer", textAlign: "left", width: "100%", opacity: collabSaving ? 0.5 : 1 }}>
                                <span style={{ width: 28, height: 28, borderRadius: "50%", background: "#C4531A", color: "#fff", fontSize: 10, fontWeight: 700, display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                  {getInitials(r.nomAffichage)}
                                </span>
                                <div>
                                  <div style={{ fontSize: 13, fontWeight: 600, color: "#3D2E1F" }}>{r.nomAffichage}</div>
                                  <div style={{ fontSize: 11, color: "#9C958D" }}>{r.metierNom || ""}{r.ville ? ` \u00b7 ${r.ville}` : ""}</div>
                                </div>
                              </button>
                            ))}
                          </div>
                        )}
                        {bativioQuery.length >= 2 && !bativioSearching && bativioResults.length === 0 && (
                          <p style={{ fontSize: 12, color: "#C5C0B9" }}>Aucun artisan trouv&eacute;</p>
                        )}
                      </div>
                    )}

                    {collabTab === "gmail" && (
                      <div style={{ textAlign: "center", padding: 16 }}>
                        <p style={{ fontSize: 13, color: "#9C958D" }}>Import Google Contacts</p>
                        <p style={{ fontSize: 12, color: "#C5C0B9", marginTop: 4 }}>Bient&ocirc;t disponible</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
              {!detailChantier._invite && (
                <>
                  <button onClick={() => openEditChantier(detailChantier)} style={btnPrimary}>Modifier</button>
                  <button onClick={() => deleteChantier(detailChantier.id)} style={{ ...btnSecondary, color: "#DC2626", borderColor: "#FCA5A5" }}>Supprimer</button>
                </>
              )}
              <button onClick={() => { setDetailChantier(null); setShowAddCollab(false); }} style={btnSecondary}>Fermer</button>
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
