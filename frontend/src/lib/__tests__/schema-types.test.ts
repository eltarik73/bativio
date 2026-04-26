import { describe, expect, it } from "vitest";
import { getSchemaTypeForMetier, METIER_TO_SCHEMA_TYPE } from "../schema-types";

describe("getSchemaTypeForMetier", () => {
  it("returns specific Schema.org type for known métiers", () => {
    expect(getSchemaTypeForMetier("plombier")).toBe("Plumber");
    expect(getSchemaTypeForMetier("electricien")).toBe("Electrician");
    expect(getSchemaTypeForMetier("peintre")).toBe("HousePainter");
    expect(getSchemaTypeForMetier("couvreur")).toBe("RoofingContractor");
    expect(getSchemaTypeForMetier("chauffagiste")).toBe("HVACBusiness");
    expect(getSchemaTypeForMetier("serrurier")).toBe("Locksmith");
  });

  it("normalizes case", () => {
    expect(getSchemaTypeForMetier("PLOMBIER")).toBe("Plumber");
    expect(getSchemaTypeForMetier("Plombier")).toBe("Plumber");
  });

  it("falls back to LocalBusiness on unknown métier", () => {
    expect(getSchemaTypeForMetier("astronaute")).toBe("LocalBusiness");
    expect(getSchemaTypeForMetier("")).toBe("LocalBusiness");
  });

  it("falls back to LocalBusiness on null/undefined", () => {
    expect(getSchemaTypeForMetier(null)).toBe("LocalBusiness");
    expect(getSchemaTypeForMetier(undefined)).toBe("LocalBusiness");
  });

  it("covers all 10 métiers actifs", () => {
    const actifs = [
      "plombier",
      "electricien",
      "peintre",
      "carreleur",
      "macon",
      "menuisier",
      "couvreur",
      "chauffagiste",
      "serrurier",
      "cuisiniste",
    ];
    for (const m of actifs) {
      expect(METIER_TO_SCHEMA_TYPE[m]).toBeDefined();
    }
  });
});
