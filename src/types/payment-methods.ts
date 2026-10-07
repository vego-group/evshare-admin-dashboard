export const paymentMethodStatuses = ["all", "active", "inactive"] as const;
export const paymentMethodAvailability = ["orders", "subscriptions"] as const;

export type PaymentMethodStatus = (typeof paymentMethodStatuses)[number];
export type PaymentMethodAvailability = (typeof paymentMethodAvailability)[number];
export type PaymentMethodAvailabilityFilter = PaymentMethodAvailability | "all";

export type PaymentMethodsQueryParams = {
  page?: number;
  per_page?: number;
  /** Backward-compatible UI alias. New requests are sent as per_page. */
  limit?: number;
  search?: string;
  status?: PaymentMethodStatus;
  available_for?: PaymentMethodAvailabilityFilter;
};

export type PaymentMethodGatewaySummary = {
  key: string;
  name: string;
  is_active: boolean;
};

export type PaymentMethod = {
  id: string;
  key: string;
  name_ar: string;
  name_en: string;
  name: string;
  is_active: boolean;
  available_for: PaymentMethodAvailability[];
  payment_gateway: PaymentMethodGatewaySummary | null;
  sort_order: number;
  created_at: string;
  updated_at?: string;
};

export type PaymentMethodsPaginationMeta = {
  currentPage: number;
  lastPage: number;
  perPage: number;
  total: number;
};

export type PaymentMethodsStatistics = {
  total: number;
  active: number;
  inactive: number;
  available_for_orders: number;
  available_for_subscriptions: number;
};

export type PaymentMethodsListResponse = {
  error: boolean;
  message: string;
  data: PaymentMethod[];
  meta?: PaymentMethodsPaginationMeta;
  statistics?: PaymentMethodsStatistics;
  /** Temporary backend alias retained for compatibility during rollout. */
  analysis?: PaymentMethodsStatistics;
};

export type PaymentMethodDetailsResponse = {
  error: boolean;
  message: string;
  data: PaymentMethod;
};

export type PaymentMethodPayload = {
  name_ar: string;
  name_en: string;
  is_active: boolean;
  available_for: PaymentMethodAvailability[];
};

export type UpdatePaymentMethodPayload = Partial<PaymentMethodPayload>;
