import { NextRequest } from "next/server";
import { apiSuccess, apiError } from "@/lib/api-response";

// Clé publique IndexNow — référencée dans public/{key}.txt
const INDEXNOW_KEY = "b4a7f2e8c1d3a5b7e9f0a2c4d6b8e1f3";
const HOST = "www.bativio.fr";
const KEY_LOCATION = `https://${HOST}/${INDEXNOW_KEY}.txt`;

const ENDPOINTS = [
  "https://api.indexnow.org/indexnow",
  "https://www.bing.com/indexnow",
  "https://yandex.com/indexnow",
];

// POST /api/v1/indexnow
// Body: { urls: string[] }  (max 10 000 URLs par batch)
//
// Pings IndexNow on Bing, Yandex, and the IndexNow gateway to notify them of
// new/updated URLs. No auth required — the caller proves ownership of the
// domain by holding the key file at KEY_LOCATION.
export async function POST(req: NextRequest) {
  let body: { urls?: unknown };
  try {
    body = await req.json();
  } catch {
    return apiError("Invalid JSON body", 400);
  }

  const urls = body.urls;
  if (!Array.isArray(urls) || urls.length === 0) {
    return apiError("urls must be a non-empty array", 400);
  }
  if (urls.length > 10000) {
    return apiError("max 10000 urls per request", 400);
  }
  for (const u of urls) {
    if (typeof u !== "string" || !u.startsWith(`https://${HOST}/`)) {
      return apiError(`Invalid URL: ${String(u).slice(0, 80)}`, 400);
    }
  }

  const payload = {
    host: HOST,
    key: INDEXNOW_KEY,
    keyLocation: KEY_LOCATION,
    urlList: urls,
  };

  const results = await Promise.allSettled(
    ENDPOINTS.map(async (endpoint) => {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify(payload),
      });
      return { endpoint, status: res.status, ok: res.ok };
    })
  );

  return apiSuccess({
    submitted: urls.length,
    endpoints: results.map((r) => (r.status === "fulfilled" ? r.value : { endpoint: "?", error: String(r.reason) })),
  });
}

// GET /api/v1/indexnow — small probe to confirm key is reachable.
export async function GET() {
  try {
    const res = await fetch(KEY_LOCATION, { cache: "no-store" });
    const ok = res.ok;
    const text = ok ? (await res.text()).trim() : "";
    return apiSuccess({
      keyLocation: KEY_LOCATION,
      reachable: ok,
      keyMatches: text === INDEXNOW_KEY,
    });
  } catch (e) {
    return apiError(`Key location unreachable: ${String(e).slice(0, 120)}`, 500);
  }
}
