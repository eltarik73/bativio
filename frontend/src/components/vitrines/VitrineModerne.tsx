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

export default function VitrineModerne({ a, photo, primary, accent, villeSlug }: { a: ArtisanPublic; photo: string; primary: string; accent: string; villeSlug: string }) {
  const [devisOpen, setDevisOpen] = useState(false);
  const [toast, setToast] = useState(false);
  const services = a.services ?? [];
  const badges = a.badgesNoms || [];

  const metierSlug = (a.metierNom || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "-");

  return (
    <>
      {/* Breadcrumb */}
      <nav style={{ background: "#FAF8F5", padding: "12px 32px" }}>
        <div style={{ maxWidth: 960, margin: "0 auto", display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#9B9590", fontFamily: "'Karla',sans-serif" }}>
          <Link href="/" className="breadcrumb-link">Accueil</Link>
          <span style={{ color: "#C5C0B9" }}>&gt;</span>
          <Link href={`/${villeSlug}`} className="breadcrumb-link">{a.ville}</Link>
          <span style={{ color: "#C5C0B9" }}>&gt;</span>
          <span style={{ color: "#6B6560", fontWeight: 500 }}>{a.nomAffichage}</span>
        </div>
      </nav>

      {/* Hero compact */}
      <section style={{ background: primary, padding: "40px 32px", color: "#fff" }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <span style={{ background: accent, color: "#1C1C1E", padding: "5px 12px", borderRadius: 14, fontFamily: "'Fraunces',serif", fontSize: 14, fontWeight: 700, display: "inline-flex", alignItems: "center", gap: 5 }}>
              <svg width="13" height="13" fill="#1C1C1E" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
              {a.noteMoyenne?.toFixed(1)}
            </span>
            <span style={{ fontSize: 13, opacity: 0.6 }}>{a.nombreAvis} avis</span>
          </div>
          <h1 style={{ fontFamily: "'Fraunces',serif", fontSize: "clamp(32px,5vw,52px)", fontWeight: 700, lineHeight: 1.1 }}>{a.nomAffichage}</h1>
          <p style={{ fontSize: 17, opacity: 0.65, marginTop: 6 }}>{a.metierNom || "Artisan"} &agrave; {a.ville || "Chambéry"}</p>
          <div style={{ marginTop: 24 }}>
            <button onClick={() => setDevisOpen(true)} style={{ padding: "14px 28px", background: "#fff", color: primary, borderRadius: 10, fontSize: 15, fontWeight: 600, border: "none", cursor: "pointer" }}>Devis gratuit</button>
          </div>
        </div>
      </section>

      {/* Bento grid */}
      <section style={{ background: "#FAF8F5", padding: "32px" }}>
        <div style={{ maxWidth: 960, margin: "0 auto", display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gridTemplateRows: "auto auto", gap: 14 }} className="max-md:grid-cols-1">
          {/* Big photo */}
          <div style={{ borderRadius: 16, overflow: "hidden", gridRow: "1/3", position: "relative", minHeight: 300 }}>
            <Image src={photo} alt={`${a.nomAffichage} - ${a.metierNom || "Artisan"}`} fill style={{ objectFit: "cover" }} unoptimized />
          </div>

          {/* Stat cards */}
          {([
            ...(a.experienceAnnees ? [{ v: String(a.experienceAnnees), l: "années" }] : []),
            { v: String(a.nombreAvis), l: "avis clients" },
            { v: `${a.zoneRayonKm}km`, l: "rayon" },
          ]).slice(0, 2).map((s, i) => (
            <div key={i} style={{ background: "#1C1C1E", borderRadius: 16, padding: 24, color: "#fff", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
              <div style={{ fontFamily: "'Fraunces',serif", fontSize: 36, fontWeight: 700, color: accent }}>{s.v}</div>
              <div style={{ fontSize: 12, opacity: 0.5, marginTop: 4 }}>{s.l}</div>
            </div>
          ))}

          {/* Description card */}
          <div style={{ background: "#fff", borderRadius: 16, padding: 24, border: "1px solid #EDEBE7", gridColumn: "2/4" }}>
            <p style={{ fontSize: 14, color: "#6B6560", lineHeight: 1.6 }}>{a.description || "Artisan professionnel. Contactez-moi pour un devis gratuit."}</p>
            {badges.length > 0 && (
              <div style={{ display: "flex", gap: 6, marginTop: 14, flexWrap: "wrap" }}>
                {badges.map((b) => (
                  <span key={b} style={{ background: `color-mix(in srgb, ${primary} 10%, white)`, color: primary, padding: "4px 10px", borderRadius: 6, fontSize: 11, fontWeight: 600 }}>{b}</span>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Services */}
      {services.length > 0 && (
        <section style={{ background: "#fff", padding: "48px 32px" }}>
          <div style={{ maxWidth: 960, margin: "0 auto" }}>
            <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 24, fontWeight: 700, color: "#1C1C1E", marginBottom: 20 }}>Prestations</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14 }}>
              {services.map((s) => (
                <div key={s.id} style={{ background: "#FAF8F5", borderRadius: 14, padding: 24, border: "1px solid #EDEBE7" }}>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: "#1C1C1E", marginBottom: 6 }}>{s.titre}</h3>
                  {s.description && <p style={{ fontSize: 13, color: "#6B6560", lineHeight: 1.5 }}>{s.description}</p>}
                  {s.prixIndicatif && <p style={{ fontSize: 14, fontWeight: 600, color: primary, marginTop: 10 }}>{s.prixIndicatif}</p>}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Photos */}
      <section style={{ background: "#FAF8F5", padding: "48px 32px" }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <PhotoGallery photos={a.photos || []} layout={(a.photoLayout || "grid") as PhotoLayoutType} primary={primary} metierNom={a.metierNom} ville={a.ville} />
        </div>
      </section>

      {/* Devis + Contact */}
      <section id="devis" style={{ background: "#fff", padding: "32px 0 60px" }}>
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
