"use server";

import { safeApi } from "..";

export const editOperatingCompanyAPI = async (
  companyId: string,
  payload: FormData,
) =>
  await safeApi("POST", `/operation-companies/${companyId}/edit`, payload, {
    isForm: true,
  });

export const deleteOperatingCompanyAPI = async (companyId: string) =>
  await safeApi("DELETE", `/operation-companies/${companyId}/delete`);
