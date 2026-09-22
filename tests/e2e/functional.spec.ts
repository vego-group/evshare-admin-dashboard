import { test, expect } from "./fixtures";

test.describe("login functional behavior", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
  });

  test("country picker supports selection and exposes listbox state", async ({ page }) => {
    const countryButton = page.getByRole("button", { name: /اختر الدولة/ });
    await countryButton.click();
    await expect(countryButton).toHaveAttribute("aria-expanded", "true");
    await page.getByRole("option", { name: /السعودية/ }).click();
    await expect(page.getByRole("button", { name: /السعودية/ })).toBeVisible();
  });

  test("invalid phone input does not advance to OTP", async ({ page }) => {
    await page.getByRole("button", { name: /اختر الدولة/ }).click();
    await page.getByRole("option", { name: /السعودية/ }).click();
    await page.getByRole("textbox").fill("123");
    await page.getByRole("button", { name: /إرسال رمز التحقق/ }).click();

    await expect(page).toHaveURL(/\/login$/);
    await expect(page.locator("[class*='red']").first()).toBeVisible();
  });

  test("expired login clears stale authentication cookies", async ({ context, page }) => {
    const url = new URL(page.url() || "http://127.0.0.1:3000");
    await context.addCookies([
      { name: "token", value: "stale", domain: url.hostname, path: "/" },
      { name: "tenant-country", value: "sa", domain: url.hostname, path: "/" },
    ]);

    await page.goto("/login?expired=1");
    const cookies = await context.cookies();
    expect(cookies.find((cookie) => cookie.name === "token")).toBeUndefined();
    expect(cookies.find((cookie) => cookie.name === "tenant-country")).toBeUndefined();
  });

  test("authenticated users cannot remain on the login page", async ({ context, page }) => {
    const url = new URL(page.url() || "http://127.0.0.1:3000");
    await context.addCookies([
      { name: "token", value: "active-session", domain: url.hostname, path: "/" },
      { name: "tenant-country", value: "sa", domain: url.hostname, path: "/" },
    ]);

    await page.goto("/login");
    await expect(page).toHaveURL(/\/$/);
  });
});
