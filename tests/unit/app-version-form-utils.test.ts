import { describe, expect, it } from "vitest";

import {
  createAppVersionFormResolver,
  getLatestVersionCodeErrorMessage,
  getLatestVersionErrorMessage,
} from "@/components/panel/app-versions/modals/app-version-form-utils";

describe("app version latest-value validation", () => {
  it("does not crash when an app target has no latest version yet", () => {
    const latestValues = { version: null, version_code: null };

    expect(getLatestVersionErrorMessage("1.0.0", latestValues)).toBeUndefined();
    expect(getLatestVersionCodeErrorMessage(1, latestValues)).toBeUndefined();
  });

  it("allows the resolver to validate a first release with null latest values", async () => {
    const resolver = createAppVersionFormResolver({
      latestValues: { version: null, version_code: null },
    });
    const values = {
      type: "merchant" as const,
      platform: "android" as const,
      version: "1.0.0",
      version_code: 1,
      is_critical: false,
      status: "draft" as const,
      release_notes_en: "",
      release_notes_ar: "",
    };

    const result = await resolver(values, undefined, {} as never);

    expect(result.errors).toEqual({});
    expect(result.values).toMatchObject(values);
  });

  it("still rejects values that are not newer than an existing release", () => {
    const latestValues = { version: "2.1.0", version_code: 21 };

    expect(getLatestVersionErrorMessage("2.0.0", latestValues)).toContain(
      "2.1.0",
    );
    expect(getLatestVersionCodeErrorMessage(20, latestValues)).toContain(
      "21",
    );
  });
});
