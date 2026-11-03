import { describe, expect, it } from "vitest";

import {
  getSubscriptionDiscountFieldErrors,
  toSubscriptionDiscountInputDate,
  toSubscriptionDiscountPayload,
} from "@/components/panel/subscription-discounts/utils";
import { subscriptionDiscountSchema } from "@/schemas";

describe("subscription discount integration", () => {
  it("accepts a one-day discount period", () => {
    const result = subscriptionDiscountSchema.safeParse({
      type: "percentage",
      value: 25,
      is_active: true,
      start_date: "2026-11-03",
      end_date: "2026-11-03",
      name_ar: "عرض اليوم",
      name_en: "Day offer",
    });

    expect(result.success).toBe(true);
  });

  it("enforces the percentage range and chronological dates", () => {
    const result = subscriptionDiscountSchema.safeParse({
      type: "percentage",
      value: 101,
      is_active: false,
      start_date: "2026-11-04",
      end_date: "2026-11-03",
      name_ar: "",
      name_en: "",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.map((issue) => issue.path[0])).toEqual(
        expect.arrayContaining(["value", "end_date"]),
      );
    }
  });

  it("sends inclusive API datetimes for calendar dates", () => {
    expect(
      toSubscriptionDiscountPayload({
        type: "fixed",
        value: 100,
        is_active: true,
        start_date: "2026-09-01",
        end_date: "2026-09-30",
        name_ar: "",
        name_en: "September offer",
      }),
    ).toEqual({
      type: "fixed",
      value: 100,
      is_active: true,
      start_date: "2026-09-01 00:00:00",
      end_date: "2026-09-30 23:59:59",
      name_ar: null,
      name_en: "September offer",
    });
  });

  it("maps supported backend validation fields only", () => {
    expect(
      getSubscriptionDiscountFieldErrors({
        errors: {
          value: ["القيمة غير صالحة"],
          end_date: ["تاريخ الانتهاء غير صالح"],
          unexpected: ["ignore me"],
        } as never,
      }),
    ).toEqual({
      value: "القيمة غير صالحة",
      end_date: "تاريخ الانتهاء غير صالح",
    });
  });

  it("extracts a calendar date from an API datetime", () => {
    expect(toSubscriptionDiscountInputDate("2026-09-30 23:59:59")).toBe(
      "2026-09-30",
    );
    expect(toSubscriptionDiscountInputDate(null)).toBe("");
  });
});
