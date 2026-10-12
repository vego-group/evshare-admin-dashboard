import { describe, expect, it } from "vitest";

import {
  formatRemaining,
  nonZeroEntries,
  planWarnings,
} from "@/components/panel/data-cleanups/utils";

describe("data-cleanup dashboard helpers", () => {
  it("accepts [] for empty dynamic objects returned by the API", () => {
    expect(nonZeroEntries([])).toEqual([]);
    expect(nonZeroEntries({ order_items: 2, refunds: 0 })).toEqual([
      ["order_items", 2],
    ]);
  });

  it("builds the approved KYC warning from the preview plan", () => {
    expect(
      planWarnings("registration_requests", {
        table: "kycs",
        total: 4,
        to_delete: 2,
        to_keep: 2,
        dependents: [],
        dangling_kept: [],
        notes: { approved_kycs_deleted: 1, users_left_unverified: 1 },
      }),
    ).toEqual([
      "سيتم حذف 1 طلب تسجيل معتمد، وسيصبح 1 تاجر غير موثّق.",
    ]);
  });

  it("formats the preview expiration countdown", () => {
    expect(formatRemaining("2026-10-12T12:30:00.000Z", Date.parse("2026-10-12T12:28:29.000Z"))).toBe("01:31");
    expect(formatRemaining("2026-10-12T12:30:00.000Z", Date.parse("2026-10-12T12:30:01.000Z"))).toBe("منتهية");
  });
});
