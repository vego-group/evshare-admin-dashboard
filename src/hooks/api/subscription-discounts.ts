import { currentSubscriptionPricingAPI, singleSubscriptionDiscountAPI, subscriptionDiscountsAPI } from "@/services/queries";
import type { SubscriptionDiscountQueryParams } from "@/types";
import { useCustomQuery } from "..";

export const useSubscriptionDiscounts = (params: SubscriptionDiscountQueryParams) =>
  useCustomQuery(["subscription-discounts", params], () => subscriptionDiscountsAPI(params));
export const useCurrentSubscriptionPricing = () =>
  useCustomQuery(["subscription-discounts", "current"], currentSubscriptionPricingAPI);
export const useSubscriptionDiscount = (id: string | null) =>
  useCustomQuery(["subscription-discount", id], () => singleSubscriptionDiscountAPI(id!), { enabled: Boolean(id) });
