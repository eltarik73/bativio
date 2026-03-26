"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { register } from "@/lib/auth";
import { METIERS, VILLES } from "@/lib/constants";

const STEPS = ["SIRET", "Informations", "M\u00e9tier", "Zone", "Photos"];

export default function InscriptionPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    siret: "",
    raisonSociale: "",
    adresse: "",
    codePostal: "",
    codeNaf: "",
    email: "",
    telephone: "",
    password: "",
    passwordConfirm: "",
    nomAffichage: "",
    metierId: "",
    metierNom: "",
    ville: "",
    zoneRayonKm: 25,
  });
  const [siretLoading, setSiretLoading] = useState(false);
  const [siretFound, setSiretFound] = useState(false);

  const update = (field: string, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const next = () => {
    setError("");
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };
  const prev = () => setStep((s) => Math.max(s - 1, 0));

  const handleSiretLookup = async () => {
    if (form.siret.length !== 9 && form.siret.length !== 14) return;
    setSiretLoading(true);
    setError("");
    setSiretFound(false);
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";
      const res = await fetch(`${API_URL}/public/siret/${form.siret}`);
      const json = await res.json();
      if (json.success && json.data) {
        const d = json.data;
        setForm((prev) => ({
          ...prev,
          raisonSociale: d.raisonSociale || "",
          adresse: d.adresse || "",
          codePostal: d.codePostal || "",
          ville: d.ville || prev.ville,
          codeNaf: d.codeNaf || "",
          nomAffichage: prev.nomAffichage || d.raisonSociale || "",
        }));
        setSiretFound(true);
      } else {
        // Fallback: appel direct API DINUM depuis le frontend
        const dinumRes = await fetch(`https://recherche-entreprises.api.gouv.fr/search?q=${form.siret}`);
        const dinumJson = await dinumRes.json();
        if (dinumJson.results && dinumJson.results.length > 0) {
          const e = dinumJson.results[0];
          const s = e.siege || {};
          setForm((prev) => ({
            ...prev,
            raisonSociale: e.nom_complet || "",
            adresse: s.geo_adresse || s.adresse || "",
            codePostal: s.code_postal || "",
            ville: s.libelle_commune || prev.ville,
            codeNaf: s.activite_principale || "",
            nomAffichage: prev.nomAffichage || e.nom_complet || "",
          }));
          setSiretFound(true);
        } else {
          setError("SIREN/SIRET introuvable. V\u00e9rifiez le num\u00e9ro.");
        }
      }
    } catch {
      // Fallback direct API DINUM
      try {
        const dinumRes = await fetch(`https://recherche-entreprises.api.gouv.fr/search?q=${form.siret}`);
        const dinumJson = await dinumRes.json();
        if (dinumJson.results && dinumJson.results.length > 0) {
          const e = dinumJson.results[0];
          const s = e.siege || {};
          setForm((prev) => ({
            ...prev,
            raisonSociale: e.nom_complet || "",
            adresse: s.geo_adresse || s.adresse || "",
            codePostal: s.code_postal || "",
            ville: s.libelle_commune || prev.ville,
            codeNaf: s.activite_principale || "",
            nomAffichage: prev.nomAffichage || e.nom_complet || "",
          }));
          setSiretFound(true);
        } else {
          setError("SIREN/SIRET introuvable. V\u00e9rifiez le num\u00e9ro.");
        }
      } catch {
        setError("Impossible de v\u00e9rifier le SIRET. R\u00e9essayez.");
      }
    } finally {
      setSiretLoading(false);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      await register({
        email: form.email,
        password: form.password,
        siret: form.siret,
        nomAffichage: form.nomAffichage,
        telephone: form.telephone,
        metierId: form.metierId || undefined,
        ville: form.ville || undefined,
        zoneRayonKm: form.zoneRayonKm,
      });
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de l'inscription");
    } finally {
      setLoading(false);
    }
  };

  return (
    <><Navbar />
    <main style={{ minHeight: "85vh", display: "flex", flexDirection: "column", alignItems: "center", padding: "40px 16px" }}>
      {/* Stepper */}
      <div>
        <div className="stepper">
          {STEPS.map((s, i) => (
            <div key={s} style={{ display: "contents" }}>
              <div className={`stepper-dot ${i < step ? "done" : i === step ? "active" : ""}`}>
                {i < step && <svg viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" /></svg>}
              </div>
              {i < STEPS.length - 1 && <div className={`stepper-line ${i < step ? "done" : ""}`} />}
            </div>
          ))}
        </div>
        <div className="stepper-labels">
          {STEPS.map((s, i) => (
            <span key={s} className={i === step ? "active" : ""}>{s}</span>
          ))}
        </div>
      </div>

      <div className="bv-card" style={{ maxWidth: 520, width: "100%", padding: 40, marginTop: 8 }}>
        {/* Step 1: SIRET */}
        {step === 0 && (
          <div>
            <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 24, fontWeight: 700, color: "#1C1C1E", marginBottom: 6 }}>Votre SIREN ou SIRET</h2>
            <p className="bv-helper" style={{ marginBottom: 24 }}>Entrez votre SIREN (9 chiffres) ou SIRET (14 chiffres). Nous r&eacute;cup&eacute;rerons automatiquement vos informations.</p>
            <input
              type="text"
              maxLength={19}
              value={form.siret.replace(/(\d{3})(?=\d)/g, "$1 ").trim()}
              onChange={(e) => { const raw = e.target.value.replace(/\D/g, "").slice(0, 14); update("siret", raw); setSiretFound(false); setError(""); }}
              placeholder="123 456 789 ou 123 456 789 01234"
              className="bv-input"
              style={{ height: 56, fontSize: 18, textAlign: "center", letterSpacing: 2, fontFamily: "monospace" }}
            />
            {siretFound && form.raisonSociale && (
              <div style={{ marginTop: 20, padding: 20, background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 14 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                  <span style={{ width: 24, height: 24, borderRadius: "50%", background: "#16a34a", color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700 }}>&#10003;</span>
                  <span style={{ fontWeight: 600, color: "#166534", fontSize: 15 }}>Entreprise trouv&eacute;e</span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                  <div><p style={{ fontSize: 12, color: "#9B9590", marginBottom: 2 }}>Raison sociale</p><p style={{ fontSize: 15, fontWeight: 600, color: "#1C1C1E" }}>{form.raisonSociale}</p></div>
                  {form.adresse && <div><p style={{ fontSize: 12, color: "#9B9590", marginBottom: 2 }}>Adresse</p><p style={{ fontSize: 14, color: "#6B6560" }}>{form.adresse}</p></div>}
                  {form.ville && <div><p style={{ fontSize: 12, color: "#9B9590", marginBottom: 2 }}>Ville</p><p style={{ fontSize: 14, color: "#6B6560" }}>{form.ville}</p></div>}
                  {form.codeNaf && <div><p style={{ fontSize: 12, color: "#9B9590", marginBottom: 2 }}>Code NAF</p><p style={{ fontSize: 14, color: "#6B6560" }}>{form.codeNaf}</p></div>}
                </div>
              </div>
            )}
            {error && <p style={{ color: "#dc2626", fontSize: 14, marginTop: 14 }}>{error}</p>}
            <button
              type="button"
              onClick={() => { if (!siretFound && (form.siret.length === 9 || form.siret.length === 14)) { handleSiretLookup(); } else { next(); } }}
              disabled={(form.siret.length !== 9 && form.siret.length !== 14) || siretLoading}
              className="bv-btn bv-btn-primary bv-btn-full"
              style={{ marginTop: 24 }}
            >
              {siretLoading ? "V\u00e9rification..." : siretFound ? "Continuer" : "V\u00e9rifier et continuer"}
            </button>
            <p style={{ textAlign: "center", marginTop: 16, fontSize: 13, color: "#9B9590" }}>Vous n&apos;avez pas de SIREN/SIRET ? <a href="#" className="bv-link" style={{ fontSize: 13 }}>Contactez-nous</a></p>
          </div>
        )}

        {/* Step 2: Informations */}
        {step === 1 && (
          <div>
            <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 24, fontWeight: 700, color: "#1C1C1E", marginBottom: 24 }}>Vos informations</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div>
                <label className="bv-label">Nom d&apos;affichage</label>
                <input type="text" value={form.nomAffichage} onChange={(e) => update("nomAffichage", e.target.value)} className="bv-input" readOnly={!!form.raisonSociale} placeholder="Nom de votre entreprise" />
              </div>
              <div>
                <label className="bv-label">Email</label>
                <input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} className="bv-input" placeholder="votre@email.fr" />
              </div>
              <div>
                <label className="bv-label">T&eacute;l&eacute;phone</label>
                <input type="tel" value={form.telephone} onChange={(e) => update("telephone", e.target.value)} className="bv-input" placeholder="06 12 34 56 78" />
              </div>
              <div>
                <label className="bv-label">Mot de passe</label>
                <input type="password" value={form.password} onChange={(e) => update("password", e.target.value)} className="bv-input" placeholder="8 caract\u00e8res minimum" />
              </div>
              <div>
                <label className="bv-label">Confirmer le mot de passe</label>
                <input type="password" value={form.passwordConfirm} onChange={(e) => update("passwordConfirm", e.target.value)} className="bv-input" placeholder="Retapez votre mot de passe" />
                {form.password && form.passwordConfirm && form.password !== form.passwordConfirm && <p style={{ color: "#dc2626", fontSize: 13, marginTop: 6 }}>Les mots de passe ne correspondent pas</p>}
              </div>
            </div>
            <div style={{ display: "flex", gap: 12, marginTop: 28 }}>
              <button onClick={prev} className="bv-btn bv-btn-secondary" style={{ flex: "0 0 auto" }}>Retour</button>
              <button onClick={next} disabled={!form.email || !form.password || form.password !== form.passwordConfirm} className="bv-btn bv-btn-primary" style={{ flex: 1 }}>Continuer</button>
            </div>
          </div>
        )}

        {/* Step 3: M&eacute;tier */}
        {step === 2 && (
          <div>
            <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 24, fontWeight: 700, color: "#1C1C1E", marginBottom: 24 }}>Votre m&eacute;tier</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {METIERS.map((m) => (
                <button
                  key={m.slug}
                  onClick={() => { update("metierId", m.slug); update("metierNom", m.nom); }}
                  style={{ padding: 18, borderRadius: 14, textAlign: "center", border: form.metierNom === m.nom ? "2px solid #C4531A" : "1px solid #E0DDD8", background: form.metierNom === m.nom ? "rgba(196,83,26,.05)" : "#fff", cursor: "pointer", transition: "all .15s" }}
                >
                  <span style={{ fontSize: 28, display: "block" }}>{m.icone}</span>
                  <p style={{ marginTop: 6, fontSize: 14, fontWeight: 600, color: form.metierNom === m.nom ? "#C4531A" : "#1C1C1E" }}>{m.nom}</p>
                </button>
              ))}
            </div>
            <div style={{ display: "flex", gap: 12, marginTop: 28 }}>
              <button onClick={prev} className="bv-btn bv-btn-secondary">Retour</button>
              <button onClick={next} className="bv-btn bv-btn-primary" style={{ flex: 1 }}>Continuer</button>
            </div>
          </div>
        )}

        {/* Step 4: Zone */}
        {step === 3 && (
          <div>
            <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 24, fontWeight: 700, color: "#1C1C1E", marginBottom: 24 }}>Zone d&apos;intervention</h2>
            <div>
              <label className="bv-label">Ville principale</label>
              <select value={form.ville} onChange={(e) => update("ville", e.target.value)} className="bv-input" style={{ cursor: "pointer" }}>
                <option value="">S&eacute;lectionnez votre ville</option>
                {VILLES.map((v) => <option key={v.slug} value={v.nom}>{v.nom}</option>)}
              </select>
            </div>
            <div style={{ marginTop: 24 }}>
              <label className="bv-label">
                Rayon d&apos;intervention : <span style={{ color: "#C4531A" }}>{form.zoneRayonKm} km</span>
              </label>
              <input type="range" min={5} max={80} value={form.zoneRayonKm} onChange={(e) => update("zoneRayonKm", parseInt(e.target.value))} style={{ width: "100%", accentColor: "#C4531A", marginTop: 8 }} />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#9B9590", marginTop: 4 }}>
                <span>5 km</span><span>80 km</span>
              </div>
            </div>
            <div style={{ display: "flex", gap: 12, marginTop: 28 }}>
              <button onClick={prev} className="bv-btn bv-btn-secondary">Retour</button>
              <button onClick={next} className="bv-btn bv-btn-primary" style={{ flex: 1 }}>Continuer</button>
            </div>
          </div>
        )}

        {/* Step 5: Photos — dernier step, publie */}
        {step === 4 && (
          <div>
            <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 24, fontWeight: 700, color: "#1C1C1E", marginBottom: 6 }}>Vos photos</h2>
            <p className="bv-helper" style={{ marginBottom: 24 }}>Ajoutez des photos de vos r&eacute;alisations (facultatif)</p>
            <div className="photo-upload-zone" style={{ padding: 32 }}>
              <div style={{ fontSize: 36, marginBottom: 8 }}>&#128247;</div>
              <p style={{ fontSize: 14, color: "#6B6560" }}>Glissez vos photos ici ou <span className="bv-link">parcourir</span></p>
              <p style={{ fontSize: 12, color: "#9B9590", marginTop: 4 }}>JPG, PNG ou WebP &middot; max 10 Mo</p>
            </div>
            {/* Aper&ccedil;u */}
            <div style={{ marginTop: 24, padding: 20, background: "#F7F5F2", borderRadius: 14 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ width: 48, height: 48, borderRadius: "50%", background: "rgba(196,83,26,.1)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Fraunces',serif", fontSize: 20, fontWeight: 700, color: "#C4531A" }}>
                  {form.nomAffichage ? form.nomAffichage.charAt(0).toUpperCase() : "?"}
                </div>
                <div>
                  <p style={{ fontFamily: "'Fraunces',serif", fontSize: 17, fontWeight: 700, color: "#1C1C1E" }}>{form.nomAffichage || "Votre entreprise"}</p>
                  <p style={{ fontSize: 13, color: "#9B9590" }}>{form.metierNom || "Votre m\u00e9tier"}{form.ville ? ` \u00e0 ${form.ville}` : ""}</p>
                </div>
              </div>
              <p style={{ fontSize: 12, color: "#C5C0B9", marginTop: 10 }}>
                bativio.fr/{(form.ville || "ville").toLowerCase()}/{form.nomAffichage.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") || "votre-slug"}
              </p>
            </div>
            {error && <p style={{ color: "#dc2626", fontSize: 14, marginTop: 14 }}>{error}</p>}
            <div style={{ display: "flex", gap: 12, marginTop: 28 }}>
              <button onClick={prev} className="bv-btn bv-btn-secondary">Retour</button>
              <button onClick={handleSubmit} disabled={loading} className="bv-btn bv-btn-primary" style={{ flex: 1 }}>
                {loading ? "Publication..." : "Publier ma page"}
              </button>
            </div>
          </div>
        )}
      </div>
    </main></>
  );
}
