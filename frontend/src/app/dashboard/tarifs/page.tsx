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

interface Tarification {
  tarifHoraire: number;
  tarifUrgence: number | null;
  minimumFacture: number | null;
  minimumHeures: number | null;
  fraisDeplacementType: "forfait" | "km";
  fraisDeplacementMontant: number;
  prixKm: number | null;
  margeFournitures: number;
  tvaDefault: number;
  assuranceNumero: string | null;
  assuranceNom: string | null;
  fourniturePolicy: "artisan_fournit" | "client_peut_fournir" | "peu_importe";
  indiceBtRef: string | null;
  zonesIntervention: string[] | null;
  notesTarif: string | null;
}

interface TarifMetier {
  id?: string;
  metierSlug: string;
  metierNom: string;
  tarifHoraire: number;
  tarifUrgence: number | null;
  tarifWeekend: number | null;
  minimumFacture: number | null;
  minimumHeures: number | null;
  notes: string | null;
}

const METIERS_OPTIONS = [
  { slug: "plombier", nom: "Plombier" },
  { slug: "electricien", nom: "Électricien" },
  { slug: "peintre", nom: "Peintre" },
  { slug: "carreleur", nom: "Carreleur" },
  { slug: "macon", nom: "Maçon" },
  { slug: "menuisier", nom: "Menuisier" },
  { slug: "couvreur", nom: "Couvreur" },
  { slug: "chauffagiste", nom: "Chauffagiste" },
  { slug: "serrurier", nom: "Serrurier" },
  { slug: "cuisiniste", nom: "Cuisiniste" },
];

const UNITES = ["u", "h", "m\u00b2", "ml", "m\u00b3", "forfait"];

const DEFAULT_TARIF: Tarification = {
  tarifHoraire: 55,
  tarifUrgence: null,
  minimumFacture: null,
  minimumHeures: null,
  fraisDeplacementType: "forfait",
  fraisDeplacementMontant: 30,
  prixKm: null,
  margeFournitures: 25,
  tvaDefault: 10,
  assuranceNumero: null,
  assuranceNom: null,
  fourniturePolicy: "artisan_fournit",
  indiceBtRef: "BT01",
  zonesIntervention: null,
  notesTarif: null,
};

