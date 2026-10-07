"use server";

import type {
  PaymentGatewayDetailsResponse,
  PaymentRefundRequest,
  PaymentRefundResponse,
  UpdatePaymentGatewayPayload,
} from "@/types";

import { safeApi } from "..";

export const editPaymentGateway = async (
  gatewayId: string,
  payload: UpdatePaymentGatewayPayload,
) =>
  await safeApi<PaymentGatewayDetailsResponse>(
    "POST",
    `/payment-gateways/${gatewayId}/edit`,
    payload,
  );

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
