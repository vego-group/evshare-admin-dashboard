"use server";

import { countryCodeSchema } from "@/schemas/countries";
import type { LoginFormValues, VerifyOtpFormValues } from "@/schemas/login";
import { safeAuthApi } from "..";
import { setCountry } from "@/lib/utils/auth";
import type { AuthResponse } from "@/types";

export const loginAPI = async (payload: LoginFormValues, country: string) => {
  const selectedCountry = countryCodeSchema.safeParse(country);
  if (!selectedCountry.success) {
    return {
      ok: false as const,
      status: 400,
      message: selectedCountry.error.issues[0]?.message || "Invalid country",
    };
  }

  await setCountry(selectedCountry.data);
  return await safeAuthApi("POST", "/login/send", payload);
};

export const verifyLoginAPI = async (payload: VerifyOtpFormValues) =>
  await safeAuthApi<AuthResponse>("POST", "/login/verify", payload);

export const logoutAPI = async () => await safeAuthApi("POST", "/logout");
