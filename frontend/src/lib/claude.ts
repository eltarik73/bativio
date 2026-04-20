import Anthropic from "@anthropic-ai/sdk";
import fs from "node:fs";
import path from "node:path";

export const MODEL_OPUS = "claude-opus-4-5";
export const MODEL_SONNET = "claude-sonnet-4-5";
export const MODEL_HAIKU = "claude-haiku-4-5";

let _client: Anthropic | null = null;

function readApiKeyFromEnvFile(): string | null {
  const envPath = path.join(process.cwd(), ".env.local");
  try {
    const content = fs.readFileSync(envPath, "utf-8");
    const match = content.match(/^ANTHROPIC_API_KEY=(.+)$/m);
    if (match) return match[1].trim().replace(/^["']|["']$/g, "");
  } catch {
    /* silent */
  }
  return null;
}

export function getClaude(): Anthropic {
  if (_client) return _client;
  let apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey || apiKey.trim() === "") {
    apiKey = readApiKeyFromEnvFile() ?? undefined;
  }
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY manquante (vérifier .env.local)");
  _client = new Anthropic({ apiKey, baseURL: "https://api.anthropic.com" });
  return _client;
}

export interface TokenUsage {
  input: number;
  output: number;
  costEur: number;
}

const PRICING_USD_PER_1M: Record<string, { in: number; out: number }> = {
  [MODEL_OPUS]: { in: 15, out: 75 },
  [MODEL_SONNET]: { in: 3, out: 15 },
  [MODEL_HAIKU]: { in: 1, out: 5 },
};

const USD_TO_EUR = 0.92;

export function computeCost(model: string, tokensIn: number, tokensOut: number): number {
  const p = PRICING_USD_PER_1M[model] ?? PRICING_USD_PER_1M[MODEL_SONNET];
  const usd = (tokensIn / 1_000_000) * p.in + (tokensOut / 1_000_000) * p.out;
  return Math.round(usd * USD_TO_EUR * 10000) / 10000;
}

export function extractJson<T = unknown>(text: string): T | null {
  const match = text.match(/```json\s*([\s\S]*?)\s*```/) || text.match(/\{[\s\S]*\}/);
  if (!match) return null;
  const raw = match[1] ?? match[0];
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}
