import { PAGE_SIZE } from "@/constants";
import { buildQuery } from "@/lib/utils/build-query";
import type {
  PaymentCheckoutDetailResponse,
  PaymentCheckoutQueryParams,
  PaymentCheckoutsListResponse,
  PaymentTransactionDetailResponse,
  PaymentTransactionQueryParams,
  PaymentTransactionsListResponse,
  PaymentGatewayDetailsResponse,
  PaymentGatewaysListResponse,
  PaymentGatewaysQueryParams,
} from "@/types";

import { baseAPI } from "..";

export const paymentGatewaysAPI = async (
  params: PaymentGatewaysQueryParams = {},
): Promise<PaymentGatewaysListResponse> => {
  const query = buildQuery({
    page: params.page,
    per_page: params.per_page ?? PAGE_SIZE,
    search: params.search,
    is_active: params.is_active,
  });
  return await baseAPI("GET", `/payment-gateways${query ? `?${query}` : ""}`);
};

export const singlePaymentGatewayAPI = async (
  gatewayId: string,
): Promise<PaymentGatewayDetailsResponse> =>
  await baseAPI("GET", `/payment-gateways/${gatewayId}`);

export const paymentCheckoutsAPI = async (
  params: PaymentCheckoutQueryParams,
): Promise<PaymentCheckoutsListResponse> => {
  const query = buildQuery({
    page: params.page,
    per_page: params.per_page ?? params.limit ?? PAGE_SIZE,
    gateway: params.gateway,
    payment_method: params.payment_method,
    payable_type: params.payable_type,
    status: params.status,
    is_processed:
      params.status === undefined && typeof params.is_processed === "boolean"
        ? Number(params.is_processed)
        : undefined,
    search: params.search,
    sort_by: params.sort_by ?? "created_at",
    sort_order: params.sort_order ?? "desc",
  });

  return await baseAPI("GET", `/payment/checkouts?${query}`);
};

export const singlePaymentCheckoutAPI = async (
  checkoutId: string,
): Promise<PaymentCheckoutDetailResponse> =>
  await baseAPI("GET", `/payment/checkouts/${checkoutId}`);

export const paymentTransactionsAPI = async (
  params: PaymentTransactionQueryParams,
): Promise<PaymentTransactionsListResponse> => {
  const query = buildQuery({
    page: params.page,
    per_page: params.per_page ?? params.limit ?? PAGE_SIZE,
    gateway: params.gateway,
    payment_method: params.payment_method,
    status: params.status,
    search: params.search,
    transaction_id: params.transaction_id,
    sort_by: params.sort_by ?? "created_at",
    sort_order: params.sort_order ?? "desc",
  });

  return await baseAPI("GET", `/payment/transactions?${query}`);
};

export const singlePaymentTransactionAPI = async (
  transactionId: string,
): Promise<PaymentTransactionDetailResponse> =>
  await baseAPI("GET", `/payment/transactions/${transactionId}`);
