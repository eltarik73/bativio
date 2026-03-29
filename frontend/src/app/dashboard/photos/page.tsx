"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import type { PhotoData } from "@/lib/api";

const API_URL = "/api/v1";

export default function PhotosPage() {
  const { user } = useAuth();
  const [tab, setTab] = useState<"simple" | "av">("simple");
  const [localPhotos, setLocalPhotos] = useState<{ file: File; preview: string }[]>([]);
  const [serverPhotos, setServerPhotos] = useState<PhotoData[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const planLimit = (() => {
    const p = user?.plan?.toUpperCase() || "GRATUIT";
    if (p === "PRO" || p === "PRO_PLUS") return Infinity;
    if (p === "ESSENTIEL") return 10;
    return 3;
  })();
  const planLabel = planLimit === Infinity ? "Illimite" : `${planLimit}`;
  const totalPhotos = serverPhotos.length + localPhotos.length;

  const { fetchWithAuth } = useAuth();

  // Load existing photos from the server
  useEffect(() => {
    fetchWithAuth("/artisans/me/photos")
      .then((data) => {
        if (Array.isArray(data)) setServerPhotos(data as PhotoData[]);
      })
      .catch(() => {});
  }, [fetchWithAuth]);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const remaining = (planLimit === Infinity ? 100 : planLimit) - totalPhotos;
    const valid = Array.from(files)
      .filter((f) => f.type.startsWith("image/") && f.size <= 10 * 1024 * 1024)
      .slice(0, remaining);
    setLocalPhotos((p) => [...p, ...valid.map((file) => ({ file, preview: URL.createObjectURL(file) }))]);
  };

  const removeLocal = (i: number) => {
    setLocalPhotos((p) => {
      URL.revokeObjectURL(p[i].preview);
      return p.filter((_, j) => j !== i);
    });
  };

  const removeServer = async (photoId: string) => {
    try {
      await fetchWithAuth(`/artisans/me/photos/${photoId}`, { method: "DELETE" });
      setServerPhotos((p) => p.filter((ph) => ph.id !== photoId));
    } catch {
      // silent
    }
  };

  const uploadPhotos = async () => {
    if (localPhotos.length === 0) return;
    setUploading(true);
    setError(null);

    try {
      for (const lp of localPhotos) {
        const formData = new FormData();
        formData.append("file", lp.file);
        formData.append("type", tab === "av" ? "AVANT_APRES" : "SIMPLE");

        const res = await fetch(`${API_URL}/artisans/me/photos/upload`, {
          method: "POST",
          credentials: "include",
          body: formData,
        });
        const json = await res.json();
        if (json.success && json.data) {
          setServerPhotos((prev) => [...prev, json.data]);
        }
        URL.revokeObjectURL(lp.preview);
      }
      setLocalPhotos([]);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Erreur lors de l'upload");
    } finally {
      setUploading(false);
    }
  };

  const pill = (active: boolean): React.CSSProperties => ({
    padding: "8px 20px", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all .15s", border: "none",
    background: active ? "#C4531A" : "transparent",
    color: active ? "#fff" : "#6B6560",
    ...(active ? {} : { border: "1.5px solid #E0DDD8" }),
  });

  return (
    <div style={{ maxWidth: 800, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h1 style={{ fontFamily: "'Fraunces',serif", fontSize: 24, fontWeight: 700, color: "#1C1C1E" }}>Mes photos</h1>
        <span style={{ fontSize: 13, color: "#9B9590" }}>{totalPhotos} / {planLabel} photos ({user?.plan || "Gratuit"})</span>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
        <button style={pill(tab === "simple")} onClick={() => setTab("simple")}>Photo simple</button>
        <button style={pill(tab === "av")} onClick={() => setTab("av")}>Avant / Apr&egrave;s</button>
      </div>

      {/* Upload zone */}
      <div
        style={{ background: "#FAF8F5", border: "2px dashed #E0DDD8", borderRadius: 16, padding: 48, textAlign: "center", cursor: "pointer", transition: "all .2s" }}
        onClick={() => fileRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); e.currentTarget.style.borderColor = "#C4531A"; e.currentTarget.style.background = "rgba(196,83,26,.02)"; }}
        onDragLeave={(e) => { e.currentTarget.style.borderColor = "#E0DDD8"; e.currentTarget.style.background = "#FAF8F5"; }}
        onDrop={(e) => { e.preventDefault(); e.currentTarget.style.borderColor = "#E0DDD8"; e.currentTarget.style.background = "#FAF8F5"; handleFiles(e.dataTransfer.files); }}
      >
        <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" multiple hidden onChange={(e) => handleFiles(e.target.files)} />
        <svg width="48" height="48" fill="none" stroke="#C5C0B9" strokeWidth="1.5" viewBox="0 0 24 24" style={{ margin: "0 auto 16px" }}><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="M21 15l-5-5L5 21" /></svg>
        <p style={{ fontSize: 15, fontWeight: 600, color: "#1C1C1E", marginBottom: 4 }}>Glissez vos photos ici</p>
        <p style={{ fontSize: 13, color: "#C5C0B9", marginBottom: 12 }}>ou</p>
        <span style={{ display: "inline-flex", alignItems: "center", height: 40, padding: "0 20px", borderRadius: 8, border: "1.5px solid #E0DDD8", fontSize: 13, fontWeight: 600, color: "#C4531A" }}>Choisir des photos</span>
        <p style={{ fontSize: 12, color: "#C5C0B9", marginTop: 12 }}>JPG, PNG ou WebP &middot; max 10 Mo</p>
      </div>

      {/* Error */}
      {error && (
        <div style={{ marginTop: 12, padding: "10px 16px", background: "rgba(185,28,28,.08)", borderRadius: 8, fontSize: 13, color: "#b91c1c" }}>
          {error}
        </div>
      )}

      {/* Pending uploads */}
      {localPhotos.length > 0 && (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 12, marginTop: 24 }}>
            {localPhotos.map((p, i) => (
              <div key={i} style={{ position: "relative", aspectRatio: "1", borderRadius: 12, overflow: "hidden", border: "2px dashed #E8A84C" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.preview} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                <button onClick={(e) => { e.stopPropagation(); removeLocal(i); }} style={{ position: "absolute", top: 8, right: 8, width: 28, height: 28, borderRadius: "50%", background: "rgba(0,0,0,.5)", color: "#fff", border: "none", cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>&times;</button>
              </div>
            ))}
          </div>
          <button
            onClick={uploadPhotos}
            disabled={uploading}
            style={{ marginTop: 16, width: "100%", height: 48, borderRadius: 10, border: "none", background: uploading ? "#E0DDD8" : "#C4531A", color: "#fff", fontSize: 15, fontWeight: 600, cursor: uploading ? "not-allowed" : "pointer", transition: "all .2s" }}
          >
            {uploading ? "Envoi en cours..." : `Envoyer ${localPhotos.length} photo${localPhotos.length > 1 ? "s" : ""}`}
          </button>
        </>
      )}

      {/* Server gallery */}
      {serverPhotos.length > 0 ? (
        <>
          <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 18, fontWeight: 700, color: "#1C1C1E", marginTop: 32, marginBottom: 12 }}>Mes photos en ligne</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 12 }}>
            {serverPhotos.map((p) => (
              <div key={p.id} style={{ position: "relative", aspectRatio: "1", borderRadius: 12, overflow: "hidden", border: "1px solid #EDEBE7" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.url} alt={p.titre || ""} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                <button onClick={(e) => { e.stopPropagation(); removeServer(p.id); }} style={{ position: "absolute", top: 8, right: 8, width: 28, height: 28, borderRadius: "50%", background: "rgba(0,0,0,.5)", color: "#fff", border: "none", cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>&times;</button>
                {p.titre && (
                  <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "6px 10px", background: "rgba(0,0,0,.5)", fontSize: 11, color: "#fff", fontWeight: 500 }}>{p.titre}</div>
                )}
              </div>
            ))}
          </div>
        </>
      ) : localPhotos.length === 0 ? (
        <div style={{ textAlign: "center", padding: "48px 20px" }}>
          <svg width="64" height="64" fill="none" stroke="#E0DDD8" strokeWidth="1" viewBox="0 0 24 24" style={{ margin: "0 auto 16px" }}><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="M21 15l-5-5L5 21" /></svg>
          <p style={{ fontSize: 15, color: "#9B9590" }}>Vous n&apos;avez pas encore de photos</p>
          <p style={{ fontSize: 13, color: "#C5C0B9", marginTop: 4 }}>Ajoutez des photos de vos r&eacute;alisations pour attirer plus de clients</p>
        </div>
      ) : null}
    </div>
  );
}
