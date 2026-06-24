import {
  paymentMethodsAPI,
  singlePaymentMethodAPI,
} from "@/services/queries";
import type { PaymentMethodsQueryParams } from "@/types";

import { useCustomQuery } from "..";

export function usePaymentMethods(params: PaymentMethodsQueryParams = {}) {
  return useCustomQuery(["payment-methods", params], () =>
    paymentMethodsAPI(params),
  );
}

export function usePaymentMethod(paymentMethodId: string | null) {
  return useCustomQuery(
    ["payment-method", paymentMethodId],
    () => singlePaymentMethodAPI(paymentMethodId!),
    { enabled: Boolean(paymentMethodId) },
  );
}
