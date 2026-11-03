"use server";

import type {
  SubscriptionDiscountPayload,
  SubscriptionDiscountResponse,
  SubscriptionDiscountValidationError,
} from "@/types";
import { safeApi } from "..";

export const addSubscriptionDiscount = async (payload: SubscriptionDiscountPayload) =>
  await safeApi<SubscriptionDiscountResponse, SubscriptionDiscountValidationError>("POST", "/subscription-discounts/add", payload);
export const editSubscriptionDiscount = async (id: string, payload: SubscriptionDiscountPayload) =>
  await safeApi<SubscriptionDiscountResponse, SubscriptionDiscountValidationError>("POST", `/subscription-discounts/${id}/edit`, payload);
export const deleteSubscriptionDiscount = async (id: string) =>
  await safeApi("DELETE", `/subscription-discounts/${id}/delete`);
