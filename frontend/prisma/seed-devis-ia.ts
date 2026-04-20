/**
 * Seed initial KbDocument pour Devis IA V1 Bativio
 * Source compilée manuellement depuis brief user + INSEE + Legifrance + FFB 2026
 *
 * Lancement:
 *   cd frontend && npx tsx prisma/seed-devis-ia.ts
 */

import { PrismaClient, Prisma, KbDocType } from "@prisma/client";

const prisma = new PrismaClient();

type Doc = {
  slug: string;
  type: KbDocType;
  title: string;
  content: string;
  metadata?: Record<string, unknown>;
  source?: string;
  periodeRef?: string;
};

// ═══════════════════════════════════════════════════════════
// 1. INDICES BT INSEE — dernier = décembre 2025
// ═══════════════════════════════════════════════════════════
const INDICES_BT: Doc[] = [
  {
    slug: "bt01-2025-12",
    type: "INDICE_BT",
    title: "Indice BT01 — Tous corps d'état (décembre 2025)",
    content: "Indice BT01 publié par l'INSEE pour le mois de décembre 2025 : 133,7. Cet indice couvre tous les corps d'état du bâtiment et sert à réviser les prix des marchés privés et publics.",
    metadata: { indice: "BT01", valeur: 133.7, base: "100 en décembre 2010" },
    source: "https://www.insee.fr/fr/statistiques",
    periodeRef: "2025-12",
  },
  {
    slug: "bt03-2025-12",
    type: "INDICE_BT",
    title: "Indice BT03 — Béton armé (décembre 2025)",
    content: "Indice BT03 béton armé : 128,4 — utilisé pour révisions maçonnerie structure.",
    metadata: { indice: "BT03", valeur: 128.4 },
    source: "https://www.insee.fr/fr/statistiques",
    periodeRef: "2025-12",
  },
  {
    slug: "bt06-2025-12",
    type: "INDICE_BT",
    title: "Indice BT06 — Plomberie sanitaire (décembre 2025)",
    content: "Indice BT06 plomberie sanitaire : 135,2",
    metadata: { indice: "BT06", valeur: 135.2 },
    source: "https://www.insee.fr/fr/statistiques",
    periodeRef: "2025-12",
  },
  {
    slug: "bt13-2025-12",
    type: "INDICE_BT",
    title: "Indice BT13 — Plâtrerie (décembre 2025)",
    content: "Indice BT13 plâtrerie : 131,8",
    metadata: { indice: "BT13", valeur: 131.8 },
    source: "https://www.insee.fr/fr/statistiques",
    periodeRef: "2025-12",
  },
  {
    slug: "bt46-2025-12",
    type: "INDICE_BT",
    title: "Indice BT46 — Peinture bâtiment (décembre 2025)",
    content: "Indice BT46 peinture : 132,9",
    metadata: { indice: "BT46", valeur: 132.9 },
    source: "https://www.insee.fr/fr/statistiques",
    periodeRef: "2025-12",
  },
];

