export const CHANTIER_COLORS = [
  { hex: "#C4531A", label: "Terre" },
  { hex: "#E8A84C", label: "Or" },
  { hex: "#2563EB", label: "Bleu" },
  { hex: "#16A34A", label: "Vert" },
  { hex: "#DC2626", label: "Rouge" },
  { hex: "#9333EA", label: "Violet" },
  { hex: "#F59E0B", label: "Ambre" },
  { hex: "#06B6D4", label: "Cyan" },
  { hex: "#EC4899", label: "Rose" },
  { hex: "#6B7280", label: "Gris" },
];

export const CHANTIER_STATUTS = [
  { value: "PLANIFIE", label: "Planifi\u00e9", color: "#2563EB" },
  { value: "EN_COURS", label: "En cours", color: "#16A34A" },
  { value: "TERMINE", label: "Termin\u00e9", color: "#6B7280" },
  { value: "ANNULE", label: "Annul\u00e9", color: "#DC2626" },
  { value: "REPORTE", label: "Report\u00e9", color: "#F59E0B" },
] as const;
