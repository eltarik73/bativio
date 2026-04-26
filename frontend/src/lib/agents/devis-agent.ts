import type Anthropic from "@anthropic-ai/sdk";
import { getClaude, MODEL_OPUS, extractJson, computeCost, logTokenUsage } from "@/lib/claude";
import { prisma } from "@/lib/prisma";
import { generateNextDevisNumero } from "@/lib/devis-numero";
import { validateDevisIA } from "@/lib/agents/devis-validator";

export interface DevisLigne {
  label: string;
  description?: string;
  qte: number;
  unite: string;
  puHt: number;
  totalHt: number;
  tva: number;
  source: "grille_artisan" | "forfait" | "fallback_marche" | "estimation_ia";
  fallback_marche?: boolean;
}

export interface DevisIAOutput {
  status: "ok" | "need_clarif";
  clarifications?: string[];
  numero?: string;
  objet?: string;
  lignes?: DevisLigne[];
  sousTotaux?: { mo: number; mat: number; deplacement: number };
  totalHt?: number;
  totalTva?: number;
  totalTtc?: number;
  validiteJours?: number;
  dureeEstimee?: string;
  conditionsPaiement?: string;
  notes?: string;
  mentionsObligatoires?: Record<string, "ok" | "manquant">;
}

interface DevisAgentInput {
  artisanId: string;
  demandeId: string;
}

interface DevisAgentResult {
  response: DevisIAOutput;
  cost: number;
  tokensIn: number;
  tokensOut: number;
  modelUsed: string;
  raw: string;
}

const SYSTEM_PROMPT = `Tu es DevisIA, expert chiffrage BTP Bativio pour la Rhône-Alpes. Tu génères un devis 100% conforme et réaliste pour un artisan donné.

HIÉRARCHIE DES SOURCES DE PRIX (ordre obligatoire) :
1. **FORFAITS ARTISAN** (prestationTypes) — si la prestation existe dans SES forfaits, utilise son prix tel quel, unité incluse. Source: "forfait".
2. **TARIFS HORAIRES MULTI-MÉTIERS** — si l'artisan a un TarifHoraireMetier pour le métier détecté, utilise ce tarif (PAS le tarif global). Source: "grille_artisan".
3. **TARIF HORAIRE GLOBAL** (Tarification.tarifHoraire) — fallback si pas de multi-métier. Source: "grille_artisan".
4. **CATALOGUE STANDARDISÉ** (prestations BTP 2026) — si pas de forfait artisan, utilise la prestation du catalogue (prix moyen) + SES taux horaires pour la main-d'œuvre calculée. Source: "catalogue".
5. **MOYENNES MARCHÉ RAG** — dernier recours si catalogue absent. Source: "fallback_marche".

RÈGLES ABSOLUES :
- Tu matches systématiquement chaque poste du devis à un code catalogue si possible (ex: "PLB-009" pour pose chauffe-eau). Ajoute le code dans un champ "code" optionnel.
- Applique TVA par prestation selon type (10% rénov / 20% neuf / 5.5% éco-énergie). La TVA du catalogue est indicative, tu peux l'adapter au contexte.
- Si info manque pour chiffrer (ex: surface non précisée) → status "need_clarif" avec questions précises AU LIEU D'INVENTER.
- Ajoute déplacement en ligne séparée (tarif artisan ou km × prix_km).
- Inclus notes "hors finitions" si matériaux non cotés.
- Tu n'inventes JAMAIS un prix qui n'est pas dans la grille, catalogue ou RAG.

MENTIONS OBLIGATOIRES (check chacune, "ok" ou "manquant") :
- identite_artisan, siret, assurance, identite_client, description_travaux, prix_ht, tva, prix_ttc, validite, paiement, mention_signature

FORMAT JSON STRICT (aucun texte hors JSON) :
{
  "status": "ok" | "need_clarif",
  "clarifications": ["question 1"],
  "numero": "BTV-2026-XXXX",
  "objet": "résumé projet 1 ligne",
  "metierPrincipal": "plombier" | ...,
  "lignes": [
    {
      "code": "PLB-009",
      "label": "Désignation courte",
      "description": "détail optionnel",
      "qte": number,
      "unite": "u|h|m²|ml|m³|forfait",
      "puHt": number,
      "totalHt": number,
      "tva": 5.5 | 10 | 20,
      "source": "forfait" | "grille_artisan" | "catalogue" | "fallback_marche",
      "fallback_marche": true,
      "metierLigne": "plombier"
    }
  ],
  "sousTotaux": {"mo": number, "mat": number, "deplacement": number},
  "totalHt": number,
  "totalTva": number,
  "totalTtc": number,
  "validiteJours": 30,
  "dureeEstimee": "2-3 jours",
  "conditionsPaiement": "30% à la commande, 70% à la fin",
  "notes": "remarques / fournitures",
  "mentionsObligatoires": {"identite_artisan": "ok", ...}
}`;

