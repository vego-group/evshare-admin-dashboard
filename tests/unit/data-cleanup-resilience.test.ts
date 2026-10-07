import { describe, expect, it } from "vitest";

import { describePayable } from "@/components/panel/payment-operations/utils";

describe("data-cleanup relationship resilience", () => {
  it("presents a retained payment operation without its deleted order", () => {
    expect(describePayable(null)).toEqual({
      type: "المرجع غير متاح",
      identifier: "-",
      isMissing: true,
    });
  });

  it("preserves an available payment reference", () => {
    expect(
      describePayable({ type: "order", id: 42, uuid: "order-uuid" }),
    ).toEqual({
      type: "طلب",
      identifier: "order-uuid",
      isMissing: false,
    });
  });
});
