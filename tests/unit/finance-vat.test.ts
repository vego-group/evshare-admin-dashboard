import { beforeEach, describe, expect, it, vi } from "vitest";

const serviceMocks = vi.hoisted(() => ({ baseAPI: vi.fn() }));
vi.mock("@/services", () => serviceMocks);

import {
  vatExportStatusAPI,
  vatExportsAPI,
  vatPeriodsAPI,
  vatRecordsAPI,
  vatSettlementsAPI,
  vatSummaryAPI,
} from "@/services/queries/finance";
import { vatSettlementSchema } from "@/schemas/finance";

describe("VAT finance API contract", () => {
  beforeEach(() => {
    serviceMocks.baseAPI.mockReset();
    serviceMocks.baseAPI.mockResolvedValue({ data: [] });
  });

  it("forwards shared filters to summary, records, and periods", async () => {
    const filters = {
      date_from: "2026-01-01",
      date_to: "2026-03-31",
      status: "partially_paid" as const,
      period: "2026-02",
      currency: "SAR",
    };

    await vatSummaryAPI(filters);
    expect(serviceMocks.baseAPI).toHaveBeenLastCalledWith(
      "GET",
      "/finance/vat/summary?date_from=2026-01-01&date_to=2026-03-31&status=partially_paid&period=2026-02&currency=SAR",
    );

    await vatRecordsAPI({ ...filters, page: 2, limit: 10 });
    expect(serviceMocks.baseAPI).toHaveBeenLastCalledWith(
      "GET",
      "/finance/vat?date_from=2026-01-01&date_to=2026-03-31&status=partially_paid&period=2026-02&page=2&limit=10&currency=SAR",
    );

    await vatPeriodsAPI(filters);
    expect(serviceMocks.baseAPI).toHaveBeenLastCalledWith(
      "GET",
      "/finance/vat/periods?date_from=2026-01-01&date_to=2026-03-31&status=partially_paid&period=2026-02&currency=SAR",
    );
  });

  it("uses settlement dates and independent pagination", async () => {
    await vatSettlementsAPI({
      period: "2026-06",
      date_from: "2026-07-01",
      date_to: "2026-07-31",
      page: 3,
      limit: 10,
    });

    expect(serviceMocks.baseAPI).toHaveBeenCalledWith(
      "GET",
      "/finance/vat/settlements?period=2026-06&date_from=2026-07-01&date_to=2026-07-31&page=3&limit=10",
    );
  });

  it("lists exports with supported filters and safely encodes status ids", async () => {
    await vatExportsAPI({
      type: "vat_settlements",
      status: "completed",
      limit: 20,
    });
    expect(serviceMocks.baseAPI).toHaveBeenLastCalledWith(
      "GET",
      "/finance/vat/exports?type=vat_settlements&status=completed&limit=20",
    );

    await vatExportStatusAPI("export id/with spaces");
    expect(serviceMocks.baseAPI).toHaveBeenLastCalledWith(
      "GET",
      "/finance/vat/exports/export%20id%2Fwith%20spaces",
    );
  });
});

describe("VAT settlement validation", () => {
  it("accepts a valid partial settlement", () => {
    expect(
      vatSettlementSchema.safeParse({
        period: "2026-06",
        amount: "300",
        paid_at: "2026-07-20",
        notes: "ZATCA June return",
      }).success,
    ).toBe(true);
  });

  it("rejects invalid periods, dates, and non-positive amounts", () => {
    expect(
      vatSettlementSchema.safeParse({
        period: "2026-13",
        amount: 0,
        paid_at: "20 July 2026",
      }).success,
    ).toBe(false);
  });
});
