import { describe, expect, it } from "vitest";
import { validateDevisIA } from "../agents/devis-validator";

describe("validateDevisIA", () => {
  it("accepts a clean devis", () => {
    const r = validateDevisIA({
      status: "ok",
      lignes: [
        { label: "Pose chauffe-eau", qte: 1, unite: "u", puHt: 850, totalHt: 850, tva: 10 },
        { label: "Déplacement", qte: 1, unite: "forfait", puHt: 35, totalHt: 35, tva: 20 },
      ],
      totalHt: 885,
      totalTva: 92,
      totalTtc: 977,
    });
    expect(r.valid).toBe(true);
    expect(r.errors).toHaveLength(0);
  });

  it("rejects qte × puHt ≠ totalHt", () => {
    const r = validateDevisIA({
      status: "ok",
      lignes: [{ label: "Bug", qte: 2, unite: "u", puHt: 100, totalHt: 999, tva: 20 }],
      totalHt: 999,
      totalTva: 199.8,
      totalTtc: 1198.8,
    });
    expect(r.valid).toBe(false);
    expect(r.errors[0]).toContain("999");
  });

  it("rejects invalid TVA rate", () => {
    const r = validateDevisIA({
      status: "ok",
      lignes: [{ label: "Bug TVA", qte: 1, unite: "u", puHt: 100, totalHt: 100, tva: 7.5 }],
      totalHt: 100,
      totalTva: 7.5,
      totalTtc: 107.5,
    });
    expect(r.valid).toBe(false);
    expect(r.errors[0]).toContain("TVA");
  });

  it("rejects HT + TVA ≠ TTC", () => {
    const r = validateDevisIA({
      status: "ok",
      lignes: [{ label: "OK", qte: 1, unite: "u", puHt: 100, totalHt: 100, tva: 20 }],
      totalHt: 100,
      totalTva: 20,
      totalTtc: 999, // mauvais TTC
    });
    expect(r.valid).toBe(false);
    expect(r.errors.some((e) => e.includes("TTC"))).toBe(true);
  });

  it("warns on excessively large total", () => {
    const r = validateDevisIA({
      status: "ok",
      lignes: [{ label: "Énorme", qte: 1, unite: "forfait", puHt: 60000, totalHt: 60000, tva: 20 }],
      totalHt: 60000,
      totalTva: 12000,
      totalTtc: 72000,
    });
    expect(r.valid).toBe(true);
    expect(r.warnings.some((w) => w.includes("50K€"))).toBe(true);
  });

  it("rejects negative quantity", () => {
    const r = validateDevisIA({
      status: "ok",
      lignes: [{ label: "Bug", qte: -1, unite: "u", puHt: 100, totalHt: -100, tva: 20 }],
    });
    expect(r.valid).toBe(false);
  });

  it("skips validation if status not 'ok'", () => {
    const r = validateDevisIA({ status: "need_clarif" });
    expect(r.valid).toBe(true);
  });

  it("warns on out-of-range catalogue price (matched code)", () => {
    const r = validateDevisIA(
      {
        status: "ok",
        lignes: [{ code: "PLB-001", label: "Pose mitigeur", qte: 1, unite: "u", puHt: 5000, totalHt: 5000, tva: 10 }],
        totalHt: 5000,
        totalTva: 500,
        totalTtc: 5500,
      },
      [{ code: "PLB-001", designation: "Pose mitigeur", unite: "u", prixHtBas: 80, prixHtMoyen: 120, prixHtHaut: 180, motsCles: [], dureeMoyenneH: null, tvaDefault: 10, categorie: null, description: null, metierSlug: "plombier", id: "x", createdAt: new Date(), updatedAt: new Date() } as never],
    );
    expect(r.valid).toBe(true); // c'est un warning, pas une erreur
    expect(r.warnings.some((w) => w.includes("hors range"))).toBe(true);
  });
});
