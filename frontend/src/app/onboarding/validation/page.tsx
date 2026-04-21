"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

/* ═══════════════════════════════════════════
   Scoring / admission form for artisans
   ═══════════════════════════════════════════ */

// ─── Category definitions ───
type CategoryKey = "CONFIANCE" | "QUALITE" | "ENGAGEMENT";
const CATEGORY_COLORS: Record<CategoryKey, string> = {
  CONFIANCE: "var(--mousse, #4A6741)",
  QUALITE: "var(--terre, #C4531A)",
  ENGAGEMENT: "var(--or, #C9943A)",
};

interface Option {
  label: string;
  value: number;
}

interface Criterion {
  key: string;
  category: CategoryKey;
  label: string;
  description: string;
  options: Option[];
}

const CRITERIA: Criterion[] = [
  // ── CONFIANCE ──
  {
    key: "anciennete",
    category: "CONFIANCE",
    label: "Ancienneté de l'entreprise",
    description: "Depuis combien de temps votre entreprise est-elle en activité ?",
    options: [
      { label: "Moins de 2 ans", value: 1 },
      { label: "2-4 ans", value: 4 },
      { label: "5-9 ans", value: 7 },
      { label: "10+ ans", value: 10 },
    ],
  },
  {
    key: "statut_juridique",
    category: "CONFIANCE",
    label: "Statut juridique",
    description: "Quel est le statut juridique de votre structure ?",
    options: [
      { label: "Auto-entrepreneur", value: 1 },
      { label: "EIRL / EI", value: 2 },
      { label: "SARL / SAS / EURL / SASU", value: 4 },
    ],
  },
  {
    key: "assurance",
    category: "CONFIANCE",
    label: "Assurance professionnelle",
    description: "Quelles assurances possédez-vous ?",
    options: [
      { label: "Aucune", value: 0 },
      { label: "RC Pro", value: 3 },
      { label: "Décennale + RC Pro", value: 10 },
    ],
  },
  {
    key: "effectif",
    category: "CONFIANCE",
    label: "Effectif",
    description: "Combien de personnes travaillent dans votre entreprise ?",
    options: [
      { label: "Seul", value: 1 },
      { label: "2-3", value: 3 },
      { label: "4-9", value: 5 },
      { label: "10+", value: 7 },
    ],
  },
  {
    key: "labels",
    category: "CONFIANCE",
    label: "Labels et certifications",
    description: "Possédez-vous des labels reconnus (RGE, Qualibat, etc.) ?",
    options: [
      { label: "Aucun", value: 0 },
      { label: "1 label", value: 3 },
      { label: "2+ labels", value: 5 },
    ],
  },
  // ── QUALITE ──
  {
    key: "photos",
    category: "QUALITE",
    label: "Photos de réalisations",
    description: "Combien de photos de chantiers pouvez-vous présenter ?",
    options: [
      { label: "Aucune", value: 0 },
      { label: "1-3", value: 2 },
      { label: "4-9", value: 3 },
      { label: "10+", value: 5 },
    ],
  },
  {
    key: "avis",
    category: "QUALITE",
    label: "Avis clients",
    description: "Combien d'avis clients avez-vous en ligne ?",
    options: [
      { label: "Aucun", value: 0 },
      { label: "1-5", value: 2 },
      { label: "6-20", value: 3 },
      { label: "20+ (>4\u2605)", value: 5 },
    ],
  },
  {
    key: "presence_en_ligne",
    category: "QUALITE",
    label: "Présence en ligne",
    description: "Où êtes-vous visible sur internet ?",
    options: [
      { label: "Aucune", value: 0 },
      { label: "Google", value: 2 },
      { label: "Google + réseaux", value: 3 },
      { label: "Site + Google + réseaux", value: 5 },
    ],
  },
  // ── ENGAGEMENT ──
  {
    key: "zone",
    category: "ENGAGEMENT",
    label: "Zone géographique",
    description: "Où intervenez-vous principalement ?",
    options: [
      { label: "Hors Rhône-Alpes", value: 0 },
      { label: "Rhône-Alpes", value: 3 },
      { label: "Ville cible", value: 6 },
      { label: "Chambéry", value: 9 },
    ],
  },
  {
    key: "plan",
    category: "ENGAGEMENT",
    label: "Plan souhaité",
    description: "Quel abonnement vous intéresse ?",
    options: [
      { label: "Gratuit", value: 1 },
      { label: "Starter 19€", value: 4 },
      { label: "Pro 39€", value: 6 },
      { label: "Business 59€", value: 8 },
    ],
  },
];

