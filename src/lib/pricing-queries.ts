import type { QueryClient } from "@tanstack/react-query";

const PRICING_QUERY_ROOTS = [
  "commission-settings",
  "promos",
  "subscription-discounts",
  "driver-pricing-settings",
  "settings",
  "vehicles",
  "vehicles-all",
  "vehicle",
  "trips",
  "trip",
  "orders",
  "order ",
] as const;

/** Refresh every view that can expose an amount derived from pricing config. */
export async function invalidatePricingQueries(queryClient: QueryClient) {
  await Promise.all(
    PRICING_QUERY_ROOTS.map((root) =>
      queryClient.invalidateQueries({ queryKey: [root] }),
    ),
  );
}
