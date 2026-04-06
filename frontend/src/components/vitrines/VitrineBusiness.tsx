"use client";

import { useState } from "react";
import Image from "next/image";
import type { ArtisanPublic } from "@/lib/api";
import DevisForm3Steps from "@/components/DevisForm3Steps";
import type { VitrineConfig, SeoGenerated } from "@/lib/vitrine-config";
import { getVitrineConfig } from "@/lib/vitrine-config";

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

  const aboutText = seoGenerated?.aboutText || a.description || "";
  const faq = seoGenerated?.faq || [];

  // Build ordered sections
  const orderedSections = config.ordre.filter(id => sec[id] !== false);

  function renderSection(id: string) {
    switch (id) {
      case "hero": return <SectionHero key={id} a={a} primary={primary} onDevis={() => setDevisOpen(true)} />;
      case "services": return a.services && a.services.length > 0 ? <SectionServices key={id} a={a} /> : null;
      case "photos": return a.photos && a.photos.length > 0 ? <SectionPhotos key={id} a={a} /> : null;
      case "description": return aboutText ? <SectionAbout key={id} text={aboutText} name={a.nomAffichage} /> : null;
      case "avis": return a.nombreAvis > 0 ? <SectionAvis key={id} a={a} /> : null;
      case "devis": return <SectionDevis key={id} a={a} villeSlug={villeSlug} devisOpen={devisOpen} setDevisOpen={setDevisOpen} primary={primary} />;
      case "horaires": return a.horaires && a.horaires.length > 0 ? <SectionHoraires key={id} a={a} /> : null;
      case "zone": return <SectionZone key={id} a={a} /> ;
      case "contact": return <SectionContact key={id} a={a} />;
      case "faq": return faq.length > 0 ? <SectionFaq key={id} faq={faq} a={a} /> : null;
      default: return null;
    }
  }

  return (
    <div style={{ background: "#FFFFFF", color: "#1C1C1E" }}>
      {/* Sticky minimal header */}
      <header style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(255,255,255,.95)", backdropFilter: "blur(12px)", borderBottom: "1px solid #F3F4F6", padding: "10px 24px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
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

      {/* Sections */}
      <main>
        {orderedSections.map(id => renderSection(id))}
      </main>

      {/* Footer discret */}
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

/* ── Section Components ── */

function SectionHero({ a, primary, onDevis }: { a: ArtisanPublic; primary: string; onDevis: () => void }) {
  return (
    <section style={{ maxWidth: 800, margin: "0 auto", padding: "80px 24px 64px", textAlign: "center" }}>
      <h1 style={{ fontFamily: "'Fraunces',serif", fontSize: "clamp(32px,5vw,48px)", fontWeight: 700, color: "#1C1C1E", lineHeight: 1.15, marginBottom: 12 }}>
        {a.nomAffichage}
      </h1>
      <p style={{ fontSize: 18, color: "#6B7280", marginBottom: 16 }}>
        {a.metierNom || "Artisan"} &agrave; {a.ville || "votre ville"}
      </p>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, fontSize: 14, color: "#9CA3AF", marginBottom: 32 }}>
        {a.noteMoyenne > 0 && (
          <span style={{ color: "#374151", fontWeight: 600 }}>
            <span style={{ color: "#F59E0B" }}>&#9733;</span> {a.noteMoyenne.toFixed(1)}/5 <span style={{ fontWeight: 400, color: "#9CA3AF" }}>({a.nombreAvis} avis)</span>
          </span>
        )}
        {a.experienceAnnees && a.experienceAnnees > 0 && <span>{a.experienceAnnees} ans d&apos;exp&eacute;rience</span>}
        {a.zoneRayonKm && <span>Rayon {a.zoneRayonKm} km</span>}
      </div>
      <button onClick={onDevis} style={{ padding: "14px 32px", borderRadius: 12, background: primary, color: "#fff", fontSize: 16, fontWeight: 600, border: "none", cursor: "pointer" }}>
        Demander un devis gratuit
      </button>
    </section>
  );
}

