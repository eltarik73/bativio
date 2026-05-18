"use client";

/**
 * TrackedTelLink — lien tel: avec tracking analytics.
 *
 * Au clic, envoie un event a /api/v1/public/track-click (via sendBeacon)
 * pour mesurer le nombre d'appels declenches depuis chaque fiche artisan.
 *
 * Visible dans /admin/statistiques > Clics sortants (categorie "phone_call").
 */

import { useCallback } from "react";

interface TrackedTelLinkProps {
  /** Numero de telephone (formate ou non, sera nettoye pour href) */
  phone: string;
  /** Slug de l'artisan pour identifier dans les stats (ex "az-tech") */
  artisanSlug: string;
  /** Contenu du lien */
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
}

export default function TrackedTelLink({
  phone,
  artisanSlug,
  children,
  style,
  className,
}: TrackedTelLinkProps) {
  const cleanPhone = phone.replace(/\s/g, "");

  const handleClick = useCallback(() => {
    try {
      const payload = JSON.stringify({
        label: `phone_${artisanSlug}`,
        targetUrl: `tel:${cleanPhone}`,
        sourcePage:
          typeof window !== "undefined" ? window.location.pathname : "/",
        category: "phone_call",
      });
      const blob = new Blob([payload], { type: "application/json" });
      if (navigator.sendBeacon) {
        navigator.sendBeacon("/api/v1/public/track-click", blob);
      } else {
        fetch("/api/v1/public/track-click", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: payload,
          keepalive: true,
        }).catch(() => {});
      }
    } catch {
      // Tracking jamais bloquant
    }
  }, [cleanPhone, artisanSlug]);

  return (
    <a
      href={`tel:${cleanPhone}`}
      onClick={handleClick}
      style={style}
      className={className}
      data-track-label={`phone_${artisanSlug}`}
    >
      {children}
    </a>
  );
}
