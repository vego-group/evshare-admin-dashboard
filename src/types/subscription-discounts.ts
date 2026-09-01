export type SubscriptionDiscountType = "percentage" | "fixed";
export type SubscriptionDiscountStatus = "active" | "inactive";

export type SubscriptionDiscount = {
  id: string;
  name: string;
  name_ar: string | null;
  name_en: string | null;
  type: SubscriptionDiscountType;
  value: number;
  is_active: boolean;
  is_running: boolean;
  start_date: string | null;
  end_date: string | null;
  created_at: string;
};

export type SubscriptionDiscountQueryParams = {
  page: number;
  limit: number;
  status?: SubscriptionDiscountStatus;
  type?: SubscriptionDiscountType;
};

export type SubscriptionDiscountPayload = {
  type?: SubscriptionDiscountType;
  value?: number;
  is_active?: boolean;
  start_date?: string | null;
  end_date?: string | null;
  name_ar?: string | null;
  name_en?: string | null;
};

export type SubscriptionDiscountListResponse = {
  error: boolean;
  message: string;
  data: SubscriptionDiscount[];
  meta: { currentPage: number; lastPage: number; perPage: number; total: number };
};

export type SubscriptionDiscountResponse = {
  error: boolean;
  message: string;
  data: SubscriptionDiscount;
};

export type CurrentSubscriptionPricingResponse = {
  error: boolean;
  message: string;
  data: {
    discount: SubscriptionDiscount | null;
    base_price: number;
    discount_amount: number;
    final_price: number;
  };
};
