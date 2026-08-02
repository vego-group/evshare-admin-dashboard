export type PromoContext = "order" | "subscription" | "both";

export type PromoDiscountType = "percentage" | "fixed";

export type PromoStatus = "active" | "inactive" | "expired";

export type PromoCodesQueryParams = {
  page: number;
  limit: number;
  search?: string;
  status?: PromoStatus;
  type?: PromoContext;
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

export type PromoRedemptionUser = {
  id: string;
  name: string;
  mobile: string;
  role: string;
};

export type PromoRedeemableType = "Order" | "Subscription" | null;

export type PromoRedemption = {
  id: number;
  user: PromoRedemptionUser;
  promo_code_used: string;
  discount_amount_applied: number;
  redeemable_type: PromoRedeemableType;
  created_at: string;
};

export type PromoAnalytics = {
  total_redemptions: number;
  unique_users: number;
  total_discount_given: number;
  remaining_uses: number | null;
};

export type PromoDetailData = {
  promo: PromoListItem;
  analytics: PromoAnalytics;
  recent_redemptions: PromoRedemption[];
};

export type PromoCodeDetailResponse = {
  error: boolean;
  message: string;
  data: PromoDetailData;
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
