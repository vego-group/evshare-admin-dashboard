"use server";

import type { CommunicationPayload, SendCommunicationResponse } from "@/types";

import { safeApi } from "..";

export async function sendCommunication(
  payload: CommunicationPayload,
  idempotencyKey: string,
) {
  return safeApi<SendCommunicationResponse>("POST", "/communications", payload, {
    headers: { "Idempotency-Key": idempotencyKey },
  });
}
