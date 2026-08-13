"use server";

import { safeApi } from "..";
import type { ShippingCityPayload } from "@/types";

export const addShippingCity = async (payload: ShippingCityPayload) =>
  await safeApi("POST", "/shipping/cities/add", payload);

export const editShippingCity = async (
  shippingCityId: string,
  payload: ShippingCityPayload,
) => await safeApi("POST", `/shipping/cities/${shippingCityId}/edit`, payload);

export const deleteShippingCity = async (shippingCityId: string) =>
  await safeApi("DELETE", `/shipping/cities/${shippingCityId}/delete`);
