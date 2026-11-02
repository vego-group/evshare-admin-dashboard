import { beforeEach, describe, expect, it, vi } from "vitest";

const serviceMocks = vi.hoisted(() => ({ baseAPI: vi.fn() }));
vi.mock("@/services", () => serviceMocks);

import { vehiclesAPI } from "@/services/queries/vehicle-operating-pricing";

describe("vehicle list filters API contract", () => {
  beforeEach(() => {
    serviceMocks.baseAPI.mockReset();
    serviceMocks.baseAPI.mockResolvedValue({
      error: false,
      message: "ok",
      data: [],
      meta: { currentPage: 1, lastPage: 1, perPage: 20, total: 0 },
      analysis: {
        total: 100,
        active: 50,
        in_use: 20,
        maintenance: 10,
        stopped: 5,
      },
    });
  });

  it("composes the documented filters before pagination", async () => {
    const response = await vehiclesAPI({
      page: 2,
      limit: 20,
      status: "maintenance",
      search: "BIKE-001",
      device_id: "LOCK-123",
      connectivity: "online",
      operation_company_uuid: "company-uuid",
      order_by: "asc",
    });

    expect(serviceMocks.baseAPI).toHaveBeenCalledWith(
      "GET",
      "/vehicles?page=2&limit=20&status=maintenance&order_by=asc&search=BIKE-001&operation_company_uuid=company-uuid&device_id=LOCK-123&connectivity=online",
    );
    expect(response.analysis).toEqual({
      total: 100,
      active: 50,
      in_use: 20,
      maintenance: 10,
      stopped: 5,
    });
  });

  it("omits inactive optional filters", async () => {
    await vehiclesAPI({ page: 1, limit: 15 });

    expect(serviceMocks.baseAPI).toHaveBeenCalledWith(
      "GET",
      "/vehicles?page=1&limit=15",
    );
  });
});
