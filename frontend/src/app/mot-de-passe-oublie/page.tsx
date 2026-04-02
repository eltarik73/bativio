"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function MotDePasseOubliePage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  // Countdown timer for resend cooldown
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      if (e) e.preventDefault();
      if (!email || loading || cooldown > 0) return;
      setLoading(true);
      setError("");

      try {
        const res = await fetch("/api/v1/auth/forgot-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
        const json = await res.json();
        if (!json.success) {
          throw new Error(json.error || "Erreur");
        }
        setSent(true);
        setCooldown(60);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Une erreur est survenue"
        );
      } finally {
        setLoading(false);
      }
    },
    [email, loading, cooldown]
  );

  const handleResend = useCallback(() => {
    if (cooldown > 0) return;
    handleSubmit();
  }, [cooldown, handleSubmit]);

  if (sent) {
    return (
      <>
        <Navbar />
        <main
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "85vh",
            padding: 16,
            background: "var(--creme)",
          }}
        >
          <div
            style={{
              background: "var(--blanc)",
              borderRadius: 16,
              border: "1px solid var(--sable)",
              boxShadow: "0 4px 24px rgba(61,46,31,.04)",
              maxWidth: 440,
              width: "100%",
              padding: 40,
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 48, marginBottom: 16 }}>&#9993;</div>
            <h1
              style={{
                fontFamily: "'Fraunces',serif",
                fontSize: 24,
                fontWeight: 700,
                color: "var(--bois)",
                marginBottom: 8,
              }}
            >
              Email envoy&eacute; !
            </h1>
            <p
              style={{
                fontSize: 15,
                color: "var(--pierre)",
                lineHeight: 1.6,
                marginBottom: 24,
              }}
            >
              Si cette adresse est inscrite, vous allez recevoir un email avec
              un lien de r&eacute;initialisation.
            </p>
            <button
              onClick={handleResend}
              disabled={cooldown > 0 || loading}
              style={{
                width: "100%",
                height: 48,
                background: cooldown > 0 ? "#E0DDD8" : "#C4531A",
                color: cooldown > 0 ? "#9B9590" : "#fff",
                border: "none",
                borderRadius: 10,
                fontFamily: "'Karla',sans-serif",
                fontSize: 16,
                fontWeight: 600,
                cursor: cooldown > 0 ? "not-allowed" : "pointer",
                transition: "background .2s",
                marginBottom: 16,
              }}
            >
              {loading
                ? "Envoi..."
                : cooldown > 0
                  ? `Renvoyer (${cooldown}s)`
                  : "Renvoyer"}
            </button>
            <Link
              href="/connexion"
              style={{
                display: "inline-block",
                fontSize: 14,
                color: "#C4531A",
                textDecoration: "none",
                fontWeight: 500,
              }}
            >
              &larr; Retour &agrave; la connexion
            </Link>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "85vh",
          padding: 16,
          background: "var(--creme)",
        }}
      >
        <div
          style={{
            background: "var(--blanc)",
            borderRadius: 16,
            border: "1px solid var(--sable)",
            boxShadow: "0 4px 24px rgba(61,46,31,.04)",
            maxWidth: 440,
            width: "100%",
            padding: 40,
          }}
        >
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <h1
              style={{
                fontFamily: "'Fraunces',serif",
                fontSize: 28,
                fontWeight: 700,
                color: "var(--terre)",
                letterSpacing: -0.5,
              }}
            >
              Bativio
            </h1>
            <p
              style={{
                marginTop: 8,
                fontFamily: "'Fraunces',serif",
                fontSize: 22,
                fontWeight: 700,
                color: "var(--bois)",
              }}
            >
              Mot de passe oubli&eacute;
            </p>
            <p
              style={{
                marginTop: 8,
                fontSize: 14,
                color: "var(--pierre)",
                lineHeight: 1.5,
              }}
            >
              Entrez votre email, nous vous enverrons un lien de
              r&eacute;initialisation.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: 24 }}
          >
            <div>
              <label htmlFor="email" className="bv-label">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bv-input"
                placeholder="votre@email.fr"
              />
            </div>

            {error && (
              <p style={{ color: "#dc2626", fontSize: 14 }}>{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                height: 48,
                background: "#C4531A",
                color: "#fff",
                border: "none",
                borderRadius: 10,
                fontFamily: "'Karla',sans-serif",
                fontSize: 16,
                fontWeight: 600,
                cursor: "pointer",
                transition: "background .2s",
              }}
              onMouseEnter={(e) => {
                if (!loading)
                  e.currentTarget.style.background = "#D4733A";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#C4531A";
              }}
            >
              {loading ? "Envoi en cours..." : "Envoyer le lien"}
            </button>
          </form>

          <p
            style={{
              marginTop: 24,
              textAlign: "center",
              fontSize: 14,
              color: "#9B9590",
            }}
          >
            <Link
              href="/connexion"
              style={{
                color: "#C4531A",
                textDecoration: "none",
                fontWeight: 500,
              }}
            >
              &larr; Retour &agrave; la connexion
            </Link>
          </p>
        </div>
      </main>
    </>
  );
}
