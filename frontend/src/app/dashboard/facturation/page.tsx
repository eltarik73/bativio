"use client";

import { useState, useEffect } from "react";

const TARGET = new Date("2026-09-01T00:00:00").getTime();

function useCountdown() {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const diff = Math.max(0, TARGET - now);
  return {
    jours: Math.floor(diff / (1000 * 60 * 60 * 24)),
    heures: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    secondes: Math.floor((diff / 1000) % 60),
  };
}

const CHECK = (
  <svg style={{ width: 14, height: 14, color: "#E8A84C", flexShrink: 0, marginTop: 1 }} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" /></svg>
);

const plans = [
  {
    name: "Essentiel",
    price: "19€/mois",
    icon: "\uD83D\uDCE5",
    desc: "Vous avez déjà un logiciel de facturation",
    features: [
      "Réception des factures via plateforme certifiée",
      "Consultation et téléchargement",
      "Notifications automatiques",
      "Archivage sécurisé",
    ],
    key: "ESSENTIEL",
  },
  {
    name: "Pro",
    price: "49€/mois",
    icon: "\uD83D\uDCE4",
    desc: "Transmettez vos factures en conformité",
    features: [
      "Tout Essentiel +",
      "Dépôt de factures (glisser-déposer)",
      "Transmission automatique vers plateforme certifiée",
      "Suivi des statuts en temps réel",
      "Export comptable CSV/Excel",
    ],
    key: "PRO",
    popular: true,
  },
  {
    name: "Pro+",
    price: "79€/mois",
    icon: "⚡",
    desc: "Bativio devient votre logiciel de facturation",
    features: [
      "Tout Pro +",
      "Création de factures dans Bativio",
      "Assistant IA pour les devis",
      "Calcul TVA et mentions légales automatiques",
      "Modèles personnalisables",
    ],
    key: "PRO_PLUS",
  },
];

const currentPlan = "PRO"; // placeholder

