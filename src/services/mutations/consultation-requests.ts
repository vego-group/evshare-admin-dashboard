"use server";

import { safeApi } from "..";
import type { ConsultationStatus } from "@/types";

export const updateConsultationStatusAPI = async (
  consultationRequestId: string,
  status: ConsultationStatus,
) =>
  await safeApi("POST", `/consultations/${consultationRequestId}/status`, {
    status,
  });