type Answers = Record<string, number | null>;

const initialAnswers = (): Answers => {
  const a: Answers = {};
  for (const c of CRITERIA) a[c.key] = null;
  return a;
};

// ─── CheckCircle SVG ───
function CheckCircle() {
  return (
    <svg width="64" height="64" fill="none" viewBox="0 0 64 64">
      <circle cx="32" cy="32" r="30" stroke="var(--mousse, #4A6741)" strokeWidth="3" fill="var(--mousse-light, #E8F0E6)" />
      <path d="M20 33l8 8 16-16" stroke="var(--mousse, #4A6741)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ─── ClockCircle SVG ───
function ClockCircle() {
  return (
    <svg width="64" height="64" fill="none" viewBox="0 0 64 64">
      <circle cx="32" cy="32" r="30" stroke="var(--or, #C9943A)" strokeWidth="3" fill="var(--or-light, #FDF5E8)" />
      <circle cx="32" cy="32" r="3" fill="var(--or, #C9943A)" />
      <path d="M32 20v12l8 4" stroke="var(--or, #C9943A)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ─── Spinner ───
function Spinner() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ animation: "spin 1s linear infinite" }}>
      <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,.3)" strokeWidth="3" />
      <path d="M12 2a10 10 0 019.8 8" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </svg>
  );
}

