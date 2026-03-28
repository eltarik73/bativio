"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { register } from "@/lib/auth";
import { useAuth } from "@/components/AuthProvider";
import { METIERS, VILLES } from "@/lib/constants";

const STEP_LABELS = ["SIREN", "Infos", "M\u00e9tier", "Zone", "Photos"];
const ARROW_R = <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7" /></svg>;
const ARROW_L = <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>;
const CHECK_I = <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" /></svg>;

export default function InscriptionPage() {
  const router = useRouter();
  const { isAuth, loading: authLoading, refreshAuth } = useAuth();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (!authLoading && isAuth) {
      router.replace("/dashboard");
    }
  }, [authLoading, isAuth, router]);
  const [siretLoading, setSiretLoading] = useState(false);
  const [siretFound, setSiretFound] = useState(false);
  const [photos, setPhotos] = useState<File[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    siret: "", raisonSociale: "", adresse: "", codePostal: "", codeNaf: "",
    email: "", telephone: "", password: "", nomAffichage: "", metierId: "", metierNom: "", ville: "",
  });

  const update = (f: string, v: string) => setForm((p) => ({ ...p, [f]: v }));
  const rawSiret = form.siret.replace(/\D/g, "");
  const siretValid = rawSiret.length === 9 || rawSiret.length === 14;

  const go = (s: number) => { setStep(s); setError(""); window.scrollTo({ top: 0, behavior: "smooth" }); };

  // Bug 8 fix: normaliser la ville retournee par l'API
  const matchVille = (commune: string) => {
    const c = commune.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const match = VILLES.find((v) => v.nom.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") === c || v.slug === c);
    return match ? match.nom : "";
  };

  const handleSiretLookup = async () => {
    if (!siretValid) return;
    setSiretLoading(true); setError(""); setSiretFound(false);
    try {
      const res = await fetch(`https://recherche-entreprises.api.gouv.fr/search?q=${rawSiret}`);
      const json = await res.json();
      if (json.results?.length > 0) {
        const e = json.results[0], s = e.siege || {};
        const villeMatch = matchVille(s.libelle_commune || "");
        setForm((p) => ({
          ...p,
          raisonSociale: e.nom_complet || "",
          adresse: s.geo_adresse || s.adresse || "",
          codePostal: s.code_postal || "",
          ville: villeMatch || p.ville,
          codeNaf: s.activite_principale || "",
          nomAffichage: p.nomAffichage || e.nom_complet || "",
        }));
        setSiretFound(true);
      } else {
        setError("SIREN/SIRET introuvable. V\u00e9rifiez le num\u00e9ro.");
      }
    } catch {
      setError("Impossible de v\u00e9rifier. R\u00e9essayez.");
    } finally {
      setSiretLoading(false);
    }
  };

  // Bug 3 fix: validation par etape
  const validateStep1 = () => {
    if (!form.nomAffichage.trim()) { setError("Le nom d'affichage est requis"); return false; }
    if (!form.email.trim()) { setError("L'email est requis"); return false; }
    if (!form.telephone.trim()) { setError("Le t\u00e9l\u00e9phone est requis"); return false; }
    if (!form.password || form.password.length < 8) { setError("Le mot de passe doit contenir au moins 8 caract\u00e8res"); return false; }
    return true;
  };
  const validateStep2 = () => {
    if (!form.metierNom) { setError("S\u00e9lectionnez votre m\u00e9tier"); return false; }
    return true;
  };
  const validateStep3 = () => {
    if (!form.ville) { setError("S\u00e9lectionnez votre ville"); return false; }
    return true;
  };

  const handleSubmit = async () => {
    setLoading(true); setError("");
    try {
      // Bug 1 fix: padder SIREN a 14 chiffres
      const siretToSend = rawSiret.length === 9 ? rawSiret + "00000" : rawSiret;
      // Bug 4 fix: plus de fallback mot de passe
      await register({
        email: form.email,
        password: form.password,
        siret: siretToSend,
        nomAffichage: form.nomAffichage,
        telephone: form.telephone,
        metierId: form.metierId || undefined,
        ville: form.ville || undefined,
        zoneRayonKm: 25,
      });
      // Refresh auth context so dashboard has artisan data immediately
      await refreshAuth();
      router.push("/dashboard");
    } catch (err) {
      // Bug 7 fix: meilleur parsing erreur
      if (err instanceof Error) {
        setError(err.message || "Erreur lors de l'inscription");
      } else {
        setError("Erreur lors de l'inscription. V\u00e9rifiez vos informations.");
      }
    } finally {
      setLoading(false);
    }
  };

  const fmtSiret = (v: string) => {
    const d = v.replace(/\D/g, "").slice(0, 14);
    if (d.length <= 9) return d.replace(/(\d{3})(?=\d)/g, "$1 ").trim();
    return d.replace(/(\d{3})(\d{3})(\d{3})(\d{0,5})/, "$1 $2 $3 $4").trim();
  };

  // Bug 5 fix: photo handlers
  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const valid = Array.from(files).filter((f) => f.type.startsWith("image/") && f.size <= 10 * 1024 * 1024);
    setPhotos((prev) => [...prev, ...valid].slice(0, 3));
  };

  return (
    <>
      <nav className="nav">
        <Link href="/" className="nav-logo">Bativio</Link>
        <Link href="/connexion" className="nav-link">D&eacute;j&agrave; inscrit ? Se connecter</Link>
      </nav>

      <main style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", padding: "40px 20px 60px" }}>
        {/* Stepper */}
        <div className="reg-stepper">
          {STEP_LABELS.map((label, i) => (
            <div key={label} style={{ display: "contents" }}>
              <div className="step">
                <div className={`step-dot ${i < step ? "done" : i === step ? "active" : "future"}`}>
                  {i < step ? <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" /></svg> : i + 1}
                </div>
                <div className={`step-label ${i < step ? "done" : i === step ? "active" : ""}`}>{label}</div>
              </div>
              {i < STEP_LABELS.length - 1 && <div className={`step-line ${i < step ? "done" : ""}`} />}
            </div>
          ))}
        </div>

        {/* Card */}
        <div className="bv-card">
          <div className="bv-card-progress" style={{ width: `${(step + 1) * 20}%` }} />
          <div className="bv-card-inner">

            {/* Step 0: SIREN */}
            {step === 0 && (
              <div className="step-animate">
                <div className="card-title">Votre SIREN ou SIRET</div>
                <div className="card-subtitle">Nous r&eacute;cup&eacute;rerons automatiquement les informations de votre entreprise.</div>
                <div className="field">
                  <input
                    type="text" className="bv-input siret-input" maxLength={19}
                    value={fmtSiret(form.siret)}
                    onChange={(e) => { update("siret", e.target.value.replace(/\D/g, "").slice(0, 14)); setSiretFound(false); setError(""); }}
                    placeholder="123 456 789"
                  />
                </div>
                {siretFound && form.raisonSociale && (
                  <div style={{ padding: 20, background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 14, marginBottom: 24 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                      <span style={{ width: 24, height: 24, borderRadius: "50%", background: "#16a34a", color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 13 }}>&#10003;</span>
                      <span style={{ fontWeight: 600, color: "#166534", fontSize: 14 }}>Entreprise trouv&eacute;e</span>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                      <div><p style={{ fontSize: 11, color: "#9B9590", marginBottom: 2 }}>Raison sociale</p><p style={{ fontSize: 14, fontWeight: 600, color: "#1C1C1E" }}>{form.raisonSociale}</p></div>
                      {form.ville && <div><p style={{ fontSize: 11, color: "#9B9590", marginBottom: 2 }}>Ville</p><p style={{ fontSize: 14, color: "#6B6560" }}>{form.ville}</p></div>}
                      {form.codeNaf && <div><p style={{ fontSize: 11, color: "#9B9590", marginBottom: 2 }}>Code NAF</p><p style={{ fontSize: 14, color: "#6B6560" }}>{form.codeNaf}</p></div>}
                    </div>
                  </div>
                )}
                {error && <p style={{ color: "#dc2626", fontSize: 14, marginBottom: 16 }}>{error}</p>}
                <button className="bv-btn bv-btn-primary" disabled={!siretValid || siretLoading} onClick={() => { if (!siretFound) handleSiretLookup(); else go(1); }}>
                  {siretLoading ? "V\u00e9rification..." : siretFound ? <>Continuer {ARROW_R}</> : <>V&eacute;rifier et continuer {ARROW_R}</>}
                </button>
                <div className="bv-help">Vous n&apos;avez pas de SIREN/SIRET ? <a href="#" className="bv-link">Contactez-nous</a></div>
              </div>
            )}

            {/* Step 1: Infos */}
            {step === 1 && (
              <div className="step-animate">
                <div className="card-title">Vos informations</div>
                <div className="card-subtitle">V&eacute;rifiez et compl&eacute;tez les informations de votre entreprise.</div>
                {form.raisonSociale && <div className="field"><label className="bv-label">Raison sociale</label><input className="bv-input ro" value={form.raisonSociale} readOnly /></div>}
                <div className="field"><label className="bv-label">Nom d&apos;affichage *</label><input className="bv-input" value={form.nomAffichage} onChange={(e) => update("nomAffichage", e.target.value)} placeholder="Le nom visible par vos clients" /></div>
                <div className="field"><label className="bv-label">Email professionnel *</label><input className="bv-input" type="email" value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="contact@exemple.fr" /></div>
                <div className="field"><label className="bv-label">T&eacute;l&eacute;phone *</label><input className="bv-input" type="tel" value={form.telephone} onChange={(e) => update("telephone", e.target.value)} placeholder="04 79 12 34 56" /></div>
                <div className="field"><label className="bv-label">Mot de passe * <span style={{ fontWeight: 400, color: "#9B9590" }}>(8 caract&egrave;res min.)</span></label><input className="bv-input" type="password" value={form.password} onChange={(e) => update("password", e.target.value)} placeholder="Choisissez un mot de passe" /></div>
                {error && <p style={{ color: "#dc2626", fontSize: 14, marginTop: -8, marginBottom: 8 }}>{error}</p>}
                <div className="btn-row">
                  <button className="bv-btn bv-btn-secondary bv-btn-half" onClick={() => go(0)}>{ARROW_L} Retour</button>
                  <button className="bv-btn bv-btn-primary bv-btn-half" onClick={() => { if (validateStep1()) go(2); }}>Continuer {ARROW_R}</button>
                </div>
              </div>
            )}

            {/* Step 2: Metier */}
            {step === 2 && (
              <div className="step-animate">
                <div className="card-title">Votre m&eacute;tier</div>
                <div className="card-subtitle">S&eacute;lectionnez votre activit&eacute; principale.</div>
                <div className="mg">
                  {METIERS.map((m) => (
                    <div key={m.slug} className={`mc ${form.metierNom === m.nom ? "sel" : ""}`} onClick={() => { update("metierId", m.slug); update("metierNom", m.nom); setError(""); }}>
                      <div className="ico">{m.icone}</div>
                      <div className="nm">{m.nom}</div>
                    </div>
                  ))}
                </div>
                {error && <p style={{ color: "#dc2626", fontSize: 14, marginTop: 8 }}>{error}</p>}
                <div className="btn-row">
                  <button className="bv-btn bv-btn-secondary bv-btn-half" onClick={() => go(1)}>{ARROW_L} Retour</button>
                  <button className="bv-btn bv-btn-primary bv-btn-half" onClick={() => { if (validateStep2()) go(3); }}>Continuer {ARROW_R}</button>
                </div>
              </div>
            )}

            {/* Step 3: Zone */}
            {step === 3 && (
              <div className="step-animate">
                <div className="card-title">Zone d&apos;intervention</div>
                <div className="card-subtitle">O&ugrave; intervenez-vous ?</div>
                <div className="field">
                  <label className="bv-label">Ville principale *</label>
                  <select className="bv-select" value={form.ville} onChange={(e) => { update("ville", e.target.value); setError(""); }}>
                    <option value="">S&eacute;lectionnez votre ville</option>
                    {VILLES.map((v) => <option key={v.slug} value={v.nom}>{v.nom}</option>)}
                  </select>
                </div>
                {error && <p style={{ color: "#dc2626", fontSize: 14, marginTop: 8 }}>{error}</p>}
                <div className="btn-row">
                  <button className="bv-btn bv-btn-secondary bv-btn-half" onClick={() => go(2)}>{ARROW_L} Retour</button>
                  <button className="bv-btn bv-btn-primary bv-btn-half" onClick={() => { if (validateStep3()) go(4); }}>Continuer {ARROW_R}</button>
                </div>
              </div>
            )}

            {/* Step 4: Photos + Submit */}
            {step === 4 && (
              <div className="step-animate">
                <div className="card-title">Vos r&eacute;alisations</div>
                <div className="card-subtitle">Ajoutez des photos de vos chantiers pour convaincre vos futurs clients. <strong style={{ color: "#9B9590" }}>(facultatif)</strong></div>
                <div
                  className="uz"
                  onClick={() => fileRef.current?.click()}
                  onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                  onDrop={(e) => { e.preventDefault(); e.stopPropagation(); handleFiles(e.dataTransfer.files); }}
                >
                  <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" multiple hidden onChange={(e) => handleFiles(e.target.files)} />
                  <div style={{ width: 40, height: 40, margin: "0 auto 12px", background: "#fff", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid #EDEBE7" }}>
                    <svg width="20" height="20" fill="none" stroke="#9B9590" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M12 16V4m0 0l-4 4m4-4l4 4M4 14v4a2 2 0 002 2h12a2 2 0 002-2v-4" /></svg>
                  </div>
                  <div style={{ fontSize: 14, color: "#6B6560" }}>Glissez vos photos ici ou <strong style={{ color: "#C4531A", cursor: "pointer" }}>parcourir</strong></div>
                  <div style={{ fontSize: 12, color: "#C5C0B9", marginTop: 4 }}>JPG, PNG ou WebP &middot; max 10 Mo &middot; jusqu&apos;&agrave; 3 photos</div>
                </div>
                {photos.length > 0 && (
                  <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
                    {photos.map((f, i) => (
                      <div key={i} style={{ position: "relative", width: 80, height: 80, borderRadius: 10, overflow: "hidden", border: "1px solid #EDEBE7" }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={URL.createObjectURL(f)} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        <button type="button" onClick={() => setPhotos((p) => p.filter((_, j) => j !== i))} style={{ position: "absolute", top: 4, right: 4, background: "rgba(0,0,0,.6)", color: "#fff", border: "none", borderRadius: "50%", width: 22, height: 22, cursor: "pointer", fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center" }}>&times;</button>
                      </div>
                    ))}
                  </div>
                )}
                {error && <p style={{ color: "#dc2626", fontSize: 14, marginTop: 16 }}>{error}</p>}
                <div className="btn-row" style={{ marginTop: 28 }}>
                  <button className="bv-btn bv-btn-secondary bv-btn-half" onClick={() => go(3)}>{ARROW_L} Retour</button>
                  <button className="bv-btn bv-btn-primary bv-btn-half" disabled={loading} onClick={handleSubmit}>
                    {loading ? "Cr\u00e9ation en cours..." : <>Cr&eacute;er mon espace {CHECK_I}</>}
                  </button>
                </div>
                <div className="bv-help" style={{ marginTop: 16 }}>Vous pourrez ajouter plus de photos depuis votre tableau de bord.</div>
              </div>
            )}

          </div>
        </div>
      </main>
    </>
  );
}
