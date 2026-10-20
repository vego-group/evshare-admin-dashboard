import { baseAPI } from "..";
import type { OrderOperatingContractResponse } from "@/types";
import { buildQuery } from "@/lib/utils/build-query";
import { getHttpErrorStatus } from "@/lib/utils/helper";
import {
  OrderDetailResponse,
  OrderQueryParams,
  OrderReceiptResponse,
  OrdersListResponse,
} from "@/types";
import { isClientSideOrderStatusFilter } from "@/lib/orders";

const MAX_ORDER_PAGE_SIZE = 200;

async function fetchOrdersPage(
  params: OrderQueryParams,
  overrides: { page?: string; limit?: string; omitStatus?: boolean } = {},
): Promise<OrdersListResponse> {
  const query = buildQuery({
    page: overrides.page ?? params.page,
    limit: overrides.limit ?? params.limit,
    status_category: params.status_category,
    status:
      params.status_category === "new" && !overrides.omitStatus
        ? params.status
        : undefined,
    order_by: params.order_by,
    search: params.search,
  });

  return await baseAPI("GET", `/orders?${query}`);
}

export const ordersAPI = async (
  params: OrderQueryParams,
): Promise<OrdersListResponse> => {
  const selectedStatus = "status" in params ? params.status : undefined;
  if (!isClientSideOrderStatusFilter(selectedStatus)) {
    return await fetchOrdersPage(params);
  }

  // The API does not accept `delivered` as a status query value. Fetch the
  // complete `new` category, then apply that one filter and its pagination in
  // the client API layer so every delivered order remains discoverable.
  const firstPage = await fetchOrdersPage(params, {
    page: "1",
    limit: String(MAX_ORDER_PAGE_SIZE),
    omitStatus: true,
  });
  const remainingPages = Array.from(
    { length: Math.max(0, firstPage.meta.lastPage - 1) },
    (_, index) => String(index + 2),
  );
  const remainingResponses = await Promise.all(
    remainingPages.map((page) =>
      fetchOrdersPage(params, {
        page,
        limit: String(MAX_ORDER_PAGE_SIZE),
        omitStatus: true,
      }),
    ),
  );
  const deliveredOrders = [firstPage, ...remainingResponses]
    .flatMap((response) => response.data)
    .filter((order) => order.status === "delivered");
  const requestedPage = Math.max(1, Number(params.page) || 1);
  const requestedLimit = Math.max(1, Number(params.limit) || 1);
  const offset = (requestedPage - 1) * requestedLimit;
  const total = deliveredOrders.length;

  return {
    ...firstPage,
    data: deliveredOrders.slice(offset, offset + requestedLimit),
    meta: {
      currentPage: requestedPage,
      lastPage: Math.max(1, Math.ceil(total / requestedLimit)),
      perPage: requestedLimit,
      total,
    },
  };
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
    if (getHttpErrorStatus(error) === 404) {
      return { error: false, message: "", data: null };
    }
    throw error;
  }
};
