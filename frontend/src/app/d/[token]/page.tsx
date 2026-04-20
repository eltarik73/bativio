"use client";

import { useState, useEffect, use } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface DevisView {
  numero: string;
  objet: string;
  clientNom: string;
  totalHT: number;
  montantTVA: number;
  totalTTC: number;
  dureeEstimee: string | null;
  conditionsPaiement: string | null;
  notes: string | null;
  validiteJours: number;
  statut: string;
  pdfUrl: string | null;
  createdAt: string;
  envoyeAt: string | null;
  accepteAt: string | null;
  refuseAt: string | null;
  postes: Array<{ label: string; description?: string; qte: number; unite: string; puHt: number; totalHt: number; tva: number }>;
  artisan: { nomAffichage: string; slug: string; telephone: string; logo: string | null; ville: string | null; colorPrimary: string };
}

export default function DevisPublicPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = use(params);
  const [devis, setDevis] = useState<DevisView | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSign, setShowSign] = useState(false);
  const [showRefuse, setShowRefuse] = useState(false);
  const [signatureNom, setSignatureNom] = useState("");
  const [refusRaison, setRefusRaison] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState<"accept" | "refuse" | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`/api/v1/public/d/${token}`);
        const j = await res.json();
        if (!j.success) throw new Error(j.error);
        setDevis(j.data);
        if (j.data.statut === "ACCEPTE") setDone("accept");
        if (j.data.statut === "REFUSE") setDone("refuse");
      } catch (e) { setError((e as Error).message); }
      finally { setLoading(false); }
    })();
  }, [token]);

  const submitAction = async (action: "accept" | "refuse") => {
    setSubmitting(true);
    try {
      const res = await fetch(`/api/v1/public/d/${token}/accept`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          ...(action === "accept" ? { signatureNom } : { refusRaison }),
        }),
      });
      const j = await res.json();
      if (!j.success) throw new Error(j.error);
      setDone(action);
      setShowSign(false);
      setShowRefuse(false);
    } catch (e) { alert((e as Error).message); }
    finally { setSubmitting(false); }
  };

  if (loading) return <div style={{ padding: 60, textAlign: "center", fontSize: 14, color: "#9C958D" }}>Chargement...</div>;
  if (error || !devis) return <div style={{ padding: 60, textAlign: "center" }}>{error || "Devis introuvable"}</div>;

  const validiteDate = new Date(new Date(devis.createdAt).getTime() + devis.validiteJours * 24 * 60 * 60 * 1000);
  const expire = new Date() > validiteDate;

  return (
    <div style={{ minHeight: "100vh", background: "#FAF8F5" }}>
      <header style={{ background: "#fff", borderBottom: "1px solid #E8D5C0", padding: "20px 32px", display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ fontFamily: "'Fraunces',serif", fontSize: 22, fontWeight: 700, color: "#C4531A" }}>Bativio</div>
        <div style={{ flex: 1 }} />
        <div style={{ fontSize: 12, color: "#9C958D" }}>Réf. {devis.numero}</div>
      </header>

      <main style={{ maxWidth: 900, margin: "0 auto", padding: "32px 20px 60px" }}>
        {/* STATUT BANNER */}
        {done === "accept" && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ background: "#4A6741", color: "#fff", padding: "20px 24px", borderRadius: 14, marginBottom: 24, display: "flex", alignItems: "center", gap: 16 }}
          >
            <div style={{ width: 48, height: 48, borderRadius: "50%", background: "rgba(255,255,255,.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="24" height="24" fill="none" stroke="#fff" strokeWidth="3" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" /></svg>
            </div>
            <div>
              <div style={{ fontFamily: "'Fraunces',serif", fontSize: 18, fontWeight: 600 }}>Devis accepté</div>
              <div style={{ fontSize: 13, opacity: .9, marginTop: 2 }}>{devis.artisan.nomAffichage} va vous contacter pour planifier le chantier.</div>
            </div>
          </motion.div>
        )}
        {done === "refuse" && (
          <div style={{ background: "#9C958D", color: "#fff", padding: "20px 24px", borderRadius: 14, marginBottom: 24 }}>
            Devis refusé. Merci d&apos;avoir utilisé Bativio.
          </div>
        )}
        {expire && !done && (
          <div style={{ background: "rgba(201,148,58,.12)", color: "#C9943A", padding: "14px 18px", borderRadius: 12, marginBottom: 20, fontSize: 13, fontWeight: 500 }}>
            ⚠️ Ce devis est expiré depuis le {validiteDate.toLocaleDateString("fr-FR")}. Contactez l&apos;artisan pour un nouveau devis.
          </div>
        )}

        {/* HEADER DEVIS */}
        <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #E8D5C0", padding: 32, marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 16 }}>
            <div>
              <div style={{ fontSize: 11, letterSpacing: 2, color: "#9C958D", textTransform: "uppercase", fontWeight: 600, marginBottom: 6 }}>Devis</div>
              <h1 style={{ fontFamily: "'Fraunces',serif", fontSize: 30, fontWeight: 600, color: "#3D2E1F", letterSpacing: -0.5, marginBottom: 8 }}>{devis.numero}</h1>
              <div style={{ fontSize: 14, color: "#6B6560" }}>{devis.objet}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 11, color: "#9C958D", textTransform: "uppercase", letterSpacing: .5 }}>Total TTC</div>
              <div style={{ fontFamily: "'Fraunces',serif", fontSize: 36, fontWeight: 600, color: "#C4531A", letterSpacing: -1 }}>
                {devis.totalTTC.toLocaleString("fr-FR")} <span style={{ fontSize: 18, color: "#9C958D" }}>€</span>
              </div>
              <div style={{ fontSize: 11, color: "#9C958D", marginTop: 2 }}>
                Valide jusqu&apos;au {validiteDate.toLocaleDateString("fr-FR")}
              </div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, paddingTop: 20, borderTop: "1px solid #F2EAE0" }} className="max-md:!grid-cols-1">
            <div>
              <div style={{ fontSize: 10, letterSpacing: 1.5, color: "#9C958D", textTransform: "uppercase", fontWeight: 600, marginBottom: 8 }}>Émis par</div>
              <div style={{ fontSize: 15, fontWeight: 600, color: "#3D2E1F" }}>{devis.artisan.nomAffichage}</div>
              {devis.artisan.ville && <div style={{ fontSize: 13, color: "#6B6560" }}>{devis.artisan.ville}</div>}
              {devis.artisan.telephone && <a href={`tel:${devis.artisan.telephone}`} style={{ fontSize: 13, color: "#C4531A" }}>📞 {devis.artisan.telephone}</a>}
            </div>
            <div>
              <div style={{ fontSize: 10, letterSpacing: 1.5, color: "#9C958D", textTransform: "uppercase", fontWeight: 600, marginBottom: 8 }}>À l&apos;attention de</div>
              <div style={{ fontSize: 15, fontWeight: 600, color: "#3D2E1F" }}>{devis.clientNom}</div>
            </div>
          </div>
        </div>

        {/* LIGNES */}
        <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #E8D5C0", padding: 0, marginBottom: 20, overflow: "hidden" }}>
          <div style={{ background: "#3D2E1F", color: "#fff", padding: "14px 24px", display: "grid", gridTemplateColumns: "1fr 60px 80px 100px", gap: 16, fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: .5 }} className="max-md:!grid-cols-[1fr_60px_90px]">
            <div>Désignation</div>
            <div style={{ textAlign: "center" }}>Qté</div>
            <div style={{ textAlign: "right" }} className="max-md:!hidden">PU HT</div>
            <div style={{ textAlign: "right" }}>Total HT</div>
          </div>
          {devis.postes.map((p, i) => (
            <div key={i} style={{ padding: "14px 24px", borderBottom: "1px solid #F2EAE0", display: "grid", gridTemplateColumns: "1fr 60px 80px 100px", gap: 16, alignItems: "center", fontSize: 14 }} className="max-md:!grid-cols-[1fr_60px_90px]">
              <div>
                <div style={{ color: "#3D2E1F", fontWeight: 500 }}>{p.label}</div>
                {p.description && <div style={{ fontSize: 12, color: "#9C958D", marginTop: 2 }}>{p.description}</div>}
              </div>
              <div style={{ color: "#6B6560", fontSize: 13, textAlign: "center" }}>{p.qte} {p.unite}</div>
              <div style={{ color: "#6B6560", textAlign: "right" }} className="max-md:!hidden">{p.puHt.toLocaleString("fr-FR")} €</div>
              <div style={{ fontWeight: 700, color: "#3D2E1F", textAlign: "right" }}>{p.totalHt.toLocaleString("fr-FR")} €</div>
            </div>
          ))}
          <div style={{ padding: 24, background: "#FAF8F5" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 6 }}>
              <span style={{ color: "#6B6560" }}>Total HT</span>
              <span style={{ fontWeight: 600, color: "#3D2E1F" }}>{devis.totalHT.toLocaleString("fr-FR")} €</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 10 }}>
              <span style={{ color: "#6B6560" }}>TVA</span>
              <span style={{ fontWeight: 600, color: "#3D2E1F" }}>{devis.montantTVA.toLocaleString("fr-FR")} €</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 10, borderTop: "1px solid #E8D5C0" }}>
              <span style={{ fontWeight: 700, color: "#3D2E1F", fontSize: 16 }}>Total TTC</span>
              <span style={{ fontWeight: 700, fontFamily: "'Fraunces',serif", fontSize: 22, color: "#C4531A" }}>{devis.totalTTC.toLocaleString("fr-FR")} €</span>
            </div>
          </div>
        </div>

        {/* CONDITIONS */}
        {(devis.dureeEstimee || devis.conditionsPaiement || devis.notes) && (
          <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #E8D5C0", padding: 24, marginBottom: 20 }}>
            <h3 style={{ fontFamily: "'Fraunces',serif", fontSize: 16, fontWeight: 600, color: "#3D2E1F", marginBottom: 14 }}>Conditions</h3>
            {devis.dureeEstimee && <div style={{ fontSize: 13, color: "#3D2E1F", marginBottom: 6 }}><strong>Durée :</strong> {devis.dureeEstimee}</div>}
            {devis.conditionsPaiement && <div style={{ fontSize: 13, color: "#3D2E1F", marginBottom: 6 }}><strong>Paiement :</strong> {devis.conditionsPaiement}</div>}
            {devis.notes && <div style={{ fontSize: 13, color: "#6B6560", marginTop: 8, whiteSpace: "pre-wrap", fontStyle: "italic" }}>{devis.notes}</div>}
          </div>
        )}

        {/* ACTIONS */}
        {!done && !expire && (
          <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #E8D5C0", padding: 28 }}>
            <h3 style={{ fontFamily: "'Fraunces',serif", fontSize: 18, fontWeight: 600, color: "#3D2E1F", marginBottom: 8 }}>
              Accepter ou <span style={{ fontStyle: "italic", color: "#C4531A" }}>refuser</span> ce devis
            </h3>
            <p style={{ fontSize: 13, color: "#6B6560", marginBottom: 18 }}>
              En acceptant, vous vous engagez à faire réaliser les travaux par {devis.artisan.nomAffichage} au prix indiqué.
            </p>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setShowSign(true)}
                style={{ padding: "14px 28px", borderRadius: 12, background: "#4A6741", color: "#fff", fontSize: 15, fontWeight: 600, border: "none", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 8, boxShadow: "0 10px 30px rgba(74,103,65,.22)" }}
              >
                ✓ Accepter ce devis
              </motion.button>
              {devis.pdfUrl && (
                <a href={devis.pdfUrl} target="_blank" rel="noopener noreferrer" style={{ padding: "14px 24px", borderRadius: 12, background: "#FAF8F5", color: "#3D2E1F", fontSize: 14, fontWeight: 500, border: "1px solid #E8D5C0", display: "inline-flex", alignItems: "center", gap: 8 }}>
                  📄 Télécharger le PDF
                </a>
              )}
              <button onClick={() => setShowRefuse(true)} style={{ padding: "14px 24px", borderRadius: 12, background: "transparent", color: "#9C958D", fontSize: 14, fontWeight: 500, border: "none", cursor: "pointer" }}>
                Refuser
              </button>
            </div>
          </div>
        )}

        <div style={{ marginTop: 30, fontSize: 11, color: "#9C958D", textAlign: "center", lineHeight: 1.6 }}>
          Devis généré via Bativio — <a href="https://bativio.fr" style={{ color: "#C4531A" }}>bativio.fr</a><br />
          En cas de retard de paiement : pénalités au taux légal majoré de 10 points + indemnité forfaitaire de 40 €.
        </div>
      </main>

      {/* MODAL SIGNATURE */}
      <AnimatePresence>
        {showSign && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowSign(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.5)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} onClick={(e) => e.stopPropagation()} style={{ background: "#fff", borderRadius: 20, padding: 32, maxWidth: 480, width: "100%" }}>
              <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 22, fontWeight: 600, color: "#3D2E1F", marginBottom: 6 }}>
                Accepter le <span style={{ fontStyle: "italic", color: "#4A6741" }}>devis</span>
              </h2>
              <p style={{ fontSize: 13, color: "#6B6560", marginBottom: 20 }}>
                Indiquez votre nom pour valider. Équivalent d&apos;un &ldquo;bon pour accord&rdquo;.
              </p>
              <input
                value={signatureNom}
                onChange={(e) => setSignatureNom(e.target.value)}
                placeholder="Votre nom et prénom"
                style={{ width: "100%", padding: "12px 14px", borderRadius: 10, border: "1px solid #E8D5C0", fontSize: 14, marginBottom: 18, fontFamily: "inherit" }}
              />
              <p style={{ fontSize: 11, color: "#9C958D", marginBottom: 18, lineHeight: 1.5 }}>
                En cliquant sur &ldquo;Valider l&apos;acceptation&rdquo;, vous acceptez le devis <strong>{devis.numero}</strong> d&apos;un montant de <strong>{devis.totalTTC.toLocaleString("fr-FR")} € TTC</strong>.
              </p>
              <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                <button onClick={() => setShowSign(false)} style={{ padding: "11px 20px", borderRadius: 10, background: "#F7F5F2", color: "#5C4A3A", fontSize: 13, fontWeight: 600, border: "none", cursor: "pointer" }}>Annuler</button>
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={() => submitAction("accept")} disabled={submitting || signatureNom.trim().length < 3} style={{ padding: "11px 20px", borderRadius: 10, background: "#4A6741", color: "#fff", fontSize: 13, fontWeight: 600, border: "none", cursor: submitting || signatureNom.trim().length < 3 ? "not-allowed" : "pointer", opacity: submitting || signatureNom.trim().length < 3 ? 0.6 : 1 }}>
                  {submitting ? "..." : "✓ Valider l'acceptation"}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODAL REFUS */}
      <AnimatePresence>
        {showRefuse && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowRefuse(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.5)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} onClick={(e) => e.stopPropagation()} style={{ background: "#fff", borderRadius: 20, padding: 32, maxWidth: 480, width: "100%" }}>
              <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 20, fontWeight: 600, color: "#3D2E1F", marginBottom: 6 }}>Refuser le devis</h2>
              <p style={{ fontSize: 13, color: "#6B6560", marginBottom: 16 }}>Une raison ? (optionnel, aide l&apos;artisan à progresser)</p>
              <textarea
                value={refusRaison}
                onChange={(e) => setRefusRaison(e.target.value)}
                rows={3}
                placeholder="Ex : prix trop élevé, délai trop long, autre devis choisi..."
                style={{ width: "100%", padding: 12, borderRadius: 10, border: "1px solid #E8D5C0", fontSize: 13, fontFamily: "inherit", resize: "vertical", marginBottom: 18 }}
              />
              <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                <button onClick={() => setShowRefuse(false)} style={{ padding: "11px 20px", borderRadius: 10, background: "#F7F5F2", color: "#5C4A3A", fontSize: 13, fontWeight: 600, border: "none", cursor: "pointer" }}>Annuler</button>
                <button onClick={() => submitAction("refuse")} disabled={submitting} style={{ padding: "11px 20px", borderRadius: 10, background: "#9C958D", color: "#fff", fontSize: 13, fontWeight: 600, border: "none", cursor: "pointer", opacity: submitting ? 0.6 : 1 }}>
                  {submitting ? "..." : "Confirmer le refus"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
