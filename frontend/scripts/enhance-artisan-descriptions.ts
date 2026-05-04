// scripts/enhance-artisan-descriptions.ts
//
// Enrichit la description publique des artisans en base quand elle est vide,
// trop courte ou un placeholder. Utilise un template paramétré par métier
// + nom d'entreprise + ville + années d'expérience.
//
// Idempotent : ne réécrit pas si la description est déjà longue (>= 200 chars)
// et personnalisée. Lance manuellement quand de nouveaux artisans s'inscrivent
// avec une description vide.
//
// Usage : `cd frontend && npx tsx scripts/enhance-artisan-descriptions.ts`
// Pour forcer la réécriture de tous : `... --force`

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const FORCE = process.argv.includes("--force");
const MIN_LENGTH = 200;

interface MetierTemplate {
  intro: (nom: string, ville: string, exp: number | null) => string;
  expertise: string[];
  closing: (ville: string) => string;
}

const TEMPLATES: Record<string, MetierTemplate> = {
  plombier: {
    intro: (nom, ville, exp) =>
      `${nom} est un plombier professionnel installé à ${ville}.${exp ? ` Avec ${exp} ans d'expérience` : " Spécialiste"} dans tous les travaux de plomberie sanitaire et chauffage, l'entreprise intervient aussi bien pour les particuliers que pour les copropriétés et entreprises locales.`,
    expertise: [
      "Dépannage urgent : fuite d'eau, canalisation bouchée, robinet qui goutte, WC bouché, chauffe-eau en panne",
      "Rénovation de salle de bain complète : douche italienne, baignoire, vasques, robinetterie, faïence",
      "Installation et entretien de chauffe-eau électrique, thermodynamique ou solaire",
      "Pose de systèmes de chauffage : chaudière gaz, pompe à chaleur, plancher chauffant",
      "Détection de fuite par caméra thermique ou inspection vidéo des canalisations",
    ],
    closing: (ville) =>
      `L'équipe se déplace dans toute l'agglomération de ${ville} et alentours. Devis gratuit, intervention rapide en cas d'urgence (24h/24 sur les dépannages critiques). Prix annoncés sans frais cachés. Tous les travaux sont garantis et réalisés en conformité avec les normes DTU et la garantie décennale.`,
  },
  electricien: {
    intro: (nom, ville, exp) =>
      `${nom} est un électricien qualifié basé à ${ville}.${exp ? ` Fort de ${exp} ans d'expérience` : " Avec une solide expertise"} dans l'électricité du bâtiment, l'entreprise intervient pour la mise aux normes NF C 15-100, l'installation neuve, la rénovation et le dépannage urgent.`,
    expertise: [
      "Mise aux normes du tableau électrique : remplacement de disjoncteurs, parafoudre, prise de terre",
      "Installation électrique complète en logement neuf ou rénovation",
      "Domotique : volets roulants connectés, éclairage intelligent, thermostats, alarme",
      "Installation de bornes de recharge pour véhicule électrique (certification IRVE)",
      "Dépannage urgent : panne de courant, court-circuit, prise grillée, tableau qui disjoncte",
      "Mise en sécurité avant vente immobilière (diagnostic et travaux)",
    ],
    closing: (ville) =>
      `L'entreprise dispose des qualifications et habilitations électriques en cours de validité. Toutes les interventions sont conformes à la norme NF C 15-100 et couvertes par la garantie décennale. Zone d'intervention : ${ville} et communes alentours. Devis gratuit en 24h, intervention possible le jour même pour les urgences.`,
  },
  peintre: {
    intro: (nom, ville, exp) =>
      `${nom} est un peintre en bâtiment installé à ${ville}.${exp ? ` Avec ${exp} ans d'expérience` : " Professionnel"} dans la peinture intérieure et extérieure, l'entreprise réalise des chantiers chez les particuliers comme dans les locaux commerciaux et tertiaires.`,
    expertise: [
      "Peinture intérieure : murs, plafonds, boiseries, radiateurs, finitions mat, satinée ou laquée",
      "Peinture extérieure : ravalement de façade, traitement hydrofuge, peinture de boiseries extérieures",
      "Pose de papier peint, intissé, toile de verre",
      "Enduits décoratifs : tadelakt, béton ciré, stuc, effets matières",
      "Peinture spéciale pièces humides (salle de bain, cuisine) avec produits anti-moisissures",
      "Préparation des supports : rebouchage, ponçage, sous-couche, traitement anti-rouille",
    ],
    closing: (ville) =>
      `Travail soigné, finitions impeccables, protection systématique du mobilier et des sols. Utilisation de peintures écologiques (label A+, sans COV) sur demande. Devis détaillé gratuit, planning précis communiqué avant le début du chantier. Intervention à ${ville} et dans toute l'agglomération.`,
  },
  macon: {
    intro: (nom, ville, exp) =>
      `${nom} est un maçon professionnel basé à ${ville}.${exp ? ` Avec ${exp} ans d'expérience` : " Spécialisé"} dans le gros œuvre et la maçonnerie traditionnelle, l'entreprise intervient sur des projets de construction neuve, rénovation, extension et aménagement extérieur.`,
    expertise: [
      "Construction neuve : fondations, élévation des murs en parpaing, brique ou béton cellulaire",
      "Extension de maison : surélévation, agrandissement de plain-pied, véranda maçonnée",
      "Aménagement extérieur : terrasse, dalle béton, mur de clôture, escalier, muret",
      "Rénovation de maisons anciennes : reprise de fondations, ouverture de murs porteurs, réfection de façade en pierre",
      "Ravalement de façade : nettoyage haute pression, traitement, enduit, peinture extérieure",
      "Travaux en zone sismique 3, 4 ou 5 conformes à l'Eurocode 8 (PCMI13)",
    ],
    closing: (ville) =>
      `L'entreprise est titulaire d'une assurance décennale qui couvre l'ensemble des ouvrages structurels pendant 10 ans. Devis détaillé avec quantitatif précis (m³ de béton, kg d'acier, surface), planning communiqué avant le démarrage. Zone d'intervention : ${ville} et communes alentours.`,
  },
  carreleur: {
    intro: (nom, ville, exp) =>
      `${nom} est un carreleur professionnel installé à ${ville}.${exp ? ` Avec ${exp} ans de métier` : " Qualifié"}, l'entreprise pose carrelage et faïence dans toutes les pièces de votre logement avec un souci du détail et des finitions soignées.`,
    expertise: [
      "Pose de carrelage au sol : grands formats, mosaïques, opus romain, motifs",
      "Pose de faïence murale : salle de bain, cuisine, crédence",
      "Étanchéité des pièces humides (SPEC, primaire d'accrochage)",
      "Ragréage et préparation des supports (chape, ravoirage)",
      "Joints époxy ou ciment teinté, rénovation de joints existants",
    ],
    closing: (ville) =>
      `Pose dans les règles de l'art (DTU 52.1 et 52.2), garantie décennale. Devis chiffré au m² avec fourniture et pose détaillées. Intervention à ${ville} et alentours.`,
  },
  menuisier: {
    intro: (nom, ville, exp) =>
      `${nom} est un menuisier basé à ${ville}.${exp ? ` Avec ${exp} ans d'expérience` : " Professionnel"} en menuiserie intérieure et extérieure, l'entreprise réalise pose, fabrication sur mesure et rénovation.`,
    expertise: [
      "Pose de fenêtres et portes-fenêtres : PVC, aluminium, bois, double ou triple vitrage",
      "Pose de portes intérieures et portes d'entrée blindées (point fort A2P 1, 2, 3)",
      "Fabrication sur mesure : meuble, escalier, dressing, bibliothèque",
      "Pose de parquet : massif, contrecollé, stratifié, en bandes ou point de Hongrie",
      "Volets roulants, battants, persiennes (manuels ou motorisés)",
    ],
    closing: (ville) =>
      `Membre du SNFA pour les fenêtres, garantie décennale, conformité RT2020 et NF EN 14351. Devis détaillé gratuit. Zone d'intervention : ${ville} et communes alentours.`,
  },
  couvreur: {
    intro: (nom, ville, exp) =>
      `${nom} est un couvreur-zingueur installé à ${ville}.${exp ? ` Avec ${exp} ans de métier` : " Qualifié"} dans tous types de couvertures, l'entreprise intervient en neuf, rénovation et entretien.`,
    expertise: [
      "Réfection complète de toiture : tuile, ardoise, zinc, bac acier",
      "Pose de fenêtres de toit (Velux), lucarnes, châssis",
      "Étanchéité de toiture-terrasse, isolation par l'extérieur (sarking)",
      "Démoussage et traitement hydrofuge curatif",
      "Réparation ponctuelle après tempête, fuite, casse de tuile",
      "Zinguerie : gouttières, descentes, abergement de cheminée, faîtage",
    ],
    closing: (ville) =>
      `Garantie décennale sur tous les travaux de couverture. Audit gratuit avec photos drone disponible sur demande. Intervention rapide en cas de fuite. Zone : ${ville} et alentours.`,
  },
  chauffagiste: {
    intro: (nom, ville, exp) =>
      `${nom} est un chauffagiste qualifié basé à ${ville}.${exp ? ` Avec ${exp} ans d'expérience` : " Spécialiste"} en chauffage, l'entreprise intervient sur l'installation, l'entretien et le dépannage de tous types de systèmes de chauffage.`,
    expertise: [
      "Installation de pompe à chaleur (PAC air/eau, géothermie, eau/eau) — éligible MaPrimeRénov",
      "Pose et entretien de chaudière gaz à condensation, fioul ou granulés bois",
      "Mise en place de plancher chauffant hydraulique ou électrique",
      "Entretien annuel obligatoire de chaudière (décret 2009-649)",
      "Dépannage urgent en cas de panne en plein hiver",
      "Bilan thermique et conseil sur la rénovation énergétique du logement",
    ],
    closing: (ville) =>
      `L'entreprise est qualifiée RGE (Reconnu Garant de l'Environnement), permettant à ses clients de bénéficier de MaPrimeRénov, des CEE et de la TVA réduite à 5,5%. Intervention à ${ville} et dans toute l'agglomération. Devis gratuit, contrat d'entretien annuel disponible.`,
  },
};

function buildDescription(
  nom: string,
  metier: string,
  ville: string,
  exp: number | null
): string {
  const t = TEMPLATES[metier];
  if (!t) return "";
  const intro = t.intro(nom, ville, exp);
  const expertiseList = t.expertise.map((e) => `• ${e}`).join("\n");
  const closing = t.closing(ville);
  return `${intro}\n\nDomaines d'intervention :\n${expertiseList}\n\n${closing}`;
}

