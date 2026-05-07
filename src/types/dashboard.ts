import type { LucideIcon } from "lucide-react";

export type TrendDirection = "up" | "down";

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
