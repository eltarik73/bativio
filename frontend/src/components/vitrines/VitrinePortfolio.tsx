"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { ArtisanPublic } from "@/lib/api";
import DevisForm3Steps from "@/components/DevisForm3Steps";
import ContactCard from "@/components/ContactCard";
import PhotoGallery from "@/components/vitrines/PhotoGallery";
import type { PhotoLayoutType } from "@/lib/vitrine-config";
import ChatDevis from "@/components/ChatDevis/ChatDevis";

export default function VitrinePortfolio({ a, photo, primary, accent, villeSlug }: { a: ArtisanPublic; photo: string; primary: string; accent: string; villeSlug: string }) {
  const [devisOpen, setDevisOpen] = useState(false);
  const [toast, setToast] = useState(false);

  const metierSlug = (a.metierNom || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "-");

  return (
    <>
      {/* Breadcrumb */}
      <nav style={{ background: "#FAF8F5", padding: "12px 32px" }}>
        <div style={{ maxWidth: 880, margin: "0 auto", display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#9B9590", fontFamily: "'Karla',sans-serif" }}>
          <Link href="/" className="breadcrumb-link">Accueil</Link>
          <span style={{ color: "#C5C0B9" }}>&gt;</span>
          <Link href={`/${villeSlug}`} className="breadcrumb-link">{a.ville}</Link>
          <span style={{ color: "#C5C0B9" }}>&gt;</span>
          <span style={{ color: "#6B6560", fontWeight: 500 }}>{a.nomAffichage}</span>
        </div>
      </nav>

      {/* Hero split */}
      <section style={{ display: "grid", gridTemplateColumns: "1fr 1fr", minHeight: 420 }} className="max-md:grid-cols-1">
        <div style={{ position: "relative", overflow: "hidden" }}>
          <Image src={photo} alt={`${a.nomAffichage} - ${a.metierNom || "Artisan"}`} fill style={{ objectFit: "cover", minHeight: 320 }} unoptimized />
        </div>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: "48px 40px", background: "#FAF8F5" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <span style={{ background: accent, color: "#1C1C1E", padding: "5px 14px", borderRadius: 16, fontFamily: "'Fraunces',serif", fontSize: 15, fontWeight: 700, display: "inline-flex", alignItems: "center", gap: 6 }}>
              <svg width="14" height="14" fill="#1C1C1E" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
              {a.noteMoyenne?.toFixed(1)}
            </span>
            <span style={{ fontSize: 13, color: "#9B9590" }}>{a.nombreAvis} avis</span>
          </div>
          <h1 style={{ fontFamily: "'Fraunces',serif", fontSize: "clamp(28px,5vw,48px)", fontWeight: 700, color: "#1C1C1E", lineHeight: 1.1 }}>{a.nomAffichage}</h1>
          <p style={{ fontSize: 16, color: "#9B9590", marginTop: 6 }}>{a.metierNom || "Artisan"} &agrave; {a.ville || "Chambéry"}</p>
          {a.experienceAnnees && <p style={{ fontSize: 14, color: "#C5C0B9", marginTop: 2 }}>{a.experienceAnnees} ans d&apos;exp&eacute;rience</p>}
          {(a.badgesNoms || []).length > 0 && (
            <div style={{ display: "flex", gap: 6, marginTop: 16, flexWrap: "wrap" }}>
              {(a.badgesNoms || []).map((b) => (
                <span key={b} style={{ background: `color-mix(in srgb, ${primary} 10%, white)`, color: primary, padding: "5px 12px", borderRadius: 8, fontSize: 12, fontWeight: 600 }}>{b}</span>
              ))}
            </div>
          )}
          <div style={{ display: "flex", gap: 12, marginTop: 28 }}>
            <button onClick={() => setDevisOpen(true)} style={{ padding: "14px 28px", background: primary, color: "#fff", borderRadius: 10, fontSize: 15, fontWeight: 600, border: "none", cursor: "pointer" }}>Devis gratuit</button>
            {a.telephone && (
              <a href={`tel:${a.telephone.replace(/\s/g, "")}`} style={{ padding: "14px 28px", border: `1.5px solid ${primary}`, color: primary, borderRadius: 10, fontSize: 15, fontWeight: 600, textDecoration: "none" }}>{a.telephone}</a>
            )}
          </div>
        </div>
      </section>

      {/* Gallery — masonry by default for portfolio */}
      <section style={{ background: "#fff", padding: "48px 32px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <PhotoGallery photos={a.photos || []} layout={(a.photoLayout || "masonry") as PhotoLayoutType} primary={primary} metierNom={a.metierNom} ville={a.ville} />
        </div>
      </section>

      {/* Services */}
      {(a.services ?? []).length > 0 && (
        <section style={{ background: "#FAF8F5", padding: "48px 32px" }}>
          <div style={{ maxWidth: 880, margin: "0 auto" }}>
            <div style={{ width: 44, height: 2, background: primary, marginBottom: 16 }} />
            <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 24, fontWeight: 700, color: "#1C1C1E", marginBottom: 20 }}>Prestations</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {(a.services ?? []).map((s) => (
                <div key={s.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: "16px 0", borderBottom: "1px solid #EDEBE7" }}>
                  <div>
                    <h3 style={{ fontSize: 15, fontWeight: 600, color: "#1C1C1E" }}>{s.titre}</h3>
                    {s.description && <p style={{ fontSize: 13, color: "#9B9590", marginTop: 4 }}>{s.description}</p>}
                  </div>
                  {s.prixIndicatif && <span style={{ fontSize: 14, fontWeight: 600, color: primary, whiteSpace: "nowrap", marginLeft: 16 }}>{s.prixIndicatif}</span>}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Présentation */}
      <section style={{ background: "#fff", padding: "48px 32px" }}>
        <div style={{ maxWidth: 880, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40 }} className="max-md:grid-cols-1">
          <div>
            <div style={{ width: 44, height: 2, background: primary, marginBottom: 16 }} />
            <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 24, fontWeight: 700, color: "#1C1C1E", marginBottom: 16 }}>Pr&eacute;sentation</h2>
            <p style={{ fontSize: 15, color: "#6B6560", lineHeight: 1.7 }}>{a.description || "Artisan professionnel. Contactez-moi pour un devis gratuit."}</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {([
              ...(a.experienceAnnees ? [{ v: String(a.experienceAnnees), l: "années" }] : []),
              { v: String(a.nombreAvis), l: "avis" },
              { v: `${a.zoneRayonKm} km`, l: "rayon" },
            ]).map((s, i) => (
              <div key={i} style={{ background: "#FAF8F5", borderRadius: 12, padding: 20, textAlign: "center", border: "1px solid #EDEBE7" }}>
                <div style={{ fontFamily: "'Fraunces',serif", fontSize: 28, fontWeight: 700, color: primary }}>{s.v}</div>
                <div style={{ fontSize: 12, color: "#9B9590", marginTop: 4 }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Devis + Contact */}
      <section id="devis" style={{ background: "#FAF8F5", padding: "32px 0 60px" }}>
        <div className="devis-layout">
          <DevisForm3Steps slug={a.slug} artisanName={a.nomAffichage} ville={a.ville} />
          <ContactCard a={a} />
        </div>
      </section>

      {/* ChatDevis modal */}
      {devisOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(0,0,0,.5)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }} onClick={() => setDevisOpen(false)}>
          <div style={{ position: "relative", width: "100%", maxWidth: 520, maxHeight: "90vh", overflow: "auto", borderRadius: 16, boxShadow: "0 24px 48px rgba(0,0,0,.25)" }} onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setDevisOpen(false)} aria-label="Fermer" style={{ position: "absolute", top: 12, right: 12, zIndex: 10, width: 36, height: 36, borderRadius: "50%", border: "none", background: "rgba(0,0,0,.08)", fontSize: 20, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#1C1C1E" }}>&times;</button>
            <ChatDevis
              artisanId={a.id}
              artisanNom={a.nomAffichage}
              artisanMetierSlug={metierSlug}
              artisanMetierNom={a.metierNom}
              onClose={() => setDevisOpen(false)}
              onSuccess={() => { setDevisOpen(false); setToast(true); setTimeout(() => setToast(false), 3000); }}
            />
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div style={{ position: "fixed", bottom: 32, left: "50%", transform: "translateX(-50%)", zIndex: 1100, background: "#16a34a", color: "#fff", padding: "14px 28px", borderRadius: 12, fontSize: 15, fontWeight: 600, boxShadow: "0 8px 24px rgba(0,0,0,.2)", display: "flex", alignItems: "center", gap: 8 }}>
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" /></svg>
          Demande envoy&eacute;e !
        </div>
      )}
    </>
  );
}
