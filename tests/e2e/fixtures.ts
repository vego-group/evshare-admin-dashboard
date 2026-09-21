import { test as base, expect } from "@playwright/test";

export const countriesPayload = {
  data: [
    {
      id: 1,
      code: "sa",
      name: "Saudi Arabia",
      name_ar: "السعودية",
      name_en: "Saudi Arabia",
      active: true,
      phone_code: "+966",
      currency_code: "SAR",
      currency_symbol_en: "SAR",
    },
  ],
};

export const test = base.extend({
  page: async ({ page }, useFixture) => {
    await page.route("**/api/countries", (route) =>
      route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(countriesPayload) }),
    );
    await useFixture(page);
  },
});

export { expect };
