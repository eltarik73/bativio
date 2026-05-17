import { NextRequest, NextResponse } from "next/server";
import { getAllPublishableZones } from "@/lib/zones";
import { prisma } from "@/lib/prisma";

// Cron quotidien (vercel.json: schedule 0 7 * * * = 9h Paris).
// Pousse l'indexation au maximum :
//   - IndexNow (Bing + Yandex + IndexNow gateway) : ~1 ping par URL
//   - Google : ping legacy sitemap (best effort)
//
// Stratégie : on envoie chaque jour la liste complète des URLs prioritaires
// pour épuiser le quota IndexNow (10 000 URLs/req). Bing décide quand
// (re)crawler — ce qui compte est qu'il reçoive le signal "fresh".

const HOST = "www.bativio.fr";
const SITE = `https://${HOST}`;
const INDEXNOW_KEY = "b4a7f2e8c1d3a5b7e9f0a2c4d6b8e1f3";
const KEY_LOCATION = `${SITE}/${INDEXNOW_KEY}.txt`;

// Métiers pour lesquels on a une page /[ville]/[metier]
const METIERS = [
  "plombier", "electricien", "peintre", "macon",
  "carreleur", "menuisier", "couvreur", "chauffagiste",
];

// Pages éditoriales statiques (toujours pingées en premier — pages-clés brand/SEO)
const STATIC_HIGH_PRIORITY = [
  "/",
  "/chambery",
  "/annecy",
  "/grenoble",
  "/lyon",
  "/valence",
  "/tarifs",
  "/prix",
  "/metiers",
  "/facturation-electronique",
  "/maprimerenov",
  "/urgence",
  "/attestation-sismique",
  "/guides",
  "/guides/trouver-bon-artisan",
  "/guides/prix-renovation-salle-bain",
  "/guides/maprimerenov-demarches",
  "/comparatif/pagesjaunes",
  "/comparatif/habitatpresto",
  "/comparatif/starofservice",
  "/comparatif/obat",
  "/comparatif/tolteck",
  "/faq",
  "/a-propos",
];

const PRIX_METIERS = METIERS.map((m) => `/prix/${m}`);
const VILLES_X_METIERS_PRINCIPALES = ["chambery", "annecy", "grenoble", "lyon", "valence"]
  .flatMap((v) => METIERS.map((m) => `/${v}/${m}`));

const TRAVAUX_SLUGS = [
  "renovation-salle-de-bain",
  "installation-pompe-a-chaleur",
  "peinture-interieure",
  "mise-aux-normes-electriques",
  "renovation-toiture",
  "pose-de-carrelage",
  "depannage-plomberie",
  "isolation-thermique",
  "renovation-cuisine",
  "pose-de-parquet",
];

interface IndexNowResult {
  endpoint: string;
  status: number;
  ok: boolean;
}

async function pingIndexNow(urls: string[]): Promise<IndexNowResult[]> {
  if (urls.length === 0) return [];
  const endpoints = [
    "https://api.indexnow.org/indexnow",
    "https://www.bing.com/indexnow",
    "https://yandex.com/indexnow",
  ];
  const payload = {
    host: HOST,
    key: INDEXNOW_KEY,
    keyLocation: KEY_LOCATION,
    urlList: urls,
  };
  const results = await Promise.allSettled(
    endpoints.map(async (endpoint): Promise<IndexNowResult> => {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify(payload),
      });
      return { endpoint, status: res.status, ok: res.ok };
    })
  );
  return results.map((r): IndexNowResult =>
    r.status === "fulfilled"
      ? r.value
      : { endpoint: "?", status: 0, ok: false }
  );
}

async function pingGoogleSitemap(): Promise<{ ok: boolean; status: number; reason?: string }> {
  // L'endpoint legacy `google.com/ping?sitemap=...` a été definitivement
  // déprécié par Google en juin 2023 et renvoie maintenant 404 (vérifié
  // le 17/05/2026). On retire l'appel pour ne plus polluer les logs.
  //
  // Google découvre les nouveaux contenus via :
  // 1. Sitemap.xml soumis dans GSC (déjà fait)
  // 2. Crawl naturel des liens internes (sitemap, navigation)
  // 3. URLs forcées via GSC "Inspection URL" + "Demander indexation"
  //
  // Pas besoin de ping API legacy.
  return { ok: true, status: 200, reason: "Legacy endpoint deprecated 06/2023 — skipped" };
}

interface BingResult { ok: boolean; status: number; submitted: number; reason?: string; }

