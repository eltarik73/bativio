// scripts/indexnow-ping.ts
//
// Pings IndexNow (Bing + Yandex + IndexNow gateway) for all publishable zone
// pages of a given tier. Use after each sprint when you bump
// CURRENT_PUBLISH_TIER in src/lib/zones.ts.
//
// Usage:
//   npx tsx scripts/indexnow-ping.ts            # tier 1 (current sprint)
//   npx tsx scripts/indexnow-ping.ts 2          # tier 2 (next sprint)
//   npx tsx scripts/indexnow-ping.ts 1 4        # range tier 1 → 4
//   HOST=https://staging.bativio.fr npx tsx scripts/indexnow-ping.ts 2
//
// Requires the prod endpoint /api/v1/indexnow to be live.

import { getAllPublishableZones } from "../src/lib/zones";

const METIERS = [
  "plombier", "electricien", "peintre", "macon",
  "carreleur", "menuisier", "couvreur", "chauffagiste",
];

const HOST = process.env.HOST || "https://www.bativio.fr";

async function main() {
  const argFrom = parseInt(process.argv[2] || "1", 10);
  const argTo = parseInt(process.argv[3] || String(argFrom), 10);
  if (Number.isNaN(argFrom) || Number.isNaN(argTo) || argFrom < 1 || argTo > 4 || argFrom > argTo) {
    console.error("Invalid tier args. Usage: npx tsx scripts/indexnow-ping.ts [tier_min] [tier_max]");
    process.exit(1);
  }

  const allZones = getAllPublishableZones(argTo);
  const targetZones = allZones.filter((z) => z.tier >= argFrom && z.tier <= argTo);

  if (targetZones.length === 0) {
    console.log(`No publishable zones in tier range ${argFrom}-${argTo}.`);
    return;
  }

  const urls: string[] = [];
  for (const z of targetZones) {
    urls.push(`${HOST}/${z.slug}`);
    for (const m of METIERS) urls.push(`${HOST}/${z.slug}/${m}`);
  }

  console.log(`Tier ${argFrom}${argFrom === argTo ? "" : `-${argTo}`} : ${targetZones.length} zones, ${urls.length} URLs`);
  console.log(`First 3: ${urls.slice(0, 3).join(", ")}`);
  console.log(`Last 3:  ${urls.slice(-3).join(", ")}`);
  console.log(`POSTing to ${HOST}/api/v1/indexnow...`);

  const res = await fetch(`${HOST}/api/v1/indexnow`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ urls }),
  });

  const text = await res.text();
  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    data = text;
  }

  console.log(JSON.stringify(data, null, 2));

  if (!res.ok) {
    console.error(`IndexNow ping failed (HTTP ${res.status}).`);
    process.exit(2);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
