import { describe, expect, it } from "vitest";

import { isTripWalletReference } from "@/components/panel/wallet/utils";

describe("wallet trip references", () => {
  it.each([
    "trip",
    "Trip",
    "App\\Models\\Trip",
    "Domain/Mobility/Trip",
  ])("recognizes %s as a trip morph reference", (type) => {
    expect(isTripWalletReference(type)).toBe(true);
  });

  it.each([undefined, null, "order", "App\\Models\\PaymentRequest"])(
    "does not treat %s as a trip reference",
    (type) => {
      expect(isTripWalletReference(type)).toBe(false);
    },
  );
});
