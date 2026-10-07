import { beforeEach, describe, expect, it, vi } from "vitest";

const serviceMocks = vi.hoisted(() => ({ baseAPI: vi.fn(), safeApi: vi.fn() }));
vi.mock("@/services", () => serviceMocks);

import { paymentMethodsAPI } from "@/services/queries/payment-methods";
import { editPaymentMethod } from "@/services/mutations/payment-methods";

describe("payment methods API contract", () => {
  beforeEach(() => {
    serviceMocks.baseAPI.mockReset().mockResolvedValue({ data: [] });
    serviceMocks.safeApi.mockReset().mockResolvedValue({ ok: true });
  });

  it("uses the current status, availability and per-page filters", async () => {
    await paymentMethodsAPI({ page: 2, per_page: 25, search: "visa", status: "active", available_for: "orders" });
    expect(serviceMocks.baseAPI).toHaveBeenCalledWith("GET", "/payment-methods?page=2&per_page=25&search=visa&status=active&available_for=orders");
  });

  it("omits all filters and updates through the canonical PUT endpoint", async () => {
    await paymentMethodsAPI({ page: 1, status: "all", available_for: "all" });
    expect(serviceMocks.baseAPI).toHaveBeenCalledWith("GET", "/payment-methods?page=1&per_page=10");
    await editPaymentMethod("method-id", { is_active: false, available_for: ["orders"] });
    expect(serviceMocks.safeApi).toHaveBeenCalledWith("PUT", "/payment-methods/method-id", { is_active: false, available_for: ["orders"] });
  });
});
