import { describe, expect, it } from "vitest";
import { computeCost, extractJson, MODEL_HAIKU, MODEL_OPUS, MODEL_SONNET } from "../claude";

describe("computeCost", () => {
  it("computes Opus pricing (15$ in / 75$ out per 1M)", () => {
    // 1000 IN + 500 OUT = 1000*15/1M + 500*75/1M = 0.015 + 0.0375 = 0.0525 USD
    // × 0.92 EUR = 0.0483 EUR (rounded to 4 decimals)
    expect(computeCost(MODEL_OPUS, 1000, 500)).toBeCloseTo(0.0483, 4);
  });

  it("computes Sonnet pricing (3$ in / 15$ out per 1M)", () => {
    // 1000 IN + 500 OUT = 0.003 + 0.0075 = 0.0105 USD × 0.92 = 0.00966 EUR
    expect(computeCost(MODEL_SONNET, 1000, 500)).toBeCloseTo(0.00966, 4);
  });

  it("computes Haiku pricing (1$ in / 5$ out per 1M)", () => {
    expect(computeCost(MODEL_HAIKU, 1000, 500)).toBeCloseTo(0.00322, 4);
  });

  it("handles zero tokens", () => {
    expect(computeCost(MODEL_OPUS, 0, 0)).toBe(0);
  });

  it("falls back to Sonnet pricing on unknown model", () => {
    expect(computeCost("unknown-model", 1000, 500)).toBeCloseTo(0.00966, 4);
  });

  it("rounds to 4 decimals (centimes EUR cents)", () => {
    const c = computeCost(MODEL_OPUS, 12345, 6789);
    // pas plus de 4 decimals
    expect(c.toString().split(".")[1]?.length || 0).toBeLessThanOrEqual(4);
  });

  it("applies 90% discount on cache read tokens (Opus)", () => {
    // 1000 IN + 0 OUT + 10000 cache_read = 1000*15/1M + 10000*15*0.10/1M
    // = 0.015 + 0.015 = 0.030 USD × 0.92 = 0.0276 EUR
    expect(computeCost(MODEL_OPUS, 1000, 0, 10000, 0)).toBeCloseTo(0.0276, 4);
  });

  it("applies 25% surcharge on cache creation tokens (Opus)", () => {
    // 1000 IN + 0 OUT + 0 cache_read + 10000 cache_creation
    // = 1000*15/1M + 10000*15*1.25/1M = 0.015 + 0.1875 = 0.2025 USD × 0.92 = 0.1863 EUR
    expect(computeCost(MODEL_OPUS, 1000, 0, 0, 10000)).toBeCloseTo(0.1863, 4);
  });

  it("cache read is ~12.5x cheaper than cache creation", () => {
    const read = computeCost(MODEL_OPUS, 0, 0, 10000, 0);
    const create = computeCost(MODEL_OPUS, 0, 0, 0, 10000);
    expect(create / read).toBeCloseTo(12.5, 1); // 1.25 / 0.10
  });

  it("is monotone in tokens (no negative pricing)", () => {
    expect(computeCost(MODEL_OPUS, 100, 100, 100, 100)).toBeGreaterThan(0);
    expect(computeCost(MODEL_OPUS, 100, 100)).toBeGreaterThan(
      computeCost(MODEL_OPUS, 99, 99),
    );
  });
});

describe("extractJson", () => {
  it("extracts JSON from markdown code block ```json", () => {
    const text = 'Some intro\n```json\n{"foo": "bar"}\n```\nOutro';
    expect(extractJson(text)).toEqual({ foo: "bar" });
  });

  it("extracts raw JSON object", () => {
    expect(extractJson('{"a": 1, "b": 2}')).toEqual({ a: 1, b: 2 });
  });

  it("extracts JSON embedded in prose", () => {
    expect(extractJson('Voici la réponse : {"step": "done", "value": 42} fin'))
      .toEqual({ step: "done", value: 42 });
  });

  it("returns null on invalid JSON", () => {
    expect(extractJson("not json at all")).toBeNull();
    expect(extractJson("")).toBeNull();
  });

  it("handles nested objects", () => {
    const text = '```json\n{"outer": {"inner": [1, 2, 3]}}\n```';
    expect(extractJson(text)).toEqual({ outer: { inner: [1, 2, 3] } });
  });

  it("returns null on truncated JSON", () => {
    expect(extractJson('{"foo": "bar')).toBeNull();
  });
});
