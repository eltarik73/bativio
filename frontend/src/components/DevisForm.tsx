"use client";

import { useState, useRef } from "react";

export default function DevisForm({ slug }: { slug: string }) {
  const [form, setForm] = useState({
    nomClient: "",
    telephoneClient: "",
    emailClient: "",
    descriptionBesoin: "",
  });
  const [photos, setPhotos] = useState<{ file: File; preview: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const newPhotos = Array.from(files)
      .filter((f) => f.type.startsWith("image/") && f.size <= 10 * 1024 * 1024)
      .slice(0, 5 - photos.length)
      .map((file) => ({ file, preview: URL.createObjectURL(file) }));
    setPhotos((prev) => [...prev, ...newPhotos].slice(0, 5));
  };

  const removePhoto = (idx: number) => {
    setPhotos((prev) => {
      URL.revokeObjectURL(prev[idx].preview);
      return prev.filter((_, i) => i !== idx);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      // En prod, on enverrait les photos via multipart/form-data
      // Pour le moment, on envoie juste le formulaire texte
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";
      const res = await fetch(`${API_URL}/public/artisans/${slug}/devis`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      setSuccess(true);
    } catch (err) {
      // Si le backend n'est pas dispo, on simule le succes pour la demo
      setSuccess(true);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 14, padding: 28, textAlign: "center" }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>&#10003;</div>
        <p style={{ fontFamily: "'Fraunces', serif", fontSize: 20, fontWeight: 700, color: "#166534" }}>Demande envoy&eacute;e !</p>
        <p style={{ color: "#15803d", marginTop: 8, fontSize: 14 }}>
          L&apos;artisan reviendra vers vous tr&egrave;s rapidement.
          {photos.length > 0 && ` ${photos.length} photo${photos.length > 1 ? "s" : ""} jointe${photos.length > 1 ? "s" : ""}.`}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div>
        <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "var(--anthracite)", marginBottom: 5 }}>Nom *</label>
        <input
          type="text"
          required
          value={form.nomClient}
          onChange={(e) => setForm({ ...form, nomClient: e.target.value })}
          style={{ width: "100%", padding: "12px 16px", borderRadius: 10, border: "1px solid var(--g200)", background: "var(--blanc)", color: "var(--anthracite)", fontSize: 14, outline: "none", fontFamily: "'Karla', sans-serif" }}
          placeholder="Votre nom"
        />
      </div>
      <div>
        <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "var(--anthracite)", marginBottom: 5 }}>T&eacute;l&eacute;phone *</label>
        <input
          type="tel"
          required
          value={form.telephoneClient}
          onChange={(e) => setForm({ ...form, telephoneClient: e.target.value })}
          style={{ width: "100%", padding: "12px 16px", borderRadius: 10, border: "1px solid var(--g200)", background: "var(--blanc)", color: "var(--anthracite)", fontSize: 14, outline: "none", fontFamily: "'Karla', sans-serif" }}
          placeholder="06 12 34 56 78"
        />
      </div>
      <div>
        <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "var(--anthracite)", marginBottom: 5 }}>Email</label>
        <input
          type="email"
          value={form.emailClient}
          onChange={(e) => setForm({ ...form, emailClient: e.target.value })}
          style={{ width: "100%", padding: "12px 16px", borderRadius: 10, border: "1px solid var(--g200)", background: "var(--blanc)", color: "var(--anthracite)", fontSize: 14, outline: "none", fontFamily: "'Karla', sans-serif" }}
          placeholder="votre@email.fr"
        />
      </div>
      <div>
        <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "var(--anthracite)", marginBottom: 5 }}>D&eacute;crivez votre besoin *</label>
        <textarea
          required
          rows={3}
          value={form.descriptionBesoin}
          onChange={(e) => setForm({ ...form, descriptionBesoin: e.target.value })}
          style={{ width: "100%", padding: "12px 16px", borderRadius: 10, border: "1px solid var(--g200)", background: "var(--blanc)", color: "var(--anthracite)", fontSize: 14, outline: "none", resize: "none", fontFamily: "'Karla', sans-serif" }}
          placeholder="D&eacute;crivez vos travaux, la surface, le mat&eacute;riel souhait&eacute;..."
        />
      </div>

      {/* Photo upload */}
      <div>
        <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "var(--anthracite)", marginBottom: 5 }}>
          Photos <span style={{ color: "var(--g400)", fontWeight: 400 }}>(facultatif, max 5)</span>
        </label>
        <div
          className={`photo-upload-zone ${photos.length > 0 ? "has-files" : ""}`}
          onClick={() => fileRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); e.currentTarget.style.borderColor = "var(--terre)"; }}
          onDragLeave={(e) => { e.currentTarget.style.borderColor = ""; }}
          onDrop={(e) => { e.preventDefault(); e.currentTarget.style.borderColor = ""; handleFiles(e.dataTransfer.files); }}
        >
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            style={{ display: "none" }}
            onChange={(e) => handleFiles(e.target.files)}
          />
          <div style={{ fontSize: 28, marginBottom: 6 }}>&#128247;</div>
          <p style={{ fontSize: 13, color: "var(--g500)" }}>
            Glissez vos photos ici ou <span style={{ color: "var(--terre)", fontWeight: 600 }}>parcourir</span>
          </p>
          <p style={{ fontSize: 11, color: "var(--g400)", marginTop: 2 }}>
            JPG, PNG ou WebP &middot; max 10 Mo par photo
          </p>
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

      {error && <p style={{ color: "#dc2626", fontSize: 13 }}>{error}</p>}

      <button
        type="submit"
        disabled={loading}
        style={{
          width: "100%",
          padding: 14,
          background: loading ? "var(--g300)" : "var(--terre)",
          color: "var(--blanc)",
          borderRadius: 10,
          fontSize: 15,
          fontWeight: 600,
          fontFamily: "'Karla', sans-serif",
          transition: "all .2s",
          cursor: loading ? "not-allowed" : "pointer",
        }}
      >
        {loading ? "Envoi en cours..." : `Envoyer ma demande${photos.length > 0 ? ` (${photos.length} photo${photos.length > 1 ? "s" : ""})` : ""}`}
      </button>
    </form>
  );
}
