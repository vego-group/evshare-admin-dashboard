"use server";

import { LoginFormValues, VerifyOtpFormValues } from "@/schemas";
import { safeAuthApi } from "..";
import { AuthResponse } from "@/types";
import type { CountryCode } from "@/types";

const tenantConfig = (tenant: CountryCode) => ({
  headers: { "X-Tenant-Id": tenant },
});

export const loginAPI = async (payload: LoginFormValues, tenant: CountryCode) =>
  await safeAuthApi("POST", "/login/send", payload, tenantConfig(tenant));

export const verifyLoginAPI = async (payload: VerifyOtpFormValues, tenant: CountryCode) =>
  await safeAuthApi<AuthResponse>("POST", "/login/verify", payload, tenantConfig(tenant));

export const logoutAPI = async () => await safeAuthApi("POST", "/logout");
