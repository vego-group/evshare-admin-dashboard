"use server";

import type { MobilityReceiptReviewValues } from "@/schemas/mobility-receipts";

import { safeApi } from "..";

export const uploadMobilityReceiptTemplateAPI = async (
  vehicleId: string,
  payload: FormData,
) =>
  await safeApi("POST", `/vehicles/${vehicleId}/edit`, payload, {
    isForm: true,
  });

export const reviewMobilityReceiptAPI = async (
  vehicleId: string,
  payload: MobilityReceiptReviewValues,
) => await safeApi("POST", `/vehicles/${vehicleId}/contract/review`, payload);
