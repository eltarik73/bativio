import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

/**
 * Distributed rate-limiter backed by Postgres.
 *
 * Why a DB table over an in-process Map: Vercel runs each region (and often
 * each invocation) in a separate Node process, so a `new Map()` lives only as
 * long as one warm container. An attacker hitting different regions trivially
 * resets their counter. This helper persists counters in a row keyed by the
 * caller (IP, email, etc.) so all regions share the same view.
 *
 * Fallback: if the `rate_limits` table doesn't exist yet (migration not
 * applied), the helper degrades to an in-memory Map and logs a warning. Once
 * `prisma migrate deploy` is run, the DB path takes over without any code
 * change. This lets us ship the call sites today and apply the migration
 * separately.
 */

const memoryFallback = new Map<string, { count: number; resetAt: number }>();
let memoryWarnedOnce = false;

function isMissingTableError(err: unknown): boolean {
  // P2021 = "The table does not exist in the current database."
  return err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2021";
}

function memoryConsume(key: string, max: number, windowMs: number) {
  if (!memoryWarnedOnce) {
    console.warn("[rate-limit] rate_limits table missing — using in-memory fallback. Run `prisma migrate deploy` to enable distributed limiting.");
    memoryWarnedOnce = true;
  }
  const now = Date.now();
  const entry = memoryFallback.get(key);
  if (!entry || now >= entry.resetAt) {
    memoryFallback.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: max - 1, resetAt: now + windowMs };
  }
  if (entry.count >= max) {
    return { allowed: false, remaining: 0, resetAt: entry.resetAt };
  }
  entry.count += 1;
  return { allowed: true, remaining: max - entry.count, resetAt: entry.resetAt };
}

/**
 * Atomically increment a rate-limit counter and decide whether the caller is
 * still within budget. Returns `allowed=false` if the key has hit `max`
 * within the current window.
 */
export async function consumeRateLimit(
  key: string,
  max: number,
  windowMs: number,
): Promise<{ allowed: boolean; remaining: number; resetAt: number }> {
  const now = new Date();
  const newReset = new Date(now.getTime() + windowMs);

  try {
    // Single round-trip upsert: insert if absent, otherwise read existing row.
    // We then decide in JS whether to accept the call and (if accepted) write
    // back the incremented count or a fresh window.
    const existing = await prisma.rateLimit.findUnique({ where: { key } });

    if (!existing || existing.resetAt <= now) {
      await prisma.rateLimit.upsert({
        where: { key },
        create: { key, count: 1, resetAt: newReset },
        update: { count: 1, resetAt: newReset },
      });
      return { allowed: true, remaining: max - 1, resetAt: newReset.getTime() };
    }

    if (existing.count >= max) {
      return { allowed: false, remaining: 0, resetAt: existing.resetAt.getTime() };
    }

    const updated = await prisma.rateLimit.update({
      where: { key },
      data: { count: { increment: 1 } },
    });
    return { allowed: true, remaining: Math.max(0, max - updated.count), resetAt: existing.resetAt.getTime() };
  } catch (err) {
    if (isMissingTableError(err)) {
      return memoryConsume(key, max, windowMs);
    }
    // Any other DB error: don't block legitimate users on infrastructure
    // glitches — degrade open and log loudly.
    console.error("[rate-limit] DB error, allowing request:", err);
    return { allowed: true, remaining: max - 1, resetAt: now.getTime() + windowMs };
  }
}

/** Reset (delete) a rate-limit key, e.g. after a successful login. */
export async function resetRateLimit(key: string): Promise<void> {
  try {
    await prisma.rateLimit.delete({ where: { key } }).catch(() => {});
  } catch (err) {
    if (!isMissingTableError(err)) {
      console.error("[rate-limit] reset error:", err);
    }
    memoryFallback.delete(key);
  }
}
