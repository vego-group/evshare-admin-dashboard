import type { LucideIcon } from "lucide-react";

export type TrendDirection = "up" | "down" | "flat";
export type DashboardPeriod = 7 | 14 | 30 | 90;

export type DashboardAnalyticsQueryParams = {
  period?: DashboardPeriod;
  from?: string;
  to?: string;
  granularity?: "day" | "week" | "month";
  compare?: "previous_period" | "previous_year" | "none";
};

export type DashboardMeasureId =
  | "revenue.orders" | "revenue.trips" | "revenue.subscriptions" | "revenue.total"
  | "trips.completed" | "trips.cancelled" | "trips.distance_km"
  | "users.registered" | "users.active_riders"
  | "fleet.vehicles_added" | "fleet.utilization";

export type DashboardSeriesPoint = { ts: string; value: number; has_data: boolean };
export type DashboardMeasure = {
  id: DashboardMeasureId;
  group: string;
  unit: "currency" | "count" | "km" | "percent";
  definition: string;
  current: { total: number; from: string | null; to: string | null };
  comparison: { available: boolean; total: number | null; from: string | null; to: string | null };
  change: { absolute: number | null; percent: number | null; direction: TrendDirection | null; rule: string; comparison_available: boolean };
  series: { granularity: "day" | "week" | "month" | null; points: DashboardSeriesPoint[]; comparison_points: DashboardSeriesPoint[] | null };
};

export type DashboardAnalyticsMeta = {
  schema_version: string;
  generated_at: string;
  timezone: string;
  currency: string;
  window: { from: string; to: string; days: number; granularity: "day" | "week" | "month"; timezone: string };
  comparison: { mode: "previous_period" | "previous_year" | "none"; window: { from: string; to: string; days: number; granularity: "day" | "week" | "month"; timezone: string } | null };
  rules: { percent_change: string; null_when: string; direction: string; buckets: string; currency: string };
};

export type DashboardTrendCard = {
  value: number;
  trend: number;
  is_up: boolean;
};

export type DashboardRevenueSeriesEntry = {
  date: string;
  day_name: string;
  current: number;
  previous: number;
};

export type DashboardPeakDay = {
  name: string | null;
  value: number;
};

export type DashboardRevenueChart = {
  total: number;
  daily_average: number;
  peak_day: DashboardPeakDay;
  series: DashboardRevenueSeriesEntry[];
};

export type DashboardAssetsStats = {
  total: number;
  charging: number;
  maintenance: number;
  utilization_rate: number;
};

export type DashboardAnalyticsData = {
  meta: DashboardAnalyticsMeta;
  measures: Record<DashboardMeasureId, DashboardMeasure>;
  top_cards: {
    orders: DashboardTrendCard;
    revenues: DashboardTrendCard;
    products: DashboardTrendCard;
    average_order_value: DashboardTrendCard;
  };
  revenue_chart: DashboardRevenueChart;
  assets: DashboardAssetsStats;
};

export type DashboardAnalyticsResponse = {
  error: boolean;
  message: string;
  data: DashboardAnalyticsData;
};

export type DashboardStat = {
  title: string;
  value: string;
  delta: string;
  comparison: string;
  direction: TrendDirection;
  icon: LucideIcon;
};

export type QuickStat = {
  title: string;
  value: string;
  delta: string;
  direction: TrendDirection;
  icon: LucideIcon;
  lineColor: string;
  chart: number[];
};

export type ChartPoint = {
  label: string;
  current: number | null;
  previous: number | null;
};

export type OrderDistribution = {
  label: string;
  value: number;
};

export type RevenuePoint = {
  label: string;
  value: number;
};

export type FleetMarker = {
  id: number;
  x: string;
  y: string;
  charge: string;
  accent: "yellow" | "green";
};

export type TopModel = {
  id: string;
  category: string;
  model: string;
  sku: string;
  orders: string;
  performance: string;
  direction: TrendDirection;
  icon: LucideIcon;
};
