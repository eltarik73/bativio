"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";

interface MetierData {
  id: string;
  nom: string;
  slug: string;
  icone: string | null;
}

export default function AdminMetiersPage() {
  const { fetchWithAuth } = useAuth();
  const [metiers, setMetiers] = useState<MetierData[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ nom: "", slug: "", icone: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const fetchMetiers = useCallback(async () => {
    try {
      const data = await fetch("/api/v1/public/metiers").then((r) => r.json());
      if (data.success) setMetiers(data.data);
    } catch { /* empty */ }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchMetiers(); }, [fetchMetiers]);

  const openAdd = () => {
    setEditId(null);
    setForm({ nom: "", slug: "", icone: "" });
    setError("");
    setModalOpen(true);
  };

  const openEdit = (m: MetierData) => {
    setEditId(m.id);
    setForm({ nom: m.nom, slug: m.slug, icone: m.icone || "" });
    setError("");
    setModalOpen(true);
  };

  const generateSlug = (nom: string) => {
    return nom.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  };

  const handleSave = async () => {
    if (!form.nom.trim()) { setError("Le nom est requis"); return; }
    const slug = form.slug || generateSlug(form.nom);
    setSaving(true);
    setError("");
    try {
      if (editId) {
        await fetchWithAuth(`/admin/metiers/${editId}`, {
          method: "PUT",
          body: JSON.stringify({ nom: form.nom, slug, icone: form.icone || null }),
        });
      } else {
        await fetchWithAuth("/admin/metiers", {
          method: "POST",
          body: JSON.stringify({ nom: form.nom, slug, icone: form.icone || null }),
        });
      }
      setModalOpen(false);
      await fetchMetiers();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <h1 style={{ fontFamily: "'Fraunces',serif", fontSize: 24, fontWeight: 700, color: "var(--bois,#3D2E1F)" }}>Métiers</h1>
        <button onClick={openAdd} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "10px 20px", borderRadius: 10, background: "#C4531A", color: "#fff", fontSize: 14, fontWeight: 600, border: "none", cursor: "pointer", transition: "background .15s" }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "#D4733A"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "#C4531A"; }}
        >
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" /></svg>
          Ajouter un métier
        </button>
      </div>

      <div style={{ background: "#fff", borderRadius: 14, border: "1px solid var(--sable,#E8D5C0)", overflow: "hidden", boxShadow: "0 2px 12px rgba(28,28,30,.04)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#F7F5F2", borderBottom: "1px solid #EDEBE7" }}>
              <th style={{ textAlign: "left", padding: "14px 20px", fontSize: 11, fontWeight: 600, color: "var(--pierre,#9C958D)", textTransform: "uppercase", letterSpacing: 0.5, width: 80 }}>Icône</th>
              <th style={{ textAlign: "left", padding: "14px 20px", fontSize: 11, fontWeight: 600, color: "var(--pierre,#9C958D)", textTransform: "uppercase", letterSpacing: 0.5 }}>Nom</th>
              <th style={{ textAlign: "left", padding: "14px 20px", fontSize: 11, fontWeight: 600, color: "var(--pierre,#9C958D)", textTransform: "uppercase", letterSpacing: 0.5 }}>Slug</th>
              <th style={{ padding: "14px 20px", width: 120 }}></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={4} style={{ padding: 32, textAlign: "center", color: "var(--pierre,#9C958D)" }}>Chargement...</td></tr>
            ) : metiers.map((m, idx) => (
              <tr key={m.id} style={{ borderBottom: idx < metiers.length - 1 ? "1px solid #F7F5F2" : "none", background: idx % 2 === 1 ? "#FAF8F5" : "#fff", transition: "background .15s" }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "#F7F5F2"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = idx % 2 === 1 ? "#FAF8F5" : "#fff"; }}
              >
                <td style={{ padding: "14px 20px" }}>
                  <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 40, height: 40, borderRadius: 10, background: "rgba(196,83,26,.06)", fontSize: 22 }}>{m.icone || "🔨"}</span>
                </td>
                <td style={{ padding: "14px 20px", fontSize: 14, fontWeight: 600, color: "var(--bois,#3D2E1F)" }}>{m.nom}</td>
                <td style={{ padding: "14px 20px", fontSize: 13, color: "var(--pierre,#9C958D)", fontFamily: "monospace" }}>{m.slug}</td>
                <td style={{ padding: "14px 20px", textAlign: "right" }}>
                  <button onClick={() => openEdit(m)} style={{ padding: "6px 14px", borderRadius: 8, border: "1.5px solid #E0DDD8", background: "#fff", fontSize: 12, fontWeight: 600, color: "var(--bois-mid,#5C4A3A)", cursor: "pointer", transition: "all .15s" }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#C4531A"; e.currentTarget.style.color = "#C4531A"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#E0DDD8"; e.currentTarget.style.color = "#6B6560"; }}
                  >Modifier</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 999, background: "rgba(0,0,0,.4)", display: "flex", alignItems: "center", justifyContent: "center" }} onClick={() => setModalOpen(false)}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: "#fff", borderRadius: 16, padding: 32, width: 420, maxWidth: "90vw", boxShadow: "0 8px 32px rgba(0,0,0,.15)" }}>
            <h3 style={{ fontFamily: "'Fraunces',serif", fontSize: 20, fontWeight: 700, color: "var(--bois,#3D2E1F)", marginBottom: 20 }}>{editId ? "Modifier le métier" : "Ajouter un métier"}</h3>
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: "var(--bois,#3D2E1F)", display: "block", marginBottom: 6 }}>Nom</label>
              <input value={form.nom} onChange={(e) => setForm({ ...form, nom: e.target.value, slug: editId ? form.slug : generateSlug(e.target.value) })} placeholder="ex: Plombier" style={{ width: "100%", height: 42, padding: "0 14px", borderRadius: 8, border: "1.5px solid #E0DDD8", fontSize: 14 }} />
            </div>
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: "var(--bois,#3D2E1F)", display: "block", marginBottom: 6 }}>Slug</label>
              <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="auto-genere" style={{ width: "100%", height: 42, padding: "0 14px", borderRadius: 8, border: "1.5px solid #E0DDD8", fontSize: 14, fontFamily: "monospace", color: "var(--pierre,#9C958D)" }} />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: "var(--bois,#3D2E1F)", display: "block", marginBottom: 6 }}>Icône (emoji)</label>
              <input value={form.icone} onChange={(e) => setForm({ ...form, icone: e.target.value })} placeholder="🔧" style={{ width: "100%", height: 42, padding: "0 14px", borderRadius: 8, border: "1.5px solid #E0DDD8", fontSize: 22, textAlign: "center" }} />
            </div>
            {error && <p style={{ fontSize: 13, color: "#dc2626", marginBottom: 12 }}>{error}</p>}
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setModalOpen(false)} style={{ flex: 1, height: 44, borderRadius: 10, border: "1.5px solid #E0DDD8", background: "none", fontSize: 14, fontWeight: 600, color: "var(--bois-mid,#5C4A3A)", cursor: "pointer" }}>Annuler</button>
              <button onClick={handleSave} disabled={saving} style={{ flex: 1, height: 44, borderRadius: 10, background: "#C4531A", color: "#fff", border: "none", fontSize: 14, fontWeight: 600, cursor: "pointer", opacity: saving ? 0.5 : 1 }}>{saving ? "..." : editId ? "Enregistrer" : "Ajouter"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
