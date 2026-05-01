import { prisma } from "@/lib/prisma";

// Config values are heterogeneous (string | number | boolean | parsed JSON
// object/array | null) so we type them as `unknown` and let callers narrow
// with a Zod schema or a type predicate. Avoids `any` while keeping the
// cache flexible.
export type ConfigValue = unknown;

const cache = new Map<string, { value: ConfigValue; expiresAt: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * Recupere une config par cle, parse la valeur selon le type.
 *
 * Typage : on retourne `unknown` par défaut, mais le caller peut passer
 * un type générique (`getConfig<string[]>("sms.plans")`). Le caller
 * reste responsable de la cohérence — la valeur stockée en DB n'est pas
 * vérifiée à la lecture (à terme : passer par un Zod schema par clé).
 */
export async function getConfig<T = ConfigValue>(cle: string): Promise<T | null> {
  const now = Date.now();
  const cached = cache.get(cle);
  if (cached && cached.expiresAt > now) {
    return cached.value as T | null;
  }

  const config = await prisma.siteConfig.findUnique({ where: { cle } });
  if (!config) {
    cache.set(cle, { value: null, expiresAt: now + CACHE_TTL });
    return null;
  }

  let parsed: ConfigValue;
  switch (config.type) {
    case "boolean":
      parsed = config.valeur === "true";
      break;
    case "number":
      parsed = Number(config.valeur);
      break;
    case "json":
      parsed = JSON.parse(config.valeur);
      break;
    default:
      parsed = config.valeur;
  }

  cache.set(cle, { value: parsed, expiresAt: now + CACHE_TTL });
  return parsed as T | null;
}

/**
 * Verifie si une feature est activee, et optionnellement si le plan artisan y a acces.
 */
export async function isFeatureEnabled(
  feature: string,
  artisanPlan?: string
): Promise<boolean> {
  const enabled = await getConfig(`features.${feature}`);
  if (!enabled) return false;

  if (artisanPlan) {
    const plans = await getConfig(`features.${feature}.plans`);
    if (plans && Array.isArray(plans)) {
      return plans.includes(artisanPlan);
    }
  }

  return true;
}

/**
 * Vide le cache de configuration.
 */
export function invalidateConfigCache(): void {
  cache.clear();
}
