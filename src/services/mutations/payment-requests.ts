"use server";

import { safeApi } from "..";

export const approvePaymentRequestAPI = async (paymentRequestId: string) =>
  await safeApi("POST", `/payment-requests/${paymentRequestId}/approve`);

export const rejectPaymentRequestAPI = async (paymentRequestId: string) =>
  await safeApi("POST", `/payment-requests/${paymentRequestId}/reject`);
