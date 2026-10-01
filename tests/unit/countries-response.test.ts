import { describe, expect, it } from "vitest";

import { normalizeCountriesResponse } from "@/services/queries/countries";

const validCountry = {
  code: "sa",
  name_ar: "السعودية",
  name_en: "Saudi Arabia",
  active: true,
  currency_code: "SAR",
};

describe("normalizeCountriesResponse", () => {
  it("turns a null list into an empty list so shared dashboard providers do not crash", () => {
    expect(normalizeCountriesResponse({ error: false, data: null })).toEqual({
      error: false,
      message: "",
      data: [],
    });
  });

  it("drops null and malformed country entries", () => {
    expect(
      normalizeCountriesResponse({
        error: false,
        message: "ok",
        data: [null, validCountry, { code: "jo" }],
      }),
    ).toEqual({ error: false, message: "ok", data: [validCountry] });
  });

  it("handles a null response body", () => {
    expect(normalizeCountriesResponse(null).data).toEqual([]);
  });
});
