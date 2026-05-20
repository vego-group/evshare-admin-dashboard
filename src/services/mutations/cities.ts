"use server";

import { safeApi } from "..";

export const addCity = async (payload: FormData) =>
  await safeApi("POST", "/cities", payload, {
    isForm: true,
  });

export const editCity = async (cityId: string, payload: FormData) =>
  await safeApi("POST", `/cities/${cityId}/edit`, payload, {
    isForm: true,
  });

export const deleteCity = async (cityId: string) =>
  await safeApi("DELETE", `/cities/${cityId}/delete`);
