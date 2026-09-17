"use server";

import { safeApi } from "..";

export const approveKycAPI = async (kycId: string) =>
  await safeApi("POST", `/kycs/${kycId}/approve`);

export const rejectKycAPI = async (kycId: string, reason: string) =>
  await safeApi<unknown, { message: string; error_code?: string; errors?: { reason?: string[] } }>(
    "POST",
    `/kycs/${kycId}/reject`,
    { reason: reason.trim() },
  );
