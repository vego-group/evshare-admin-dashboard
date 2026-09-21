import fs from "node:fs";
import { test, expect } from "@playwright/test";
import { panelRoutes } from "../panel-routes";

const storageState = process.env.PLAYWRIGHT_STORAGE_STATE;
const canRun = Boolean(storageState && fs.existsSync(storageState));

test.use({ storageState: canRun ? storageState : { cookies: [], origins: [] } });
test.skip(!canRun, "Set PLAYWRIGHT_STORAGE_STATE to a staging admin session created by Playwright codegen");

test.describe("authenticated staging smoke", () => {
  for (const route of panelRoutes) {
    test(`${route} renders without a server error`, async ({ page }) => {
      const response = await page.goto(route, { waitUntil: "domcontentloaded" });
      expect(response?.status()).toBeLessThan(500);
      await expect(page).not.toHaveURL(/\/login/);
      await expect(page.locator("body")).not.toContainText(/Internal Server Error/i);
    });
  }
});
