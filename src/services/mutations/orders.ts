"use server";

import { safeApi } from "..";
import type {
  OrderNewStatus,
  ResolveOrderRefundPayload,
  ReviewOrderReceiptPayload,
  ReviewOrderOperatingContractPayload,
} from "@/types";

export const reviewOrderOperatingContractAPI = async (
  orderId: string,
  payload: ReviewOrderOperatingContractPayload,
) => await safeApi("POST", `/orders/${orderId}/operating-contract/review`, payload);

export const updateOrderStatusAPI = async (
  orderId: string,
  status: OrderNewStatus,
) => await safeApi("POST", `/orders/${orderId}/status`, { status });

export const reviewOrderReceiptAPI = async (
  orderId: string,
  payload: ReviewOrderReceiptPayload,
) => await safeApi("POST", `/orders/${orderId}/receipt/review`, payload);

export const resolveOrderReceiptRefundAPI = async (
  orderId: string,
  itemId: string,
  payload: ResolveOrderRefundPayload,
) =>
  await safeApi(
    "POST",
    `/orders/${orderId}/receipt/items/${itemId}/resolve-refund`,
    payload,
  );
