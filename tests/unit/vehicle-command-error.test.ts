import { describe, expect, it } from "vitest";

import { vehicleCommandErrorMessage } from "@/lib/utils/vehicle-command-error";

describe("vehicle command errors", () => {
  it("shows the exact missing permission only for authorization failures", () => {
    const message = vehicleCommandErrorMessage(
      {
        status: 403,
        error: {
          error_code: "AUTH_PERMISSION_DENIED",
          details: { required: ["Admin Unlock Vehicles"] },
        },
      },
      "unlock",
    );

    expect(message).toContain("Admin Unlock Vehicles");
    expect(message).toContain("لا تملك الصلاحية المطلوبة");
  });

  it("keeps an offline device error distinct from permission denial", () => {
    const message = vehicleCommandErrorMessage(
      {
        status: 503,
        error: { error_code: "iot_device_offline" },
      },
      "unlock",
    );

    expect(message).toContain("غير متصل");
    expect(message).not.toContain("صلاحية");
  });

  it.each([
    [504, "iot_command_timeout", "لم يستجب"],
    [502, "iot_command_rejected", "رفض القفل"],
  ])("maps %s %s using the stable error code", (status, errorCode, expected) => {
    expect(
      vehicleCommandErrorMessage(
        { status, error: { error_code: errorCode } },
        "unlock",
      ),
    ).toContain(expected);
  });

  it("does not infer a permission failure from HTTP status alone", () => {
    expect(
      vehicleCommandErrorMessage({ status: 503 }, "unlock"),
    ).toBe("فشل فتح المركبة");
  });

  it("preserves a localized backend device message", () => {
    expect(
      vehicleCommandErrorMessage(
        {
          status: 503,
          message: "القفل غير متصل حالياً، حاول لاحقاً",
          error: { error_code: "iot_device_offline" },
        },
        "unlock",
      ),
    ).toBe("القفل غير متصل حالياً، حاول لاحقاً");
  });
});
