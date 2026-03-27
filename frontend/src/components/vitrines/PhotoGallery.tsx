"use client";

import { useState } from "react";
import type { PhotoData } from "@/lib/api";
import type { PhotoLayoutType } from "@/lib/vitrine-config";
import { METIER_PHOTOS } from "@/lib/metier-config";

// Placeholder photos when artisan has none
const PLACEHOLDERS = Object.values(METIER_PHOTOS).slice(0, 6);

export default function PhotoGallery({ photos, layout, primary }: { photos: PhotoData[]; layout: PhotoLayoutType; primary: string }) {
  const [lightbox, setLightbox] = useState<number | null>(null);
  const urls = photos.length > 0 ? photos.map((p) => p.url) : PLACEHOLDERS;

  if (urls.length === 0) return null;

  const openLb = (i: number) => setLightbox(i);
  const closeLb = () => setLightbox(null);

  return (
    <>
      <div style={{ width: 44, height: 2, background: primary, marginBottom: 16 }} />
      <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 24, fontWeight: 700, color: "#1C1C1E", marginBottom: 20 }}>R&eacute;alisations</h2>

      {layout === "grid" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
          {urls.map((url, i) => (
            <div key={i} onClick={() => openLb(i)} style={{ aspectRatio: "4/3", borderRadius: 12, overflow: "hidden", cursor: "pointer", border: "1px solid #EDEBE7" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform .3s" }} />
            </div>
          ))}
        </div>
      )}

      {layout === "masonry" && (
        <div style={{ columnCount: 3, columnGap: 12 }}>
          {urls.map((url, i) => (
            <div key={i} onClick={() => openLb(i)} style={{ breakInside: "avoid", marginBottom: 12, borderRadius: 12, overflow: "hidden", cursor: "pointer", border: "1px solid #EDEBE7" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="" style={{ width: "100%", display: "block" }} />
            </div>
          ))}
        </div>
      )}

      {layout === "slider" && <SliderGallery urls={urls} primary={primary} onOpen={openLb} />}

      {layout === "before-after" && <BeforeAfterGallery urls={urls} />}

      {/* Lightbox */}
      {lightbox !== null && (
        <div onClick={closeLb} style={{ position: "fixed", inset: 0, zIndex: 9999, background: "rgba(0,0,0,.9)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={urls[lightbox]} alt="" style={{ maxWidth: "90vw", maxHeight: "90vh", borderRadius: 12 }} />
          <button onClick={closeLb} style={{ position: "absolute", top: 20, right: 20, width: 40, height: 40, borderRadius: "50%", background: "rgba(255,255,255,.2)", color: "#fff", border: "none", fontSize: 24, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>&times;</button>
          {lightbox > 0 && <button onClick={(e) => { e.stopPropagation(); setLightbox(lightbox - 1); }} style={{ position: "absolute", left: 20, top: "50%", transform: "translateY(-50%)", width: 48, height: 48, borderRadius: "50%", background: "rgba(255,255,255,.15)", color: "#fff", border: "none", fontSize: 20, cursor: "pointer" }}>&larr;</button>}
          {lightbox < urls.length - 1 && <button onClick={(e) => { e.stopPropagation(); setLightbox(lightbox + 1); }} style={{ position: "absolute", right: 20, top: "50%", transform: "translateY(-50%)", width: 48, height: 48, borderRadius: "50%", background: "rgba(255,255,255,.15)", color: "#fff", border: "none", fontSize: 20, cursor: "pointer" }}>&rarr;</button>}
          <div style={{ position: "absolute", bottom: 20, color: "rgba(255,255,255,.5)", fontSize: 13 }}>{lightbox + 1} / {urls.length}</div>
        </div>
      )}
    </>
  );
}

function SliderGallery({ urls, primary, onOpen }: { urls: string[]; primary: string; onOpen: (i: number) => void }) {
  const [idx, setIdx] = useState(0);
  return (
    <div style={{ position: "relative", borderRadius: 16, overflow: "hidden", border: "1px solid #EDEBE7" }}>
      <div onClick={() => onOpen(idx)} style={{ height: 400, cursor: "pointer" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={urls[idx]} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>
      {idx > 0 && <button onClick={() => setIdx(idx - 1)} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", width: 40, height: 40, borderRadius: "50%", background: "rgba(255,255,255,.9)", border: "none", fontSize: 18, cursor: "pointer", color: "#1C1C1E" }}>&larr;</button>}
      {idx < urls.length - 1 && <button onClick={() => setIdx(idx + 1)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", width: 40, height: 40, borderRadius: "50%", background: "rgba(255,255,255,.9)", border: "none", fontSize: 18, cursor: "pointer", color: "#1C1C1E" }}>&rarr;</button>}
      <div style={{ position: "absolute", bottom: 16, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 6 }}>
        {urls.map((_, i) => <span key={i} onClick={() => setIdx(i)} style={{ width: 8, height: 8, borderRadius: "50%", background: i === idx ? primary : "rgba(255,255,255,.5)", cursor: "pointer", transition: "all .2s" }} />)}
      </div>
    </div>
  );
}

function BeforeAfterGallery({ urls }: { urls: string[] }) {
  const [pos, setPos] = useState(50);
  if (urls.length < 2) return null;
  return (
    <div style={{ position: "relative", borderRadius: 16, overflow: "hidden", height: 400, border: "1px solid #EDEBE7", cursor: "ew-resize", userSelect: "none" }}
      onMouseMove={(e) => { const rect = e.currentTarget.getBoundingClientRect(); setPos(Math.max(5, Math.min(95, ((e.clientX - rect.left) / rect.width) * 100))); }}
      onTouchMove={(e) => { const rect = e.currentTarget.getBoundingClientRect(); const t = e.touches[0]; setPos(Math.max(5, Math.min(95, ((t.clientX - rect.left) / rect.width) * 100))); }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={urls[1]} alt="Apr\u00e8s" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
      <div style={{ position: "absolute", inset: 0, width: `${pos}%`, overflow: "hidden" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={urls[0]} alt="Avant" style={{ width: "100%", height: "100%", objectFit: "cover", minWidth: "100%" }} />
      </div>
      <div style={{ position: "absolute", top: 0, bottom: 0, left: `${pos}%`, width: 3, background: "#fff", boxShadow: "0 0 8px rgba(0,0,0,.3)" }}>
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 40, height: 40, borderRadius: "50%", background: "#fff", boxShadow: "0 2px 8px rgba(0,0,0,.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, color: "#6B6560" }}>&harr;</div>
      </div>
      <span style={{ position: "absolute", top: 12, left: 12, background: "rgba(0,0,0,.5)", color: "#fff", padding: "4px 12px", borderRadius: 6, fontSize: 12, fontWeight: 600 }}>Avant</span>
      <span style={{ position: "absolute", top: 12, right: 12, background: "rgba(0,0,0,.5)", color: "#fff", padding: "4px 12px", borderRadius: 6, fontSize: 12, fontWeight: 600 }}>Apr&egrave;s</span>
    </div>
  );
}
