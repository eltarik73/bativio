"use client";

import { useState } from "react";

export default function ParametresPage() {
  const [copied, setCopied] = useState(false);

  // TODO: remplacer par les données de l'artisan connecté
  const email = "jp.martin@email.com";
  const plan = "PRO";
  const slug = "martin-plomberie";
  const ville = "chambery";
  const url = `bativio.fr/${ville}/${slug}`;

  const copyUrl = () => {
    navigator.clipboard.writeText(`https://${url}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const CARD: React.CSSProperties = {
    background: "#fff",
    borderRadius: 16,
    border: "1.5px solid #EDEBE7",
    padding: 28,
    marginBottom: 20,
  };

  const features = [
    "URL perso (vitrine complète)",
    "Photos illimitées",
    "QR Code vitrine",
    "Mini-CRM clients",
    "Support prioritaire",
  ];

  return (
    <div style={{ maxWidth: 700, padding: 32, margin: "0 auto" }}>
      <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 26, fontWeight: 700, color: "#1C1C1E", marginBottom: 28 }}>
        Paramètres
      </h1>

      {/* --- Compte --- */}
      <div style={CARD}>
        <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 18, fontWeight: 700, color: "#1C1C1E", marginBottom: 20 }}>
          Compte
        </h2>
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#9B9590", marginBottom: 6 }}>Email</div>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#1C1C1E" }}>{email}</div>
        </div>
        <button
          style={{
            border: "1.5px solid #C4531A",
            color: "#C4531A",
            background: "transparent",
            height: 40,
            borderRadius: 8,
            padding: "0 20px",
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Modifier le mot de passe
        </button>
      </div>

      {/* --- Abonnement --- */}
      <div style={CARD}>
        <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 18, fontWeight: 700, color: "#1C1C1E", marginBottom: 20 }}>
          Abonnement
        </h2>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
          <span
            style={{
              background: "rgba(196,83,26,.06)",
              color: "#C4531A",
              padding: "6px 14px",
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            Plan {plan === "PRO" ? "Pro" : plan === "ESSENTIEL" ? "Essentiel" : plan === "PRO_PLUS" ? "Pro+" : "Gratuit"}
          </span>
          <span style={{ fontSize: 15, color: "#9B9590" }}>
            {plan === "PRO" ? "49" : plan === "ESSENTIEL" ? "19" : plan === "PRO_PLUS" ? "79" : "0"} EUR/mois
          </span>
        </div>
        <div style={{ marginBottom: 20 }}>
          {features.map((f) => (
            <div key={f} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 0" }}>
              <span style={{ color: "#16a34a", fontSize: 16 }}>&#10003;</span>
              <span style={{ fontSize: 14, color: "#6B6560" }}>{f}</span>
            </div>
          ))}
        </div>
        <button
          style={{
            border: "1.5px solid #E0DDD8",
            color: "#1C1C1E",
            background: "transparent",
            height: 40,
            borderRadius: 8,
            padding: "0 20px",
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Changer de plan
        </button>
      </div>

      {/* --- Ma page --- */}
      <div style={CARD}>
        <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 18, fontWeight: 700, color: "#1C1C1E", marginBottom: 20 }}>
          Ma page
        </h2>
        <div
          style={{
            background: "#F7F5F2",
            borderRadius: 10,
            padding: "14px 16px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 12,
          }}
        >
          <span style={{ fontSize: 14, fontFamily: "monospace", color: "#1C1C1E" }}>{url}</span>
          <button
            onClick={copyUrl}
            style={{
              background: "#C4531A",
              color: "#fff",
              padding: "6px 14px",
              borderRadius: 6,
              fontSize: 12,
              fontWeight: 600,
              border: "none",
              cursor: "pointer",
            }}
          >
            {copied ? "Copié !" : "Copier"}
          </button>
        </div>
        {plan === "PRO" || plan === "PRO_PLUS" ? (
          <button
            style={{
              border: "1.5px solid #C4531A",
              color: "#C4531A",
              background: "transparent",
              height: 40,
              borderRadius: 8,
              padding: "0 20px",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              marginTop: 8,
            }}
          >
            Télécharger mon QR Code
          </button>
        ) : (
          <p style={{ fontSize: 12, color: "#9B9590" }}>QR Code disponible avec le plan Pro</p>
        )}
      </div>

      {/* --- Zone de danger --- */}
      <div
        style={{
          background: "rgba(220,38,38,.02)",
          borderRadius: 16,
          border: "1.5px solid rgba(220,38,38,.15)",
          padding: 28,
          marginBottom: 20,
        }}
      >
        <h2 style={{ fontSize: 16, fontWeight: 700, color: "#DC2626", marginBottom: 10 }}>
          Zone de danger
        </h2>
        <p style={{ fontSize: 13, color: "#6B6560", lineHeight: 1.6, marginBottom: 16 }}>
          La désactivation masquera votre page de l&apos;annuaire. Vous pourrez la réactiver à tout moment.
        </p>
        <button
          style={{
            border: "1.5px solid #DC2626",
            color: "#DC2626",
            background: "transparent",
            height: 40,
            borderRadius: 8,
            padding: "0 20px",
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Désactiver mon compte
        </button>
      </div>
    </div>
  );
}
