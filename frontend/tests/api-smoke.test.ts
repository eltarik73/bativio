/**
 * Smoke tests for the public + auth API surface.
 *
 * Run with: PORT=3019 npm run dev (in another terminal), then `npm run test:smoke`.
 * Each test self-skips with t.skip() if the dev server is unreachable —
 * this avoids the static-hoisting trap of `{skip: someFlag}` at suite level.
 */
import { describe, it, before, after, type TestContext } from "node:test";
import assert from "node:assert/strict";

const BASE = process.env.TEST_BASE_URL || "http://localhost:3019";

async function reachable(): Promise<boolean> {
  try {
    const res = await fetch(`${BASE}/api/v1/public/metiers`, { signal: AbortSignal.timeout(2000) });
    return res.ok;
  } catch {
    return false;
  }
}

async function skipIfDown(t: TestContext): Promise<boolean> {
  if (!(await reachable())) {
    t.skip(`dev server unreachable at ${BASE}`);
    return true;
  }
  return false;
}

let TEST_EMAIL = "";
let TEST_COOKIE = "";
let TEST_ARTISAN_ID = "";

describe("Smoke: public API", () => {
  it("GET /api/v1/public/metiers returns >= 10 metiers", async (t) => {
    if (await skipIfDown(t)) return;
    const res = await fetch(`${BASE}/api/v1/public/metiers`);
    assert.equal(res.status, 200);
    const json = await res.json();
    assert.equal(json.success, true);
    assert.ok(json.data.length >= 10);
  });

  it("GET /api/v1/public/villes responds 200", async (t) => {
    if (await skipIfDown(t)) return;
    const res = await fetch(`${BASE}/api/v1/public/villes`);
    assert.equal(res.status, 200);
  });
});

describe("Smoke: auth flow", () => {
  before(() => {
    TEST_EMAIL = `smoke.test+${Date.now()}@bativio-test.local`;
  });

  it("POST /api/v1/auth/register creates an artisan", async (t) => {
    if (await skipIfDown(t)) return;
    const tail = String(Date.now()).slice(-9);
    const body = {
      email: TEST_EMAIL,
      password: "Password123!",
      nomAffichage: "Smoke Test Artisan",
      siret: tail,
      telephone: `0600${tail.slice(-6)}`,
      metierId: "plombier",
      ville: "Chambéry",
      codeInsee: "73065",
      latitude: 45.5646,
      longitude: 5.9178,
    };
    const res = await fetch(`${BASE}/api/v1/auth/register`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });
    const text = await res.text();
    assert.equal(res.status, 201, `register failed: ${text}`);
    const json = JSON.parse(text);
    assert.equal(json.success, true);
    assert.ok(json.data.artisan.id);
    TEST_ARTISAN_ID = json.data.artisan.id;
    // Capture session cookie for subsequent tests
    const setCookie = res.headers.get("set-cookie") || "";
    const m = setCookie.match(/bativio-session=([^;]+)/);
    if (m) TEST_COOKIE = `bativio-session=${m[1]}`;
    assert.ok(TEST_COOKIE, "session cookie not returned");
  });

  it("POST /api/v1/auth/register rejects malformed SIRET (Zod 400)", async (t) => {
    if (await skipIfDown(t)) return;
    const res = await fetch(`${BASE}/api/v1/auth/register`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email: "x@y.z", password: "Password123!", siret: "abc" }),
    });
    assert.equal(res.status, 400);
  });

  it("GET /api/v1/auth/me returns the logged-in user", async (t) => {
    if (await skipIfDown(t)) return;
    if (!TEST_COOKIE) { t.skip("no cookie from register"); return; }
    const res = await fetch(`${BASE}/api/v1/auth/me`, { headers: { cookie: TEST_COOKIE } });
    assert.equal(res.status, 200);
    const json = await res.json();
    assert.equal(json.success, true);
  });

  it("GET /api/v1/artisans/me/photos starts empty for a new artisan", async (t) => {
    if (await skipIfDown(t)) return;
    if (!TEST_COOKIE) { t.skip("no cookie from register"); return; }
    const res = await fetch(`${BASE}/api/v1/artisans/me/photos`, { headers: { cookie: TEST_COOKIE } });
    assert.equal(res.status, 200);
    const json = await res.json();
    const photos = Array.isArray(json) ? json : json.data ?? [];
    assert.equal(photos.length, 0);
  });
});

describe("Smoke: admin endpoints reject non-admin", () => {
  it("GET /api/v1/admin/artisans without auth returns 401", async (t) => {
    if (await skipIfDown(t)) return;
    const res = await fetch(`${BASE}/api/v1/admin/artisans`);
    assert.equal(res.status, 401);
  });

  it("GET /api/v1/admin/artisans with artisan cookie returns 403", async (t) => {
    if (await skipIfDown(t)) return;
    if (!TEST_COOKIE) { t.skip("no cookie from register"); return; }
    const res = await fetch(`${BASE}/api/v1/admin/artisans`, { headers: { cookie: TEST_COOKIE } });
    assert.equal(res.status, 403);
  });
});

after(async () => {
  // Best-effort cleanup: hit a hypothetical cleanup endpoint if available,
  // otherwise leave the test artisan in place (the dev DB is the prod DB
  // here — see CLAUDE.md — so we don't blindly delete via raw SQL).
  if (TEST_ARTISAN_ID) {
    console.log(`[smoke] left test artisan ${TEST_ARTISAN_ID} (${TEST_EMAIL}) — run scripts/cleanup-test-data.ts to remove`);
  }
});
