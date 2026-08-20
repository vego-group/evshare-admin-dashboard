"use server";

import { LoginFormValues, VerifyOtpFormValues } from "@/schemas";
import { safeAuthApi } from "..";
import { AuthResponse } from "@/types";

export const loginAPI = async (payload: LoginFormValues) =>
  await safeAuthApi("POST", "/login/send", payload);

export const verifyLoginAPI = async (payload: VerifyOtpFormValues) =>
  await safeAuthApi<AuthResponse>("POST", "/login/verify", payload);

export const logoutAPI = async () => await safeAuthApi("POST", "/logout");
