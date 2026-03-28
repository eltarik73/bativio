"use client";

import { useState, useRef } from "react";
import Link from "next/link";

const SUB: Record<string, { label: string; opts: string[] }> = {
  plomberie: { label: "Quel type d'intervention ?", opts: ["Fuite / D\u00e9pannage", "R\u00e9novation salle de bain", "Installation chauffage", "Chauffe-eau", "Autre"] },
  electricite: { label: "Quel type de travaux ?", opts: ["Mise aux normes", "Nouveau tableau", "Prises / Interrupteurs", "Domotique", "Autre"] },
  peinture: { label: "Quel type de surface ?", opts: ["Peinture int\u00e9rieure", "Peinture ext\u00e9rieure", "Papier peint", "Autre"] },
  maconnerie: { label: "Quel type de travaux ?", opts: ["Construction mur", "Extension", "R\u00e9novation fa\u00e7ade", "Autre"] },
  carrelage: { label: "Quelle pi\u00e8ce ?", opts: ["Salle de bain", "Cuisine", "Sol int\u00e9rieur", "Terrasse", "Autre"] },
  toiture: { label: "Quel type d'intervention ?", opts: ["R\u00e9novation toiture", "R\u00e9paration fuite", "D\u00e9moussage", "Isolation", "Autre"] },
  chauffage: { label: "Quel type d'\u00e9quipement ?", opts: ["Pompe \u00e0 chaleur", "Chaudi\u00e8re gaz", "Radiateurs", "Plancher chauffant", "Autre"] },
  menuiserie: { label: "Quel type de travaux ?", opts: ["Pose de parquet", "Meuble sur mesure", "Pose cuisine", "Autre"] },
  autre: { label: "D\u00e9crivez votre besoin", opts: ["R\u00e9novation compl\u00e8te", "Am\u00e9nagement combles", "Multi-travaux", "Autre"] },
};

const METIERS = [
  { id: "plomberie", emoji: "\uD83D\uDD27", name: "Plomberie" },
  { id: "electricite", emoji: "\u26A1", name: "\u00c9lectricit\u00e9" },
  { id: "peinture", emoji: "\uD83C\uDFA8", name: "Peinture" },
  { id: "maconnerie", emoji: "\uD83E\uDDF1", name: "Ma\u00e7onnerie" },
  { id: "carrelage", emoji: "\uD83D\uDD32", name: "Carrelage" },
  { id: "toiture", emoji: "\uD83C\uDFE0", name: "Toiture" },
  { id: "chauffage", emoji: "\uD83D\uDD25", name: "Chauffage" },
  { id: "menuiserie", emoji: "\uD83E\uDE9A", name: "Menuiserie" },
  { id: "autre", emoji: "\uD83C\uDFD7\uFE0F", name: "Autre" },
];

