import { describe, expect, it } from "vitest";

import { featureFlagSchema } from "@/schemas/feature-flags";
import { shipmentAddSchema, type ShipmentFormValues } from "@/schemas/shipments";
import { buildAddShipmentPayload } from "@/components/panel/shipments/modals/shipment-payload-utils";

const featureFlag = {
  key: "enable_new_dashboard",
  name_ar: "لوحة التحكم الجديدة",
  name_en: "New dashboard",
  is_active: true,
  default_value: false,
  audience: "admin" as const,
  platforms: ["web" as const],
  min_app_version: undefined,
  max_app_version: 122,
  starts_at: "",
  ends_at: "",
};

describe("admin API contracts", () => {
  it("accepts web targeting and a max-only feature-flag bound", () => {
    expect(featureFlagSchema.safeParse(featureFlag).success).toBe(true);
    expect(featureFlagSchema.safeParse({
      ...featureFlag,
      min_app_version: 123,
      max_app_version: 122,
    }).success).toBe(false);
  });

  it("requires sender coordinates as a pair", () => {
    const base = { order_uuid: "order-1", picking_type: "PICKUP_BY_DC" as const };
    expect(shipmentAddSchema.safeParse({ ...base, sender_latitude: 24.8 }).success).toBe(false);
    expect(shipmentAddSchema.safeParse({
      ...base,
      sender_latitude: 24.8,
      sender_longitude: 46.6,
    }).success).toBe(true);
  });

  it("maps create-only shipment party snapshots into the API payload", () => {
    const values = {
      order_uuid: "order-1",
      picking_type: "PICKUP_BY_DC",
      recipient_name: "Ahmed Ali",
      recipient_city_uuid: "city-1",
      sender_latitude: 24.8,
      sender_longitude: 46.6,
    } as ShipmentFormValues;
    expect(buildAddShipmentPayload(values)).toMatchObject({
      recipient_name: "Ahmed Ali",
      recipient_city_uuid: "city-1",
      sender_latitude: 24.8,
      sender_longitude: 46.6,
    });
  });
});
