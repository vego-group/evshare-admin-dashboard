import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  buildChangedOperatingCompanyPayload,
} from "@/components/panel/operating-companies/modals/operating-company-form-utils";
import { SETTINGS_CATALOG, validateSettingValue } from "@/lib/settings-catalog";
import type { OperatingCompanyFormValues } from "@/schemas/operating-companies";
import type { Setting } from "@/types";
import { operatingCompaniesAPI } from "@/services/queries/operating-companies";
import { baseAPI } from "@/services";

vi.mock("@/services", () => ({ baseAPI: vi.fn() }));

describe("operating company visibility contract", () => {
  beforeEach(() => {
    vi.mocked(baseAPI).mockReset();
  });

  it.each([
    [true, "1"],
    [false, "0"],
  ])("serializes show_in_app=%s as %s", (showInApp, expected) => {
    const values: OperatingCompanyFormValues = { show_in_app: showInApp };
    const payload = buildChangedOperatingCompanyPayload(
      values,
      { show_in_app: true },
      "sa",
    );

    expect(payload.get("show_in_app")).toBe(expected);
  });

  it("does not send visibility when it was not edited", () => {
    const payload = buildChangedOperatingCompanyPayload(
      { show_in_app: false },
      {},
      "sa",
    );

    expect(payload.has("show_in_app")).toBe(false);
  });

  it.each([
    [true, "show_in_app=1"],
    [false, "show_in_app=0"],
  ])("maps the visibility filter %s to the API query", async (value, query) => {
    vi.mocked(baseAPI).mockResolvedValue({
      error: false,
      message: "ok",
      data: [],
    });

    await operatingCompaniesAPI({ page: 1, limit: 15, show_in_app: value });

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
