"use server";

import { safeApi } from "..";
import type { TripMutationError, TripMutationResponse } from "@/types";

export const cancelTripAPI = async (tripId: string, idempotencyKey: string) =>
  await safeApi<TripMutationResponse, TripMutationError>(
    "POST",
    `/trips/${tripId}/cancel`,
    undefined,
    { headers: { "Idempotency-Key": idempotencyKey } },
  );

export const endTripAPI = async (tripId: string, idempotencyKey: string) =>
  await safeApi<TripMutationResponse, TripMutationError>(
    "POST",
    `/trips/${tripId}/end`,
    undefined,
    { headers: { "Idempotency-Key": idempotencyKey } },
  );
