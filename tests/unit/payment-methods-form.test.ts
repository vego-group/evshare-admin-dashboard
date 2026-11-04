import { describe, expect, it } from "vitest";

import {
  buildChangedPaymentMethodPayload,
  hasPaymentMethodChanges,
  paymentMethodResolver,
} from "@/components/panel/payment-methods/form/utils";

describe("payment method edit form", () => {
  const validValues = {
    name_ar: "فيزا",
    name_en: "Visa",
    is_active: true,
    available_for: ["orders", "subscriptions"] as const,
  };

  it("requires at least one checkout context", async () => {
    const result = await paymentMethodResolver(
      { ...validValues, available_for: [] },
      undefined,
      {} as never,
    );

    expect(result.errors.available_for?.message).toBeTruthy();
  });

  it("sends only fields changed by the administrator", () => {
    const payload = buildChangedPaymentMethodPayload(
      { ...validValues, available_for: [...validValues.available_for] },
      { is_active: true, available_for: [true] },
    );

    expect(payload).toEqual({
      is_active: true,
      available_for: ["orders", "subscriptions"],
    });
    expect(hasPaymentMethodChanges(payload)).toBe(true);
    expect(hasPaymentMethodChanges({})).toBe(false);
  });
});
