import type Anthropic from "@anthropic-ai/sdk";
import { getClaude, MODEL_SONNET, extractJson, computeCost } from "@/lib/claude";
import { prisma } from "@/lib/prisma";

export interface PreDevis {
  fourchetteHt: { min: number; max: number };
  explication: string;
  facteurs: string[];
  disclaimer: string;
  unite: "€ HT" | "€ TTC";
}

const SYSTEM_PROMPT = `Tu es DevisIA, expert chiffrage BTP Bativio (Rhône-Alpes). Tu génères UNIQUEMENT une fourchette indicative basée sur les moyennes marché RAG fournies.

RÈGLES STRICTES :
- Fourchette basse = scenario minimum réaliste, haute = scenario maximum.
- Base toujours sur les tarifs marché fournis dans le contexte.
- Tu ne donnes PAS de devis ferme — c'est une estimation pour situer le client.
- Explication concise (2-3 phrases max) qui justifie la fourchette.
- Liste 3-5 facteurs qui feront varier le prix final.
- Disclaimer obligatoire : "Estimation indicative — devis ferme après échange artisan."

FORMAT JSON STRICT :
{
  "fourchetteHt": {"min": number, "max": number},
  "explication": "texte 2-3 phrases",
  "facteurs": ["facteur 1", "facteur 2", ...],
  "disclaimer": "Estimation indicative — devis ferme après échange artisan.",
  "unite": "€ HT"
}`;

interface PreDevisInput {
  metier: string;
  description: string;
  qualifData: Record<string, string>;
  ville?: string | null;
}

interface PreDevisResult {
  response: PreDevis;
  cost: number;
  tokensIn: number;
  tokensOut: number;
  raw: string;
}

export async function runPreDevisAgent(input: PreDevisInput): Promise<PreDevisResult> {
  const claude = getClaude();

  // Fetch RAG : moyennes marché pour ce métier
  const tarifDoc = await prisma.kbDocument.findFirst({
    where: {
      type: "TARIF_MARCHE",
      slug: { contains: input.metier },
    },
  });

  const guideQuantiteDocs = await prisma.kbDocument.findMany({
    where: { type: "GUIDE_QUANTITE" },
    take: 3,
  });

  const ragBlock = [
    tarifDoc ? `## Tarifs marché ${input.metier}\n${tarifDoc.content}` : "",
    ...guideQuantiteDocs.map((d) => `## ${d.title}\n${d.content}`),
  ]
    .filter(Boolean)
    .join("\n\n");

  const userContext = `Métier détecté : ${input.metier}
Ville : ${input.ville || "Rhône-Alpes (moyenne)"}
Description client : "${input.description}"
Qualif collectée : ${JSON.stringify(input.qualifData)}

--- DONNÉES RAG ---
${ragBlock || "(aucun tarif marché spécifique trouvé, utilise ta connaissance BTP Rhône-Alpes 2026)"}

Génère la fourchette indicative en JSON.`;

  const result = await claude.messages.create({
    model: MODEL_SONNET,
    max_tokens: 800,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: userContext }],
  });

  const text = result.content
    .filter((b): b is Anthropic.Messages.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("\n");

  const parsed = extractJson<PreDevis>(text);
  if (!parsed) {
    throw new Error(`Agent pré-devis: réponse non-JSON. Raw: ${text.slice(0, 300)}`);
  }

  const tokensIn = result.usage.input_tokens;
  const tokensOut = result.usage.output_tokens;
  const cost = computeCost(MODEL_SONNET, tokensIn, tokensOut);

  return { response: parsed, cost, tokensIn, tokensOut, raw: text };
}
