"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";

interface DemandeListItem {
  id: string;
  description: string;
  villeLabel: string | null;
  metierDetecte: string | null;
  contactNom: string | null;
  contactEmail: string | null;
  statut: string;
  qualifScore: number | null;
  createdAt: string;
  preDevisJson: { fourchetteHt?: { min: number; max: number } } | null;
  _count: { envois: number; devis: number };
}

interface Stats { [key: string]: number }

const STATUT_LABEL: Record<string, { label: string; color: string; bg: string }> = {
  NOUVELLE: { label: "Nouvelle", color: "#C4531A", bg: "rgba(196,83,26,.08)" },
  EN_ATTENTE: { label: "En attente", color: "#C9943A", bg: "rgba(201,148,58,.12)" },
  ROUTEE: { label: "Routée", color: "#4A6741", bg: "rgba(74,103,65,.1)" },
  DEVIS_ENVOYE: { label: "Devis envoyé", color: "#3D2E1F", bg: "rgba(61,46,31,.08)" },
  CLOTUREE: { label: "Clôturée", color: "#9C958D", bg: "rgba(156,149,141,.12)" },
};

export default function AdminDemandesProjetsPage() {
  const { fetchWithAuth } = useAuth();
  const [items, setItems] = useState<DemandeListItem[]>([]);
  const [stats, setStats] = useState<Stats>({});
  const [loading, setLoading] = useState(true);
  const [filterStatut, setFilterStatut] = useState<string>("");
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState({ modeDefault: "MANUEL", delaiManuelMin: 120, emailTemplate: "" });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const qs = filterStatut ? `?statut=${filterStatut}` : "";
      const r = await fetchWithAuth(`/admin/demandes-projets${qs}`);
      const d = r as { items: DemandeListItem[]; stats: Stats };
      setItems(d.items || []);
      setStats(d.stats || {});
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [fetchWithAuth, filterStatut]);

  useEffect(() => { load(); }, [load]);

  const loadSettings = async () => {
    try {
      const r = await fetchWithAuth("/admin/routage-settings");
      if (r) setSettings({ ...settings, ...(r as typeof settings) });
    } catch { /* noop */ }
  };

  const saveSettings = async () => {
    try {
      await fetchWithAuth("/admin/routage-settings", { method: "PUT", body: JSON.stringify(settings) });
      setShowSettings(false);
    } catch { /* noop */ }
  };

  useEffect(() => { if (showSettings) loadSettings(); }, [showSettings]);

  const totalNouvelle = stats.NOUVELLE || 0;
  const totalRoutee = stats.ROUTEE || 0;
  const totalDevisEnvoye = stats.DEVIS_ENVOYE || 0;

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "24px 0 60px" }}>
      {/* HEADER */}
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 28, flexWrap: "wrap", gap: 16 }}>
        <div>
          <h1 style={{ fontFamily: "'Fraunces',serif", fontSize: 30, fontWeight: 600, color: "#3D2E1F", letterSpacing: -0.5 }}>
            Demandes <span style={{ fontStyle: "italic", fontWeight: 400, color: "#C4531A" }}>projets</span>
          </h1>
          <p style={{ fontSize: 14, color: "#6B6560", marginTop: 6 }}>Qualifications client IA, routage aux artisans.</p>
        </div>
        <button onClick={() => setShowSettings(true)} style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 18px", borderRadius: 10, background: "#3D2E1F", color: "#fff", fontSize: 13, fontWeight: 600, border: "none", cursor: "pointer" }}>
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" /></svg>
          Réglages routage auto
        </button>
      </div>

      {/* STATS */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 24 }} className="max-md:!grid-cols-2">
        {[
          { label: "Nouvelles à traiter", value: totalNouvelle, color: "#C4531A" },
          { label: "Routées aux artisans", value: totalRoutee, color: "#4A6741" },
          { label: "Devis envoyés", value: totalDevisEnvoye, color: "#3D2E1F" },
          { label: "Total demandes", value: items.length, color: "#9C958D" },
        ].map((s) => (
          <div key={s.label} style={{ background: "#fff", borderRadius: 14, border: "1px solid #E8D5C0", padding: 18 }}>
            <div style={{ fontSize: 11, color: "#9C958D", textTransform: "uppercase", letterSpacing: .5, fontWeight: 600, marginBottom: 6 }}>{s.label}</div>
            <div style={{ fontFamily: "'Fraunces',serif", fontSize: 28, fontWeight: 600, color: s.color, letterSpacing: -.5 }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* FILTRES */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {[
          { v: "", l: "Toutes" },
          { v: "NOUVELLE", l: "Nouvelles" },
          { v: "EN_ATTENTE", l: "En attente" },
          { v: "ROUTEE", l: "Routées" },
          { v: "DEVIS_ENVOYE", l: "Devis envoyés" },
          { v: "CLOTUREE", l: "Clôturées" },
        ].map((f) => (
          <button
            key={f.v}
            onClick={() => setFilterStatut(f.v)}
            style={{
              padding: "8px 16px",
              borderRadius: 999,
              fontSize: 13,
              fontWeight: 500,
              border: "1px solid",
              borderColor: filterStatut === f.v ? "#3D2E1F" : "#E8D5C0",
              background: filterStatut === f.v ? "#3D2E1F" : "transparent",
              color: filterStatut === f.v ? "#fff" : "#5C4A3A",
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            {f.l}
          </button>
        ))}
      </div>

      {/* LIST */}
      {loading ? (
        <div style={{ textAlign: "center", padding: 60, color: "#9C958D" }}>Chargement...</div>
      ) : items.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 24px", background: "#fff", borderRadius: 14, border: "1px solid #E8D5C0" }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
          <p style={{ fontSize: 16, fontWeight: 600, color: "#3D2E1F", marginBottom: 6 }}>Aucune demande {filterStatut && `(${STATUT_LABEL[filterStatut]?.label.toLowerCase()})`}</p>
          <p style={{ fontSize: 13, color: "#9C958D" }}>Les demandes qualifiées par l&apos;IA apparaîtront ici.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {items.map((d) => {
            const st = STATUT_LABEL[d.statut] || STATUT_LABEL.NOUVELLE;
            return (
              <Link
                key={d.id}
                href={`/admin/demandes-projets/${d.id}`}
                style={{
                  display: "flex",
                  gap: 16,
                  padding: "18px 20px",
                  background: "#fff",
                  borderRadius: 14,
                  border: "1px solid #E8D5C0",
                  textDecoration: "none",
                  transition: "all .2s",
                  alignItems: "flex-start",
                }}
                className="hover:!shadow-[0_8px_24px_rgba(196,83,26,.1)] hover:!border-transparent"
              >
                <div style={{ flexShrink: 0, width: 6, height: 6, borderRadius: "50%", background: st.color, marginTop: 8 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6, flexWrap: "wrap" }}>
                    <span style={{ padding: "3px 10px", borderRadius: 999, background: st.bg, color: st.color, fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: .3 }}>{st.label}</span>
                    {d.metierDetecte && (
                      <span style={{ padding: "3px 10px", borderRadius: 999, background: "rgba(196,83,26,.08)", color: "#C4531A", fontSize: 11, fontWeight: 600, textTransform: "capitalize" }}>{d.metierDetecte}</span>
                    )}
                    {d.villeLabel && <span style={{ fontSize: 12, color: "#9C958D" }}>📍 {d.villeLabel}</span>}
                    {d.qualifScore !== null && d.qualifScore >= 80 && (
                      <span style={{ fontSize: 11, color: "#4A6741", fontWeight: 600 }}>● Bien qualifiée</span>
                    )}
                  </div>
                  <div style={{ fontSize: 14, color: "#3D2E1F", fontFamily: "'Fraunces',serif", fontWeight: 500, marginBottom: 6, display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                    « {d.description.slice(0, 140)}{d.description.length > 140 ? "…" : ""} »
                  </div>
                  <div style={{ display: "flex", gap: 16, fontSize: 12, color: "#9C958D" }}>
                    {d.contactNom && <span>👤 {d.contactNom}</span>}
                    {d.preDevisJson?.fourchetteHt && (
                      <span style={{ color: "#C4531A", fontWeight: 600 }}>
                        {d.preDevisJson.fourchetteHt.min}–{d.preDevisJson.fourchetteHt.max} € HT
                      </span>
                    )}
                    <span>📨 {d._count.envois} envois</span>
                    {d._count.devis > 0 && <span style={{ color: "#4A6741", fontWeight: 600 }}>📄 {d._count.devis} devis</span>}
                  </div>
                </div>
                <div style={{ fontSize: 11, color: "#9C958D", textAlign: "right", flexShrink: 0 }}>
                  {new Date(d.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* SETTINGS MODAL */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowSettings(false)}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.4)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
          >
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              style={{ background: "#fff", borderRadius: 18, padding: 28, maxWidth: 560, width: "100%", maxHeight: "90vh", overflow: "auto" }}
            >
              <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 22, fontWeight: 600, color: "#3D2E1F", marginBottom: 6 }}>
                Réglages routage <span style={{ fontStyle: "italic", color: "#C4531A" }}>automatique</span>
              </h2>
              <p style={{ fontSize: 13, color: "#6B6560", marginBottom: 20 }}>
                Choisissez comment les demandes qualifiées sont routées aux artisans.
              </p>

              <label style={{ fontSize: 12, fontWeight: 600, color: "#5C4A3A", textTransform: "uppercase", letterSpacing: .5, display: "block", marginBottom: 8 }}>
                Mode par défaut
              </label>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
                {[
                  { v: "MANUEL", l: "Manuel — le webmaster sélectionne les artisans", desc: "Contrôle total, aucun envoi automatique." },
                  { v: "AUTO_CONCERNES", l: "Auto — artisans concernés", desc: "Métier détecté + ville matchés, tous plans." },
                  { v: "AUTO_PRO", l: "Auto — artisans PRO uniquement", desc: "Métier + ville + plan PRO/BUSINESS." },
                  { v: "AUTO_BUSINESS", l: "Auto — artisans BUSINESS uniquement", desc: "Métier + ville + plan BUSINESS seul." },
                  { v: "AUTO_TOUS", l: "Auto — TOUS les artisans du métier", desc: "Maximiser les propositions, peu importe la ville." },
                ].map((o) => (
                  <label
                    key={o.v}
                    style={{
                      display: "flex",
                      gap: 10,
                      padding: 14,
                      borderRadius: 10,
                      border: `1px solid ${settings.modeDefault === o.v ? "#C4531A" : "#E8D5C0"}`,
                      background: settings.modeDefault === o.v ? "rgba(196,83,26,.04)" : "#FAF8F5",
                      cursor: "pointer",
                    }}
                  >
                    <input
                      type="radio"
                      name="modeDefault"
                      value={o.v}
                      checked={settings.modeDefault === o.v}
                      onChange={(e) => setSettings((s) => ({ ...s, modeDefault: e.target.value }))}
                      style={{ marginTop: 2 }}
                    />
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "#3D2E1F" }}>{o.l}</div>
                      <div style={{ fontSize: 12, color: "#6B6560" }}>{o.desc}</div>
                    </div>
                  </label>
                ))}
              </div>

              <label style={{ fontSize: 12, fontWeight: 600, color: "#5C4A3A", textTransform: "uppercase", letterSpacing: .5, display: "block", marginBottom: 8 }}>
                Délai avant auto-routage (en mode MANUEL)
              </label>
              <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 20 }}>
                <input
                  type="number"
                  value={settings.delaiManuelMin ?? ""}
                  onChange={(e) => setSettings((s) => ({ ...s, delaiManuelMin: e.target.value ? parseInt(e.target.value) : 0 }))}
                  placeholder="120"
                  style={{ width: 100, padding: "10px 12px", borderRadius: 8, border: "1px solid #E8D5C0", fontSize: 14 }}
                />
                <span style={{ fontSize: 13, color: "#6B6560" }}>minutes sans action → auto-routage</span>
              </div>

              <div style={{ display: "flex", gap: 10, marginTop: 24, justifyContent: "flex-end" }}>
                <button onClick={() => setShowSettings(false)} style={{ padding: "10px 20px", borderRadius: 10, background: "#F7F5F2", color: "#5C4A3A", fontSize: 13, fontWeight: 600, border: "none", cursor: "pointer" }}>
                  Annuler
                </button>
                <button onClick={saveSettings} style={{ padding: "10px 20px", borderRadius: 10, background: "#C4531A", color: "#fff", fontSize: 13, fontWeight: 600, border: "none", cursor: "pointer" }}>
                  Enregistrer
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
