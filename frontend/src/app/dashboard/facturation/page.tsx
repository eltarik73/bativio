"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { hasFeature } from "@/lib/plans";
import type { PlanType } from "@/lib/plans";
import PricingGrid from "@/components/pricing/PricingGrid";
import { LayoutGrid, Receipt, FileSignature, Users2, FileText, ShieldCheck, Zap, FileDown, AlertCircle, RefreshCw, Loader2 } from "lucide-react";

const INVOQUO_URL = process.env.NEXT_PUBLIC_INVOQUO_URL || "https://invoquo.vercel.app";

export default function FacturationPage() {
  const { user, fetchWithAuth } = useAuth();
  const [state, setState] = useState<"loading" | "upsell" | "onboarding" | "iframe" | "error">("loading");
  const [embedToken, setEmbedToken] = useState("");
  const [siret, setSiret] = useState("");
  const [activating, setActivating] = useState(false);
  const [activeModule, setActiveModule] = useState("dashboard");
  const [allowedModules, setAllowedModules] = useState<string[]>([]);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const plan = ((user?.plan as string) || "GRATUIT") as PlanType;
  const hasReception = hasFeature(plan, "invoquo_reception");

  useEffect(() => {
    if (!user) return;
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
        const d = data as { token: string; modules?: string[] };
        setEmbedToken(d.token);
        if (d.modules) setAllowedModules(d.modules);
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
      if (event.origin !== INVOQUO_URL) return;
      const { type, payload } = event.data;
      if (type === "invoquo:navigate" && iframeRef.current) {
        iframeRef.current.src = `${INVOQUO_URL}/embed/${siret}/${payload.module}?token=${embedToken}&accent=C4531A`;
      }
      if (type === "invoquo:token-expiring") {
        fetchWithAuth("/facturation/refresh-token")
          .then((d) => {
            const data = d as { token: string };
            setEmbedToken(data.token);
            iframeRef.current?.contentWindow?.postMessage(
              { type: "bativio:new-token", payload: { token: data.token } },
              INVOQUO_URL
            );
          })
          .catch(() => {});
      }
    }
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [state, siret, embedToken, fetchWithAuth]);

  // ── Loading ──
  if (state === "loading") {
    return (
      <div className="flex items-center justify-center" style={{ height: "60vh" }}>
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-terre animate-spin mx-auto mb-3" />
          <p className="text-sm text-pierre">Chargement de la facturation...</p>
        </div>
      </div>
    );
  }

  // ── Upsell ──
  if (state === "upsell") {
    return (
      <div className="max-w-[900px] mx-auto py-5">
        {/* Hero */}
        <div className="relative overflow-hidden rounded-2xl mb-7" style={{ background: "linear-gradient(135deg, #1C1C1E 0%, #2d1a0e 50%, #C4531A 100%)", padding: "48px 40px" }}>
          <div className="absolute -top-10 -right-10 w-[200px] h-[200px] rounded-full" style={{ background: "rgba(232,168,76,.15)" }} />
          <div className="absolute -bottom-[60px] -left-5 w-[160px] h-[160px] rounded-full" style={{ background: "rgba(196,83,26,.2)" }} />
          <div className="relative z-[1]">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full mb-4" style={{ background: "rgba(220,38,38,.2)", border: "1px solid rgba(220,38,38,.3)" }}>
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-xs font-semibold text-red-300">Obligation septembre 2026</span>
            </div>
            <h1 className="font-display text-white font-bold leading-tight mb-2.5" style={{ fontSize: "clamp(26px,4vw,36px)" }}>
              La facturation papier, c&apos;est bientôt fini.
            </h1>
            <p className="text-base text-white/60 leading-relaxed max-w-[480px]">
              Toutes les entreprises du bâtiment devront recevoir leurs factures au format électronique. <strong className="text-white/90">15€ d&apos;amende par facture non conforme.</strong>
            </p>
          </div>
        </div>

        {/* Avantages */}
        <div className="grid grid-cols-4 gap-3.5 mb-7">
          {[
            { Icon: ShieldCheck, title: "Conforme", desc: "Plateforme agréée par l'État", color: "#059669", bg: "rgba(5,150,105,.08)" },
            { Icon: Zap, title: "Instantané", desc: "Activez en 1 clic depuis votre dashboard", color: "#E8A84C", bg: "rgba(232,168,76,.08)" },
            { Icon: RefreshCw, title: "Automatique", desc: "Factures reçues et classées automatiquement", color: "#2563EB", bg: "rgba(37,99,235,.08)" },
            { Icon: FileDown, title: "Export", desc: "CSV/Excel pour votre comptable en 1 clic", color: "#C4531A", bg: "rgba(196,83,26,.08)" },
          ].map((f) => (
            <div key={f.title} className="bv-card bg-blanc rounded-[14px] border border-sable p-5 text-center">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center mx-auto mb-2.5" style={{ background: f.bg }}>
                <f.Icon size={22} color={f.color} strokeWidth={1.8} />
              </div>
              <div className="font-display text-[15px] font-bold text-bois mb-1">{f.title}</div>
              <div className="text-xs text-pierre leading-snug">{f.desc}</div>
            </div>
          ))}
        </div>

        <PricingGrid currentPlan={plan} ctaHref="/dashboard/parametres" />

        {/* Bottom CTA */}
        <div className="bg-anthracite rounded-2xl px-8 py-7 text-center mt-7">
          <p className="text-[13px] text-white/40 mb-1.5">Ne restez pas sans protection</p>
          <p className="font-display text-xl font-bold text-white">
            Activez la facturation électronique en <span className="text-or">moins de 2 minutes</span>
          </p>
          <p className="text-sm text-white/35 mt-2">Zéro configuration technique · Zéro risque d&apos;amende · Annulable à tout moment</p>
        </div>
      </div>
    );
  }

  // ── Onboarding ──
  if (state === "onboarding") {
    return (
      <div className="flex items-center justify-center min-h-[60vh] p-8">
        <div className="max-w-[520px] text-center">
          <div className="w-16 h-16 rounded-full bg-terre/8 flex items-center justify-center mx-auto mb-6">
            <FileText size={32} className="text-terre" strokeWidth={1.5} />
          </div>
          <h1 className="font-display text-[26px] font-bold text-bois mb-2">Facturation électronique</h1>
          <p className="text-[15px] text-bois-mid leading-relaxed mb-7">
            À partir de septembre 2026, toutes les entreprises doivent pouvoir recevoir des factures électroniques. Activez le module pour être conforme.
          </p>
          <div className="grid grid-cols-3 gap-3.5 mb-7 text-center">
            {[
              { Icon: ShieldCheck, title: "Conforme", desc: "Plateforme certifiée par l'État", color: "#059669" },
              { Icon: Zap, title: "Automatique", desc: "Factures reçues automatiquement", color: "#E8A84C" },
              { Icon: FileText, title: "Tout-en-un", desc: "Créez et gérez vos factures", color: "#C4531A" },
            ].map((f) => (
              <div key={f.title} className="bg-blanc rounded-xl border border-sable/60 p-4">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center mx-auto mb-2" style={{ background: `${f.color}12` }}>
                  <f.Icon size={20} color={f.color} strokeWidth={1.8} />
                </div>
                <div className="text-sm font-semibold text-bois">{f.title}</div>
                <div className="text-xs text-pierre mt-1">{f.desc}</div>
              </div>
            ))}
          </div>
          <button
            onClick={handleActivate}
            disabled={activating}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-terre text-white text-base font-semibold border-none cursor-pointer disabled:opacity-60 disabled:cursor-wait hover:bg-terre-light transition-colors"
          >
            {activating ? <><Loader2 size={18} className="animate-spin" /> Activation en cours...</> : "Activer la facturation"}
          </button>
          <p className="text-xs text-pierre/70 mt-3">Gratuit pendant 1 mois · Sans engagement</p>
        </div>
      </div>
    );
  }

  // ── Error ──
  if (state === "error") {
    return (
      <div className="flex items-center justify-center min-h-[40vh] p-8">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-3">
            <AlertCircle size={24} className="text-red-500" />
          </div>
          <p className="text-[15px] font-semibold text-red-600">Impossible de charger la facturation</p>
          <p className="text-[13px] text-pierre mt-2">Réessayez dans quelques instants.</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 inline-flex items-center gap-1.5 px-5 py-2.5 bg-creme rounded-lg border-none text-[13px] text-bois-mid font-medium cursor-pointer hover:bg-sable/40 transition-colors"
          >
            <RefreshCw size={14} /> Réessayer
          </button>
        </div>
      </div>
    );
  }

  // ── Iframe with tabs ──
  const allTabs = [
    { key: "dashboard", label: "Tableau de bord" },
    { key: "invoices", label: "Factures" },
    { key: "quotes", label: "Devis" },
    { key: "clients", label: "Clients" },
  ];
  const tabs = allowedModules.length > 0
    ? allTabs.filter((m) => allowedModules.includes(m.key))
    : allTabs.filter((m) => m.key === "dashboard" || m.key === "clients");
  const embedUrl = `${INVOQUO_URL}/embed/${siret}/${activeModule}?token=${embedToken}&accent=C4531A`;

  return (
    <div className="w-full flex flex-col" style={{ height: "calc(100vh - 64px - env(safe-area-inset-bottom, 0px))" }}>
      {/* Tabs — responsive padding */}
      <div className="flex items-end border-b border-sable bg-blanc flex-shrink-0 px-1 sm:px-4 overflow-x-auto">
        {tabs.map((tab) => {
          const active = activeModule === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveModule(tab.key)}
              style={{
                padding: "12px 14px",
                fontSize: 14,
                fontWeight: active ? 700 : 500,
                fontFamily: "'Karla', sans-serif",
                color: active ? "#C4531A" : "#9C958D",
                background: "none",
                border: "none",
                borderBottom: active ? "3px solid #C4531A" : "3px solid transparent",
                cursor: "pointer",
                transition: "all 0.15s",
                marginBottom: -1,
                whiteSpace: "nowrap",
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
      {/* Iframe */}
      <iframe
        ref={iframeRef}
        src={embedUrl}
        className="flex-1 w-full border-none"
        allow="clipboard-write"
        title="Facturation"
      />
    </div>
  );
}
