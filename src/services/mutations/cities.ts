"use server";

import { safeApi } from "..";

type CityPayload = { name_ar: string; name_en: string; active: string };

export const addCity = async (payload: CityPayload) =>
  await safeApi("POST", "/cities", payload);

export const editCity = async (cityId: string, payload: Partial<CityPayload>) =>
  await safeApi("POST", `/cities/${cityId}/edit`, payload);

export const deleteCity = async (cityId: string) =>
  await safeApi("DELETE", `/cities/${cityId}/delete`);
