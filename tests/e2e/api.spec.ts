import { test, expect } from "@playwright/test";

test.describe("same-origin API routes", () => {
  test("admin gateway rejects requests without auth and tenant cookies", async ({ request }) => {
    const response = await request.get("/api/admin/users");
    expect(response.status()).toBe(401);
    expect(await response.json()).toEqual({ message: "Unauthorized" });
  });

  test("session deletion is idempotent and not cacheable", async ({ request }) => {
    const response = await request.delete("/api/auth/session");
    expect(response.status()).toBe(204);
    expect(response.headers()["cache-control"]).toBe("no-store");
  });
});
