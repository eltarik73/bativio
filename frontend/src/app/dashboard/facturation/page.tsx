"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { hasFeature } from "@/lib/plans";
import type { PlanType } from "@/lib/plans";

export default function FacturationPage() {
  const { user, fetchWithAuth } = useAuth();
  const [state, setState] = useState<"loading" | "upsell" | "onboarding" | "iframe" | "error">("loading");
  const [embedToken, setEmbedToken] = useState("");
  const [siret, setSiret] = useState("");
  const [activating, setActivating] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const plan = ((user?.plan as string) || "GRATUIT") as PlanType;
  const hasReception = hasFeature(plan, "invoquo_reception");

  useEffect(() => {
    if (!user) return;
    // Si le plan ne donne pas acces a la facturation → upsell
    if (!hasReception) {
      setState("upsell");
      return;
    }
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
  }, [user, fetchWithAuth, hasReception]);

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

  // Upsell — plan insuffisant — design premium
  if (state === "upsell") {
    return (
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "20px 0" }}>
        {/* Hero banner gradient */}
        <div style={{ background: "linear-gradient(135deg, #1C1C1E 0%, #2d1a0e 50%, #C4531A 100%)", borderRadius: 20, padding: "48px 40px", marginBottom: 28, position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: -40, right: -40, width: 200, height: 200, borderRadius: "50%", background: "rgba(232,168,76,.15)" }} />
          <div style={{ position: "absolute", bottom: -60, left: -20, width: 160, height: 160, borderRadius: "50%", background: "rgba(196,83,26,.2)" }} />
          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(220,38,38,.2)", border: "1px solid rgba(220,38,38,.3)", padding: "6px 14px", borderRadius: 20, marginBottom: 16 }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#ef4444", animation: "pulse 2s infinite" }} />
              <span style={{ fontSize: 12, fontWeight: 600, color: "#fca5a5" }}>Obligation septembre 2026</span>
            </div>
            <h1 style={{ fontFamily: "'Fraunces',serif", fontSize: "clamp(26px,4vw,36px)", fontWeight: 700, color: "#fff", lineHeight: 1.15, marginBottom: 10 }}>
              La facturation papier, c&apos;est bientôt fini.
            </h1>
            <p style={{ fontSize: 16, color: "rgba(255,255,255,.6)", lineHeight: 1.6, maxWidth: 480 }}>
              Toutes les entreprises du bâtiment devront recevoir leurs factures au format électronique. <strong style={{ color: "rgba(255,255,255,.9)" }}>15€ d&apos;amende par facture non conforme.</strong>
            </p>
          </div>
        </div>

        {/* Avantages */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 28 }}>
          {[
            { icon: "🛡️", title: "Conforme", desc: "Connecté à une plateforme agréée par l'État" },
            { icon: "⚡", title: "Instantané", desc: "Activez en 1 clic depuis votre dashboard" },
            { icon: "🔄", title: "Automatique", desc: "Factures reçues et classées automatiquement" },
            { icon: "📊", title: "Export", desc: "CSV/Excel pour votre comptable en 1 clic" },
          ].map((f) => (
            <div key={f.title} style={{ background: "#fff", borderRadius: 14, border: "1px solid #EDEBE7", padding: "24px 18px", textAlign: "center", transition: "transform .2s, box-shadow .2s", cursor: "default" }} className="stat-card-hover">
              <div style={{ fontSize: 28, marginBottom: 10 }}>{f.icon}</div>
              <div style={{ fontFamily: "'Fraunces',serif", fontSize: 15, fontWeight: 700, color: "#1C1C1E", marginBottom: 4 }}>{f.title}</div>
              <div style={{ fontSize: 12, color: "#9B9590", lineHeight: 1.4 }}>{f.desc}</div>
            </div>
          ))}
        </div>

        {/* Plans cards */}
        <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 22, fontWeight: 700, color: "#1C1C1E", marginBottom: 16 }}>Choisissez votre niveau de protection</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginBottom: 32 }}>
          {[
            { name: "Essentiel", price: "19", icon: "📥", desc: "Réception conforme", pop: false, features: ["Réception factures fournisseurs", "Conformité sept. 2026 garantie", "Stockage sécurisé illimité", "Notifications automatiques"], cta: "Commencer" },
            { name: "Pro", price: "49", icon: "📤", desc: "Réception + Envoi", pop: true, features: ["Tout Essentiel +", "Envoi de vos factures clients", "Transmission automatique PA", "Suivi des statuts temps réel", "Export comptable CSV/Excel"], cta: "Le + populaire" },
            { name: "Pro+", price: "79", icon: "🤖", desc: "Tout-en-un + IA", pop: false, features: ["Tout Pro +", "Création de factures dans Bativio", "Devis IA avec envoi auto", "Assistant IA pour les clients", "Modèles personnalisables"], cta: "Maximum" },
          ].map((p) => (
            <div key={p.name} style={{ background: "#fff", borderRadius: 16, padding: "28px 22px", border: p.pop ? "2px solid #C4531A" : "1px solid #EDEBE7", position: "relative", boxShadow: p.pop ? "0 4px 20px rgba(196,83,26,.12)" : "0 1px 3px rgba(0,0,0,.04)", display: "flex", flexDirection: "column" }}>
              {p.pop && <div style={{ position: "absolute", top: -11, left: "50%", transform: "translateX(-50%)", background: "#C4531A", color: "#fff", padding: "4px 14px", borderRadius: 20, fontSize: 11, fontWeight: 600 }}>Recommandé</div>}
              <div style={{ fontSize: 28, marginBottom: 8 }}>{p.icon}</div>
              <div style={{ fontFamily: "'Fraunces',serif", fontSize: 20, fontWeight: 700, color: "#1C1C1E" }}>{p.name}</div>
              <div style={{ marginTop: 4 }}>
                <span style={{ fontFamily: "'Fraunces',serif", fontSize: 32, fontWeight: 700, color: "#C4531A" }}>{p.price}€</span>
                <span style={{ fontSize: 14, color: "#9B9590" }}>/mois</span>
              </div>
              <p style={{ fontSize: 13, color: "#9B9590", marginTop: 4, marginBottom: 16 }}>{p.desc}</p>
              <div style={{ flex: 1 }}>
                {p.features.map((f) => (
                  <div key={f} style={{ display: "flex", alignItems: "center", gap: 8, padding: "5px 0" }}>
                    <svg width="16" height="16" fill="none" stroke="#C4531A" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" /></svg>
                    <span style={{ fontSize: 13, color: "#6B6560" }}>{f}</span>
                  </div>
                ))}
              </div>
              <Link href="/dashboard/parametres" style={{ display: "block", textAlign: "center", marginTop: 20, padding: "12px 0", borderRadius: 12, fontSize: 14, fontWeight: 600, textDecoration: "none", background: p.pop ? "#C4531A" : "transparent", color: p.pop ? "#fff" : "#C4531A", border: p.pop ? "none" : "1.5px solid #C4531A" }}>
                Passer à {p.name}
              </Link>
            </div>
          ))}
        </div>

        {/* Bottom urgence */}
        <div style={{ background: "#1C1C1E", borderRadius: 16, padding: "28px 32px", textAlign: "center" }}>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,.4)", marginBottom: 6 }}>Ne restez pas sans protection</p>
          <p style={{ fontFamily: "'Fraunces',serif", fontSize: 20, fontWeight: 700, color: "#fff" }}>
            Activez la facturation électronique en <span style={{ color: "#E8A84C" }}>moins de 2 minutes</span>
          </p>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,.35)", marginTop: 8 }}>Zéro configuration technique · Zéro risque d&apos;amende · Annulable à tout moment</p>
        </div>
      </div>
    );
  }

  // Onboarding — plan OK mais pas encore active
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
