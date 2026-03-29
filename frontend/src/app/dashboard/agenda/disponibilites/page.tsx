"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

/* ── Types ── */
interface DaySlot {
  jour: string;
  label: string;
  actif: boolean;
  heureDebut: string;
  heureFin: string;
  pauseDebut: string;
  pauseFin: string;
  dureeSlot: number; // minutes
}

const DUREES = [15, 30, 45, 60, 90, 120];

const DEFAULTS: DaySlot[] = [
  { jour: "LUNDI", label: "Lundi", actif: true, heureDebut: "08:00", heureFin: "18:00", pauseDebut: "12:00", pauseFin: "13:30", dureeSlot: 60 },
  { jour: "MARDI", label: "Mardi", actif: true, heureDebut: "08:00", heureFin: "18:00", pauseDebut: "12:00", pauseFin: "13:30", dureeSlot: 60 },
  { jour: "MERCREDI", label: "Mercredi", actif: true, heureDebut: "08:00", heureFin: "18:00", pauseDebut: "12:00", pauseFin: "13:30", dureeSlot: 60 },
  { jour: "JEUDI", label: "Jeudi", actif: true, heureDebut: "08:00", heureFin: "18:00", pauseDebut: "12:00", pauseFin: "13:30", dureeSlot: 60 },
  { jour: "VENDREDI", label: "Vendredi", actif: true, heureDebut: "08:00", heureFin: "18:00", pauseDebut: "12:00", pauseFin: "13:30", dureeSlot: 60 },
  { jour: "SAMEDI", label: "Samedi", actif: true, heureDebut: "08:00", heureFin: "12:00", pauseDebut: "", pauseFin: "", dureeSlot: 60 },
  { jour: "DIMANCHE", label: "Dimanche", actif: false, heureDebut: "", heureFin: "", pauseDebut: "", pauseFin: "", dureeSlot: 60 },
];

