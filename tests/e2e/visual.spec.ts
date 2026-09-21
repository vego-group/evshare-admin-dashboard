import { test, expect } from "./fixtures";

test("login visual regression", async ({ page }) => {
  await page.goto("/login");
  await expect(page.getByRole("main")).toBeVisible();
  await expect(page).toHaveScreenshot("login.png", {
    animations: "disabled",
    fullPage: true,
    maxDiffPixelRatio: 0.01,
  });
});
