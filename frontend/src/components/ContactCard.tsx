"use client";

import { useState } from "react";
import type { ArtisanPublic } from "@/lib/api";

const JOURS = ["", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];
const TODAY = new Date().getDay() || 7; // 1=lundi..7=dimanche

export default function ContactCard({ a }: { a: ArtisanPublic }) {
  const [horOpen, setHorOpen] = useState(false);
  const initials = (a.nomAffichage || "?").split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div className="contact-card">
      {/* Header */}
      <div className="contact-header">
        <div className="contact-avatar">{initials}<div className="contact-online" /></div>
        <div>
          <div className="contact-name">{a.nomAffichage}</div>
          <div className="contact-metier">{a.metierNom} &middot; {a.ville}</div>
          <div className="contact-rating">
            <svg viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
            <strong>{a.noteMoyenne?.toFixed(1)}</strong> <span>({a.nombreAvis} avis)</span>
          </div>
        </div>
      </div>

      <div className="contact-sep" />

      {/* T&eacute;l */}
      <div className="contact-row">
        <svg className="contact-row-icon" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 01-2.18 2A19.79 19.79 0 013 5.18 2 2 0 015 3h3a2 2 0 012 1.72c.12.96.36 1.9.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.91.34 1.85.58 2.81.7A2 2 0 0122 16.92z" /></svg>
        <div><div className="contact-row-label">T&eacute;l&eacute;phone</div><div className="contact-row-value"><a href={`tel:${a.telephone?.replace(/\s/g, "")}`}>{a.telephone}</a></div></div>
      </div>

      {/* Adresse */}
      <div className="contact-row">
        <svg className="contact-row-icon" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg>
        <div><div className="contact-row-label">Adresse</div><div className="contact-row-value">{a.ville}, {a.codePostal}</div></div>
      </div>

      {/* Zone */}
      <div className="contact-row">
        <svg className="contact-row-icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
        <div><div className="contact-row-label">Zone d&apos;intervention</div><div className="contact-row-value">{a.zoneRayonKm} km autour de {a.ville}</div></div>
      </div>

      {/* Horaires accordion */}
      {a.horaires?.length > 0 && (
        <>
          <div className={`horaires-toggle ${horOpen ? "open" : ""}`} onClick={() => setHorOpen(!horOpen)}>
            Horaires d&apos;ouverture
            <svg viewBox="0 0 24 24" style={{ transform: horOpen ? "rotate(180deg)" : "none" }}><path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </div>
          {horOpen && (
            <div style={{ paddingBottom: 8 }}>
              {(a.horaires||[]).map((h) => (
                <div key={h.jourSemaine} className="horaire-row" style={h.jourSemaine === TODAY ? { fontWeight: 600, color: "#1C1C1E" } : {}}>
                  <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    {h.jourSemaine === TODAY && <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#C4531A" }} />}
                    {JOURS[h.jourSemaine]}
                  </span>
                  <span style={!h.ouvert ? { color: "#C4531A" } : {}}>{h.ouvert ? `${h.heureOuverture} - ${h.heureFermeture}` : "Ferm\u00e9"}</span>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      <div className="contact-sep" />

      {/* Badges */}
      <div className="contact-badges">
        <span className="contact-badge green">&#10003; Profil v&eacute;rifi&eacute;</span>
        {a.badgesNoms?.map((b) => (
          <span key={b} className={`contact-badge ${["RGE", "Qualibat", "Qualifelec", "QualitENR"].includes(b) ? "terre" : "green"}`}>{b}</span>
        ))}
      </div>

      {/* Call button */}
      <button className="contact-btn-call" onClick={() => window.location.href = `tel:${a.telephone?.replace(/\s/g, "")}`}>
        <svg viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 01-2.18 2A19.79 19.79 0 013 5.18 2 2 0 015 3h3a2 2 0 012 1.72c.12.96.36 1.9.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.91.34 1.85.58 2.81.7A2 2 0 0122 16.92z" /></svg>
        Appeler
      </button>
    </div>
  );
}
