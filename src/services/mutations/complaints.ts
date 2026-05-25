"use server";

import { safeApi } from "..";
import type { AnswerComplaintPayload } from "@/types/complaints";

export const answerComplaintAPI = async (complaintId: string, payload: AnswerComplaintPayload) =>
  await safeApi("POST", `/complaints/${complaintId}/answer`, payload);