export default function FacturationPage() {
  const cd = useCountdown();
  const [email, setEmail] = useState("");

  const handleNotify = () => {
    if (email) {
      setEmail("");
      alert("Merci ! Nous vous préviendrons dès le lancement.");
    }
  };

  return (
    <div style={{ maxWidth: 900, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(232,168,76,.1)", color: "#E8A84C", fontSize: 12, fontWeight: 600, padding: "5px 14px", borderRadius: 20, marginBottom: 14 }}>
          &#9201; Bient&ocirc;t disponible
        </div>
        <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 28, fontWeight: 700, color: "#1C1C1E", marginBottom: 6 }}>
          Invoquo &mdash; Facturation &eacute;lectronique
        </h1>
        <p style={{ fontSize: 15, color: "#9B9590" }}>
          Soyez pr&ecirc;t pour la r&eacute;forme. Bativio vous accompagne.
        </p>
      </div>

      {/* Countdown */}
      <div style={{ background: "#1C1C1E", borderRadius: 16, padding: "28px 24px", marginBottom: 28 }}>
        <p style={{ textAlign: "center", fontSize: 13, color: "rgba(255,255,255,.4)", marginBottom: 18 }}>
          Obligation de r&eacute;ception des factures &eacute;lectroniques dans :
        </p>
        <div style={{ display: "flex", justifyContent: "center", gap: 12 }}>
          {[
            { v: cd.jours, l: "jours" },
            { v: cd.heures, l: "heures" },
            { v: cd.minutes, l: "min" },
            { v: cd.secondes, l: "sec" },
          ].map((b) => (
            <div key={b.l} style={{ background: "rgba(255,255,255,.06)", borderRadius: 12, padding: "16px 20px", minWidth: 80, textAlign: "center" }}>
              <div style={{ fontFamily: "'Fraunces', serif", fontSize: 42, fontWeight: 700, color: "#fff", lineHeight: 1 }}>
                {String(b.v).padStart(2, "0")}
              </div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,.35)", marginTop: 4, textTransform: "uppercase", letterSpacing: 1 }}>
                {b.l}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Ce qui change */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 28 }}>
        <div style={{ background: "#fff", border: "1px solid #EDEBE7", borderRadius: 14, padding: 22 }}>
          <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
            <span style={{ fontSize: 22, flexShrink: 0 }}>&#9888;&#65039;</span>
            <div>
              <p style={{ fontFamily: "'Fraunces', serif", fontSize: 14, fontWeight: 700, color: "#1C1C1E", marginBottom: 6 }}>1er septembre 2026</p>
              <p style={{ fontSize: 13, color: "#6B6560", lineHeight: 1.5 }}>
                Toutes les entreprises doivent pouvoir <strong>recevoir</strong> des factures &eacute;lectroniques. <span style={{ color: "#dc2626", fontWeight: 600 }}>15&euro; d&apos;amende</span> par facture non conforme.
              </p>
            </div>
          </div>
        </div>
        <div style={{ background: "#fff", border: "1px solid #EDEBE7", borderRadius: 14, padding: 22 }}>
          <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
            <span style={{ fontSize: 22, flexShrink: 0 }}>&#8505;&#65039;</span>
            <div>
              <p style={{ fontFamily: "'Fraunces', serif", fontSize: 14, fontWeight: 700, color: "#1C1C1E", marginBottom: 6 }}>1er septembre 2027</p>
              <p style={{ fontSize: 13, color: "#6B6560", lineHeight: 1.5 }}>
                Obligation d&apos;<strong>&eacute;mission</strong> de factures &eacute;lectroniques pour toutes les TPE/PME. Le papier ne sera plus accept&eacute;.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Plans Invoquo */}
      <div style={{ marginBottom: 32 }}>
        <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 22, fontWeight: 700, color: "#1C1C1E", marginBottom: 16 }}>
          Invoquo vous prot&egrave;ge
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
          {plans.map((p) => {
            const isCurrent = p.key === currentPlan;
            return (
              <div key={p.key} style={{
                background: "#fff",
                border: isCurrent ? "2px solid #C4531A" : "1px solid #EDEBE7",
                borderRadius: 14,
                padding: 24,
                display: "flex",
                flexDirection: "column",
                position: "relative",
              }}>
                {isCurrent && (
                  <div style={{ position: "absolute", top: -10, left: "50%", transform: "translateX(-50%)", background: "#C4531A", color: "#fff", fontSize: 9, fontWeight: 600, padding: "3px 12px", borderRadius: 20, whiteSpace: "nowrap", textTransform: "uppercase", letterSpacing: 0.5 }}>
                    Votre plan
                  </div>
                )}
                <div style={{ fontSize: 32, marginBottom: 10 }}>{p.icon}</div>
                <div style={{ fontFamily: "'Fraunces', serif", fontSize: 18, fontWeight: 700, color: "#1C1C1E" }}>{p.name}</div>
                <div style={{ fontSize: 13, color: "#E8A84C", fontWeight: 600, marginTop: 2 }}>{p.price}</div>
                <p style={{ fontSize: 13, color: "#9B9590", margin: "10px 0 14px", lineHeight: 1.4 }}>{p.desc}</p>
                <ul style={{ listStyle: "none", flex: 1, marginBottom: 16 }}>
                  {p.features.map((f) => (
                    <li key={f} style={{ fontSize: 12, padding: "3px 0", display: "flex", alignItems: "flex-start", gap: 5, color: "#6B6560" }}>
                      {CHECK}
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <button
                  disabled
                  style={{
                    display: "block",
                    width: "100%",
                    textAlign: "center",
                    padding: 10,
                    borderRadius: 8,
                    fontSize: 12,
                    fontWeight: 600,
                    border: "1px solid #EDEBE7",
                    color: "#9B9590",
                    background: "transparent",
                    cursor: "not-allowed",
                  }}
                >
                  Me pr&eacute;venir du lancement
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Normes */}
      <div style={{ background: "#fff", border: "1px solid #EDEBE7", borderRadius: 14, padding: 24, marginBottom: 28 }}>
        <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 18, fontWeight: 700, color: "#1C1C1E", marginBottom: 12 }}>
          Normes et certifications
        </h2>
        <div style={{ display: "flex", gap: 12, marginBottom: 14, flexWrap: "wrap" }}>
          {["Factur-X", "PPF", "DGFIP", "UBL", "CII"].map((n) => (
            <span key={n} style={{ fontSize: 11, fontWeight: 600, padding: "5px 12px", borderRadius: 6, background: "rgba(196,83,26,.07)", color: "#C4531A", letterSpacing: 0.3 }}>{n}</span>
          ))}
        </div>
        <p style={{ fontSize: 13, color: "#6B6560", lineHeight: 1.6 }}>
          Invoquo sera connect&eacute; &agrave; une plateforme d&apos;acc&egrave;s certifi&eacute;e par l&apos;&Eacute;tat. Vos factures seront conformes aux formats Factur-X, UBL et CII.
        </p>
        <p style={{ fontSize: 12, color: "#9B9590", marginTop: 10, fontStyle: "italic" }}>
          Bativio n&apos;est pas une plateforme de d&eacute;mat&eacute;rialisation. Invoquo orchestre la connexion avec des partenaires certifi&eacute;s pour garantir votre conformit&eacute;.
        </p>
      </div>

      {/* Comment ca marche */}
      <div style={{ background: "#F7F5F2", borderRadius: 14, padding: 28, marginBottom: 28 }}>
        <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 18, fontWeight: 700, color: "#1C1C1E", marginBottom: 20, textAlign: "center" }}>
          Comment &ccedil;a marche
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
          {[
            { n: "1", icon: "&#128100;", label: "Vous vous inscrivez sur Bativio" },
            { n: "2", icon: "&#128229;", label: "On active votre boîte de réception" },
            { n: "3", icon: "&#128231;", label: "Vos fournisseurs vous envoient leurs factures" },
            { n: "4", icon: "&#10004;", label: "Vous les retrouvez dans votre espace" },
          ].map((s, i) => (
            <div key={s.n} style={{ textAlign: "center", position: "relative" }}>
              <div style={{ width: 44, height: 44, borderRadius: "50%", background: "#fff", border: "2px solid #C4531A", display: "inline-flex", alignItems: "center", justifyContent: "center", fontFamily: "'Fraunces', serif", fontSize: 18, fontWeight: 700, color: "#C4531A", marginBottom: 10 }}>
                {s.n}
              </div>
              <div style={{ fontSize: 22, marginBottom: 6 }} dangerouslySetInnerHTML={{ __html: s.icon }} />
              <p style={{ fontSize: 12, color: "#6B6560", lineHeight: 1.4 }}>{s.label}</p>
              {i < 3 && (
                <div style={{ position: "absolute", top: 22, right: -8, color: "#C5C0B9", fontSize: 16 }}>&rarr;</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Footer CTA */}
      <div style={{ background: "#1C1C1E", borderRadius: 14, padding: 28, textAlign: "center", marginBottom: 40 }}>
        <p style={{ fontSize: 14, color: "rgba(255,255,255,.4)", marginBottom: 16 }}>
          Pas de commission. Pas de co&ucirc;t par facture. Abonnement fixe.
        </p>
        <div style={{ display: "flex", gap: 8, maxWidth: 400, margin: "0 auto" }}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="votre@email.fr"
            style={{ flex: 1, padding: "12px 14px", borderRadius: 8, border: "none", fontSize: 13, background: "rgba(255,255,255,.08)", color: "#fff", outline: "none", fontFamily: "'Karla', sans-serif" }}
          />
          <button
            onClick={handleNotify}
            style={{ padding: "12px 20px", borderRadius: 8, background: "#C4531A", color: "#fff", fontSize: 13, fontWeight: 600, fontFamily: "'Karla', sans-serif", cursor: "pointer", transition: "all .2s", whiteSpace: "nowrap" }}
          >
            Me pr&eacute;venir
          </button>
        </div>
      </div>
    </div>
  );
}
