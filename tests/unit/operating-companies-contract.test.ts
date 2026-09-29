import { beforeEach, describe, expect, it, vi } from "vitest";

import { SETTINGS_CATALOG, validateSettingValue } from "@/lib/settings-catalog";
import type { Setting } from "@/types";
import { operatingCompaniesAPI } from "@/services/queries/operating-companies";
import { baseAPI } from "@/services";

vi.mock("@/services", () => ({ baseAPI: vi.fn() }));

describe("operating company status contract", () => {
  beforeEach(() => {
    vi.mocked(baseAPI).mockReset();
  });

  it.each([
    ["active", "status=active"],
    ["inactive", "status=inactive"],
  ] as const)("maps the %s status filter to the API query", async (value, query) => {
    vi.mocked(baseAPI).mockResolvedValue({
      error: false,
      message: "ok",
      data: [],
    });

    await operatingCompaniesAPI({ page: 1, limit: 15, status: value });

    expect(baseAPI).toHaveBeenCalledWith(
      "GET",
      expect.stringContaining(query),
    );
  });

});

describe("operating_enabled setting contract", () => {
  const setting = {
    id: "setting-id",
    setting_name: "operating_enabled",
    setting_value: "1",
    setting_label: "تفعيل شركات التشغيل",
  } as Setting;

  it("is catalogued as a tenant boolean owned by Commerce", () => {
    expect(SETTINGS_CATALOG.operating_enabled).toEqual({
      type: "boolean",
      owner: "Commerce",
      scope: "tenant",
    });
  });

  it.each(["0", "1", "true", "false"])("accepts %s", (value) => {
    expect(validateSettingValue(setting, value)).toBeNull();
  });

  it.each(["yes", "2"])("rejects %s", (value) => {
    expect(validateSettingValue(setting, value)).not.toBeNull();
  });
});
