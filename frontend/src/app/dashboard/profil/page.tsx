"use client";

import { useState } from "react";

const C: React.CSSProperties = { background: "#fff", borderRadius: 16, border: "1.5px solid #EDEBE7", padding: 28, marginBottom: 20, boxShadow: "0 4px 24px rgba(28,28,30,.04)" };

export default function ProfilPage() {
  const [form, setForm] = useState({
    nomAffichage: "Martin Plomberie", description: "Plombier à Chambéry depuis 15 ans, spécialisé en rénovation de salles de bains.",
    telephone: "04 79 12 34 56", adresse: "Chambéry", codePostal: "73000", experienceAnnees: "15",
  });
  const u = (f: string, v: string) => setForm((p) => ({ ...p, [f]: v }));

  return (
    <div style={{ maxWidth: 800, margin: "0 auto" }}>
      <h1 style={{ fontFamily: "'Fraunces',serif", fontSize: 24, fontWeight: 700, color: "#1C1C1E", marginBottom: 24 }}>Mon profil</h1>

      {/* Informations */}
      <div style={C}>
        <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 18, fontWeight: 700, color: "#1C1C1E", marginBottom: 20 }}>Informations</h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          <div className="field"><label className="bv-label">Nom d&apos;affichage</label><input className="bv-input" value={form.nomAffichage} onChange={(e) => u("nomAffichage", e.target.value)} /></div>
          <div className="field"><label className="bv-label">T&eacute;l&eacute;phone</label><input className="bv-input" value={form.telephone} onChange={(e) => u("telephone", e.target.value)} /></div>
          <div className="field"><label className="bv-label">Adresse</label><input className="bv-input" value={form.adresse} onChange={(e) => u("adresse", e.target.value)} /></div>
          <div className="field"><label className="bv-label">Exp&eacute;rience (ann&eacute;es)</label><input className="bv-input" type="number" value={form.experienceAnnees} onChange={(e) => u("experienceAnnees", e.target.value)} /></div>
        </div>
      </div>

      {/* Description */}
      <div style={C}>
        <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 18, fontWeight: 700, color: "#1C1C1E", marginBottom: 20 }}>Description</h2>
        <textarea className="bv-textarea" value={form.description} onChange={(e) => u("description", e.target.value)} maxLength={500} />
        <p style={{ textAlign: "right", fontSize: 12, color: "#C5C0B9", marginTop: 6 }}>{form.description.length} / 500</p>
      </div>

      {/* Badges */}
      <div style={C}>
        <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 18, fontWeight: 700, color: "#1C1C1E", marginBottom: 16 }}>Badges et certifications</h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
          {["RGE", "Qualibat", "Assurance décennale"].map((b) => (
            <span key={b} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 14px", borderRadius: 8, background: "rgba(196,83,26,.06)", color: "#C4531A", fontSize: 13, fontWeight: 500 }}>
              {b}
              <button style={{ background: "none", border: "none", cursor: "pointer", color: "#C5C0B9", fontSize: 16, lineHeight: 1, padding: 0 }}>&times;</button>
            </span>
          ))}
        </div>
        <button style={{ height: 36, padding: "0 16px", borderRadius: 8, border: "1.5px solid #E0DDD8", background: "transparent", fontSize: 13, fontWeight: 600, color: "#C4531A", cursor: "pointer" }}>+ Ajouter un badge</button>
      </div>

      {/* Services */}
      <div style={C}>
        <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 18, fontWeight: 700, color: "#1C1C1E", marginBottom: 16 }}>Services</h2>
        {["Dépannage plomberie", "Rénovation salle de bains", "Installation chauffage"].map((s) => (
          <div key={s} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid #F7F5F2" }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: "#1C1C1E" }}>{s}</span>
            <button style={{ background: "none", border: "none", fontSize: 12, color: "#C4531A", cursor: "pointer", fontWeight: 500 }}>Supprimer</button>
          </div>
        ))}
        <button style={{ marginTop: 16, height: 36, padding: "0 16px", borderRadius: 8, border: "1.5px solid #E0DDD8", background: "transparent", fontSize: 13, fontWeight: 600, color: "#C4531A", cursor: "pointer" }}>+ Ajouter un service</button>
      </div>

      {/* Save */}
      <button className="bv-btn bv-btn-primary" style={{ width: "100%", marginTop: 16, height: 48, borderRadius: 10, fontWeight: 600 }}>Enregistrer les modifications</button>
    </div>
  );
}
