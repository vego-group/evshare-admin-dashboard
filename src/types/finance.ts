export type VatStatus = "pending" | "due" | "partially_paid" | "paid" | "overdue";

export type VatQueryParams = {
  date_from?: string;
  date_to?: string;
  status?: VatStatus;
  period?: string;
  page?: number;
  limit?: number;
};

export type VatSummary = {
  total_vat: number;
  vat_due: number;
  vat_paid: number;
  vat_remaining: number;
  currency: string;
  vat_rate: number;
  as_of: string;
};

export type VatSummaryResponse = {
  error: boolean;
  message: string;
  data: VatSummary;
};

export type VatRecordOrderCustomer = {
  id: string;
  name: string;
};

export type VatRecordOrder = {
  id: string;
  code: string;
  status: string;
  total: number;
  customer: VatRecordOrderCustomer;
};

export type VatRecord = {
  id: string;
  reference: string;
  date: string;
  period: string;
  base_amount: number;
  vat_rate: number;
  vat_amount: number;
  due_date: string;
  status: VatStatus;
  period_vat_paid: number;
  period_vat_remaining: number;
  order: VatRecordOrder;
};

export type VatPaginationMeta = {
  currentPage: number;
  lastPage: number;
  perPage: number;
  total: number;
};

export type VatRecordsResponse = {
  error: boolean;
  message: string;
  data: VatRecord[];
  meta: VatPaginationMeta;
};

export type VatPeriod = {
  period: string;
  orders_count: number;
  base_amount: number;
  vat_amount: number;
  vat_paid: number;
  vat_remaining: number;
  due_date: string;
  status: VatStatus;
};

export type VatPeriodsResponse = {
  error: boolean;
  message: string;
  data: VatPeriod[];
};

export type VatSettlement = {
  id: string;
  period: string;
  amount: number;
  paid_at: string;
  notes: string | null;
  recorded_by: {
    id: string;
    name: string;
  };
  created_at: string;
};

export type VatSettlementsQueryParams = {
  period?: string;
  date_from?: string;
  date_to?: string;
  page?: number;
  limit?: number;
};

export type VatSettlementsResponse = {
  error: boolean;
  message: string;
  data: VatSettlement[];
  meta: VatPaginationMeta;
};

export type AddVatSettlementPayload = {
  period: string;
  amount: number;
  paid_at: string;
  notes?: string;
};

export type VatSettlementDetailResponse = {
  error: boolean;
  message: string;
  data: VatSettlement;
};
