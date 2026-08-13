import { PAGE_SIZE } from "@/constants";
import { buildQuery } from "@/lib/utils/build-query";
import { baseAPI } from "..";
import type {
  OrderShipmentsListResponse,
  ShipmentDetailsResponse,
  ShipmentsListResponse,
  ShipmentsQueryParams,
} from "@/types";

export const shipmentsAPI = async (
  params: ShipmentsQueryParams,
): Promise<ShipmentsListResponse> => {
  const query = buildQuery({
    page: params.page.toString(),
    limit: (params.limit ?? PAGE_SIZE).toString(),
    search: params.search,
    status: params.status,
    direction: params.direction,
    shipping_company_uuid: params.shipping_company_uuid,
    order_uuid: params.order_uuid,
    order_by: params.order_by,
  });

  return await baseAPI("GET", `/shipments?${query}`);
};

export const orderShipmentsAPI = async (
  orderId: string,
  limit = PAGE_SIZE,
): Promise<OrderShipmentsListResponse> => {
  const query = buildQuery({ limit: limit.toString() });

  return await baseAPI("GET", `/orders/${orderId}/shipments?${query}`);
};

export const singleShipmentAPI = async (
  shipmentId: string,
): Promise<ShipmentDetailsResponse> =>
  await baseAPI("GET", `/shipments/${shipmentId}`);
