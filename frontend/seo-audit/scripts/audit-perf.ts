/**
 * Audit performance via Google PageSpeed Insights API.
 *
 * Recupere : performance score, LCP, INP, CLS, TTFB, bytes total transferes.
 * Cle env : PAGESPEED_API_KEY (optionnelle — sans clé : 1 req/sec, 25k req/jour limite).
 */
import { writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join } from "node:path";

const BASE_URL = process.env.SEO_AUDIT_BASE_URL || "https://www.bativio.fr";
const API_KEY = process.env.PAGESPEED_API_KEY || "";
const OUT_DIR = join(process.cwd(), "seo-audit", "technical");

const URLS_TO_TEST = [
  "/",
  "/lyon",
  "/electricien-aix-les-bains",
  "/facturation-electronique",
  "/tarifs",
];

export interface PerfPage {
  url: string;
  strategy: "mobile" | "desktop";
  performanceScore: number | null;
  lcp: number | null;
  inp: number | null;
  cls: number | null;
  ttfb: number | null;
  totalBytes: number | null;
  error?: string;
}

export interface PerfAuditResult {
  baseUrl: string;
  auditedAt: string;
  hasApiKey: boolean;
  pages: PerfPage[];
}

async function fetchPageSpeed(targetUrl: string, strategy: "mobile" | "desktop"): Promise<PerfPage> {
  const apiUrl = new URL("https://www.googleapis.com/pagespeedonline/v5/runPagespeed");
  apiUrl.searchParams.set("url", targetUrl);
  apiUrl.searchParams.set("strategy", strategy);
  apiUrl.searchParams.append("category", "performance");
  if (API_KEY) apiUrl.searchParams.set("key", API_KEY);

  const result: PerfPage = {
    url: targetUrl, strategy,
    performanceScore: null, lcp: null, inp: null, cls: null, ttfb: null, totalBytes: null,
  };

  try {
    const res = await fetch(apiUrl.toString(), { signal: AbortSignal.timeout(60_000) });
    if (!res.ok) {
      result.error = `HTTP ${res.status}`;
      return result;
    }
    const data: any = await res.json();
    const lh = data.lighthouseResult;
    if (lh) {
      result.performanceScore = Math.round((lh.categories?.performance?.score ?? 0) * 100);
      const audits = lh.audits || {};
      result.lcp = audits["largest-contentful-paint"]?.numericValue ?? null;
      result.cls = audits["cumulative-layout-shift"]?.numericValue ?? null;
      result.ttfb = audits["server-response-time"]?.numericValue ?? null;
      result.totalBytes = audits["total-byte-weight"]?.numericValue ?? null;
      // INP n'est pas toujours dispo en lab, on tente loadingExperience (CrUX field)
    }
    const crux = data.loadingExperience?.metrics;
    if (crux) {
      const inp = crux["INTERACTION_TO_NEXT_PAINT"];
      if (inp?.percentile != null) result.inp = inp.percentile;
    }
  } catch (e) {
    result.error = (e as Error).message;
  }
  return result;
}

export async function runPerfAudit(): Promise<PerfAuditResult> {
  console.log(`[perf] PageSpeed audit (apiKey=${API_KEY ? "yes" : "no"}) on ${URLS_TO_TEST.length} URLs (mobile)...`);
  const pages: PerfPage[] = [];
  for (const path of URLS_TO_TEST) {
    const fullUrl = path.startsWith("http") ? path : BASE_URL + path;
    console.log(`  - ${fullUrl}`);
    const p = await fetchPageSpeed(fullUrl, "mobile");
    pages.push(p);
    console.log(`    score=${p.performanceScore} lcp=${p.lcp ? Math.round(p.lcp) + "ms" : "?"} cls=${p.cls?.toFixed(3) ?? "?"} ${p.error ? "ERR:" + p.error : ""}`);
    // 1 req/sec quand pas de cle
    if (!API_KEY) await new Promise(r => setTimeout(r, 1100));
  }

  const result: PerfAuditResult = {
    baseUrl: BASE_URL,
    auditedAt: new Date().toISOString(),
    hasApiKey: !!API_KEY,
    pages,
  };
  if (!existsSync(OUT_DIR)) await mkdir(OUT_DIR, { recursive: true });
  const outPath = join(OUT_DIR, `perf-${new Date().toISOString().slice(0, 10)}.json`);
  await writeFile(outPath, JSON.stringify(result, null, 2));
  console.log(`[perf] Saved: ${outPath}`);
  return result;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  runPerfAudit().catch((e) => { console.error(e); process.exit(1); });
}
