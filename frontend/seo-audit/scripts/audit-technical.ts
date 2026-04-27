/**
 * Audit SEO technique de Bativio.
 *
 * Pour chaque URL audite :
 *  - Status HTTP, headers (cache-control, x-robots-tag, content-type)
 *  - Title (presence, longueur 50-60 chars)
 *  - Meta description (presence, longueur 140-160 chars)
 *  - H1 (presence, unicite, contenu)
 *  - Hierarchie Hn (H1 -> H2 -> H3 sans saut)
 *  - Canonical (presence + coherence avec URL)
 *  - Open Graph (og:title/description/image/url)
 *  - Twitter Card (twitter:card/title/image)
 *  - JSON-LD (extraction + parsing + types detectes)
 *  - <html lang>
 *  - Robots meta
 *  - Hreflang
 *  - Images : alt, width/height, format
 *  - Liens internes : nombre, % nofollow, % brisés (HEAD request)
 *  - Liens sortants : nombre, nofollow/sponsored
 *  - Mots du contenu (count dans <main> ou <body>)
 *
 * Pour /sitemap.xml : nombre URLs, format valide, lastmod
 * Pour /robots.txt : Sitemap:, Disallow, User-agent
 *
 * Liste d'URLs : extraite dynamiquement du sitemap.xml LIVE + fallback statique.
 */
import { writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";

const BASE_URL = process.env.SEO_AUDIT_BASE_URL || "https://www.bativio.fr";
const OUT_DIR = join(process.cwd(), "seo-audit", "technical");
const TIMEOUT_MS = 15_000;
const HEAD_BATCH_SIZE = 6; // parallelism for broken-link check

export interface TechnicalAuditPage {
  url: string;
  status: number;
  contentType?: string;
  cacheControl?: string;
  xRobotsTag?: string;
  title?: string;
  titleLength?: number;
  titleWarn?: string;
  metaDescription?: string;
  metaDescriptionLength?: number;
  metaDescriptionWarn?: string;
  h1: string[];
  h1Warn?: string;
  hierarchy?: string;
  hierarchyWarn?: string;
  canonical?: string;
  canonicalWarn?: string;
  og?: { title?: string; description?: string; image?: string; url?: string; type?: string };
  ogWarn?: string;
  twitter?: { card?: string; title?: string; image?: string; description?: string };
  twitterWarn?: string;
  jsonLdTypes: string[];
  jsonLdInvalid?: number;
  htmlLang?: string;
  robotsMeta?: string;
  hreflang: string[];
  images: { total: number; missingAlt: number; missingDimensions: number; webp: number };
  links: { internal: number; external: number; nofollow: number; broken: number };
  wordCount?: number;
  errors: string[];
}

export interface TechnicalAuditResult {
  baseUrl: string;
  auditedAt: string;
  pagesAudited: number;
  pages: TechnicalAuditPage[];
  sitemap?: { url: string; status: number; urlsCount: number; lastmod?: string; xmlValid: boolean };
  robots?: { url: string; status: number; sitemap?: string; disallowCount: number; userAgents: string[] };
}

// ----- Helpers -----

function fetchWithTimeout(url: string, init?: RequestInit, ms = TIMEOUT_MS): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  return fetch(url, { ...init, signal: controller.signal, redirect: "manual" }).finally(() => clearTimeout(timer));
}

function extractMatch(html: string, regex: RegExp): string | undefined {
  const m = regex.exec(html);
  return m?.[1]?.trim();
}

function extractAll(html: string, regex: RegExp): string[] {
  const out: string[] = [];
  let m: RegExpExecArray | null;
  while ((m = regex.exec(html)) !== null) {
    if (m[1]) out.push(m[1].trim());
  }
  return out;
}

function htmlDecode(s: string): string {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&nbsp;/g, " ");
}

function isInternal(href: string, base: string): boolean {
  try {
    if (href.startsWith("/")) return true;
    const u = new URL(href);
    return u.hostname === new URL(base).hostname;
  } catch {
    return false;
  }
}

function normalizeUrl(href: string, base: string): string {
  try {
    return new URL(href, base).toString();
  } catch {
    return href;
  }
}

// ----- Audit URL list discovery -----

