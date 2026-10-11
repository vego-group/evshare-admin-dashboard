import { buildQuery } from "@/lib/utils/build-query";
import { baseAPI } from "..";
import {
  PaymentRequestDetailResponse,
  PaymentRequestsListResponse,
  PaymentRequestsQueryParams,
} from "@/types";

export const buildPaymentRequestsQuery = (params: PaymentRequestsQueryParams) => buildQuery({
    page: params.page.toString(),
    limit: params.limit.toString(),
    status: params.status,
    order_by: params.order_by,
    search: params.search,
  });

export const paymentRequestsAPI = async (
  params: PaymentRequestsQueryParams,
): Promise<PaymentRequestsListResponse> => {
  const query = buildPaymentRequestsQuery(params);

  return await baseAPI("GET", `/payment-requests?${query}`);
};

export const singlePaymentRequestAPI = async (
  paymentRequestId: string,
): Promise<PaymentRequestDetailResponse> =>
  await baseAPI("GET", `/payment-requests/${paymentRequestId}`);
