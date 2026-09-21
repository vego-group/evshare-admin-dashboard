"use server";

import { safeApi } from "..";
import type { PublishContentPayload } from "@/types";

export const addSlider = async (payload: FormData) =>
  await safeApi("POST", "/slides/add", payload, { isForm: true });

export const editSlider = async (sliderId: string, payload: FormData) =>
  await safeApi("POST", `/slides/${sliderId}/edit`, payload, { isForm: true });

export const deleteSlider = async (sliderId: string) =>
  await safeApi("DELETE", `/slides/${sliderId}/delete`);

export const publishSlider = async (
  sliderId: string,
  payload: PublishContentPayload = {},
) => await safeApi("POST", `/slides/${sliderId}/publish`, payload);

export const rollbackSlider = async (sliderId: string, version: number) =>
  await safeApi("POST", `/slides/${sliderId}/rollback`, { version });
