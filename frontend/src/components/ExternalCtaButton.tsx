"use client";

/**
 * ExternalCtaButton — bouton CTA vers une URL externe avec tracking analytics.
 *
 * Au clic, envoie un event à /api/v1/public/track-click (via sendBeacon pour ne
 * pas bloquer la navigation), puis ouvre l'URL dans un nouvel onglet.
 *
 * Utilisé pour :
 * - Liens partenaires (monpcmi13.com)
 * - Sources affiliées
 * - Tout clic sortant qu'on veut mesurer dans /admin/statistiques
 *
 * Visible dans le dashboard admin via la section "Clics sortants" qui agrège
 * par label + sourcePage.
 */

import { useCallback } from "react";

interface ExternalCtaButtonProps {
  /** URL de destination (https://...) */
  href: string;
  /** Identifiant unique du bouton (ex "cta_monpcmi13_attestation") */
  trackLabel: string;
  /** Catégorie pour agrégation admin (defaut "cta_external") */
  category?: string;
  /** Contenu du bouton */
  children: React.ReactNode;
  /** Style du bouton (object React inline) */
  style?: React.CSSProperties;
  /** Class CSS optionnelle */
  className?: string;
  /** Ouvre dans un nouvel onglet (defaut true) */
  newTab?: boolean;
}

export default function ExternalCtaButton({
  href,
  trackLabel,
  category = "cta_external",
  children,
  style,
  className,
  newTab = true,
}: ExternalCtaButtonProps) {
  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      // Si meta/ctrl-click ou middle-click, laisse le browser gérer
      if (e.metaKey || e.ctrlKey || e.button === 1) return;

      // Envoie le tracking event en sendBeacon (non-bloquant, fire-and-forget)
      try {
        const payload = JSON.stringify({
          label: trackLabel,
          targetUrl: href,
          sourcePage:
            typeof window !== "undefined" ? window.location.pathname : "/",
          category,
        });
        const blob = new Blob([payload], { type: "application/json" });
        // navigator.sendBeacon survit a la navigation - parfait pour ce use case
        if (navigator.sendBeacon) {
          navigator.sendBeacon("/api/v1/public/track-click", blob);
        } else {
          // Fallback fetch keepalive
          fetch("/api/v1/public/track-click", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: payload,
            keepalive: true,
          }).catch(() => {});
        }
      } catch {
        // Le tracking n'est jamais critique - on continue meme s'il echoue
      }
    },
    [href, trackLabel, category],
  );

  return (
    <a
      href={href}
      onClick={handleClick}
      target={newTab ? "_blank" : undefined}
      rel={newTab ? "noopener noreferrer" : undefined}
      style={style}
      className={className}
      data-track-label={trackLabel}
    >
      {children}
    </a>
  );
}