export default function DevisForm3Steps({ slug, artisanName, ville }: { slug: string; artisanName: string; ville: string }) {
  const [step, setStep] = useState(0);
  const [metier, setMetier] = useState("plomberie");
  const [subOpt, setSubOpt] = useState(SUB.plomberie.opts[0]);
  const [delai, setDelai] = useState("Sous 2 semaines");
  const [desc, setDesc] = useState("");
  const [nom, setNom] = useState("");
  const [tel, setTel] = useState("");
  const [email, setEmail] = useState("");
  const [cgu, setCgu] = useState(true);
  const [loading, setLoading] = useState(false);
  const [photos, setPhotos] = useState<File[]>([]);
  const [ctaDismissed, setCtaDismissed] = useState(false);
  const [ctaPassword, setCtaPassword] = useState("");
  const [ctaToast, setCtaToast] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const go = (s: number) => setStep(s);

  const submit = async () => {
    setLoading(true);
    try {
      const { submitDevis } = await import("@/lib/api");
      await submitDevis(slug, { nomClient: nom, telephoneClient: tel, emailClient: email, descriptionBesoin: `[${METIERS.find((m) => m.id === metier)?.name} - ${subOpt}] ${delai}. ${desc}` });
      setStep(3);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erreur lors de l'envoi");
    } finally {
      setLoading(false);
    }
  };

  const sub = SUB[metier] || SUB.autre;

  return (
    <div className="devis-card">
      {step < 3 && (
        <div className="mini-stepper">
          {[0, 1, 2].map((i) => <div key={i} className={`mini-dot ${i < step ? "done" : i === step ? "active" : ""}`} />)}
        </div>
      )}

      <div className="devis-header">
        <div className="devis-title">
          <svg viewBox="0 0 24 24"><rect x="4" y="2" width="16" height="20" rx="2" /><path d="M8 6h8M8 10h8M8 14h5" /></svg>
          <h2>Demander un devis gratuit</h2>
        </div>
        <div className="devis-subtitle">D&eacute;crivez votre projet, l&apos;artisan vous r&eacute;pond sous 24h</div>
        <div className="devis-badges">
          <span className="devis-badge green">&#9889; R&eacute;ponse sous 24h</span>
          <span className="devis-badge gray">&#128274; Gratuit et sans engagement</span>
          <span className="devis-badge gray">&#10003; Donn&eacute;es prot&eacute;g&eacute;es</span>
        </div>
        <div className="devis-sep" />
      </div>

      {/* STEP 0 */}
      <div className={`devis-step ${step === 0 ? "active" : ""}`}>
        <div className="devis-step-title">Quel type de travaux ?</div>
        <div className="metier-grid">
          {METIERS.map((m) => (
            <div key={m.id} className={`metier-btn ${metier === m.id ? "selected" : ""}`} onClick={() => { setMetier(m.id); setSubOpt(SUB[m.id]?.opts[0] || ""); }}>
              <span className="emoji">{m.emoji}</span>
              <span className="name">{m.name}</span>
            </div>
          ))}
        </div>
        <div style={{ marginBottom: 20 }}>
          <div className="sub-label">{sub.label}</div>
          <div className="pills-devis">
            {sub.opts.map((o) => <div key={o} className={`pill-opt ${subOpt === o ? "selected" : ""}`} onClick={() => setSubOpt(o)}>{o}</div>)}
          </div>
        </div>
        <div className="btn-row-devis">
          <button className="btn-next-devis" onClick={() => go(1)}>Continuer &rarr;</button>
        </div>
      </div>

      {/* STEP 1 */}
      <div className={`devis-step ${step === 1 ? "active" : ""}`}>
        <div className="devis-step-title">Donnez plus de d&eacute;tails</div>
        <div className="field">
          <label>D&eacute;lai souhait&eacute;</label>
          <div className="pills-devis">
            {["Urgent (< 48h)", "Sous 2 semaines", "Sous 1 mois", "Pas press\u00e9"].map((d) => <div key={d} className={`pill-opt ${delai === d ? "selected" : ""}`} onClick={() => setDelai(d)}>{d}</div>)}
          </div>
        </div>
        <div className="field">
          <label>D&eacute;taillez votre besoin <span style={{ color: "#9B9590", fontWeight: 400 }}>(recommand&eacute;)</span></label>
          <textarea className="bv-textarea" value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Pr&eacute;cisez votre projet : mat&eacute;riaux souhait&eacute;s, &eacute;tat actuel..." />
        </div>
        <div className="field">
          <label>Photos <span style={{ color: "#9B9590", fontWeight: 400 }}>(facultatif &middot; max 5)</span></label>
          <div className="photo-drop" onClick={() => fileRef.current?.click()}>
            <input ref={fileRef} type="file" accept="image/*" multiple hidden onChange={(e) => { if (e.target.files) setPhotos((p) => [...p, ...Array.from(e.target.files!)].slice(0, 5)); }} />
            <div className="photo-drop-text">&#128247; Glissez vos photos ici ou <b>parcourir</b></div>
            <div className="photo-drop-sub">JPG, PNG ou WebP &middot; max 10 Mo par photo</div>
          </div>
          {photos.length > 0 && <p style={{ fontSize: 12, color: "#16a34a", marginTop: 6 }}>{photos.length} photo{photos.length > 1 ? "s" : ""} s&eacute;lectionn&eacute;e{photos.length > 1 ? "s" : ""}</p>}
        </div>
        <div className="btn-row-devis">
          <button className="btn-back" onClick={() => go(0)}>&larr; Retour</button>
          <button className="btn-next-devis" onClick={() => go(2)}>Continuer &rarr;</button>
        </div>
      </div>

      {/* STEP 2 */}
      <div className={`devis-step ${step === 2 ? "active" : ""}`}>
        <div className="devis-step-title">Comment vous contacter ?</div>
        <div className="field">
          <label>Nom <span style={{ color: "#C4531A" }}>*</span></label>
          <div className="input-wrap">
            <svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4" /><path d="M6 20c0-3.3 2.7-6 6-6s6 2.7 6 6" /></svg>
            <input type="text" className="input-icon" value={nom} onChange={(e) => setNom(e.target.value)} placeholder="Votre nom complet" />
          </div>
        </div>
        <div className="field">
          <label>T&eacute;l&eacute;phone <span style={{ color: "#C4531A" }}>*</span></label>
          <div className="input-wrap">
            <svg viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 01-2.18 2A19.79 19.79 0 013 5.18 2 2 0 015 3h3a2 2 0 012 1.72c.12.96.36 1.9.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.91.34 1.85.58 2.81.7A2 2 0 0122 16.92z" /></svg>
            <input type="tel" className="input-icon" value={tel} onChange={(e) => setTel(e.target.value)} placeholder="06 12 34 56 78" />
          </div>
        </div>
        <div className="field">
          <label>Email</label>
          <div className="input-wrap">
            <svg viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="M22 4L12 13 2 4" /></svg>
            <input type="email" className="input-icon" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="votre@email.fr" />
          </div>
        </div>
        <div style={{ marginTop: 20 }}>
          <div className="checkbox-row">
            <input type="checkbox" checked={cgu} onChange={(e) => setCgu(e.target.checked)} id="cb1" />
            <label htmlFor="cb1">J&apos;accepte d&apos;&ecirc;tre contact&eacute; par cet artisan concernant ma demande</label>
          </div>
        </div>
        <button className="btn-submit-devis" disabled={!nom || !tel || loading} onClick={submit}>
          {loading ? <><span style={{ display: "inline-block", width: 18, height: 18, border: "2px solid rgba(255,255,255,.3)", borderTopColor: "white", borderRadius: "50%", animation: "spin .6s linear infinite" }} /> Envoi en cours...</> : <>Envoyer ma demande <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" /></svg></>}
        </button>
        <div className="devis-legal">&#128274; Vos donn&eacute;es sont prot&eacute;g&eacute;es et ne sont partag&eacute;es qu&apos;avec cet artisan.<br />Gratuit et sans engagement.</div>
      </div>

      {/* CONFIRMATION */}
      <div className={`devis-step ${step === 3 ? "active" : ""}`}>
        <div className="confirmation">
          <div className="conf-icon-lg"><svg viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" /></svg></div>
          <div className="conf-title">Votre demande a &eacute;t&eacute; envoy&eacute;e !</div>
          <div className="conf-sub">{artisanName} vous r&eacute;pondra sous 24h.</div>
          <div className="conf-recap">
            <div className="conf-recap-row"><span className="label">Type de travaux</span><span className="val">{METIERS.find((m) => m.id === metier)?.name} &mdash; {subOpt}</span></div>
            <div className="conf-recap-row"><span className="label">D&eacute;lai</span><span className="val">{delai}</span></div>
            <div className="conf-recap-row"><span className="label">Artisan</span><span className="val">{artisanName} &middot; {ville}</span></div>
          </div>
          <p className="conf-email-notice">&#128233; Un email de confirmation vous a &eacute;t&eacute; envoy&eacute;.</p>

          {!ctaDismissed && (
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
      </div>
    </div>
  );
}
