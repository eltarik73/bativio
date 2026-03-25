"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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

  const update = (field: string, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const next = () => {
    setError("");
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };
  const prev = () => setStep((s) => Math.max(s - 1, 0));

  const handleSiretBlur = () => {
    if (form.siret.length === 14) {
      // Mock Pappers
      update("raisonSociale", "Entreprise " + form.siret.slice(0, 4));
      if (!form.nomAffichage) {
        update("nomAffichage", "Entreprise " + form.siret.slice(0, 4));
      }
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

      <div className="bg-white rounded-xl shadow-sm p-8 max-w-lg w-full">
        {/* Step 1: SIRET */}
        {step === 0 && (
          <div>
            <h2 className="font-display text-2xl font-bold text-anthracite mb-2">Votre SIRET</h2>
            <p className="text-anthracite/60 text-sm mb-6">Nous recupererons automatiquement vos informations</p>
            <input
              type="text"
              maxLength={14}
              value={form.siret}
              onChange={(e) => update("siret", e.target.value.replace(/\D/g, ""))}
              onBlur={handleSiretBlur}
              placeholder="12345678901234"
              className="w-full px-4 py-3 rounded-lg border border-black/10 text-lg tracking-wider text-center font-mono focus:ring-2 focus:ring-terre/30 focus:border-terre outline-none"
            />
            {form.raisonSociale && (
              <div className="mt-4 p-4 bg-creme rounded-lg">
                <p className="text-sm text-anthracite/60">Raison sociale</p>
                <p className="font-medium">{form.raisonSociale}</p>
              </div>
            )}
            <button
              onClick={next}
              disabled={form.siret.length !== 14}
              className="w-full mt-6 py-3 bg-terre text-white rounded-lg font-medium hover:bg-terre-light transition-colors disabled:opacity-50"
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
                  className="w-full px-4 py-2.5 rounded-lg border border-black/10 focus:ring-2 focus:ring-terre/30 focus:border-terre outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-anthracite mb-1">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-black/10 focus:ring-2 focus:ring-terre/30 focus:border-terre outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-anthracite mb-1">Telephone</label>
                <input
                  type="tel"
                  value={form.telephone}
                  onChange={(e) => update("telephone", e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-black/10 focus:ring-2 focus:ring-terre/30 focus:border-terre outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-anthracite mb-1">Mot de passe</label>
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => update("password", e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-black/10 focus:ring-2 focus:ring-terre/30 focus:border-terre outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-anthracite mb-1">Confirmer le mot de passe</label>
                <input
                  type="password"
                  value={form.passwordConfirm}
                  onChange={(e) => update("passwordConfirm", e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-black/10 focus:ring-2 focus:ring-terre/30 focus:border-terre outline-none"
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
                className="w-full px-4 py-2.5 rounded-lg border border-black/10 focus:ring-2 focus:ring-terre/30 focus:border-terre outline-none"
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
    </main>
  );
}
