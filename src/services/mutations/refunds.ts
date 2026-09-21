"use server";

import { safeApi } from "..";
import type { RefundResponse, RefundRequestPayload, ResolveRefundPayload } from "@/types";

export const requestRefundAPI = async (payload: RefundRequestPayload) =>
  await safeApi<RefundResponse>("POST", "/refunds/request", payload, {
    headers: { "Idempotency-Key": payload.idempotencyKey },
  });

export const resolveRefundAPI = async (
  refundId: string,
  payload: ResolveRefundPayload,
) =>
  await safeApi<RefundResponse>("POST", `/refunds/${refundId}/resolve`, payload, {
    headers: { "Idempotency-Key": payload.idempotencyKey },
  });

export const retryRefundAPI = async (refundId: string) =>
  await safeApi<RefundResponse>("POST", `/refunds/${refundId}/retry`);
