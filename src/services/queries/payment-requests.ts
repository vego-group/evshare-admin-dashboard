import { buildQuery } from "@/lib";
import { baseAPI } from "..";
import { PAGE_SIZE } from "@/constants";
import {
  PaymentRequestDetailResponse,
  PaymentRequestsListResponse,
  PaymentRequestsQueryParams,
} from "@/types";

export const paymentRequestsAPI = async (
  params: PaymentRequestsQueryParams,
): Promise<PaymentRequestsListResponse> => {
  const query = buildQuery({
    page: params.page.toString(),
    limit: PAGE_SIZE.toString(),
    status: params.status,
    order_by: params.order_by,
    search: params.search,
  });

  return await baseAPI("GET", `/payment-requests?${query}`);
};

export const singlePaymentRequestAPI = async (
  paymentRequestId: string,
): Promise<PaymentRequestDetailResponse> =>
  await baseAPI("GET", `/payment-requests/${paymentRequestId}`);
