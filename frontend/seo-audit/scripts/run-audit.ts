/**
 * Orchestrateur : lance les 3 audits (technical / perf / content), agrege
 * dans un JSON unique + genere un rapport Markdown lisible.
 *
 * Sorties :
 *  - seo-audit/reports/audit-{YYYY-MM-DD}.json (donnees brutes)
 *  - seo-audit/reports/audit-{YYYY-MM-DD}.md (rapport humain)
 *
 * Usage : `npm run seo:audit`
 */
import { writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { runTechnicalAudit, type TechnicalAuditResult, type TechnicalAuditPage } from "./audit-technical.ts";
import { runPerfAudit, type PerfAuditResult } from "./audit-perf.ts";
import { runContentAudit, type ContentAuditResult } from "./audit-content.ts";

const REPORTS_DIR = join(process.cwd(), "seo-audit", "reports");

interface IssueBucket {
  critical: { url: string; issue: string; detail?: string }[];
  major: { url: string; issue: string; detail?: string }[];
  minor: { url: string; issue: string; detail?: string }[];
}

function classifyIssues(t: TechnicalAuditResult): IssueBucket {
  const buckets: IssueBucket = { critical: [], major: [], minor: [] };

  for (const p of t.pages) {
    // CRITICAL : 4xx/5xx, JSON-LD invalide, H1 manquant, title manquant
    if (p.status >= 400) buckets.critical.push({ url: p.url, issue: `HTTP ${p.status}`, detail: "page inaccessible" });
    if (p.jsonLdInvalid && p.jsonLdInvalid > 0) buckets.critical.push({ url: p.url, issue: "JSON-LD invalide", detail: `${p.jsonLdInvalid} blocs` });
    if (p.h1Warn === "missing") buckets.critical.push({ url: p.url, issue: "H1 manquant" });
    if (p.titleWarn === "missing") buckets.critical.push({ url: p.url, issue: "<title> manquant" });
    if (p.links.broken > 0) buckets.critical.push({ url: p.url, issue: `${p.links.broken} liens internes brises` });

    // MAJOR : titles trop long/court, meta description manquante/longue, alts manquants nombreux
    if (p.titleWarn === "too_long") buckets.major.push({ url: p.url, issue: "Title trop long", detail: `${p.titleLength} chars (>65)` });
    if (p.titleWarn === "too_short") buckets.major.push({ url: p.url, issue: "Title trop court", detail: `${p.titleLength} chars (<30)` });
    if (p.metaDescriptionWarn === "missing") buckets.major.push({ url: p.url, issue: "Meta description manquante" });
    if (p.metaDescriptionWarn === "too_long") buckets.major.push({ url: p.url, issue: "Meta description trop longue", detail: `${p.metaDescriptionLength} chars (>165)` });
    if (p.metaDescriptionWarn === "too_short") buckets.major.push({ url: p.url, issue: "Meta description trop courte", detail: `${p.metaDescriptionLength} chars (<120)` });
    if (p.h1Warn?.startsWith("multiple")) buckets.major.push({ url: p.url, issue: "Multiples H1", detail: p.h1Warn });
    if (p.images.total > 0 && p.images.missingAlt > p.images.total / 2) {
      buckets.major.push({ url: p.url, issue: "Alts manquants nombreux", detail: `${p.images.missingAlt}/${p.images.total} images` });
    }
    if (p.hierarchyWarn) buckets.major.push({ url: p.url, issue: "Hierarchie Hn cassee", detail: p.hierarchyWarn });

    // MINOR : canonical manquant, OG incomplet, twitter card manquant, peu de mots
    if (p.canonicalWarn === "missing") buckets.minor.push({ url: p.url, issue: "Canonical manquant" });
    if (p.canonicalWarn === "host_mismatch") buckets.minor.push({ url: p.url, issue: "Canonical host mismatch", detail: p.canonical });
    if (p.ogWarn) buckets.minor.push({ url: p.url, issue: "Open Graph incomplet", detail: p.ogWarn });
    if (p.twitterWarn) buckets.minor.push({ url: p.url, issue: "Twitter Card manquante", detail: p.twitterWarn });
    if ((p.wordCount ?? 0) < 200 && p.url !== t.baseUrl + "/") {
      buckets.minor.push({ url: p.url, issue: "Contenu trop court", detail: `${p.wordCount} mots (<200)` });
    }
    if (p.images.total > 0 && p.images.missingDimensions > 0) {
      buckets.minor.push({ url: p.url, issue: "Images sans width/height", detail: `${p.images.missingDimensions}/${p.images.total}` });
    }
  }
  return buckets;
}

function computeGlobalScore(t: TechnicalAuditResult, perf: PerfAuditResult, issues: IssueBucket): number {
  // Sur 100 : technical 60% + perf 30% + content 10%
  const totalPages = t.pagesAudited;
  const critWeight = issues.critical.length * 5;
  const majWeight = issues.major.length * 2;
  const minWeight = issues.minor.length * 0.5;
  const technicalScore = Math.max(0, 100 - (critWeight + majWeight + minWeight));

  const perfScores = perf.pages.map(p => p.performanceScore).filter((s): s is number => typeof s === "number");
  const perfScore = perfScores.length ? perfScores.reduce((a, b) => a + b, 0) / perfScores.length : 100;

  // Bonus : sitemap + robots OK
  const sitemapBonus = t.sitemap?.xmlValid && (t.sitemap.urlsCount ?? 0) > 50 ? 5 : 0;
  const robotsBonus = t.robots?.sitemap ? 5 : 0;

  const raw = technicalScore * 0.6 + perfScore * 0.3 + (sitemapBonus + robotsBonus);
  return Math.min(100, Math.round(raw));
}

function topActions(issues: IssueBucket, t: TechnicalAuditResult): string[] {
  const actions: string[] = [];
  if (issues.critical.length > 0) {
    const grouped = new Map<string, number>();
    for (const i of issues.critical) grouped.set(i.issue, (grouped.get(i.issue) || 0) + 1);
    for (const [issue, count] of [...grouped.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3)) {
      actions.push(`Corriger ${count}x : ${issue}`);
    }
  }
  if (issues.major.length > 0) {
    const grouped = new Map<string, number>();
    for (const i of issues.major) grouped.set(i.issue, (grouped.get(i.issue) || 0) + 1);
    for (const [issue, count] of [...grouped.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3)) {
      actions.push(`Optimiser ${count}x : ${issue}`);
    }
  }
  if (!t.robots?.sitemap) actions.push("Ajouter Sitemap: dans robots.txt");
  if (!t.sitemap?.xmlValid) actions.push("Corriger sitemap.xml (format invalide)");
  if (issues.minor.filter(i => i.issue === "Twitter Card manquante").length > 0) actions.push("Ajouter Twitter Card sur les pages manquantes");
  return actions.slice(0, 10);
}

function generateMarkdown(args: {
  technical: TechnicalAuditResult;
  perf: PerfAuditResult;
  content: ContentAuditResult;
  issues: IssueBucket;
  globalScore: number;
  actions: string[];
}): string {
  const { technical, perf, content, issues, globalScore, actions } = args;
  const date = new Date().toISOString().slice(0, 10);

  let md = `# Audit SEO Bativio — ${date}\n\n`;
  md += `**URL de base** : ${technical.baseUrl}\n`;
  md += `**Pages auditees** : ${technical.pagesAudited}\n`;
  md += `**Genere le** : ${technical.auditedAt}\n\n`;

  // 1. SYNTHESE
  md += `## 1. Synthese executive\n\n`;
  md += `### Score global : **${globalScore} / 100**\n\n`;
  md += `| Categorie | Compte |\n|---|---|\n`;
  md += `| Problemes CRITIQUES | ${issues.critical.length} |\n`;
  md += `| Problemes MAJEURS | ${issues.major.length} |\n`;
  md += `| Problemes mineurs | ${issues.minor.length} |\n`;
  md += `| Sitemap : urls detectees | ${technical.sitemap?.urlsCount ?? "?"} |\n`;
  md += `| Sitemap valide | ${technical.sitemap?.xmlValid ? "oui" : "non"} |\n`;
  md += `| robots.txt avec Sitemap: | ${technical.robots?.sitemap ? "oui" : "non"} |\n\n`;

  // 2. CRITIQUES
  md += `## 2. Problemes CRITIQUES (${issues.critical.length})\n\n`;
  if (issues.critical.length === 0) md += `Aucun probleme critique detecte.\n\n`;
  else {
    md += `| URL | Probleme | Detail |\n|---|---|---|\n`;
    for (const i of issues.critical.slice(0, 30)) md += `| ${i.url} | ${i.issue} | ${i.detail ?? ""} |\n`;
    if (issues.critical.length > 30) md += `\n_... et ${issues.critical.length - 30} autres_\n`;
    md += `\n`;
  }

  // 3. MAJEURS
  md += `## 3. Problemes MAJEURS (${issues.major.length})\n\n`;
  if (issues.major.length === 0) md += `Aucun probleme majeur.\n\n`;
  else {
    md += `| URL | Probleme | Detail |\n|---|---|---|\n`;
    for (const i of issues.major.slice(0, 30)) md += `| ${i.url} | ${i.issue} | ${i.detail ?? ""} |\n`;
    if (issues.major.length > 30) md += `\n_... et ${issues.major.length - 30} autres_\n`;
    md += `\n`;
  }

  // 4. MINEURS
  md += `## 4. Problemes mineurs (${issues.minor.length})\n\n`;
  if (issues.minor.length === 0) md += `Aucun probleme mineur.\n\n`;
  else {
    md += `| URL | Probleme | Detail |\n|---|---|---|\n`;
    for (const i of issues.minor.slice(0, 30)) md += `| ${i.url} | ${i.issue} | ${i.detail ?? ""} |\n`;
    if (issues.minor.length > 30) md += `\n_... et ${issues.minor.length - 30} autres_\n`;
    md += `\n`;
  }

  // 5. PERFORMANCE
  md += `## 5. Performance (Web Vitals)\n\n`;
  if (!perf.hasApiKey) md += `> Note : pas de PAGESPEED_API_KEY configure (1 req/sec, peut etre incomplet).\n\n`;
  md += `| URL | Score | LCP | CLS | TTFB | Total |\n|---|---|---|---|---|---|\n`;
  for (const p of perf.pages) {
    const lcp = p.lcp != null ? `${Math.round(p.lcp)}ms` : "?";
    const cls = p.cls != null ? p.cls.toFixed(3) : "?";
    const ttfb = p.ttfb != null ? `${Math.round(p.ttfb)}ms` : "?";
    const bytes = p.totalBytes != null ? `${Math.round(p.totalBytes / 1024)}kb` : "?";
    md += `| ${p.url} | ${p.performanceScore ?? "?"} | ${lcp} | ${cls} | ${ttfb} | ${bytes} |\n`;
  }
  md += `\n`;

  // 6. COUVERTURE MOTS-CLES
  md += `## 6. Couverture mots-cles cibles par page\n\n`;
  // Top 20 mots-cles avec >0 occurrences sur au moins 1 page
  const allKw: Map<string, { audience: string; bucket: string; total: number; pages: number }> = new Map();
  for (const p of content.pages) {
    for (const audience of Object.keys(p.keywords)) {
      for (const bucket of Object.keys(p.keywords[audience])) {
        for (const k of p.keywords[audience][bucket]) {
          if (k.occurrences > 0) {
            const key = `${audience}:${bucket}:${k.keyword}`;
            const cur = allKw.get(key) || { audience, bucket, total: 0, pages: 0 };
            cur.total += k.occurrences;
            cur.pages++;
            allKw.set(key, cur);
          }
        }
      }
    }
  }
  if (allKw.size === 0) md += `Aucun mot-cle cible detecte sur les pages auditees.\n\n`;
  else {
    md += `| Audience | Bucket | Mot-cle | Total occ | Pages |\n|---|---|---|---|---|\n`;
    const sorted = [...allKw.entries()].sort((a, b) => b[1].total - a[1].total).slice(0, 25);
    for (const [k, v] of sorted) {
      const kw = k.split(":").slice(2).join(":");
      md += `| ${v.audience.replace("audience_", "")} | ${v.bucket} | ${kw} | ${v.total} | ${v.pages} |\n`;
    }
    md += `\n`;
  }

  // 7. CONTENU DUPLIQUE
  md += `## 7. Contenu duplique detecte\n\n`;
  if (content.duplicates.length === 0) md += `Aucun duplicate content detecte sur les pages auditees.\n\n`;
  else {
    for (const d of content.duplicates) {
      md += `**Hash ${d.hash.slice(0, 12)}** (${d.urls.length} pages identiques) :\n`;
      for (const u of d.urls) md += `- ${u}\n`;
      md += `\n`;
    }
  }

  // BONUS : TOP ACTIONS
  md += `## Top actions prioritaires\n\n`;
  if (actions.length === 0) md += `Aucune action prioritaire — site en bon etat SEO.\n`;
  else for (let i = 0; i < actions.length; i++) md += `${i + 1}. ${actions[i]}\n`;
  md += `\n---\n\n`;
  md += `_Rapport genere automatiquement par seo-audit/scripts/run-audit.ts_\n`;

  return md;
}

async function main() {
  console.log("=".repeat(60));
  console.log("AUDIT SEO BATIVIO");
  console.log("=".repeat(60));

  const t0 = Date.now();

  console.log("\n[1/3] Audit technique...");
  const technical = await runTechnicalAudit();

  console.log("\n[2/3] Audit performance (Web Vitals)...");
  const perf = await runPerfAudit().catch((e) => {
    console.warn("Perf audit failed:", e.message);
    return { baseUrl: technical.baseUrl, auditedAt: new Date().toISOString(), hasApiKey: false, pages: [] } as PerfAuditResult;
  });

  console.log("\n[3/3] Audit contenu...");
  const content = await runContentAudit().catch((e) => {
    console.warn("Content audit failed:", e.message);
    return { baseUrl: technical.baseUrl, auditedAt: new Date().toISOString(), pages: [], duplicates: [] } as ContentAuditResult;
  });

  console.log("\nGeneration rapports...");
  const issues = classifyIssues(technical);
  const globalScore = computeGlobalScore(technical, perf, issues);
  const actions = topActions(issues, technical);

  if (!existsSync(REPORTS_DIR)) await mkdir(REPORTS_DIR, { recursive: true });
  const date = new Date().toISOString().slice(0, 10);
  const jsonPath = join(REPORTS_DIR, `audit-${date}.json`);
  const mdPath = join(REPORTS_DIR, `audit-${date}.md`);

  await writeFile(jsonPath, JSON.stringify({ technical, perf, content, issues, globalScore, actions }, null, 2));
  await writeFile(mdPath, generateMarkdown({ technical, perf, content, issues, globalScore, actions }));

  console.log("");
  console.log("=".repeat(60));
  console.log(`SCORE GLOBAL : ${globalScore} / 100`);
  console.log(`Critiques : ${issues.critical.length} | Majeurs : ${issues.major.length} | Mineurs : ${issues.minor.length}`);
  console.log(`Duree : ${((Date.now() - t0) / 1000).toFixed(1)}s`);
  console.log(`Rapport JSON : ${jsonPath}`);
  console.log(`Rapport MD   : ${mdPath}`);
  console.log("=".repeat(60));
}

main().catch((e) => {
  console.error("FATAL:", e);
  process.exit(1);
});
