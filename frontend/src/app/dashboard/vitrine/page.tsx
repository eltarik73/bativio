"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { DashboardFeatureGate } from "@/components/DashboardFeatureGate";
import { PALETTES, TEMPLATES, PHOTO_LAYOUTS } from "@/lib/vitrine-config";

const C: React.CSSProperties = { background: "#fff", borderRadius: 14, border: "1px solid #EDEBE7", padding: 20, marginBottom: 16 };

function slugifyVille(ville: string): string {
  return ville.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/\s+/g, "-");
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
  const [seoResult, setSeoResult] = useState<{ metaDescription: string; keywords: string } | null>(null);

  const isPro = user?.plan === "PRO" || user?.plan === "PRO_PLUS" || user?.plan === "BUSINESS";
  const isProPlus = user?.plan === "PRO_PLUS" || user?.plan === "BUSINESS";

  // Load current settings from user profile
  useEffect(() => {
    if (user) {
      if (user.templateId) setTemplate(user.templateId as string);
      if (user.photoLayout) setPhotoLayout(user.photoLayout as string);
      const p = PALETTES.find((p) => p.primary === user.colorPrimary);
      if (p) setPalette(p.id);
    }
  }, [user]);

  const currentPalette = PALETTES.find((p) => p.id === palette) || PALETTES[0];

  const vitrineSlug = user?.slug || "";
  const vitrineVille = user?.ville ? slugifyVille(user.ville) : "";
  const vitrineHref = vitrineSlug && vitrineVille ? `/${vitrineVille}/${vitrineSlug}` : "#";

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

  return (
    <div style={{ display: "flex", gap: 24, maxWidth: 1200, margin: "0 auto", position: "relative" }}>
      {/* Sidebar config */}
      <div style={{ width: 300, flexShrink: 0, position: "relative" }}>
        <h1 style={{ fontFamily: "'Fraunces',serif", fontSize: 22, fontWeight: 700, color: "#1C1C1E", marginBottom: 24 }}>Ma vitrine</h1>

        {/* Plan gate overlay */}
        {!isPro && (
          <div style={{ position: "absolute", inset: "60px 0 0 0", zIndex: 10, background: "rgba(250,248,245,.85)", backdropFilter: "blur(4px)", borderRadius: 14, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 32, textAlign: "center" }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>&#128274;</div>
            <h3 style={{ fontFamily: "'Fraunces',serif", fontSize: 18, fontWeight: 700, color: "#1C1C1E", marginBottom: 8 }}>Passez au plan Pro</h3>
            <p style={{ fontSize: 14, color: "#6B6560", lineHeight: 1.5, marginBottom: 20 }}>Personnalisez votre vitrine avec 4 templates, 8 palettes de couleurs et 4 dispositions photos.</p>
            <Link href="/dashboard/parametres" style={{ padding: "12px 24px", background: "#C4531A", color: "#fff", borderRadius: 10, fontSize: 14, fontWeight: 600, textDecoration: "none" }}>D&eacute;couvrir le plan Pro &rarr;</Link>
          </div>
        )}

        {/* Templates */}
        <div style={C}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: "#1C1C1E", marginBottom: 12 }}>Template</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {TEMPLATES.map((t) => (
              <button key={t.id} onClick={() => setTemplate(t.id)} style={{
                padding: 12, borderRadius: 10, border: template === t.id ? `2px solid ${currentPalette.primary}` : "1.5px solid #E0DDD8",
                background: template === t.id ? `${currentPalette.primary}08` : "#fff", cursor: "pointer", textAlign: "center", transition: "all .15s",
              }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: template === t.id ? currentPalette.primary : "#1C1C1E" }}>{t.nom}</div>
                <div style={{ fontSize: 10, color: "#9B9590", marginTop: 2 }}>{t.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Couleurs */}
        <div style={C}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: "#1C1C1E", marginBottom: 12 }}>Palette de couleurs</h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {PALETTES.map((p) => (
              <button key={p.id} onClick={() => setPalette(p.id)} style={{
                width: 40, height: 40, borderRadius: "50%", border: palette === p.id ? "3px solid #1C1C1E" : "2px solid #E0DDD8",
                background: `linear-gradient(135deg, ${p.primary} 50%, ${p.accent} 50%)`, cursor: "pointer", transition: "all .15s", padding: 0,
              }} title={p.nom} />
            ))}
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
            <div style={{ flex: 1, height: 32, borderRadius: 6, background: currentPalette.primary }} />
            <div style={{ flex: 1, height: 32, borderRadius: 6, background: currentPalette.accent }} />
          </div>
          <p style={{ fontSize: 11, color: "#9B9590", marginTop: 6 }}>{currentPalette.nom} &mdash; Principale + Accent</p>
        </div>

        {/* Photo layout */}
        <div style={C}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: "#1C1C1E", marginBottom: 12 }}>Disposition des photos</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {PHOTO_LAYOUTS.map((l) => (
              <button key={l.id} onClick={() => setPhotoLayout(l.id)} style={{
                padding: "10px 12px", borderRadius: 8, border: photoLayout === l.id ? `2px solid ${currentPalette.primary}` : "1.5px solid #E0DDD8",
                background: photoLayout === l.id ? `${currentPalette.primary}08` : "#fff", cursor: "pointer", textAlign: "center", transition: "all .15s",
              }}>
                <div style={{ fontSize: 20 }}>{l.icon}</div>
                <div style={{ fontSize: 11, fontWeight: 600, color: photoLayout === l.id ? currentPalette.primary : "#6B6560", marginTop: 2 }}>{l.nom}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Contenu links */}
        <div style={C}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: "#1C1C1E", marginBottom: 12 }}>Contenu</h3>
          {[
            { label: "Mon profil", href: "/dashboard/profil" },
            { label: "Mes photos", href: "/dashboard/photos" },
          ].map((l) => (
            <Link key={l.href} href={l.href} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #F7F5F2", fontSize: 13, color: "#6B6560", textDecoration: "none" }}>
              {l.label} <span style={{ color: "#C5C0B9" }}>&rarr;</span>
            </Link>
          ))}
        </div>

        {/* SEO IA (Business only) */}
        <div style={C}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: "#1C1C1E", marginBottom: 8 }}>SEO par IA</h3>
          {isProPlus ? (
            <>
              <p style={{ fontSize: 12, color: "#9B9590", marginBottom: 12, lineHeight: 1.5 }}>G&eacute;n&eacute;rez une meta description et des mots-cl&eacute;s optimis&eacute;s pour le r&eacute;f&eacute;rencement.</p>
              <button
                onClick={async () => {
                  setSeoLoading(true);
                  try {
                    const res = await fetchWithAuth("/artisans/me/seo-optimize", { method: "POST" }) as { metaDescription: string; keywords: string };
                    setSeoResult(res);
                  } catch { /* ignore */ }
                  finally { setSeoLoading(false); }
                }}
                disabled={seoLoading}
                style={{ width: "100%", padding: "10px 16px", borderRadius: 8, background: "linear-gradient(135deg, #C4531A, #E8A84C)", color: "#fff", fontSize: 13, fontWeight: 600, border: "none", cursor: seoLoading ? "wait" : "pointer", opacity: seoLoading ? 0.6 : 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
              >
                {seoLoading ? "Optimisation..." : "\uD83E\uDD16 Optimiser avec l'IA"}
              </button>
              {seoResult && (
                <div style={{ marginTop: 12, padding: 12, background: "#F0FDF4", borderRadius: 8, border: "1px solid rgba(22,163,74,.15)" }}>
                  <p style={{ fontSize: 11, fontWeight: 600, color: "#15803d", marginBottom: 4 }}>Meta description :</p>
                  <p style={{ fontSize: 12, color: "#6B6560", lineHeight: 1.4 }}>{seoResult.metaDescription}</p>
                  <p style={{ fontSize: 11, fontWeight: 600, color: "#15803d", marginTop: 8, marginBottom: 4 }}>Mots-cl&eacute;s :</p>
                  <p style={{ fontSize: 12, color: "#6B6560", lineHeight: 1.4 }}>{seoResult.keywords}</p>
                </div>
              )}
            </>
          ) : (
            <div style={{ padding: 12, background: "#FAF8F5", borderRadius: 8, textAlign: "center" }}>
              <p style={{ fontSize: 12, color: "#9B9590" }}>Disponible avec le plan Business</p>
            </div>
          )}
        </div>

        {/* Publish */}
        <button onClick={handlePublish} disabled={saving || !isPro} style={{ width: "100%", height: 48, borderRadius: 10, background: isPro ? currentPalette.primary : "#E0DDD8", color: "#fff", fontSize: 15, fontWeight: 600, border: "none", cursor: isPro ? "pointer" : "not-allowed", transition: "all .2s", opacity: saving ? 0.6 : 1 }}>
          {saved ? "✓ Vitrine publiée !" : saving ? "Publication..." : "Publier les modifications"}
        </button>
      </div>

      {/* Preview */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: "#9B9590" }}>Aper&ccedil;u de votre vitrine</span>
          {vitrineHref !== "#" && (
            <Link href={vitrineHref} target="_blank" style={{ fontSize: 13, color: currentPalette.primary, fontWeight: 600, textDecoration: "none" }}>Voir en ligne &rarr;</Link>
          )}
        </div>
        <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #EDEBE7", overflow: "hidden", boxShadow: "0 4px 24px rgba(28,28,30,.06)" }}>
          {/* Browser bar */}
          <div style={{ padding: "8px 16px", background: "#F7F5F2", borderBottom: "1px solid #EDEBE7", display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#E0DDD8" }} />
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#E0DDD8" }} />
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#E0DDD8" }} />
            <span style={{ flex: 1, textAlign: "center", fontSize: 11, color: "#C5C0B9" }}>bativio.fr/{vitrineVille}/{vitrineSlug || "mon-entreprise"}</span>
          </div>

          {/* CLASSIQUE */}
          {template === "classique" && (
            <div style={{ padding: 20 }}>
              <div style={{ background: "#1C1C1E", borderRadius: 12, padding: "28px 24px", marginBottom: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <span style={{ background: currentPalette.accent, color: "#1C1C1E", padding: "4px 10px", borderRadius: 12, fontSize: 13, fontWeight: 700, fontFamily: "'Fraunces',serif" }}>4.8</span>
                  <span style={{ fontSize: 11, color: "rgba(255,255,255,.4)" }}>47 avis</span>
                </div>
                <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 24, fontWeight: 700, color: "#fff" }}>{user?.nomAffichage || "Mon entreprise"}</h2>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,.4)", marginTop: 4 }}>{user?.metierNom || "Artisan"} &agrave; {user?.ville || "Chambéry"}</p>
                <span style={{ display: "inline-block", marginTop: 16, background: currentPalette.primary, color: "#fff", padding: "8px 16px", borderRadius: 8, fontSize: 12, fontWeight: 600 }}>Devis gratuit</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8, marginBottom: 12 }}>
                {[{ v: "15", l: "années" }, { v: "47", l: "avis" }, { v: "25 km", l: "rayon" }].map((s) => (
                  <div key={s.l} style={{ background: "#fff", border: "1px solid #EDEBE7", borderRadius: 8, padding: 12, textAlign: "center" }}>
                    <div style={{ fontFamily: "'Fraunces',serif", fontSize: 20, fontWeight: 700, color: currentPalette.primary }}>{s.v}</div>
                    <div style={{ fontSize: 10, color: "#9B9590" }}>{s.l}</div>
                  </div>
                ))}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 6, marginTop: 12 }}>
                {[1, 2, 3].map((i) => <div key={i} style={{ background: "#EDEBE7", borderRadius: 6, aspectRatio: "4/3" }} />)}
              </div>
            </div>
          )}

          {/* PORTFOLIO */}
          {template === "portfolio" && (
            <div style={{ padding: 0 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
                <div style={{ background: "#EDEBE7", minHeight: 200 }} />
                <div style={{ padding: 24, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                  <span style={{ background: currentPalette.accent, color: "#1C1C1E", padding: "3px 8px", borderRadius: 8, fontSize: 11, fontWeight: 700, alignSelf: "flex-start", marginBottom: 8 }}>4.8 &#9733;</span>
                  <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 20, fontWeight: 700 }}>{user?.nomAffichage || "Mon entreprise"}</h2>
                  <p style={{ fontSize: 12, color: "#9B9590", marginTop: 4 }}>{user?.metierNom || "Artisan"} &agrave; {user?.ville || "Chambéry"}</p>
                  <span style={{ display: "inline-block", marginTop: 14, background: currentPalette.primary, color: "#fff", padding: "6px 14px", borderRadius: 8, fontSize: 11, fontWeight: 600, alignSelf: "flex-start" }}>Devis gratuit</span>
                </div>
              </div>
              <div style={{ padding: 16 }}>
                <p style={{ fontSize: 10, fontWeight: 600, color: "#9B9590", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Galerie masonry</p>
                <div style={{ columnCount: 3, columnGap: 6 }}>
                  {[80, 120, 90, 110, 70, 100].map((h, i) => <div key={i} style={{ background: "#EDEBE7", borderRadius: 6, height: h, marginBottom: 6 }} />)}
                </div>
              </div>
            </div>
          )}

          {/* MODERNE */}
          {template === "moderne" && (
            <div style={{ padding: 20 }}>
              <div style={{ background: currentPalette.primary, borderRadius: 12, padding: "24px 20px", marginBottom: 12, color: "#fff" }}>
                <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 22, fontWeight: 700 }}>{user?.nomAffichage || "Mon entreprise"}</h2>
                <p style={{ fontSize: 12, opacity: 0.7, marginTop: 4 }}>{user?.metierNom || "Artisan"} &agrave; {user?.ville || "Chambéry"}</p>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gridTemplateRows: "auto auto", gap: 8 }}>
                <div style={{ background: "#EDEBE7", borderRadius: 10, gridRow: "1/3", minHeight: 140 }} />
                <div style={{ background: "#1C1C1E", borderRadius: 10, padding: 14, color: "#fff", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                  <div style={{ fontFamily: "'Fraunces',serif", fontSize: 24, fontWeight: 700, color: currentPalette.accent }}>4.8</div>
                  <div style={{ fontSize: 9, opacity: 0.5 }}>note</div>
                </div>
                <div style={{ background: "#1C1C1E", borderRadius: 10, padding: 14, color: "#fff", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                  <div style={{ fontFamily: "'Fraunces',serif", fontSize: 24, fontWeight: 700, color: currentPalette.accent }}>15</div>
                  <div style={{ fontSize: 9, opacity: 0.5 }}>ans</div>
                </div>
                <div style={{ background: "#EDEBE7", borderRadius: 10 }} />
                <div style={{ background: "#FAF8F5", borderRadius: 10, padding: 14, border: "1px solid #EDEBE7" }}>
                  <p style={{ fontSize: 10, color: "#6B6560", lineHeight: 1.4 }}>D&eacute;pannage, r&eacute;novation, chauffage...</p>
                </div>
              </div>
              <div style={{ textAlign: "center", marginTop: 14 }}>
                <span style={{ background: currentPalette.primary, color: "#fff", padding: "8px 20px", borderRadius: 8, fontSize: 12, fontWeight: 600 }}>Demander un devis</span>
              </div>
            </div>
          )}

          {/* VITRINE */}
          {template === "vitrine" && (
            <div style={{ padding: 0 }}>
              <div style={{ background: "#EDEBE7", height: 160, position: "relative" }}>
                <div style={{ position: "absolute", bottom: 8, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 4 }}>
                  {[1, 2, 3].map((i) => <span key={i} style={{ width: i === 1 ? 16 : 6, height: 6, borderRadius: 3, background: i === 1 ? currentPalette.primary : "rgba(255,255,255,.5)" }} />)}
                </div>
              </div>
              <div style={{ padding: 20, textAlign: "center" }}>
                <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 22, fontWeight: 700 }}>{user?.nomAffichage || "Mon entreprise"}</h2>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4, marginTop: 8 }}>
                  <svg width="14" height="14" fill={currentPalette.accent} viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                  <span style={{ fontFamily: "'Fraunces',serif", fontSize: 16, fontWeight: 700 }}>4.8</span>
                  <span style={{ fontSize: 11, color: "#9B9590" }}>(47)</span>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0 }}>
                <div style={{ padding: 16, background: "#FAF8F5" }}>
                  <p style={{ fontSize: 10, fontWeight: 600, color: "#9B9590", marginBottom: 6 }}>PR&Eacute;SENTATION</p>
                  <p style={{ fontSize: 11, color: "#6B6560", lineHeight: 1.4 }}>{user?.metierNom || "Artisan"} &agrave; {user?.ville || "Chambéry"}.</p>
                </div>
                <div style={{ background: "#EDEBE7" }} />
              </div>
              <div style={{ background: currentPalette.primary, padding: 16, textAlign: "center" }}>
                <span style={{ color: "#fff", fontSize: 13, fontWeight: 600 }}>Demander un devis gratuit &rarr;</span>
              </div>
            </div>
          )}

          <div style={{ padding: "8px 20px 12px", textAlign: "center", fontSize: 11, color: "#C5C0B9", borderTop: "1px solid #F7F5F2" }}>
            Template : <strong style={{ color: "#6B6560" }}>{TEMPLATES.find((t) => t.id === template)?.nom}</strong> &middot; Photos : <strong style={{ color: "#6B6560" }}>{PHOTO_LAYOUTS.find((l) => l.id === photoLayout)?.nom}</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
