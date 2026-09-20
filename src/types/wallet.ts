import type { OrderBy } from ".";

export type WalletTransactionStatus = "pending" | "completed" | "rejected";
export type WalletChartDays = 7 | 30 | 90;

export type WalletQueryParams = {
  page: string;
  limit: string;
  days?: WalletChartDays;
  status?: WalletTransactionStatus;
  order_by?: OrderBy;
};

export type WalletTransaction = {
  id: string;
  currency?: string;
  title: string;
  credit: number;
  debit: number;
  balance: number;
  status: WalletTransactionStatus;
  user_id: number;
  created_at: string;
};

export type WalletTransactionDetails = WalletTransaction & {
  trace_id?: string | null;
  payment_request_id?: string | null;
  provider_transaction_id?: string | null;
  provider_event_id?: string | null;
  user?: {
    id: string;
    name: string;
    mobile: string;
    bank_account: string | null;
    role: string;
  } | null;
  reference?: {
    type: string;
    id: string;
  } | null;
};

export type WalletPaginationMeta = {
  currentPage: number;
  lastPage: number;
  perPage: number;
  total: number;
};

export type WalletAnalytics = {
  currency?: string;
  total_balance: number;
  reserved_amounts: number;
  monthly_profits: number;
  monthly_transactions_count: number;
  pending_settlement: number;
};

export type WalletChartEntry = {
  date: string;
  currency?: string;
  total_credit: number;
  total_debit: number;
  total_balance: number;
};

export type WalletListResponse = {
  error: boolean;
  message: string;
  data: WalletTransaction[];
  meta: WalletPaginationMeta;
  analytics: WalletAnalytics;
  chart_data: WalletChartEntry[];
};

export type WalletTransactionDetailsResponse = {
  error: boolean;
  message: string;
  data: WalletTransactionDetails;
};
