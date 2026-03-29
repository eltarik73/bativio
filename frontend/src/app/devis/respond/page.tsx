"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const API_URL = "/api/v1";

function RespondContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const action = searchParams.get("action");

  const [info, setInfo] = useState<{ artisanName: string; description: string; statut: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [result, setResult] = useState("");
  const [raison, setRaison] = useState("");

  useEffect(() => {
    if (!token) { setLoading(false); return; }
    (async () => {
      try {
        const res = await fetch(`${API_URL}/public/devis-response?token=${token}`);
        const json = await res.json();
        if (json.success) setInfo(json.data);
      } catch { /* empty */ }
      finally { setLoading(false); }
    })();
  }, [token]);

  const handleSubmit = async () => {
    if (!token || !action) return;
    setSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/public/devis-response?token=${token}&action=${action}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ raison: raison || null }),
      });
      const json = await res.json();
      setResult(json.data || "Merci !");
      setDone(true);
    } catch { setResult("Erreur. Veuillez reessayer."); setDone(true); }
    finally { setSubmitting(false); }
  };

  if (loading) return <div style={{ textAlign: "center", padding: 60, color: "#9B9590" }}>Chargement...</div>;
  if (!token || !action) return <div style={{ textAlign: "center", padding: 60, color: "#9B9590" }}>Lien invalide.</div>;
  if (!info) return <div style={{ textAlign: "center", padding: 60, color: "#9B9590" }}>Lien invalide ou expir&eacute;.</div>;

  const isAccept = action === "accept";

  if (info.statut === "ACCEPTE" || info.statut === "REFUSE") {
    return (
      <div style={{ maxWidth: 500, margin: "60px auto", textAlign: "center", padding: 20 }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>{info.statut === "ACCEPTE" ? "✅" : "❌"}</div>
        <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 22, fontWeight: 700, color: "#1C1C1E" }}>Vous avez d&eacute;j&agrave; r&eacute;pondu</h2>
        <p style={{ fontSize: 14, color: "#9B9590", marginTop: 8 }}>Ce devis a &eacute;t&eacute; {info.statut === "ACCEPTE" ? "accepté" : "décliné"}.</p>
      </div>
    );
  }

  if (done) {
    return (
      <div style={{ maxWidth: 500, margin: "60px auto", textAlign: "center", padding: 20 }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>{isAccept ? "✅" : "\uD83D\uDCE8"}</div>
        <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 22, fontWeight: 700, color: "#1C1C1E" }}>{result}</h2>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 500, margin: "60px auto", padding: 20 }}>
      <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #EDEBE7", padding: 32 }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>{isAccept ? "✅" : "❌"}</div>
          <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 22, fontWeight: 700, color: "#1C1C1E" }}>{isAccept ? "Accepter le devis" : "Refuser le devis"}</h2>
          <p style={{ fontSize: 14, color: "#9B9590", marginTop: 8 }}>De <strong>{info.artisanName}</strong></p>
        </div>
        <div style={{ background: "#FAF8F5", borderRadius: 10, padding: 16, marginBottom: 24 }}>
          <p style={{ fontSize: 13, color: "#6B6560", lineHeight: 1.5 }}>{info.description}</p>
        </div>
        {!isAccept && (
          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: "#1C1C1E", display: "block", marginBottom: 6 }}>Raison du refus (facultatif)</label>
            <textarea value={raison} onChange={(e) => setRaison(e.target.value)} rows={3} placeholder="Trop cher, délai trop long..." style={{ width: "100%", padding: 12, borderRadius: 8, border: "1.5px solid #E0DDD8", fontSize: 14, fontFamily: "'Karla',sans-serif", resize: "vertical", outline: "none" }} />
          </div>
        )}
        <button onClick={handleSubmit} disabled={submitting} style={{
          width: "100%", height: 48, borderRadius: 10, border: "none", fontSize: 15, fontWeight: 600, cursor: submitting ? "wait" : "pointer",
          background: isAccept ? "#16a34a" : "#dc2626", color: "#fff", opacity: submitting ? 0.6 : 1,
        }}>
          {submitting ? "Envoi..." : isAccept ? "Oui, j'accepte ce devis" : "Refuser ce devis"}
        </button>
      </div>
    </div>
  );
}

export default function DevisRespondPage() {
  return (
    <>
      <Navbar />
      <Suspense fallback={<div style={{ textAlign: "center", padding: 60, color: "#9B9590" }}>Chargement...</div>}>
        <RespondContent />
      </Suspense>
      <Footer />
    </>
  );
}
