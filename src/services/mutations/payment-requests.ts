"use server";

import { safeApi } from "..";

export const approvePaymentRequestAPI = async (
  paymentRequestId: string,
  idempotencyKey: string,
) =>
  await safeApi(
    "POST",
    `/payment-requests/${paymentRequestId}/approve`,
    undefined,
    { headers: { "Idempotency-Key": idempotencyKey } },
  );

export const rejectPaymentRequestAPI = async (paymentRequestId: string) =>
  await safeApi("POST", `/payment-requests/${paymentRequestId}/reject`);
