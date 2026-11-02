import { describe, expect, it } from "vitest";

import { isGatewayDeviceId } from "@/lib/utils/device-id";

describe("Vego IoT device identifiers", () => {
  it.each([
    "3fcbff96-04c0-4803-a24f-6f6aba32f8e7",
    "  3FCBFF96-04C0-4803-A24F-6F6ABA32F8E7  ",
  ])("accepts UUID device ids", (value) => {
    expect(isGatewayDeviceId(value)).toBe(true);
  });

  it.each(["LOCK-123", "friendly-name", "", "3fcbff96-04c0-4803-a24f"])(
    "rejects non-UUID device ids",
    (value) => {
      expect(isGatewayDeviceId(value)).toBe(false);
    },
  );
});
