import { PaymentRequestsQueryParams } from "@/types";
import { useCustomQuery } from "..";
import { paymentRequestsAPI } from "@/services/queries";

export function usePaymentRequests(params: PaymentRequestsQueryParams) {
  return useCustomQuery(["payment-requests", params], async () =>
    paymentRequestsAPI(params),
  );
}
