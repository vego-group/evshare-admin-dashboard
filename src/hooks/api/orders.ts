import { orderReceiptAPI, ordersAPI, singleOrderAPI } from "@/services/queries";
import { useCustomQuery } from "..";
import { OrderQueryParams } from "@/types";

export function useOrders(params: OrderQueryParams) {
  return useCustomQuery(["orders", params], async () => ordersAPI(params));
}

export function useOrder(orderId: string | null) {
  return useCustomQuery(
    ["order ", orderId],
    async () => singleOrderAPI(orderId!),
    { enabled: Boolean(orderId) },
  );
}

export function useOrderReceipt(orderId: string | null, enabled = true) {
  return useCustomQuery(
    ["order-receipt", orderId],
    async () => orderReceiptAPI(orderId!),
    { enabled: Boolean(orderId) && enabled, retry: false },
  );
}
