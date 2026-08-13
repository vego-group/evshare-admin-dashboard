import { useCustomQuery } from "..";
import { shippingCitiesAPI, singleShippingCityAPI } from "@/services/queries";
import type { ShippingCitiesQueryParams } from "@/types";

export function useShippingCities(params: ShippingCitiesQueryParams) {
  return useCustomQuery(["shipping-cities", params], async () =>
    shippingCitiesAPI(params),
  );
}

export function useShippingCity(shippingCityId: string | null) {
  return useCustomQuery(
    ["shipping-city", shippingCityId],
    async () => singleShippingCityAPI(shippingCityId!),
    { enabled: Boolean(shippingCityId) },
  );
}
