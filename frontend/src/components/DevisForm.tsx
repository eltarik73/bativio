"use client";

import { useState, useRef } from "react";
import Link from "next/link";

export default function DevisForm({ slug, artisanName }: { slug: string; artisanName?: string }) {
  const [form, setForm] = useState({ nomClient: "", telephoneClient: "", emailClient: "", descriptionBesoin: "" });
  const [photos, setPhotos] = useState<{ file: File; preview: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [ctaDismissed, setCtaDismissed] = useState(false);
  const [ctaPassword, setCtaPassword] = useState("");
  const [ctaToast, setCtaToast] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const n = Array.from(files).filter((f) => f.type.startsWith("image/") && f.size <= 10 * 1024 * 1024).slice(0, 5 - photos.length).map((file) => ({ file, preview: URL.createObjectURL(file) }));
    setPhotos((p) => [...p, ...n].slice(0, 5));
  };
  const removePhoto = (i: number) => { setPhotos((p) => { URL.revokeObjectURL(p[i].preview); return p.filter((_, j) => j !== i); }); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      const { submitDevis } = await import("@/lib/api");
      await submitDevis(slug, form);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de l'envoi. R\u00e9essayez.");
    } finally { setLoading(false); }
  };

  if (success) {
    return (
      <div className="confirmation" style={{ padding: "40px 20px" }}>
        <div className="conf-icon-lg"><svg viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" /></svg></div>
        <div className="conf-title">Votre demande a &eacute;t&eacute; envoy&eacute;e !</div>
        <div className="conf-sub">{artisanName ? `${artisanName} vous r\u00e9pondra sous 24h.` : "L\u0027artisan vous r\u00e9pondra sous 24h."}</div>
        <div className="conf-recap">
          {form.descriptionBesoin && (
            <div className="conf-recap-row"><span className="label">Votre besoin</span><span className="val" style={{ maxWidth: "60%", textAlign: "right" }}>{form.descriptionBesoin.length > 80 ? form.descriptionBesoin.slice(0, 80) + "..." : form.descriptionBesoin}</span></div>
          )}
        </div>
        <p className="conf-email-notice">&#128233; Un email de confirmation vous a &eacute;t&eacute; envoy&eacute;.</p>

        {!ctaDismissed && form.emailClient && (
          <div className="conf-cta-block">
            <div className="conf-cta-sep" />
            <p className="conf-cta-label">Cr&eacute;ez un compte pour suivre vos demandes</p>
            <div className="conf-cta-password-wrap">
              <input
                type="password"
                className="conf-cta-input"
                placeholder="Choisissez un mot de passe"
                value={ctaPassword}
                onChange={(e) => setCtaPassword(e.target.value)}
              />
              <button
                type="button"
                className="conf-cta-btn"
                onClick={() => {
                  setCtaToast(true);
                  setTimeout(() => setCtaToast(false), 3000);
                }}
              >
                Cr&eacute;er mon compte
              </button>
            </div>
            <button type="button" className="conf-cta-dismiss" onClick={() => setCtaDismissed(true)}>Non merci</button>
          </div>
        )}

        {ctaToast && (
          <div className="conf-toast">Fonctionnalit&eacute; bient&ocirc;t disponible</div>
        )}

        <Link href="/" className="conf-back-link">&larr; Retour &agrave; l&apos;accueil</Link>
      </div>
    );
  }

  const ic = (d: string) => <svg width="20" height="20" fill="none" stroke="#C5C0B9" strokeWidth="1.5" viewBox="0 0 24 24" style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }}><path d={d} /></svg>;

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
        <svg width="24" height="24" fill="none" stroke="#C4531A" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><path d="M14 2v6h6M16 13H8M16 17H8" /></svg>
        <span style={{ fontFamily: "'Fraunces',serif", fontSize: 20, fontWeight: 700, color: "#1C1C1E" }}>Demander un devis gratuit</span>
      </div>
      <p style={{ fontSize: 13, color: "#9B9590", marginBottom: 12 }}>R&eacute;ponse sous 24h &middot; Gratuit &middot; Sans engagement</p>
      <div style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "rgba(34,197,94,.08)", color: "#16a34a", fontSize: 12, fontWeight: 600, padding: "4px 12px", borderRadius: 6, marginBottom: 20 }}>
        &#9889; Temps de r&eacute;ponse moyen : 2h
      </div>
      <div style={{ height: 1, background: "#F7F5F2", margin: "0 0 24px" }} />

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div className="field">
          <label className="bv-label">Nom <span style={{ color: "#dc2626" }}>*</span></label>
          <div style={{ position: "relative" }}>
            {ic("M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 3a4 4 0 100 8 4 4 0 000-8z")}
            <input type="text" required value={form.nomClient} onChange={(e) => setForm({ ...form, nomClient: e.target.value })} className="bv-input" style={{ height: 52, paddingLeft: 44 }} placeholder="Votre nom complet" />
          </div>
        </div>
        <div className="field">
          <label className="bv-label">T&eacute;l&eacute;phone <span style={{ color: "#dc2626" }}>*</span></label>
          <div style={{ position: "relative" }}>
            {ic("M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.12 4.11 2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z")}
            <input type="tel" required value={form.telephoneClient} onChange={(e) => setForm({ ...form, telephoneClient: e.target.value })} className="bv-input" style={{ height: 52, paddingLeft: 44 }} placeholder="06 12 34 56 78" />
          </div>
        </div>
        <div className="field">
          <label className="bv-label">Email</label>
          <div style={{ position: "relative" }}>
            {ic("M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zM22 6l-10 7L2 6")}
            <input type="email" value={form.emailClient} onChange={(e) => setForm({ ...form, emailClient: e.target.value })} className="bv-input" style={{ height: 52, paddingLeft: 44 }} placeholder="votre@email.fr" />
          </div>
        </div>
        <div className="field">
          <label className="bv-label">D&eacute;crivez votre besoin <span style={{ color: "#dc2626" }}>*</span></label>
          <textarea required rows={4} value={form.descriptionBesoin} onChange={(e) => setForm({ ...form, descriptionBesoin: e.target.value })} className="bv-textarea" style={{ minHeight: 120 }} placeholder="D&eacute;crivez vos travaux : surface, mat&eacute;riaux, d&eacute;lai souhait&eacute;..." />
        </div>
        <div className="field">
          <label className="bv-label">Photos <span style={{ color: "#9B9590", fontWeight: 400 }}>(facultatif, max 5)</span></label>
          <div
            style={{ border: "2px dashed #E0DDD8", borderRadius: 14, padding: 24, textAlign: "center", cursor: "pointer", transition: "all .2s", background: "#FAF8F5" }}
            onClick={() => fileRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => { e.preventDefault(); handleFiles(e.dataTransfer.files); }}
          >
            <input ref={fileRef} type="file" accept="image/*" multiple hidden onChange={(e) => handleFiles(e.target.files)} />
            <p style={{ fontSize: 14, color: "#9B9590" }}>Ajoutez des photos <span style={{ color: "#C4531A", fontWeight: 600, cursor: "pointer" }}>parcourir</span></p>
            <p style={{ fontSize: 11, color: "#C5C0B9", marginTop: 4 }}>JPG, PNG, WebP &middot; max 10 Mo</p>
          </div>
          {photos.length > 0 && (
            <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
              {photos.map((p, i) => (
                <div key={i} style={{ position: "relative", width: 64, height: 64, borderRadius: 10, overflow: "hidden", border: "1px solid #EDEBE7" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.preview} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  <button type="button" onClick={(e) => { e.stopPropagation(); removePhoto(i); }} style={{ position: "absolute", top: 2, right: 2, width: 20, height: 20, borderRadius: "50%", background: "rgba(0,0,0,.6)", color: "#fff", border: "none", cursor: "pointer", fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>&times;</button>
                </div>
              ))}
              <span style={{ fontSize: 11, color: "#C5C0B9", alignSelf: "center" }}>{photos.length}/5</span>
            </div>
          )}
        </div>
        {error && <p style={{ color: "#dc2626", fontSize: 14 }}>{error}</p>}
        <button type="submit" disabled={loading} className="bv-btn bv-btn-primary" style={{ width: "100%", height: 52, fontSize: 16, borderRadius: 12, gap: 8 }}>
          {loading ? "Envoi en cours..." : <>Envoyer ma demande <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7" /></svg></>}
        </button>
        <p style={{ textAlign: "center", fontSize: 11, color: "#C5C0B9", lineHeight: 1.5 }}>
          &#128274; Vos donn&eacute;es sont prot&eacute;g&eacute;es et ne sont partag&eacute;es qu&apos;avec cet artisan
        </p>
      </form>
    </div>
  );
}
