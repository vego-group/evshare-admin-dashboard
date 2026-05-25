import { PaymentRequestsQueryParams } from "@/types";
import { useCustomQuery } from "..";
import {
  paymentRequestsAPI,
  singlePaymentRequestAPI,
} from "@/services/queries";

export function usePaymentRequests(params: PaymentRequestsQueryParams) {
  return useCustomQuery(["payment-requests", params], async () =>
    paymentRequestsAPI(params),
  );
}

export function usePaymentRequest(paymentRequestId: string | null) {
  return useCustomQuery(
    ["payment-request", paymentRequestId],
    async () => singlePaymentRequestAPI(paymentRequestId!),
    { enabled: Boolean(paymentRequestId) },
  );
}
