/**
 * Templates SMS automatiques pour artisans (Rhône-Alpes).
 * Limité à 160 chars par SMS standard, sinon 2 SMS.
 * Variables entre {{}} remplacées à l'envoi.
 */

export interface SmsTemplate {
  id: string;
  label: string;
  description: string;
  content: string;
  category: "rdv" | "devis" | "facture" | "prospect";
  variables: string[];
}

export const SMS_TEMPLATES: SmsTemplate[] = [
  {
    id: "rappel-rdv-j1",
    label: "Rappel RDV J-1",
    description: "Rappel automatique la veille du RDV à 18h",
    content: "Bonjour {{clientPrenom}}, rappel RDV demain {{date}} à {{heure}} au {{adresse}}. Merci de confirmer. {{artisan}}",
    category: "rdv",
    variables: ["clientPrenom", "date", "heure", "adresse", "artisan"],
  },
  {
    id: "confirmation-rdv",
    label: "Confirmation RDV",
    description: "Envoi immédiat après prise de RDV",
    content: "{{artisan}}: RDV confirmé {{date}} à {{heure}}. Adresse: {{adresse}}. Répondez STOP pour annuler.",
    category: "rdv",
    variables: ["artisan", "date", "heure", "adresse"],
  },
  {
    id: "devis-envoye",
    label: "Devis envoyé",
    description: "Notification client quand devis PDF envoyé",
    content: "Bonjour {{clientPrenom}}, votre devis {{numero}} ({{montant}}€ TTC) est dispo: {{url}}. Valable 30j. {{artisan}}",
    category: "devis",
    variables: ["clientPrenom", "numero", "montant", "url", "artisan"],
  },
  {
    id: "relance-devis-j7",
    label: "Relance devis J+7",
    description: "Relance si devis non signé après 7 jours",
    content: "Bonjour {{clientPrenom}}, votre devis {{numero}} expire dans {{joursRestants}}j. Une question? {{artisan}} {{telephone}}",
    category: "devis",
    variables: ["clientPrenom", "numero", "joursRestants", "artisan", "telephone"],
  },
  {
    id: "relance-facture-j15",
    label: "Relance facture J+15",
    description: "Relance douce à 15j d'échéance dépassée",
    content: "Bonjour {{clientPrenom}}, la facture {{numero}} ({{montant}}€) est due depuis {{joursRetard}}j. Merci de régulariser. {{artisan}}",
    category: "facture",
    variables: ["clientPrenom", "numero", "montant", "joursRetard", "artisan"],
  },
  {
    id: "nouveau-prospect",
    label: "Accusé réception demande",
    description: "SMS automatique quand le client fait une demande",
    content: "Bonjour {{clientPrenom}}, nous avons bien reçu votre demande. Je vous rappelle sous 24h. {{artisan}}",
    category: "prospect",
    variables: ["clientPrenom", "artisan"],
  },
  {
    id: "fin-chantier",
    label: "Fin de chantier",
    description: "Remerciement + demande avis à la fin du chantier",
    content: "Merci {{clientPrenom}} pour votre confiance ! Laissez-nous un avis: {{urlAvis}}. Très bonne journée ! {{artisan}}",
    category: "rdv",
    variables: ["clientPrenom", "urlAvis", "artisan"],
  },
];

export function renderTemplate(content: string, vars: Record<string, string>): string {
  return content.replace(/\{\{(\w+)\}\}/g, (_, k) => vars[k] ?? `{{${k}}}`);
}

export function getTemplateById(id: string): SmsTemplate | undefined {
  return SMS_TEMPLATES.find((t) => t.id === id);
}

export function getTemplatesByCategory(cat: SmsTemplate["category"]): SmsTemplate[] {
  return SMS_TEMPLATES.filter((t) => t.category === cat);
}
