"use client";

import { useState } from "react";
import Link from "next/link";
import { PALETTES, TEMPLATES, PHOTO_LAYOUTS } from "@/lib/vitrine-config";

const C: React.CSSProperties = { background: "#fff", borderRadius: 14, border: "1px solid #EDEBE7", padding: 20, marginBottom: 16 };

export default function VitrinePage() {
  const [template, setTemplate] = useState("classique");
  const [palette, setPalette] = useState("terre");
  const [photoLayout, setPhotoLayout] = useState("grid");
  const [saved, setSaved] = useState(false);

  const currentPalette = PALETTES.find((p) => p.id === palette) || PALETTES[0];

  const handlePublish = () => {
    console.log("Vitrine publi\u00e9e:", { template, palette, photoLayout, primary: currentPalette.primary, accent: currentPalette.accent });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div style={{ display: "flex", gap: 24, maxWidth: 1200, margin: "0 auto" }}>
      {/* Sidebar config */}
      <div style={{ width: 300, flexShrink: 0 }}>
        <h1 style={{ fontFamily: "'Fraunces',serif", fontSize: 22, fontWeight: 700, color: "#1C1C1E", marginBottom: 24 }}>Ma vitrine</h1>

        {/* Templates */}
        <div style={C}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: "#1C1C1E", marginBottom: 12 }}>Template</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {TEMPLATES.map((t) => (
              <button key={t.id} onClick={() => setTemplate(t.id)} style={{
                padding: 12, borderRadius: 10, border: template === t.id ? `2px solid ${currentPalette.primary}` : "1.5px solid #E0DDD8",
                background: template === t.id ? `${currentPalette.primary}08` : "#fff", cursor: "pointer", textAlign: "center", transition: "all .15s",
              }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: template === t.id ? currentPalette.primary : "#1C1C1E" }}>{t.nom}</div>
                <div style={{ fontSize: 10, color: "#9B9590", marginTop: 2 }}>{t.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Couleurs */}
        <div style={C}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: "#1C1C1E", marginBottom: 12 }}>Palette de couleurs</h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {PALETTES.map((p) => (
              <button key={p.id} onClick={() => setPalette(p.id)} style={{
                width: 40, height: 40, borderRadius: "50%", border: palette === p.id ? "3px solid #1C1C1E" : "2px solid #E0DDD8",
                background: `linear-gradient(135deg, ${p.primary} 50%, ${p.accent} 50%)`, cursor: "pointer", transition: "all .15s", padding: 0,
              }} title={p.nom} />
            ))}
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
            <div style={{ flex: 1, height: 32, borderRadius: 6, background: currentPalette.primary }} />
            <div style={{ flex: 1, height: 32, borderRadius: 6, background: currentPalette.accent }} />
          </div>
          <p style={{ fontSize: 11, color: "#9B9590", marginTop: 6 }}>{currentPalette.nom} &mdash; Principale + Accent</p>
        </div>

        {/* Photo layout */}
        <div style={C}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: "#1C1C1E", marginBottom: 12 }}>Disposition des photos</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {PHOTO_LAYOUTS.map((l) => (
              <button key={l.id} onClick={() => setPhotoLayout(l.id)} style={{
                padding: "10px 12px", borderRadius: 8, border: photoLayout === l.id ? `2px solid ${currentPalette.primary}` : "1.5px solid #E0DDD8",
                background: photoLayout === l.id ? `${currentPalette.primary}08` : "#fff", cursor: "pointer", textAlign: "center", transition: "all .15s",
              }}>
                <div style={{ fontSize: 20 }}>{l.icon}</div>
                <div style={{ fontSize: 11, fontWeight: 600, color: photoLayout === l.id ? currentPalette.primary : "#6B6560", marginTop: 2 }}>{l.nom}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Contenu links */}
        <div style={C}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: "#1C1C1E", marginBottom: 12 }}>Contenu</h3>
          {[
            { label: "Mon profil", href: "/dashboard/profil" },
            { label: "Mes photos", href: "/dashboard/photos" },
          ].map((l) => (
            <Link key={l.href} href={l.href} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #F7F5F2", fontSize: 13, color: "#6B6560", textDecoration: "none" }}>
              {l.label} <span style={{ color: "#C5C0B9" }}>&rarr;</span>
            </Link>
          ))}
        </div>

        {/* Publish */}
        <button onClick={handlePublish} style={{ width: "100%", height: 48, borderRadius: 10, background: currentPalette.primary, color: "#fff", fontSize: 15, fontWeight: 600, border: "none", cursor: "pointer", transition: "all .2s" }}>
          {saved ? "\u2713 Vitrine publi\u00e9e !" : "Publier les modifications"}
        </button>
      </div>

      {/* Preview */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: "#9B9590" }}>Aper&ccedil;u de votre vitrine</span>
          <Link href="/chambery/martin-plomberie" target="_blank" style={{ fontSize: 13, color: currentPalette.primary, fontWeight: 600, textDecoration: "none" }}>Voir en ligne &rarr;</Link>
        </div>
        <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #EDEBE7", overflow: "hidden", boxShadow: "0 4px 24px rgba(28,28,30,.06)" }}>
          {/* Simulated browser bar */}
          <div style={{ padding: "8px 16px", background: "#F7F5F2", borderBottom: "1px solid #EDEBE7", display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#E0DDD8" }} />
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#E0DDD8" }} />
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#E0DDD8" }} />
            <span style={{ flex: 1, textAlign: "center", fontSize: 11, color: "#C5C0B9" }}>bativio.fr/chambery/martin-plomberie</span>
          </div>
          {/* Preview content */}
          <div style={{ padding: 20 }}>
            <div style={{ background: "#1C1C1E", borderRadius: 12, padding: "28px 24px", marginBottom: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <span style={{ background: currentPalette.accent, color: "#1C1C1E", padding: "4px 10px", borderRadius: 12, fontSize: 13, fontWeight: 700, fontFamily: "'Fraunces',serif" }}>4.8</span>
                <span style={{ fontSize: 11, color: "rgba(255,255,255,.4)" }}>47 avis</span>
              </div>
              <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 24, fontWeight: 700, color: "#fff" }}>Martin Plomberie</h2>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,.4)", marginTop: 4 }}>Plombier &agrave; Chamb&eacute;ry</p>
              <div style={{ display: "flex", gap: 6, marginTop: 12 }}>
                {["RGE", "Qualibat"].map((b) => <span key={b} style={{ background: "rgba(255,255,255,.12)", color: "#fff", padding: "4px 10px", borderRadius: 6, fontSize: 10 }}>{b}</span>)}
              </div>
              <div style={{ marginTop: 16, display: "flex", gap: 8 }}>
                <span style={{ background: currentPalette.primary, color: "#fff", padding: "8px 16px", borderRadius: 8, fontSize: 12, fontWeight: 600 }}>Devis gratuit</span>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8 }}>
              <div style={{ background: "#fff", border: "1px solid #EDEBE7", borderRadius: 8, padding: 12, textAlign: "center" }}>
                <div style={{ fontFamily: "'Fraunces',serif", fontSize: 20, fontWeight: 700, color: currentPalette.primary }}>15</div>
                <div style={{ fontSize: 10, color: "#9B9590" }}>ann&eacute;es</div>
              </div>
              <div style={{ background: "#fff", border: "1px solid #EDEBE7", borderRadius: 8, padding: 12, textAlign: "center" }}>
                <div style={{ fontFamily: "'Fraunces',serif", fontSize: 20, fontWeight: 700, color: currentPalette.primary }}>47</div>
                <div style={{ fontSize: 10, color: "#9B9590" }}>avis</div>
              </div>
              <div style={{ background: "#fff", border: "1px solid #EDEBE7", borderRadius: 8, padding: 12, textAlign: "center" }}>
                <div style={{ fontFamily: "'Fraunces',serif", fontSize: 20, fontWeight: 700, color: currentPalette.primary }}>25 km</div>
                <div style={{ fontSize: 10, color: "#9B9590" }}>rayon</div>
              </div>
            </div>
            <p style={{ fontSize: 11, color: "#6B6560", marginTop: 12, lineHeight: 1.5 }}>Plombier-chauffagiste depuis 15 ans. D&eacute;pannage urgent, r&eacute;novation salle de bain, installation chauffage.</p>
            <div style={{ marginTop: 12, textAlign: "center", fontSize: 11, color: "#C5C0B9" }}>
              Template : <strong>{TEMPLATES.find((t) => t.id === template)?.nom}</strong> &middot; Photos : <strong>{PHOTO_LAYOUTS.find((l) => l.id === photoLayout)?.nom}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
