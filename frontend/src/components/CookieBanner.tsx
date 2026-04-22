"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const STORAGE_KEY = "bativio-cookie-info-ack";

/**
 * Bandeau d'information cookies — conforme délibération CNIL n° 2020-091.
 * Bativio n'utilise QUE des cookies techniques strictement nécessaires
 * (session JWT) → exemptés de consentement, mais l'INFORMATION reste obligatoire.
 *
 * Pas de bouton "Refuser" car aucun cookie non-essentiel à refuser.
 */
export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const ack = localStorage.getItem(STORAGE_KEY);
      if (!ack) {
        const t = setTimeout(() => setVisible(true), 600); // léger délai après LCP
        return () => clearTimeout(t);
      }
    } catch {
      // localStorage bloqué (incognito strict) → ne pas afficher
    }
  }, []);

  const handleAck = () => {
    try {
      localStorage.setItem(STORAGE_KEY, new Date().toISOString());
    } catch {
      /* ignore */
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="region"
      aria-label="Information sur les cookies"
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 9000,
        padding: "16px 20px calc(16px + env(safe-area-inset-bottom)) 20px",
        background: "rgba(28,28,30,.96)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        color: "#fff",
        boxShadow: "0 -4px 24px rgba(0,0,0,.15)",
      }}
    >
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          gap: 16,
          flexWrap: "wrap",
          justifyContent: "space-between",
        }}
      >
        <p style={{ flex: 1, minWidth: 240, fontSize: 13, lineHeight: 1.55, color: "rgba(255,255,255,.85)", margin: 0 }}>
          Bativio utilise uniquement un cookie technique <code style={{ background: "rgba(255,255,255,.1)", padding: "2px 6px", borderRadius: 4, fontSize: 12 }}>bativio-session</code> nécessaire à l&apos;authentification.
          {" "}Aucun cookie publicitaire, aucun tracking tiers.
          {" "}<Link href="/mentions-legales#cookies" style={{ color: "#D4956B", textDecoration: "underline" }}>En savoir plus</Link>.
        </p>
        <button
          type="button"
          onClick={handleAck}
          style={{
            background: "var(--terre, #C4531A)",
            color: "#fff",
            border: "none",
            padding: "10px 22px",
            borderRadius: 10,
            fontSize: 14,
            fontWeight: 600,
            cursor: "pointer",
            minHeight: 44,
            minWidth: 100,
          }}
        >
          J&apos;ai compris
        </button>
      </div>
    </div>
  );
}
