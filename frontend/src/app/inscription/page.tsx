"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { METIERS, VILLES } from "@/lib/constants";
import VilleAutocomplete from "@/components/VilleAutocomplete/VilleAutocomplete";

const API_URL = "/api/v1";

const STEP_LABELS = ["SIREN", "Infos", "Métier", "Zone", "Photos"];
const ARROW_R = <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7" /></svg>;
const ARROW_L = <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>;
const CHECK_I = <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" /></svg>;

export default function InscriptionPage() {
  const router = useRouter();
  const { isAuthenticated, loading: authLoading, updateUser, login: authLogin } = useAuth();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [photoToast, setPhotoToast] = useState("");
  const [metierSearch, setMetierSearch] = useState("");

  const [justRegistered, setJustRegistered] = useState(false);
  // Redirect if already authenticated (but not if just registered — we want to go to scoring)
  useEffect(() => {
    if (!authLoading && isAuthenticated && !justRegistered) {
      router.replace("/onboarding/validation");
    }
  }, [authLoading, isAuthenticated, justRegistered, router]);
  const [siretLoading, setSiretLoading] = useState(false);
  const [siretFound, setSiretFound] = useState(false);
  const [photos, setPhotos] = useState<File[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    siret: "", raisonSociale: "", adresse: "", codePostal: "", codeNaf: "",
    email: "", telephone: "", password: "", nomAffichage: "", metierId: "", metierNom: "", ville: "",
    codeInsee: "", latitude: "", longitude: "",
  });

  const update = (f: string, v: string) => setForm((p) => ({ ...p, [f]: v }));
  const rawSiret = form.siret.replace(/\D/g, "");
  const siretValid = rawSiret.length === 9 || rawSiret.length === 14;

  const go = (s: number) => { setStep(s); setError(""); window.scrollTo({ top: 0, behavior: "smooth" }); };

  // Bug 8 fix: normaliser la ville retournee par l'API
  const matchVille = (commune: string) => {
    const c = commune.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
    const match = VILLES.find((v) => v.nom.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "") === c || v.slug === c);
    return match ? match.nom : "";
  };

  const [doublonInfo, setDoublonInfo] = useState<{ message: string; champDoublon: string } | null>(null);

  const handleSiretLookup = async () => {
    if (!siretValid) return;
    setSiretLoading(true); setError(""); setSiretFound(false); setDoublonInfo(null);
    try {
      // 1. Check doublon SIRET IMMÉDIATEMENT
      const siretToCheck = rawSiret.length === 9 ? rawSiret + "00000" : rawSiret;
      const checkRes = await fetch(`${API_URL}/auth/check-doublon`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ siret: siretToCheck }),
      });
      if (checkRes.status === 409) {
        const checkData = await checkRes.json();
        setDoublonInfo({ message: checkData.message || "Cette entreprise est déjà inscrite sur Bativio.", champDoublon: checkData.champDoublon || "siret" });
        setSiretLoading(false);
        return;
      }

      // 2. Lookup API gouv
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
        setError("SIREN/SIRET introuvable. Vérifiez le numéro.");
      }
    } catch {
      setError("Impossible de vérifier. Réessayez.");
    } finally {
      setSiretLoading(false);
    }
  };

  // Validation par etape avec check doublon email/tel
  const validateStep1 = async (): Promise<boolean> => {
    if (!form.nomAffichage.trim()) { setError("Le nom d'affichage est requis"); return false; }
    if (!form.email.trim()) { setError("L'email est requis"); return false; }
    if (!form.telephone.trim()) { setError("Le téléphone est requis"); return false; }
    if (!form.password || form.password.length < 8) { setError("Le mot de passe doit contenir au moins 8 caractères"); return false; }
    // Check doublon email + telephone
    try {
      const res = await fetch(`${API_URL}/auth/check-doublon`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, telephone: form.telephone }),
      });
      if (res.status === 409) {
        const data = await res.json();
        setError(data.message || "Un compte avec ces informations existe déjà.");
        return false;
      }
    } catch { /* continue si erreur réseau */ }
    return true;
  };
  const validateStep2 = () => {
    if (!form.metierNom) { setError("Sélectionnez votre métier"); return false; }
    return true;
  };
  const validateStep3 = () => {
    if (!form.ville) { setError("Sélectionnez votre ville"); return false; }
    return true;
  };

  // Register the artisan account and sync session to AuthContext
  const doRegister = async () => {
    // Bug 1 fix: padder SIREN a 14 chiffres
    const siretToSend = rawSiret.length === 9 ? rawSiret + "00000" : rawSiret;
    // Bug 4 fix: plus de fallback mot de passe
    const res = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        email: form.email,
        password: form.password,
        siret: siretToSend,
        nomAffichage: form.nomAffichage,
        telephone: form.telephone,
        metierId: form.metierId || undefined,
        ville: form.ville || undefined,
        codeInsee: form.codeInsee || undefined,
        codeNaf: form.codeNaf || undefined,
        latitude: form.latitude ? parseFloat(form.latitude) : undefined,
        longitude: form.longitude ? parseFloat(form.longitude) : undefined,
        zoneRayonKm: 25,
      }),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error || "Erreur lors de l'inscription");
    // Mark as just registered BEFORE updating auth state
    setJustRegistered(true);
    // Cookie is set server-side — update local state
    if (json.data) {
      updateUser(json.data);
    }
    return json.data;
  };

  // Upload photos to backend after registration
  const uploadPhotos = async (filesToUpload: File[]): Promise<number> => {
    if (filesToUpload.length === 0) return 0;
    let uploaded = 0;
    for (const file of filesToUpload) {
      try {
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch(`${API_URL}/artisans/me/photos/upload`, {
          method: "POST",
          credentials: "include",
          body: formData,
        });
        const json = await res.json();
        if (json.success) uploaded++;
      } catch {
        // Individual photo upload failed — continue with others
      }
    }
    return uploaded;
  };

  // "Terminer mon inscription" — register + upload photos + redirect
  const handleFinish = async () => {
    setLoading(true); setError(""); setPhotoToast("");
    try {
      await doRegister();
      // Upload photos if any were selected
      if (photos.length > 0) {
        try {
          const uploaded = await uploadPhotos(photos);
          if (uploaded === 0) {
            setPhotoToast("Photos enregistrées ultérieurement");
          } else if (uploaded < photos.length) {
            setPhotoToast(`${uploaded}/${photos.length} photos envoyées. Les autres seront ajoutées depuis le tableau de bord.`);
          }
        } catch {
          setPhotoToast("Photos enregistrées ultérieurement");
        }
      }
      router.push("/onboarding/validation");
    } catch (err) {
      // Bug 7 fix: meilleur parsing erreur
      if (err instanceof Error) {
        setError(err.message || "Erreur lors de l'inscription");
      } else {
        setError("Erreur lors de l'inscription. Vérifiez vos informations.");
      }
    } finally {
      setLoading(false);
    }
  };

  // "Passer cette etape" — register without photos + redirect
  const handleSkip = async () => {
    setLoading(true); setError("");
    try {
      await doRegister();
      router.push("/onboarding/validation");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || "Erreur lors de l'inscription");
      } else {
        setError("Erreur lors de l'inscription. Vérifiez vos informations.");
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
        {/* Hero header */}
        <div style={{ textAlign: "center", marginBottom: 32, maxWidth: 540 }}>
          <h1 style={{ fontFamily: "'Fraunces',serif", fontSize: 28, fontWeight: 700, color: "var(--bois,#3D2E1F)", letterSpacing: -0.5, marginBottom: 8 }}>Cr&eacute;ez votre page pro en 3 minutes</h1>
          <p style={{ fontSize: 15, color: "#6B6560", lineHeight: 1.6, marginBottom: 12 }}>Rejoignez les artisans de Chamb&eacute;ry, Annecy, Grenoble, Lyon et Valence</p>
          <p style={{ fontSize: 13, color: "var(--pierre,#9C958D)", fontWeight: 500 }}>Gratuit &middot; Sans engagement &middot; Sans carte bancaire</p>
        </div>

        {/* Stepper */}
        <div className="reg-stepper">
          {STEP_LABELS.map((label, i) => (
            <div key={label} style={{ display: "contents" }}>
              <div className="step" onClick={() => { if (i < step) go(i); }} style={{ cursor: i < step ? "pointer" : "default" }}>
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
                    onChange={(e) => { update("siret", e.target.value.replace(/\D/g, "").slice(0, 14)); setSiretFound(false); setError(""); setDoublonInfo(null); }}
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
                      <div><p style={{ fontSize: 11, color: "var(--pierre,#9C958D)", marginBottom: 2 }}>Raison sociale</p><p style={{ fontSize: 14, fontWeight: 600, color: "var(--bois,#3D2E1F)" }}>{form.raisonSociale}</p></div>
                      {form.ville && <div><p style={{ fontSize: 11, color: "var(--pierre,#9C958D)", marginBottom: 2 }}>Ville</p><p style={{ fontSize: 14, color: "#6B6560" }}>{form.ville}</p></div>}
                      {form.codeNaf && <div><p style={{ fontSize: 11, color: "var(--pierre,#9C958D)", marginBottom: 2 }}>Code NAF</p><p style={{ fontSize: 14, color: "#6B6560" }}>{form.codeNaf}</p></div>}
                    </div>
                  </div>
                )}
                {/* Doublon détecté */}
                {doublonInfo && (
                  <div style={{ padding: 20, background: "rgba(196,83,26,.06)", border: "1px solid rgba(196,83,26,.2)", borderRadius: 14, marginBottom: 16 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                      <span style={{ fontSize: 18 }}>&#9888;</span>
                      <span style={{ fontWeight: 700, color: "var(--bois,#3D2E1F)", fontSize: 15 }}>Cette entreprise est d&eacute;j&agrave; inscrite</span>
                    </div>
                    <p style={{ fontSize: 14, color: "var(--bois-mid,#5C4A3A)", lineHeight: 1.5, marginBottom: 14 }}>{doublonInfo.message}</p>
                    <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                      <Link href="/connexion" style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "10px 22px", background: "var(--terre,#C4531A)", color: "#fff", borderRadius: 99, fontSize: 14, fontWeight: 600, textDecoration: "none" }}>Se connecter &agrave; mon espace</Link>
                      <Link href="/mot-de-passe-oublie" style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "10px 22px", border: "1px solid var(--sable,#E8D5C0)", color: "var(--terre,#C4531A)", borderRadius: 99, fontSize: 13, fontWeight: 500, textDecoration: "none" }}>Mot de passe oubli&eacute; ?</Link>
                    </div>
                    <p style={{ fontSize: 12, color: "var(--pierre,#9C958D)", marginTop: 10 }}>Ce n&apos;est pas vous ? Contactez-nous : contact@bativio.fr</p>
                  </div>
                )}
                {error && <p style={{ color: "#dc2626", fontSize: 14, marginBottom: 16 }}>{error}</p>}
                <button className="bv-btn bv-btn-primary" disabled={!siretValid || siretLoading || !!doublonInfo} onClick={() => { if (!siretFound) handleSiretLookup(); else go(1); }}>
                  {siretLoading ? "Vérification..." : siretFound ? <>Continuer {ARROW_R}</> : <>V&eacute;rifier et continuer {ARROW_R}</>}
                </button>
                <div className="bv-help">Vous n&apos;avez pas de SIREN/SIRET ? <a href="mailto:contact@bativio.fr" className="bv-link">Contactez-nous</a></div>
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
                <div className="field"><label className="bv-label">Mot de passe * <span style={{ fontWeight: 400, color: "var(--pierre,#9C958D)" }}>(8 caract&egrave;res min.)</span></label><input className="bv-input" type="password" value={form.password} onChange={(e) => update("password", e.target.value)} placeholder="Choisissez un mot de passe" /></div>
                {error && <p style={{ color: "#dc2626", fontSize: 14, marginTop: -8, marginBottom: 8 }}>{error}</p>}
                <div className="btn-row">
                  <button className="bv-btn bv-btn-secondary bv-btn-half" onClick={() => go(0)}>{ARROW_L} Retour</button>
                  <button className="bv-btn bv-btn-primary bv-btn-half" onClick={async () => { if (await validateStep1()) go(2); }}>Continuer {ARROW_R}</button>
                </div>
              </div>
            )}

            {/* Step 2: Metier */}
            {step === 2 && (
              <div className="step-animate">
                <div className="card-title">Votre activit&eacute; principale</div>
                <div className="card-subtitle">Quel est votre m&eacute;tier principal ? Vous pourrez ajouter d&apos;autres sp&eacute;cialit&eacute;s une fois inscrit.</div>

                {/* Search filter */}
                <input
                  type="text"
                  placeholder="Rechercher un m&eacute;tier..."
                  value={metierSearch}
                  onChange={(e) => setMetierSearch(e.target.value)}
                  className="bv-input"
                  style={{ marginBottom: 16 }}
                />

                {/* Métiers par catégorie */}
                {(() => {
                  const cats = [
                    { key: "gros_oeuvre", label: "Gros \u0153uvre", color: "var(--bois,#3D2E1F)" },
                    { key: "second_oeuvre", label: "Second \u0153uvre", color: "var(--terre,#C4531A)" },
                    { key: "specialites", label: "Sp\u00e9cialit\u00e9s", color: "var(--or,#C9943A)" },
                    { key: "exterieur", label: "Ext\u00e9rieur", color: "var(--mousse,#4A6741)" },
                    { key: "autre", label: "Autre", color: "var(--pierre,#9C958D)" },
                  ];
                  const metiersByCat: Record<string, typeof METIERS[number][]> = {};
                  const q = metierSearch.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                  METIERS.forEach((m) => {
                    const mNorm = m.nom.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                    if (q && !mNorm.includes(q)) return;
                    const catKey = m.categorie || "autre";
                    if (!metiersByCat[catKey]) metiersByCat[catKey] = [];
                    metiersByCat[catKey].push(m);
                  });
                  return cats.map((cat) => {
                    const items = metiersByCat[cat.key];
                    if (!items || items.length === 0) return null;
                    return (
                      <div key={cat.key} style={{ marginBottom: 16 }}>
                        <div style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: cat.color, marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
                          <span style={{ width: 8, height: 8, borderRadius: "50%", background: cat.color, display: "inline-block" }} />
                          {cat.label}
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
                          {items.map((m) => (
                            <div
                              key={m.slug}
                              onClick={() => { update("metierId", m.slug); update("metierNom", m.nom); setError(""); }}
                              style={{
                                padding: "10px 8px", borderRadius: 10, textAlign: "center", cursor: "pointer",
                                border: form.metierNom === m.nom ? `2px solid ${cat.color}` : "1px solid var(--sable,#E8D5C0)",
                                background: form.metierNom === m.nom ? `${cat.color}10` : "var(--blanc,#fff)",
                                transition: "all .15s",
                              }}
                            >
                              <div style={{ fontSize: 22, marginBottom: 4 }}>{m.icone}</div>
                              <div style={{ fontSize: 12, fontWeight: form.metierNom === m.nom ? 700 : 500, color: form.metierNom === m.nom ? cat.color : "var(--bois,#3D2E1F)" }}>{m.nom}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  });
                })()}

                {form.metierNom && (
                  <div style={{ marginTop: 12, padding: "10px 14px", background: "var(--mousse-light,#E8F0E6)", borderRadius: 8, fontSize: 13, color: "var(--mousse,#4A6741)", display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 16 }}>&#10003;</span>
                    Activit&eacute; principale : <strong>{form.metierNom}</strong>
                  </div>
                )}

                <p style={{ fontSize: 12, color: "var(--pierre,#9C958D)", marginTop: 10, lineHeight: 1.5 }}>
                  Vous pourrez ajouter d&apos;autres sp&eacute;cialit&eacute;s depuis votre espace une fois inscrit.
                </p>

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
                  <VilleAutocomplete
                    onSelect={(commune) => {
                      update("ville", commune.nom);
                      update("codePostal", commune.codesPostaux[0] || "");
                      update("codeInsee", commune.codeInsee || "");
                      update("latitude", String(commune.latitude || ""));
                      update("longitude", String(commune.longitude || ""));
                      setError("");
                    }}
                    defaultValue={form.ville}
                    placeholder="Tapez votre ville ou code postal..."
                  />
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
                <div className="card-subtitle">Ajoutez 2-3 photos de vos r&eacute;alisations pour convaincre vos futurs clients.</div>
                <div
                  className="uz"
                  onClick={() => fileRef.current?.click()}
                  onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                  onDrop={(e) => { e.preventDefault(); e.stopPropagation(); handleFiles(e.dataTransfer.files); }}
                >
                  <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" multiple hidden onChange={(e) => handleFiles(e.target.files)} />
                  <div style={{ width: 40, height: 40, margin: "0 auto 12px", background: "#fff", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid var(--sable,#E8D5C0)" }}>
                    <svg width="20" height="20" fill="none" stroke="#9B9590" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M12 16V4m0 0l-4 4m4-4l4 4M4 14v4a2 2 0 002 2h12a2 2 0 002-2v-4" /></svg>
                  </div>
                  <div style={{ fontSize: 14, color: "#6B6560" }}>Glissez vos photos ici ou <strong style={{ color: "#C4531A", cursor: "pointer" }}>parcourir</strong></div>
                  <div style={{ fontSize: 12, color: "#C5C0B9", marginTop: 4 }}>JPG, PNG ou WebP &middot; max 10 Mo &middot; jusqu&apos;&agrave; 3 photos</div>
                </div>
                {photos.length > 0 && (
                  <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
                    {photos.map((f, i) => (
                      <div key={i} style={{ position: "relative", width: 80, height: 80, borderRadius: 10, overflow: "hidden", border: "1px solid var(--sable,#E8D5C0)" }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={URL.createObjectURL(f)} alt="Photo de realisation" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        <button type="button" onClick={() => setPhotos((p) => p.filter((_, j) => j !== i))} style={{ position: "absolute", top: 4, right: 4, background: "rgba(0,0,0,.6)", color: "#fff", border: "none", borderRadius: "50%", width: 22, height: 22, cursor: "pointer", fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center" }}>&times;</button>
                      </div>
                    ))}
                  </div>
                )}
                {error && <p style={{ color: "#dc2626", fontSize: 14, marginTop: 16 }}>{error}</p>}
                {photoToast && <p style={{ color: "#C4531A", fontSize: 14, marginTop: 12, background: "#FEF3EC", padding: "10px 14px", borderRadius: 8, border: "1px solid #F5D0B9" }}>{photoToast}</p>}
                <div style={{ marginTop: 28, display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
                  <div style={{ display: "flex", gap: 10, width: "100%" }}>
                    <button className="bv-btn bv-btn-secondary bv-btn-half" onClick={() => go(3)}>{ARROW_L} Retour</button>
                    <button
                      className="bv-btn bv-btn-primary bv-btn-half"
                      style={{ height: 48 }}
                      disabled={loading}
                      onClick={handleFinish}
                    >
                      {loading ? "Création..." : <>Terminer {CHECK_I}</>}
                    </button>
                  </div>
                  <button
                    type="button"
                    disabled={loading}
                    onClick={handleSkip}
                    style={{ background: "none", border: "none", color: "#C4531A", fontSize: 14, fontWeight: 500, cursor: "pointer", padding: "4px 0" }}
                  >
                    Passer cette &eacute;tape &rarr;
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
