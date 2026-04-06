"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";

interface Prestation {
  id: string;
  designation: string;
  unite: string;
  prixUnitaire: number;
  categorie: string | null;
  isCustom: boolean;
}

const UNITES = ["u", "h", "m\u00b2", "ml", "m\u00b3", "forfait"];

export default function TarifsPage() {
  const { fetchWithAuth } = useAuth();
  const [prestations, setPrestations] = useState<Prestation[]>([]);
  const [loading, setLoading] = useState(true);

  // Edit state
  const [editId, setEditId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ designation: "", prixUnitaire: 0, unite: "u", categorie: "" });

  // Add state
  const [showAdd, setShowAdd] = useState(false);
  const [addForm, setAddForm] = useState({ designation: "", prixUnitaire: 0, unite: "u", categorie: "" });
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    try {
      const data = await fetchWithAuth("/artisans/me/prestations");
      const list = Array.isArray(data) ? data as Prestation[] : [];
      if (list.length === 0) {
        // Auto-seed defaults
        try {
          await fetchWithAuth("/artisans/me/prestations/seed", { method: "POST" });
          const seeded = await fetchWithAuth("/artisans/me/prestations");
          setPrestations(Array.isArray(seeded) ? seeded as Prestation[] : []);
          return;
        } catch { /* seed failed, show empty */ }
      }
      setPrestations(list);
    } catch { setPrestations([]); }
    finally { setLoading(false); }
  }, [fetchWithAuth]);

  useEffect(() => { load(); }, [load]);

  const handleEdit = (p: Prestation) => {
    setEditId(p.id);
    setEditForm({ designation: p.designation, prixUnitaire: p.prixUnitaire, unite: p.unite, categorie: p.categorie || "" });
  };

  const handleSaveEdit = async () => {
    if (!editId) return;
    setSaving(true);
    try {
      await fetchWithAuth(`/artisans/me/prestations/${editId}`, {
        method: "PUT",
        body: JSON.stringify(editForm),
      });
      setEditId(null);
      await load();
    } catch { /* silent */ }
    finally { setSaving(false); }
  };

  const handleAdd = async () => {
    if (!addForm.designation || addForm.prixUnitaire < 0) return;
    setSaving(true);
    try {
      await fetchWithAuth("/artisans/me/prestations", {
        method: "POST",
        body: JSON.stringify(addForm),
      });
      setAddForm({ designation: "", prixUnitaire: 0, unite: "u", categorie: "" });
      setShowAdd(false);
      await load();
    } catch { /* silent */ }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer cette prestation ?")) return;
    try {
      await fetchWithAuth(`/artisans/me/prestations/${id}`, { method: "DELETE" });
      await load();
    } catch { /* silent */ }
  };

  // Group by category
  const grouped: Record<string, Prestation[]> = {};
  for (const p of prestations) {
    const cat = p.categorie || "Autre";
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(p);
  }
  const categories = Object.keys(grouped).sort();

  const inputStyle: React.CSSProperties = { width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #E8D5C0", fontSize: 14, fontFamily: "'Karla',sans-serif" };

  return (
    <div style={{ maxWidth: 800, margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontFamily: "'Fraunces',serif", fontSize: 24, fontWeight: 700, color: "#3D2E1F" }}>Mes tarifs</h1>
          <p style={{ fontSize: 13, color: "#9C958D", marginTop: 4 }}>Configurez vos prix pour les devis et le Devis IA.</p>
        </div>
        <button onClick={() => setShowAdd(true)} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "10px 18px", borderRadius: 10, background: "#C4531A", color: "#fff", fontSize: 13, fontWeight: 600, border: "none", cursor: "pointer" }}>
          + Ajouter
        </button>
      </div>

      {/* Add form */}
      {showAdd && (
        <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #E8D5C0", padding: 20, marginBottom: 16 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: "#3D2E1F", marginBottom: 12 }}>Nouvelle prestation</h3>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 10 }} className="max-md:!grid-cols-1">
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: "#5C4A3A", display: "block", marginBottom: 4 }}>{"D\u00e9signation *"}</label>
              <input value={addForm.designation} onChange={e => setAddForm(f => ({ ...f, designation: e.target.value }))} placeholder={"Remplacement \u00e9cran"} style={inputStyle} />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: "#5C4A3A", display: "block", marginBottom: 4 }}>{"Prix HT *"}</label>
              <input type="number" step="0.01" value={addForm.prixUnitaire || ""} onChange={e => setAddForm(f => ({ ...f, prixUnitaire: parseFloat(e.target.value) || 0 }))} placeholder="89" style={inputStyle} />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: "#5C4A3A", display: "block", marginBottom: 4 }}>{"Unit\u00e9 *"}</label>
              <select value={addForm.unite} onChange={e => setAddForm(f => ({ ...f, unite: e.target.value }))} style={inputStyle}>
                {UNITES.map(u => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: "#5C4A3A", display: "block", marginBottom: 4 }}>{"Cat\u00e9gorie"}</label>
              <input value={addForm.categorie} onChange={e => setAddForm(f => ({ ...f, categorie: e.target.value }))} placeholder={"R\u00e9paration"} style={inputStyle} />
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
            <button onClick={handleAdd} disabled={saving || !addForm.designation} style={{ padding: "8px 20px", borderRadius: 8, background: "#C4531A", color: "#fff", fontSize: 13, fontWeight: 600, border: "none", cursor: "pointer", opacity: saving || !addForm.designation ? 0.5 : 1 }}>
              {saving ? "..." : "Ajouter"}
            </button>
            <button onClick={() => setShowAdd(false)} style={{ padding: "8px 20px", borderRadius: 8, background: "#F7F5F2", color: "#5C4A3A", fontSize: 13, fontWeight: 600, border: "none", cursor: "pointer" }}>Annuler</button>
          </div>
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: "center", padding: 60, color: "#9C958D" }}>Chargement...</div>
      ) : prestations.length === 0 ? (
        <div style={{ textAlign: "center", padding: "48px 24px", background: "#fff", borderRadius: 14, border: "1px solid #E8D5C0" }}>
          <p style={{ fontSize: 16, fontWeight: 600, color: "#3D2E1F", marginBottom: 8 }}>Aucune prestation</p>
          <p style={{ fontSize: 13, color: "#9C958D", marginBottom: 16 }}>Ajoutez vos tarifs pour que le Devis IA utilise vos vrais prix.</p>
          <button onClick={() => setShowAdd(true)} style={{ padding: "10px 24px", borderRadius: 10, background: "#C4531A", color: "#fff", fontSize: 14, fontWeight: 600, border: "none", cursor: "pointer" }}>+ Ajouter une prestation</button>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {categories.map(cat => (
            <div key={cat} style={{ background: "#fff", borderRadius: 14, border: "1px solid #E8D5C0", overflow: "hidden" }}>
              <div style={{ padding: "12px 20px", background: "#F9FAFB", borderBottom: "1px solid #EDEBE7" }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#3D2E1F", textTransform: "uppercase", letterSpacing: 0.5 }}>{cat}</span>
                <span style={{ fontSize: 12, color: "#9C958D", marginLeft: 8 }}>({grouped[cat].length})</span>
              </div>
              {grouped[cat].map(p => (
                <div key={p.id} style={{ padding: "12px 20px", borderBottom: "1px solid #F3F4F6", display: "flex", alignItems: "center", gap: 12 }}>
                  {editId === p.id ? (
                    /* Edit mode */
                    <div style={{ flex: 1, display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 8, alignItems: "center" }} className="max-md:!grid-cols-1">
                      <input value={editForm.designation} onChange={e => setEditForm(f => ({ ...f, designation: e.target.value }))} style={inputStyle} />
                      <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                        <input type="number" step="0.01" value={editForm.prixUnitaire || ""} onChange={e => setEditForm(f => ({ ...f, prixUnitaire: parseFloat(e.target.value) || 0 }))} style={{ ...inputStyle, width: 80 }} />
                        <span style={{ fontSize: 13, color: "#9C958D" }}>{"\u20ac"}</span>
                        <select value={editForm.unite} onChange={e => setEditForm(f => ({ ...f, unite: e.target.value }))} style={{ ...inputStyle, width: 70 }}>
                          {UNITES.map(u => <option key={u} value={u}>{u}</option>)}
                        </select>
                      </div>
                      <div style={{ display: "flex", gap: 4 }}>
                        <button onClick={handleSaveEdit} disabled={saving} style={{ padding: "6px 14px", borderRadius: 6, background: "#C4531A", color: "#fff", fontSize: 12, fontWeight: 600, border: "none", cursor: "pointer" }}>{saving ? "..." : "OK"}</button>
                        <button onClick={() => setEditId(null)} style={{ padding: "6px 14px", borderRadius: 6, background: "#F3F4F6", color: "#6B6560", fontSize: 12, fontWeight: 600, border: "none", cursor: "pointer" }}>Annuler</button>
                      </div>
                    </div>
                  ) : (
                    /* View mode */
                    <>
                      <span style={{ flex: 1, fontSize: 14, color: "#3D2E1F" }}>{p.designation}</span>
                      <span style={{ fontSize: 14, fontWeight: 700, color: "#C4531A", fontFamily: "monospace", minWidth: 70, textAlign: "right" }}>{p.prixUnitaire}{"\u20ac"}</span>
                      <span style={{ fontSize: 12, color: "#9C958D", minWidth: 40 }}>/{p.unite}</span>
                      <button onClick={() => handleEdit(p)} style={{ fontSize: 14, background: "none", border: "none", cursor: "pointer", padding: "4px 8px", color: "#6B6560" }} title="Modifier">{"\u270f\ufe0f"}</button>
                      <button onClick={() => handleDelete(p.id)} style={{ fontSize: 14, background: "none", border: "none", cursor: "pointer", padding: "4px 8px", color: "#DC2626" }} title="Supprimer">{"\ud83d\uddd1\ufe0f"}</button>
                    </>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
