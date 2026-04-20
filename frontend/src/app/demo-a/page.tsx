"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnnuaireBlock from "@/components/AnnuaireBlock";
import VilleAutocomplete from "@/components/VilleAutocomplete/VilleAutocomplete";
import type { CommuneResult } from "@/components/VilleAutocomplete/VilleAutocomplete";
import { fadeUp } from "@/lib/motion";
import { detectMetier, summarizeProjet } from "@/lib/detect-metier";

const STATS = [
  { value: "1 200+", label: "Artisans" },
  { value: "4,8", suffix: "★", label: "Note" },
  { value: "24h", label: "Devis" },
  { value: "0€", label: "Commission" },
];

const EXEMPLES_PROJET = [
  "Je dois refaire le carrelage de ma salle de bain (5 m²)",
  "Mon chauffe-eau est en panne, j'ai besoin d'un remplacement en urgence",
  "Je voudrais repeindre mon salon et ma chambre (40 m²)",
  "J'ai besoin de refaire toute ma cuisine : plomberie, électricité, carrelage",
];

type Mode = "chercher" | "decrire";

export default function DemoA() {
  const [mode, setMode] = useState<Mode>("chercher");

  // Mode chercher
  const [search, setSearch] = useState("");

  // Mode décrire
  const [projet, setProjet] = useState("");
  const [projetSubmitted, setProjetSubmitted] = useState(false);
  const [detectedMetier, setDetectedMetier] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [demandeSent, setDemandeSent] = useState(false);

  // Commun
  const [villeFilter, setVilleFilter] = useState("");
  const [villeLabel, setVilleLabel] = useState("");
  const [villeCoords, setVilleCoords] = useState<{ lat: number; lon: number } | null>(null);

  const handleVilleSelect = (commune: CommuneResult) => {
    const slug = commune.slug || commune.nom.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z]/g, "");
    setVilleFilter(slug);
    setVilleLabel(commune.nom);
    if (commune.latitude && commune.longitude) setVilleCoords({ lat: commune.latitude, lon: commune.longitude });
  };

  const handleProjetSubmit = () => {
    if (!projet.trim()) return;
    const metier = detectMetier(projet);
    setDetectedMetier(metier);
    setProjetSubmitted(true);
    setTimeout(() => {
      document.getElementById("annuaire-anchor")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const sendDemande = () => {
    setDemandeSent(true);
    setTimeout(() => {
      setDemandeSent(false);
      setProjet("");
      setProjetSubmitted(false);
      setSelectedIds(new Set());
      setDetectedMetier(null);
      setMode("chercher");
    }, 3500);
  };

  const selectionCount = selectedIds.size;

  return (
    <>
      <Navbar />

      {/* ─── HERO COMPACT ─── */}
      <section className="cinema-light" style={{ minHeight: "auto", padding: "56px 32px 40px", textAlign: "center", position: "relative" }}>
        <div className="cinema-blob-light cinema-blob-light-1" style={{ opacity: .35 }} />
        <div className="cinema-blob-light cinema-blob-light-2" style={{ opacity: .25 }} />

        <div style={{ maxWidth: 880, margin: "0 auto", position: "relative", zIndex: 10 }}>
          <motion.div
            {...fadeUp(0)}
            className="liquid-glass"
            style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 14px", borderRadius: 999, marginBottom: 18, fontSize: 12, fontWeight: 500, color: "var(--terre-deep)", letterSpacing: 0.3 }}
          >
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--terre)" }} />
            Artisans vérifiés en Rhône-Alpes
          </motion.div>

          <motion.h1
            {...fadeUp(0.06)}
            style={{ fontFamily: "'Fraunces',serif", fontSize: "clamp(32px,4.5vw,48px)", fontWeight: 600, color: "var(--bois)", lineHeight: 1.05, letterSpacing: -1, marginBottom: 18 }}
          >
            {mode === "chercher" ? (
              <>Trouvez l&apos;artisan <span style={{ fontStyle: "italic", fontWeight: 400, color: "var(--terre)" }}>idéal</span> près de chez vous.</>
            ) : (
              <>Décrivez votre projet, <span style={{ fontStyle: "italic", fontWeight: 400, color: "var(--terre)" }}>on s&apos;occupe du reste</span>.</>
            )}
          </motion.h1>

          {/* Toggle segmented */}
          <motion.div
            {...fadeUp(0.1)}
            style={{ display: "inline-flex", padding: 4, background: "rgba(255,255,255,.6)", border: "1px solid rgba(61,46,31,.08)", borderRadius: 999, marginBottom: 18, backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}
          >
            {(["chercher", "decrire"] as Mode[]).map((m) => (
              <button
                key={m}
                onClick={() => { setMode(m); setProjetSubmitted(false); setSelectedIds(new Set()); }}
                style={{
                  padding: "8px 20px",
                  borderRadius: 999,
                  border: "none",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                  background: mode === m ? "var(--bois)" : "transparent",
                  color: mode === m ? "#fff" : "var(--bois-mid)",
                  transition: "all .25s",
                  fontFamily: "inherit",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                {m === "chercher" ? (
                  <><svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg> Chercher un artisan</>
                ) : (
                  <><svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" /></svg> Décrire mon projet</>
                )}
              </button>
            ))}
          </motion.div>

          <AnimatePresence mode="wait">
            {mode === "chercher" ? (
              <motion.div
                key="chercher"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="liquid-glass search-bar"
                style={{ maxWidth: 640, borderRadius: 14, padding: 6, margin: "0 auto" }}
              >
                <div style={{ flex: 1, maxWidth: 200, minWidth: 0 }}>
                  <VilleAutocomplete onSelect={handleVilleSelect} placeholder="Ville" defaultValue={villeLabel} className="search-bar-ville" />
                </div>
                <input type="text" placeholder="Plombier, électricien…" value={search} onChange={(e) => setSearch(e.target.value)} aria-label="Recherche métier" />
                <button className="search-btn" aria-label="Rechercher">
                  <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                  Rechercher
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="decrire"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="liquid-glass"
                style={{ maxWidth: 680, margin: "0 auto", borderRadius: 18, padding: 14 }}
              >
                <textarea
                  value={projet}
                  onChange={(e) => setProjet(e.target.value)}
                  placeholder="Ex : Je voudrais refaire le carrelage de ma salle de bain (5m²)…"
                  rows={3}
                  style={{ width: "100%", border: "none", background: "transparent", outline: "none", resize: "none", fontSize: 15, color: "var(--bois)", fontFamily: "inherit", lineHeight: 1.5, padding: "6px 8px" }}
                />
                <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 10, paddingTop: 10, borderTop: "1px solid rgba(61,46,31,.08)" }}>
                  <div style={{ flex: 1, maxWidth: 220 }}>
                    <VilleAutocomplete onSelect={handleVilleSelect} placeholder="Votre ville" defaultValue={villeLabel} className="search-bar-ville" />
                  </div>
                  <button
                    onClick={handleProjetSubmit}
                    disabled={!projet.trim()}
                    className="search-btn"
                    style={{ opacity: projet.trim() ? 1 : .5, cursor: projet.trim() ? "pointer" : "not-allowed", padding: "12px 22px" }}
                  >
                    Trouver les artisans
                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M5 12h14M13 5l7 7-7 7" /></svg>
                  </button>
                </div>
                {!projet && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 12 }}>
                    {EXEMPLES_PROJET.slice(0, 2).map((ex) => (
                      <button
                        key={ex}
                        onClick={() => setProjet(ex)}
                        style={{ padding: "5px 12px", borderRadius: 999, background: "rgba(255,255,255,.5)", border: "1px solid rgba(61,46,31,.08)", fontSize: 12, color: "var(--bois-mid)", cursor: "pointer", fontFamily: "inherit", textAlign: "left" }}
                      >
                        « {ex} »
                      </button>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {mode === "chercher" && (
            <motion.div
              {...fadeUp(0.22)}
              style={{ display: "inline-flex", marginTop: 22, gap: 0, padding: "10px 8px", borderRadius: 12, background: "rgba(255,255,255,.5)", border: "1px solid rgba(61,46,31,.06)" }}
            >
              {STATS.map((s, i) => (
                <div key={s.label} style={{ padding: "0 18px", borderRight: i < 3 ? "1px solid rgba(61,46,31,.08)" : "none", textAlign: "center" }}>
                  <div style={{ fontFamily: "'Fraunces',serif", fontSize: 18, fontWeight: 600, color: "var(--bois)", letterSpacing: -.3 }}>
                    {s.value}{s.suffix && <span style={{ color: "var(--terre)" }}>{s.suffix}</span>}
                  </div>
                  <div style={{ fontSize: 10, color: "var(--pierre)", letterSpacing: .3, textTransform: "uppercase", marginTop: 2 }}>{s.label}</div>
                </div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      <div id="annuaire-anchor" style={{ scrollMarginTop: 80 }} />

      {/* Bandeau récap projet soumis */}
      <AnimatePresence>
        {mode === "decrire" && projetSubmitted && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            style={{ background: "linear-gradient(90deg, rgba(196,83,26,.08) 0%, rgba(201,148,58,.06) 100%)", padding: "20px 32px", borderTop: "1px solid rgba(196,83,26,.12)", borderBottom: "1px solid rgba(196,83,26,.12)" }}
          >
            <div style={{ maxWidth: 1360, margin: "0 auto", display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
              <div style={{ width: 40, height: 40, borderRadius: "50%", background: "var(--terre)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <svg width="20" height="20" fill="none" stroke="#fff" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" /></svg>
              </div>
              <div style={{ flex: 1, minWidth: 200 }}>
                <div style={{ fontSize: 12, color: "var(--terre-deep)", letterSpacing: 1, fontWeight: 600, textTransform: "uppercase", marginBottom: 3 }}>
                  {detectedMetier ? `${detectedMetier[0].toUpperCase() + detectedMetier.slice(1)}s recommandés` : "Artisans recommandés"}
                </div>
                <div style={{ fontFamily: "'Fraunces',serif", fontSize: 18, fontWeight: 500, color: "var(--bois)", letterSpacing: -.3 }}>
                  « {summarizeProjet(projet, 90)} »
                </div>
              </div>
              <div style={{ fontSize: 13, color: "var(--bois-mid)", fontWeight: 500 }}>
                Sélectionnez les artisans à contacter →
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Grid heading (mode chercher uniquement) */}
      {mode === "chercher" && (
        <div style={{ background: "var(--blanc)", padding: "28px 32px 0", borderTop: "1px solid var(--g100)" }}>
          <div style={{ maxWidth: 1360, margin: "0 auto", display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 20, flexWrap: "wrap" }}>
            <motion.h2 {...fadeUp(0)} style={{ fontFamily: "'Fraunces',serif", fontSize: "clamp(22px,2.8vw,30px)", fontWeight: 600, color: "var(--bois)", letterSpacing: -.5, lineHeight: 1.1 }}>
              Artisans{" "}
              <span style={{ fontStyle: "italic", fontWeight: 400, color: "var(--terre)" }}>
                {villeLabel ? `à ${villeLabel}` : "à proximité"}
              </span>
            </motion.h2>
            <motion.div {...fadeUp(0.08)} style={{ fontSize: 13, color: "var(--pierre)", display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--mousse)" }} />
              Triés par proximité · Mis à jour aujourd&apos;hui
            </motion.div>
          </div>
        </div>
      )}

      <AnnuaireBlock
        search={mode === "chercher" ? search : ""}
        villeFilter={villeFilter}
        villeLabel={villeLabel}
        villeCoords={villeCoords}
        columns={3}
        metierForce={mode === "decrire" && projetSubmitted ? detectedMetier : null}
        selectionMode={mode === "decrire" && projetSubmitted}
        selectedIds={selectedIds}
        onToggleSelect={toggleSelect}
      />

      {/* Barre sticky bottom de sélection */}
      <AnimatePresence>
        {mode === "decrire" && projetSubmitted && selectionCount > 0 && !demandeSent && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
            style={{ position: "fixed", bottom: 20, left: "50%", transform: "translateX(-50%)", zIndex: 1000, background: "var(--bois)", color: "#fff", borderRadius: 999, padding: "10px 14px 10px 20px", display: "flex", alignItems: "center", gap: 14, boxShadow: "0 20px 60px rgba(0,0,0,.25)", maxWidth: "calc(100vw - 32px)" }}
          >
            <div style={{ fontSize: 14, fontWeight: 500 }}>
              <span style={{ color: "var(--or)", fontWeight: 700, fontFamily: "'Fraunces',serif", fontSize: 18 }}>{selectionCount}</span>
              {" "}artisan{selectionCount > 1 ? "s" : ""} sélectionné{selectionCount > 1 ? "s" : ""}
            </div>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={sendDemande}
              style={{ background: "var(--terre)", color: "#fff", padding: "10px 22px", borderRadius: 999, fontSize: 14, fontWeight: 600, border: "none", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 8, fontFamily: "inherit" }}
            >
              Envoyer ma demande
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M5 12h14M13 5l7 7-7 7" /></svg>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast confirmation envoi */}
      <AnimatePresence>
        {demandeSent && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            style={{ position: "fixed", top: 100, left: "50%", transform: "translateX(-50%)", zIndex: 1001, background: "var(--mousse)", color: "#fff", borderRadius: 16, padding: "20px 28px", display: "flex", alignItems: "center", gap: 14, boxShadow: "0 20px 60px rgba(74,103,65,.35)", maxWidth: "calc(100vw - 32px)" }}
          >
            <div style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(255,255,255,.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg width="22" height="22" fill="none" stroke="#fff" strokeWidth="3" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" /></svg>
            </div>
            <div>
              <div style={{ fontFamily: "'Fraunces',serif", fontSize: 17, fontWeight: 600, letterSpacing: -.3 }}>Demande envoyée !</div>
              <div style={{ fontSize: 13, opacity: .9, marginTop: 2 }}>Les {selectionCount} artisans vous répondront sous 24h.</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── CTA ARTISAN ─── */}
      <section className="cinema-light" style={{ padding: "72px 32px", textAlign: "center", position: "relative", borderTop: "1px solid rgba(61,46,31,.06)" }}>
        <div className="cinema-blob-light cinema-blob-light-2" style={{ opacity: .22 }} />
        <div style={{ maxWidth: 720, margin: "0 auto", position: "relative", zIndex: 10 }}>
          <motion.div {...fadeUp(0)} className="liquid-glass" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 14px", borderRadius: 999, marginBottom: 20, fontSize: 12, fontWeight: 500, color: "var(--terre-deep)", letterSpacing: 0.3 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--terre)" }} />
            Pour les artisans
          </motion.div>
          <motion.h2 {...fadeUp(0.06)} style={{ fontFamily: "'Fraunces',serif", fontSize: "clamp(30px,4vw,44px)", fontWeight: 500, color: "var(--bois)", letterSpacing: -1, lineHeight: 1.05, marginBottom: 14 }}>
            Développez votre activité,{" "}
            <span style={{ fontStyle: "italic", fontWeight: 400, color: "var(--terre)" }}>sans commission</span>.
          </motion.h2>
          <motion.p {...fadeUp(0.12)} style={{ fontSize: 16, color: "var(--bois-mid)", lineHeight: 1.55, marginBottom: 24, maxWidth: 540, margin: "0 auto 24px" }}>
            Votre vitrine pro, facturation électronique, devis IA. Tout ce qu&apos;il faut pour être trouvé et facturer, dans un seul endroit.
          </motion.p>
          <motion.div {...fadeUp(0.18)} style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/inscription" style={{ background: "var(--terre)", color: "#fff", padding: "14px 28px", borderRadius: 12, fontSize: 15, fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 8, boxShadow: "0 8px 24px rgba(196,83,26,.22)" }}>
              Créer mon compte gratuit
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M5 12h14M13 5l7 7-7 7" /></svg>
            </Link>
            <Link href="/tarifs" className="liquid-glass" style={{ color: "var(--bois)", padding: "14px 28px", borderRadius: 12, fontSize: 15, fontWeight: 500 }}>
              Voir les tarifs
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </>
  );
}
