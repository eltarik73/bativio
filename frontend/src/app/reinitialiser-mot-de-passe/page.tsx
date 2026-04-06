"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [countdown, setCountdown] = useState(5);

  // Criteria checks
  const criteria = useMemo(() => {
    const hasMinLength = password.length >= 8;
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasDigit = /[0-9]/.test(password);
    const passwordsMatch = password.length > 0 && password === confirm;
    return { hasMinLength, hasUpper, hasLower, hasDigit, passwordsMatch };
  }, [password, confirm]);

  const allCriteriaMet =
    criteria.hasMinLength &&
    criteria.hasUpper &&
    criteria.hasLower &&
    criteria.hasDigit &&
    criteria.passwordsMatch;

  // Strength indicator
  const strength = useMemo(() => {
    if (password.length < 8) return { level: "Faible", color: "#dc2626", width: "33%" };
    const passed = [criteria.hasUpper, criteria.hasLower, criteria.hasDigit].filter(Boolean).length;
    if (passed < 3) return { level: "Moyen", color: "#f59e0b", width: "66%" };
    return { level: "Fort", color: "#16a34a", width: "100%" };
  }, [password, criteria]);

  // Auto-redirect countdown after success
  useEffect(() => {
    if (!success) return;
    if (countdown <= 0) {
      router.push("/connexion");
      return;
    }
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [success, countdown, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!allCriteriaMet || loading) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/v1/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const json = await res.json();
      if (!json.success) {
        throw new Error(json.error || "Erreur");
      }
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  // No token in URL
  if (!token) {
    return (
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
        <div style={{ fontSize: 48, marginBottom: 16 }}>&#9888;</div>
        <h1
          style={{
            fontFamily: "'Fraunces',serif",
            fontSize: 24,
            fontWeight: 700,
            color: "var(--bois)",
            marginBottom: 8,
          }}
        >
          Lien invalide
        </h1>
        <p
          style={{
            fontSize: 15,
            color: "var(--pierre)",
            lineHeight: 1.6,
            marginBottom: 24,
          }}
        >
          Ce lien de r&eacute;initialisation est invalide ou incomplet.
        </p>
        <Link
          href="/mot-de-passe-oublie"
          style={{
            display: "inline-block",
            background: "#C4531A",
            color: "#fff",
            textDecoration: "none",
            fontFamily: "'Karla',sans-serif",
            fontSize: 16,
            fontWeight: 600,
            padding: "14px 32px",
            borderRadius: 10,
          }}
        >
          Refaire une demande
        </Link>
      </div>
    );
  }

  // Success state
  if (success) {
    return (
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
        <div style={{ fontSize: 48, marginBottom: 16 }}>&#10003;</div>
        <h1
          style={{
            fontFamily: "'Fraunces',serif",
            fontSize: 24,
            fontWeight: 700,
            color: "var(--bois)",
            marginBottom: 8,
          }}
        >
          Mot de passe r&eacute;initialis&eacute; !
        </h1>
        <p
          style={{
            fontSize: 15,
            color: "var(--pierre)",
            lineHeight: 1.6,
            marginBottom: 24,
          }}
        >
          Votre mot de passe a &eacute;t&eacute; modifi&eacute; avec succ&egrave;s.
          Redirection vers la connexion dans {countdown}s...
        </p>
        <Link
          href="/connexion"
          style={{
            display: "inline-block",
            color: "#C4531A",
            textDecoration: "none",
            fontWeight: 600,
            fontSize: 15,
          }}
        >
          Se connecter maintenant
        </Link>
      </div>
    );
  }

  // Criteria item renderer
  const CriteriaItem = ({
    met,
    label,
  }: {
    met: boolean;
    label: string;
  }) => (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        fontSize: 13,
        color: met ? "#16a34a" : "#9B9590",
      }}
    >
      <span>{met ? "\u2713" : "\u2717"}</span>
      <span>{label}</span>
    </div>
  );

  return (
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
          Nouveau mot de passe
        </p>
        <p
          style={{
            marginTop: 8,
            fontSize: 14,
            color: "var(--pierre)",
            lineHeight: 1.5,
          }}
        >
          Choisissez un mot de passe s&eacute;curis&eacute; pour votre compte.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: 20 }}
      >
        {/* New password */}
        <div>
          <label htmlFor="password" className="bv-label">
            Nouveau mot de passe
          </label>
          <div style={{ position: "relative" }}>
            <input
              id="password"
              type={showPw ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bv-input"
              placeholder="Votre nouveau mot de passe"
              style={{ paddingRight: 48 }}
            />
            <button
              type="button"
              onClick={() => setShowPw(!showPw)}
              style={{
                position: "absolute",
                right: 14,
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#9B9590",
                fontSize: 13,
              }}
            >
              {showPw ? "Masquer" : "Voir"}
            </button>
          </div>
        </div>

        {/* Strength indicator */}
        {password.length > 0 && (
          <div>
            <div
              style={{
                height: 6,
                background: "#E8E4DF",
                borderRadius: 3,
                overflow: "hidden",
                marginBottom: 6,
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: strength.width,
                  background: strength.color,
                  borderRadius: 3,
                  transition: "width .3s, background .3s",
                }}
              />
            </div>
            <p
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: strength.color,
                margin: 0,
              }}
            >
              {strength.level}
            </p>
          </div>
        )}

        {/* Confirm password */}
        <div>
          <label htmlFor="confirm" className="bv-label">
            Confirmer le mot de passe
          </label>
          <div style={{ position: "relative" }}>
            <input
              id="confirm"
              type={showConfirm ? "text" : "password"}
              required
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="bv-input"
              placeholder="Confirmez votre mot de passe"
              style={{ paddingRight: 48 }}
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              style={{
                position: "absolute",
                right: 14,
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#9B9590",
                fontSize: 13,
              }}
            >
              {showConfirm ? "Masquer" : "Voir"}
            </button>
          </div>
        </div>

        {/* Criteria checklist */}
        {password.length > 0 && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 6,
              padding: "12px 16px",
              background: "#FAF8F5",
              borderRadius: 10,
              border: "1px solid #E8E4DF",
            }}
          >
            <CriteriaItem
              met={criteria.hasMinLength}
              label={"8 caract\u00e8res minimum"}
            />
            <CriteriaItem met={criteria.hasUpper} label="Une majuscule" />
            <CriteriaItem met={criteria.hasLower} label="Une minuscule" />
            <CriteriaItem met={criteria.hasDigit} label="Un chiffre" />
            <CriteriaItem
              met={criteria.passwordsMatch}
              label="Les mots de passe correspondent"
            />
          </div>
        )}

        {error && (
          <div style={{ textAlign: "center" }}>
            <p style={{ color: "#dc2626", fontSize: 14, marginBottom: 8 }}>
              {error}
            </p>
            {(error.includes("invalide") || error.includes("expir")) && (
              <Link
                href="/mot-de-passe-oublie"
                style={{
                  color: "#C4531A",
                  textDecoration: "none",
                  fontWeight: 500,
                  fontSize: 14,
                }}
              >
                Refaire une demande
              </Link>
            )}
          </div>
        )}

        <button
          type="submit"
          disabled={!allCriteriaMet || loading}
          style={{
            width: "100%",
            height: 48,
            background: allCriteriaMet ? "#C4531A" : "#E0DDD8",
            color: allCriteriaMet ? "#fff" : "#9B9590",
            border: "none",
            borderRadius: 10,
            fontFamily: "'Karla',sans-serif",
            fontSize: 16,
            fontWeight: 600,
            cursor: allCriteriaMet ? "pointer" : "not-allowed",
            transition: "background .2s",
          }}
          onMouseEnter={(e) => {
            if (allCriteriaMet && !loading)
              e.currentTarget.style.background = "#D4733A";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = allCriteriaMet
              ? "#C4531A"
              : "#E0DDD8";
          }}
        >
          {loading
            ? "R\u00e9initialisation..."
            : "R\u00e9initialiser le mot de passe"}
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
  );
}

export default function ReinitialiserMotDePassePage() {
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
        <Suspense
          fallback={
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
              <p style={{ color: "var(--pierre)", fontSize: 15 }}>
                Chargement...
              </p>
            </div>
          }
        >
          <ResetPasswordForm />
        </Suspense>
      </main>
    </>
  );
}
