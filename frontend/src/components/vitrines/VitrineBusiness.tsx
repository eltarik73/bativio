"use client";

import { useState } from "react";
import Image from "next/image";
import type { ArtisanPublic } from "@/lib/api";
import DevisForm3Steps from "@/components/DevisForm3Steps";
import type { SeoGenerated } from "@/lib/vitrine-config";
import { getVitrineConfig } from "@/lib/vitrine-config";
import { getDefaultContent } from "@/lib/vitrine-defaults";

const JOURS = ["", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];

interface Props {
  a: ArtisanPublic;
  photo: string;
  primary: string;
  accent: string;
  villeSlug: string;
  vitrineConfig?: unknown;
  seoGenerated?: SeoGenerated | null;
}

export default function VitrineBusiness({ a, photo, primary, villeSlug, vitrineConfig: rawConfig, seoGenerated }: Props) {
  const [devisOpen, setDevisOpen] = useState(false);
  const config = getVitrineConfig(rawConfig);
  const sec = config.sections;

  // Smart defaults from metier
  const metierSlug = (a.metierNom || "autre").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "-");
  const defaults = getDefaultContent(metierSlug);

  const aboutText = seoGenerated?.aboutText || a.description || defaults.description;
  const faq = seoGenerated?.faq || [];
  const hasRealServices = a.services && a.services.length > 0;
  const services = hasRealServices ? a.services! : defaults.services.map((s, i) => ({ id: String(i), titre: s.titre, description: s.description, prixIndicatif: s.prix || "", ordre: i }));
  const hasRealPhotos = a.photos && a.photos.length > 1;
  const galleryPhotos = hasRealPhotos ? a.photos!.map(p => p.url) : defaults.galleryPhotos;
  const heroImg = a.photos && a.photos.length > 0 ? a.photos[0].url : defaults.heroPhotos[0] || photo;
  const whyChoose = defaults.whyChoose;

  const orderedSections = config.ordre.filter(id => sec[id] !== false);

  function renderSection(id: string) {
    switch (id) {
      case "hero": return <HeroSection key={id} />;
      case "services": return <ServicesSection key={id} />;
      case "photos": return <PhotosSection key={id} />;
      case "description": return <AboutSection key={id} />;
      case "avis": return <AvisSection key={id} />;
      case "devis": return <DevisSection key={id} />;
      case "horaires": return a.horaires && a.horaires.length > 0 && a.horaires.some(h => h.ouvert) ? <HorairesSection key={id} /> : null;
      case "zone": return <ZoneSection key={id} />;
      case "contact": return <ContactSection key={id} />;
      case "faq": return faq.length > 0 ? <FaqSection key={id} /> : null;
      default: return null;
    }
  }

  /* ── HERO ── */
  function HeroSection() {
    return (
      <section style={{ position: "relative", overflow: "hidden", minHeight: 480 }}>
        <Image src={heroImg} alt={`${a.nomAffichage} - ${a.metierNom || "Artisan"}`} fill style={{ objectFit: "cover" }} priority />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,.25) 0%, rgba(0,0,0,.65) 100%)" }} />
        <div style={{ position: "relative", zIndex: 1, maxWidth: 800, margin: "0 auto", padding: "100px 24px 80px", color: "#fff" }}>
          <h1 style={{ fontFamily: "'Fraunces',serif", fontSize: "clamp(36px,6vw,56px)", fontWeight: 700, lineHeight: 1.1, marginBottom: 12 }}>
            {a.nomAffichage}
          </h1>
          <p style={{ fontSize: 20, opacity: 0.85, marginBottom: 24 }}>
            {a.metierNom || "Artisan"} &agrave; {a.ville || "votre ville"}
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 16, fontSize: 14, opacity: 0.7, marginBottom: 32 }}>
            {a.experienceAnnees && a.experienceAnnees > 0 && <span>{a.experienceAnnees} ans d&apos;exp&eacute;rience</span>}
            {a.noteMoyenne > 0 && <span>{a.noteMoyenne.toFixed(1)}/5 ({a.nombreAvis} avis)</span>}
            {a.zoneRayonKm && <span>Rayon {a.zoneRayonKm} km</span>}
          </div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <button onClick={() => { setDevisOpen(true); setTimeout(() => document.getElementById("devis-section")?.scrollIntoView({ behavior: "smooth" }), 100); }} style={{ padding: "14px 32px", borderRadius: 12, background: primary, color: "#fff", fontSize: 16, fontWeight: 600, border: "none", cursor: "pointer" }}>
              Demander un devis gratuit
            </button>
            {a.telephone && (
              <a href={`tel:${a.telephone.replace(/\s/g, "")}`} style={{ padding: "14px 32px", borderRadius: 12, border: "2px solid rgba(255,255,255,.4)", color: "#fff", fontSize: 16, fontWeight: 600, textDecoration: "none", backdropFilter: "blur(8px)" }}>
                {a.telephone}
              </a>
            )}
          </div>
        </div>
      </section>
    );
  }

  /* ── WHY CHOOSE + STATS ── */
  function StatsBar() {
    return (
      <section style={{ background: "#F9FAFB", borderBottom: "1px solid #F3F4F6" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", padding: "32px 24px", display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 32 }}>
          {whyChoose.map((w, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <svg width="18" height="18" fill="none" stroke={primary} strokeWidth="2" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" /></svg>
              <span style={{ fontSize: 14, fontWeight: 500, color: "#374151" }}>{w}</span>
            </div>
          ))}
        </div>
      </section>
    );
  }

  /* ── SERVICES ── */
  function ServicesSection() {
    return (
      <section style={{ maxWidth: 800, margin: "0 auto", padding: "72px 24px" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 28, fontWeight: 700, color: "#1C1C1E", marginBottom: 8 }}>Nos services</h2>
          <p style={{ fontSize: 15, color: "#6B7280" }}>Des solutions adapt&eacute;es &agrave; tous vos besoins</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 16 }}>
          {services.map(s => (
            <div key={s.id} style={{ padding: 24, borderRadius: 12, border: "1px solid #F3F4F6", background: "#FAFAFA", transition: "all .2s" }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: "#1C1C1E", marginBottom: 8 }}>{s.titre}</h3>
              <p style={{ fontSize: 13, color: "#6B7280", lineHeight: 1.6, marginBottom: 12 }}>{s.description}</p>
              {s.prixIndicatif && <span style={{ fontSize: 13, fontWeight: 600, color: primary }}>{s.prixIndicatif}</span>}
            </div>
          ))}
        </div>
      </section>
    );
  }

  /* ── PHOTOS ── */
  function PhotosSection() {
    return (
      <section style={{ background: "#F9FAFB", borderTop: "1px solid #F3F4F6", borderBottom: "1px solid #F3F4F6" }}>
        <div style={{ maxWidth: 960, margin: "0 auto", padding: "72px 24px" }}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 28, fontWeight: 700, color: "#1C1C1E", marginBottom: 8 }}>R&eacute;alisations</h2>
            <p style={{ fontSize: 15, color: "#6B7280" }}>D&eacute;couvrez nos travaux r&eacute;cents</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 12 }}>
            {galleryPhotos.map((url, i) => (
              <div key={i} style={{ borderRadius: 12, overflow: "hidden", position: "relative", aspectRatio: "4/3", boxShadow: "0 2px 12px rgba(0,0,0,.06)" }}>
                <Image src={url} alt={`${a.nomAffichage} - r\u00e9alisation ${i + 1}`} fill style={{ objectFit: "cover" }} />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  /* ── ABOUT ── */
  function AboutSection() {
    return (
      <section style={{ maxWidth: 800, margin: "0 auto", padding: "72px 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "center" }} className="max-md:!grid-cols-1">
          <div>
            <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 28, fontWeight: 700, color: "#1C1C1E", marginBottom: 16 }}>&Agrave; propos</h2>
            <p style={{ fontSize: 16, color: "#374151", lineHeight: 1.8 }}>{aboutText}</p>
            {a.experienceAnnees && a.experienceAnnees > 0 && (
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 24, padding: "16px 20px", borderRadius: 12, background: "#F9FAFB", border: "1px solid #F3F4F6" }}>
                <div style={{ fontFamily: "'Fraunces',serif", fontSize: 32, fontWeight: 700, color: primary }}>{a.experienceAnnees}</div>
                <div style={{ fontSize: 14, color: "#6B7280" }}>ann&eacute;es<br />d&apos;exp&eacute;rience</div>
              </div>
            )}
          </div>
          <div style={{ borderRadius: 16, overflow: "hidden", position: "relative", aspectRatio: "4/3" }}>
            <Image src={defaults.heroPhotos[defaults.heroPhotos.length > 1 ? 1 : 0] || photo} alt={`${a.nomAffichage} - ${a.metierNom}`} fill style={{ objectFit: "cover" }} />
          </div>
        </div>
      </section>
    );
  }

  /* ── AVIS ── */
  function AvisSection() {
    if (a.nombreAvis <= 0) return null;
    return (
      <section style={{ background: "#F9FAFB", borderTop: "1px solid #F3F4F6", borderBottom: "1px solid #F3F4F6" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", padding: "72px 24px", textAlign: "center" }}>
          <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 28, fontWeight: 700, color: "#1C1C1E", marginBottom: 24 }}>Avis clients</h2>
          <div style={{ fontFamily: "'Fraunces',serif", fontSize: 48, fontWeight: 700, color: "#1C1C1E" }}>{a.noteMoyenne.toFixed(1)}</div>
          <div style={{ color: "#F59E0B", fontSize: 24, marginTop: 4 }}>{"★".repeat(Math.round(a.noteMoyenne))}{"☆".repeat(5 - Math.round(a.noteMoyenne))}</div>
          <div style={{ fontSize: 14, color: "#6B7280", marginTop: 8 }}>{a.nombreAvis} avis v&eacute;rifi&eacute;s</div>
        </div>
      </section>
    );
  }

  /* ── DEVIS ── */
  function DevisSection() {
    return (
      <section id="devis-section" style={{ background: "#1C1C1E" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", padding: "72px 24px" }}>
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 28, fontWeight: 700, color: "#fff", marginBottom: 8 }}>Demandez votre devis gratuit</h2>
            <p style={{ fontSize: 15, color: "rgba(255,255,255,.5)" }}>D&eacute;crivez votre projet, {a.nomAffichage} vous r&eacute;pond sous 24h</p>
          </div>
          {devisOpen ? (
            <DevisForm3Steps slug={a.slug} artisanName={a.nomAffichage} ville={a.ville || villeSlug} />
          ) : (
            <div style={{ textAlign: "center" }}>
              <button onClick={() => setDevisOpen(true)} style={{ padding: "16px 40px", borderRadius: 12, background: primary, color: "#fff", fontSize: 16, fontWeight: 600, border: "none", cursor: "pointer" }}>
                Commencer ma demande
              </button>
              <div style={{ display: "flex", justifyContent: "center", gap: 24, marginTop: 24, fontSize: 13, color: "rgba(255,255,255,.4)" }}>
                <span>Gratuit</span>
                <span>Sans engagement</span>
                <span>R&eacute;ponse sous 24h</span>
              </div>
            </div>
          )}
        </div>
      </section>
    );
  }

  /* ── HORAIRES ── */
  function HorairesSection() {
    return (
      <section style={{ maxWidth: 800, margin: "0 auto", padding: "72px 24px" }}>
        <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 28, fontWeight: 700, color: "#1C1C1E", marginBottom: 24 }}>Horaires</h2>
        <div style={{ maxWidth: 400, display: "flex", flexDirection: "column", gap: 8 }}>
          {(a.horaires || []).map(h => (
            <div key={h.jourSemaine} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #F3F4F6", fontSize: 15 }}>
              <span style={{ color: "#374151", fontWeight: 500 }}>{JOURS[h.jourSemaine]}</span>
              <span style={{ color: h.ouvert ? "#374151" : "#D1D5DB", fontWeight: h.ouvert ? 600 : 400 }}>
                {h.ouvert ? `${h.heureOuverture} \u2013 ${h.heureFermeture}` : "Ferm\u00e9"}
              </span>
            </div>
          ))}
        </div>
      </section>
    );
  }

  /* ── ZONE ── */
  function ZoneSection() {
    return (
      <section style={{ background: "#F9FAFB", borderTop: "1px solid #F3F4F6", borderBottom: "1px solid #F3F4F6" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", padding: "72px 24px", textAlign: "center" }}>
          <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 28, fontWeight: 700, color: "#1C1C1E", marginBottom: 16 }}>Zone d&apos;intervention</h2>
          <p style={{ fontSize: 16, color: "#374151" }}>
            {a.nomAffichage} intervient dans un rayon de <strong>{a.zoneRayonKm || 25} km</strong> autour de <strong>{a.ville || "sa ville"}</strong>
          </p>
          {a.zones && a.zones.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 20, justifyContent: "center" }}>
              {a.zones.map(z => <span key={z} style={{ padding: "6px 16px", borderRadius: 20, background: "#fff", border: "1px solid #E5E7EB", fontSize: 13, color: "#374151" }}>{z}</span>)}
            </div>
          )}
        </div>
      </section>
    );
  }

  /* ── CONTACT ── */
  function ContactSection() {
    return (
      <section style={{ maxWidth: 800, margin: "0 auto", padding: "72px 24px" }}>
        <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 28, fontWeight: 700, color: "#1C1C1E", marginBottom: 24 }}>Contact</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: 24 }}>
          {a.telephone && (
            <div style={{ padding: 24, borderRadius: 12, border: "1px solid #F3F4F6", background: "#FAFAFA" }}>
              <svg width="24" height="24" fill="none" stroke={primary} strokeWidth="1.5" viewBox="0 0 24 24" style={{ marginBottom: 12 }}><path d="M22 16.92v3a2 2 0 01-2.18 2A19.79 19.79 0 013 5.18 2 2 0 015 3h3a2 2 0 012 1.72c.12.96.36 1.9.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.91.34 1.85.58 2.81.7A2 2 0 0122 16.92z" /></svg>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#9CA3AF", marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.5 }}>T&eacute;l&eacute;phone</div>
              <a href={`tel:${a.telephone.replace(/\s/g, "")}`} style={{ fontSize: 16, color: "#1C1C1E", fontWeight: 600, textDecoration: "none" }}>{a.telephone}</a>
            </div>
          )}
          {a.adresse && (
            <div style={{ padding: 24, borderRadius: 12, border: "1px solid #F3F4F6", background: "#FAFAFA" }}>
              <svg width="24" height="24" fill="none" stroke={primary} strokeWidth="1.5" viewBox="0 0 24 24" style={{ marginBottom: 12 }}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#9CA3AF", marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.5 }}>Adresse</div>
              <div style={{ fontSize: 15, color: "#374151" }}>{a.adresse}{a.codePostal ? `, ${a.codePostal}` : ""} {a.ville || ""}</div>
            </div>
          )}
          <div style={{ padding: 24, borderRadius: 12, border: "1px solid #F3F4F6", background: "#FAFAFA" }}>
            <svg width="24" height="24" fill="none" stroke={primary} strokeWidth="1.5" viewBox="0 0 24 24" style={{ marginBottom: 12 }}><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#9CA3AF", marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.5 }}>Disponibilit&eacute;</div>
            <div style={{ fontSize: 15, color: "#374151" }}>R&eacute;ponse sous 24h</div>
          </div>
        </div>
      </section>
    );
  }

  /* ── FAQ ── */
  function FaqSection() {
    return (
      <section style={{ background: "#F9FAFB", borderTop: "1px solid #F3F4F6" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", padding: "72px 24px" }}>
          <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 28, fontWeight: 700, color: "#1C1C1E", marginBottom: 32, textAlign: "center" }}>Questions fr&eacute;quentes</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {faq.map((f, i) => (
              <div key={i} style={{ padding: 24, borderRadius: 12, background: "#fff", border: "1px solid #F3F4F6" }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: "#1C1C1E", marginBottom: 8 }}>{f.question}</h3>
                <p style={{ fontSize: 14, color: "#6B7280", lineHeight: 1.7 }}>{f.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <div style={{ background: "#FFFFFF", color: "#1C1C1E" }}>
      {/* Sticky header */}
      <header style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(255,255,255,.95)", backdropFilter: "blur(12px)", borderBottom: "1px solid #F3F4F6", padding: "10px 24px" }}>
        <div style={{ maxWidth: 960, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <span style={{ fontFamily: "'Fraunces',serif", fontSize: 16, fontWeight: 700, color: "#1C1C1E" }}>{a.nomAffichage}</span>
            <span style={{ fontSize: 13, color: "#9CA3AF", marginLeft: 8 }}>{a.metierNom || "Artisan"}</span>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {a.telephone && (
              <a href={`tel:${a.telephone.replace(/\s/g, "")}`} style={{ padding: "8px 16px", borderRadius: 8, border: "1px solid #E5E7EB", fontSize: 13, fontWeight: 600, color: "#374151", textDecoration: "none" }}>Appeler</a>
            )}
            <button onClick={() => { setDevisOpen(true); document.getElementById("devis-section")?.scrollIntoView({ behavior: "smooth" }); }} style={{ padding: "8px 16px", borderRadius: 8, background: primary, color: "#fff", fontSize: 13, fontWeight: 600, border: "none", cursor: "pointer" }}>Devis gratuit</button>
          </div>
        </div>
      </header>

      <main>
        {orderedSections.map(id => {
          const el = renderSection(id);
          // Insert stats bar after hero
          if (id === "hero") return <>{el}<StatsBar /></>;
          return el;
        })}
      </main>

      {/* Footer */}
      <footer style={{ padding: "24px 0", textAlign: "center", borderTop: "1px solid #F3F4F6" }}>
        <span style={{ fontSize: 12, color: "#D1D5DB" }}>R&eacute;alis&eacute; avec Bativio</span>
      </footer>

      {/* Mobile CTA */}
      <div className="artisan-cta-mobile">
        {a.telephone && <a href={`tel:${a.telephone.replace(/\s/g, "")}`} className="call">Appeler</a>}
        <a href="#devis-section" className="devis" style={{ background: primary }}>Devis gratuit</a>
      </div>
    </div>
  );
}
