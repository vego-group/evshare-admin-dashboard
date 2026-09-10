import { orderReceiptAPI, ordersAPI, singleOrderAPI } from "@/services/queries";
import { useCustomQuery } from "..";
import { OrderQueryParams } from "@/types";
import { orderOperatingContractAPI } from "@/services/queries/orders";

export function useOrderOperatingContract(orderId: string, enabled: boolean) {
  return useCustomQuery(
    ["order-operating-contract", orderId],
    () => orderOperatingContractAPI(orderId),
    { enabled, retry: false },
  );
}

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