function slugifyMetier(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

async function main() {
  const artisans = await prisma.artisan.findMany({
    where: { deletedAt: null },
    select: {
      id: true,
      nomAffichage: true,
      raisonSociale: true,
      ville: true,
      description: true,
      experienceAnnees: true,
      metier: { select: { nom: true, slug: true } },
    },
  });

  console.log(`${artisans.length} artisans trouvés.\n`);

  let updated = 0;
  let skipped = 0;
  let noTemplate = 0;

  for (const a of artisans) {
    const currentLen = (a.description || "").length;
    const isPlaceholder =
      !a.description ||
      currentLen < MIN_LENGTH ||
      /^artisan|description|à compléter|placeholder/i.test(a.description.trim());

    if (!FORCE && !isPlaceholder) {
      skipped++;
      console.log(`✓ ${a.nomAffichage.padEnd(35)} OK (${currentLen} chars)`);
      continue;
    }

    const metierSlug = a.metier?.slug || (a.metier?.nom ? slugifyMetier(a.metier.nom) : "");
    if (!TEMPLATES[metierSlug]) {
      noTemplate++;
      console.log(`✗ ${a.nomAffichage.padEnd(35)} pas de template pour métier "${metierSlug}"`);
      continue;
    }

    const nom = a.raisonSociale || a.nomAffichage;
    const ville = a.ville || "Rhône-Alpes";
    const exp = a.experienceAnnees && a.experienceAnnees > 0 ? a.experienceAnnees : null;
    const description = buildDescription(nom, metierSlug, ville, exp);

    await prisma.artisan.update({
      where: { id: a.id },
      data: { description },
    });

    updated++;
    console.log(`→ ${a.nomAffichage.padEnd(35)} mis à jour (${description.length} chars)`);
  }

  console.log(`\nRécapitulatif:`);
  console.log(`  Mis à jour : ${updated}`);
  console.log(`  Sautés (déjà OK) : ${skipped}`);
  console.log(`  Sans template métier : ${noTemplate}`);
}

main()
  .catch((e) => {
    console.error("Erreur:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
