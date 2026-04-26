import { describe, expect, it } from "vitest";
import { computeTvaIntra, isValidTvaIntra } from "../tva-intra";

describe("computeTvaIntra", () => {
  it("computes valid French TVA intra (SIREN 9 + key)", () => {
    // SIREN 404833048 → clé : (12 + 3*(404833048 mod 97)) mod 97
    // 404833048 mod 97 = 56, donc clé = (12 + 168) mod 97 = 180 mod 97 = 83
    expect(computeTvaIntra("40483304800019")).toBe("FR83404833048");
  });

  it("works on bare SIREN 9 chars too", () => {
    expect(computeTvaIntra("404833048")).toBe("FR83404833048");
  });

  it("strips spaces and non-digits", () => {
    expect(computeTvaIntra("404 833 048 00019")).toBe("FR83404833048");
    expect(computeTvaIntra("404-833-048")).toBe("FR83404833048");
  });

  it("returns empty string on invalid input", () => {
    expect(computeTvaIntra("")).toBe("");
    expect(computeTvaIntra("123")).toBe("");
  });

  it("validates known TVA numbers", () => {
    // FR47932458712 (Bativio fictif dans mentions-legales)
    const computed = computeTvaIntra("932458712");
    expect(isValidTvaIntra(computed)).toBe(true);
  });

  it("isValidTvaIntra rejects malformed", () => {
    expect(isValidTvaIntra("FR12345")).toBe(false);
    expect(isValidTvaIntra("DE123456789")).toBe(false);
    expect(isValidTvaIntra("FR99404833048")).toBe(false); // mauvaise clé
  });
});
