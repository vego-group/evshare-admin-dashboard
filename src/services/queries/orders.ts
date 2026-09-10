import { baseAPI } from "..";
import type { OrderOperatingContractResponse } from "@/types";
import { buildQuery } from "@/lib/utils/build-query";
import {
  OrderDetailResponse,
  OrderQueryParams,
  OrderReceiptResponse,
  OrdersListResponse,
} from "@/types";

export const ordersAPI = async (
  params: OrderQueryParams,
): Promise<OrdersListResponse> => {
  const query = buildQuery({
    page: params.page,
    limit: params.limit,
    status_category: params.status_category,
    status: params.status_category === "new" ? params.status : undefined,
    order_by: params.order_by,
    search: params.search,
  });

  return await baseAPI("GET", `/orders?${query}`);
};

export const singleOrderAPI = async (
  orderId: string,
): Promise<OrderDetailResponse> => await baseAPI("GET", `/orders/${orderId}`);

export const orderReceiptAPI = async (
  orderId: string,
): Promise<OrderReceiptResponse> =>
  await baseAPI("GET", `/orders/${orderId}/receipt`);

export const orderOperatingContractAPI = async (
  orderId: string,
): Promise<OrderOperatingContractResponse> => {
  try {
    return await baseAPI("GET", `/orders/${orderId}/operating-contract`);
  } catch (error) {
    if ((error as { status?: number; response?: { status: number } }).status === 404 ||
        (error as { response?: { status: number } }).response?.status === 404) {
      return { error: false, message: "", data: null };
    }
    throw error;
  }
};
