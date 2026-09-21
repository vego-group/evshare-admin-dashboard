import { test, expect } from "./fixtures";

test.describe("browser-facing security controls", () => {
  test("protected content is not returned to an anonymous browser", async ({ page }) => {
    const response = await page.goto("/users");
    expect(response?.status()).toBeLessThan(400);
    await expect(page).toHaveURL(/\/login$/);
    await expect(page.getByText(/المستخدمون/)).toHaveCount(0);
  });

  test("session endpoint clears an HttpOnly cookie", async ({ request }) => {
    const response = await request.delete("/api/auth/session", {
      headers: { Cookie: "token=secret" },
    });
    const cookie = response.headers()["set-cookie"] ?? "";
    expect(cookie).toContain("token=");
    expect(cookie.toLowerCase()).toContain("httponly");
    expect(cookie.toLowerCase()).toContain("samesite=strict");
    expect(cookie).toMatch(/Max-Age=0/i);
  });

  test("strict transport/browser headers are present when release enforcement is enabled", async ({ page }) => {
    test.skip(process.env.STRICT_SECURITY_HEADERS !== "true", "Enable in staging/release after headers are configured");
    const response = await page.goto("/login");
    const headers = response?.headers() ?? {};
    expect(headers["x-content-type-options"]).toBe("nosniff");
    expect(headers["referrer-policy"]).toBeTruthy();
    expect(headers["content-security-policy"]).toBeTruthy();
    expect(headers["x-frame-options"] ?? headers["content-security-policy"]).toBeTruthy();
  });
});
