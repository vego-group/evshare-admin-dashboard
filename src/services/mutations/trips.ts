"use server";

import { safeApi } from "..";

export const cancelTripAPI = async (tripId: string) =>
  await safeApi("POST", `/trips/${tripId}/cancel`);

export const endTripAPI = async (tripId: string) =>
  await safeApi("POST", `/trips/${tripId}/end`);
