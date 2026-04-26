import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

/**
 * Rate-limiter Upstash Redis pour endpoints publics critiques (IA, upload, auth).
 *
 * - Si UPSTASH_REDIS_REST_URL/TOKEN absents → fallback in-memory (dev local).
 * - Le fallback in-memory N'EST PAS partagé entre cold starts Vercel,
 *   donc INSUFFISANT en prod (pourquoi Upstash est obligatoire).
 *
 * Variables d'env Vercel à définir :
 * - UPSTASH_REDIS_REST_URL
 * - UPSTASH_REDIS_REST_TOKEN
 *
 * Création gratuite : https://upstash.com (10K commandes/jour gratuit, suffisant)
 */

let redis: Redis | null = null;
try {
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    redis = Redis.fromEnv();
  }
} catch {
  /* fallback */
}

// Fallback in-memory pour dev local (Map → reset au cold start, ok pour dev)
const memoryStore = new Map<string, { count: number; resetAt: number }>();

interface MemoryLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

function memoryLimit(key: string, max: number, windowMs: number): MemoryLimitResult {
  const now = Date.now();
  const cur = memoryStore.get(key);
  if (!cur || now >= cur.resetAt) {
    memoryStore.set(key, { count: 1, resetAt: now + windowMs });
    return { success: true, limit: max, remaining: max - 1, reset: now + windowMs };
  }
  cur.count++;
  if (cur.count > max) {
    return { success: false, limit: max, remaining: 0, reset: cur.resetAt };
  }
  return { success: true, limit: max, remaining: max - cur.count, reset: cur.resetAt };
}

/**
 * Rate-limit IA endpoints publics (chat-qualif, estimation-live).
 * 30 req/IP/h en prod (Redis) ou in-memory en dev.
 *
 * Justification : 1 chat IA fait 5-7 questions, donc 30/h = ~5 conversations
 * complètes par IP par heure. Limite haute pour ne pas casser un user légitime
 * mais bloque vite un attaquant qui voudrait brûler le compte Anthropic
 * (240€/jour potentiel sans rate-limit).
 */
const aiLimiter = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(30, "1 h"),
      prefix: "rl:bativio:ai",
      analytics: true,
    })
  : null;

export async function rateLimitAi(ip: string): Promise<{ success: boolean; remaining: number; reset: number }> {
  if (aiLimiter) {
    const r = await aiLimiter.limit(`ai:${ip}`);
    return { success: r.success, remaining: r.remaining, reset: r.reset };
  }
  const r = memoryLimit(`ai:${ip}`, 30, 3600_000);
  return { success: r.success, remaining: r.remaining, reset: r.reset };
}

/**
 * Rate-limit upload endpoints (Cloudinary signature, photos artisan).
 * 20 req/IP/h.
 */
const uploadLimiter = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(20, "1 h"),
      prefix: "rl:bativio:upload",
      analytics: true,
    })
  : null;

export async function rateLimitUpload(ip: string): Promise<{ success: boolean; remaining: number; reset: number }> {
  if (uploadLimiter) {
    const r = await uploadLimiter.limit(`upload:${ip}`);
    return { success: r.success, remaining: r.remaining, reset: r.reset };
  }
  const r = memoryLimit(`upload:${ip}`, 20, 3600_000);
  return { success: r.success, remaining: r.remaining, reset: r.reset };
}

/**
 * Rate-limit auth (login, register, magic-link, forgot).
 * 10 req/IP/15min.
 */
const authLimiter = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(10, "15 m"),
      prefix: "rl:bativio:auth",
      analytics: true,
    })
  : null;

export async function rateLimitAuth(ip: string): Promise<{ success: boolean; remaining: number; reset: number }> {
  if (authLimiter) {
    const r = await authLimiter.limit(`auth:${ip}`);
    return { success: r.success, remaining: r.remaining, reset: r.reset };
  }
  const r = memoryLimit(`auth:${ip}`, 10, 900_000);
  return { success: r.success, remaining: r.remaining, reset: r.reset };
}

/**
 * Extract client IP from Next.js Request headers (Vercel + standard).
 */
export function getClientIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  const xri = req.headers.get("x-real-ip");
  if (xri) return xri.trim();
  return "unknown";
}
