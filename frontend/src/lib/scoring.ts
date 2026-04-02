// Scoring / Admission system for Bativio artisans
// Criteria match the frontend form (/onboarding/validation)
// Score calculated server-side only — never expose weights/threshold to client

export const AUTO_ACCEPT_THRESHOLD = 55; // percent

// Criteria IDs must match the frontend form keys exactly
interface CriterionDef {
  id: string;
  weight: number;
  maxValue: number;
  validValues: number[];
}

const CRITERIA: CriterionDef[] = [
  { id: "anciennete",        weight: 3,   maxValue: 10, validValues: [1, 4, 7, 10] },
  { id: "statut_juridique",  weight: 1.5, maxValue: 4,  validValues: [1, 2, 4] },
  { id: "assurance",         weight: 3.5, maxValue: 10, validValues: [0, 3, 10] },
  { id: "effectif",          weight: 2,   maxValue: 7,  validValues: [1, 3, 5, 7] },
  { id: "labels",            weight: 1.5, maxValue: 5,  validValues: [0, 3, 5] },
  { id: "photos",            weight: 1.5, maxValue: 5,  validValues: [0, 2, 3, 5] },
  { id: "avis",              weight: 1.5, maxValue: 5,  validValues: [0, 2, 3, 5] },
  { id: "presence_en_ligne", weight: 1,   maxValue: 5,  validValues: [0, 2, 3, 5] },
  { id: "zone",              weight: 2.5, maxValue: 9,  validValues: [0, 3, 6, 9] },
  { id: "plan",              weight: 1.5, maxValue: 8,  validValues: [1, 4, 6, 8] },
];

export interface ScoringAnswers {
  [key: string]: number | string | string[];
}

export interface ScoringResult {
  score: number;
  maxScore: number;
  percent: number;
  details: { criterionId: string; points: number; maxPoints: number }[];
  autoAccepted: boolean;
}

export function validateAnswers(answers: ScoringAnswers): string | null {
  if (!answers || typeof answers !== "object") return "Réponses manquantes";

  for (const criterion of CRITERIA) {
    const raw = answers[criterion.id];
    if (raw === undefined || raw === null) {
      return `Réponse manquante pour le critère "${criterion.id}"`;
    }
    const value = typeof raw === "string" ? Number(raw) : raw;
    if (typeof value !== "number" || isNaN(value)) {
      return `Valeur invalide pour "${criterion.id}"`;
    }
    if (!criterion.validValues.includes(value)) {
      return `Option invalide (${value}) pour "${criterion.id}"`;
    }
  }

  return null;
}

export function calculateScore(answers: ScoringAnswers): ScoringResult {
  const details: ScoringResult["details"] = [];
  let totalScore = 0;
  let totalMax = 0;

  for (const criterion of CRITERIA) {
    const raw = answers[criterion.id];
    const value = typeof raw === "string" ? Number(raw) : (raw as number) || 0;
    const weighted = value * criterion.weight;
    const maxWeighted = criterion.maxValue * criterion.weight;

    totalScore += weighted;
    totalMax += maxWeighted;
    details.push({ criterionId: criterion.id, points: weighted, maxPoints: maxWeighted });
  }

  const percent = totalMax > 0 ? Math.round((totalScore / totalMax) * 100) : 0;

  return {
    score: totalScore,
    maxScore: totalMax,
    percent,
    details,
    autoAccepted: percent >= AUTO_ACCEPT_THRESHOLD,
  };
}