async function discoverUrls(): Promise<string[]> {
  const urls: string[] = [BASE_URL + "/"];
  try {
    const res = await fetchWithTimeout(BASE_URL + "/sitemap.xml");
    if (res.ok) {
      const xml = await res.text();
      const locs = extractAll(xml, /<loc>([^<]+)<\/loc>/g);
      // Limite : max 30 URLs pour eviter audit trop long (homepage + 29 autres)
      // Selection : prioritaire = villes hub + pages metier-ville
      const prio = locs.filter(l =>
        /\/(lyon|chambery|annecy|grenoble|valence)\b/.test(l) ||
        /\/(plombier|electricien|peintre|chauffagiste)-/.test(l) ||
        /\/travaux\//.test(l) ||
        /\/facturation-electronique$/.test(l) ||
        /\/tarifs$/.test(l)
      );
      const others = locs.filter(l => !prio.includes(l));
      const selected = [...prio.slice(0, 22), ...others.slice(0, 7)];
      urls.push(...selected.filter(u => !urls.includes(u)));
    }
  } catch (e) {
    console.warn("[technical] sitemap fetch failed, using fallback list:", (e as Error).message);
  }
  if (urls.length === 1) {
    // Fallback statique
    const STATIC = [
      "/", "/lyon", "/chambery", "/annecy", "/grenoble", "/valence",
      "/plombier-lyon", "/electricien-chambery", "/peintre-villeurbanne",
      "/tarifs", "/facturation-electronique", "/a-propos",
    ];
    for (const p of STATIC) urls.push(BASE_URL + p);
  }
  return [...new Set(urls)];
}

// ----- Single page audit -----

