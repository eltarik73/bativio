"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";

interface Envoi {
  id: string;
  sentAt: string;
  seenAt: string | null;
  respondedAt: string | null;
  demande: {
    id: string;
    description: string;
    villeLabel: string | null;
    metierDetecte: string | null;
    qualifJson: Record<string, string> | null;
    qualifScore: number | null;
    preDevisJson: { fourchetteHt?: { min: number; max: number }; explication?: string } | null;
    contactNom: string | null;
    contactEmail: string | null;
    contactTel: string | null;
    photos: string[] | null;
    statut: string;
    createdAt: string;
    devis: { id: string; numero: string; statut: string; totalTTC: number }[];
  };
}

interface DevisLigne {
  label: string;
  description?: string;
  qte: number;
  unite: string;
  puHt: number;
  totalHt: number;
  tva: number;
  source: string;
  fallback_marche?: boolean;
}

interface DevisPreview {
  numero?: string;
  objet?: string;
  lignes?: DevisLigne[];
  totalHt?: number;
  totalTva?: number;
  totalTtc?: number;
  dureeEstimee?: string;
  conditionsPaiement?: string;
  notes?: string;
}

export default function DemandesProjetsArtisanPage() {
  const { fetchWithAuth, user } = useAuth();
  const userPlan = ((user as { plan?: string } | null)?.plan || "GRATUIT").toUpperCase();
  const canGenerate = userPlan === "BUSINESS" || userPlan === "PRO_PLUS";
  const [envois, setEnvois] = useState<Envoi[]>([]);
  const [loading, setLoading] = useState(true);
  const [generatingId, setGeneratingId] = useState<string | null>(null);
  const [devisPreview, setDevisPreview] = useState<{ demandeId: string; devisId: string; preview: DevisPreview; cost: number } | null>(null);
  const [clarifs, setClarifs] = useState<{ demandeId: string; questions: string[] } | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const r = await fetchWithAuth("/artisans/me/demandes-projets");
      const d = r as { envois: Envoi[] };
      setEnvois(d.envois || []);
    } catch { setEnvois([]); }
    finally { setLoading(false); }
  }, [fetchWithAuth]);

  useEffect(() => { load(); }, [load]);

  const generer = async (demandeId: string) => {
    setGeneratingId(demandeId);
    setDevisPreview(null);
    setClarifs(null);
    try {
      const r = await fetchWithAuth(`/artisans/me/demandes-projets/${demandeId}/generer-devis`, { method: "POST" }) as {
        status: string;
        clarifications?: string[];
        devis?: { id: string };
        preview?: DevisPreview;
        _meta?: { cost: number };
      };
      if (r.status === "need_clarif") {
        setClarifs({ demandeId, questions: r.clarifications || [] });
      } else if (r.status === "ok" && r.devis && r.preview) {
        setDevisPreview({
          demandeId,
          devisId: r.devis.id,
          preview: r.preview,
          cost: r._meta?.cost ?? 0,
        });
        await load();
      }
    } catch (e) {
      console.error(e);
      alert("Erreur technique. Vérifie que ta grille tarifaire est renseignée.");
    } finally {
      setGeneratingId(null);
    }
  };

  const formatDate = (iso: string) => new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: "24px 0 60px" }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: "'Fraunces',serif", fontSize: 28, fontWeight: 600, color: "#3D2E1F", letterSpacing: -0.5 }}>
          Demandes <span style={{ fontStyle: "italic", fontWeight: 400, color: "#C4531A" }}>projets reçues</span>
        </h1>
        <p style={{ fontSize: 14, color: "#6B6560", marginTop: 6 }}>Qualifications IA routées par l&apos;équipe Bativio. Génère un devis en 1 clic à partir de ta grille.</p>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: 60, color: "#9C958D" }}>Chargement...</div>
      ) : envois.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 24px", background: "#fff", borderRadius: 14, border: "1px solid #E8D5C0" }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>📬</div>
          <p style={{ fontSize: 16, fontWeight: 600, color: "#3D2E1F", marginBottom: 6 }}>Aucune demande pour l&apos;instant</p>
          <p style={{ fontSize: 13, color: "#9C958D", maxWidth: 400, margin: "0 auto" }}>
            Les demandes clients qualifiées par l&apos;IA et routées par l&apos;équipe Bativio apparaîtront ici. Remplis ta grille tarifaire pour être prêt.
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {envois.map((e) => {
            const d = e.demande;
            const hasDevis = d.devis.length > 0;
            return (
              <div key={e.id} style={{ background: "#fff", borderRadius: 16, border: "1px solid #E8D5C0", padding: 20 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10, flexWrap: "wrap" }}>
                  {d.metierDetecte && (
                    <span style={{ padding: "4px 10px", borderRadius: 999, background: "rgba(196,83,26,.08)", color: "#C4531A", fontSize: 11, fontWeight: 600, textTransform: "capitalize" }}>{d.metierDetecte}</span>
                  )}
                  {d.villeLabel && <span style={{ fontSize: 12, color: "#9C958D" }}>📍 {d.villeLabel}</span>}
                  {d.qualifScore && d.qualifScore >= 80 && <span style={{ fontSize: 11, color: "#4A6741", fontWeight: 600 }}>● Bien qualifié</span>}
                  {e.respondedAt && <span style={{ fontSize: 11, color: "#4A6741", fontWeight: 600 }}>✓ Devis envoyé</span>}
                  <span style={{ fontSize: 11, color: "#9C958D", marginLeft: "auto" }}>Reçue {formatDate(e.sentAt)}</span>
                </div>

                <div style={{ fontFamily: "'Fraunces',serif", fontSize: 16, color: "#3D2E1F", fontWeight: 500, marginBottom: 10, lineHeight: 1.4 }}>
                  « {d.description} »
                </div>

                {d.qualifJson && (
                  <div style={{ background: "#FAF8F5", borderRadius: 10, padding: 12, marginBottom: 12, border: "1px solid #F2EAE0" }}>
                    <div style={{ fontSize: 11, color: "#9C958D", fontWeight: 600, textTransform: "uppercase", letterSpacing: .5, marginBottom: 8 }}>Qualif IA</div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 8, fontSize: 12 }}>
                      {Object.entries(d.qualifJson).map(([k, v]) => (
                        <div key={k}>
                          <span style={{ color: "#9C958D", textTransform: "capitalize" }}>{k} : </span>
                          <span style={{ color: "#3D2E1F", fontWeight: 500 }}>{String(v)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {d.preDevisJson?.fourchetteHt && (
                  <div style={{ fontSize: 13, color: "#6B6560", marginBottom: 12 }}>
                    <span style={{ color: "#9C958D" }}>Estimation marché :</span>{" "}
                    <span style={{ fontWeight: 700, color: "#C4531A" }}>
                      {d.preDevisJson.fourchetteHt.min.toLocaleString("fr-FR")}–{d.preDevisJson.fourchetteHt.max.toLocaleString("fr-FR")} € HT
                    </span>
                  </div>
                )}

                {d.photos && d.photos.length > 0 && (
                  <div style={{ marginBottom: 12 }}>
                    <div style={{ fontSize: 11, color: "#9C958D", fontWeight: 600, textTransform: "uppercase", letterSpacing: .5, marginBottom: 6 }}>
                      📸 Photos du projet ({d.photos.length})
                    </div>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      {d.photos.map((url, i) => (
                        <a key={i} href={url} target="_blank" rel="noopener noreferrer" style={{ width: 80, height: 80, borderRadius: 8, overflow: "hidden", border: "1px solid #E8D5C0", display: "block" }}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={url} alt={`Photo ${i + 1}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                <div style={{ display: "flex", alignItems: "center", gap: 14, paddingTop: 10, borderTop: "1px solid #F2EAE0", flexWrap: "wrap" }}>
                  <div style={{ fontSize: 13, color: "#3D2E1F", flex: 1, display: "flex", gap: 16, flexWrap: "wrap" }}>
                    <span style={{ fontWeight: 600 }}>{d.contactNom}</span>
                    {d.contactTel && <a href={`tel:${d.contactTel.replace(/[^\d+]/g, "")}`} style={{ color: "#C4531A", textDecoration: "none", fontWeight: 500 }}>{d.contactTel}</a>}
                    {d.contactEmail && <a href={`mailto:${d.contactEmail}`} style={{ color: "#C4531A", textDecoration: "none", fontWeight: 500 }}>{d.contactEmail}</a>}
                  </div>
                  {hasDevis ? (
                    <div style={{ fontSize: 12, color: "#4A6741", fontWeight: 600 }}>
                      Devis {d.devis[0].numero} créé ({d.devis[0].totalTTC.toLocaleString("fr-FR")} € TTC)
                    </div>
                  ) : canGenerate ? (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => generer(d.id)}
                      disabled={generatingId === d.id}
                      style={{
                        padding: "10px 18px",
                        borderRadius: 10,
                        background: "linear-gradient(135deg, #C4531A, #C9943A)",
                        color: "#fff",
                        fontSize: 13,
                        fontWeight: 600,
                        border: "none",
                        cursor: generatingId === d.id ? "not-allowed" : "pointer",
                        opacity: generatingId === d.id ? 0.6 : 1,
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 8,
                        boxShadow: "0 6px 20px rgba(196,83,26,.2)",
                      }}
                    >
                      {generatingId === d.id ? "Génération IA…" : "Générer le devis IA"}
                    </motion.button>
                  ) : (
                    <a
                      href="/dashboard/abonnement"
                      style={{
                        padding: "10px 18px",
                        borderRadius: 10,
                        background: "#FAF8F5",
                        color: "#6B6560",
                        fontSize: 13,
                        fontWeight: 600,
                        border: "1px dashed #E8D5C0",
                        textDecoration: "none",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 8,
                      }}
                    >
                      Devis IA réservé Business · upgrader
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL CLARIFS */}
      <AnimatePresence>
        {clarifs && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setClarifs(null)}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.4)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
          >
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              style={{ background: "#fff", borderRadius: 16, padding: 28, maxWidth: 520, width: "100%" }}
            >
              <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 20, fontWeight: 600, color: "#3D2E1F", marginBottom: 8 }}>
                L&apos;IA a besoin de <span style={{ fontStyle: "italic", color: "#C4531A" }}>plus d&apos;infos</span>
              </h2>
              <p style={{ fontSize: 13, color: "#6B6560", marginBottom: 16 }}>Contacte le client pour préciser ces points, puis génère à nouveau le devis.</p>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
                {clarifs.questions.map((q, i) => (
                  <li key={i} style={{ background: "#FAF8F5", borderRadius: 10, padding: 12, fontSize: 14, color: "#3D2E1F", border: "1px solid #F2EAE0", display: "flex", gap: 10 }}>
                    <span style={{ color: "#C4531A", fontWeight: 700, flexShrink: 0 }}>{i + 1}.</span>
                    {q}
                  </li>
                ))}
              </ul>
              <button onClick={() => setClarifs(null)} style={{ marginTop: 20, padding: "10px 20px", borderRadius: 10, background: "#3D2E1F", color: "#fff", fontSize: 13, fontWeight: 600, border: "none", cursor: "pointer", width: "100%" }}>
                Compris, je contacte le client
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODAL DEVIS PREVIEW */}
      <AnimatePresence>
        {devisPreview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setDevisPreview(null)}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.5)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
          >
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              style={{ background: "#fff", borderRadius: 20, padding: 28, maxWidth: 680, width: "100%", maxHeight: "90vh", overflow: "auto" }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <span style={{ padding: "4px 10px", borderRadius: 999, background: "#4A6741", color: "#fff", fontSize: 11, fontWeight: 600 }}>✓ Devis généré</span>
                <span style={{ fontFamily: "monospace", fontSize: 12, color: "#9C958D" }}>{devisPreview.preview.numero}</span>
              </div>
              <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 22, fontWeight: 600, color: "#3D2E1F", marginBottom: 16 }}>
                {devisPreview.preview.objet || "Devis"}
              </h2>

              <div style={{ background: "#FAF8F5", borderRadius: 12, overflow: "hidden", marginBottom: 16 }}>
                <div style={{ padding: "10px 14px", background: "#F2EAE0", fontSize: 11, fontWeight: 600, color: "#5C4A3A", textTransform: "uppercase", letterSpacing: .5 }}>
                  Lignes de devis
                </div>
                {devisPreview.preview.lignes?.map((l, i) => (
                  <div key={i} style={{ padding: "12px 14px", borderBottom: "1px solid #F2EAE0", fontSize: 13 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                      <span style={{ flex: 1, color: "#3D2E1F", fontWeight: 500 }}>{l.label}</span>
                      {l.fallback_marche && (
                        <span style={{ padding: "2px 8px", borderRadius: 999, background: "rgba(201,148,58,.15)", color: "#C9943A", fontSize: 10, fontWeight: 600 }} title="Tarif marché utilisé (pas dans ta grille)">⚠ Marché</span>
                      )}
                      <span style={{ color: "#9C958D", fontSize: 12 }}>{l.qte} × {l.puHt}€</span>
                      <span style={{ fontWeight: 700, color: "#3D2E1F", minWidth: 80, textAlign: "right" }}>{l.totalHt.toLocaleString("fr-FR")} € HT</span>
                    </div>
                    {l.description && <div style={{ fontSize: 12, color: "#9C958D" }}>{l.description}</div>}
                  </div>
                ))}
              </div>

              <div style={{ background: "linear-gradient(135deg, rgba(196,83,26,.04), rgba(201,148,58,.03))", borderRadius: 12, padding: 16, marginBottom: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 4 }}>
                  <span style={{ color: "#6B6560" }}>Total HT</span>
                  <span style={{ fontWeight: 600, color: "#3D2E1F" }}>{devisPreview.preview.totalHt?.toLocaleString("fr-FR")} €</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 8 }}>
                  <span style={{ color: "#6B6560" }}>TVA</span>
                  <span style={{ fontWeight: 600, color: "#3D2E1F" }}>{devisPreview.preview.totalTva?.toLocaleString("fr-FR")} €</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 16, paddingTop: 8, borderTop: "1px solid rgba(196,83,26,.15)" }}>
                  <span style={{ fontWeight: 700, color: "#3D2E1F" }}>Total TTC</span>
                  <span style={{ fontWeight: 700, fontFamily: "'Fraunces',serif", fontSize: 20, color: "#C4531A" }}>{devisPreview.preview.totalTtc?.toLocaleString("fr-FR")} €</span>
                </div>
              </div>

              {devisPreview.preview.notes && (
                <div style={{ fontSize: 12, color: "#6B6560", marginBottom: 16, padding: 10, background: "#FAF8F5", borderRadius: 8, borderLeft: "3px solid #C9943A" }}>
                  💬 {devisPreview.preview.notes}
                </div>
              )}

              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={() => setDevisPreview(null)} style={{ flex: 1, padding: "12px 20px", borderRadius: 10, background: "#F7F5F2", color: "#5C4A3A", fontSize: 14, fontWeight: 600, border: "none", cursor: "pointer" }}>
                  Fermer
                </button>
                <a href={`/dashboard/devis-ia/${devisPreview.devisId}`} style={{ flex: 1, padding: "12px 20px", borderRadius: 10, background: "#C4531A", color: "#fff", fontSize: 14, fontWeight: 600, border: "none", cursor: "pointer", textAlign: "center", textDecoration: "none" }}>
                  Modifier & envoyer
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
