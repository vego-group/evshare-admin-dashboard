import { dashboardAnalyticsAPI } from "@/services/queries";
import { useCustomQuery } from "..";
import type { DashboardAnalyticsQueryParams } from "@/types";

export function useDashboardAnalytics(params: DashboardAnalyticsQueryParams = {}) {
  return useCustomQuery(["dashboard-analytics", params], async () =>
    dashboardAnalyticsAPI(params),
  );
}
