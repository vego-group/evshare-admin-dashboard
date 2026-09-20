"use server";

import {
  countryCodeSchema,
  LoginFormValues,
  VerifyOtpFormValues,
} from "@/schemas";
import { safeAuthApi } from "..";
import { setCountry } from "@/lib";
import { AuthResponse } from "@/types";

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
