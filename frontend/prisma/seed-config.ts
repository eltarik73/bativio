import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface ConfigEntry {
  cle: string;
  valeur: string;
  type: string;
  categorie: string;
  label: string;
  description?: string;
}

const configs: ConfigEntry[] = [
  // ==================== SMS ====================
  { cle: "sms.enabled", valeur: "true", type: "boolean", categorie: "sms", label: "SMS actives" },
  { cle: "sms.provider", valeur: "brevo", type: "string", categorie: "sms", label: "Provider SMS" },
  { cle: "sms.nouveau_devis_urgent_artisan", valeur: "true", type: "boolean", categorie: "sms", label: "SMS artisan si devis urgent" },
  { cle: "sms.reponse_devis_urgent_client", valeur: "true", type: "boolean", categorie: "sms", label: "SMS client si devis urgent" },
  { cle: "sms.rappel_rdv", valeur: "true", type: "boolean", categorie: "sms", label: "SMS rappel RDV" },
  { cle: "sms.rdv_annule", valeur: "true", type: "boolean", categorie: "sms", label: "SMS RDV annule" },
  { cle: "sms.plans_autorises", valeur: '["PRO_PLUS"]', type: "json", categorie: "sms", label: "Plans autorises SMS", description: "Plans ayant acces aux SMS" },
  { cle: "sms.quota_gratuit", valeur: "0", type: "number", categorie: "sms", label: "Quota SMS Gratuit" },
  { cle: "sms.quota_essentiel", valeur: "0", type: "number", categorie: "sms", label: "Quota SMS Essentiel" },
  { cle: "sms.quota_pro", valeur: "0", type: "number", categorie: "sms", label: "Quota SMS Pro" },
  { cle: "sms.quota_pro_plus", valeur: "30", type: "number", categorie: "sms", label: "Quota SMS Pro+" },
  { cle: "sms.fallback_email", valeur: "true", type: "boolean", categorie: "sms", label: "Fallback email si SMS impossible" },
  { cle: "sms.recharge_enabled", valeur: "true", type: "boolean", categorie: "sms", label: "Recharge SMS activee" },
  { cle: "sms.recharge_prix", valeur: "5", type: "number", categorie: "sms", label: "Prix recharge SMS (EUR)" },
  { cle: "sms.recharge_quantite", valeur: "100", type: "number", categorie: "sms", label: "Quantite par recharge SMS" },

  // ==================== EMAIL ====================
  { cle: "email.enabled", valeur: "true", type: "boolean", categorie: "email", label: "Emails actives" },
  { cle: "email.from_name", valeur: "Bativio", type: "string", categorie: "email", label: "Nom expediteur" },
  { cle: "email.from_address", valeur: "onboarding@resend.dev", type: "string", categorie: "email", label: "Adresse expediteur" },
  { cle: "email.bienvenue", valeur: "true", type: "boolean", categorie: "email", label: "Email de bienvenue" },
  { cle: "email.validation", valeur: "true", type: "boolean", categorie: "email", label: "Email de validation" },
  { cle: "email.nouveau_devis", valeur: "true", type: "boolean", categorie: "email", label: "Email nouveau devis" },
  { cle: "email.devis_envoye", valeur: "true", type: "boolean", categorie: "email", label: "Email devis envoye" },
  { cle: "email.rappel_rdv", valeur: "true", type: "boolean", categorie: "email", label: "Email rappel RDV" },

  // ==================== PLANS ====================
  { cle: "plans.gratuit.enabled", valeur: "true", type: "boolean", categorie: "plans", label: "Plan Gratuit actif" },
  { cle: "plans.gratuit.photos_max", valeur: "3", type: "number", categorie: "plans", label: "Photos max Gratuit" },
  { cle: "plans.gratuit.badges_max", valeur: "2", type: "number", categorie: "plans", label: "Badges max Gratuit" },
  { cle: "plans.essentiel.enabled", valeur: "true", type: "boolean", categorie: "plans", label: "Plan Essentiel actif" },
  { cle: "plans.essentiel.prix", valeur: "19", type: "number", categorie: "plans", label: "Prix Essentiel (EUR)" },
  { cle: "plans.essentiel.photos_max", valeur: "10", type: "number", categorie: "plans", label: "Photos max Essentiel" },
  { cle: "plans.pro.enabled", valeur: "true", type: "boolean", categorie: "plans", label: "Plan Pro actif" },
  { cle: "plans.pro.prix", valeur: "49", type: "number", categorie: "plans", label: "Prix Pro (EUR)" },
  { cle: "plans.pro.photos_max", valeur: "-1", type: "number", categorie: "plans", label: "Photos max Pro", description: "-1 = illimite" },
  { cle: "plans.pro_plus.enabled", valeur: "true", type: "boolean", categorie: "plans", label: "Plan Pro+ actif" },
  { cle: "plans.pro_plus.prix", valeur: "79", type: "number", categorie: "plans", label: "Prix Pro+ (EUR)" },
  { cle: "plans.pro_plus.photos_max", valeur: "-1", type: "number", categorie: "plans", label: "Photos max Pro+", description: "-1 = illimite" },

  // ==================== FEATURES ====================
  { cle: "features.devis_ia", valeur: "true", type: "boolean", categorie: "features", label: "Devis IA active" },
  { cle: "features.devis_ia.plans", valeur: '["PRO_PLUS"]', type: "json", categorie: "features", label: "Plans Devis IA" },
  { cle: "features.agenda", valeur: "true", type: "boolean", categorie: "features", label: "Agenda active" },
  { cle: "features.agenda.plans", valeur: '["ESSENTIEL","PRO","PRO_PLUS"]', type: "json", categorie: "features", label: "Plans Agenda" },
  { cle: "features.crm", valeur: "false", type: "boolean", categorie: "features", label: "CRM active" },
  { cle: "features.crm.plans", valeur: '["PRO","PRO_PLUS"]', type: "json", categorie: "features", label: "Plans CRM" },
  { cle: "features.facturation", valeur: "false", type: "boolean", categorie: "features", label: "Facturation activee" },
  { cle: "features.agent_ia", valeur: "false", type: "boolean", categorie: "features", label: "Agent IA active" },
  { cle: "features.agent_ia.plans", valeur: '["PRO_PLUS"]', type: "json", categorie: "features", label: "Plans Agent IA" },
  { cle: "features.avis", valeur: "false", type: "boolean", categorie: "features", label: "Avis clients actives" },
  { cle: "features.qrcode", valeur: "true", type: "boolean", categorie: "features", label: "QR Code active" },
  { cle: "features.qrcode.plans", valeur: '["PRO","PRO_PLUS"]', type: "json", categorie: "features", label: "Plans QR Code" },
  { cle: "features.export_comptable", valeur: "false", type: "boolean", categorie: "features", label: "Export comptable active" },
  { cle: "features.inscription_publique", valeur: "true", type: "boolean", categorie: "features", label: "Inscription publique ouverte" },
  { cle: "features.validation_requise", valeur: "true", type: "boolean", categorie: "features", label: "Validation admin requise" },
  { cle: "features.fourniture_materiel", valeur: "true", type: "boolean", categorie: "features", label: "Fourniture materiel activee" },

  // ==================== SEO / DESIGN ====================
  { cle: "seo.site_name", valeur: "Bativio", type: "string", categorie: "seo", label: "Nom du site" },
  { cle: "seo.site_description", valeur: "Trouvez votre artisan de confiance en Rh\u00f4ne-Alpes.", type: "string", categorie: "seo", label: "Description du site" },
  { cle: "seo.site_url", valeur: "https://bativio.vercel.app", type: "string", categorie: "seo", label: "URL du site" },
  { cle: "seo.google_analytics_id", valeur: "", type: "string", categorie: "seo", label: "Google Analytics ID" },
  { cle: "design.hero_title", valeur: "Trouvez votre artisan de confiance", type: "string", categorie: "seo", label: "Titre Hero" },
  { cle: "design.hero_subtitle", valeur: "Artisans qualifi\u00e9s en Rh\u00f4ne-Alpes. Z\u00e9ro commission.", type: "string", categorie: "seo", label: "Sous-titre Hero" },
  { cle: "design.maintenance_mode", valeur: "false", type: "boolean", categorie: "seo", label: "Mode maintenance" },
  { cle: "design.maintenance_message", valeur: "Bativio est en maintenance.", type: "string", categorie: "seo", label: "Message maintenance" },

  // ==================== LEGAL ====================
  { cle: "legal.societe", valeur: "Bativio", type: "string", categorie: "legal", label: "Nom societe" },
  { cle: "legal.siret", valeur: "", type: "string", categorie: "legal", label: "SIRET" },
  { cle: "legal.adresse", valeur: "Chamb\u00e9ry, France", type: "string", categorie: "legal", label: "Adresse" },
  { cle: "legal.email_contact", valeur: "contact@bativio.fr", type: "string", categorie: "legal", label: "Email de contact" },
  { cle: "legal.telephone", valeur: "", type: "string", categorie: "legal", label: "Telephone" },

  // ==================== MODERATION ====================
  { cle: "moderation.auto_approve", valeur: "false", type: "boolean", categorie: "moderation", label: "Auto-approbation artisans" },
  { cle: "moderation.max_devis_ia_global", valeur: "100", type: "number", categorie: "moderation", label: "Max devis IA global/mois" },
  { cle: "moderation.max_devis_ia_artisan", valeur: "10", type: "number", categorie: "moderation", label: "Max devis IA par artisan/mois" },
  { cle: "moderation.max_sms_global", valeur: "500", type: "number", categorie: "moderation", label: "Max SMS global/mois" },
];

export async function seedConfig() {
  console.log("  Seeding site configs...");

  for (const c of configs) {
    await prisma.siteConfig.upsert({
      where: { cle: c.cle },
      update: {
        valeur: c.valeur,
        type: c.type,
        categorie: c.categorie,
        label: c.label,
        description: c.description ?? null,
      },
      create: {
        cle: c.cle,
        valeur: c.valeur,
        type: c.type,
        categorie: c.categorie,
        label: c.label,
        description: c.description ?? null,
      },
    });
  }

  console.log(`  ${configs.length} site configs`);
}
