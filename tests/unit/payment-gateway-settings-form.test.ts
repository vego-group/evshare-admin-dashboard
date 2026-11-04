import { describe, expect, it } from "vitest";

import type { PaymentGateway } from "@/types";
import {
  buildPaymentGatewayPayload,
  credentialKeys,
  toGatewayDraft,
} from "@/components/panel/payment-gateways/utils";

const gateway: PaymentGateway = {
  id: "gateway-id",
  key: "moyasar",
  name: "Moyasar",
  name_ar: "ميسر",
  name_en: "Moyasar",
  is_active: true,
  is_default: true,
  supported_currencies: ["SAR"],
  allowed_user_types: ["merchant", "driver"],
  credentials: { secret_key: "••••7890", webhook_secret: "••••a1b2" },
  config: { base_url: "https://api.moyasar.com/v1" },
  payment_methods_count: 4,
  created_at: "2026-06-24 10:00:00",
};

describe("payment gateway settings form", () => {
  it("does not resend unchanged or masked settings", () => {
    expect(buildPaymentGatewayPayload(gateway, toGatewayDraft(gateway), {})).toEqual({});
  });

  it("sends only changed settings and explicitly changed credentials", () => {
    const draft = {
      ...toGatewayDraft(gateway),
      is_active: false,
      is_default: false,
      supported_currencies: "sar, JOD, SAR",
    };

    expect(
      buildPaymentGatewayPayload(gateway, draft, { webhook_secret: "whsec_new" }),
    ).toEqual({
      is_active: false,
      is_default: false,
      supported_currencies: ["SAR", "JOD"],
      credentials: { webhook_secret: "whsec_new" },
    });
  });

  it("keeps provider-specific credential fields available", () => {
    const customGateway = {
      ...gateway,
      credentials: { merchant_token: "••••1234" },
    };

    expect(credentialKeys(customGateway)).toEqual([
      "secret_key",
      "webhook_secret",
      "merchant_token",
    ]);
  });

  it("rejects non-object advanced configuration", () => {
    expect(() =>
      buildPaymentGatewayPayload(gateway, { ...toGatewayDraft(gateway), config: "[]" }, {}),
    ).toThrow("INVALID_CONFIG");
  });
});
