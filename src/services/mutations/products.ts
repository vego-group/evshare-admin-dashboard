"use server";

import { safeApi } from "..";

export const addProductAPI = async (payload: FormData) =>
  await safeApi("POST", `/products/add`, payload, { isForm: true });

export const editProductAPI = async (productId: string, payload: FormData) =>
  await safeApi("POST", `/products/${productId}/edit`, payload, { isForm: true });

export const deleteProduct = async (productId: string) =>
  await safeApi("DELETE", `/products/${productId}/delete`);