function SectionServices({ a }: { a: ArtisanPublic }) {
  return (
    <section style={{ maxWidth: 800, margin: "0 auto", padding: "64px 24px", borderTop: "1px solid #F3F4F6" }}>
      <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 24, fontWeight: 700, color: "#1C1C1E", marginBottom: 32 }}>Nos services</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: 16 }}>
        {(a.services || []).map(s => (
          <div key={s.id} style={{ padding: "20px 0", borderBottom: "1px solid #F9FAFB" }}>
            <div style={{ fontSize: 15, fontWeight: 600, color: "#1C1C1E", marginBottom: 4 }}>{s.titre}</div>
            {s.description && <div style={{ fontSize: 13, color: "#6B7280", lineHeight: 1.5 }}>{s.description}</div>}
            {s.prixIndicatif && <div style={{ fontSize: 13, fontWeight: 600, color: "#C4531A", marginTop: 6 }}>{s.prixIndicatif}</div>}
          </div>
        ))}
      </div>
    </section>
  );
}

function SectionPhotos({ a }: { a: ArtisanPublic }) {
  return (
    <section style={{ maxWidth: 800, margin: "0 auto", padding: "64px 24px", borderTop: "1px solid #F3F4F6" }}>
      <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 24, fontWeight: 700, color: "#1C1C1E", marginBottom: 32 }}>R&eacute;alisations</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: 12 }}>
        {(a.photos || []).map(p => (
          <div key={p.id} style={{ borderRadius: 8, overflow: "hidden", position: "relative", aspectRatio: "4/3" }}>
            <Image src={p.url} alt={p.titre || `${a.nomAffichage} - ${a.metierNom}`} fill style={{ objectFit: "cover" }} unoptimized />
          </div>
        ))}
      </div>
    </section>
  );
}

function SectionAbout({ text, name }: { text: string; name: string }) {
  return (
    <section style={{ maxWidth: 800, margin: "0 auto", padding: "64px 24px", borderTop: "1px solid #F3F4F6" }}>
      <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 24, fontWeight: 700, color: "#1C1C1E", marginBottom: 24 }}>&Agrave; propos de {name}</h2>
      <p style={{ fontSize: 16, color: "#374151", lineHeight: 1.8, maxWidth: 640 }}>{text}</p>
    </section>
  );
}

function SectionAvis({ a }: { a: ArtisanPublic }) {
  return (
    <section style={{ maxWidth: 800, margin: "0 auto", padding: "64px 24px", borderTop: "1px solid #F3F4F6" }}>
      <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 24, fontWeight: 700, color: "#1C1C1E", marginBottom: 8 }}>Avis clients</h2>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 32 }}>
        <span style={{ fontFamily: "'Fraunces',serif", fontSize: 32, fontWeight: 700, color: "#1C1C1E" }}>{a.noteMoyenne.toFixed(1)}</span>
        <div>
          <div style={{ color: "#F59E0B", fontSize: 16 }}>{"&#9733;".repeat(Math.round(a.noteMoyenne))}</div>
          <div style={{ fontSize: 13, color: "#9CA3AF" }}>{a.nombreAvis} avis v&eacute;rifi&eacute;s</div>
        </div>
      </div>
      <p style={{ fontSize: 14, color: "#9CA3AF" }}>Les avis sont collect&eacute;s aupr&egrave;s de clients ayant effectivement fait appel &agrave; {a.nomAffichage}.</p>
    </section>
  );
}

function SectionDevis({ a, villeSlug, devisOpen, setDevisOpen, primary }: { a: ArtisanPublic; villeSlug: string; devisOpen: boolean; setDevisOpen: (v: boolean) => void; primary: string }) {
  return (
    <section id="devis-section" style={{ maxWidth: 800, margin: "0 auto", padding: "64px 24px", borderTop: "1px solid #F3F4F6" }}>
      <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 24, fontWeight: 700, color: "#1C1C1E", marginBottom: 8 }}>Devis gratuit</h2>
      <p style={{ fontSize: 14, color: "#6B7280", marginBottom: 24 }}>D&eacute;crivez votre projet, {a.nomAffichage} vous r&eacute;pond sous 24h.</p>
      {devisOpen ? (
        <DevisForm3Steps slug={a.slug} artisanName={a.nomAffichage} ville={a.ville || villeSlug} />
      ) : (
        <button onClick={() => setDevisOpen(true)} style={{ padding: "14px 32px", borderRadius: 12, background: primary, color: "#fff", fontSize: 15, fontWeight: 600, border: "none", cursor: "pointer" }}>
          Demander un devis gratuit
        </button>
      )}
    </section>
  );
}

