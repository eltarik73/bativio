import type { ArtisanPublic } from "@/lib/api";
import DevisForm from "@/components/DevisForm";
import PhotoGallery from "@/components/vitrines/PhotoGallery";
import type { PhotoLayoutType } from "@/lib/vitrine-config";

const JOURS = ["", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];

export default function VitrineClassique({ a, photo, primary, accent }: { a: ArtisanPublic; photo: string; primary: string; accent: string }) {
  return (
    <>
      {/* Hero */}
      <section style={{ background: "#1C1C1E", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, opacity: 0.18 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={photo} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(28,28,30,.5), rgba(28,28,30,.8), #1C1C1E)" }} />
        <div style={{ position: "relative", zIndex: 1, maxWidth: 880, margin: "0 auto", padding: "56px 32px 64px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ background: accent, color: "#1C1C1E", padding: "7px 16px", borderRadius: 22, fontFamily: "'Fraunces',serif", fontSize: 16, fontWeight: 700, display: "inline-flex", alignItems: "center", gap: 6 }}>
              <svg width="16" height="16" fill="#1C1C1E" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
              {a.noteMoyenne?.toFixed(1)}
            </span>
            <span style={{ fontSize: 13, color: "rgba(255,255,255,.45)" }}>{a.nombreAvis} avis</span>
          </div>
          <h1 style={{ fontFamily: "'Fraunces',serif", fontSize: "clamp(34px,6vw,60px)", fontWeight: 700, color: "#fff", lineHeight: 1.1, marginTop: 14 }}>{a.nomAffichage}</h1>
          <p style={{ fontSize: 18, color: "rgba(255,255,255,.45)", marginTop: 8 }}>{a.metierNom} &agrave; {a.ville}</p>
          {a.badgesNoms.length > 0 && (
            <div style={{ display: "flex", gap: 8, marginTop: 16, flexWrap: "wrap" }}>
              {a.badgesNoms.map((b) => (
                <span key={b} style={{ background: "rgba(255,255,255,.15)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,.2)", color: "#fff", padding: "6px 14px", borderRadius: 8, fontSize: 13, fontWeight: 500 }}>{b}</span>
              ))}
            </div>
          )}
          <div style={{ display: "flex", gap: 12, marginTop: 32 }}>
            <a href="#devis" style={{ padding: "14px 32px", background: primary, color: "#fff", borderRadius: 12, fontSize: 15, fontWeight: 600, textDecoration: "none" }}>Devis gratuit</a>
            <a href={`tel:${a.telephone?.replace(/\s/g, "")}`} style={{ padding: "14px 32px", border: "1px solid rgba(255,255,255,.2)", color: "#fff", borderRadius: 12, fontSize: 15, fontWeight: 600, textDecoration: "none" }}>{a.telephone}</a>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ background: "#FAF8F5", padding: "48px 32px" }}>
        <div style={{ maxWidth: 880, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
          {([
            ...(a.experienceAnnees ? [{ v: String(a.experienceAnnees), l: "ann\u00e9es d'exp\u00e9rience" }] : []),
            { v: String(a.nombreAvis), l: "avis clients" },
            { v: `${a.zoneRayonKm} km`, l: "rayon d'intervention" },
          ]).map((s, i) => (
            <div key={i} style={{ background: "#fff", borderRadius: 12, padding: 20, border: "1px solid #EDEBE7", textAlign: "center" }}>
              <div style={{ fontFamily: "'Fraunces',serif", fontSize: 32, fontWeight: 700, color: primary }}>{s.v}</div>
              <div style={{ fontSize: 13, color: "#9B9590", marginTop: 4 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Pr\u00e9sentation */}
      <section style={{ background: "#fff", padding: "48px 32px" }}>
        <div style={{ maxWidth: 880, margin: "0 auto" }}>
          <div style={{ width: 44, height: 2, background: primary, marginBottom: 16 }} />
          <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 24, fontWeight: 700, color: "#1C1C1E", marginBottom: 16 }}>Pr&eacute;sentation</h2>
          <p style={{ fontSize: 15, color: "#6B6560", lineHeight: 1.7 }}>{a.description}</p>
        </div>
      </section>

      {/* Services */}
      {a.services?.length > 0 && (
        <section style={{ background: "#FAF8F5", padding: "48px 32px" }}>
          <div style={{ maxWidth: 880, margin: "0 auto" }}>
            <div style={{ width: 44, height: 2, background: primary, marginBottom: 16 }} />
            <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 24, fontWeight: 700, color: "#1C1C1E", marginBottom: 20 }}>Services</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              {a.services.map((s) => (
                <div key={s.id} style={{ background: "#fff", border: "1px solid #EDEBE7", borderRadius: 14, padding: 24 }}>
                  <h3 style={{ fontFamily: "'Fraunces',serif", fontSize: 16, fontWeight: 700, color: "#1C1C1E", marginBottom: 6 }}>{s.titre}</h3>
                  <p style={{ fontSize: 13, color: "#6B6560", lineHeight: 1.5 }}>{s.description}</p>
                  {s.prixIndicatif && <p style={{ fontSize: 13, fontWeight: 600, color: primary, marginTop: 10 }}>{s.prixIndicatif}</p>}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Photos */}
      <section style={{ background: "#fff", padding: "48px 32px" }}>
        <div style={{ maxWidth: 880, margin: "0 auto" }}>
          <PhotoGallery photos={a.photos || []} layout={(a.photoLayout || "grid") as PhotoLayoutType} primary={primary} />
        </div>
      </section>

      {/* Zone */}
      {a.zones?.length > 0 && (
        <section style={{ background: "#FAF8F5", padding: "48px 32px" }}>
          <div style={{ maxWidth: 880, margin: "0 auto" }}>
            <div style={{ width: 44, height: 2, background: primary, marginBottom: 16 }} />
            <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 24, fontWeight: 700, color: "#1C1C1E", marginBottom: 16 }}>Zone d&apos;intervention</h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {a.zones.map((z) => <span key={z} style={{ padding: "9px 18px", background: "#fff", border: "1px solid #EDEBE7", borderRadius: 22, fontSize: 13, color: "#6B6560" }}>{z}</span>)}
            </div>
          </div>
        </section>
      )}

      {/* Devis */}
      <section id="devis" style={{ background: "#fff", padding: "48px 32px" }}>
        <div style={{ maxWidth: 560, margin: "0 auto", background: "#fff", border: "1.5px solid #EDEBE7", borderRadius: 20, padding: 36, boxShadow: "0 8px 40px rgba(28,28,30,.08)" }}>
          <DevisForm slug={a.slug} />
        </div>
      </section>

      {/* Contact + horaires */}
      {a.horaires?.length > 0 && (
        <section style={{ background: "#1C1C1E", padding: "48px 32px", color: "#fff" }}>
          <div style={{ maxWidth: 880, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
            <div>
              <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 22, fontWeight: 700, marginBottom: 20 }}>Contact</h2>
              <p style={{ fontSize: 12, color: "rgba(255,255,255,.35)", marginBottom: 3 }}>T&eacute;l&eacute;phone</p>
              <p style={{ fontSize: 16, fontWeight: 500 }}><a href={`tel:${a.telephone?.replace(/\s/g, "")}`} style={{ color: "#fff", textDecoration: "none" }}>{a.telephone}</a></p>
              <p style={{ fontSize: 12, color: "rgba(255,255,255,.35)", marginTop: 16, marginBottom: 3 }}>Adresse</p>
              <p style={{ fontSize: 15 }}>{a.adresse}, {a.codePostal} {a.ville}</p>
            </div>
            <div>
              <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 22, fontWeight: 700, marginBottom: 20 }}>Horaires</h2>
              {a.horaires.map((h) => (
                <div key={h.jourSemaine} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, padding: "3px 0" }}>
                  <span style={{ color: "rgba(255,255,255,.55)" }}>{JOURS[h.jourSemaine]}</span>
                  <span>{h.ouvert ? `${h.heureOuverture} - ${h.heureFermeture}` : "Ferm\u00e9"}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