/* ── Component ── */
export default function DisponibilitesPage() {
  const { fetchWithAuth } = useAuth();

  const [slots, setSlots] = useState<DaySlot[]>(DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const loadDispos = useCallback(async () => {
    try {
      const data = await fetchWithAuth("/artisans/me/disponibilites");
      const list = Array.isArray(data) ? data as DaySlot[] : [];
      if (list.length > 0) {
        // Merge loaded data with defaults (keep label from defaults)
        const merged = DEFAULTS.map((def) => {
          const found = list.find((d) => d.jour === def.jour);
          return found ? { ...def, ...found, label: def.label } : def;
        });
        setSlots(merged);
      }
    } catch {
      // Use defaults on error
    } finally {
      setLoading(false);
    }
  }, [fetchWithAuth]);

  useEffect(() => {
    loadDispos();
  }, [loadDispos]);

  const updateSlot = (index: number, patch: Partial<DaySlot>) => {
    setSlots((prev) => prev.map((s, i) => (i === index ? { ...s, ...patch } : s)));
    setSaved(false);
  };

  const handleSave = async () => {
    setError("");
    setSaving(true);
    setSaved(false);
    try {
      const payload = slots.map(({ jour, actif, heureDebut, heureFin, pauseDebut, pauseFin, dureeSlot }) => ({
        jour, actif, heureDebut, heureFin, pauseDebut, pauseFin, dureeSlot,
      }));
      await fetchWithAuth("/artisans/me/disponibilites", {
        method: "PUT",
        body: JSON.stringify(payload),
      });
      setSaved(true);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Erreur lors de la sauvegarde.");
    } finally {
      setSaving(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    padding: "8px 10px", borderRadius: 8, border: "1.5px solid #EDEBE7",
    fontSize: 13, outline: "none", fontFamily: "'Karla',sans-serif",
    width: "100%", minWidth: 0, background: "#fff",
  };

  const disabledInputStyle: React.CSSProperties = {
    ...inputStyle,
    background: "#F7F5F2", color: "#C5C0B9", cursor: "not-allowed",
  };

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <Link
          href="/dashboard/agenda"
          style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            fontSize: 13, fontWeight: 600, color: "#C4531A",
            textDecoration: "none", marginBottom: 12,
          }}
        >
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6"/></svg>
          Retour à l&apos;agenda
        </Link>
        <h1 style={{ fontFamily: "'Fraunces',serif", fontSize: 26, fontWeight: 700, color: "#1C1C1E", margin: 0 }}>
          Mes disponibilités
        </h1>
        <p style={{ fontSize: 14, color: "#9B9590", marginTop: 6 }}>
          Définissez vos créneaux pour chaque jour de la semaine. Vos clients pourront réserver un RDV sur les créneaux disponibles.
        </p>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: 60, color: "#9B9590", fontSize: 14 }}>
          Chargement...
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div style={{
            background: "#fff", borderRadius: 14, border: "1.5px solid #EDEBE7",
            overflow: "hidden", boxShadow: "0 4px 24px rgba(28,28,30,.04)",
          }}>
            {/* Column headers (desktop) */}
            <div
              className="hidden md:grid"
              style={{
                gridTemplateColumns: "140px 60px 1fr 1fr 1fr 1fr 100px",
                gap: 12, padding: "14px 20px",
                background: "#F7F5F2", borderBottom: "1px solid #EDEBE7",
                fontSize: 11, fontWeight: 700, color: "#9B9590",
                textTransform: "uppercase", letterSpacing: 0.5,
              }}
            >
              <div>Jour</div>
              <div>Actif</div>
              <div>Début</div>
              <div>Fin</div>
              <div>Pause début</div>
              <div>Pause fin</div>
              <div>Durée slot</div>
            </div>

            {/* Rows */}
            {slots.map((slot, idx) => (
              <div
                key={slot.jour}
                className="md:grid"
                style={{
                  gridTemplateColumns: "140px 60px 1fr 1fr 1fr 1fr 100px",
                  gap: 12, padding: "14px 20px",
                  borderBottom: idx < slots.length - 1 ? "1px solid #F7F5F2" : "none",
                  alignItems: "center",
                  opacity: slot.actif ? 1 : 0.5,
                  transition: "opacity .15s",
                }}
              >
                {/* Day label */}
                <div style={{ fontWeight: 700, fontSize: 14, color: "#1C1C1E", marginBottom: 8 }} className="md:!mb-0">
                  {slot.label}
                </div>

                {/* Toggle */}
                <div style={{ marginBottom: 8 }} className="md:!mb-0">
                  <button
                    onClick={() => updateSlot(idx, { actif: !slot.actif })}
                    style={{
                      width: 44, height: 24, borderRadius: 12, border: "none",
                      background: slot.actif ? "#C4531A" : "#E0DDD8",
                      cursor: "pointer", position: "relative", transition: "background .2s",
                    }}
                  >
                    <span style={{
                      position: "absolute", top: 2, left: slot.actif ? 22 : 2,
                      width: 20, height: 20, borderRadius: "50%", background: "#fff",
                      boxShadow: "0 1px 3px rgba(0,0,0,.15)", transition: "left .2s",
                    }} />
                  </button>
                </div>

                {/* Inputs — Mobile labels */}
                <div className="max-md:grid max-md:grid-cols-2 max-md:gap-2" style={{ display: "contents" }}>
                  <div>
                    <label className="md:hidden" style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#9B9590", marginBottom: 2 }}>Début</label>
                    <input
                      type="time"
                      value={slot.heureDebut}
                      onChange={(e) => updateSlot(idx, { heureDebut: e.target.value })}
                      disabled={!slot.actif}
                      style={slot.actif ? inputStyle : disabledInputStyle}
                    />
                  </div>
                  <div>
                    <label className="md:hidden" style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#9B9590", marginBottom: 2 }}>Fin</label>
                    <input
                      type="time"
                      value={slot.heureFin}
                      onChange={(e) => updateSlot(idx, { heureFin: e.target.value })}
                      disabled={!slot.actif}
                      style={slot.actif ? inputStyle : disabledInputStyle}
                    />
                  </div>
                  <div>
                    <label className="md:hidden" style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#9B9590", marginBottom: 2 }}>Pause début</label>
                    <input
                      type="time"
                      value={slot.pauseDebut}
                      onChange={(e) => updateSlot(idx, { pauseDebut: e.target.value })}
                      disabled={!slot.actif}
                      placeholder="—"
                      style={slot.actif ? inputStyle : disabledInputStyle}
                    />
                  </div>
                  <div>
                    <label className="md:hidden" style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#9B9590", marginBottom: 2 }}>Pause fin</label>
                    <input
                      type="time"
                      value={slot.pauseFin}
                      onChange={(e) => updateSlot(idx, { pauseFin: e.target.value })}
                      disabled={!slot.actif}
                      placeholder="—"
                      style={slot.actif ? inputStyle : disabledInputStyle}
                    />
                  </div>
                  <div>
                    <label className="md:hidden" style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#9B9590", marginBottom: 2 }}>Durée slot</label>
                    <select
                      value={slot.dureeSlot}
                      onChange={(e) => updateSlot(idx, { dureeSlot: Number(e.target.value) })}
                      disabled={!slot.actif}
                      style={slot.actif ? { ...inputStyle, cursor: "pointer" } : disabledInputStyle}
                    >
                      {DUREES.map((d) => (
                        <option key={d} value={d}>{d} min</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Separator on mobile */}
                {idx < slots.length - 1 && (
                  <div className="md:hidden" style={{ gridColumn: "1 / -1", height: 1, background: "#F7F5F2", margin: "4px 0" }} />
                )}
              </div>
            ))}
          </div>

          {/* Save area */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 24, flexWrap: "wrap" }}>
            <button
              onClick={handleSave}
              disabled={saving}
              style={{
                padding: "12px 28px", borderRadius: 10, fontSize: 14, fontWeight: 700,
                background: "#C4531A", color: "#fff", border: "none", cursor: "pointer",
                opacity: saving ? 0.6 : 1, transition: "all .15s",
              }}
            >
              {saving ? "Enregistrement..." : "Enregistrer mes disponibilités"}
            </button>
            {saved && (
              <span style={{ fontSize: 13, fontWeight: 600, color: "#22c55e", display: "inline-flex", alignItems: "center", gap: 4 }}>
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg>
                Enregistré
              </span>
            )}
            {error && (
              <span style={{ fontSize: 13, fontWeight: 600, color: "#DC2626" }}>{error}</span>
            )}
          </div>
        </>
      )}
    </div>
  );
}
