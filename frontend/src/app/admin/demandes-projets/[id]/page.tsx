"use client";

import { useState, useEffect, useCallback, use } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";

interface Artisan {
  id: string;
  nomAffichage: string;
  slug: string;
  ville: string | null;
  telephone?: string;
  plan: string;
  noteMoyenne: number;
  nombreAvis: number;
  metier?: { nom: string; slug: string } | null;
}

interface Envoi {
  id: string;
  artisanId: string;
  sentAt: string;
  respondedAt: string | null;
  artisan: Artisan;
}

interface Demande {
  id: string;
  description: string;
  villeLabel: string | null;
  metierDetecte: string | null;
  qualifJson: Record<string, string> | null;
  qualifScore: number | null;
  preDevisJson: { fourchetteHt?: { min: number; max: number }; explication?: string; facteurs?: string[] } | null;
  contactNom: string | null;
  contactEmail: string | null;
  contactTel: string | null;
  statut: string;
  modeRoutage: string;
  createdAt: string;
  envois: Envoi[];
  devis: { id: string; numero: string; statut: string; totalTTC: number; artisanId: string }[];
}

export default function AdminDemandeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { fetchWithAuth } = useAuth();
  const [demande, setDemande] = useState<Demande | null>(null);
  const [suggestions, setSuggestions] = useState<Artisan[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [routing, setRouting] = useState(false);
  const [success, setSuccess] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const r = await fetchWithAuth(`/admin/demandes-projets/${id}`);
      const d = r as { demande: Demande; suggestions: Artisan[] };
      setDemande(d.demande);
      setSuggestions(d.suggestions || []);
    } catch { setDemande(null); }
    finally { setLoading(false); }
  }, [fetchWithAuth, id]);

  useEffect(() => { load(); }, [load]);

  const toggleSelect = (aid: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(aid)) next.delete(aid);
      else next.add(aid);
      return next;
    });
  };

  const routeManual = async () => {
    if (selectedIds.size === 0) return;
    setRouting(true);
    try {
      await fetchWithAuth(`/admin/demandes-projets/${id}/route`, {
        method: "POST",
        body: JSON.stringify({ mode: "MANUAL", artisanIds: Array.from(selectedIds) }),
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      setSelectedIds(new Set());
      await load();
    } catch { /* noop */ }
    finally { setRouting(false); }
  };

  const routeAuto = async (mode: string) => {
    if (!confirm(`Confirmer le routage automatique (${mode}) ?`)) return;
    setRouting(true);
    try {
      await fetchWithAuth(`/admin/demandes-projets/${id}/route`, {
        method: "POST",
        body: JSON.stringify({ mode }),
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      await load();
    } catch { /* noop */ }
    finally { setRouting(false); }
  };

  if (loading) return <div style={{ textAlign: "center", padding: 60 }}>Chargement...</div>;
  if (!demande) return <div style={{ textAlign: "center", padding: 60 }}>Demande introuvable</div>;

  const qualifEntries: { label: string; value: string }[] = demande.qualifJson
    ? Object.entries(demande.qualifJson).map(([k, v]) => ({ label: k, value: String(v) }))
    : [];

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "24px 0 60px" }}>
      <Link href="/admin/demandes-projets" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, color: "#6B6560", marginBottom: 16 }}>
        ← Toutes les demandes
      </Link>

      {/* HEADER */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8, flexWrap: "wrap" }}>
          <span style={{ padding: "4px 12px", borderRadius: 999, background: demande.statut === "NOUVELLE" ? "rgba(196,83,26,.08)" : "rgba(74,103,65,.08)", color: demande.statut === "NOUVELLE" ? "#C4531A" : "#4A6741", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: .3 }}>
            {demande.statut}
          </span>
          {demande.metierDetecte && (
            <span style={{ padding: "4px 12px", borderRadius: 999, background: "rgba(196,83,26,.08)", color: "#C4531A", fontSize: 11, fontWeight: 600, textTransform: "capitalize" }}>{demande.metierDetecte}</span>
          )}
          {demande.villeLabel && <span style={{ fontSize: 13, color: "#9C958D" }}>📍 {demande.villeLabel}</span>}
          <span style={{ fontSize: 12, color: "#9C958D", marginLeft: "auto" }}>
            Reçue le {new Date(demande.createdAt).toLocaleString("fr-FR", { day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" })}
          </span>
        </div>
        <h1 style={{ fontFamily: "'Fraunces',serif", fontSize: 24, fontWeight: 500, color: "#3D2E1F", lineHeight: 1.3, letterSpacing: -.3 }}>
          « {demande.description} »
        </h1>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 24 }} className="max-md:!grid-cols-1">
        {/* MAIN */}
        <div>
          {/* QUALIF */}
          {qualifEntries.length > 0 && (
            <section style={{ background: "#fff", borderRadius: 14, border: "1px solid #E8D5C0", padding: 20, marginBottom: 16 }}>
              <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 16, fontWeight: 600, color: "#3D2E1F", marginBottom: 14 }}>Qualification IA</h2>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }} className="max-md:!grid-cols-1">
                {qualifEntries.map((e) => (
                  <div key={e.label} style={{ padding: "10px 14px", background: "#FAF8F5", borderRadius: 10, border: "1px solid #F2EAE0" }}>
                    <div style={{ fontSize: 11, color: "#9C958D", textTransform: "uppercase", letterSpacing: .5, fontWeight: 600, marginBottom: 2 }}>{e.label}</div>
                    <div style={{ fontSize: 14, color: "#3D2E1F" }}>{e.value}</div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* PRE-DEVIS */}
          {demande.preDevisJson?.fourchetteHt && (
            <section style={{ background: "linear-gradient(135deg, rgba(196,83,26,.06), rgba(201,148,58,.04))", borderRadius: 14, border: "1px solid rgba(196,83,26,.12)", padding: 20, marginBottom: 16 }}>
              <div style={{ fontSize: 11, letterSpacing: 2, color: "#C4531A", fontWeight: 700, textTransform: "uppercase", marginBottom: 8 }}>Estimation IA (fourchette marché)</div>
              <div style={{ fontFamily: "'Fraunces',serif", fontSize: 34, fontWeight: 600, color: "#3D2E1F", letterSpacing: -1, marginBottom: 6 }}>
                {demande.preDevisJson.fourchetteHt.min.toLocaleString("fr-FR")} – {demande.preDevisJson.fourchetteHt.max.toLocaleString("fr-FR")} <span style={{ fontSize: 16, color: "#9C958D" }}>€ HT</span>
              </div>
              {demande.preDevisJson.explication && <p style={{ fontSize: 13, color: "#5C4A3A", lineHeight: 1.55, marginBottom: 10 }}>{demande.preDevisJson.explication}</p>}
              {demande.preDevisJson.facteurs && (
                <div>
                  <div style={{ fontSize: 11, color: "#9C958D", fontWeight: 600, textTransform: "uppercase", marginBottom: 4 }}>Facteurs variation</div>
                  <ul style={{ listStyle: "none", padding: 0, margin: 0, fontSize: 12, color: "#6B6560" }}>
                    {demande.preDevisJson.facteurs.map((f, i) => (
                      <li key={i} style={{ display: "flex", gap: 6 }}>
                        <span style={{ color: "#C4531A" }}>•</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </section>
          )}

          {/* ENVOIS EXISTANTS */}
          {demande.envois.length > 0 && (
            <section style={{ background: "#fff", borderRadius: 14, border: "1px solid #E8D5C0", padding: 20, marginBottom: 16 }}>
              <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 16, fontWeight: 600, color: "#3D2E1F", marginBottom: 14 }}>
                Artisans contactés <span style={{ color: "#9C958D", fontWeight: 400 }}>({demande.envois.length})</span>
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {demande.envois.map((e) => (
                  <div key={e.id} style={{ padding: "10px 14px", background: "#FAF8F5", borderRadius: 10, border: "1px solid #F2EAE0", display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg, #C4531A, #C9943A)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 600, fontSize: 13, fontFamily: "'Fraunces',serif" }}>
                      {e.artisan.nomAffichage[0]}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: "#3D2E1F" }}>{e.artisan.nomAffichage}</div>
                      <div style={{ fontSize: 12, color: "#9C958D" }}>{e.artisan.ville} · {e.artisan.plan}</div>
                    </div>
                    <div style={{ fontSize: 11, color: e.respondedAt ? "#4A6741" : "#9C958D", fontWeight: 500 }}>
                      {e.respondedAt ? "✓ A répondu" : "En attente"}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* SUGGESTIONS */}
          {suggestions.length > 0 && (
            <section style={{ background: "#fff", borderRadius: 14, border: "1px solid #E8D5C0", padding: 20, marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14, flexWrap: "wrap", gap: 10 }}>
                <div>
                  <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 16, fontWeight: 600, color: "#3D2E1F" }}>
                    Artisans suggérés <span style={{ color: "#9C958D", fontWeight: 400 }}>({suggestions.length})</span>
                  </h2>
                  <p style={{ fontSize: 12, color: "#9C958D", marginTop: 2 }}>Sélectionnez ceux à contacter + cliquez Envoyer.</p>
                </div>
                {selectedIds.size > 0 && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={routeManual}
                    disabled={routing}
                    style={{
                      padding: "10px 18px",
                      borderRadius: 10,
                      background: "#C4531A",
                      color: "#fff",
                      fontSize: 13,
                      fontWeight: 600,
                      border: "none",
                      cursor: routing ? "not-allowed" : "pointer",
                      opacity: routing ? 0.6 : 1,
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    {routing ? "Envoi..." : `Envoyer à ${selectedIds.size} artisan${selectedIds.size > 1 ? "s" : ""}`}
                    {!routing && <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M5 12h14M13 5l7 7-7 7" /></svg>}
                  </motion.button>
                )}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10 }} className="max-md:!grid-cols-1">
                {suggestions.map((a) => {
                  const selected = selectedIds.has(a.id);
                  return (
                    <div
                      key={a.id}
                      onClick={() => toggleSelect(a.id)}
                      style={{
                        padding: 14,
                        background: selected ? "rgba(196,83,26,.06)" : "#FAF8F5",
                        borderRadius: 12,
                        border: `2px solid ${selected ? "#C4531A" : "#F2EAE0"}`,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        transition: "all .2s",
                      }}
                    >
                      <div style={{ width: 24, height: 24, borderRadius: "50%", background: selected ? "#C4531A" : "#fff", border: selected ? "none" : "1px solid #E8D5C0", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        {selected && <svg width="12" height="12" fill="none" stroke="#fff" strokeWidth="3" viewBox="0 0 24 24"><path d="M5 12l5 5L20 7" /></svg>}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 14, fontWeight: 600, color: "#3D2E1F" }}>{a.nomAffichage}</div>
                        <div style={{ fontSize: 12, color: "#9C958D", marginTop: 2 }}>
                          {a.metier?.nom || "–"} · {a.ville || "–"}
                          {a.nombreAvis > 0 && <> · ⭐ {a.noteMoyenne.toFixed(1)} ({a.nombreAvis})</>}
                        </div>
                      </div>
                      <span style={{ padding: "3px 8px", borderRadius: 6, background: a.plan === "BUSINESS" ? "#3D2E1F" : a.plan === "PRO" || a.plan === "PRO_PLUS" ? "#C4531A" : "#F2EAE0", color: a.plan === "GRATUIT" || a.plan === "STARTER" ? "#5C4A3A" : "#fff", fontSize: 10, fontWeight: 600, textTransform: "uppercase" }}>
                        {a.plan}
                      </span>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* ACTIONS AUTO */}
          <section style={{ background: "#fff", borderRadius: 14, border: "1px solid #E8D5C0", padding: 20 }}>
            <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 16, fontWeight: 600, color: "#3D2E1F", marginBottom: 6 }}>Actions automatiques</h2>
            <p style={{ fontSize: 12, color: "#9C958D", marginBottom: 12 }}>Envoyer en un clic à plusieurs artisans selon des critères.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <button onClick={() => routeAuto("AUTO_CONCERNES")} disabled={routing} style={{ padding: "10px 14px", borderRadius: 10, background: "#FAF8F5", color: "#3D2E1F", fontSize: 13, fontWeight: 500, border: "1px solid #E8D5C0", cursor: "pointer", textAlign: "left" }}>
                ⚡ Artisans concernés (métier + ville) — tous plans
              </button>
              <button onClick={() => routeAuto("AUTO_PRO")} disabled={routing} style={{ padding: "10px 14px", borderRadius: 10, background: "#FAF8F5", color: "#3D2E1F", fontSize: 13, fontWeight: 500, border: "1px solid #E8D5C0", cursor: "pointer", textAlign: "left" }}>
                ⚡ Artisans PRO/BUSINESS uniquement (métier + ville)
              </button>
              <button onClick={() => routeAuto("AUTO_BUSINESS")} disabled={routing} style={{ padding: "10px 14px", borderRadius: 10, background: "#FAF8F5", color: "#3D2E1F", fontSize: 13, fontWeight: 500, border: "1px solid #E8D5C0", cursor: "pointer", textAlign: "left" }}>
                ⚡ Artisans BUSINESS uniquement (métier + ville)
              </button>
              <button onClick={() => routeAuto("AUTO_TOUS")} disabled={routing} style={{ padding: "10px 14px", borderRadius: 10, background: "#FAF8F5", color: "#3D2E1F", fontSize: 13, fontWeight: 500, border: "1px solid #E8D5C0", cursor: "pointer", textAlign: "left" }}>
                ⚡ Tous les artisans du métier (peu importe la ville)
              </button>
            </div>
          </section>
        </div>

        {/* SIDEBAR CLIENT */}
        <div>
          <section style={{ background: "#fff", borderRadius: 14, border: "1px solid #E8D5C0", padding: 20, marginBottom: 16 }}>
            <h3 style={{ fontFamily: "'Fraunces',serif", fontSize: 15, fontWeight: 600, color: "#3D2E1F", marginBottom: 12 }}>Client</h3>
            <div style={{ fontSize: 14, color: "#3D2E1F", marginBottom: 4, fontWeight: 500 }}>{demande.contactNom || "—"}</div>
            {demande.contactEmail && (
              <a href={`mailto:${demande.contactEmail}`} style={{ fontSize: 13, color: "#C4531A", display: "block", marginBottom: 2 }}>
                ✉️ {demande.contactEmail}
              </a>
            )}
            {demande.contactTel && (
              <a href={`tel:${demande.contactTel}`} style={{ fontSize: 13, color: "#C4531A" }}>
                📞 {demande.contactTel}
              </a>
            )}
          </section>

          <section style={{ background: "#fff", borderRadius: 14, border: "1px solid #E8D5C0", padding: 20 }}>
            <h3 style={{ fontFamily: "'Fraunces',serif", fontSize: 15, fontWeight: 600, color: "#3D2E1F", marginBottom: 12 }}>Méta</h3>
            <div style={{ fontSize: 12, color: "#6B6560", display: "flex", flexDirection: "column", gap: 6 }}>
              <div><span style={{ color: "#9C958D" }}>Score qualif :</span> <span style={{ fontWeight: 600, color: "#3D2E1F" }}>{demande.qualifScore ?? "—"}/100</span></div>
              <div><span style={{ color: "#9C958D" }}>Mode routage :</span> <span style={{ fontWeight: 600, color: "#3D2E1F" }}>{demande.modeRoutage}</span></div>
              <div><span style={{ color: "#9C958D" }}>Envois :</span> <span style={{ fontWeight: 600, color: "#3D2E1F" }}>{demande.envois.length}</span></div>
              <div><span style={{ color: "#9C958D" }}>Devis générés :</span> <span style={{ fontWeight: 600, color: "#4A6741" }}>{demande.devis.length}</span></div>
            </div>
          </section>
        </div>
      </div>

      {success && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          style={{ position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)", background: "#4A6741", color: "#fff", padding: "14px 24px", borderRadius: 12, fontSize: 14, fontWeight: 500, boxShadow: "0 20px 60px rgba(74,103,65,.35)", zIndex: 100 }}
        >
          ✓ Artisans notifiés, statut passé à « Routée ».
        </motion.div>
      )}
    </div>
  );
}
