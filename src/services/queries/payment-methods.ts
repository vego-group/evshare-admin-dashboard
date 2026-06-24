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
    limit: params.limit ?? PAGE_SIZE,
  });

  return await baseAPI("GET", `/payment-methods?${query}`);
}

export async function singlePaymentMethodAPI(
  paymentMethodId: string,
): Promise<PaymentMethodDetailsResponse> {
  return await baseAPI("GET", `/payment-methods/${paymentMethodId}`);
}
