import { describe, expect, it } from "vitest";

import { getPaymentMethodStatisticItems } from "@/components/panel/payment-methods/statistics";

describe("payment method statistics", () => {
  it("maps the current checkout-context statistics", () => {
    const items = getPaymentMethodStatisticItems({
      statistics: {
        total: 8,
        active: 6,
        inactive: 2,
        available_for_orders: 5,
        available_for_subscriptions: 3,
      },
    });

    expect(items.map(({ key, value }) => [key, value])).toEqual([
      ["total", 8],
      ["active", 6],
      ["inactive", 2],
      ["orders", 5],
      ["subscriptions", 3],
    ]);
  });

  it("supports the superseded analysis response without changing write semantics", () => {
    const items = getPaymentMethodStatisticItems({
      analysis: {
        total: 3,
        active: 2,
        inactive: 1,
        merchant: 2,
        driver: 1,
      },
    });

    expect(items.slice(-2)).toEqual([
      { key: "merchant", label: "بوابات متاحة للتجار", value: 2 },
      { key: "driver", label: "بوابات متاحة للسائقين", value: 1 },
    ]);
  });

  it("keeps current statistics authoritative when both shapes are returned", () => {
    const items = getPaymentMethodStatisticItems({
      statistics: {
        total: 4,
        active: 4,
        inactive: 0,
        available_for_orders: 4,
        available_for_subscriptions: 2,
      },
      analysis: {
        total: 99,
        active: 99,
        inactive: 0,
        merchant: 99,
        driver: 99,
      },
    });

    expect(items.map((item) => item.key)).toContain("orders");
    expect(items.map((item) => item.key)).not.toContain("merchant");
    expect(items[0]?.value).toBe(4);
  });
});
