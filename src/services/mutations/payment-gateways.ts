"use server";

import type { PaymentRefundRequest, PaymentRefundResponse } from "@/types";

import { safeApi } from "..";

export const refundPaymentTransactionAPI = async (
  transactionId: string,
  payload: PaymentRefundRequest,
) =>
  await safeApi<PaymentRefundResponse>(
    "POST",
    `/payment/transactions/${encodeURIComponent(transactionId)}/refund`,
    payload,
    { headers: { "Idempotency-Key": payload.idempotency_key } },
  );
