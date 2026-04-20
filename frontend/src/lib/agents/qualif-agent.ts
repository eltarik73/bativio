import type Anthropic from "@anthropic-ai/sdk";
import { getClaude, MODEL_SONNET, extractJson, computeCost } from "@/lib/claude";
import { prisma } from "@/lib/prisma";

export interface QualifQuestion {
  id: string;
  prompt: string;
  type: "choices" | "text" | "contact";
  choices?: { label: string; value: string }[];
  placeholder?: string;
}

export interface QualifResponse {
  step: "question" | "done";
  metier: string | null;
  question: QualifQuestion | null;
  collected: Record<string, string>;
  next_action: "ask" | "contact" | "finish";
  reasoning?: string;
}

export interface QualifMessage {
  role: "user" | "assistant";
  content: string;
}

const SYSTEM_PROMPT = `Tu es l'assistant Bativio, qui aide les particuliers de Rhône-Alpes à décrire leur projet de travaux pour trouver le bon artisan.

Tu poses des questions courtes et ciblées (5-7 maximum) pour qualifier le besoin.

ÉTAPES (dans cet ordre) :
1. Détecte le(s) métier(s) concerné(s) : plombier, electricien, peintre, carreleur, macon, menuisier, couvreur, chauffagiste, serrurier, cuisiniste.
2. Pose 3-5 questions clés selon le métier (surface, type, état actuel, urgence).
3. Termine par délai et budget si pas encore évoqués.
4. Quand tu as assez d'infos, retourne "step": "done" avec "next_action": "contact".

RÈGLES :
- Privilégie les choix multiples (type: "choices") quand possible, c'est plus rapide.
- Utilise "text" uniquement si la question nécessite une précision libre.
- Questions courtes, max 12 mots.
- Une seule question à la fois.
- Reste chaleureux mais efficace.
- Ne fais PAS la question de contact toi-même — retourne juste "done" et l'UI la pose.

FORMAT DE RÉPONSE (JSON strict, aucun texte hors JSON) :
{
  "step": "question" | "done",
  "metier": "plombier" | "electricien" | ... | null,
  "question": {
    "id": "slug_court_unique",
    "prompt": "Votre question ?",
    "type": "choices" | "text",
    "choices": [{"label": "Libellé", "value": "slug"}, ...],
    "placeholder": "texte d'aide (si type=text)"
  } | null,
  "collected": {"questionId": "valeur", ...},
  "next_action": "ask" | "contact" | "finish"
}

GUIDES PAR MÉTIER (indicatifs) :
- plombier : type intervention, pièce, urgence, détail matériel
- carreleur : pièce, surface, type carrelage, état support
- peintre : surface, type (int/ext/bois), état murs, nombre couches
- electricien : type (normes/ajout/rénov/panne), surface logement
- macon : type (ext/ouverture/dalle/fissure), volume
- couvreur : type intervention, surface toiture
- chauffagiste : installation (chaudière/PAC/clim/radiateur), existant
- menuisier : type (pose/parquet/escalier/placards)`;

interface QualifInput {
  initialDescription: string;
  history: QualifMessage[];
  collected: Record<string, string>;
  ville?: string | null;
}

interface QualifResult {
  response: QualifResponse;
  cost: number;
  tokensIn: number;
  tokensOut: number;
  modelUsed: string;
  raw: string;
}

export async function runQualifAgent({
  initialDescription,
  history,
  collected,
  ville,
}: QualifInput): Promise<QualifResult> {
  const claude = getClaude();

  const userContext = `Description initiale : "${initialDescription}"
Ville : ${ville || "non renseignée"}
Données déjà collectées : ${JSON.stringify(collected)}

Historique :
${history.map((m) => `${m.role === "user" ? "CLIENT" : "ASSISTANT"}: ${m.content}`).join("\n")}

Que fais-tu ensuite ? Réponds en JSON uniquement.`;

  const result = await claude.messages.create({
    model: MODEL_SONNET,
    max_tokens: 1000,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: userContext }],
  });

  const text = result.content
    .filter((b): b is Anthropic.Messages.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("\n");

  const parsed = extractJson<QualifResponse>(text);
  if (!parsed) {
    throw new Error(`Agent qualif: réponse non-JSON. Raw: ${text.slice(0, 300)}`);
  }

  const tokensIn = result.usage.input_tokens;
  const tokensOut = result.usage.output_tokens;
  const cost = computeCost(MODEL_SONNET, tokensIn, tokensOut);

  return { response: parsed, cost, tokensIn, tokensOut, modelUsed: MODEL_SONNET, raw: text };
}

/**
 * Injecte les guides qualif de la KB pour enrichir le prompt système.
 */
export async function buildSystemPromptWithKb(): Promise<string> {
  const guides = await prisma.kbDocument.findMany({
    where: { type: "GUIDE_QUALIF" },
    select: { title: true, content: true },
  });
  if (guides.length === 0) return SYSTEM_PROMPT;
  const kbBlock = guides.map((g) => `### ${g.title}\n${g.content}`).join("\n\n");
  return `${SYSTEM_PROMPT}\n\n--- GUIDES KB (référence complémentaire) ---\n${kbBlock}`;
}

