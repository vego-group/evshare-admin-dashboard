export type RefundState =
  | "REQUESTED"
  | "PROCESSING"
  | "PENDING_PROVIDER"
  | "COMPLETED"
  | "FAILED"
  | "TIMED_OUT"
  | "CANCELLED"
  | "RECONCILIATION_REQUIRED";

export type RefundDecision = "APPROVE" | "REJECT";
export type RefundableType = "order" | "order_receipt_item";

export type Refund = {
  refund_id: string;
  state: RefundState;
  is_final: boolean;
  needs_attention: boolean;
  decision?: RefundDecision | null;
  refunded_amount: number | string;
  currency: string;
  remaining_refundable_amount: number | string;
  correlation_id: string;
  idempotency_key: string;
  provider_reference?: string | null;
  payment_gateway?: string | null;
  reason?: string | null;
  failure_code?: string | null;
  failure_reason?: string | null;
  reconciliation_note?: string | null;
  is_booked: boolean;
  ledger_written_at?: string | null;
  refundable: { type: string; id: string };
  customer?: { id: string; name?: string } | null;
  requested_by?: { id: string; name?: string } | null;
  resolved_by?: { id: string; name?: string } | null;
  timestamps?: Record<string, string | null>;
  transitions?: RefundTransition[];
};

export type RefundTransition = {
  id?: string;
  from: RefundState | null;
  to: RefundState;
  source: "admin" | "provider" | "system";
  actor?: { id: string; name?: string } | null;
  reason?: string | null;
  provider_event_id?: string | null;
  context?: Record<string, unknown> | null;
  occurred_at: string;
};

export type RefundEligibility = {
  refundable: boolean;
  settled_amount: number | string;
  reserved_amount: number | string;
  remaining_refundable_amount: number | string;
  currency: string;
};

export type RefundRequestPayload = {
  refundableType: RefundableType;
  refundableId: string;
  amount: number;
  currency?: string;
  reason: string;
  idempotencyKey: string;
};

export type ResolveRefundPayload = {
  decision: RefundDecision;
  amount?: number;
  currency?: string;
  reason: string;
  idempotencyKey: string;
};

export type RefundResponse = Refund | {
  error?: boolean;
  message?: string;
  data: Refund;
};

export type RefundsListResponse = {
  error?: boolean;
  message?: string;
  data: Refund[];
  meta?: Record<string, number>;
};

export type RefundsQueryParams = {
  state?: RefundState;
  gateway?: string;
  trace_id?: string;
  user_uuid?: string;
  needs_attention?: boolean;
  limit?: number;
};