// ═══════════════════════════════════════════════════════════
// 2. TARIFS MARCHÉ RHÔNE-ALPES 2026 (brief user + FFB)
// ═══════════════════════════════════════════════════════════
const TARIFS_MARCHE: Doc[] = [
  {
    slug: "tarif-marche-plombier-rhone-alpes-2026",
    type: "TARIF_MARCHE",
    title: "Plombier — Rhône-Alpes 2026",
    content: `Tarif horaire moyen plombier en Rhône-Alpes 2026 : **55 €/h HT** (fourchette 40-70 €/h).
- Dépannage courant : 55-65 €/h
- Urgence 24h/7j : 80-120 €/h (majoration 50-100%)
- Pose chauffe-eau 150-200L : 400-650 € HT (fourniture + pose main d'œuvre)
- Installation WC complète : 250-400 € HT
- Remplacement douche : 1500-3500 € HT selon finitions
- Création salle de bain complète : 4000-9000 € HT (hors gros œuvre)
Frais de déplacement : 30-50 € forfait zone 15 km, 0,50-0,80 €/km au-delà.`,
    metadata: { metier: "plombier", region: "rhone-alpes", tarifHoraire: 55, tarifHoraireMin: 40, tarifHoraireMax: 70 },
    periodeRef: "2026",
  },
  {
    slug: "tarif-marche-electricien-rhone-alpes-2026",
    type: "TARIF_MARCHE",
    title: "Électricien — Rhône-Alpes 2026",
    content: `Tarif horaire moyen électricien en Rhône-Alpes 2026 : **45 €/h HT** (fourchette 35-65 €/h).
- Mise aux normes tableau : 1500-3500 € HT selon ampleur
- Ajout prise simple : 60-90 € HT (matériel inclus)
- Point lumineux : 80-120 € HT
- Rénovation complète 80m² : 6000-12000 € HT
- Installation domotique basique : 1000-3000 € HT
- Dépannage intervention : forfait 80-150 €.`,
    metadata: { metier: "electricien", region: "rhone-alpes", tarifHoraire: 45, tarifHoraireMin: 35, tarifHoraireMax: 65 },
    periodeRef: "2026",
  },
  {
    slug: "tarif-marche-peintre-rhone-alpes-2026",
    type: "TARIF_MARCHE",
    title: "Peintre — Rhône-Alpes 2026",
    content: `Tarif peintre en Rhône-Alpes 2026 : **35 €/h HT** (30-45 €/h) OU **25-35 €/m² HT** (mur ou plafond, 2 couches, peinture standard, sans préparation lourde).
- Peinture intérieure 2 couches murs + plafond : 25-35 €/m²
- Façade extérieure : 35-60 €/m² (hors ravalement)
- Rebouchages + ponçage + 2 couches : 35-50 €/m²
- Peinture boiseries (portes, fenêtres) : 40-80 € par élément
Ratio fournitures : 12 m²/L en 1 couche, 6-8 m²/L en 2 couches.`,
    metadata: { metier: "peintre", region: "rhone-alpes", tarifHoraire: 35, tarifM2Min: 25, tarifM2Max: 35 },
    periodeRef: "2026",
  },
  {
    slug: "tarif-marche-carreleur-rhone-alpes-2026",
    type: "TARIF_MARCHE",
    title: "Carreleur — Rhône-Alpes 2026",
    content: `Tarif carreleur en Rhône-Alpes 2026 : **40 €/h HT** OU **45-90 €/m² HT** (pose).
- Carrelage sol céramique standard : 45-65 €/m² pose (fourniture 15-40 €/m²)
- Grès cérame : 55-75 €/m² pose
- Mosaïque : 80-120 €/m² pose (plus technique)
- Pierre naturelle : 80-150 €/m² pose
- Faïence murale : 50-80 €/m² pose
Ratio chutes : prévoir +10% sur les surfaces.`,
    metadata: { metier: "carreleur", region: "rhone-alpes", tarifHoraire: 40, tarifM2Min: 45, tarifM2Max: 90 },
    periodeRef: "2026",
  },
  {
    slug: "tarif-marche-macon-rhone-alpes-2026",
    type: "TARIF_MARCHE",
    title: "Maçon — Rhône-Alpes 2026",
    content: `Tarif maçon en Rhône-Alpes 2026 : **55 €/h HT** (35-70 €/h).
- Ouverture dans mur porteur : 1500-4500 € selon portée
- Extension maison (gros œuvre seul) : 800-1500 €/m²
- Dalle béton 15cm : 60-90 €/m²
- Reprise de fissure : 500-2500 € selon ampleur
- Démolition cloison non porteuse : 30-50 €/m².`,
    metadata: { metier: "macon", region: "rhone-alpes", tarifHoraire: 55, tarifHoraireMin: 35, tarifHoraireMax: 70 },
    periodeRef: "2026",
  },
  {
    slug: "tarif-marche-menuisier-rhone-alpes-2026",
    type: "TARIF_MARCHE",
    title: "Menuisier — Rhône-Alpes 2026",
    content: `Tarif menuisier en Rhône-Alpes 2026 : **45 €/h HT** (35-60 €/h).
- Pose fenêtre standard : 300-500 € pose (fourniture 200-800 €)
- Pose porte intérieure : 200-350 € pose
- Pose parquet flottant : 30-50 €/m² pose
- Pose parquet massif : 50-90 €/m² pose
- Escalier sur mesure : 3000-8000 € selon bois et complexité
- Placard sur mesure : 300-600 €/ml.`,
    metadata: { metier: "menuisier", region: "rhone-alpes", tarifHoraire: 45, tarifHoraireMin: 35, tarifHoraireMax: 60 },
    periodeRef: "2026",
  },
  {
    slug: "tarif-marche-couvreur-rhone-alpes-2026",
    type: "TARIF_MARCHE",
    title: "Couvreur — Rhône-Alpes 2026",
    content: `Tarif couvreur en Rhône-Alpes 2026 : **50 €/h HT** OU **60-90 €/m² HT** (réfection toiture).
- Démoussage toiture + traitement : 12-20 €/m²
- Remplacement tuiles cassées : 40-80 € par intervention
- Réfection complète (charpente OK) : 60-90 €/m²
- Isolation sous toiture : 30-60 €/m²
- Zinguerie/gouttière ml : 45-80 €/ml.`,
    metadata: { metier: "couvreur", region: "rhone-alpes", tarifHoraire: 50, tarifM2Min: 60, tarifM2Max: 90 },
    periodeRef: "2026",
  },
  {
    slug: "tarif-marche-chauffagiste-rhone-alpes-2026",
    type: "TARIF_MARCHE",
    title: "Chauffagiste — Rhône-Alpes 2026",
    content: `Tarif chauffagiste en Rhône-Alpes 2026 : **55 €/h HT** (45-70 €/h).
- Installation chaudière gaz condensation : 4000-7000 € TTC (pose incluse)
- Pompe à chaleur air/eau : 12000-18000 € TTC (aides CEE/MaPrimeRénov possibles)
- Pompe à chaleur air/air (clim réversible) : 2500-6000 € TTC
- Remplacement radiateur simple : 200-500 € pose
- Entretien annuel chaudière : 120-180 € TTC.`,
    metadata: { metier: "chauffagiste", region: "rhone-alpes", tarifHoraire: 55, tarifHoraireMin: 45, tarifHoraireMax: 70 },
    periodeRef: "2026",
  },
];

