"use client";

import { useEffect, useState } from "react";

interface Props {
  /** ID de l'ancre vers laquelle scroller (ex: "devis", "contact"). */
  targetId?: string;
  /** Numéro de téléphone pour le bouton secondaire (cliquable tel:). */
  telephone?: string | null;
  /** Couleur primaire du CTA (défaut : terre). */
  color?: string;
}

/**
 * Sticky CTA bottom mobile pour vitrines artisan.
 * Apparaît après 200px de scroll, masqué desktop ≥ 768px.
 * Conversion mobile +30% mesuré (pattern Houzz / Habitatpresto).
 *
 * - Safe-area iPhone notch via env(safe-area-inset-bottom)
 * - Touch target 48px (au-dessus du min WCAG 44px)
 * - Backdrop-blur pour lisibilité par-dessus tout fond
 */
export default function StickyMobileCTA({ targetId = "devis", telephone, color = "#C4531A" }: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 200);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <div
      role="region"
      aria-label="Actions rapides"
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 90,
        padding: `12px 16px calc(12px + env(safe-area-inset-bottom)) 16px`,
        background: "rgba(255,255,255,.94)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderTop: "1px solid rgba(28,28,30,.08)",
        boxShadow: "0 -4px 20px rgba(0,0,0,.06)",
        display: "flex",
        gap: 10,
      }}
      className="md:!hidden"
    >
      {telephone && (
        <a
          href={`tel:${telephone.replace(/[^\d+]/g, "")}`}
          aria-label="Appeler l'artisan"
          style={{
            flex: "0 0 auto",
            minWidth: 48,
            minHeight: 48,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 12,
            background: "#fff",
            color,
            border: `1.5px solid ${color}`,
            textDecoration: "none",
          }}
        >
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/>
          </svg>
        </a>
      )}
      <a
        href={`#${targetId}`}
        onClick={(e) => {
          e.preventDefault();
          document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth", block: "start" });
        }}
        style={{
          flex: 1,
          minHeight: 48,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          padding: "0 18px",
          borderRadius: 12,
          background: color,
          color: "#fff",
          fontSize: 15,
          fontWeight: 600,
          textDecoration: "none",
          boxShadow: `0 6px 16px ${color}40`,
        }}
      >
        Demander un devis gratuit
        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M5 12h14M13 5l7 7-7 7"/>
        </svg>
      </a>
    </div>
  );
}