async function auditPage(url: string, allInternalUrls: Set<string>): Promise<TechnicalAuditPage> {
  const errors: string[] = [];
  const result: TechnicalAuditPage = {
    url,
    status: 0,
    h1: [],
    jsonLdTypes: [],
    hreflang: [],
    images: { total: 0, missingAlt: 0, missingDimensions: 0, webp: 0 },
    links: { internal: 0, external: 0, nofollow: 0, broken: 0 },
    errors,
  };

  let res: Response;
  try {
    res = await fetchWithTimeout(url);
  } catch (e) {
    errors.push("fetch_failed: " + (e as Error).message);
    return result;
  }

  result.status = res.status;
  result.contentType = res.headers.get("content-type") || undefined;
  result.cacheControl = res.headers.get("cache-control") || undefined;
  result.xRobotsTag = res.headers.get("x-robots-tag") || undefined;

  // Suivre redirect manuellement pour audit
  if (res.status >= 300 && res.status < 400) {
    const loc = res.headers.get("location");
    if (loc) errors.push(`redirect_${res.status}_to_${loc}`);
    return result;
  }

  if (!result.contentType?.includes("text/html")) {
    return result; // sitemap.xml etc traités à part
  }

  let html: string;
  try {
    html = await res.text();
  } catch (e) {
    errors.push("read_body_failed: " + (e as Error).message);
    return result;
  }

  // <html lang>
  result.htmlLang = extractMatch(html, /<html[^>]*\blang=["']([^"']+)["']/i);

  // <title>
  result.title = htmlDecode(extractMatch(html, /<title[^>]*>([^<]+)<\/title>/i) || "");
  if (result.title) {
    result.titleLength = result.title.length;
    if (result.titleLength < 30) result.titleWarn = "too_short";
    else if (result.titleLength > 65) result.titleWarn = "too_long";
  } else {
    result.titleWarn = "missing";
  }

  // <meta name="description">
  result.metaDescription = htmlDecode(extractMatch(html, /<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i) || "");
  if (result.metaDescription) {
    result.metaDescriptionLength = result.metaDescription.length;
    if (result.metaDescriptionLength < 120) result.metaDescriptionWarn = "too_short";
    else if (result.metaDescriptionLength > 165) result.metaDescriptionWarn = "too_long";
  } else {
    result.metaDescriptionWarn = "missing";
  }

  // H1
  result.h1 = extractAll(html, /<h1\b[^>]*>([\s\S]*?)<\/h1>/gi).map(s => htmlDecode(s.replace(/<[^>]+>/g, "").trim())).filter(Boolean);
  if (result.h1.length === 0) result.h1Warn = "missing";
  else if (result.h1.length > 1) result.h1Warn = `multiple_${result.h1.length}`;

  // Hierarchy Hn (basique : H1, H2, H3 ordre apparition)
  const headings = extractAll(html, /<h([1-6])\b/gi).map(s => parseInt(s, 10));
  let prev = 0, hierarchyOk = true;
  for (const h of headings) {
    if (prev > 0 && h > prev + 1) { hierarchyOk = false; break; }
    prev = h;
  }
  result.hierarchy = headings.length > 0 ? `H1:${headings.filter(h=>h===1).length} H2:${headings.filter(h=>h===2).length} H3:${headings.filter(h=>h===3).length}` : "none";
  if (!hierarchyOk) result.hierarchyWarn = "skipped_level";

  // Canonical
  result.canonical = extractMatch(html, /<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/i);
  if (result.canonical) {
    const expected = url.split("?")[0].split("#")[0].replace(/\/+$/, "");
    const actual = result.canonical.replace(/\/+$/, "");
    if (actual !== expected && !expected.endsWith("/" + actual.split("/").pop()!)) {
      // Tolere les / trailing differences mais pas une URL totalement differente
      const actualHost = (() => { try { return new URL(actual).hostname; } catch { return ""; } })();
      const expectedHost = (() => { try { return new URL(expected).hostname; } catch { return ""; } })();
      if (actualHost && expectedHost && actualHost !== expectedHost) {
        result.canonicalWarn = "host_mismatch";
      }
    }
  } else {
    result.canonicalWarn = "missing";
  }

  // Open Graph
  result.og = {
    title: extractMatch(html, /<meta\s+property=["']og:title["']\s+content=["']([^"']+)["']/i),
    description: extractMatch(html, /<meta\s+property=["']og:description["']\s+content=["']([^"']+)["']/i),
    image: extractMatch(html, /<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/i),
    url: extractMatch(html, /<meta\s+property=["']og:url["']\s+content=["']([^"']+)["']/i),
    type: extractMatch(html, /<meta\s+property=["']og:type["']\s+content=["']([^"']+)["']/i),
  };
  const ogMissing = Object.entries(result.og).filter(([k, v]) => !v && k !== "url" && k !== "type").map(([k]) => k);
  if (ogMissing.length > 0) result.ogWarn = "missing:" + ogMissing.join(",");

  // Twitter Card
  result.twitter = {
    card: extractMatch(html, /<meta\s+name=["']twitter:card["']\s+content=["']([^"']+)["']/i),
    title: extractMatch(html, /<meta\s+name=["']twitter:title["']\s+content=["']([^"']+)["']/i),
    image: extractMatch(html, /<meta\s+name=["']twitter:image["']\s+content=["']([^"']+)["']/i),
    description: extractMatch(html, /<meta\s+name=["']twitter:description["']\s+content=["']([^"']+)["']/i),
  };
  if (!result.twitter.card) result.twitterWarn = "missing_card";

  // JSON-LD
  const ldRegex = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  const types: Set<string> = new Set();
  let invalidCount = 0;
  let ldMatch: RegExpExecArray | null;
  while ((ldMatch = ldRegex.exec(html)) !== null) {
    try {
      const parsed = JSON.parse(ldMatch[1].trim());
      const collect = (obj: unknown) => {
        if (Array.isArray(obj)) obj.forEach(collect);
        else if (obj && typeof obj === "object") {
          const t = (obj as Record<string, unknown>)["@type"];
          if (typeof t === "string") types.add(t);
          else if (Array.isArray(t)) t.forEach(x => typeof x === "string" && types.add(x));
        }
      };
      collect(parsed);
    } catch {
      invalidCount++;
    }
  }
  result.jsonLdTypes = [...types];
  if (invalidCount > 0) result.jsonLdInvalid = invalidCount;

  // Robots meta
  result.robotsMeta = extractMatch(html, /<meta\s+name=["']robots["']\s+content=["']([^"']+)["']/i);

  // Hreflang
  result.hreflang = extractAll(html, /<link\s+rel=["']alternate["']\s+hreflang=["']([^"']+)["']/gi);

  // Images
  // Note WCAG : alt="" est volontaire pour images decoratives (logo a cote du nom, etc.)
  // On flag UNIQUEMENT alt totalement absent (= vraie erreur)
  const imgRegex = /<img\b([^>]*)>/gi;
  let imgMatch: RegExpExecArray | null;
  while ((imgMatch = imgRegex.exec(html)) !== null) {
    const attrs = imgMatch[1];
    result.images.total++;
    const altMatch = /\balt=["']([^"']*)["']/i.exec(attrs);
    if (!altMatch) result.images.missingAlt++; // attribut alt absent = vrai bug
    // alt="" reste OK (image decorative volontaire WCAG)
    if (!/\bwidth=/i.test(attrs) || !/\bheight=/i.test(attrs)) result.images.missingDimensions++;
    if (/\.webp\b/i.test(attrs) || /\bsrc=["'][^"']*\.webp/i.test(attrs)) result.images.webp++;
  }

  // Liens (extrait <a href>)
  const aRegex = /<a\b([^>]*?)href=["']([^"']+)["']([^>]*)>/gi;
  const collectedHrefs: { href: string; nofollow: boolean; internal: boolean }[] = [];
  let aMatch: RegExpExecArray | null;
  while ((aMatch = aRegex.exec(html)) !== null) {
    const href = aMatch[2];
    if (href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:") || href.startsWith("javascript:")) continue;
    const before = aMatch[1] || "", after = aMatch[3] || "";
    const isNofollow = /\brel=["'][^"']*nofollow/i.test(before + after);
    const isInt = isInternal(href, BASE_URL);
    collectedHrefs.push({ href: normalizeUrl(href, url), nofollow: isNofollow, internal: isInt });
  }
  result.links.internal = collectedHrefs.filter(l => l.internal).length;
  result.links.external = collectedHrefs.filter(l => !l.internal).length;
  result.links.nofollow = collectedHrefs.filter(l => l.nofollow).length;
  // Verification HEAD pour chaque lien interne (par batch limite, max 20)
  const internalToCheck = [...new Set(collectedHrefs.filter(l => l.internal && !allInternalUrls.has(l.href)).map(l => l.href))].slice(0, 20);
  let broken = 0;
  for (let i = 0; i < internalToCheck.length; i += HEAD_BATCH_SIZE) {
    const batch = internalToCheck.slice(i, i + HEAD_BATCH_SIZE);
    const results = await Promise.all(batch.map(async (h) => {
      try {
        const r = await fetchWithTimeout(h, { method: "HEAD" }, 8000);
        return r.status >= 400;
      } catch { return true; }
    }));
    broken += results.filter(Boolean).length;
  }
  result.links.broken = broken;

  // Word count : extrait texte du <main> ou body sans nav/footer
  const mainMatch = /<main[\s\S]*?>([\s\S]*?)<\/main>/i.exec(html);
  let textBlock = mainMatch ? mainMatch[1] : html;
  textBlock = textBlock
    .replace(/<header[\s\S]*?<\/header>/gi, " ")
    .replace(/<nav[\s\S]*?<\/nav>/gi, " ")
    .replace(/<footer[\s\S]*?<\/footer>/gi, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ");
  result.wordCount = textBlock.split(/\s+/).filter(w => /\p{L}+/u.test(w)).length;

  return result;
}

// ----- Sitemap + Robots audits -----

async function auditSitemap(): Promise<TechnicalAuditResult["sitemap"]> {
  const url = BASE_URL + "/sitemap.xml";
  try {
    const res = await fetchWithTimeout(url);
    if (!res.ok) return { url, status: res.status, urlsCount: 0, xmlValid: false };
    const xml = await res.text();
    const urls = extractAll(xml, /<loc>([^<]+)<\/loc>/g);
    const lastmod = extractAll(xml, /<lastmod>([^<]+)<\/lastmod>/g)[0];
    const xmlValid = xml.startsWith("<?xml") && xml.includes("<urlset");
    return { url, status: res.status, urlsCount: urls.length, lastmod, xmlValid };
  } catch (e) {
    return { url, status: 0, urlsCount: 0, xmlValid: false };
  }
}

async function auditRobots(): Promise<TechnicalAuditResult["robots"]> {
  const url = BASE_URL + "/robots.txt";
  try {
    const res = await fetchWithTimeout(url);
    if (!res.ok) return { url, status: res.status, disallowCount: 0, userAgents: [] };
    const text = await res.text();
    const sitemap = extractMatch(text, /Sitemap:\s*(\S+)/i);
    const disallows = (text.match(/^Disallow:/gim) || []).length;
    const uas = [...new Set(extractAll(text, /^User-Agent:\s*(.+)$/gim))];
    return { url, status: res.status, sitemap, disallowCount: disallows, userAgents: uas };
  } catch {
    return { url, status: 0, disallowCount: 0, userAgents: [] };
  }
}

// ----- Main -----

export async function runTechnicalAudit(): Promise<TechnicalAuditResult> {
  console.log(`[technical] Discover URLs from sitemap...`);
  const urls = await discoverUrls();
  console.log(`[technical] Auditing ${urls.length} URLs...`);
  const allInternalUrls = new Set(urls);
  const pages: TechnicalAuditPage[] = [];
  for (const url of urls) {
    const t0 = Date.now();
    const p = await auditPage(url, allInternalUrls);
    pages.push(p);
    console.log(`  [${p.status}] ${url} (${Date.now() - t0}ms) — ${p.errors.length ? "ERR" : "OK"}`);
  }

  const [sitemap, robots] = await Promise.all([auditSitemap(), auditRobots()]);

  const result: TechnicalAuditResult = {
    baseUrl: BASE_URL,
    auditedAt: new Date().toISOString(),
    pagesAudited: pages.length,
    pages,
    sitemap,
    robots,
  };

  if (!existsSync(OUT_DIR)) await mkdir(OUT_DIR, { recursive: true });
  const outPath = join(OUT_DIR, `audit-${new Date().toISOString().slice(0, 10)}.json`);
  await writeFile(outPath, JSON.stringify(result, null, 2));
  console.log(`[technical] Saved: ${outPath}`);
  return result;
}

// Run if invoked directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runTechnicalAudit().catch((e) => { console.error(e); process.exit(1); });
}
