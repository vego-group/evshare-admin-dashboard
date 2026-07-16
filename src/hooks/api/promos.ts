import { promosAPI, singlePromoAPI } from "@/services/queries";
import type { PromoCodesQueryParams } from "@/types";

import { useCustomQuery } from "..";

export function usePromos(params: PromoCodesQueryParams) {
  return useCustomQuery(["promos", params], async () => promosAPI(params));
}

export function usePromo(promoId: string | null) {
  return useCustomQuery(
    ["promo", promoId],
    async () => singlePromoAPI(promoId!),
    { enabled: Boolean(promoId) },
  );
}
