import { test, expect } from "./fixtures";
import { panelRoutes } from "./panel-routes";

test.describe("smoke and route protection", () => {
  test("login page renders the critical controls", async ({ page }) => {
    await page.goto("/login");

    await expect(page).toHaveTitle(/Admin EV Share/);
    await expect(page.locator("html")).toHaveAttribute("lang", "ar");
    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
    await expect(page.getByRole("button", { name: /اختر الدولة/ })).toBeVisible();
    await expect(page.getByRole("textbox")).toBeVisible();
    await expect(page.getByRole("button", { name: /إرسال رمز التحقق/ })).toBeVisible();
  });

  for (const route of panelRoutes) {
    test(`unauthenticated visitor is redirected from ${route}`, async ({ page }) => {
      await page.goto(route);
      await expect(page).toHaveURL(/\/login$/);
    });
  }
});
