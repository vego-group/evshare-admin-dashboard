export type PromoContext = "order" | "subscription" | "both";

export type PromoDiscountType = "percentage" | "fixed";

export type PromoCodesQueryParams = {
  page: number;
  limit: number;
  search?: string;
};

export type PromoListItem = {
  id: string;
  code: string;
  type: PromoContext;
  discount_type: PromoDiscountType;
  discount_value: number;
  max_discount_amount: number | null;
  minimum_order_amount: number | null;
  usage_limit: number | null;
  used_count: number;
  per_user_limit: number | null;
  start_date: string | null;
  end_date: string | null;
  is_active: boolean;
  description_ar: string | null;
  description_en: string | null;
  created_at: string;
};

export type PromoCodesPaginationMeta = {
  currentPage: number;
  lastPage: number;
  perPage: number;
  total: number;
};

export type PromoCodesListResponse = {
  error: boolean;
  message: string;
  data: PromoListItem[];
  meta: PromoCodesPaginationMeta;
};

export type PromoCodeDetailResponse = {
  error: boolean;
  message: string;
  data: PromoListItem;
};

export type PromoCodePayload = {
  code?: string;
  type?: PromoContext;
  discount_type?: PromoDiscountType;
  discount_value?: number;
  max_discount_amount?: number | null;
  minimum_order_amount?: number | null;
  usage_limit?: number | null;
  per_user_limit?: number | null;
  start_date?: string | null;
  end_date?: string | null;
  is_active?: boolean;
  description_ar?: string | null;
  description_en?: string | null;
};
