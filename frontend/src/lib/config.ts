import { prisma } from "@/lib/prisma";

// Cache avec TTL de 5 minutes
const cache = new Map<string, { value: any; expiresAt: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * Recupere une config par cle, parse la valeur selon le type.
 */
export async function getConfig(cle: string): Promise<any> {
  const now = Date.now();
  const cached = cache.get(cle);
  if (cached && cached.expiresAt > now) {
    return cached.value;
  }

  const config = await prisma.siteConfig.findUnique({ where: { cle } });
  if (!config) {
    cache.set(cle, { value: null, expiresAt: now + CACHE_TTL });
    return null;
  }

  let parsed: any;
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
  return parsed;
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
