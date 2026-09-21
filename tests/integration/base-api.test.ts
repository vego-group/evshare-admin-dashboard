import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/toast-events", () => ({ notifyForbidden: vi.fn() }));
vi.mock("@/lib/feature-flag-runtime", () => ({
  getFeatureFlagRuntimeHeaders: () => ({ "X-Feature-Flag-Version": "test-1" }),
}));

describe("browser API integration", () => {
  beforeEach(() => {
    vi.resetModules();
    window.history.replaceState({}, "", "/");
  });

  it("uses the same-origin admin gateway and returns JSON", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ data: [{ id: "user-1" }] }), {
        status: 200,
        headers: { "content-type": "application/json" },
      }),
    );
    const { baseAPI } = await import("@/services");

    await expect(baseAPI("GET", "/users?page=1")).resolves.toEqual({ data: [{ id: "user-1" }] });
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/admin/users?page=1",
      expect.objectContaining({ method: "GET", credentials: "same-origin" }),
    );
  });

  it("turns a non-success response into a status-bearing error", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ message: "Forbidden" }), {
        status: 403,
        headers: { "content-type": "application/json" },
      }),
    );
    const { baseAPI } = await import("@/services");

    await expect(baseAPI("GET", "/users")).rejects.toMatchObject({ message: "Forbidden", status: 403 });
  });
});
