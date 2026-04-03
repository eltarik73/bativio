"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import VilleAutocomplete from "@/components/VilleAutocomplete/VilleAutocomplete";

interface BadgeData {
  id: string;
  nom: string;
}

interface ServiceData {
  id: string;
  titre: string;
  description?: string;
  prixIndicatif?: string;
  ordre: number;
}

const C: React.CSSProperties = { background: "#fff", borderRadius: 16, border: "1px solid var(--sable,#E8D5C0)", padding: 28, marginBottom: 20, boxShadow: "0 4px 24px rgba(28,28,30,.04)" };

export default function ProfilPage() {
  const { user, fetchWithAuth, updateUser } = useAuth();

  const [form, setForm] = useState({
    nomAffichage: "", description: "",
    telephone: "", adresse: "", ville: "", codePostal: "", experienceAnnees: "",
  });
  const [badges, setBadges] = useState<BadgeData[]>([]);
  const [services, setServices] = useState<ServiceData[]>([]);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const u = (f: string, v: string) => setForm((p) => ({ ...p, [f]: v }));

  // Load full artisan profile (includes badges, services)
  const loadProfile = useCallback(async () => {
    try {
      const data = await fetchWithAuth("/artisans/me") as Record<string, unknown>;
      if (data) {
        setForm({
          nomAffichage: (data.nomAffichage as string) || "",
          description: (data.description as string) || "",
          telephone: (data.telephone as string) || "",
          adresse: (data.adresse as string) || "",
          ville: (data.ville as string) || "",
          codePostal: (data.codePostal as string) || "",
          experienceAnnees: data.experienceAnnees != null ? String(data.experienceAnnees) : "",
        });
        if (Array.isArray(data.badges)) {
          setBadges(data.badges as BadgeData[]);
        }
        if (Array.isArray(data.services)) {
          setServices(data.services as ServiceData[]);
        }
      }
    } catch {
      // If API fails, fall back to user context data
      if (user) {
        setForm({
          nomAffichage: user.nomAffichage || "",
          description: (user.description as string) || "",
          telephone: (user.telephone as string) || "",
          adresse: (user.ville as string) || "",
          ville: (user.ville as string) || "",
          codePostal: "",
          experienceAnnees: "",
        });
      }
    }
  }, [fetchWithAuth, user]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  // Save profile
  const handleSave = async () => {
    setSaving(true);
    try {
      const payload: Record<string, unknown> = {
        nomAffichage: form.nomAffichage,
        description: form.description,
        telephone: form.telephone,
        adresse: form.adresse,
        ville: form.ville,
        codePostal: form.codePostal,
      };
      if (form.experienceAnnees !== "") {
        payload.experienceAnnees = parseInt(form.experienceAnnees, 10);
      }

      const updated = await fetchWithAuth("/artisans/me", {
        method: "PUT",
        body: JSON.stringify(payload),
      }) as Record<string, unknown>;

      // Update auth context with fresh data
      if (updated && user) {
        updateUser({
          ...user,
          nomAffichage: (updated.nomAffichage as string) || user.nomAffichage,
          telephone: (updated.telephone as string) || user.telephone,
          description: (updated.description as string) || user.description,
          profilCompletion: (updated.profilCompletion as number) ?? user.profilCompletion,
        });
      }

      setToast("Modifications enregistrées avec succès");
      setTimeout(() => setToast(null), 3000);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erreur lors de la sauvegarde";
      setToast(msg);
      setTimeout(() => setToast(null), 4000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: "0 auto" }}>
      <h1 style={{ fontFamily: "'Fraunces',serif", fontSize: 24, fontWeight: 700, color: "var(--bois,#3D2E1F)", marginBottom: 24 }}>Mon profil</h1>

      {/* Informations */}
      <div style={C}>
        <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 18, fontWeight: 700, color: "var(--bois,#3D2E1F)", marginBottom: 20 }}>Informations</h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          <div className="field"><label className="bv-label">Nom d&apos;affichage</label><input className="bv-input" value={form.nomAffichage} onChange={(e) => u("nomAffichage", e.target.value)} /></div>
          <div className="field"><label className="bv-label">T&eacute;l&eacute;phone</label><input className="bv-input" value={form.telephone} onChange={(e) => u("telephone", e.target.value)} /></div>
          <div className="field"><label className="bv-label">Ville</label><VilleAutocomplete onSelect={(commune) => { setForm(prev => ({ ...prev, ville: commune.nom, codePostal: commune.codesPostaux[0] || prev.codePostal })); }} defaultValue={form.ville} placeholder="Ville ou code postal..." /></div>
          <div className="field"><label className="bv-label">Exp&eacute;rience (ann&eacute;es)</label><input className="bv-input" type="number" value={form.experienceAnnees} onChange={(e) => u("experienceAnnees", e.target.value)} /></div>
        </div>
      </div>

      {/* Description */}
      <div style={C}>
        <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 18, fontWeight: 700, color: "var(--bois,#3D2E1F)", marginBottom: 20 }}>Description</h2>
        <textarea className="bv-textarea" value={form.description} onChange={(e) => u("description", e.target.value)} maxLength={500} />
        <p style={{ textAlign: "right", fontSize: 12, color: "#C5C0B9", marginTop: 6 }}>{form.description.length} / 500</p>
      </div>

      {/* Badges */}
      <div style={C}>
        <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 18, fontWeight: 700, color: "var(--bois,#3D2E1F)", marginBottom: 16 }}>Badges et certifications</h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
          {badges.length > 0 ? badges.map((b) => (
            <span key={b.id} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 14px", borderRadius: 8, background: "rgba(196,83,26,.06)", color: "#C4531A", fontSize: 13, fontWeight: 500 }}>
              {b.nom}
              <button style={{ background: "none", border: "none", cursor: "pointer", color: "#C5C0B9", fontSize: 16, lineHeight: 1, padding: 0 }}>&times;</button>
            </span>
          )) : (
            <p style={{ fontSize: 13, color: "#C5C0B9" }}>Aucun badge ajout&eacute;</p>
          )}
        </div>
        <button style={{ height: 36, padding: "0 16px", borderRadius: 8, border: "1.5px solid #E0DDD8", background: "transparent", fontSize: 13, fontWeight: 600, color: "#C4531A", cursor: "pointer" }}>+ Ajouter un badge</button>
      </div>

      {/* Services */}
      <div style={C}>
        <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 18, fontWeight: 700, color: "var(--bois,#3D2E1F)", marginBottom: 16 }}>Services</h2>
        {services.length > 0 ? services.map((s) => (
          <div key={s.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid #F7F5F2" }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: "var(--bois,#3D2E1F)" }}>{s.titre}</span>
            <button style={{ background: "none", border: "none", fontSize: 12, color: "#C4531A", cursor: "pointer", fontWeight: 500 }}>Supprimer</button>
          </div>
        )) : (
          <p style={{ fontSize: 13, color: "#C5C0B9" }}>Aucun service ajout&eacute;</p>
        )}
        <button style={{ marginTop: 16, height: 36, padding: "0 16px", borderRadius: 8, border: "1.5px solid #E0DDD8", background: "transparent", fontSize: 13, fontWeight: 600, color: "#C4531A", cursor: "pointer" }}>+ Ajouter un service</button>
      </div>

      {/* Save */}
      <button
        className="bv-btn bv-btn-primary"
        style={{ width: "100%", marginTop: 16, height: 48, borderRadius: 10, fontWeight: 600, opacity: saving ? 0.6 : 1 }}
        onClick={handleSave}
        disabled={saving}
      >
        {saving ? "Enregistrement..." : "Enregistrer les modifications"}
      </button>

      {/* Toast */}
      {toast && (
        <div className="conf-toast">{toast}</div>
      )}
    </div>
  );
}
