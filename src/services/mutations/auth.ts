"use server";

import { LoginFormValues, VerifyOtpFormValues } from "@/schemas";
import { safeAuthApi } from "..";
import { setCountry } from "@/lib";
import { AuthResponse } from "@/types";

export const loginAPI = async (payload: LoginFormValues, country: string) => {
  await setCountry(country);
  return await safeAuthApi("POST", "/login/send", payload);
};

export const verifyLoginAPI = async (payload: VerifyOtpFormValues, country: string) => {
  await setCountry(country);
  return await safeAuthApi<AuthResponse>("POST", "/login/verify", payload);
};

export const logoutAPI = async () => await safeAuthApi("POST", "/logout");
