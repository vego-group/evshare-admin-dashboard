import type { OrderNewStatus } from "@/types";

/**
 * The dashboard only drives the paid-order fulfilment path one step at a time.
 * `delivered` is created automatically after payment and `completed` is
 * created by receipt/refund side effects, so neither is exposed as an
 * arbitrary manual destination.
 */
const NEXT_ORDER_STATUS: Partial<Record<OrderNewStatus, OrderNewStatus>> = {
  pending: "preparing",
  preparing: "ready",
};

export function getOrderStatusActions(
  currentStatus: OrderNewStatus,
): OrderNewStatus[] {
  if (
    currentStatus === "delivered" ||
    currentStatus === "completed" ||
    currentStatus === "cancelled"
  ) {
    return [];
  }

  const nextStatus = NEXT_ORDER_STATUS[currentStatus];
  return nextStatus ? [nextStatus, "cancelled"] : ["cancelled"];
}

export function isClientSideOrderStatusFilter(status?: OrderNewStatus) {
  return status === "delivered";
}
