"use server";

import { safeApi } from "..";

export const addProductAPI = async (payload: FormData) =>
  await safeApi("POST", `/products/add`, payload, { isForm: true });

export const editProductAPI = async (productId: string, payload: FormData) =>
  await safeApi("POST", `/products/${productId}/edit`, payload, { isForm: true });

export const deleteProduct = async (productId: string) =>
  await safeApi("DELETE", `/products/${productId}/delete`);

export const addProductFeatureAPI = async (
  productId: string,
  payload: { title_ar: string; title_en: string },
) => await safeApi("POST", `/products/${productId}/features/add`, payload);

export const editProductFeatureAPI = async (
  productId: string,
  featureId: string,
  payload: Partial<{ title_ar: string; title_en: string }>,
) =>
  await safeApi(
    "POST",
    `/products/${productId}/features/${featureId}/edit`,
    payload,
  );

export const deleteProductFeatureAPI = async (
  productId: string,
  featureId: string,
) =>
  await safeApi(
    "DELETE",
    `/products/${productId}/features/${featureId}/delete`,
  );
