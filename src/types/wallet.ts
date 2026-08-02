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
  title: string;
  credit: number;
  debit: number;
  balance: number;
  status: WalletTransactionStatus;
  user_id: number;
  created_at: string;
};

export type WalletTransactionDetails = WalletTransaction & {
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
  total_balance: number;
  reserved_amounts: number;
  monthly_profits: number;
  monthly_transactions_count: number;
  pending_settlement: number;
};

export type WalletChartEntry = {
  date: string;
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
