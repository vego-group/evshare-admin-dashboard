"use server";

import { safeApi } from "..";
import type { ShippingCompanyPayload } from "@/types";

export const addShippingCompany = async (payload: ShippingCompanyPayload) =>
  await safeApi("POST", "/shipping/companies/add", payload);

export const editShippingCompany = async (
  companyId: string,
  payload: ShippingCompanyPayload,
) => await safeApi("POST", `/shipping/companies/${companyId}/edit`, payload);

export const deleteShippingCompany = async (companyId: string) =>
  await safeApi("DELETE", `/shipping/companies/${companyId}/delete`);
