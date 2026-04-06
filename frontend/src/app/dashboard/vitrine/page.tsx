"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { DashboardFeatureGate } from "@/components/DashboardFeatureGate";
import { PALETTES, TEMPLATES, PHOTO_LAYOUTS, VITRINE_SECTIONS, DEFAULT_VITRINE_CONFIG, getVitrineConfig } from "@/lib/vitrine-config";
import { getEffectivePlan } from "@/lib/plan-gates";

const C: React.CSSProperties = { background: "#fff", borderRadius: 14, border: "1px solid var(--sable,#E8D5C0)", padding: 20, marginBottom: 16 };

function slugifyVille(ville: string): string {
  return ville.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "-");
}

export default function VitrinePage() {
  return <DashboardFeatureGate feature="vitrine"><VitrinePageContent /></DashboardFeatureGate>;
}

function VitrinePageContent() {
  const { user, fetchWithAuth, updateUser } = useAuth();
  const [template, setTemplate] = useState("classique");
  const [palette, setPalette] = useState("terre");
  const [photoLayout, setPhotoLayout] = useState("grid");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [seoLoading, setSeoLoading] = useState(false);
  const [seoResult, setSeoResult] = useState<{ seoGenerated: { title?: string; metaDescription?: string; keywords?: string[] }; cached: boolean } | null>(null);

  // Section config (Business)
  const [vitrineConfig, setVitrineConfig] = useState(DEFAULT_VITRINE_CONFIG);

  const effectivePlan = getEffectivePlan({
    plan: (user?.plan as string) || "GRATUIT",
    planOverride: (user as Record<string, unknown> | null)?.planOverride as string | null,
    planOverrideExpireAt: (user as Record<string, unknown> | null)?.planOverrideExpireAt as string | null,
  });
  const isBusiness = effectivePlan === "business";
  const isPro = effectivePlan === "pro" || effectivePlan === "business";

  useEffect(() => {
    if (user) {
      if (user.templateId) setTemplate(user.templateId as string);
      if (user.photoLayout) setPhotoLayout(user.photoLayout as string);
      const p = PALETTES.find((p) => p.primary === user.colorPrimary);
      if (p) setPalette(p.id);
      // Load vitrine config
      const raw = (user as Record<string, unknown>).vitrineConfig;
      if (raw) setVitrineConfig(getVitrineConfig(raw));
    }
  }, [user]);

  const currentPalette = PALETTES.find((p) => p.id === palette) || PALETTES[0];

  const vitrineSlug = user?.slug || "";
  const vitrineVille = user?.ville ? slugifyVille(user.ville) : "";
  const vitrineHref = vitrineSlug && vitrineVille ? `/${vitrineVille}/${vitrineSlug}` : "#";

  const toggleSection = (id: string) => {
    setVitrineConfig(prev => ({
      ...prev,
      sections: { ...prev.sections, [id]: !prev.sections[id] },
    }));
  };

  const moveSection = (id: string, dir: -1 | 1) => {
    setVitrineConfig(prev => {
      const ordre = [...prev.ordre];
      const idx = ordre.indexOf(id);
      if (idx < 0) return prev;
      const newIdx = idx + dir;
      if (newIdx < 0 || newIdx >= ordre.length) return prev;
      [ordre[idx], ordre[newIdx]] = [ordre[newIdx], ordre[idx]];
      return { ...prev, ordre };
    });
  };

  const handlePublish = async () => {
    if (!isPro) return;
    setSaving(true);
    try {
      const updated = await fetchWithAuth("/artisans/me", {
        method: "PUT",
        body: JSON.stringify({
          templateId: template,
          colorPrimary: currentPalette.primary,
          colorAccent: currentPalette.accent,
          photoLayout,
          ...(isBusiness ? { vitrineConfig } : {}),
        }),
      }) as Record<string, unknown>;
      if (updated && updateUser) {
        updateUser({ ...user!, ...updated });
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e) {
      console.error("Failed to save vitrine settings", e);
    } finally {
      setSaving(false);
    }
  };

  const handleGenerateSeo = async () => {
    setSeoLoading(true);
    try {
      const res = await fetchWithAuth("/vitrine/generate-seo", { method: "POST" }) as { seoGenerated: { title?: string; metaDescription?: string; keywords?: string[] }; cached: boolean };
      setSeoResult(res);
    } catch { /* ignore */ }
    finally { setSeoLoading(false); }
  };

  return (
    <div style={{ display: "flex", gap: 24, maxWidth: 1200, margin: "0 auto", position: "relative" }} className="max-md:!flex-col">
      {/* Sidebar config */}
      <div style={{ width: 320, flexShrink: 0 }} className="max-md:!w-full">
        <h1 style={{ fontFamily: "'Fraunces',serif", fontSize: 22, fontWeight: 700, color: "var(--bois,#3D2E1F)", marginBottom: 24 }}>Ma vitrine</h1>

        {/* Business badge */}
        {isBusiness && (
          <div style={{ ...C, background: "rgba(196,83,26,.03)", borderColor: "rgba(196,83,26,.15)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 10, background: "rgba(201,148,58,.1)", color: "#C9943A" }}>Business</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#3D2E1F" }}>Marque blanche</span>
            </div>
            <p style={{ fontSize: 12, color: "#6B6560", lineHeight: 1.5 }}>Votre vitrine s&apos;affiche en marque blanche : design blanc clean, sans branding Bativio. Personnalisez les sections ci-dessous.</p>
          </div>
        )}

        {/* Sections (Business only) */}
        {isBusiness && (
          <div style={C}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: "var(--bois,#3D2E1F)", marginBottom: 12 }}>Sections affich&eacute;es</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {vitrineConfig.ordre.map((id, idx) => {
                const sec = VITRINE_SECTIONS.find(s => s.id === id);
                if (!sec) return null;
                const locked = "locked" in sec && sec.locked;
                const enabled = vitrineConfig.sections[id] !== false;
                return (
                  <div key={id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", borderRadius: 8, background: enabled ? "#fff" : "#F9FAFB", border: "1px solid #EDEBE7" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                      <button onClick={() => moveSection(id, -1)} disabled={idx === 0} style={{ fontSize: 10, color: idx === 0 ? "#D1D5DB" : "#6B7280", background: "none", border: "none", cursor: idx === 0 ? "default" : "pointer", padding: 0, lineHeight: 1 }}>&#9650;</button>
                      <button onClick={() => moveSection(id, 1)} disabled={idx === vitrineConfig.ordre.length - 1} style={{ fontSize: 10, color: idx === vitrineConfig.ordre.length - 1 ? "#D1D5DB" : "#6B7280", background: "none", border: "none", cursor: idx === vitrineConfig.ordre.length - 1 ? "default" : "pointer", padding: 0, lineHeight: 1 }}>&#9660;</button>
                    </div>
                    <span style={{ flex: 1, fontSize: 13, fontWeight: 500, color: enabled ? "#3D2E1F" : "#9CA3AF" }}>{sec.label}</span>
                    {locked ? (
                      <span style={{ fontSize: 10, color: "#9CA3AF" }}>requis</span>
                    ) : (
                      <button onClick={() => toggleSection(id)} style={{ width: 36, height: 20, borderRadius: 10, background: enabled ? "#C4531A" : "#D1D5DB", border: "none", cursor: "pointer", position: "relative", transition: "background .15s" }}>
                        <span style={{ width: 16, height: 16, borderRadius: "50%", background: "#fff", position: "absolute", top: 2, left: enabled ? 18 : 2, transition: "left .15s" }} />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
            {/* Show sections not yet in order */}
            {VITRINE_SECTIONS.filter(s => !vitrineConfig.ordre.includes(s.id)).map(sec => (
              <button key={sec.id} onClick={() => {
                setVitrineConfig(prev => ({
                  ...prev,
                  sections: { ...prev.sections, [sec.id]: true },
                  ordre: [...prev.ordre, sec.id],
                }));
              }} style={{ display: "block", marginTop: 6, fontSize: 12, color: "#C4531A", background: "none", border: "none", cursor: "pointer" }}>
                + {sec.label}
              </button>
            ))}
          </div>
        )}

        {/* Templates (non-Business) */}
        {!isBusiness && (
          <div style={C}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: "var(--bois,#3D2E1F)", marginBottom: 12 }}>Template</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {TEMPLATES.map((t) => (
                <button key={t.id} onClick={() => setTemplate(t.id)} style={{
                  padding: 12, borderRadius: 10, border: template === t.id ? `2px solid ${currentPalette.primary}` : "1.5px solid #E0DDD8",
                  background: template === t.id ? `${currentPalette.primary}08` : "#fff", cursor: "pointer", textAlign: "center",
                }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: template === t.id ? currentPalette.primary : "#1C1C1E" }}>{t.nom}</div>
                  <div style={{ fontSize: 10, color: "#9C958D", marginTop: 2 }}>{t.description}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Couleurs */}
        <div style={C}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: "var(--bois,#3D2E1F)", marginBottom: 12 }}>Couleur d&apos;accent</h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {PALETTES.map((p) => (
              <button key={p.id} onClick={() => setPalette(p.id)} style={{
                width: 36, height: 36, borderRadius: "50%", border: palette === p.id ? "3px solid #1C1C1E" : "2px solid #E0DDD8",
                background: p.primary, cursor: "pointer", padding: 0,
              }} title={p.nom} />
            ))}
          </div>
        </div>

        {/* Photo layout */}
        {!isBusiness && (
          <div style={C}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: "var(--bois,#3D2E1F)", marginBottom: 12 }}>Disposition des photos</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {PHOTO_LAYOUTS.map((l) => (
                <button key={l.id} onClick={() => setPhotoLayout(l.id)} style={{
                  padding: "10px 12px", borderRadius: 8, border: photoLayout === l.id ? `2px solid ${currentPalette.primary}` : "1.5px solid #E0DDD8",
                  background: photoLayout === l.id ? `${currentPalette.primary}08` : "#fff", cursor: "pointer", textAlign: "center",
                }}>
                  <div style={{ fontSize: 20 }}>{l.icon}</div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: photoLayout === l.id ? currentPalette.primary : "#6B6560", marginTop: 2 }}>{l.nom}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Contenu links */}
        <div style={C}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: "var(--bois,#3D2E1F)", marginBottom: 12 }}>Contenu</h3>
          {[
            { label: "Mon profil", href: "/dashboard/profil" },
            { label: "Mes photos", href: "/dashboard/photos" },
          ].map((l) => (
            <Link key={l.href} href={l.href} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #F7F5F2", fontSize: 13, color: "var(--bois-mid,#5C4A3A)", textDecoration: "none" }}>
              {l.label} <span style={{ color: "#C5C0B9" }}>&rarr;</span>
            </Link>
          ))}
        </div>

        {/* SEO IA (Business only) */}
        {isBusiness && (
          <div style={C}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: "var(--bois,#3D2E1F)", marginBottom: 8 }}>SEO automatique par IA</h3>
            <p style={{ fontSize: 12, color: "#9C958D", marginBottom: 12, lineHeight: 1.5 }}>
              G&eacute;n&eacute;rez titre SEO, meta description, texte de pr&eacute;sentation et FAQ optimis&eacute;s pour le r&eacute;f&eacute;rencement local.
            </p>
            <button
              onClick={handleGenerateSeo}
              disabled={seoLoading}
              style={{ width: "100%", padding: "10px 16px", borderRadius: 8, background: "linear-gradient(135deg, #C4531A, #E8A84C)", color: "#fff", fontSize: 13, fontWeight: 600, border: "none", cursor: seoLoading ? "wait" : "pointer", opacity: seoLoading ? 0.6 : 1 }}
            >
              {seoLoading ? "G\u00e9n\u00e9ration en cours..." : "G\u00e9n\u00e9rer le SEO complet"}
            </button>
            {seoResult && (
              <div style={{ marginTop: 12, padding: 12, background: seoResult.cached ? "#FFF7ED" : "#F0FDF4", borderRadius: 8, border: `1px solid ${seoResult.cached ? "rgba(245,158,11,.2)" : "rgba(22,163,74,.15)"}` }}>
                {seoResult.cached && <p style={{ fontSize: 11, color: "#92400E", marginBottom: 6 }}>SEO d&eacute;j&agrave; g&eacute;n&eacute;r&eacute; aujourd&apos;hui (1 par jour max)</p>}
                {seoResult.seoGenerated?.title && (
                  <div style={{ marginBottom: 8 }}>
                    <p style={{ fontSize: 11, fontWeight: 600, color: "#15803d", marginBottom: 2 }}>Title SEO :</p>
                    <p style={{ fontSize: 12, color: "#374151" }}>{String(seoResult.seoGenerated.title)}</p>
                  </div>
                )}
                {seoResult.seoGenerated?.metaDescription && (
                  <div style={{ marginBottom: 8 }}>
                    <p style={{ fontSize: 11, fontWeight: 600, color: "#15803d", marginBottom: 2 }}>Meta description :</p>
                    <p style={{ fontSize: 12, color: "#374151" }}>{String(seoResult.seoGenerated.metaDescription)}</p>
                  </div>
                )}
                {seoResult.seoGenerated?.keywords && (
                  <div>
                    <p style={{ fontSize: 11, fontWeight: 600, color: "#15803d", marginBottom: 2 }}>Mots-cl&eacute;s :</p>
                    <p style={{ fontSize: 12, color: "#374151" }}>{Array.isArray(seoResult.seoGenerated.keywords) ? (seoResult.seoGenerated.keywords as string[]).join(", ") : ""}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
        {!isBusiness && (
          <div style={C}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: "var(--bois,#3D2E1F)", marginBottom: 8 }}>SEO par IA</h3>
            <div style={{ padding: 12, background: "#FAF8F5", borderRadius: 8, textAlign: "center" }}>
              <p style={{ fontSize: 12, color: "#9C958D" }}>Marque blanche + SEO automatique disponibles avec le plan Business</p>
            </div>
          </div>
        )}

        {/* Publish */}
        <button onClick={handlePublish} disabled={saving || !isPro} style={{ width: "100%", height: 48, borderRadius: 10, background: isPro ? currentPalette.primary : "#E0DDD8", color: "#fff", fontSize: 15, fontWeight: 600, border: "none", cursor: isPro ? "pointer" : "not-allowed", opacity: saving ? 0.6 : 1 }}>
          {saved ? "\u2713 Vitrine publi\u00e9e !" : saving ? "Publication..." : "Publier les modifications"}
        </button>
      </div>

      {/* Preview */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: "#9C958D" }}>Aper&ccedil;u de votre vitrine</span>
          {vitrineHref !== "#" && (
            <Link href={vitrineHref} target="_blank" style={{ fontSize: 13, color: currentPalette.primary, fontWeight: 600, textDecoration: "none" }}>Voir en ligne &rarr;</Link>
          )}
        </div>
        <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #E8D5C0", overflow: "hidden", boxShadow: "0 4px 24px rgba(28,28,30,.06)" }}>
          {/* Browser bar */}
          <div style={{ padding: "8px 16px", background: "#F7F5F2", borderBottom: "1px solid #E8D5C0", display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#E0DDD8" }} />
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#E0DDD8" }} />
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#E0DDD8" }} />
            <span style={{ flex: 1, textAlign: "center", fontSize: 11, color: "#C5C0B9" }}>bativio.fr/{vitrineVille}/{vitrineSlug || "mon-entreprise"}</span>
          </div>

          {/* Business preview */}
          {isBusiness ? (
            <div style={{ padding: 24, background: "#fff" }}>
              <div style={{ textAlign: "center", padding: "32px 0" }}>
                <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 22, fontWeight: 700, color: "#1C1C1E" }}>{user?.nomAffichage || "Mon entreprise"}</h2>
                <p style={{ fontSize: 14, color: "#6B7280", marginTop: 4 }}>{user?.metierNom || "Artisan"} &agrave; {user?.ville || "Chamb\u00e9ry"}</p>
                <div style={{ fontSize: 13, color: "#9CA3AF", marginTop: 8 }}>4.8/5 &middot; 47 avis &middot; 15 ans</div>
                <span style={{ display: "inline-block", marginTop: 16, background: currentPalette.primary, color: "#fff", padding: "8px 20px", borderRadius: 10, fontSize: 13, fontWeight: 600 }}>Devis gratuit</span>
              </div>
              <div style={{ borderTop: "1px solid #F3F4F6", padding: "16px 0" }}>
                {vitrineConfig.ordre.filter(id => vitrineConfig.sections[id] !== false && id !== "hero" && id !== "devis").slice(0, 4).map(id => {
                  const sec = VITRINE_SECTIONS.find(s => s.id === id);
                  return sec ? (
                    <div key={id} style={{ padding: "8px 0", borderBottom: "1px solid #F9FAFB", fontSize: 12, color: "#6B7280" }}>{sec.label}</div>
                  ) : null;
                })}
              </div>
              <div style={{ textAlign: "center", padding: "12px 0", fontSize: 11, color: "#D1D5DB" }}>R&eacute;alis&eacute; avec Bativio</div>
            </div>
          ) : (
            <>
              {/* Classic previews (existing) */}
              {template === "classique" && (
                <div style={{ padding: 20 }}>
                  <div style={{ background: "#1C1C1E", borderRadius: 12, padding: "28px 24px", marginBottom: 12 }}>
                    <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 24, fontWeight: 700, color: "#fff" }}>{user?.nomAffichage || "Mon entreprise"}</h2>
                    <p style={{ fontSize: 13, color: "rgba(255,255,255,.4)", marginTop: 4 }}>{user?.metierNom || "Artisan"} &agrave; {user?.ville || "Chamb\u00e9ry"}</p>
                    <span style={{ display: "inline-block", marginTop: 16, background: currentPalette.primary, color: "#fff", padding: "8px 16px", borderRadius: 8, fontSize: 12, fontWeight: 600 }}>Devis gratuit</span>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 6 }}>
                    {[1, 2, 3].map((i) => <div key={i} style={{ background: "#EDEBE7", borderRadius: 6, aspectRatio: "4/3" }} />)}
                  </div>
                </div>
              )}
              {template === "portfolio" && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
                  <div style={{ background: "#EDEBE7", minHeight: 200 }} />
                  <div style={{ padding: 24, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                    <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 20, fontWeight: 700 }}>{user?.nomAffichage || "Mon entreprise"}</h2>
                    <p style={{ fontSize: 12, color: "#9C958D", marginTop: 4 }}>{user?.metierNom || "Artisan"}</p>
                    <span style={{ display: "inline-block", marginTop: 14, background: currentPalette.primary, color: "#fff", padding: "6px 14px", borderRadius: 8, fontSize: 11, fontWeight: 600, alignSelf: "flex-start" }}>Devis gratuit</span>
                  </div>
                </div>
              )}
              {template === "moderne" && (
                <div style={{ padding: 20 }}>
                  <div style={{ background: currentPalette.primary, borderRadius: 12, padding: "24px 20px", color: "#fff" }}>
                    <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 22, fontWeight: 700 }}>{user?.nomAffichage || "Mon entreprise"}</h2>
                    <p style={{ fontSize: 12, opacity: 0.7, marginTop: 4 }}>{user?.metierNom || "Artisan"}</p>
                  </div>
                </div>
              )}
              {template === "vitrine" && (
                <div>
                  <div style={{ background: "#EDEBE7", height: 140 }} />
                  <div style={{ padding: 20, textAlign: "center" }}>
                    <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 22, fontWeight: 700 }}>{user?.nomAffichage || "Mon entreprise"}</h2>
                  </div>
                </div>
              )}
            </>
          )}

          <div style={{ padding: "8px 20px 12px", textAlign: "center", fontSize: 11, color: "#C5C0B9", borderTop: "1px solid #F7F5F2" }}>
            {isBusiness ? "Design marque blanche" : <>Template : <strong style={{ color: "#5C4A3A" }}>{TEMPLATES.find((t) => t.id === template)?.nom}</strong></>}
          </div>
        </div>
      </div>
    </div>
  );
}
