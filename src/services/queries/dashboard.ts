import { baseAPI } from "..";
import { buildQuery } from "@/lib/utils/build-query";
import type {
  DashboardAnalyticsQueryParams,
  DashboardAnalyticsResponse,
} from "@/types";

export const dashboardAnalyticsAPI = async (
  params: DashboardAnalyticsQueryParams = {},
): Promise<DashboardAnalyticsResponse> => {
  const query = buildQuery({
    period: params.period,
    from: params.from,
    to: params.to,
    granularity: params.granularity,
    compare: params.compare,
  });

  return await baseAPI(
    "GET",
    `/dashboard/analytics${query ? `?${query}` : ""}`,
  );
};
