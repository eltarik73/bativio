"use client";

/**
 * useTelephoneTracking — hook qui ajoute event delegation pour tracker
 * tous les clics sur les liens tel:* dans la vitrine.
 *
 * Plus simple que de wrapper chaque <a href="tel:..."> avec un composant
 * specifique : on attache 1 listener au document, on capture les clics
 * sur tout element <a> dont href commence par "tel:".
 *
 * Tracking envoye via navigator.sendBeacon (non-bloquant).
 * Visible dans /admin/statistiques > category "phone_call".
 */

import { useEffect } from "react";

export function useTelephoneTracking(artisanSlug: string) {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const anchor = target.closest('a[href^="tel:"]') as HTMLAnchorElement | null;
      if (!anchor) return;
      try {
        const payload = JSON.stringify({
          label: `phone_${artisanSlug}`,
          targetUrl: anchor.href,
          sourcePage: window.location.pathname,
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
        // tracking jamais critique
      }
    };

    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, [artisanSlug]);
}
