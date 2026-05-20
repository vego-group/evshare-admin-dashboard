"use server";

import { safeApi } from "..";

export const addCategory = async (payload: FormData) =>
  await safeApi("POST", "/categories", payload, {
    isForm: true,
  });

export const editCategory = async (categoryId: string, payload: FormData) =>
  await safeApi("POST", `/categories/${categoryId}/edit`, payload, {
    isForm: true,
  });

export const deleteCategory = async (categoryId: string) =>
  await safeApi("DELETE", `/categories/${categoryId}/delete`);
