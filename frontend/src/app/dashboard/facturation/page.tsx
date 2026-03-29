"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";

export default function FacturationPage() {
  const { user, fetchWithAuth } = useAuth();
  const [state, setState] = useState<"loading" | "onboarding" | "iframe" | "error">("loading");
  const [embedToken, setEmbedToken] = useState("");
  const [siret, setSiret] = useState("");
  const [activating, setActivating] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (!user) return;
    const inv = user as unknown as { invoquoEnabled?: boolean; invoquoSiret?: string; siret?: string };
    if (!inv.invoquoEnabled) {
      setState("onboarding");
      return;
    }
    setSiret(inv.invoquoSiret || inv.siret || "");
    fetchWithAuth("/facturation/refresh-token")
      .then((data) => {
        const d = data as { token: string };
        setEmbedToken(d.token);
        setState("iframe");
      })
      .catch(() => setState("error"));
  }, [user, fetchWithAuth]);

  const handleActivate = async () => {
    setActivating(true);
    try {
      await fetchWithAuth("/facturation/activate", { method: "POST" });
      window.location.reload();
    } catch {
      setState("error");
    } finally {
      setActivating(false);
    }
  };

  // Listen to iframe messages
  useEffect(() => {
    if (state !== "iframe") return;
    function handleMessage(event: MessageEvent) {
      if (event.origin !== "https://invoquo.vercel.app") return;
      const { type, payload } = event.data;
      if (type === "invoquo:navigate" && iframeRef.current) {
        iframeRef.current.src = `https://invoquo.vercel.app/embed/${siret}/${payload.module}?token=${embedToken}&accent=C4531A`;
      }
      if (type === "invoquo:token-expiring") {
        fetchWithAuth("/facturation/refresh-token")
          .then((d) => {
            const data = d as { token: string };
            setEmbedToken(data.token);
            iframeRef.current?.contentWindow?.postMessage(
              { type: "bativio:new-token", payload: { token: data.token } },
              "https://invoquo.vercel.app"
            );
          })
          .catch(() => {});
      }
    }
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [state, siret, embedToken, fetchWithAuth]);

  // Loading
  if (state === "loading") {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: 32, height: 32, border: "3px solid #E5E0DB", borderTopColor: "#C4531A", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 16px" }} />
          <p style={{ fontSize: 14, color: "#9B9590" }}>Chargement...</p>
        </div>
      </div>
    );
  }

  // Onboarding
  if (state === "onboarding") {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh", padding: 32 }}>
        <div style={{ maxWidth: 520, textAlign: "center" }}>
          <div style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(196,83,26,.08)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", fontSize: 32 }}>📄</div>
          <h1 style={{ fontFamily: "'Fraunces',serif", fontSize: 26, fontWeight: 700, color: "#1C1C1E", marginBottom: 8 }}>Facturation électronique</h1>
          <p style={{ fontSize: 15, color: "#6B6560", lineHeight: 1.6, marginBottom: 28 }}>
            À partir de septembre 2026, toutes les entreprises doivent pouvoir recevoir des factures électroniques. Activez le module pour être conforme.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, marginBottom: 28, textAlign: "center" }}>
            {[
              { icon: "🛡️", title: "Conforme", desc: "Plateforme certifiée par l'État" },
              { icon: "⚡", title: "Automatique", desc: "Factures reçues automatiquement" },
              { icon: "📄", title: "Tout-en-un", desc: "Créez et gérez vos factures" },
            ].map((f) => (
              <div key={f.title} style={{ background: "#fff", borderRadius: 12, border: "1px solid #E5E0DB", padding: 16 }}>
                <div style={{ fontSize: 24, marginBottom: 8 }}>{f.icon}</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#1C1C1E" }}>{f.title}</div>
                <div style={{ fontSize: 12, color: "#9B9590", marginTop: 4 }}>{f.desc}</div>
              </div>
            ))}
          </div>
          <button onClick={handleActivate} disabled={activating} style={{
            padding: "14px 32px", borderRadius: 12, background: "#C4531A", color: "#fff", fontSize: 16, fontWeight: 600,
            border: "none", cursor: activating ? "wait" : "pointer", opacity: activating ? 0.6 : 1,
          }}>
            {activating ? "Activation en cours..." : "Activer la facturation"}
          </button>
          <p style={{ fontSize: 12, color: "#C5C0B9", marginTop: 12 }}>Gratuit pendant 1 mois · Sans engagement</p>
        </div>
      </div>
    );
  }

  // Error
  if (state === "error") {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "40vh", padding: 32 }}>
        <div style={{ textAlign: "center" }}>
          <p style={{ fontSize: 15, fontWeight: 600, color: "#dc2626" }}>Impossible de charger la facturation</p>
          <p style={{ fontSize: 13, color: "#9B9590", marginTop: 8 }}>Réessayez dans quelques instants.</p>
          <button onClick={() => window.location.reload()} style={{ marginTop: 16, padding: "10px 20px", background: "#F7F5F2", borderRadius: 8, border: "none", fontSize: 13, color: "#6B6560", cursor: "pointer" }}>Réessayer</button>
        </div>
      </div>
    );
  }

  // Iframe Invoquo
  const embedUrl = `https://invoquo.vercel.app/embed/${siret}/dashboard?token=${embedToken}&accent=C4531A`;

  return (
    <div style={{ position: "relative", width: "100%", height: "calc(100vh - 64px)" }}>
      <iframe
        ref={iframeRef}
        src={embedUrl}
        style={{ width: "100%", height: "100%", border: "none" }}
        allow="clipboard-write"
        title="Facturation"
      />
    </div>
  );
}
