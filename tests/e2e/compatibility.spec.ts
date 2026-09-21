import { test, expect } from "./fixtures";

test("login remains usable at the configured browser and viewport", async ({ page }) => {
  await page.goto("/login");
  const main = page.getByRole("main");
  await expect(main).toBeVisible();
  await expect(page.getByRole("button", { name: /إرسال رمز التحقق/ })).toBeInViewport();

  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(1);
});
