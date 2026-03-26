"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { register } from "@/lib/auth";
import { METIERS, VILLES } from "@/lib/constants";

const STEPS = ["SIRET", "Identite", "Metier", "Zone", "Photos", "Apercu"];

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
    if (form.siret.length !== 14) return;
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
          setError("SIRET introuvable. V\u00e9rifiez le num\u00e9ro.");
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
          setError("SIRET introuvable. V\u00e9rifiez le num\u00e9ro.");
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
    <main className="min-h-[80vh] flex flex-col items-center py-12 px-4">
      {/* Progress */}
      <div className="flex items-center gap-2 mb-12">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className={`w-3 h-3 rounded-full transition-colors ${
                i <= step ? "bg-terre" : "bg-black/10"
              }`}
            />
            {i < STEPS.length - 1 && (
              <div className={`w-8 h-0.5 ${i < step ? "bg-terre" : "bg-black/10"}`} />
            )}
          </div>
        ))}
      </div>

      <div className="bg-white rounded-[14px] border border-g100 p-8 max-w-lg w-full">
        {/* Step 1: SIRET */}
        {step === 0 && (
          <div>
            <h2 className="font-display text-2xl font-bold text-anthracite mb-2">Votre SIRET</h2>
            <p style={{ color: "var(--g500)", fontSize: 14, marginBottom: 20 }}>Nous r&eacute;cup&eacute;rons automatiquement vos informations depuis la base SIRENE</p>
            <div style={{ display: "flex", gap: 8 }}>
              <input
                type="text"
                maxLength={14}
                value={form.siret}
                onChange={(e) => { update("siret", e.target.value.replace(/\D/g, "")); setSiretFound(false); }}
                placeholder="Entrez votre SIRET (14 chiffres)"
                style={{ flex: 1, padding: "14px 16px", borderRadius: 10, border: "1px solid var(--g200)", fontSize: 16, letterSpacing: 1.5, textAlign: "center", fontFamily: "monospace", outline: "none" }}
              />
              <button
                type="button"
                onClick={handleSiretLookup}
                disabled={form.siret.length !== 14 || siretLoading}
                style={{ padding: "14px 20px", borderRadius: 10, background: form.siret.length === 14 ? "var(--terre)" : "var(--g200)", color: form.siret.length === 14 ? "#fff" : "var(--g400)", fontSize: 14, fontWeight: 600, whiteSpace: "nowrap", transition: "all .2s", cursor: form.siret.length === 14 ? "pointer" : "not-allowed" }}
              >
                {siretLoading ? "..." : "V\u00e9rifier"}
              </button>
            </div>
            {siretFound && form.raisonSociale && (
              <div style={{ marginTop: 16, padding: 16, background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
                  <span style={{ color: "#16a34a", fontSize: 16 }}>&#10003;</span>
                  <span style={{ fontWeight: 600, color: "#166534", fontSize: 14 }}>Entreprise trouv&eacute;e</span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  <div>
                    <p style={{ fontSize: 11, color: "var(--g400)" }}>Raison sociale</p>
                    <p style={{ fontSize: 14, fontWeight: 600, color: "var(--anthracite)" }}>{form.raisonSociale}</p>
                  </div>
                  {form.adresse && (
                    <div>
                      <p style={{ fontSize: 11, color: "var(--g400)" }}>Adresse</p>
                      <p style={{ fontSize: 13, color: "var(--g500)" }}>{form.adresse}</p>
                    </div>
                  )}
                  {form.ville && (
                    <div>
                      <p style={{ fontSize: 11, color: "var(--g400)" }}>Ville</p>
                      <p style={{ fontSize: 13, color: "var(--g500)" }}>{form.ville}</p>
                    </div>
                  )}
                  {form.codeNaf && (
                    <div>
                      <p style={{ fontSize: 11, color: "var(--g400)" }}>Code NAF</p>
                      <p style={{ fontSize: 13, color: "var(--g500)" }}>{form.codeNaf}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
            {error && <p style={{ color: "#dc2626", fontSize: 13, marginTop: 12 }}>{error}</p>}
            <button
              onClick={next}
              disabled={form.siret.length !== 14}
              style={{ width: "100%", marginTop: 20, padding: 14, borderRadius: 10, background: form.siret.length === 14 ? "var(--terre)" : "var(--g200)", color: form.siret.length === 14 ? "#fff" : "var(--g400)", fontSize: 15, fontWeight: 600, transition: "all .2s", cursor: form.siret.length === 14 ? "pointer" : "not-allowed" }}
            >
              Continuer
            </button>
          </div>
        )}

        {/* Step 2: Identite */}
        {step === 1 && (
          <div>
            <h2 className="font-display text-2xl font-bold text-anthracite mb-6">Vos informations</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-anthracite mb-1">Nom d&apos;affichage</label>
                <input
                  type="text"
                  value={form.nomAffichage}
                  onChange={(e) => update("nomAffichage", e.target.value)}
                  className="w-full px-4 py-[11px] rounded-lg border border-g200 bg-white text-anthracite text-[13px] focus:ring-2 focus:ring-terre/20 focus:border-terre outline-none transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-anthracite mb-1">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  className="w-full px-4 py-[11px] rounded-lg border border-g200 bg-white text-anthracite text-[13px] focus:ring-2 focus:ring-terre/20 focus:border-terre outline-none transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-anthracite mb-1">Telephone</label>
                <input
                  type="tel"
                  value={form.telephone}
                  onChange={(e) => update("telephone", e.target.value)}
                  className="w-full px-4 py-[11px] rounded-lg border border-g200 bg-white text-anthracite text-[13px] focus:ring-2 focus:ring-terre/20 focus:border-terre outline-none transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-anthracite mb-1">Mot de passe</label>
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => update("password", e.target.value)}
                  className="w-full px-4 py-[11px] rounded-lg border border-g200 bg-white text-anthracite text-[13px] focus:ring-2 focus:ring-terre/20 focus:border-terre outline-none transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-anthracite mb-1">Confirmer le mot de passe</label>
                <input
                  type="password"
                  value={form.passwordConfirm}
                  onChange={(e) => update("passwordConfirm", e.target.value)}
                  className="w-full px-4 py-[11px] rounded-lg border border-g200 bg-white text-anthracite text-[13px] focus:ring-2 focus:ring-terre/20 focus:border-terre outline-none transition"
                />
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <button onClick={prev} className="px-6 py-3 border border-black/10 rounded-lg text-anthracite">Retour</button>
              <button
                onClick={next}
                disabled={!form.email || !form.password || form.password !== form.passwordConfirm}
                className="flex-1 py-3 bg-terre text-white rounded-lg font-medium hover:bg-terre-light transition-colors disabled:opacity-50"
              >
                Continuer
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Metier */}
        {step === 2 && (
          <div>
            <h2 className="font-display text-2xl font-bold text-anthracite mb-6">Votre metier</h2>
            <div className="grid grid-cols-2 gap-3">
              {METIERS.map((m) => (
                <button
                  key={m.slug}
                  onClick={() => { update("metierId", m.slug); update("metierNom", m.nom); }}
                  className={`p-4 rounded-xl text-center transition-colors border ${
                    form.metierNom === m.nom
                      ? "bg-terre text-white border-terre"
                      : "bg-white border-black/10 hover:border-terre"
                  }`}
                >
                  <span className="text-2xl">{m.icone}</span>
                  <p className="mt-1 text-sm font-medium">{m.nom}</p>
                </button>
              ))}
            </div>
            <div className="mt-6 flex gap-3">
              <button onClick={prev} className="px-6 py-3 border border-black/10 rounded-lg text-anthracite">Retour</button>
              <button onClick={next} className="flex-1 py-3 bg-terre text-white rounded-lg font-medium hover:bg-terre-light transition-colors">
                Continuer
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Zone */}
        {step === 3 && (
          <div>
            <h2 className="font-display text-2xl font-bold text-anthracite mb-6">Zone d&apos;intervention</h2>
            <div>
              <label className="block text-sm font-medium text-anthracite mb-1">Ville</label>
              <select
                value={form.ville}
                onChange={(e) => update("ville", e.target.value)}
                className="w-full px-4 py-[11px] rounded-lg border border-g200 bg-white text-anthracite text-[13px] focus:ring-2 focus:ring-terre/20 focus:border-terre outline-none transition"
              >
                <option value="">Selectionnez votre ville</option>
                {VILLES.map((v) => (
                  <option key={v.slug} value={v.nom}>{v.nom}</option>
                ))}
              </select>
            </div>
            <div className="mt-6">
              <label className="block text-sm font-medium text-anthracite mb-2">
                Rayon d&apos;intervention : <span className="text-terre font-bold">{form.zoneRayonKm} km</span>
              </label>
              <input
                type="range"
                min={5}
                max={80}
                value={form.zoneRayonKm}
                onChange={(e) => update("zoneRayonKm", parseInt(e.target.value))}
                className="w-full accent-terre"
              />
              <div className="flex justify-between text-xs text-anthracite/40 mt-1">
                <span>5 km</span>
                <span>80 km</span>
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <button onClick={prev} className="px-6 py-3 border border-black/10 rounded-lg text-anthracite">Retour</button>
              <button onClick={next} className="flex-1 py-3 bg-terre text-white rounded-lg font-medium hover:bg-terre-light transition-colors">
                Continuer
              </button>
            </div>
          </div>
        )}

        {/* Step 5: Photos */}
        {step === 4 && (
          <div>
            <h2 className="font-display text-2xl font-bold text-anthracite mb-2">Vos photos</h2>
            <p className="text-anthracite/60 text-sm mb-6">Ajoutez des photos de vos realisations (optionnel)</p>
            <div className="border-2 border-dashed border-black/10 rounded-xl p-12 text-center">
              <p className="text-4xl mb-3">&#128247;</p>
              <p className="text-anthracite/50 text-sm">Glissez vos photos ici ou</p>
              <button className="mt-2 px-4 py-2 bg-creme rounded-lg text-sm text-anthracite/70 hover:bg-terre/10 transition-colors">
                Choisir des photos
              </button>
            </div>
            <div className="mt-6 flex gap-3">
              <button onClick={prev} className="px-6 py-3 border border-black/10 rounded-lg text-anthracite">Retour</button>
              <button onClick={next} className="flex-1 py-3 bg-terre text-white rounded-lg font-medium hover:bg-terre-light transition-colors">
                {form.ville ? "Continuer" : "Passer"}
              </button>
            </div>
          </div>
        )}

        {/* Step 6: Apercu */}
        {step === 5 && (
          <div>
            <h2 className="font-display text-2xl font-bold text-anthracite mb-6">Apercu de votre page</h2>
            <div className="bg-creme rounded-xl p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-full bg-terre/10 flex items-center justify-center text-terre font-display font-bold text-xl">
                  {form.nomAffichage.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold">{form.nomAffichage || "Votre entreprise"}</h3>
                  <p className="text-sm text-anthracite/60">
                    {form.metierNom || "Votre metier"} {form.ville ? `a ${form.ville}` : ""}
                  </p>
                </div>
              </div>
              <p className="text-xs text-anthracite/40 mt-2">
                URL : bativio.fr/{(form.ville || "ville").toLowerCase()}/{form.nomAffichage.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") || "votre-slug"}
              </p>
            </div>
            {error && <p className="text-red-600 text-sm mt-4">{error}</p>}
            <div className="mt-6 flex gap-3">
              <button onClick={prev} className="px-6 py-3 border border-black/10 rounded-lg text-anthracite">Retour</button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 py-3 bg-terre text-white rounded-lg font-medium hover:bg-terre-light transition-colors disabled:opacity-50"
              >
                {loading ? "Publication..." : "Publier ma page"}
              </button>
            </div>
          </div>
        )}
      </div>
    </main></>
  );
}
