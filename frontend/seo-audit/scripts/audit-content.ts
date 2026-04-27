/**
 * Audit de contenu : densite mots-cles cibles + detection duplicate content.
 *
 * Pour chaque page :
 *  - Extrait le texte visible (hors nav/footer/header)
 *  - Compte occurrences de chaque mot-cle de keywords.json
 *  - Calcule densite (% sur total mots) — warning >3% (over-optimisation), alerte <0.5%
 *  - Hash MD5 du texte normalise pour detecter duplicates entre pages
 */
import { writeFile, mkdir, readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { createHash } from "node:crypto";

const BASE_URL = process.env.SEO_AUDIT_BASE_URL || "https://www.bativio.fr";
const OUT_DIR = join(process.cwd(), "seo-audit", "content");
const KEYWORDS_PATH = join(process.cwd(), "seo-audit", "scripts", "keywords.json");

interface KeywordsConfig {
  audience_clients_finaux: { head: string[]; moyenne_traine: string[]; longue_traine: string[] };
  audience_artisans: { head: string[]; moyenne_traine: string[]; longue_traine: string[]; brand: string[] };
  concurrents_a_monitorer: string[];
}

export interface ContentPage {
  url: string;
  wordCount: number;
  textHash: string;
  keywords: {
    [audience: string]: {
      [bucket: string]: { keyword: string; occurrences: number; density: number; warn?: string }[];
    };
  };
}

export interface ContentAuditResult {
  baseUrl: string;
  auditedAt: string;
  pages: ContentPage[];
  duplicates: { hash: string; urls: string[] }[];
}

function fetchWithTimeout(url: string, ms = 15000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  return fetch(url, { signal: controller.signal }).finally(() => clearTimeout(timer));
}

function extractVisibleText(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<header[\s\S]*?<\/header>/gi, " ")
    .replace(/<nav[\s\S]*?<\/nav>/gi, " ")
    .replace(/<footer[\s\S]*?<\/footer>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;|&#160;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&[a-z]+;/gi, " ")
    .replace(/\s+/g, " ")
    .toLowerCase()
    .trim();
}

function countOccurrences(text: string, kw: string): number {
  // Match en mode "phrase exacte" insensitive (deja en lowercase)
  const escaped = kw.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const re = new RegExp(`\\b${escaped}\\b`, "g");
  return (text.match(re) || []).length;
}

async function discoverUrls(): Promise<string[]> {
  const urls: string[] = [BASE_URL + "/"];
  try {
    const res = await fetchWithTimeout(BASE_URL + "/sitemap.xml");
    if (res.ok) {
      const xml = await res.text();
      const locs = (xml.match(/<loc>([^<]+)<\/loc>/g) || []).map(m => m.replace(/<\/?loc>/g, ""));
      const prio = locs.filter(l =>
        /\/(lyon|chambery|annecy|grenoble|valence)\b/.test(l) ||
        /\/(plombier|electricien|peintre|chauffagiste)-/.test(l) ||
        /\/facturation-electronique/.test(l) ||
        /\/tarifs/.test(l)
      );
      urls.push(...prio.slice(0, 25).filter(u => !urls.includes(u)));
    }
  } catch { /* ignore */ }
  return [...new Set(urls)];
}

export async function runContentAudit(): Promise<ContentAuditResult> {
  console.log("[content] Loading keywords...");
  const kwRaw = await readFile(KEYWORDS_PATH, "utf-8");
  const kw: KeywordsConfig = JSON.parse(kwRaw);

  console.log("[content] Discovering URLs...");
  const urls = await discoverUrls();
  console.log(`[content] Auditing content on ${urls.length} URLs...`);

  const pages: ContentPage[] = [];
  const hashToUrls = new Map<string, string[]>();

  for (const url of urls) {
    try {
      const res = await fetchWithTimeout(url);
      if (!res.ok || !res.headers.get("content-type")?.includes("text/html")) continue;
      const html = await res.text();
      const text = extractVisibleText(html);
      const wordCount = text.split(/\s+/).filter(w => /\p{L}/u.test(w)).length;
      const textHash = createHash("md5").update(text.slice(0, 5000)).digest("hex");

      // Group hashes
      if (!hashToUrls.has(textHash)) hashToUrls.set(textHash, []);
      hashToUrls.get(textHash)!.push(url);

      // Compter mots-cles
      const result: ContentPage = { url, wordCount, textHash, keywords: {} };
      for (const audience of ["audience_clients_finaux", "audience_artisans"] as const) {
        result.keywords[audience] = {};
        const config = kw[audience];
        for (const bucket of Object.keys(config) as Array<keyof typeof config>) {
          const list = (config as Record<string, string[]>)[bucket];
          result.keywords[audience][bucket] = list.map(k => {
            const occ = countOccurrences(text, k);
            const density = wordCount > 0 ? (occ * (k.split(/\s+/).length)) / wordCount * 100 : 0;
            const warn = density > 3 ? "over_optimization" : (occ === 0 ? undefined : (density < 0.1 ? "very_low" : undefined));
            return { keyword: k, occurrences: occ, density: Number(density.toFixed(3)), warn };
          });
        }
      }
      pages.push(result);
      console.log(`  ${url} : ${wordCount} mots, hash=${textHash.slice(0, 8)}`);
    } catch (e) {
      console.warn(`  ${url} : ${(e as Error).message}`);
    }
  }

  const duplicates = [...hashToUrls.entries()]
    .filter(([_, urls]) => urls.length > 1)
    .map(([hash, urls]) => ({ hash, urls }));

  const result: ContentAuditResult = {
    baseUrl: BASE_URL,
    auditedAt: new Date().toISOString(),
    pages,
    duplicates,
  };

  if (!existsSync(OUT_DIR)) await mkdir(OUT_DIR, { recursive: true });
  const outPath = join(OUT_DIR, `content-${new Date().toISOString().slice(0, 10)}.json`);
  await writeFile(outPath, JSON.stringify(result, null, 2));
  console.log(`[content] Saved: ${outPath}`);
  if (duplicates.length > 0) {
    console.warn(`[content] DUPLICATE CONTENT DETECTED on ${duplicates.length} groups`);
  }
  return result;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  runContentAudit().catch((e) => { console.error(e); process.exit(1); });
}
