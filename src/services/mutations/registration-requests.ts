"use server";

import { safeApi } from "..";

export const approveKycAPI = async (kycId: string) =>
  await safeApi("POST", `/kycs/${kycId}/approve`);

export const rejectKycAPI = async (kycId: string) =>
  await safeApi("POST", `/kycs/${kycId}/reject`);
