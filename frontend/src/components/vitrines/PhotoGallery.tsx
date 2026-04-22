"use client";

import { useState } from "react";
import Image from "next/image";
import type { PhotoData } from "@/lib/api";
import type { PhotoLayoutType } from "@/lib/vitrine-config";
export default function PhotoGallery({ photos, layout, primary, metierNom, ville }: { photos: PhotoData[]; layout: PhotoLayoutType; primary: string; metierNom?: string; ville?: string }) {
  const [lightbox, setLightbox] = useState<number | null>(null);
  const items = photos.length > 0 ? photos : [];
  const urls = items.map((p) => p.url);
  const titles = items.map((p) => p.titre);

  // Ne jamais afficher de photos stock Unsplash comme "réalisations"
  // → si aucune photo uploadée, afficher un placeholder explicite
  if (urls.length === 0) {
    return (
      <>
        <div style={{ width: 44, height: 2, background: primary, marginBottom: 16 }} />
        <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 24, fontWeight: 700, color: "#1C1C1E", marginBottom: 12 }}>R&eacute;alisations</h2>
        <div style={{ padding: "32px 24px", border: "1px dashed #EDEBE7", borderRadius: 12, textAlign: "center", color: "#9C958D", fontSize: 14, background: "#FAF8F5" }}>
          {metierNom || "L&rsquo;artisan"} n&rsquo;a pas encore ajout&eacute; de photos de ses r&eacute;alisations.
          <div style={{ fontSize: 13, marginTop: 8, color: "#6B6560" }}>
            Demandez-lui un devis : il pourra vous pr&eacute;senter son portfolio lors du contact.
          </div>
        </div>
      </>
    );
  }

  const altFor = (i: number) => {
    if (titles[i]) return titles[i];
    const base = metierNom || "Artisan";
    const loc = ville || "";
    return `${base}${loc ? " a " + loc : ""} - realisation ${i + 1}`;
  };

  const openLb = (i: number) => setLightbox(i);
  const closeLb = () => setLightbox(null);

  return (
    <>
      <div style={{ width: 44, height: 2, background: primary, marginBottom: 16 }} />
      <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 24, fontWeight: 700, color: "#1C1C1E", marginBottom: 20 }}>R&eacute;alisations</h2>

      {layout === "grid" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }} className="max-md:grid-cols-2 max-[480px]:grid-cols-1">
          {urls.map((url, i) => (
            <div key={i} onClick={() => openLb(i)} style={{ aspectRatio: "4/3", borderRadius: 12, overflow: "hidden", cursor: "pointer", border: "1px solid #EDEBE7", position: "relative" }}>
              <Image src={url} alt={altFor(i)} fill sizes="(max-width: 480px) 100vw, (max-width: 768px) 50vw, 33vw" style={{ objectFit: "cover" }} />
              {titles[i] && (
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "12px", background: "linear-gradient(transparent, rgba(0,0,0,.6))", color: "#fff", fontSize: "13px", fontWeight: 600 }}>
                  {titles[i]}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {layout === "masonry" && (
        <div style={{ columnCount: 3, columnGap: 12 }} className="max-md:columns-2">
          {urls.map((url, i) => (
            <div key={i} onClick={() => openLb(i)} style={{ breakInside: "avoid", marginBottom: 12, borderRadius: 12, overflow: "hidden", cursor: "pointer", border: "1px solid #EDEBE7", position: "relative" }}>
              <Image src={url} alt={altFor(i)} width={400} height={300} sizes="33vw" style={{ width: "100%", height: "auto", display: "block" }} />
            </div>
          ))}
        </div>
      )}

      {layout === "slider" && <SliderGallery urls={urls} altFor={altFor} primary={primary} onOpen={openLb} />}

      {layout === "before-after" && <BeforeAfterGallery urls={urls} />}

      {/* Lightbox */}
      {lightbox !== null && (
        <div onClick={closeLb} style={{ position: "fixed", inset: 0, zIndex: 9999, background: "rgba(0,0,0,.9)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
          <div style={{ position: "relative", maxWidth: "90vw", maxHeight: "90vh", width: 1200, height: 800 }}>
            <Image src={urls[lightbox]} alt={altFor(lightbox)} fill style={{ objectFit: "contain", borderRadius: 12 }} sizes="90vw" />
          </div>
          <button onClick={closeLb} style={{ position: "absolute", top: 20, right: 20, width: 40, height: 40, borderRadius: "50%", background: "rgba(255,255,255,.2)", color: "#fff", border: "none", fontSize: 24, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>&times;</button>
          {lightbox > 0 && <button onClick={(e) => { e.stopPropagation(); setLightbox(lightbox - 1); }} style={{ position: "absolute", left: 20, top: "50%", transform: "translateY(-50%)", width: 48, height: 48, borderRadius: "50%", background: "rgba(255,255,255,.15)", color: "#fff", border: "none", fontSize: 20, cursor: "pointer" }}>&larr;</button>}
          {lightbox < urls.length - 1 && <button onClick={(e) => { e.stopPropagation(); setLightbox(lightbox + 1); }} style={{ position: "absolute", right: 20, top: "50%", transform: "translateY(-50%)", width: 48, height: 48, borderRadius: "50%", background: "rgba(255,255,255,.15)", color: "#fff", border: "none", fontSize: 20, cursor: "pointer" }}>&rarr;</button>}
          <div style={{ position: "absolute", bottom: 20, color: "rgba(255,255,255,.5)", fontSize: 13 }}>{lightbox + 1} / {urls.length}</div>
        </div>
      )}
    </>
  );
}

function SliderGallery({ urls, altFor, primary, onOpen }: { urls: string[]; altFor: (i: number) => string; primary: string; onOpen: (i: number) => void }) {
  const [idx, setIdx] = useState(0);
  return (
    <div style={{ position: "relative", borderRadius: 16, overflow: "hidden", border: "1px solid #EDEBE7" }}>
      <div onClick={() => onOpen(idx)} style={{ height: 400, cursor: "pointer", position: "relative" }}>
        <Image src={urls[idx]} alt={altFor(idx)} fill sizes="100vw" style={{ objectFit: "cover" }} priority={idx === 0} />
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
      <Image src={urls[1]} alt="Après" fill style={{ objectFit: "cover" }} sizes="100vw" />
      <div style={{ position: "absolute", inset: 0, width: `${pos}%`, overflow: "hidden" }}>
        <Image src={urls[0]} alt="Avant" fill style={{ objectFit: "cover" }} sizes="100vw" />
      </div>
      <div style={{ position: "absolute", top: 0, bottom: 0, left: `${pos}%`, width: 3, background: "#fff", boxShadow: "0 0 8px rgba(0,0,0,.3)" }}>
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 40, height: 40, borderRadius: "50%", background: "#fff", boxShadow: "0 2px 8px rgba(0,0,0,.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, color: "#6B6560" }}>&harr;</div>
      </div>
      <span style={{ position: "absolute", top: 12, left: 12, background: "rgba(0,0,0,.5)", color: "#fff", padding: "4px 12px", borderRadius: 6, fontSize: 12, fontWeight: 600 }}>Avant</span>
      <span style={{ position: "absolute", top: 12, right: 12, background: "rgba(0,0,0,.5)", color: "#fff", padding: "4px 12px", borderRadius: 6, fontSize: 12, fontWeight: 600 }}>Apr&egrave;s</span>
    </div>
  );
}
