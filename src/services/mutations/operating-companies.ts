"use server";

import { safeApi } from "..";

export const uploadOperatingCompanyContractAPI = async (
  companyId: string,
  payload: FormData,
) => {
  const file = payload.get("contract");
  if (!(file instanceof File) || !/\.(pdf|doc|docx)$/i.test(file.name) ||
      file.size === 0 || file.size > 10 * 1024 * 1024) {
    return { ok: false as const, message: "يرجى اختيار ملف PDF أو DOC أو DOCX بحجم لا يتجاوز 10 ميجابايت." };
  }
  const form = new FormData();
  form.set("contract", file);
  return await safeApi("POST", `/operation-companies/${companyId}/contract/upload`, form, { isForm: true });
};

export const editOperatingCompanyAPI = async (
  companyId: string,
  payload: FormData,
) =>
  await safeApi("POST", `/operation-companies/${companyId}/edit`, payload, {
    isForm: true,
  });

export const deleteOperatingCompanyAPI = async (companyId: string) =>
  await safeApi("DELETE", `/operation-companies/${companyId}/delete`);
