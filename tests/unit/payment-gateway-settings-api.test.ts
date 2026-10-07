import { beforeEach, describe, expect, it, vi } from "vitest";

const serviceMocks = vi.hoisted(() => ({ baseAPI: vi.fn(), safeApi: vi.fn() }));
vi.mock("@/services", () => serviceMocks);

import { paymentGatewaysAPI, singlePaymentGatewayAPI } from "@/services/queries/payment-gateways";
import { editPaymentGateway } from "@/services/mutations/payment-gateways";

describe("payment gateway settings API contract", () => {
  beforeEach(() => {
    serviceMocks.baseAPI.mockReset().mockResolvedValue({ data: [] });
    serviceMocks.safeApi.mockReset().mockResolvedValue({ ok: true });
  });

  it("lists and loads gateways from their dedicated endpoints", async () => {
    await paymentGatewaysAPI({ page: 1, per_page: 20, search: "moyasar", is_active: true });
    expect(serviceMocks.baseAPI).toHaveBeenCalledWith("GET", "/payment-gateways?page=1&per_page=20&search=moyasar&is_active=true");
    await singlePaymentGatewayAPI("gateway-id");
    expect(serviceMocks.baseAPI).toHaveBeenLastCalledWith("GET", "/payment-gateways/gateway-id");
  });

  it("updates gateway configuration without involving payment methods", async () => {
    const payload = { is_default: true, credentials: { webhook_secret: "new-secret" } };
    await editPaymentGateway("gateway-id", payload);
    expect(serviceMocks.safeApi).toHaveBeenCalledWith("POST", "/payment-gateways/gateway-id/edit", payload);
  });
});
