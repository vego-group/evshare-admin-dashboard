import type React from "react";

export type PaymentOperationTab = "checkouts" | "transactions";
export type PaymentSortOrder = "asc" | "desc";
export type PaymentCheckoutStatus = "all" | "processed" | "unprocessed";
export type PaymentRefundStatus = "none" | "partially_refunded" | "refunded";

export type PaymentTransactionStatus =
  | "all"
  | "initiated"
  | "authorized"
  | "captured"
  | "paid"
  | "failed"
  | "refunded"
  | "voided"
  | "expired"
  | (string & {});

export type PaymentOperationsPaginationMeta = {
  currentPage: number;
  lastPage: number;
  perPage: number;
  total: number;
};

export type PaymentFilterOption = { key: string; name: string };
export type PaymentOperationsFilters = {
  payment_methods: PaymentFilterOption[];
  statuses: string[];
  gateways: string[];
};

type SharedPaymentQueryParams = {
  page: number;
  per_page?: number;
  /** Legacy alias accepted by the API. Prefer per_page in new callers. */
  limit?: number;
  gateway?: string;
  payment_method?: string;
  search?: string;
  sort_by?: "created_at";
  sort_order?: PaymentSortOrder;
};

export type PaymentCheckoutQueryParams = SharedPaymentQueryParams & {
  payable_type?: string;
  status?: PaymentCheckoutStatus;
  /** Legacy checkout filter. Prefer status in new callers. */
  is_processed?: boolean;
};

export type PaymentTransactionQueryParams = SharedPaymentQueryParams & {
  status?: PaymentTransactionStatus;
  transaction_id?: string;
};

export type PaymentPayable = {
  type: string;
  id: number | string;
  uuid?: string | null;
};

export type PaymentGatewayUser = {
  id: string;
  name: string;
  mobile: string;
};

export type PaymentRefundActor = { id: string; name: string };
export type PaymentTransactionRefund = {
  id: string;
  reference: string;
  provider_refund_reference?: string | null;
  amount: number;
  currency?: string;
  state?: string;
  reason?: string | null;
  refunded_at: string;
  refunded_by?: PaymentRefundActor | null;
};

export type PaymentTransaction = {
  id: string;
  transaction_id: string;
  reference?: string | null;
  status: PaymentTransactionStatus;
  amount: number;
  currency: string;
  payment_gateway: string;
  payment_gateway_name?: string | null;
  payment_method?: string | null;
  payment_method_name?: string | null;
  user?: PaymentGatewayUser | null;
  refundable: boolean;
  refund_status: PaymentRefundStatus;
  refund_in_progress: boolean;
  refunded_amount: number;
  remaining_refundable_amount: number;
  refund: PaymentTransactionRefund | null;
  paid_at?: string | null;
  transaction_response?: Record<string, unknown> | null;
  checkout?: PaymentCheckout | null;
  created_at: string;
  updated_at?: string;
};

export type PaymentCheckout = {
  id: string;
  amount: number;
  currency: string;
  payment_gateway: string;
  payment_gateway_name?: string | null;
  payment_method?: string | null;
  payment_method_name?: string | null;
  reference?: string | null;
  status?: Exclude<PaymentCheckoutStatus, "all">;
  is_processed: boolean;
  payable: PaymentPayable | null;
  user: PaymentGatewayUser | null;
  transactions: PaymentTransaction[] | string[];
  request_body?: Record<string, unknown> | null;
  created_at: string;
  updated_at?: string;
};

export type PaymentTransactionsAnalytics = {
  total: number;
  paid: number;
  failed: number;
  initiated: number;
  refunded: number;
};

export type PaymentCheckoutsListResponse = {
  error?: boolean;
  message?: string;
  data: PaymentCheckout[];
  filters: PaymentOperationsFilters;
  meta: PaymentOperationsPaginationMeta;
};

export type PaymentCheckoutDetailResponse = {
  error?: boolean;
  message?: string;
  data: PaymentCheckout;
};

export type PaymentTransactionsListResponse = {
  error?: boolean;
  message?: string;
  data: PaymentTransaction[];
  filters: PaymentOperationsFilters;
  analytics: PaymentTransactionsAnalytics;
  meta: PaymentOperationsPaginationMeta;
};

export type PaymentTransactionDetailResponse = {
  error?: boolean;
  message?: string;
  data: PaymentTransaction;
};

export type PaymentRefundRequest = {
  amount?: number;
  reason?: string;
  idempotency_key: string;
};

export type PaymentRefundResult = {
  transaction_id: string;
  status: PaymentTransactionStatus;
  refund_status: PaymentRefundStatus;
  original_amount: number;
  refunded_amount: number;
  remaining_refundable_amount: number;
  refund_reference?: string | null;
  refunded_at?: string | null;
  replayed: boolean;
  refund?: PaymentTransactionRefund | null;
  transaction: PaymentTransaction;
};

export type PaymentRefundResponse = {
  error?: boolean;
  message?: string;
  data: PaymentRefundResult;
};

export type PaymentGatewayStatCard = {
  label: string;
  value: number;
  icon: React.ReactNode;
  iconBg: string;
};

export const paymentGatewayUserTypes = ["merchant", "driver"] as const;
export type PaymentGatewayUserType = (typeof paymentGatewayUserTypes)[number];

export type PaymentGateway = {
  id: string;
  key: string;
  name: string;
  name_ar: string;
  name_en: string;
  is_active: boolean;
  is_default: boolean;
  supported_currencies: string[];
  allowed_user_types: PaymentGatewayUserType[];
  allowed_driver?: boolean;
  allowed_merchant?: boolean;
  publishable_key?: string | null;
  credentials: Record<string, string | null>;
  config?: Record<string, unknown>;
  payment_methods_count: number;
  created_at: string;
  updated_at?: string;
};

export type PaymentGatewaysQueryParams = {
  page?: number;
  per_page?: number;
  search?: string;
  is_active?: boolean;
};

export type PaymentGatewaysListResponse = {
  error: boolean;
  message: string;
  data: PaymentGateway[];
  meta?: PaymentOperationsPaginationMeta;
};

export type PaymentGatewayDetailsResponse = {
  error: boolean;
  message: string;
  data: PaymentGateway;
};

export type UpdatePaymentGatewayPayload = Partial<{
  is_active: boolean;
  is_default: boolean;
  supported_currencies: string[];
  allowed_user_types: PaymentGatewayUserType[];
  credentials: Record<string, string>;
  config: Record<string, unknown>;
}>;
