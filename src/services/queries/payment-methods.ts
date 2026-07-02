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
    limit: params.limit ?? PAGE_SIZE,
    search: params.search,
    is_active: params.is_active,
    allowed_user_type: params.allowed_user_type,
  });

  return await baseAPI("GET", `/payment-methods${query ? `?${query}` : ""}`);
}

export async function singlePaymentMethodAPI(
  paymentMethodId: string,
): Promise<PaymentMethodDetailsResponse> {
  return await baseAPI("GET", `/payment-methods/${paymentMethodId}`);
}
