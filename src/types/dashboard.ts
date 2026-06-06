import type { LucideIcon } from "lucide-react";

export type TrendDirection = "up" | "down";
export type DashboardPeriod = 7 | 14 | 30 | 90;

export type DashboardAnalyticsQueryParams = {
  period?: DashboardPeriod;
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
  current: number;
  previous: number;
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
