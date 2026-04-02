// Scoring / Admission system for Bativio artisans
// Each criterion has a weight and possible answers with points

export interface ScoringCriterion {
  id: string;
  question: string;
  type: "single" | "multiple" | "boolean";
  options: { value: string; label: string; points: number }[];
  weight: number;
}

export const CRITERIA: ScoringCriterion[] = [
  {
    id: "experience",
    question: "Depuis combien de temps exercez-vous ?",
    type: "single",
    options: [
      { value: "moins_1", label: "Moins d'1 an", points: 1 },
      { value: "1_3", label: "1 à 3 ans", points: 3 },
      { value: "3_5", label: "3 à 5 ans", points: 5 },
      { value: "5_10", label: "5 à 10 ans", points: 8 },
      { value: "plus_10", label: "Plus de 10 ans", points: 10 },
    ],
    weight: 2,
  },
  {
    id: "assurance",
    question: "Avez-vous une assurance décennale en cours de validité ?",
    type: "boolean",
    options: [
      { value: "oui", label: "Oui", points: 10 },
      { value: "non", label: "Non", points: 0 },
    ],
    weight: 3,
  },
  {
    id: "qualifications",
    question: "Avez-vous des qualifications professionnelles ?",
    type: "multiple",
    options: [
      { value: "rge", label: "RGE", points: 5 },
      { value: "qualibat", label: "Qualibat", points: 5 },
      { value: "qualifelec", label: "Qualifelec", points: 5 },
      { value: "qualibois", label: "Qualibois", points: 3 },
      { value: "qualipac", label: "Qualipac", points: 3 },
      { value: "capeb", label: "CAPEB", points: 2 },
      { value: "autre", label: "Autre certification", points: 2 },
      { value: "aucune", label: "Aucune", points: 0 },
    ],
    weight: 2,
  },
  {
    id: "chiffre_affaires",
    question: "Quel est votre chiffre d'affaires annuel ?",
    type: "single",
    options: [
      { value: "moins_30k", label: "Moins de 30 000 EUR", points: 2 },
      { value: "30_70k", label: "30 000 - 70 000 EUR", points: 5 },
      { value: "70_150k", label: "70 000 - 150 000 EUR", points: 8 },
      { value: "plus_150k", label: "Plus de 150 000 EUR", points: 10 },
    ],
    weight: 1,
  },
  {
    id: "equipe",
    question: "Combien de personnes dans votre entreprise ?",
    type: "single",
    options: [
      { value: "solo", label: "Seul(e)", points: 3 },
      { value: "2_5", label: "2 à 5 personnes", points: 6 },
      { value: "5_10", label: "5 à 10 personnes", points: 8 },
      { value: "plus_10", label: "Plus de 10 personnes", points: 10 },
    ],
    weight: 1,
  },
  {
    id: "motivation",
    question: "Pourquoi souhaitez-vous rejoindre Bativio ?",
    type: "multiple",
    options: [
      { value: "visibilite", label: "Gagner en visibilite", points: 3 },
      { value: "clients", label: "Trouver de nouveaux clients", points: 3 },
      { value: "facturation", label: "Gerer ma facturation", points: 2 },
      { value: "organisation", label: "Mieux m'organiser", points: 2 },
      { value: "curiosite", label: "Par curiosite", points: 1 },
    ],
    weight: 1,
  },
];

export const AUTO_ACCEPT_THRESHOLD = 55;

export interface ScoringAnswers {
  [criterionId: string]: string | string[];
}

export interface ScoringResult {
  score: number;
  maxScore: number;
  percent: number;
  details: { criterionId: string; points: number; maxPoints: number }[];
  autoAccepted: boolean;
}

export function validateAnswers(answers: ScoringAnswers): string | null {
  for (const criterion of CRITERIA) {
    const answer = answers[criterion.id];
    if (answer === undefined || answer === null) {
      return `Reponse manquante pour : ${criterion.question}`;
    }

    if (criterion.type === "multiple") {
      if (!Array.isArray(answer) || answer.length === 0) {
        return `Selectionnez au moins une option pour : ${criterion.question}`;
      }
      const validValues = criterion.options.map((o) => o.value);
      for (const v of answer) {
        if (!validValues.includes(v)) {
          return `Option invalide "${v}" pour : ${criterion.question}`;
        }
      }
    } else {
      if (typeof answer !== "string") {
        return `Reponse invalide pour : ${criterion.question}`;
      }
      const validValues = criterion.options.map((o) => o.value);
      if (!validValues.includes(answer)) {
        return `Option invalide "${answer}" pour : ${criterion.question}`;
      }
    }
  }
  return null;
}

export function calculateScore(answers: ScoringAnswers): ScoringResult {
  let totalScore = 0;
  let totalMaxScore = 0;
  const details: ScoringResult["details"] = [];

  for (const criterion of CRITERIA) {
    const answer = answers[criterion.id];
    let points = 0;

    if (criterion.type === "multiple" && Array.isArray(answer)) {
      // For multiple, sum points of selected options (capped at max single option * weight)
      for (const v of answer) {
        const option = criterion.options.find((o) => o.value === v);
        if (option) points += option.points;
      }
    } else if (typeof answer === "string") {
      const option = criterion.options.find((o) => o.value === answer);
      if (option) points = option.points;
    }

    const weightedPoints = points * criterion.weight;
    const maxPoints =
      Math.max(...criterion.options.map((o) => o.points)) * criterion.weight;

    totalScore += weightedPoints;
    totalMaxScore += maxPoints;

    details.push({
      criterionId: criterion.id,
      points: weightedPoints,
      maxPoints,
    });
  }

  const percent =
    totalMaxScore > 0 ? Math.round((totalScore / totalMaxScore) * 100) : 0;

  return {
    score: totalScore,
    maxScore: totalMaxScore,
    percent,
    details,
    autoAccepted: percent >= AUTO_ACCEPT_THRESHOLD,
  };
}
