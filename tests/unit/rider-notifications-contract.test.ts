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

  it("keeps automatic events separate from manual marketing communications", () => {
    const communications = read("src/components/panel/communications/index.tsx");

    expect(communications).toContain("هذه الصفحة للرسائل التسويقية التي يرسلها المشرف فقط");
    expect(communications).toContain("ينشئها الخادم تلقائياً");
    expect(communications).toContain("لا تظهر في هذا السجل");
  });

  it("warns that removing a rider also removes registered devices", () => {
    expect(
      read("src/components/panel/users/modals/user-delete-confirm-modal.tsx"),
    ).toContain("وحذف أجهزته المسجلة");
  });
});
