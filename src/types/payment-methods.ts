export type PaymentMethodsQueryParams = {
  page?: number;
  limit?: number;
  search?: string;
  is_active?: boolean;
};

export type PaymentMethod = {
  id: string;
  name_ar: string;
  name_en: string;
  name: string;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
};

export type PaymentMethodsPaginationMeta = {
  currentPage: number;
  lastPage: number;
  perPage: number;
  total: number;
};

export type PaymentMethodsListResponse = {
  error: boolean;
  message: string;
  data: PaymentMethod[];
  meta: PaymentMethodsPaginationMeta;
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
};

export type UpdatePaymentMethodPayload = Partial<PaymentMethodPayload>;