// ═══════════════════════════════════════════════════════════
// 3. MENTIONS OBLIGATOIRES DEVIS 2026
// ═══════════════════════════════════════════════════════════
const MENTIONS_LEGALES: Doc[] = [
  {
    slug: "mentions-obligatoires-devis-2026",
    type: "MENTION_LEGALE",
    title: "Mentions obligatoires devis BTP 2026",
    content: `Liste exhaustive des 16 mentions obligatoires sur un devis travaux (arrêté 24 janvier 2017, Code de la consommation art. L.111-1, L.221-5 et suivants) :

1. Date d'émission et numéro unique du devis
2. Identité complète de l'artisan : dénomination sociale, adresse, SIRET/RCS
3. Numéro de TVA intracommunautaire
4. Numéro d'inscription au Répertoire des Métiers (RM) pour artisans
5. Nom et coordonnées de l'assurance responsabilité civile + décennale (pour travaux concernés)
6. Nom, prénom, adresse du client
7. Adresse du chantier (si différente)
8. Description détaillée des prestations (nature, caractéristiques, quantités)
9. Prix unitaire HT de chaque poste
10. Montant total HT
11. Taux de TVA applicable (5,5% / 10% / 20%) et montant TVA
12. Prix total TTC
13. Date/période d'exécution prévue
14. Durée de validité du devis (30 jours par défaut, à indiquer clairement)
15. Conditions et modalités de paiement (acompte, échéances, pénalités retard)
16. Mention "Devis reçu avant l'exécution des travaux" + case signature client avec "Bon pour accord, date + signature"

Mentions complémentaires obligatoires selon cas :
- Franchise en base TVA : mention "TVA non applicable, art. 293 B du CGI"
- Droit de rétractation 14 jours (si devis signé hors établissement)
- Médiateur de la consommation (nom + coordonnées obligatoires depuis 2016)`,
    metadata: { referenceJuridique: "arrete-24-01-2017", annee: 2026 },
    source: "https://www.legifrance.gouv.fr/loda/id/JORFTEXT000033971968",
    periodeRef: "2026",
  },
];

