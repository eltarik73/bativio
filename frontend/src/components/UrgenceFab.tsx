"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

/**
 * FAB Urgence : bouton flottant rouge bas-droite visible sur pages ville.
 * Apparait après 800ms de scroll pour ne pas gêner le LCP, visible sur toutes les tailles.
 */
export default function UrgenceFab() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 400) setVisible(true);
    };
    const timer = setTimeout(() => setVisible(true), 2500);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  if (dismissed || !visible) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 18,
        right: 18,
        zIndex: 80,
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "10px 16px 10px 12px",
        background: "#dc2626",
        color: "#fff",
        borderRadius: 99,
        boxShadow: "0 10px 30px rgba(220,38,38,.35)",
        fontSize: 14,
        fontWeight: 600,
      }}
    >
      <Link
        href="/urgence"
        style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "#fff", textDecoration: "none" }}
        aria-label="Accéder à la page urgence 24/7"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
        </svg>
        Urgence 24/7
      </Link>
      <button
        onClick={() => setDismissed(true)}
        aria-label="Masquer le bouton urgence"
        style={{
          marginLeft: 4,
          background: "rgba(255,255,255,.15)",
          border: "none",
          borderRadius: "50%",
          width: 22,
          height: 22,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          color: "#fff",
          fontSize: 13,
          padding: 0,
        }}
      >
        ×
      </button>
    </div>
  );
}
