import type Anthropic from "@anthropic-ai/sdk";
import { getClaude, MODEL_OPUS, extractJson, computeCost } from "@/lib/claude";
import { prisma } from "@/lib/prisma";

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

RÈGLES ABSOLUES (ne jamais violer) :
1. Priorité 1 : grille tarifaire de l'artisan fournie (tarif horaire, forfaits). Si un forfait match la prestation → utilise-le tel quel.
2. Priorité 2 : moyennes marché Rhône-Alpes 2026 (RAG fourni). Flag ces lignes avec "fallback_marche": true.
3. Applique TVA correcte selon type travaux (10% rénovation / 20% neuf / 5.5% économie énergie).
4. Inclus une mention "hors fournitures finitions" si matériaux non cotés.
5. Si une info manque pour chiffrer fiablement → status "need_clarif" avec liste de questions précises au lieu d'inventer.

MENTIONS OBLIGATOIRES (coche chacune, "ok" ou "manquant") :
- identite_artisan, siret, assurance, identite_client, description_travaux, prix_ht, tva, prix_ttc, validite, paiement, mention_signature

FORMAT JSON STRICT (aucun texte hors JSON) :
{
  "status": "ok" | "need_clarif",
  "clarifications": ["question 1", "question 2"],  // uniquement si status=need_clarif
  "numero": "BTV-2026-XXXX",
  "objet": "résumé projet 1 ligne",
  "lignes": [
    {
      "label": "Désignation courte",
      "description": "détail optionnel",
      "qte": number,
      "unite": "u|h|m²|ml|m³|forfait",
      "puHt": number,
      "totalHt": number,
      "tva": 5.5 | 10 | 20,
      "source": "grille_artisan" | "forfait" | "fallback_marche" | "estimation_ia",
      "fallback_marche": true  // si source != grille_artisan/forfait
    }
  ],
  "sousTotaux": {"mo": number, "mat": number, "deplacement": number},
  "totalHt": number,
  "totalTva": number,
  "totalTtc": number,
  "validiteJours": 30,
  "dureeEstimee": "2-3 jours",
  "conditionsPaiement": "30% à la commande, 70% à la fin des travaux",
  "notes": "remarques artisan ou fournitures",
  "mentionsObligatoires": {"identite_artisan": "ok", "siret": "ok", ...}
}`;

export async function runDevisAgent({ artisanId, demandeId }: DevisAgentInput): Promise<DevisAgentResult> {
  const claude = getClaude();

  // 1. Charge l'artisan + tarification + forfaits
  const artisan = await prisma.artisan.findUnique({
    where: { id: artisanId },
    include: {
      tarification: true,
      prestationTypes: true,
      metier: true,
    },
  });
  if (!artisan) throw new Error("Artisan introuvable");

  // 2. Charge la demande
  const demande = await prisma.demandeProjet.findUnique({ where: { id: demandeId } });
  if (!demande) throw new Error("Demande introuvable");

  // 3. Charge KB marché + mentions + TVA
  const [tarifMarche, mentions, tva, guidesQuantite] = await Promise.all([
    demande.metierDetecte
      ? prisma.kbDocument.findFirst({ where: { type: "TARIF_MARCHE", slug: { contains: demande.metierDetecte } } })
      : null,
    prisma.kbDocument.findFirst({ where: { type: "MENTION_LEGALE", slug: "mentions-obligatoires-devis-2026" } }),
    prisma.kbDocument.findFirst({ where: { type: "TVA_TAUX", slug: "tva-btp-2026" } }),
    prisma.kbDocument.findMany({ where: { type: "GUIDE_QUANTITE" }, take: 3 }),
  ]);

  // 4. Composer contexte artisan
  const forfaitsBlock = artisan.prestationTypes.length > 0
    ? artisan.prestationTypes.map((p) => `  - "${p.designation}" = ${p.prixUnitaire}€ HT /${p.unite}${p.categorie ? ` [${p.categorie}]` : ""}`).join("\n")
    : "  (aucun forfait pré-défini)";

  const artisanBlock = `## Artisan : ${artisan.nomAffichage}
- Métier : ${artisan.metier?.nom || "non renseigné"}
- Ville base : ${artisan.ville || "non renseignée"}
- SIRET : ${artisan.siret}
${artisan.tarification ? `- Tarif horaire : ${artisan.tarification.tarifHoraire}€ HT
- Tarif urgence : ${artisan.tarification.tarifUrgence ?? "non défini"}€ HT
- Minimum facture : ${artisan.tarification.minimumFacture ?? "aucun"}€ HT
- Minimum heures : ${artisan.tarification.minimumHeures ?? "aucun"}h
- Frais déplacement : ${artisan.tarification.fraisDeplacementType} ${artisan.tarification.fraisDeplacementMontant}€
- Prix/km au-delà zone : ${artisan.tarification.prixKm ?? "forfait uniquement"}€
- Marge fournitures : ${artisan.tarification.margeFournitures}%
- TVA par défaut : ${artisan.tarification.tvaDefault}%
- Assurance : ${artisan.tarification.assuranceNom || "?"} n°${artisan.tarification.assuranceNumero || "?"}
- Fourniture : ${artisan.tarification.fourniturePolicy}
- Notes artisan : ${artisan.tarification.notesTarif || "aucune"}` : "- Pas de grille tarifaire renseignée, utiliser le fallback marché"}

### Forfaits de cet artisan
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

  // 6. Composer RAG
  const ragBlock = [
    tarifMarche ? `### Tarifs marché ${demande.metierDetecte}\n${tarifMarche.content}` : "",
    ...guidesQuantite.map((g) => `### ${g.title}\n${g.content}`),
    tva ? `### TVA BTP\n${tva.content}` : "",
    mentions ? `### Mentions obligatoires\n${mentions.content}` : "",
  ].filter(Boolean).join("\n\n");

  const numero = `BTV-2026-${String(Date.now()).slice(-5)}`;

  const userContext = `${artisanBlock}

${demandeBlock}

--- KB RÉFÉRENCE (RAG) ---
${ragBlock}

--- INSTRUCTION ---
Numéro de devis à utiliser : ${numero}

Génère le devis complet en JSON strict selon le format spécifié. Utilise en priorité la grille de l'artisan + ses forfaits. Pour tout ce qui n'est pas couvert, utilise les moyennes marché RAG et flag les lignes.`;

  const result = await claude.messages.create({
    model: MODEL_OPUS,
    max_tokens: 4000,
    system: SYSTEM_PROMPT,
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

  const tokensIn = result.usage.input_tokens;
  const tokensOut = result.usage.output_tokens;
  const cost = computeCost(MODEL_OPUS, tokensIn, tokensOut);

  return { response: parsed, cost, tokensIn, tokensOut, modelUsed: MODEL_OPUS, raw: text };
}
