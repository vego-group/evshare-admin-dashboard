import { PAGE_SIZE } from "@/constants";
import { buildQuery } from "@/lib/utils/build-query";
import type {
  PaymentMethodDetailsResponse,
  PaymentMethodsListResponse,
  PaymentMethodsQueryParams,
} from "@/types";

import { baseAPI } from "..";

export async function paymentMethodsAPI(
  params: PaymentMethodsQueryParams = {},
): Promise<PaymentMethodsListResponse> {
  const query = buildQuery({
    page: params.page,
    per_page: params.per_page ?? params.limit ?? PAGE_SIZE,
    search: params.search,
    status: params.status && params.status !== "all" ? params.status : undefined,
    available_for:
      params.available_for && params.available_for !== "all"
        ? params.available_for
        : undefined,
  });

  return await baseAPI("GET", `/payment-methods${query ? `?${query}` : ""}`);
}

export async function singlePaymentMethodAPI(
  paymentMethodId: string,
): Promise<PaymentMethodDetailsResponse> {
  return await baseAPI("GET", `/payment-methods/${paymentMethodId}`);
}
