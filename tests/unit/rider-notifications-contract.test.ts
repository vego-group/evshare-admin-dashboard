import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const root = process.cwd();
const read = (path: string) => readFileSync(join(root, path), "utf8");

describe("rider notifications admin contract", () => {
  it("keeps the low-balance event wired to the documented setting", () => {
    expect(read("src/types/driver-pricing-settings.ts")).toContain(
      '"wallet_low_balance_threshold"',
    );
    expect(read("src/components/panel/driver-pricing-settings/config.ts")).toContain(
      "يرسل الخادم إشعاراً تلقائياً للسائق",
    );
  });

  it("explains that the user preference controls push delivery, not storage", () => {
    const editModal = read("src/components/panel/users/modals/user-edit-modal.tsx");

    expect(editModal).toContain("إشعارات الدفع مفعلة");
    expect(editModal).toContain("وتبقى الإشعارات محفوظة");
  });

  it("does not add an unsupported rider-notifications API", () => {
    expect(read("docs/rider-notifications-integration.md")).toContain(
      "There is currently no admin endpoint",
    );
  });
});