// ═══════════════════════════════════════════════════════════
// 4. TAUX TVA BTP 2026
// ═══════════════════════════════════════════════════════════
const TVA_TAUX: Doc[] = [
  {
    slug: "tva-btp-2026",
    type: "TVA_TAUX",
    title: "Taux de TVA applicables BTP 2026",
    content: `Trois taux de TVA applicables aux travaux BTP en 2026 :

**TVA 5,5% — Travaux d'amélioration de la qualité énergétique**
- Isolation thermique (murs, toiture, planchers)
- Pose pompe à chaleur, chaudière condensation, poêle à bois
- Chauffe-eau thermodynamique
- VMC double flux
- Équipements de production énergie renouvelable
Condition : logement achevé depuis plus de 2 ans, fourniture + pose par la même entreprise.

**TVA 10% — Travaux d'amélioration, de transformation, d'aménagement et d'entretien**
- Rénovation classique salle de bain, cuisine
- Peinture, carrelage, parquet
- Remplacement fenêtres, portes
- Travaux d'entretien
Condition : logement achevé depuis plus de 2 ans + attestation client normal (CERFA 1300-SD).

**TVA 20% — Taux normal**
- Construction neuve
- Extension qui augmente la SHOB de plus de 10%
- Piscine
- Véranda qui agrandit la surface
- Logement achevé depuis moins de 2 ans

**Cas particulier — Fourniture seule (sans pose)** : toujours 20% (sauf 5,5% spécifique).`,
    metadata: { annee: 2026, taux: [5.5, 10, 20] },
    source: "https://www.impots.gouv.fr/particulier/questions/quel-est-le-taux-de-tva-applicable-aux-travaux-realises-dans-un-logement",
    periodeRef: "2026",
  },
];

// ═══════════════════════════════════════════════════════════
// 5. GUIDES QUANTITÉS (ratios pour Claude)
// ═══════════════════════════════════════════════════════════
const GUIDES_QUANTITE: Doc[] = [
  {
    slug: "guide-quantite-peinture",
    type: "GUIDE_QUANTITE",
    title: "Guide quantités peinture",
    content: `Ratios pour estimer les quantités de peinture :
- **1 couche de peinture mat/satin** : 12 m²/litre
- **2 couches** (recommandé) : 6-8 m²/litre
- **Sous-couche** : 10-12 m²/litre
- **Peinture façade** : 5-7 m²/litre (plus épaisse)

**Calcul surface à peindre** :
- Murs d'une pièce : périmètre × hauteur - ouvertures
- Plafond : surface au sol
- Pièce standard 20 m² : ~50 m² de murs + 20 m² plafond = 70 m² total
- Ajouter +10% pour les pertes et retouches

**Temps de pose** (hors préparation) :
- Peintre expérimenté : 10-15 m²/heure (2 couches)
- Préparation murs (rebouchage, ponçage) : 2-3 m²/heure`,
  },
  {
    slug: "guide-quantite-carrelage",
    type: "GUIDE_QUANTITE",
    title: "Guide quantités carrelage",
    content: `Ratios pour estimer les quantités de carrelage :
- **Surface à commander** : surface réelle × 1,10 (10% chutes)
- **Mosaïque ou coupes complexes** : × 1,15 (15% chutes)
- **Colle à carrelage** : 3-5 kg/m² (selon format)
- **Joints** : 0,3-0,5 kg/m²

**Temps de pose** :
- Carrelage format standard 30×30 ou 45×45 : 4-6 m²/heure
- Grands formats 60×60+ : 3-5 m²/heure (plus technique)
- Mosaïque : 1-2 m²/heure

**Préparation support** : ragréage 8-15 €/m² + primaire obligatoire.`,
  },
  {
    slug: "guide-quantite-plomberie-sdb",
    type: "GUIDE_QUANTITE",
    title: "Guide quantités plomberie salle de bain",
    content: `Estimation pour rénovation salle de bain 5-8 m² :
- **Tuyauterie PER** : 2-3 ml par point d'eau
- **Évacuation PVC** : 1,5-2 ml par appareil
- **Temps de pose** complet (douche + WC + lavabo) : 16-24h
- **Fournitures estimation** : 1200-3000 € (hors carrelage, peinture)
  - Receveur douche + paroi : 400-1200 €
  - Colonne de douche + robinetterie : 150-500 €
  - WC standard : 150-400 €
  - Meuble lavabo + vasque + robinetterie : 300-900 €`,
  },
];

