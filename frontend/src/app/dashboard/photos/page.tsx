"use client";

import { useState, useRef } from "react";

export default function PhotosPage() {
  const [tab, setTab] = useState<"simple" | "av">("simple");
  const [photos, setPhotos] = useState<{ file: File; preview: string }[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const valid = Array.from(files).filter((f) => f.type.startsWith("image/") && f.size <= 10 * 1024 * 1024).slice(0, 3 - photos.length);
    setPhotos((p) => [...p, ...valid.map((file) => ({ file, preview: URL.createObjectURL(file) }))].slice(0, 3));
  };

  const remove = (i: number) => { setPhotos((p) => { URL.revokeObjectURL(p[i].preview); return p.filter((_, j) => j !== i); }); };

  const pill = (active: boolean): React.CSSProperties => ({
    padding: "8px 20px", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all .15s", border: "none",
    background: active ? "#C4531A" : "transparent",
    color: active ? "#fff" : "#6B6560",
    ...(active ? {} : { border: "1.5px solid #E0DDD8" }),
  });

  return (
    <div style={{ maxWidth: 800, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h1 style={{ fontFamily: "'Fraunces',serif", fontSize: 24, fontWeight: 700, color: "#1C1C1E" }}>Mes photos</h1>
        <span style={{ fontSize: 13, color: "#9B9590" }}>{photos.length} / 3 photos (Gratuit)</span>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
        <button style={pill(tab === "simple")} onClick={() => setTab("simple")}>Photo simple</button>
        <button style={pill(tab === "av")} onClick={() => setTab("av")}>Avant / Apr&egrave;s</button>
      </div>

      {/* Upload zone */}
      <div
        style={{ background: "#FAF8F5", border: "2px dashed #E0DDD8", borderRadius: 16, padding: 48, textAlign: "center", cursor: "pointer", transition: "all .2s" }}
        onClick={() => fileRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); e.currentTarget.style.borderColor = "#C4531A"; e.currentTarget.style.background = "rgba(196,83,26,.02)"; }}
        onDragLeave={(e) => { e.currentTarget.style.borderColor = "#E0DDD8"; e.currentTarget.style.background = "#FAF8F5"; }}
        onDrop={(e) => { e.preventDefault(); e.currentTarget.style.borderColor = "#E0DDD8"; e.currentTarget.style.background = "#FAF8F5"; handleFiles(e.dataTransfer.files); }}
      >
        <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" multiple hidden onChange={(e) => handleFiles(e.target.files)} />
        <svg width="48" height="48" fill="none" stroke="#C5C0B9" strokeWidth="1.5" viewBox="0 0 24 24" style={{ margin: "0 auto 16px" }}><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="M21 15l-5-5L5 21" /></svg>
        <p style={{ fontSize: 15, fontWeight: 600, color: "#1C1C1E", marginBottom: 4 }}>Glissez vos photos ici</p>
        <p style={{ fontSize: 13, color: "#C5C0B9", marginBottom: 12 }}>ou</p>
        <span style={{ display: "inline-flex", alignItems: "center", height: 40, padding: "0 20px", borderRadius: 8, border: "1.5px solid #E0DDD8", fontSize: 13, fontWeight: 600, color: "#C4531A" }}>Choisir des photos</span>
        <p style={{ fontSize: 12, color: "#C5C0B9", marginTop: 12 }}>JPG, PNG ou WebP &middot; max 10 Mo</p>
      </div>

      {/* Gallery */}
      {photos.length > 0 ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 12, marginTop: 24 }}>
          {photos.map((p, i) => (
            <div key={i} style={{ position: "relative", aspectRatio: "1", borderRadius: 12, overflow: "hidden", border: "1px solid #EDEBE7" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.preview} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <button onClick={(e) => { e.stopPropagation(); remove(i); }} style={{ position: "absolute", top: 8, right: 8, width: 28, height: 28, borderRadius: "50%", background: "rgba(0,0,0,.5)", color: "#fff", border: "none", cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>&times;</button>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ textAlign: "center", padding: "48px 20px" }}>
          <svg width="64" height="64" fill="none" stroke="#E0DDD8" strokeWidth="1" viewBox="0 0 24 24" style={{ margin: "0 auto 16px" }}><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="M21 15l-5-5L5 21" /></svg>
          <p style={{ fontSize: 15, color: "#9B9590" }}>Vous n&apos;avez pas encore de photos</p>
          <p style={{ fontSize: 13, color: "#C5C0B9", marginTop: 4 }}>Ajoutez des photos de vos r&eacute;alisations pour attirer plus de clients</p>
        </div>
      )}
    </div>
  );
}
