import AxeBuilder from "@axe-core/playwright";
import { test, expect } from "./fixtures";

test("login has no serious or critical automated accessibility violations", async ({ page }) => {
  await page.goto("/login");
  await expect(page.getByRole("main")).toBeVisible();

  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();

  const blocking = results.violations.filter(
    ({ impact }) => impact === "serious" || impact === "critical",
  );
  expect(blocking, JSON.stringify(blocking, null, 2)).toEqual([]);
});
