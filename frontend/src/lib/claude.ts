import Anthropic from "@anthropic-ai/sdk";
import fs from "node:fs";
import path from "node:path";
import { prisma } from "@/lib/prisma";

export const MODEL_OPUS = "claude-opus-4-7";
export const MODEL_SONNET = "claude-sonnet-4-6";
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

// Anthropic prompt caching pricing (relative to standard input):
// - cache write (creation): 1.25× standard input
// - cache read (hit): 0.10× standard input (90% reduction)
const CACHE_WRITE_MULTIPLIER = 1.25;
const CACHE_READ_MULTIPLIER = 0.10;

/**
 * Compute API cost in EUR for one Claude call.
 * Honors prompt caching pricing (cache_read = 90% off, cache_creation = 25% surcharge).
 *
 * @param tokensIn       New input tokens (NOT counting cache_read or cache_creation)
 * @param tokensOut      Output tokens generated
 * @param tokensCacheRead   Tokens served from cache (90% cheaper)
 * @param tokensCacheCreation Tokens written to cache (25% surcharge)
 */
export function computeCost(
  model: string,
  tokensIn: number,
  tokensOut: number,
  tokensCacheRead: number = 0,
  tokensCacheCreation: number = 0,
): number {
  const p = PRICING_USD_PER_1M[model] ?? PRICING_USD_PER_1M[MODEL_SONNET];
  const usd =
    (tokensIn / 1_000_000) * p.in +
    (tokensOut / 1_000_000) * p.out +
    (tokensCacheRead / 1_000_000) * p.in * CACHE_READ_MULTIPLIER +
    (tokensCacheCreation / 1_000_000) * p.in * CACHE_WRITE_MULTIPLIER;
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

interface LogTokenUsageInput {
  agent: string;
  model: string;
  tokensIn: number;
  tokensOut: number;
  tokensCacheRead?: number;
  tokensCacheCreation?: number;
  artisanId?: string | null;
  demandeId?: string | null;
  devisId?: string | null;
  success?: boolean;
  errorMessage?: string | null;
  latencyMs?: number | null;
}

/**
 * Log Claude API usage to DB (non-bloquant).
 * Permet de monitorer coûts IA par agent, artisan, demande.
 *
 * Calcule le coût en tenant compte du prompt caching (cache_read = -90%).
 * Erreurs DB loggées en JSON structuré pour ingestion par observability.
 */
export function logTokenUsage(input: LogTokenUsageInput): void {
  const costEur = computeCost(
    input.model,
    input.tokensIn,
    input.tokensOut,
    input.tokensCacheRead ?? 0,
    input.tokensCacheCreation ?? 0,
  );
  void prisma.tokenUsage.create({
    data: {
      agent: input.agent,
      model: input.model,
      tokensIn: input.tokensIn,
      tokensOut: input.tokensOut,
      tokensCacheRead: input.tokensCacheRead ?? null,
      tokensCacheCreation: input.tokensCacheCreation ?? null,
      costEur,
      artisanId: input.artisanId ?? null,
      demandeId: input.demandeId ?? null,
      devisId: input.devisId ?? null,
      success: input.success ?? true,
      errorMessage: input.errorMessage ?? null,
      latencyMs: input.latencyMs ?? null,
    },
  }).catch((e: Error) => {
    // Log structuré JSON-line → ingérable par Vercel logs / Logtail / Datadog.
    // Tag "_severity":"warning" + "_type":"observability" pour filtrer en prod.
    console.error(JSON.stringify({
      _severity: "warning",
      _type: "observability",
      _scope: "logTokenUsage",
      message: "Failed to persist Claude token usage (non-blocking)",
      error: e.message,
      stack: e.stack,
      payload: {
        agent: input.agent,
        model: input.model,
        tokensIn: input.tokensIn,
        tokensOut: input.tokensOut,
        artisanId: input.artisanId,
        demandeId: input.demandeId,
      },
      timestamp: new Date().toISOString(),
    }));
  });
}

/**
 * Helper de logging structuré pour erreurs critiques.
 * Format compatible Vercel + Sentry (si SENTRY_DSN défini, peut être étendu).
 */
export function logError(scope: string, error: Error, context?: Record<string, unknown>): void {
  console.error(JSON.stringify({
    _severity: "error",
    _type: "application",
    _scope: scope,
    message: error.message,
    stack: error.stack,
    context: context ?? {},
    timestamp: new Date().toISOString(),
  }));
}
