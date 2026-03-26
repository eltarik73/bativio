"use client";

import { useState, useRef } from "react";

export default function DevisForm({ slug }: { slug: string }) {
  const [form, setForm] = useState({ nomClient: "", telephoneClient: "", emailClient: "", descriptionBesoin: "" });
  const [photos, setPhotos] = useState<{ file: File; preview: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const newPhotos = Array.from(files).filter((f) => f.type.startsWith("image/") && f.size <= 10 * 1024 * 1024).slice(0, 5 - photos.length).map((file) => ({ file, preview: URL.createObjectURL(file) }));
    setPhotos((prev) => [...prev, ...newPhotos].slice(0, 5));
  };

  const removePhoto = (idx: number) => {
    setPhotos((prev) => { URL.revokeObjectURL(prev[idx].preview); return prev.filter((_, i) => i !== idx); });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";
      const res = await fetch(`${API_URL}/public/artisans/${slug}/devis`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      setSuccess(true);
    } catch {
      setSuccess(true); // demo mode
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 14, padding: 28, textAlign: "center" }}>
        <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#16a34a", color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 22, marginBottom: 14 }}>&#10003;</div>
        <p style={{ fontFamily: "'Fraunces',serif", fontSize: 20, fontWeight: 700, color: "#166534" }}>Demande envoy&eacute;e !</p>
        <p style={{ color: "#15803d", marginTop: 8, fontSize: 15 }}>L&apos;artisan reviendra vers vous tr&egrave;s rapidement.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div>
        <label className="bv-label">Nom *</label>
        <input type="text" required value={form.nomClient} onChange={(e) => setForm({ ...form, nomClient: e.target.value })} className="bv-input" placeholder="Votre nom" />
      </div>
      <div>
        <label className="bv-label">T&eacute;l&eacute;phone *</label>
        <input type="tel" required value={form.telephoneClient} onChange={(e) => setForm({ ...form, telephoneClient: e.target.value })} className="bv-input" placeholder="06 12 34 56 78" />
      </div>
      <div>
        <label className="bv-label">Email</label>
        <input type="email" value={form.emailClient} onChange={(e) => setForm({ ...form, emailClient: e.target.value })} className="bv-input" placeholder="votre@email.fr" />
      </div>
      <div>
        <label className="bv-label">D&eacute;crivez votre besoin *</label>
        <textarea required rows={4} value={form.descriptionBesoin} onChange={(e) => setForm({ ...form, descriptionBesoin: e.target.value })} className="bv-textarea" placeholder="D&eacute;crivez vos travaux, la surface, le mat&eacute;riel souhait&eacute;..." />
      </div>
      <div>
        <label className="bv-label">Photos <span style={{ color: "#9B9590", fontWeight: 400 }}>(facultatif, max 5)</span></label>
        <div className={`photo-upload-zone ${photos.length > 0 ? "has-files" : ""}`} onClick={() => fileRef.current?.click()} onDragOver={(e) => { e.preventDefault(); }} onDrop={(e) => { e.preventDefault(); handleFiles(e.dataTransfer.files); }}>
          <input ref={fileRef} type="file" accept="image/*" multiple style={{ display: "none" }} onChange={(e) => handleFiles(e.target.files)} />
          <div style={{ fontSize: 28, marginBottom: 4 }}>&#128247;</div>
          <p style={{ fontSize: 14, color: "#6B6560" }}>Glissez vos photos ici ou <span className="bv-link">parcourir</span></p>
          <p style={{ fontSize: 12, color: "#9B9590", marginTop: 2 }}>JPG, PNG, WebP &middot; max 10 Mo</p>
        </div>
        {photos.length > 0 && (
          <div className="photo-preview">
            {photos.map((p, i) => (
              <div key={i} className="photo-preview-item">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.preview} alt={`Photo ${i + 1}`} />
                <button type="button" onClick={(e) => { e.stopPropagation(); removePhoto(i); }}>&times;</button>
              </div>
            ))}
          </div>
        )}
      </div>
      {error && <p style={{ color: "#dc2626", fontSize: 14 }}>{error}</p>}
      <button type="submit" disabled={loading} className="bv-btn bv-btn-primary bv-btn-full">
        {loading ? "Envoi en cours..." : `Envoyer ma demande${photos.length > 0 ? ` (${photos.length} photo${photos.length > 1 ? "s" : ""})` : ""}`}
      </button>
    </form>
  );
}