export async function runDevisAgent({ artisanId, demandeId }: DevisAgentInput): Promise<DevisAgentResult> {
  const claude = getClaude();

  // 1. Charge artisan + tarification + forfaits + tarifs multi-métiers
  const artisan = await prisma.artisan.findUnique({
    where: { id: artisanId },
    include: {
      tarification: true,
      prestationTypes: true,
      metier: true,
      tarifsMetiers: true,
      artisanMetiers: { include: { metier: true } },
    },
  });
  if (!artisan) throw new Error("Artisan introuvable");

  // 2. Charge la demande
  const demande = await prisma.demandeProjet.findUnique({ where: { id: demandeId } });
  if (!demande) throw new Error("Demande introuvable");

  // 3. Charge KB marché + mentions + TVA + catalogue prestations métier
  const [tarifMarche, mentions, tva, guidesQuantite, catalogue] = await Promise.all([
    demande.metierDetecte
      ? prisma.kbDocument.findFirst({ where: { type: "TARIF_MARCHE", slug: { contains: demande.metierDetecte } } })
      : null,
    prisma.kbDocument.findFirst({ where: { type: "MENTION_LEGALE", slug: "mentions-obligatoires-devis-2026" } }),
    prisma.kbDocument.findFirst({ where: { type: "TVA_TAUX", slug: "tva-btp-2026" } }),
    prisma.kbDocument.findMany({ where: { type: "GUIDE_QUANTITE" }, take: 3 }),
    demande.metierDetecte
      ? prisma.cataloguePrestation.findMany({
          where: { metierSlug: demande.metierDetecte },
          orderBy: { code: "asc" },
        })
      : prisma.cataloguePrestation.findMany({ take: 50, orderBy: { code: "asc" } }),
  ]);

  // 4. Composer contexte artisan
  const forfaitsBlock = artisan.prestationTypes.length > 0
    ? artisan.prestationTypes.map((p) => `  - [${p.metierSlug || "tous"}] "${p.designation}" = ${p.prixUnitaire}€ HT /${p.unite}${p.categorie ? ` [${p.categorie}]` : ""}`).join("\n")
    : "  (aucun forfait pré-défini)";

  const tarifsMetierBlock = artisan.tarifsMetiers.length > 0
    ? artisan.tarifsMetiers.map((t) => `  - ${t.metierNom} (${t.metierSlug}) : ${t.tarifHoraire}€/h${t.tarifUrgence ? ` (urgence ${t.tarifUrgence}€)` : ""}${t.tarifWeekend ? ` (weekend ${t.tarifWeekend}€)` : ""}${t.minimumFacture ? ` min ${t.minimumFacture}€` : ""}${t.notes ? ` — ${t.notes}` : ""}`).join("\n")
    : "  (pas de tarif spécifique par métier, utiliser tarif horaire global ci-dessous)";

  const metiersBlock = artisan.artisanMetiers.length > 0
    ? artisan.artisanMetiers.map((am) => am.metier?.nom).filter(Boolean).join(", ")
    : (artisan.metier?.nom || "non renseigné");

  const artisanBlock = `## Artisan : ${artisan.nomAffichage}
- Métiers exercés : ${metiersBlock}
- Ville base : ${artisan.ville || "non renseignée"}
- SIRET : ${artisan.siret}
${artisan.tarification ? `
### Tarif horaire GLOBAL (fallback)
- Tarif horaire : ${artisan.tarification.tarifHoraire}€ HT
- Tarif urgence : ${artisan.tarification.tarifUrgence ?? "non défini"}€ HT
- Minimum facture : ${artisan.tarification.minimumFacture ?? "aucun"}€ HT
- Minimum heures : ${artisan.tarification.minimumHeures ?? "aucun"}h
- Frais déplacement : ${artisan.tarification.fraisDeplacementType} ${artisan.tarification.fraisDeplacementMontant}€
- Prix/km au-delà zone : ${artisan.tarification.prixKm ?? "forfait uniquement"}€
- Marge fournitures : ${artisan.tarification.margeFournitures}%
- TVA par défaut : ${artisan.tarification.tvaDefault}%
- Assurance : ${artisan.tarification.assuranceNom || "?"} n°${artisan.tarification.assuranceNumero || "?"}
- Fourniture : ${artisan.tarification.fourniturePolicy}
- Notes artisan : ${artisan.tarification.notesTarif || "aucune"}` : "- Pas de grille tarifaire renseignée, utiliser fallback catalogue/marché"}

### Tarifs horaires PAR MÉTIER (priorité sur tarif global)
${tarifsMetierBlock}

### Forfaits prédéfinis de cet artisan (PRIORITÉ 1 pour matching)
${forfaitsBlock}`;

  // 5. Composer contexte demande
  const qualifBlock = demande.qualifJson
    ? Object.entries(demande.qualifJson as Record<string, string>).map(([k, v]) => `  - ${k} : ${v}`).join("\n")
    : "  (aucune qualif structurée)";

  const demandeBlock = `## Demande client
- Description : "${demande.description}"
- Ville : ${demande.villeLabel || "non renseignée"}
- Métier détecté : ${demande.metierDetecte || "non renseigné"}
- Client : ${demande.contactNom || "?"}${demande.contactEmail ? ` <${demande.contactEmail}>` : ""}

### Qualification IA
${qualifBlock}`;

  // 6. Composer catalogue standardisé (codes + prix marché par prestation)
  const catalogueBlock = catalogue.length > 0
    ? `### Catalogue prestations BTP 2026 Rhône-Alpes (${catalogue.length} entrées, utilise pour matching)\n` +
      catalogue.map((c) => {
        const kw = Array.isArray(c.motsCles) ? (c.motsCles as string[]).slice(0, 4).join(", ") : "";
        return `- [${c.code}] ${c.designation} (${c.unite}) — ${c.prixHtBas}€ / ${c.prixHtMoyen}€ / ${c.prixHtHaut}€ HT${c.dureeMoyenneH ? ` · ~${c.dureeMoyenneH}h` : ""}${c.tvaDefault ? ` · TVA ${c.tvaDefault}%` : ""}${kw ? ` · [${kw}]` : ""}`;
      }).join("\n")
    : "";

  // 7. Séparer RAG stable (cacheable par métier) du RAG variable
  const ragStableBlock = [
    catalogueBlock,
    tarifMarche ? `### Tarifs marché ${demande.metierDetecte}\n${tarifMarche.content}` : "",
    ...guidesQuantite.map((g) => `### ${g.title}\n${g.content}`),
    tva ? `### TVA BTP\n${tva.content}` : "",
    mentions ? `### Mentions obligatoires 2026\n${mentions.content}` : "",
  ].filter(Boolean).join("\n\n");

  // Numérotation séquentielle ATOMIQUE (advisory lock PostgreSQL)
  const numero = await generateNextDevisNumero(artisan.id, "BTV-");

  // System = instructions + RAG stable (cacheable car stable par métier, ~3-5k tokens)
  const systemWithRag = `${SYSTEM_PROMPT}

--- KB RÉFÉRENCE (RAG stable par métier) ---
${ragStableBlock}`;

  // userContext = ce qui change à chaque appel (artisan, demande, numéro)
  const userContext = `${artisanBlock}

${demandeBlock}

--- INSTRUCTION ---
Numéro de devis à utiliser : ${numero}

Génère le devis complet en JSON strict selon le format spécifié. Utilise en priorité la grille de l'artisan + ses forfaits. Pour tout ce qui n'est pas couvert, utilise les moyennes marché RAG et flag les lignes.`;

  const startTime = Date.now();

  try {
    // Prompt caching sur systemWithRag (>1024 tokens assuré car catalogue inclus)
    // Gain attendu : 60-80% sur tokens input dès le 2e appel dans la fenêtre 5min
    const result = await claude.messages.create({
      model: MODEL_OPUS,
      max_tokens: 4000,
      system: [
        {
          type: "text",
          text: systemWithRag,
          cache_control: { type: "ephemeral" },
        },
      ],
      messages: [{ role: "user", content: userContext }],
    });

    const text = result.content
      .filter((b): b is Anthropic.Messages.TextBlock => b.type === "text")
      .map((b) => b.text)
      .join("\n");

    const parsed = extractJson<DevisIAOutput>(text);
    if (!parsed) {
      throw new Error(`Agent devis: réponse non-JSON. Raw: ${text.slice(0, 300)}`);
    }

    // SÉCU: validation post-IA — empêche envoi devis halluciné (50K€ erreur, etc.)
    const validation = validateDevisIA(parsed, catalogue);
    if (!validation.valid) {
      // Erreurs critiques → throw, l'API caller va flag pour review humaine
      const errMsg = `Devis IA invalide (validation post-génération): ${validation.errors.join(" | ")}`;
      console.error("[devis-agent]", errMsg, "warnings:", validation.warnings);
      throw new Error(errMsg);
    }
    if (validation.warnings.length > 0) {
      console.warn("[devis-agent] warnings non-bloquantes:", validation.warnings);
    }

    const tokensIn = result.usage.input_tokens;
    const tokensOut = result.usage.output_tokens;
    const cacheRead = result.usage.cache_read_input_tokens ?? 0;
    const cacheCreation = result.usage.cache_creation_input_tokens ?? 0;
    const cost = computeCost(MODEL_OPUS, tokensIn, tokensOut);

    logTokenUsage({
      agent: "devis",
      model: MODEL_OPUS,
      tokensIn,
      tokensOut,
      tokensCacheRead: cacheRead,
      tokensCacheCreation: cacheCreation,
      artisanId,
      demandeId,
      success: true,
      latencyMs: Date.now() - startTime,
    });

    return { response: parsed, cost, tokensIn, tokensOut, modelUsed: MODEL_OPUS, raw: text };
  } catch (error) {
    logTokenUsage({
      agent: "devis",
      model: MODEL_OPUS,
      tokensIn: 0,
      tokensOut: 0,
      artisanId,
      demandeId,
      success: false,
      errorMessage: (error as Error).message,
      latencyMs: Date.now() - startTime,
    });
    throw error;
  }
}
