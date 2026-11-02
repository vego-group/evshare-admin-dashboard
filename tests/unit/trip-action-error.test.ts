import { describe, expect, it } from "vitest";

import { formatTripActionError } from "@/lib/utils/trip-action-error";

describe("trip action errors", () => {
  it("turns an open-lock response into actionable support guidance", () => {
    const message = formatTripActionError("Conflict", {
      message: "Conflict",
      error_code: "lock_open",
      errors: { reason: "last_lock_state is unlocked" },
    });

    expect(message).toContain("القفل ما زال مفتوحاً");
    expect(message).toContain("استخدم أمر القفل");
    expect(message).toContain("last_lock_state is unlocked");
  });

  it("explains that an unverifiable lock leaves the trip unsettled", () => {
    const message = formatTripActionError(undefined, {
      message: "Unavailable",
      error_code: "lock_status_unavailable",
      errors: { reason: "device offline", status_reason: "no telemetry" },
      correlation_id: "trace-123",
    });

    expect(message).toContain("بقيت الرحلة نشطة");
    expect(message).toContain("device offline");
    expect(message).toContain("no telemetry");
    expect(message).toContain("trace-123");
  });
});
