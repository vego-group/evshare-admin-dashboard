export type PaymentMethodsQueryParams = {
  page?: number;
  limit?: number;
  search?: string;
  is_active?: boolean;
  allowed_user_type?: PaymentMethodAllowedType;
};

export const paymentMethodAllowedTypes = ["merchant", "driver"] as const;

export type PaymentMethodAllowedType =
  (typeof paymentMethodAllowedTypes)[number];

export type PaymentMethod = {
  id: string;
  key?: string;
  name_ar: string;
  name_en: string;
  name: string;
  is_active: boolean;
  allowed_user_types: PaymentMethodAllowedType[];
  publishable_key?: string | null;
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
  meta?: PaymentMethodsPaginationMeta;
  analysis?: PaymentMethodsAnalysis;
};

export type PaymentMethodsAnalysis = {
  total: number;
  active: number;
  inactive: number;
  allowed_merchant?: number;
  allowed_driver?: number;
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
  allowed_user_types: PaymentMethodAllowedType[];
};

export type UpdatePaymentMethodPayload = Partial<PaymentMethodPayload>;