async function submitBingWebmasterTools(urls: string[]): Promise<BingResult> {
  // Bing Webmaster Tools API. Quota théorique 10 000 URLs/jour, mais en
  // pratique Bing alloue un quota daily plus bas pour les nouveaux sites
  // (Bativio = 100 URLs/jour, monthly 2300).
  //
  // Bug constaté 17/05/2026 : envoyer 500 URLs quand quota daily restant
  // = 37 fait échouer TOUT le batch (HTTP 400 "Quota remaining for today: 37").
  //
  // Fix : on récupère d'abord le quota daily disponible et on slice à
  // min(500, quotaRestant). Si quota = 0, skip pour économiser un appel.
  // Doc : https://www.bing.com/webmasters/help/url-submission-api-3a9d7b35
  const key = process.env.BING_WMT_API_KEY;
  if (!key) {
    return { ok: false, status: 0, submitted: 0, reason: "BING_WMT_API_KEY not set" };
  }

  // 1. Récupère le quota daily restant
  let dailyQuota = 500;
  try {
    const qRes = await fetch(
      `https://ssl.bing.com/webmaster/api.svc/json/GetUrlSubmissionQuota?siteUrl=${encodeURIComponent(SITE)}&apikey=${encodeURIComponent(key)}`,
    );
    if (qRes.ok) {
      const qData = await qRes.json();
      dailyQuota = qData?.d?.DailyQuota ?? 500;
    }
  } catch {
    // Si quota check échoue, on tente quand même avec 100 (safe default)
    dailyQuota = 100;
  }

  if (dailyQuota === 0) {
    return { ok: true, status: 200, submitted: 0, reason: "Quota Bing épuisé pour aujourd'hui (réessai demain)" };
  }

  // 2. Slice URLs à min(500 batch max, quotaRestant)
  const batchSize = Math.min(500, dailyQuota);
  // Priorise les URLs les plus stratégiques (statics + tier 1) en début
  // de liste (déjà ordonnées dans le code appelant via STATIC_HIGH_PRIORITY)
  const batch = urls.slice(0, batchSize);

  // 3. Submit batch
  try {
    const res = await fetch(
      `https://ssl.bing.com/webmaster/api.svc/json/SubmitUrlBatch?apikey=${encodeURIComponent(key)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify({ siteUrl: SITE, urlList: batch }),
      }
    );
    const reason = res.ok ? undefined : `HTTP ${res.status} (quota dispo=${dailyQuota}, batch=${batchSize})`;
    return { ok: res.ok, status: res.status, submitted: batch.length, reason };
  } catch (e) {
    return { ok: false, status: 0, submitted: 0, reason: String(e).slice(0, 100) };
  }
}

export async function GET(request: NextRequest) {
  // Vercel envoie un header Authorization Bearer ${CRON_SECRET} si défini.
  // On vérifie juste pour éviter qu'un tiers déclenche le cron en boucle.
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const auth = request.headers.get("authorization") || "";
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  // 1. Construit la liste maximale d'URLs : statiques + zones × métiers + travaux + artisans
  const urls = new Set<string>();

  for (const path of STATIC_HIGH_PRIORITY) urls.add(`${SITE}${path}`);
  for (const path of PRIX_METIERS) urls.add(`${SITE}${path}`);
  for (const path of VILLES_X_METIERS_PRINCIPALES) urls.add(`${SITE}${path}`);
  for (const slug of TRAVAUX_SLUGS) urls.add(`${SITE}/travaux/${slug}`);

  // Toutes les zones publishable (tier ≤ CURRENT_PUBLISH_TIER) × 8 métiers
  for (const zone of getAllPublishableZones()) {
    urls.add(`${SITE}/${zone.slug}`);
    for (const m of METIERS) urls.add(`${SITE}/${zone.slug}/${m}`);
    // Pages dédiées attestation sismique et PCMI13 par ville
    urls.add(`${SITE}/attestation-sismique/${zone.slug}`);
    urls.add(`${SITE}/pcmi13/${zone.slug}`);
  }

  // Idem pour les 5 villes principales
  for (const v of ["chambery", "annecy", "grenoble", "lyon", "valence"]) {
    urls.add(`${SITE}/attestation-sismique/${v}`);
    urls.add(`${SITE}/pcmi13/${v}`);
  }

  // Vitrines artisans actifs (DB)
  try {
    const artisans = await prisma.artisan.findMany({
      where: { actif: true, visible: true, deletedAt: null },
      select: { slug: true, villeSlug: true, ville: true },
      take: 1000,
    });
    for (const a of artisans) {
      const villeSlug = a.villeSlug || (a.ville || "").toLowerCase();
      if (a.slug && villeSlug) urls.add(`${SITE}/${villeSlug}/${a.slug}`);
    }
  } catch {
    /* DB unavailable — ping the rest anyway */
  }

  // IndexNow accepte jusqu'à 10 000 URLs/req. Si on dépasse, on chunk.
  const allUrls = Array.from(urls);
  const chunks: string[][] = [];
  for (let i = 0; i < allUrls.length; i += 10000) {
    chunks.push(allUrls.slice(i, i + 10000));
  }

  const indexNowResults: IndexNowResult[][] = [];
  for (const chunk of chunks) {
    indexNowResults.push(await pingIndexNow(chunk));
  }

  // 2. Ping Google legacy sitemap endpoint (best effort)
  const googlePing = await pingGoogleSitemap();

  // 3. Bing Webmaster Tools API (si la clé est fournie en env Vercel)
  const bingWmt = await submitBingWebmasterTools(allUrls);

  return NextResponse.json({
    success: true,
    submittedUrls: allUrls.length,
    chunks: chunks.length,
    indexnow: indexNowResults.flat(),
    googleSitemapPing: googlePing,
    bingWebmaster: bingWmt,
    timestamp: new Date().toISOString(),
  });
}
