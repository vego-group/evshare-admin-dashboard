import { beforeEach, describe, expect, it, vi } from "vitest";

const serviceMocks = vi.hoisted(() => ({ safeApi: vi.fn() }));
vi.mock("@/services", () => serviceMocks);

import { createVehicleAPI } from "@/services/mutations/vehicle-operating-pricing";

describe("vehicle create API contract", () => {
  beforeEach(() => {
    serviceMocks.safeApi.mockReset();
    serviceMocks.safeApi.mockResolvedValue({
      ok: true,
      status: 200,
      message: "created",
      data: { data: { id: "vehicle-id" } },
    });
  });

  it("posts the provisioning payload to the documented endpoint", async () => {
    const payload = {
      vehicle_type: "scooter" as const,
      label: "SC-1042",
      operating_type: "operation_company" as const,
      operation_company_id: "company-id",
      product_id: "product-id",
      open_price: 5,
      lock_id: "lock-id",
      latitude: 24.7136,
      longitude: 46.6753,
    };

    await createVehicleAPI(payload);

    expect(serviceMocks.safeApi).toHaveBeenCalledWith(
      "POST",
      "/vehicles/add",
      payload,
    );
  });
});
