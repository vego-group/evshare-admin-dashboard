import { PAGE_SIZE } from "@/constants";
import { buildQuery } from "@/lib/utils/build-query";
import type {
  PaymentCheckoutDetailResponse,
  PaymentCheckoutQueryParams,
  PaymentCheckoutsListResponse,
  PaymentTransactionDetailResponse,
  PaymentTransactionQueryParams,
  PaymentTransactionsListResponse,
} from "@/types";

import { baseAPI } from "..";

export const paymentCheckoutsAPI = async (
  params: PaymentCheckoutQueryParams,
): Promise<PaymentCheckoutsListResponse> => {
  const query = buildQuery({
    page: params.page,
    limit: PAGE_SIZE,
    gateway: params.gateway,
    payable_type: params.payable_type,
    is_processed:
      typeof params.is_processed === "boolean"
        ? Number(params.is_processed)
        : undefined,
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
    limit: PAGE_SIZE,
    gateway: params.gateway,
    status: params.status,
    transaction_id: params.transaction_id,
  });

  return await baseAPI("GET", `/payment/transactions?${query}`);
};

export const singlePaymentTransactionAPI = async (
  transactionId: string,
): Promise<PaymentTransactionDetailResponse> =>
  await baseAPI("GET", `/payment/transactions/${transactionId}`);
