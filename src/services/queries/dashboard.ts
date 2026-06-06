import { baseAPI } from "..";
import { buildQuery } from "@/lib";
import type {
  DashboardAnalyticsQueryParams,
  DashboardAnalyticsResponse,
} from "@/types";

export const dashboardAnalyticsAPI = async (
  params: DashboardAnalyticsQueryParams = {},
): Promise<DashboardAnalyticsResponse> => {
  const query = buildQuery({
    period: params.period,
  });

  return await baseAPI(
    "GET",
    `/dashboard/analytics${query ? `?${query}` : ""}`,
  );
};
