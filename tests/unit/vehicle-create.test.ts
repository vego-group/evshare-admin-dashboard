import { describe, expect, it } from "vitest";

import {
  hasCompleteCreateConfiguration,
  normalizeCreateVehicleFieldErrors,
  vehicleCreateErrorMessage,
} from "@/lib/utils/vehicle-create";
import { isVehicleProvisioningReady } from "@/lib/utils/vehicle-provisioning";

describe("vehicle create contract", () => {
  it("allows a bike configuration without a device", () => {
    expect(
      hasCompleteCreateConfiguration({
        vehicle_type: "bike",
        label: "BIKE-1",
        operating_type: "evshare",
        price_per_minute: 1,
      }),
    ).toBe(true);
  });

  it("requires a device for scooters and cars", () => {
    const base = {
      label: "SCOOTER-1",
      operating_type: "operation_company" as const,
      operation_company_id: "company-id",
      product_id: "product-id",
    };

    expect(
      hasCompleteCreateConfiguration({ ...base, vehicle_type: "scooter" }),
    ).toBe(false);
    expect(
      hasCompleteCreateConfiguration({
        ...base,
        vehicle_type: "scooter",
        lock_id: "lock-id",
      }),
    ).toBe(true);
  });

  it("normalizes array and string validation errors and ignores unknown fields", () => {
    expect(
      normalizeCreateVehicleFieldErrors({
        label: ["The label is already in use."],
        lock_id: "The lock is assigned.",
        internal: ["Do not expose this."],
      }),
    ).toEqual({
      label: "The label is already in use.",
      lock_id: "The lock is assigned.",
    });
  });

  it("maps service error codes while preserving unknown API messages", () => {
    expect(vehicleCreateErrorMessage("VEHICLE_DEVICE_INVALID", "fallback"))
      .toBe("القفل مخصص لمركبة أخرى");
    expect(vehicleCreateErrorMessage("UNKNOWN", "Backend message"))
      .toBe("Backend message");
  });
});

describe("vehicle provisioning readiness", () => {
  it("uses the explicit readiness flag first", () => {
    expect(
      isVehicleProvisioningReady({
        provisioning_status: "ready",
        provisioning: { status: "draft", ready: false, missing: ["pricing"] },
      }),
    ).toBe(false);
  });

  it("supports responses containing only provisioning_status", () => {
    expect(
      isVehicleProvisioningReady({ provisioning_status: "pending_device" }),
    ).toBe(false);
    expect(isVehicleProvisioningReady({ provisioning_status: "ready" }))
      .toBe(true);
  });
});
