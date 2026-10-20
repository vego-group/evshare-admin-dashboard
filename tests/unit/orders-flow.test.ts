import { beforeEach, describe, expect, it, vi } from "vitest";

const serviceMocks = vi.hoisted(() => ({ baseAPI: vi.fn(), safeApi: vi.fn() }));
vi.mock("@/services", () => serviceMocks);

import { getOrderStatusActions } from "@/lib/orders";
import { orderReceiptReviewSchema, resolveOrderRefundSchema } from "@/schemas/orders";
import {
  deleteOrderAPI,
  resolveOrderReceiptRefundAPI,
  reviewOrderReceiptAPI,
  updateOrderStatusAPI,
} from "@/services/mutations/orders";
import { ordersAPI } from "@/services/queries/orders";
import type { OrdersListResponse } from "@/types";

function response(
  statuses: Array<"pending" | "preparing" | "ready" | "delivered">,
  page = 1,
  lastPage = 1,
): OrdersListResponse {
  return {
    error: false,
    message: "",
    data: statuses.map((status, index) => ({
      id: `${page}-${index}`,
      status,
    })) as OrdersListResponse["data"],
    meta: {
      currentPage: page,
      lastPage,
      perPage: 200,
      total: statuses.length,
    },
    analytics: { total: 4, new: 4, completed: 0, cancelled: 0 },
  };
}

describe("order lifecycle contract", () => {
  beforeEach(() => {
    serviceMocks.baseAPI.mockReset();
    serviceMocks.safeApi.mockReset().mockResolvedValue({ ok: true });
  });

  it("only exposes the next fulfilment step and cancellation", () => {
    expect(getOrderStatusActions("pending")).toEqual(["preparing", "cancelled"]);
    expect(getOrderStatusActions("preparing")).toEqual(["ready", "cancelled"]);
    expect(getOrderStatusActions("ready")).toEqual(["delivered", "cancelled"]);
    expect(getOrderStatusActions("delivered")).toEqual(["cancelled"]);
    expect(getOrderStatusActions("completed")).toEqual([]);
    expect(getOrderStatusActions("cancelled")).toEqual([]);
  });

  it("never sends the unsupported delivered status filter to the API", async () => {
    serviceMocks.baseAPI
      .mockResolvedValueOnce(response(["pending", "delivered"], 1, 2))
      .mockResolvedValueOnce(response(["delivered", "ready"], 2, 2));

    const result = await ordersAPI({
      page: "1",
      limit: "20",
      status_category: "new",
      status: "delivered",
    });

    expect(serviceMocks.baseAPI).toHaveBeenNthCalledWith(
      1,
      "GET",
      "/orders?page=1&limit=200&status_category=new",
    );
    expect(serviceMocks.baseAPI).toHaveBeenNthCalledWith(
      2,
      "GET",
      "/orders?page=2&limit=200&status_category=new",
    );
    expect(result.data.map((order) => order.status)).toEqual([
      "delivered",
      "delivered",
    ]);
    expect(result.meta).toMatchObject({ total: 2, currentPage: 1, perPage: 20 });
  });

  it("uses the documented status and delete endpoints", async () => {
    await updateOrderStatusAPI("order-id", "preparing");
    await deleteOrderAPI("order-id");

    expect(serviceMocks.safeApi).toHaveBeenNthCalledWith(
      1,
      "POST",
      "/orders/order-id/status",
      { status: "preparing" },
    );
    expect(serviceMocks.safeApi).toHaveBeenNthCalledWith(
      2,
      "DELETE",
      "/orders/order-id/delete",
    );
  });

  it("uses the documented receipt review and refund endpoints", async () => {
    await reviewOrderReceiptAPI("order-id", {
      status: "rejected",
      rejection_reason: "Missing signature",
    });
    await resolveOrderReceiptRefundAPI(
      "order-id",
      "item-id",
      { method: "wallet", amount: 500 },
      "request-id",
    );

    expect(serviceMocks.safeApi).toHaveBeenNthCalledWith(
      1,
      "POST",
      "/orders/order-id/receipt/review",
      { status: "rejected", rejection_reason: "Missing signature" },
    );
    expect(serviceMocks.safeApi).toHaveBeenNthCalledWith(
      2,
      "POST",
      "/orders/order-id/receipt/items/item-id/resolve-refund",
      { method: "wallet", amount: 500 },
      { headers: { "Idempotency-Key": "request-id" } },
    );
  });

  it("requires rejection reasons, caps them, and keeps refund notes optional", () => {
    expect(
      orderReceiptReviewSchema.safeParse({ status: "rejected", rejection_reason: "" })
        .success,
    ).toBe(false);
    expect(
      orderReceiptReviewSchema.safeParse({
        status: "rejected",
        rejection_reason: "x".repeat(1001),
      }).success,
    ).toBe(false);
    expect(
      resolveOrderRefundSchema.safeParse({
        method: "wallet",
        amount: 100,
        confirmed: true,
      }).success,
    ).toBe(true);
  });
});
