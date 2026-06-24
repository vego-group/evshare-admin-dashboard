"use server";

import type {
  PaymentMethodDetailsResponse,
  UpdatePaymentMethodPayload,
} from "@/types";

import { safeApi } from "..";

export const editPaymentMethod = async (
  paymentMethodId: string,
  payload: UpdatePaymentMethodPayload,
) =>
  await safeApi<PaymentMethodDetailsResponse>(
    "POST",
    `/payment-methods/${paymentMethodId}/edit`,
    payload,
  );
