import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  buildEditUserPayload,
  getUserEditErrorMessage,
  type UserEditValues,
} from "@/lib/user-edit";

const serviceMocks = vi.hoisted(() => ({
  safeApi: vi.fn(),
}));

vi.mock("@/services", () => serviceMocks);

import { editUser } from "@/services/mutations/users";

const original: UserEditValues = {
  first_name: "Ahmed",
  last_name: "Ali",
  email: "ahmed@example.com",
  city_id: "riyadh-uuid",
  role: "driver",
  active: true,
  language: "ar",
  notifications_enabled: true,
};

describe("admin user edit contract", () => {
  beforeEach(() => {
    serviceMocks.safeApi.mockReset();
    serviceMocks.safeApi.mockResolvedValue({ ok: true, status: 200 });
  });

  it("posts partial updates to the documented endpoint", async () => {
    const payload = { first_name: "Omar", role: "merchant" };

    await editUser("user-uuid", payload);

    expect(serviceMocks.safeApi).toHaveBeenCalledWith(
      "POST",
      "/users/user-uuid/edit",
      payload,
    );
  });

  it("sends only changed editable fields", () => {
    expect(buildEditUserPayload(original, {
      ...original,
      first_name: "Omar",
      role: "merchant",
      notifications_enabled: false,
    })).toEqual({
      first_name: "Omar",
      role: "merchant",
      notifications_enabled: false,
    });
  });

  it("uses null to clear nullable email and city fields", () => {
    expect(buildEditUserPayload(original, {
      ...original,
      email: "",
      city_id: "",
    })).toEqual({ email: null, city_id: null });
  });

  it("builds an empty body for a no-op save", () => {
    expect(buildEditUserPayload(original, original)).toEqual({});
  });

  it.each([
    ["SELF_ROLE_CHANGE_FORBIDDEN", "لا يمكنك تغيير دورك الخاص"],
    ["ROLE_ESCALATION_FORBIDDEN", "لا تملك صلاحية تعيين هذا الدور أو تغيير دور هذا المستخدم"],
    ["INVALID_ACCOUNT_TRANSITION", "لا يمكن تعديل دور حساب محذوف"],
  ])("maps %s to actionable role-policy feedback", (errorCode, message) => {
    expect(getUserEditErrorMessage({ error_code: errorCode }, "fallback")).toBe(message);
  });

  it("preserves the API message for other edit failures", () => {
    expect(getUserEditErrorMessage({ message: "Tenant is closed" }, "fallback"))
      .toBe("Tenant is closed");
  });
});