export default function TarifsPage() {
  const { fetchWithAuth } = useAuth();
  const [prestations, setPrestations] = useState<Prestation[]>([]);
  const [loading, setLoading] = useState(true);
  const [tarif, setTarif] = useState<Tarification>(DEFAULT_TARIF);
  const [savingTarif, setSavingTarif] = useState(false);
  const [tarifSaved, setTarifSaved] = useState(false);

  const [tarifsMetiers, setTarifsMetiers] = useState<TarifMetier[]>([]);
  const [showAddMetier, setShowAddMetier] = useState(false);
  const [newMetier, setNewMetier] = useState<TarifMetier>({ metierSlug: "plombier", metierNom: "Plombier", tarifHoraire: 55, tarifUrgence: null, tarifWeekend: null, minimumFacture: null, minimumHeures: null, notes: null });
  const [savingMetier, setSavingMetier] = useState(false);

  const [editId, setEditId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ designation: "", prixUnitaire: 0, unite: "u", categorie: "" });

  const [showAdd, setShowAdd] = useState(false);
  const [addForm, setAddForm] = useState({ designation: "", prixUnitaire: 0, unite: "u", categorie: "" });
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    try {
      const [prestationsData, tarifData, tarifsMetiersData] = await Promise.all([
        fetchWithAuth("/artisans/me/prestations"),
        fetchWithAuth("/artisans/me/tarification").catch(() => null),
        fetchWithAuth("/artisans/me/tarifs-metiers").catch(() => []),
      ]);
      if (Array.isArray(tarifsMetiersData)) setTarifsMetiers(tarifsMetiersData as TarifMetier[]);
      const list = Array.isArray(prestationsData) ? prestationsData as Prestation[] : [];
      if (list.length === 0) {
        try {
          await fetchWithAuth("/artisans/me/prestations/seed", { method: "POST" });
          const seeded = await fetchWithAuth("/artisans/me/prestations");
          setPrestations(Array.isArray(seeded) ? seeded as Prestation[] : []);
        } catch { setPrestations([]); }
      } else {
        setPrestations(list);
      }
      if (tarifData) {
        setTarif({ ...DEFAULT_TARIF, ...(tarifData as Partial<Tarification>) });
      }
    } catch { setPrestations([]); }
    finally { setLoading(false); }
  }, [fetchWithAuth]);

  useEffect(() => { load(); }, [load]);

  const saveTarif = async () => {
    setSavingTarif(true);
    try {
      await fetchWithAuth("/artisans/me/tarification", {
        method: "PUT",
        body: JSON.stringify(tarif),
      });
      setTarifSaved(true);
      setTimeout(() => setTarifSaved(false), 2500);
    } catch { /* silent */ }
    finally { setSavingTarif(false); }
  };

  const saveMetier = async () => {
    if (!newMetier.metierSlug || !newMetier.tarifHoraire) return;
    setSavingMetier(true);
    try {
      await fetchWithAuth("/artisans/me/tarifs-metiers", {
        method: "POST",
        body: JSON.stringify(newMetier),
      });
      setShowAddMetier(false);
      setNewMetier({ metierSlug: "plombier", metierNom: "Plombier", tarifHoraire: 55, tarifUrgence: null, tarifWeekend: null, minimumFacture: null, minimumHeures: null, notes: null });
      await load();
    } catch { /* silent */ }
    finally { setSavingMetier(false); }
  };

  const deleteMetier = async (slug: string) => {
    if (!confirm("Supprimer ce tarif métier ?")) return;
    try {
      await fetchWithAuth(`/artisans/me/tarifs-metiers/${slug}`, { method: "DELETE" });
      await load();
    } catch { /* silent */ }
  };

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

  const grouped: Record<string, Prestation[]> = {};
  for (const p of prestations) {
    const cat = p.categorie || "Autre";
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(p);
  }
  const categories = Object.keys(grouped).sort();

  const completion = (() => {
    let score = 0;
    if (tarif.tarifHoraire > 0) score += 25;
    if (tarif.fraisDeplacementMontant > 0) score += 10;
    if (tarif.assuranceNumero) score += 15;
    if (tarif.tvaDefault > 0) score += 10;
    if (tarif.minimumFacture) score += 10;
    if (prestations.length >= 3) score += 20;
    if (tarif.notesTarif) score += 10;
    return Math.min(score, 100);
  })();

  const inputStyle: React.CSSProperties = { width: "100%", padding: "10px 12px", borderRadius: 10, border: "1px solid #E8D5C0", fontSize: 14, fontFamily: "'Karla',sans-serif", background: "#FAF8F5" };
  const labelStyle: React.CSSProperties = { fontSize: 11, fontWeight: 600, color: "#5C4A3A", display: "block", marginBottom: 5, textTransform: "uppercase", letterSpacing: 0.5 };
  const hintStyle: React.CSSProperties = { fontSize: 11, color: "#9C958D", marginTop: 4 };

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", paddingBottom: 60 }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: "'Fraunces',serif", fontSize: 28, fontWeight: 600, color: "#3D2E1F", letterSpacing: -0.5 }}>
          Ma grille <span style={{ fontStyle: "italic", fontWeight: 400, color: "#C4531A" }}>tarifaire</span>
        </h1>
        <p style={{ fontSize: 14, color: "#6B6560", marginTop: 6, lineHeight: 1.5 }}>
          Ces informations alimentent le Devis IA et garantissent des chiffrages à votre juste prix.
        </p>
        <div style={{ marginTop: 16, background: "#fff", borderRadius: 12, padding: "12px 16px", border: "1px solid #E8D5C0", display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, color: "#6B6560", fontWeight: 600, marginBottom: 4 }}>
              Complétude de ta grille : <span style={{ color: "#C4531A", fontWeight: 700 }}>{completion}%</span>
            </div>
            <div style={{ height: 6, background: "#F2EAE0", borderRadius: 3, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${completion}%`, background: "linear-gradient(90deg, #C4531A, #C9943A)", transition: "width .4s" }} />
            </div>
          </div>
          {completion < 100 && <div style={{ fontSize: 11, color: "#9C958D", fontStyle: "italic" }}>Plus elle est complète, plus le Devis IA est précis.</div>}
        </div>
      </div>

      {/* ═══ GRILLE TARIFAIRE ═══ */}
      <section style={{ background: "#fff", borderRadius: 16, border: "1px solid #E8D5C0", padding: 24, marginBottom: 24 }}>
        <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 18, fontWeight: 600, color: "#3D2E1F", marginBottom: 4 }}>Tarifs de base</h2>
        <p style={{ fontSize: 13, color: "#9C958D", marginBottom: 20 }}>Votre tarif horaire, minimums et règles générales.</p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 14 }} className="max-md:!grid-cols-2">
          <div>
            <label style={labelStyle}>Tarif horaire HT *</label>
            <div style={{ position: "relative" }}>
              <input type="number" step="0.5" value={tarif.tarifHoraire} onChange={e => setTarif(t => ({ ...t, tarifHoraire: parseFloat(e.target.value) || 0 }))} style={inputStyle} />
              <span style={{ position: "absolute", right: 12, top: 10, color: "#9C958D", fontSize: 13 }}>€/h</span>
            </div>
          </div>
          <div>
            <label style={labelStyle}>Tarif urgence (dépannage)</label>
            <div style={{ position: "relative" }}>
              <input type="number" step="0.5" value={tarif.tarifUrgence ?? ""} onChange={e => setTarif(t => ({ ...t, tarifUrgence: e.target.value ? parseFloat(e.target.value) : null }))} placeholder="Optionnel" style={inputStyle} />
              <span style={{ position: "absolute", right: 12, top: 10, color: "#9C958D", fontSize: 13 }}>€/h</span>
            </div>
          </div>
          <div>
            <label style={labelStyle}>Minimum facture</label>
            <div style={{ position: "relative" }}>
              <input type="number" step="10" value={tarif.minimumFacture ?? ""} onChange={e => setTarif(t => ({ ...t, minimumFacture: e.target.value ? parseFloat(e.target.value) : null }))} placeholder="Optionnel" style={inputStyle} />
              <span style={{ position: "absolute", right: 12, top: 10, color: "#9C958D", fontSize: 13 }}>€ HT</span>
            </div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }} className="max-md:!grid-cols-2">
          <div>
            <label style={labelStyle}>Minimum heures</label>
            <div style={{ position: "relative" }}>
              <input type="number" step="0.5" value={tarif.minimumHeures ?? ""} onChange={e => setTarif(t => ({ ...t, minimumHeures: e.target.value ? parseFloat(e.target.value) : null }))} placeholder="Ex : 2" style={inputStyle} />
              <span style={{ position: "absolute", right: 12, top: 10, color: "#9C958D", fontSize: 13 }}>h</span>
            </div>
          </div>
          <div>
            <label style={labelStyle}>Marge fournitures</label>
            <div style={{ position: "relative" }}>
              <input type="number" step="1" value={tarif.margeFournitures} onChange={e => setTarif(t => ({ ...t, margeFournitures: parseFloat(e.target.value) || 0 }))} style={inputStyle} />
              <span style={{ position: "absolute", right: 12, top: 10, color: "#9C958D", fontSize: 13 }}>%</span>
            </div>
          </div>
          <div>
            <label style={labelStyle}>TVA par défaut</label>
            <select value={tarif.tvaDefault} onChange={e => setTarif(t => ({ ...t, tvaDefault: parseFloat(e.target.value) }))} style={inputStyle}>
              <option value="5.5">5,5% (économie énergie)</option>
              <option value="10">10% (rénovation)</option>
              <option value="20">20% (neuf / standard)</option>
            </select>
          </div>
        </div>
      </section>

      {/* ═══ DÉPLACEMENT ═══ */}
      <section style={{ background: "#fff", borderRadius: 16, border: "1px solid #E8D5C0", padding: 24, marginBottom: 24 }}>
        <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 18, fontWeight: 600, color: "#3D2E1F", marginBottom: 4 }}>Déplacement</h2>
        <p style={{ fontSize: 13, color: "#9C958D", marginBottom: 20 }}>Frais facturés pour se rendre chez le client.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }} className="max-md:!grid-cols-1">
          <div>
            <label style={labelStyle}>Type</label>
            <select value={tarif.fraisDeplacementType} onChange={e => setTarif(t => ({ ...t, fraisDeplacementType: e.target.value as "forfait" | "km" }))} style={inputStyle}>
              <option value="forfait">Forfait fixe</option>
              <option value="km">Au kilomètre</option>
            </select>
          </div>
          <div>
            <label style={labelStyle}>{tarif.fraisDeplacementType === "forfait" ? "Montant forfait" : "Forfait de base"}</label>
            <div style={{ position: "relative" }}>
              <input type="number" step="1" value={tarif.fraisDeplacementMontant} onChange={e => setTarif(t => ({ ...t, fraisDeplacementMontant: parseFloat(e.target.value) || 0 }))} style={inputStyle} />
              <span style={{ position: "absolute", right: 12, top: 10, color: "#9C958D", fontSize: 13 }}>€</span>
            </div>
          </div>
          <div>
            <label style={labelStyle}>Prix au km (au-delà zone)</label>
            <div style={{ position: "relative" }}>
              <input type="number" step="0.05" value={tarif.prixKm ?? ""} onChange={e => setTarif(t => ({ ...t, prixKm: e.target.value ? parseFloat(e.target.value) : null }))} placeholder="Optionnel" style={inputStyle} />
              <span style={{ position: "absolute", right: 12, top: 10, color: "#9C958D", fontSize: 13 }}>€/km</span>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ ASSURANCE + INDICE ═══ */}
      <section style={{ background: "#fff", borderRadius: 16, border: "1px solid #E8D5C0", padding: 24, marginBottom: 24 }}>
        <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 18, fontWeight: 600, color: "#3D2E1F", marginBottom: 4 }}>Assurance & indice de révision</h2>
        <p style={{ fontSize: 13, color: "#9C958D", marginBottom: 20 }}>Informations obligatoires pour la conformité devis (mentions légales 2026).</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }} className="max-md:!grid-cols-1">
          <div>
            <label style={labelStyle}>Compagnie d&apos;assurance</label>
            <input value={tarif.assuranceNom ?? ""} onChange={e => setTarif(t => ({ ...t, assuranceNom: e.target.value || null }))} placeholder="Ex : MAAF, Groupama..." style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>N° police décennale</label>
            <input value={tarif.assuranceNumero ?? ""} onChange={e => setTarif(t => ({ ...t, assuranceNumero: e.target.value || null }))} placeholder="N° contrat" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Indice BT de référence</label>
            <select value={tarif.indiceBtRef ?? "BT01"} onChange={e => setTarif(t => ({ ...t, indiceBtRef: e.target.value }))} style={inputStyle}>
              <option value="BT01">BT01 (tous corps d&apos;état)</option>
              <option value="BT03">BT03 (béton armé / maçonnerie)</option>
              <option value="BT06">BT06 (plomberie sanitaire)</option>
              <option value="BT13">BT13 (plâtrerie)</option>
              <option value="BT46">BT46 (peinture)</option>
            </select>
            <p style={hintStyle}>Utilisé pour la révision des prix sur marchés longs.</p>
          </div>
        </div>
      </section>

      {/* ═══ NOTES LIBRES ═══ */}
      <section style={{ background: "#fff", borderRadius: 16, border: "1px solid #E8D5C0", padding: 24, marginBottom: 24 }}>
        <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 18, fontWeight: 600, color: "#3D2E1F", marginBottom: 4 }}>Notes pour le Devis IA</h2>
        <p style={{ fontSize: 13, color: "#9C958D", marginBottom: 16 }}>Spécificités, contraintes, garanties personnalisées. Visible uniquement par l&apos;IA.</p>
        <textarea value={tarif.notesTarif ?? ""} onChange={e => setTarif(t => ({ ...t, notesTarif: e.target.value || null }))} rows={4} placeholder="Ex : Je ne fais pas de fourniture pour la chaudière, uniquement la pose. Garantie 2 ans sur la main d'œuvre. Paiement 30% à la commande, 70% à la fin du chantier." style={{ ...inputStyle, resize: "vertical", fontFamily: "inherit" }} />
      </section>

      {/* Save bar sticky */}
      <div style={{ position: "sticky", bottom: 16, zIndex: 50, display: "flex", justifyContent: "flex-end", marginBottom: 32 }}>
        <button onClick={saveTarif} disabled={savingTarif} style={{
          padding: "14px 32px",
          borderRadius: 12,
          background: tarifSaved ? "#4A6741" : "#C4531A",
          color: "#fff",
          fontSize: 14,
          fontWeight: 600,
          border: "none",
          cursor: savingTarif ? "not-allowed" : "pointer",
          opacity: savingTarif ? 0.6 : 1,
          boxShadow: "0 10px 30px rgba(196,83,26,.25)",
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          transition: "background .3s",
        }}>
          {savingTarif ? "Sauvegarde..." : tarifSaved ? "✓ Enregistré" : "Enregistrer la grille"}
        </button>
      </div>

      {/* ═══ TARIFS HORAIRES PAR MÉTIER ═══ */}
      <section style={{ background: "#fff", borderRadius: 16, border: "1px solid #E8D5C0", padding: 24, marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 14, flexWrap: "wrap", gap: 10 }}>
          <div>
            <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 18, fontWeight: 600, color: "#3D2E1F" }}>
              Tarifs par <span style={{ fontStyle: "italic", fontWeight: 400, color: "#C4531A" }}>métier</span>
            </h2>
            <p style={{ fontSize: 13, color: "#9C958D", marginTop: 2 }}>Si tu exerces plusieurs métiers, définis un tarif par métier (obligatoire pour Devis IA multi-corps).</p>
          </div>
          <button onClick={() => setShowAddMetier(true)} style={{ padding: "8px 14px", borderRadius: 10, background: "#C4531A", color: "#fff", fontSize: 12, fontWeight: 600, border: "none", cursor: "pointer" }}>
            + Ajouter un métier
          </button>
        </div>

        {tarifsMetiers.length === 0 ? (
          <div style={{ padding: "20px 14px", background: "#FAF8F5", borderRadius: 10, textAlign: "center", border: "1px dashed #E8D5C0" }}>
            <p style={{ fontSize: 13, color: "#6B6560", marginBottom: 8 }}>Aucun tarif par métier configuré.</p>
            <p style={{ fontSize: 12, color: "#9C958D" }}>Le Devis IA utilisera le tarif horaire global ci-dessus.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {tarifsMetiers.map((m) => (
              <div key={m.metierSlug} style={{ padding: 14, background: "#FAF8F5", borderRadius: 10, border: "1px solid #F2EAE0", display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
                <div style={{ minWidth: 110 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#3D2E1F" }}>{m.metierNom}</div>
                  <div style={{ fontSize: 10, color: "#9C958D", textTransform: "uppercase", letterSpacing: .5 }}>{m.metierSlug}</div>
                </div>
                <div style={{ display: "flex", gap: 18, flex: 1, flexWrap: "wrap" }}>
                  <div>
                    <div style={{ fontSize: 10, color: "#9C958D", textTransform: "uppercase", fontWeight: 600 }}>Horaire</div>
                    <div style={{ fontFamily: "'Fraunces',serif", fontSize: 18, fontWeight: 600, color: "#C4531A" }}>{m.tarifHoraire}€</div>
                  </div>
                  {m.tarifUrgence && (
                    <div>
                      <div style={{ fontSize: 10, color: "#9C958D", textTransform: "uppercase", fontWeight: 600 }}>Urgence</div>
                      <div style={{ fontFamily: "'Fraunces',serif", fontSize: 16, fontWeight: 600, color: "#3D2E1F" }}>{m.tarifUrgence}€</div>
                    </div>
                  )}
                  {m.tarifWeekend && (
                    <div>
                      <div style={{ fontSize: 10, color: "#9C958D", textTransform: "uppercase", fontWeight: 600 }}>Weekend</div>
                      <div style={{ fontFamily: "'Fraunces',serif", fontSize: 16, fontWeight: 600, color: "#3D2E1F" }}>{m.tarifWeekend}€</div>
                    </div>
                  )}
                  {m.minimumFacture && (
                    <div>
                      <div style={{ fontSize: 10, color: "#9C958D", textTransform: "uppercase", fontWeight: 600 }}>Min facture</div>
                      <div style={{ fontSize: 13, color: "#3D2E1F", fontWeight: 500 }}>{m.minimumFacture}€</div>
                    </div>
                  )}
                </div>
                <button onClick={() => deleteMetier(m.metierSlug)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 14, color: "#DC2626", padding: 4 }} title="Supprimer">🗑️</button>
              </div>
            ))}
          </div>
        )}

        {showAddMetier && (
          <div style={{ marginTop: 14, padding: 18, background: "rgba(196,83,26,.04)", borderRadius: 12, border: "1px solid rgba(196,83,26,.15)" }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: "#3D2E1F", marginBottom: 12 }}>Nouveau tarif métier</h3>
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr", gap: 8, marginBottom: 10 }} className="max-md:!grid-cols-2">
              <div>
                <label style={labelStyle}>Métier</label>
                <select
                  value={newMetier.metierSlug}
                  onChange={(e) => {
                    const m = METIERS_OPTIONS.find((o) => o.slug === e.target.value)!;
                    setNewMetier((n) => ({ ...n, metierSlug: m.slug, metierNom: m.nom }));
                  }}
                  style={inputStyle}
                >
                  {METIERS_OPTIONS.filter((o) => !tarifsMetiers.find((t) => t.metierSlug === o.slug)).map((o) => (
                    <option key={o.slug} value={o.slug}>{o.nom}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Horaire *</label>
                <input type="number" step="0.5" value={newMetier.tarifHoraire} onChange={(e) => setNewMetier((n) => ({ ...n, tarifHoraire: parseFloat(e.target.value) || 0 }))} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Urgence</label>
                <input type="number" step="0.5" value={newMetier.tarifUrgence ?? ""} onChange={(e) => setNewMetier((n) => ({ ...n, tarifUrgence: e.target.value ? parseFloat(e.target.value) : null }))} placeholder="—" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Weekend</label>
                <input type="number" step="0.5" value={newMetier.tarifWeekend ?? ""} onChange={(e) => setNewMetier((n) => ({ ...n, tarifWeekend: e.target.value ? parseFloat(e.target.value) : null }))} placeholder="—" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Min € HT</label>
                <input type="number" step="10" value={newMetier.minimumFacture ?? ""} onChange={(e) => setNewMetier((n) => ({ ...n, minimumFacture: e.target.value ? parseFloat(e.target.value) : null }))} placeholder="—" style={inputStyle} />
              </div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={saveMetier} disabled={savingMetier || !newMetier.tarifHoraire} style={{ padding: "8px 16px", borderRadius: 8, background: "#C4531A", color: "#fff", fontSize: 12, fontWeight: 600, border: "none", cursor: "pointer", opacity: savingMetier || !newMetier.tarifHoraire ? 0.5 : 1 }}>
                {savingMetier ? "..." : "Ajouter"}
              </button>
              <button onClick={() => setShowAddMetier(false)} style={{ padding: "8px 16px", borderRadius: 8, background: "#F7F5F2", color: "#5C4A3A", fontSize: 12, fontWeight: 600, border: "none", cursor: "pointer" }}>
                Annuler
              </button>
            </div>
          </div>
        )}
      </section>

      {/* ═══ FORFAITS / PRESTATIONS ═══ */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <div>
          <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 22, fontWeight: 600, color: "#3D2E1F", letterSpacing: -0.3 }}>
            Mes <span style={{ fontStyle: "italic", fontWeight: 400, color: "#C4531A" }}>forfaits</span>
          </h2>
          <p style={{ fontSize: 13, color: "#9C958D", marginTop: 4 }}>Prestations prédéfinies : le Devis IA les utilisera telles quelles.</p>
        </div>
        <button onClick={() => setShowAdd(true)} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "10px 18px", borderRadius: 10, background: "#C4531A", color: "#fff", fontSize: 13, fontWeight: 600, border: "none", cursor: "pointer" }}>
          + Ajouter
        </button>
      </div>

      {showAdd && (
        <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #E8D5C0", padding: 20, marginBottom: 16 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: "#3D2E1F", marginBottom: 12 }}>Nouvelle prestation</h3>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 10 }} className="max-md:!grid-cols-1">
            <div>
              <label style={labelStyle}>Désignation *</label>
              <input value={addForm.designation} onChange={e => setAddForm(f => ({ ...f, designation: e.target.value }))} placeholder="Pose chauffe-eau 200L" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Prix HT *</label>
              <input type="number" step="0.01" value={addForm.prixUnitaire || ""} onChange={e => setAddForm(f => ({ ...f, prixUnitaire: parseFloat(e.target.value) || 0 }))} placeholder="650" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Unité *</label>
              <select value={addForm.unite} onChange={e => setAddForm(f => ({ ...f, unite: e.target.value }))} style={inputStyle}>
                {UNITES.map(u => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Catégorie</label>
              <input value={addForm.categorie} onChange={e => setAddForm(f => ({ ...f, categorie: e.target.value }))} placeholder="Installation" style={inputStyle} />
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
                    <div style={{ flex: 1, display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 8, alignItems: "center" }} className="max-md:!grid-cols-1">
                      <input value={editForm.designation} onChange={e => setEditForm(f => ({ ...f, designation: e.target.value }))} style={inputStyle} />
                      <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                        <input type="number" step="0.01" value={editForm.prixUnitaire || ""} onChange={e => setEditForm(f => ({ ...f, prixUnitaire: parseFloat(e.target.value) || 0 }))} style={{ ...inputStyle, width: 80 }} />
                        <span style={{ fontSize: 13, color: "#9C958D" }}>€</span>
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
                    <>
                      <span style={{ flex: 1, fontSize: 14, color: "#3D2E1F" }}>{p.designation}</span>
                      <span style={{ fontSize: 14, fontWeight: 700, color: "#C4531A", fontFamily: "monospace", minWidth: 70, textAlign: "right" }}>{p.prixUnitaire}€</span>
                      <span style={{ fontSize: 12, color: "#9C958D", minWidth: 40 }}>/{p.unite}</span>
                      <button onClick={() => handleEdit(p)} style={{ fontSize: 14, background: "none", border: "none", cursor: "pointer", padding: "4px 8px", color: "#6B6560" }} title="Modifier">✏️</button>
                      <button onClick={() => handleDelete(p.id)} style={{ fontSize: 14, background: "none", border: "none", cursor: "pointer", padding: "4px 8px", color: "#DC2626" }} title="Supprimer">🗑️</button>
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
