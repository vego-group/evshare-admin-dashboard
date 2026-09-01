import { buildQuery } from "@/lib/utils/build-query";
import type { CurrentSubscriptionPricingResponse, SubscriptionDiscountListResponse, SubscriptionDiscountQueryParams, SubscriptionDiscountResponse } from "@/types";
import { baseAPI } from "..";

export const subscriptionDiscountsAPI = async (params: SubscriptionDiscountQueryParams): Promise<SubscriptionDiscountListResponse> => {
  const query = buildQuery({ page: params.page.toString(), limit: params.limit.toString(), status: params.status, type: params.type });
  return baseAPI("GET", `/subscription-discounts?${query}`);
};

export const currentSubscriptionPricingAPI = async (): Promise<CurrentSubscriptionPricingResponse> =>
  baseAPI("GET", "/subscription-discounts/current");

export const singleSubscriptionDiscountAPI = async (id: string): Promise<SubscriptionDiscountResponse> =>
  baseAPI("GET", `/subscription-discounts/${id}`);