export default function ValidationPage() {
  const router = useRouter();
  const { user, loading: authLoading, fetchWithAuth } = useAuth();

  const [answers, setAnswers] = useState<Answers>(initialAnswers);
  const [step, setStep] = useState<"form" | "loading" | "auto_accepted" | "pending_review">("form");
  const [error, setError] = useState("");

  // Resolved artisan status (from user object or fetched)
  const [artisanStatus, setArtisanStatus] = useState<string | null>(null);
  const [statusLoading, setStatusLoading] = useState(true);

  // On mount: resolve artisan status
  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.push("/connexion");
      return;
    }

    // Try getting status from user object first
    const statusFromUser = (user as Record<string, unknown>).artisanStatus as string | undefined;
    if (statusFromUser) {
      setArtisanStatus(statusFromUser);
      setStatusLoading(false);
      return;
    }

    // Otherwise fetch from /artisans/me
    (async () => {
      try {
        const data = await fetchWithAuth("/artisans/me") as Record<string, unknown>;
        setArtisanStatus((data.artisanStatus as string) || (data.status as string) || "ONBOARDING");
      } catch {
        // If endpoint fails, assume ONBOARDING (new artisan)
        setArtisanStatus("ONBOARDING");
      } finally {
        setStatusLoading(false);
      }
    })();
  }, [authLoading, user, fetchWithAuth, router]);

  // Redirect based on status
  useEffect(() => {
    if (statusLoading || !artisanStatus) return;
    if (artisanStatus === "ACTIVE") {
      router.push("/dashboard");
    } else if (artisanStatus === "PENDING_REVIEW") {
      setStep("pending_review");
    }
    // ONBOARDING or REJECTED → show form (default)
  }, [artisanStatus, statusLoading, router]);

  // ─── Computed ───
  const answeredCount = Object.values(answers).filter((v) => v !== null).length;
  const totalCriteria = CRITERIA.length;
  const allAnswered = answeredCount === totalCriteria;
  const progress = (answeredCount / totalCriteria) * 100;

  const setAnswer = (key: string, value: number) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  };

  // ─── Submit ───
  const handleSubmit = async () => {
    if (!allAnswered) return;
    setStep("loading");
    setError("");
    try {
      const result = await fetchWithAuth("/artisan/scoring", {
        method: "POST",
        body: JSON.stringify(answers),
      }) as Record<string, unknown>;

      const status = (result.result as string) || (result.status as string) || (result.decision as string) || "";
      if (status === "auto_accepted" || status === "ACTIVE") {
        setStep("auto_accepted");
      } else {
        setStep("pending_review");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erreur lors de la validation";
      setError(msg);
      setStep("form");
    }
  };

  // ─── Loading state ───
  if (authLoading || statusLoading) {
    return (
      <div style={{ minHeight: "100dvh", background: "var(--creme, #FAF8F5)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Spinner />
      </div>
    );
  }

  // ─── Auto-accepted screen ───
  if (step === "auto_accepted") {
    return (
      <div style={{ minHeight: "100dvh", background: "var(--creme, #FAF8F5)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center", maxWidth: 420, padding: 32 }}>
          <div style={{ marginBottom: 24 }}><CheckCircle /></div>
          <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 28, fontWeight: 700, color: "var(--anthracite, #1C1C1E)", marginBottom: 12 }}>
            Bienvenue sur Bativio !
          </h1>
          <p style={{ fontSize: 16, color: "var(--pierre, #9C958D)", marginBottom: 32, lineHeight: 1.6 }}>
            Votre profil est maintenant en ligne.
          </p>
          <button
            onClick={() => router.push("/dashboard")}
            style={{
              background: "var(--terre, #C4531A)",
              color: "#fff",
              border: "none",
              borderRadius: 10,
              padding: "14px 32px",
              fontSize: 15,
              fontWeight: 600,
              cursor: "pointer",
              transition: "background .2s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "var(--terre-h, #D4733A)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "var(--terre, #C4531A)"; }}
          >
            Accéder à mon espace &rarr;
          </button>
        </div>
      </div>
    );
  }

  // ─── Pending review screen ───
  if (step === "pending_review") {
    return (
      <div style={{ minHeight: "100dvh", background: "var(--creme, #FAF8F5)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center", maxWidth: 420, padding: 32 }}>
          <div style={{ marginBottom: 24 }}><ClockCircle /></div>
          <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 28, fontWeight: 700, color: "var(--anthracite, #1C1C1E)", marginBottom: 12 }}>
            Demande envoyée !
          </h1>
          <p style={{ fontSize: 16, color: "var(--or, #C9943A)", fontWeight: 600, marginBottom: 8 }}>
            Retour sous 48h maximum
          </p>
          <p style={{ fontSize: 15, color: "var(--pierre, #9C958D)", lineHeight: 1.6 }}>
            Nous examinons chaque dossier avec attention.
          </p>
        </div>
      </div>
    );
  }

  // ─── Loading (submitting) screen ───
  if (step === "loading") {
    return (
      <div style={{ minHeight: "100dvh", background: "var(--creme, #FAF8F5)", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 16 }}>
        <Spinner />
        <p style={{ fontSize: 15, color: "var(--pierre, #9C958D)", fontWeight: 500 }}>Validation en cours...</p>
      </div>
    );
  }

  // ─── Group criteria by category for rendering ───
  const grouped: { category: CategoryKey; criteria: Criterion[] }[] = [];
  let lastCat: CategoryKey | null = null;
  for (const c of CRITERIA) {
    if (c.category !== lastCat) {
      grouped.push({ category: c.category, criteria: [] });
      lastCat = c.category;
    }
    grouped[grouped.length - 1].criteria.push(c);
  }

  const categoryLabels: Record<CategoryKey, string> = {
    CONFIANCE: "Confiance",
    QUALITE: "Qualité",
    ENGAGEMENT: "Engagement",
  };

  // ─── Form ───
  return (
    <div style={{ minHeight: "100dvh", background: "var(--creme, #FAF8F5)" }}>
      {/* Progress bar */}
      <div style={{ position: "sticky", top: 0, zIndex: 50, background: "var(--blanc, #FFFFFF)", borderBottom: "1px solid var(--g100, #EDEBE7)" }}>
        <div style={{ height: 4, background: "var(--g200, #E0DDD8)", width: "100%" }}>
          <div
            style={{
              height: 4,
              background: "var(--terre, #C4531A)",
              width: `${progress}%`,
              transition: "width .3s ease",
              borderRadius: "0 2px 2px 0",
            }}
          />
        </div>
        <div style={{ padding: "10px 24px", fontSize: 13, fontWeight: 500, color: "var(--pierre, #9C958D)" }}>
          {answeredCount}/{totalCriteria} critères complétés
        </div>
      </div>

      <div style={{ maxWidth: 680, margin: "0 auto", padding: "32px 20px 80px" }}>
        {/* Header */}
        <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 26, fontWeight: 700, color: "var(--anthracite, #1C1C1E)", marginBottom: 8 }}>
          Finalisez votre inscription
        </h1>
        <p style={{ fontSize: 15, color: "var(--pierre, #9C958D)", marginBottom: 36, lineHeight: 1.5 }}>
          Répondez à ces quelques questions pour valider votre profil artisan.
        </p>

        {error && (
          <div style={{
            background: "#FEF2F2",
            border: "1px solid #FECACA",
            borderRadius: 10,
            padding: "12px 16px",
            marginBottom: 24,
            fontSize: 14,
            color: "#DC2626",
          }}>
            {error}
          </div>
        )}

        {/* Questions grouped by category */}
        {grouped.map((group) => {
          const color = CATEGORY_COLORS[group.category];
          return (
            <div key={group.category} style={{ marginBottom: 36 }}>
              {/* Category header */}
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                <span style={{ width: 10, height: 10, borderRadius: "50%", background: color, flexShrink: 0 }} />
                <span style={{ fontFamily: "'Fraunces', serif", fontSize: 18, fontWeight: 600, color: "var(--anthracite, #1C1C1E)" }}>
                  {categoryLabels[group.category]}
                </span>
              </div>

              {group.criteria.map((criterion) => {
                const selected = answers[criterion.key];
                return (
                  <div
                    key={criterion.key}
                    style={{
                      background: "var(--blanc, #FFFFFF)",
                      border: "1px solid var(--g100, #EDEBE7)",
                      borderRadius: 14,
                      padding: 24,
                      marginBottom: 14,
                    }}
                  >
                    <p style={{ fontFamily: "'Fraunces', serif", fontSize: 15, fontWeight: 600, color: "var(--anthracite, #1C1C1E)", marginBottom: 4 }}>
                      {criterion.label}
                    </p>
                    <p style={{ fontSize: 13, color: "var(--pierre, #9C958D)", marginBottom: 16 }}>
                      {criterion.description}
                    </p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                      {criterion.options.map((option) => {
                        const isSelected = selected === option.value;
                        return (
                          <button
                            key={option.label}
                            type="button"
                            onClick={() => setAnswer(criterion.key, option.value)}
                            style={{
                              padding: "8px 18px",
                              borderRadius: 20,
                              fontSize: 13,
                              fontWeight: 500,
                              cursor: "pointer",
                              transition: "all .15s",
                              border: isSelected ? `1.5px solid ${color}` : "1.5px solid var(--sable, #E8D5C0)",
                              background: isSelected ? color : "var(--blanc, #FFFFFF)",
                              color: isSelected ? "#FFFFFF" : "var(--bois, #3D2E1F)",
                            }}
                          >
                            {option.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}

        {/* Submit */}
        {allAnswered && (
          <div style={{ textAlign: "center", marginTop: 24 }}>
            <button
              type="button"
              onClick={handleSubmit}
              style={{
                background: "var(--terre, #C4531A)",
                color: "#fff",
                border: "none",
                borderRadius: 10,
                padding: "16px 40px",
                fontSize: 16,
                fontWeight: 600,
                cursor: "pointer",
                transition: "background .2s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "var(--terre-h, #D4733A)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "var(--terre, #C4531A)"; }}
            >
              Finaliser mon inscription
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