function SectionHoraires({ a }: { a: ArtisanPublic }) {
  const horaires = (a.horaires || []).filter(h => h.ouvert);
  if (horaires.length === 0) return null;
  return (
    <section style={{ maxWidth: 800, margin: "0 auto", padding: "64px 24px", borderTop: "1px solid #F3F4F6" }}>
      <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 24, fontWeight: 700, color: "#1C1C1E", marginBottom: 24 }}>Horaires</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {(a.horaires || []).map(h => (
          <div key={h.jourSemaine} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #F9FAFB", fontSize: 14 }}>
            <span style={{ color: "#374151", fontWeight: 500 }}>{JOURS[h.jourSemaine]}</span>
            <span style={{ color: h.ouvert ? "#374151" : "#D1D5DB" }}>
              {h.ouvert ? `${h.heureOuverture} \u2013 ${h.heureFermeture}` : "Ferm\u00e9"}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

function SectionZone({ a }: { a: ArtisanPublic }) {
  return (
    <section style={{ maxWidth: 800, margin: "0 auto", padding: "64px 24px", borderTop: "1px solid #F3F4F6" }}>
      <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 24, fontWeight: 700, color: "#1C1C1E", marginBottom: 24 }}>Zone d&apos;intervention</h2>
      <p style={{ fontSize: 15, color: "#374151" }}>
        {a.nomAffichage} intervient dans un rayon de <strong>{a.zoneRayonKm || 25} km</strong> autour de {a.ville || "sa ville"}.
      </p>
      {a.zones && a.zones.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 16 }}>
          {a.zones.map(z => <span key={z} style={{ padding: "6px 14px", borderRadius: 20, background: "#F3F4F6", fontSize: 13, color: "#374151" }}>{z}</span>)}
        </div>
      )}
    </section>
  );
}

function SectionContact({ a }: { a: ArtisanPublic }) {
  return (
    <section style={{ maxWidth: 800, margin: "0 auto", padding: "64px 24px", borderTop: "1px solid #F3F4F6" }}>
      <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 24, fontWeight: 700, color: "#1C1C1E", marginBottom: 24 }}>Contact</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: 24, fontSize: 14 }}>
        {a.telephone && (
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#9CA3AF", marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.5 }}>T&eacute;l&eacute;phone</div>
            <a href={`tel:${a.telephone.replace(/\s/g, "")}`} style={{ color: "#1C1C1E", fontWeight: 600, textDecoration: "none" }}>{a.telephone}</a>
          </div>
        )}
        {a.adresse && (
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#9CA3AF", marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.5 }}>Adresse</div>
            <div style={{ color: "#374151" }}>{a.adresse}{a.codePostal ? `, ${a.codePostal}` : ""} {a.ville || ""}</div>
          </div>
        )}
      </div>
    </section>
  );
}

function SectionFaq({ faq, a }: { faq: Array<{ question: string; answer: string }>; a: ArtisanPublic }) {
  return (
    <section style={{ maxWidth: 800, margin: "0 auto", padding: "64px 24px", borderTop: "1px solid #F3F4F6" }}>
      <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 24, fontWeight: 700, color: "#1C1C1E", marginBottom: 32 }}>Questions fr&eacute;quentes</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        {faq.map((f, i) => (
          <div key={i}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: "#1C1C1E", marginBottom: 8 }}>{f.question}</h3>
            <p style={{ fontSize: 14, color: "#6B7280", lineHeight: 1.7 }}>{f.answer}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
