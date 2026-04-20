"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";

interface Template {
  id: string;
  label: string;
  description: string;
  content: string;
  category: "rdv" | "devis" | "facture" | "prospect";
  variables: string[];
}

const CATEGORY_LABEL: Record<Template["category"], { label: string; color: string; bg: string }> = {
  rdv: { label: "Rendez-vous", color: "#C4531A", bg: "rgba(196,83,26,.08)" },
  devis: { label: "Devis", color: "#C9943A", bg: "rgba(201,148,58,.12)" },
  facture: { label: "Facture", color: "#4A6741", bg: "rgba(74,103,65,.1)" },
  prospect: { label: "Prospect", color: "#3D2E1F", bg: "rgba(61,46,31,.08)" },
};

export default function SmsTemplatesPage() {
  const { fetchWithAuth } = useAuth();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [preview, setPreview] = useState<Template | null>(null);
  const [previewVars, setPreviewVars] = useState<Record<string, string>>({});

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const r = await fetchWithAuth("/artisans/me/sms-templates");
      setTemplates(Array.isArray(r) ? (r as Template[]) : []);
    } catch { setTemplates([]); }
    finally { setLoading(false); }
  }, [fetchWithAuth]);

  useEffect(() => { load(); }, [load]);

  const openPreview = (t: Template) => {
    setPreview(t);
    const vars: Record<string, string> = {};
    for (const v of t.variables) vars[v] = `[${v}]`;
    setPreviewVars(vars);
  };

  const rendered = preview ? preview.content.replace(/\{\{(\w+)\}\}/g, (_, k) => previewVars[k] || `[${k}]`) : "";

  const grouped = templates.reduce<Record<string, Template[]>>((acc, t) => {
    if (!acc[t.category]) acc[t.category] = [];
    acc[t.category].push(t);
    return acc;
  }, {});

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "24px 0 60px" }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: "'Fraunces',serif", fontSize: 28, fontWeight: 600, color: "#3D2E1F", letterSpacing: -0.5 }}>
          Templates <span style={{ fontStyle: "italic", fontWeight: 400, color: "#C4531A" }}>SMS</span>
        </h1>
        <p style={{ fontSize: 14, color: "#6B6560", marginTop: 6 }}>Messages pré-rédigés pour rappels RDV, relances devis/factures, accusés de réception.</p>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: 60, color: "#9C958D" }}>Chargement...</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {(Object.keys(grouped) as Template["category"][]).map((cat) => (
            <section key={cat}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <span style={{ padding: "4px 12px", borderRadius: 999, background: CATEGORY_LABEL[cat].bg, color: CATEGORY_LABEL[cat].color, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: .5 }}>
                  {CATEGORY_LABEL[cat].label}
                </span>
                <span style={{ fontSize: 12, color: "#9C958D" }}>{grouped[cat].length} template{grouped[cat].length > 1 ? "s" : ""}</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12 }}>
                {grouped[cat].map((t) => (
                  <div key={t.id} style={{ background: "#fff", borderRadius: 14, border: "1px solid #E8D5C0", padding: 16, cursor: "pointer", transition: "all .2s" }} onClick={() => openPreview(t)}>
                    <div style={{ fontFamily: "'Fraunces',serif", fontSize: 15, fontWeight: 600, color: "#3D2E1F", marginBottom: 4 }}>{t.label}</div>
                    <div style={{ fontSize: 12, color: "#6B6560", marginBottom: 10, lineHeight: 1.5 }}>{t.description}</div>
                    <div style={{ background: "#FAF8F5", padding: "8px 10px", borderRadius: 8, fontSize: 11, color: "#5C4A3A", fontFamily: "monospace", border: "1px solid #F2EAE0", lineHeight: 1.5 }}>
                      {t.content.length > 130 ? t.content.slice(0, 130) + "…" : t.content}
                    </div>
                    <div style={{ fontSize: 10, color: "#C4531A", marginTop: 8, fontWeight: 600 }}>👁 Prévisualiser</div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}

      {/* MODAL PREVIEW */}
      {preview && (
        <div onClick={() => setPreview(null)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.5)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: "#fff", borderRadius: 20, padding: 28, maxWidth: 500, width: "100%", maxHeight: "90vh", overflow: "auto" }}>
            <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 22, fontWeight: 600, color: "#3D2E1F", marginBottom: 6 }}>{preview.label}</h2>
            <p style={{ fontSize: 13, color: "#6B6560", marginBottom: 18 }}>{preview.description}</p>

            {preview.variables.length > 0 && (
              <>
                <div style={{ fontSize: 11, fontWeight: 600, color: "#5C4A3A", textTransform: "uppercase", letterSpacing: .5, marginBottom: 8 }}>Variables disponibles</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8, marginBottom: 18 }}>
                  {preview.variables.map((v) => (
                    <div key={v}>
                      <label style={{ fontSize: 11, color: "#9C958D", display: "block", marginBottom: 2 }}>{v}</label>
                      <input
                        value={previewVars[v] || ""}
                        onChange={(e) => setPreviewVars((p) => ({ ...p, [v]: e.target.value }))}
                        style={{ width: "100%", padding: "6px 10px", borderRadius: 6, border: "1px solid #E8D5C0", fontSize: 12, fontFamily: "inherit" }}
                      />
                    </div>
                  ))}
                </div>
              </>
            )}

            <div style={{ fontSize: 11, fontWeight: 600, color: "#5C4A3A", textTransform: "uppercase", letterSpacing: .5, marginBottom: 8 }}>Aperçu SMS</div>
            <div style={{ background: "#FAF8F5", padding: 14, borderRadius: 10, fontSize: 14, color: "#3D2E1F", lineHeight: 1.5, border: "1px solid #F2EAE0", fontFamily: "monospace" }}>
              {rendered}
            </div>
            <div style={{ fontSize: 11, color: rendered.length > 160 ? "#DC2626" : "#9C958D", marginTop: 6, textAlign: "right" }}>
              {rendered.length} car. {rendered.length > 160 ? "(2 SMS)" : "(1 SMS)"}
            </div>

            <div style={{ marginTop: 20, padding: 14, background: "rgba(201,148,58,.08)", borderRadius: 10, fontSize: 12, color: "#5C4A3A", lineHeight: 1.5 }}>
              💡 Les templates seront envoyés automatiquement par Bativio selon les règles configurées (ex : rappel J-1 à 18h pour les RDV). Configuration à venir en V2.
            </div>

            <button onClick={() => setPreview(null)} style={{ marginTop: 18, padding: "11px 22px", borderRadius: 10, background: "#3D2E1F", color: "#fff", fontSize: 13, fontWeight: 600, border: "none", cursor: "pointer", width: "100%" }}>
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
