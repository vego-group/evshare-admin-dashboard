"use server";

import { safeApi } from "..";

export const addSlider = async (payload: FormData) =>
  await safeApi("POST", "/slides/add", payload, { isForm: true });

export const editSlider = async (sliderId: string, payload: FormData) =>
  await safeApi("POST", `/slides/${sliderId}/edit`, payload, { isForm: true });

export const deleteSlider = async (sliderId: string) =>
  await safeApi("DELETE", `/slides/${sliderId}/delete`);
