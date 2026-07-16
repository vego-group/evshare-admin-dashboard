"use server";

import type { PromoCodeDetailResponse, PromoCodePayload } from "@/types";

import { safeApi } from "..";

export const addPromo = async (payload: PromoCodePayload) =>
  await safeApi<PromoCodeDetailResponse>("POST", "/promos/add", payload);

export const editPromo = async (promoId: string, payload: PromoCodePayload) =>
  await safeApi<PromoCodeDetailResponse>("POST", `/promos/${promoId}/edit`, payload);

export const deletePromo = async (promoId: string) =>
  await safeApi("DELETE", `/promos/${promoId}/delete`);
