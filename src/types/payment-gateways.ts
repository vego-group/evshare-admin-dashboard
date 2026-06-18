import type React from "react";

export type PaymentGatewayTab = "checkouts" | "transactions";

export type PaymentGateway = "tamara" | (string & {});

export type PayableType = "order" | "subscription" | (string & {});

export type PaymentTransactionStatus =
  | "paid"
  | "failed"
  | "initiated"
  | (string & {});

export type PaymentGatewaysPaginationMeta = {
  currentPage: number;
  lastPage: number;
  perPage: number;
  total: number;
};

export type PaymentCheckoutQueryParams = {
  page: number;
  gateway?: string;
  payable_type?: string;
  is_processed?: boolean;
};

export type PaymentTransactionQueryParams = {
  page: number;
  gateway?: string;
  status?: PaymentTransactionStatus;
  transaction_id?: string;
};

export type PaymentPayable = {
  type: string;
  id: number | string;
  uuid: string;
};

export type PaymentGatewayUser = {
  id: string;
  name: string;
  mobile: string;
};

export type PaymentTransactionSource = {
  type?: string | null;
  company?: string | null;
  number?: string | null;
  dpan?: string | null;
  issuer_card_type?: string | null;
  issuer_card_category?: string | null;
  issuer_name?: string | null;
};

export type PaymentTransactionResponse = Record<string, unknown> & {
  data?: {
    source?: PaymentTransactionSource | null;
  } | null;
};

export type PaymentTransaction = {
  id: string;
  transaction_id: string;
  status: PaymentTransactionStatus;
  amount: number;
  payment_gateway: string;
  transaction_response: PaymentTransactionResponse | null;
  created_at: string;
  updated_at: string;
};

export type PaymentCheckout = {
  id: string;
  amount: number;
  currency: string;
  payment_gateway: string;
  is_processed: boolean;
  payable: PaymentPayable | null;
  user: PaymentGatewayUser | null;
  transactions: PaymentTransaction[];
  request_body: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
};

export type PaymentTransactionsAnalytics = {
  total: number;
  paid: number;
  failed: number;
  initiated: number;
};

export type PaymentCheckoutsListResponse = {
  error?: boolean;
  message?: string;
  data: PaymentCheckout[];
  meta: PaymentGatewaysPaginationMeta;
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
  analytics: PaymentTransactionsAnalytics;
  meta: PaymentGatewaysPaginationMeta;
};

export type PaymentTransactionDetailResponse = {
  error?: boolean;
  message?: string;
  data: PaymentTransaction;
};

export type PaymentGatewayStatCard = {
  label: string;
  value: number;
  icon: React.ReactNode;
  iconBg: string;
};
