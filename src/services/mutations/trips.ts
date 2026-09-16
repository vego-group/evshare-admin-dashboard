"use server";

import { safeApi } from "..";
import type { TripMutationResponse } from "@/types";

export const cancelTripAPI = async (tripId: string) =>
  await safeApi<TripMutationResponse>("POST", `/trips/${tripId}/cancel`);

export const endTripAPI = async (tripId: string) =>
  await safeApi<TripMutationResponse, { message: string; error_code?: string; errors?: { reason?: string } }>("POST", `/trips/${tripId}/end`);
