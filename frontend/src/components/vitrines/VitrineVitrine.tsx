"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { ArtisanPublic } from "@/lib/api";
import DevisForm3Steps from "@/components/DevisForm3Steps";
import ContactCard from "@/components/ContactCard";
import PhotoGallery from "@/components/vitrines/PhotoGallery";
import type { PhotoLayoutType } from "@/lib/vitrine-config";
import { METIER_PHOTOS } from "@/lib/metier-config";
import ChatDevis from "@/components/ChatDevis/ChatDevis";

const JOURS = ["", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];
const PLACEHOLDERS = Object.values(METIER_PHOTOS).slice(0, 4);

export default function VitrineVitrine({ a, photo, primary, accent, villeSlug }: { a: ArtisanPublic; photo: string; primary: string; accent: string; villeSlug: string }) {
  const sliderPhotos = (a.photos && a.photos.length > 0) ? a.photos.map((p) => p.url) : [photo, ...PLACEHOLDERS.slice(0, 2)];
  const [slideIdx, setSlideIdx] = useState(0);
  const [devisOpen, setDevisOpen] = useState(false);
  const [toast, setToast] = useState(false);
  const services = a.services ?? [];

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

      {/* Slider hero */}
      <section style={{ position: "relative", height: 420, overflow: "hidden" }}>
        <Image src={sliderPhotos[slideIdx]} alt={`${a.nomAffichage} - réalisation ${slideIdx + 1}`} fill style={{ objectFit: "cover", transition: "opacity .3s" }} unoptimized />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(transparent 40%, rgba(0,0,0,.4))" }} />
        {slideIdx > 0 && <button onClick={() => setSlideIdx(slideIdx - 1)} style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", width: 44, height: 44, borderRadius: "50%", background: "rgba(255,255,255,.9)", border: "none", fontSize: 18, cursor: "pointer", color: "#1C1C1E" }}>&larr;</button>}
        {slideIdx < sliderPhotos.length - 1 && <button onClick={() => setSlideIdx(slideIdx + 1)} style={{ position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)", width: 44, height: 44, borderRadius: "50%", background: "rgba(255,255,255,.9)", border: "none", fontSize: 18, cursor: "pointer", color: "#1C1C1E" }}>&rarr;</button>}
        <div style={{ position: "absolute", bottom: 16, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 6 }}>
          {sliderPhotos.map((_, i) => <span key={i} onClick={() => setSlideIdx(i)} style={{ width: i === slideIdx ? 20 : 8, height: 8, borderRadius: 4, background: i === slideIdx ? primary : "rgba(255,255,255,.5)", cursor: "pointer", transition: "all .2s" }} />)}
        </div>
      </section>

      {/* Name + badges + rating centered */}
      <section style={{ background: "#fff", padding: "40px 32px", textAlign: "center" }}>
        <h1 style={{ fontFamily: "'Fraunces',serif", fontSize: "clamp(28px,5vw,44px)", fontWeight: 700, color: "#1C1C1E" }}>{a.nomAffichage}</h1>
        <p style={{ fontSize: 16, color: "#9B9590", marginTop: 6 }}>{a.metierNom || "Artisan"} &agrave; {a.ville || "Chambéry"}</p>
        {(a.badgesNoms || []).length > 0 && (
          <div style={{ display: "flex", gap: 6, justifyContent: "center", marginTop: 14, flexWrap: "wrap" }}>
            {(a.badgesNoms || []).map((b) => (
              <span key={b} style={{ background: `color-mix(in srgb, ${primary} 10%, white)`, color: primary, padding: "5px 14px", borderRadius: 8, fontSize: 12, fontWeight: 600 }}>{b}</span>
            ))}
          </div>
        )}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 14 }}>
          <svg width="18" height="18" fill={accent} viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
          <span style={{ fontFamily: "'Fraunces',serif", fontSize: 20, fontWeight: 700, color: "#1C1C1E" }}>{a.noteMoyenne?.toFixed(1)}</span>
          <span style={{ fontSize: 14, color: "#9B9590" }}>({a.nombreAvis} avis)</span>
        </div>
        <div style={{ marginTop: 20 }}>
          <button onClick={() => setDevisOpen(true)} style={{ padding: "14px 28px", background: primary, color: "#fff", borderRadius: 10, fontSize: 15, fontWeight: 600, border: "none", cursor: "pointer" }}>Devis gratuit</button>
        </div>
      </section>

      {/* Alternating sections */}
      <section style={{ background: "#FAF8F5" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }} className="max-md:grid-cols-1">
          <div style={{ padding: "40px 32px" }}>
            <div style={{ maxWidth: 400, margin: "0 auto" }}>
              <div style={{ width: 44, height: 2, background: primary, marginBottom: 16 }} />
              <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 22, fontWeight: 700, color: "#1C1C1E", marginBottom: 12 }}>Pr&eacute;sentation</h2>
              <p style={{ fontSize: 15, color: "#6B6560", lineHeight: 1.7 }}>{a.description || "Artisan professionnel. Contactez-moi pour un devis gratuit."}</p>
              {a.experienceAnnees && <p style={{ fontSize: 14, color: "#9B9590", marginTop: 12 }}>{a.experienceAnnees} ans d&apos;exp&eacute;rience &middot; Rayon {a.zoneRayonKm} km</p>}
            </div>
          </div>
          <div style={{ position: "relative", minHeight: 280 }}>
            <Image src={sliderPhotos[1] || photo} alt={`${a.nomAffichage} - realisation`} fill style={{ objectFit: "cover" }} unoptimized />
          </div>
        </div>
      </section>

      {/* Services reversed */}
      {services.length > 0 && (
        <section style={{ background: "#fff" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }} className="max-md:grid-cols-1">
            <div style={{ position: "relative", minHeight: 280 }}>
              <Image src={sliderPhotos[2] || photo} alt={`${a.nomAffichage} - prestations`} fill style={{ objectFit: "cover" }} unoptimized />
            </div>
            <div style={{ padding: "40px 32px" }}>
              <div style={{ maxWidth: 400, margin: "0 auto" }}>
                <div style={{ width: 44, height: 2, background: primary, marginBottom: 16 }} />
                <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 22, fontWeight: 700, color: "#1C1C1E", marginBottom: 16 }}>Prestations</h2>
                {services.map((s) => (
                  <div key={s.id} style={{ padding: "12px 0", borderBottom: "1px solid #F7F5F2" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                      <h3 style={{ fontSize: 15, fontWeight: 600, color: "#1C1C1E" }}>{s.titre}</h3>
                      {s.prixIndicatif && <span style={{ fontSize: 13, fontWeight: 600, color: primary }}>{s.prixIndicatif}</span>}
                    </div>
                    {s.description && <p style={{ fontSize: 13, color: "#9B9590", marginTop: 2 }}>{s.description}</p>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Gallery */}
      {(a.photos ?? []).length > 0 && (
        <section style={{ background: "#FAF8F5", padding: "48px 32px" }}>
          <div style={{ maxWidth: 880, margin: "0 auto" }}>
            <PhotoGallery photos={a.photos || []} layout={(a.photoLayout || "slider") as PhotoLayoutType} primary={primary} metierNom={a.metierNom} ville={a.ville} />
          </div>
        </section>
      )}

      {/* Contact + horaires */}
      {(a.horaires ?? []).length > 0 && (
        <section style={{ background: "#1C1C1E", padding: "48px 32px", color: "#fff" }}>
          <div style={{ maxWidth: 880, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }} className="max-md:grid-cols-1">
            <div>
              <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 22, fontWeight: 700, marginBottom: 20 }}>Contact</h2>
              {a.telephone && (
                <>
                  <p style={{ fontSize: 12, color: "rgba(255,255,255,.35)", marginBottom: 3 }}>T&eacute;l&eacute;phone</p>
                  <p style={{ fontSize: 16, fontWeight: 500 }}><a href={`tel:${a.telephone.replace(/\s/g, "")}`} style={{ color: "#fff", textDecoration: "none" }}>{a.telephone}</a></p>
                </>
              )}
              <p style={{ fontSize: 12, color: "rgba(255,255,255,.35)", marginTop: 16, marginBottom: 3 }}>Adresse</p>
              <p style={{ fontSize: 15 }}>{a.adresse || ""}{a.adresse && a.codePostal ? ", " : ""}{a.codePostal || ""} {a.ville || ""}</p>
            </div>
            <div>
              <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 22, fontWeight: 700, marginBottom: 20 }}>Horaires</h2>
              {(a.horaires ?? []).map((h) => (
                <div key={h.jourSemaine} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, padding: "3px 0" }}>
                  <span style={{ color: "rgba(255,255,255,.55)" }}>{JOURS[h.jourSemaine]}</span>
                  <span>{h.ouvert && h.heureOuverture ? `${h.heureOuverture} - ${h.heureFermeture}` : h.ouvert ? "Ouvert" : "Fermé"}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Devis CTA full-width */}
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
