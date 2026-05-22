import { baseAPI } from "..";
import { buildQuery } from "@/lib";
import {
  OrderDetailResponse,
  OrderQueryParams,
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
