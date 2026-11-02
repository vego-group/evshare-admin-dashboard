import { beforeEach, describe, expect, it, vi } from "vitest";

const serviceMocks = vi.hoisted(() => ({
  safeApi: vi.fn(),
}));

vi.mock("@/services", () => serviceMocks);

import { assignUserRole } from "@/services/mutations/users";

describe("user role assignment API", () => {
  beforeEach(() => {
    serviceMocks.safeApi.mockReset();
    serviceMocks.safeApi.mockResolvedValue({ ok: true, status: 200 });
  });

  it("posts the selected role id to the dedicated endpoint", async () => {
    await assignUserRole("user-uuid", "role-uuid");

    expect(serviceMocks.safeApi).toHaveBeenCalledWith(
      "POST",
      "/users/user-uuid/role",
      { role_id: "role-uuid" },
    );
  });
});