// ═══════════════════════════════════════════════════════════
// 6. GUIDES DE QUALIFICATION (pour Agent 1 Claude)
// ═══════════════════════════════════════════════════════════
const GUIDES_QUALIF: Doc[] = [
  {
    slug: "guide-qualif-plombier",
    type: "GUIDE_QUALIF",
    title: "Questions à poser pour projet plomberie",
    content: `Pour qualifier une demande plombier, collecter :
1. **Type d'intervention** : dépannage urgent / installation neuve / rénovation / entretien
2. **Urgence** : immédiate (fuite, pas d'eau) / semaine / mois / flexible
3. **Pièce concernée** : salle de bain / cuisine / WC / extérieur / multi
4. **Détail matériel** : ex. "chauffe-eau 200L à changer", "douche italienne à créer"
5. **État actuel** : installation récente / vétuste / inexistante
6. **Accès** : étage, facilité de passage des tuyaux
7. **Photos** : fortement recommandées pour chiffrage précis`,
    metadata: { metier: "plombier" },
  },
  {
    slug: "guide-qualif-carreleur",
    type: "GUIDE_QUALIF",
    title: "Questions à poser pour projet carrelage",
    content: `Pour qualifier une demande carreleur, collecter :
1. **Pièce** : sdb / cuisine / salon / terrasse / extérieur
2. **Surface** : en m² précis si possible
3. **Type de carrelage** : céramique standard / grès cérame / mosaïque / pierre naturelle / à définir
4. **Format** : petit (<30cm) / moyen (30-60cm) / grand (>60cm)
5. **État du support** : neuf à poser / ancien carrelage à déposer / chape à faire
6. **Mur ET sol ou un seul** : calcul surfaces différenciées
7. **Délai** : urgent / mois / trimestre / flexible
8. **Budget** : si connu pour orienter les choix matériaux`,
    metadata: { metier: "carreleur" },
  },
  {
    slug: "guide-qualif-peintre",
    type: "GUIDE_QUALIF",
    title: "Questions à poser pour projet peinture",
    content: `Pour qualifier une demande peintre, collecter :
1. **Type** : intérieur / extérieur (façade) / boiseries / mix
2. **Surface totale** en m² (ou nombre de pièces + dimensions)
3. **État des murs** : neufs prêts / repeindre simple / rebouchages / enduits à refaire
4. **Nombre de couleurs** : uni / plusieurs / effets décoratifs
5. **Gamme peinture** : standard / haut de gamme / écologique
6. **Plafonds inclus** : oui/non
7. **Préparation nécessaire** : déménagement meubles, protection sols
8. **Délai et budget**`,
    metadata: { metier: "peintre" },
  },
];

// ═══════════════════════════════════════════════════════════
// Exécution
// ═══════════════════════════════════════════════════════════

async function main() {
  const allDocs: Doc[] = [
    ...INDICES_BT,
    ...TARIFS_MARCHE,
    ...MENTIONS_LEGALES,
    ...TVA_TAUX,
    ...GUIDES_QUANTITE,
    ...GUIDES_QUALIF,
  ];

  console.log(`📚 Seeding ${allDocs.length} documents KB Devis IA...`);

  for (const doc of allDocs) {
    const metadata = doc.metadata as Prisma.InputJsonValue | undefined;
    await prisma.kbDocument.upsert({
      where: { slug: doc.slug },
      update: {
        type: doc.type,
        title: doc.title,
        content: doc.content,
        ...(metadata ? { metadata } : {}),
        source: doc.source ?? undefined,
        periodeRef: doc.periodeRef ?? undefined,
      },
      create: {
        slug: doc.slug,
        type: doc.type,
        title: doc.title,
        content: doc.content,
        ...(metadata ? { metadata } : {}),
        source: doc.source ?? undefined,
        periodeRef: doc.periodeRef ?? undefined,
      },
    });
    console.log(`  ✓ ${doc.slug}`);
  }

  console.log(`\n🎨 Seeding routage settings default...`);
  await prisma.routageSettings.upsert({
    where: { scope: "global" },
    update: {},
    create: {
      scope: "global",
      modeDefault: "MANUEL",
      delaiManuelMin: 120,
      emailTemplate: `Bonjour {{artisanNom}},

Une nouvelle demande de devis correspond à votre métier et votre zone d'intervention.

**Projet** : {{projetSummary}}
**Ville** : {{villeLabel}}
**Métier détecté** : {{metier}}

[Voir la demande complète]({{demandeUrl}})

Vous avez 48h pour générer un devis via Bativio. Les premiers répondants sont prioritairement mis en avant.

L'équipe Bativio`,
    },
  });
  console.log(`  ✓ Routage settings global créés (mode MANUEL, délai 120min)`);

  console.log(`\n✅ Seed Devis IA terminé — ${allDocs.length + 1} entrées créées/mises à jour.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
