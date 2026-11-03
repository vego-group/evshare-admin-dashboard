import { beforeEach, describe, expect, it, vi } from "vitest";

const serviceMocks = vi.hoisted(() => ({
  baseAPI: vi.fn(),
  safeApi: vi.fn(),
}));

vi.mock("@/services", () => serviceMocks);

import { getShipmentDefaultValues } from "@/components/panel/shipments/modals/shipment-form-utils";
import { getShipmentCreateBlockReason } from "@/components/panel/orders/order-details/order-shipments-section";
import {
  buildAddShipmentPayload,
  buildChangedShipmentPayload,
} from "@/components/panel/shipments/modals/shipment-payload-utils";
import {
  isShipmentDeletable,
  isShipmentFinal,
} from "@/components/panel/shipments/results/shipment-status-rules";
import {
  addShipmentForOrder,
  cancelShipment,
  deleteShipment,
  editShipment,
  updateShipmentStatus,
} from "@/services/mutations/shipments";
import {
  orderShipmentsAPI,
  shipmentsAPI,
  singleShipmentAPI,
} from "@/services/queries/shipments";
import type { ShipmentListItem } from "@/types";

describe("shipments dashboard contract", () => {
  beforeEach(() => {
    serviceMocks.baseAPI.mockReset().mockResolvedValue({ data: [] });
    serviceMocks.safeApi.mockReset().mockResolvedValue({ ok: true });
  });

  it("uses only the documented shipment list filters", async () => {
    await shipmentsAPI({
      page: 2,
      limit: 25,
      search: "AWB-42",
      status: "in_transit",
      direction: "forward",
      shipping_company_uuid: "company-id",
      order_uuid: "order-id",
      order_by: "asc",
    });

    expect(serviceMocks.baseAPI).toHaveBeenCalledWith(
      "GET",
      "/shipments?page=2&limit=25&search=AWB-42&status=in_transit&direction=forward&shipping_company_uuid=company-id&order_uuid=order-id&order_by=asc",
    );
  });

  it("uses the documented list and detail endpoints for an order", async () => {
    await orderShipmentsAPI("order-id", 200);
    await singleShipmentAPI("shipment-id");

    expect(serviceMocks.baseAPI.mock.calls).toEqual([
      ["GET", "/orders/order-id/shipments?limit=200"],
      ["GET", "/shipments/shipment-id"],
    ]);
  });

  it("uses every documented shipment mutation endpoint", async () => {
    await addShipmentForOrder("order-id", { package_count: 1 });
    await editShipment("shipment-id", { tracking_id: "TRACK-1" });
    await updateShipmentStatus("shipment-id", {
      status: "out_for_delivery",
      description: "Driver ETA 14:00",
    });
    await cancelShipment("shipment-id", { reason: "Carrier rejected parcel" });
    await deleteShipment("shipment-id");

    expect(serviceMocks.safeApi.mock.calls).toEqual([
      ["POST", "/orders/order-id/shipments/add", { package_count: 1 }],
      ["POST", "/shipments/shipment-id/edit", { tracking_id: "TRACK-1" }],
      [
        "POST",
        "/shipments/shipment-id/status",
        { status: "out_for_delivery", description: "Driver ETA 14:00" },
      ],
      [
        "POST",
        "/shipments/shipment-id/cancel",
        { reason: "Carrier rejected parcel" },
      ],
      ["DELETE", "/shipments/shipment-id/delete"],
    ]);
  });

  it("keeps the order id in the endpoint and omits blank optional create fields", () => {
    const values = getShipmentDefaultValues("SAR", "order-id");
    const payload = buildAddShipmentPayload(values);

    expect(values.order_uuid).toBe("order-id");
    expect(payload).toEqual({
      picking_type: "PICKUP_BY_DC",
      currency: "SAR",
    });
    expect(payload).not.toHaveProperty("order_uuid");
  });

  it("sends only editable dirty fields and excludes create-only snapshots", () => {
    const values = {
      ...getShipmentDefaultValues("SAR", "order-id"),
      tracking_id: "TRACK-2",
      declared_value: 900,
      recipient_name: "Customer",
    };

    const payload = buildChangedShipmentPayload(
      values,
      {
        tracking_id: true,
        declared_value: true,
        recipient_name: true,
      },
      "SA",
    );

    expect(payload).toEqual({ tracking_id: "TRACK-2" });
  });

  it("freezes terminal shipments and restricts deletion to pending or cancelled", () => {
    expect(isShipmentFinal("delivered")).toBe(true);
    expect(isShipmentFinal("returned")).toBe(true);
    expect(isShipmentFinal("cancelled")).toBe(true);
    expect(isShipmentFinal("lost")).toBe(true);
    expect(isShipmentFinal("in_transit")).toBe(false);

    expect(isShipmentDeletable("pending")).toBe(true);
    expect(isShipmentDeletable("cancelled")).toBe(true);
    expect(isShipmentDeletable("created")).toBe(false);
    expect(isShipmentDeletable("delivered")).toBe(false);
  });

  it("prevents shipment creation for the documented order business rules", () => {
    const forward = (status: ShipmentListItem["status"]) =>
      ({ direction: "forward", status }) as ShipmentListItem;

    expect(
      getShipmentCreateBlockReason({
        hasAddress: false,
        orderStatus: "pending",
        shipments: [],
      }),
    ).toContain("عنوان");
    expect(
      getShipmentCreateBlockReason({
        hasAddress: true,
        orderStatus: "cancelled",
        shipments: [],
      }),
    ).toContain("ملغى");
    expect(
      getShipmentCreateBlockReason({
        hasAddress: true,
        orderStatus: "preparing",
        shipments: [forward("created")],
      }),
    ).toContain("شحنة أمامية");
    expect(
      getShipmentCreateBlockReason({
        hasAddress: true,
        orderStatus: "preparing",
        shipments: [forward("cancelled")],
      }),
    ).toBeNull();
  });
});
