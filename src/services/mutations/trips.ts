"use server";

import { safeApi } from "..";
import type { TripMutationError, TripMutationResponse } from "@/types";

const tripOperationPayload = (reason: string, idempotencyKey: string) => ({
  reason,
  idempotencyKey,
});

export const cancelTripAPI = async (
  tripId: string,
  idempotencyKey: string,
  reason = "إلغاء إداري من لوحة التحكم",
) =>
  await safeApi<TripMutationResponse, TripMutationError>(
    "POST",
    `/trips/${tripId}/cancel`,
    tripOperationPayload(reason, idempotencyKey),
    { headers: { "Idempotency-Key": idempotencyKey } },
  );

export const endTripAPI = async (
  tripId: string,
  idempotencyKey: string,
  reason = "إنهاء إداري من لوحة التحكم",
) =>
  await safeApi<TripMutationResponse, TripMutationError>(
    "POST",
    `/trips/${tripId}/end`,
    tripOperationPayload(reason, idempotencyKey),
    { headers: { "Idempotency-Key": idempotencyKey } },
  );

export const retryTripOperationAPI = async (operationId: string) =>
  await safeApi<TripMutationResponse, TripMutationError>(
    "POST",
    `/trip-operations/${operationId}/retry`,
  );
