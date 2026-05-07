import {
  BatteryCharging,
  Bike,
  Boxes,
  DollarSign,
  Gauge,
  MapPinned,
  MoreHorizontal,
  ShoppingCart,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import type {
  ChartPoint,
  DashboardStat,
  FleetMarker,
  OrderDistribution,
  QuickStat,
  RevenuePoint,
  TopModel,
} from "@/types";

export const weekDays = [
  "السبت",
  "الأحد",
  "الإثنين",
  "الثلاثاء",
  "الأربعاء",
  "الخميس",
  "الجمعة",
] as const;

function sortByWeekDay<T extends { label: string }>(items: T[]) {
  return [...items].sort(
    (left, right) =>
      weekDays.indexOf(left.label as (typeof weekDays)[number]) -
      weekDays.indexOf(right.label as (typeof weekDays)[number]),
  );
}

export const dashboardStats: DashboardStat[] = [
  {
    title: "متوسط قيمة الطلب",
    value: "298 ر.س",
    delta: "5.3٪",
    comparison: "مقارنة بالأسبوع الماضي",
    direction: "up",
    icon: TrendingUp,
  },
  {
    title: "المنتجات",
    value: "1,247",
    delta: "2.4٪",
    comparison: "مقارنة بالأسبوع الماضي",
    direction: "down",
    icon: Boxes,
  },
  {
    title: "الإيرادات",
    value: "1,247",
    delta: "2.4٪",
    comparison: "مقارنة بالأسبوع الماضي",
    direction: "down",
    icon: DollarSign,
  },
  {
    title: "الطلبات",
    value: "507",
    delta: "12.5٪",
    comparison: "مقارنة بالأسبوع الماضي",
    direction: "up",
    icon: ShoppingCart,
  },
];

export const revenueChart: ChartPoint[] = sortByWeekDay([
  { label: "السبت", current: 142, previous: 118 },
  { label: "الأحد", current: 158, previous: 112 },
  { label: "الإثنين", current: 149, previous: 106 },
  { label: "الثلاثاء", current: 171, previous: 96 },
  { label: "الأربعاء", current: 156, previous: 88 },
  { label: "الخميس", current: 246, previous: 132 },
  { label: "الجمعة", current: 215, previous: 121 },
]);

export const chartTicks = ["0k", "65k", "130k", "195k", "260k"];

export const quickStats: QuickStat[] = [
  {
    title: "إجمالي الأصول",
    value: "4,237",
    delta: "12.4٪",
    direction: "up",
    icon: Bike,
    lineColor: "#ffce27",
    chart: [42, 44, 46, 48, 51, 53],
  },
  {
    title: "أصول قيد الشحن",
    value: "3,891",
    delta: "3.2٪",
    direction: "up",
    icon: Sparkles,
    lineColor: "#22c55e",
    chart: [28, 30, 31, 34, 36, 38],
  },
  {
    title: "المركبات المعطلة",
    value: "186",
    delta: "2.1٪",
    direction: "down",
    icon: BatteryCharging,
    lineColor: "#ef4444",
    chart: [39, 37, 36, 35, 34, 36],
  },
  {
    title: "معدل الاستخدام",
    value: "78.4٪",
    delta: "4.9٪",
    direction: "up",
    icon: Gauge,
    lineColor: "#3b82f6",
    chart: [16, 18, 19, 21, 23, 25],
  },
];

export const orderDistribution: OrderDistribution[] = sortByWeekDay([
  { label: "السبت", value: 45 },
  { label: "الأحد", value: 68 },
  { label: "الإثنين", value: 52 },
  { label: "الثلاثاء", value: 89 },
  { label: "الأربعاء", value: 76 },
  { label: "الخميس", value: 94 },
  { label: "الجمعة", value: 81 },
]);

export const weeklyRevenue: RevenuePoint[] = sortByWeekDay([
  { label: "السبت", value: 12 },
  { label: "الأحد", value: 20 },
  { label: "الإثنين", value: 15 },
  { label: "الثلاثاء", value: 24 },
  { label: "الأربعاء", value: 22 },
  { label: "الخميس", value: 30 },
  { label: "الجمعة", value: 28 },
]);

export const fleetMarkers: FleetMarker[] = [
  { id: 1, x: "12%", y: "72%", charge: "95٪", accent: "yellow" },
  { id: 2, x: "22%", y: "38%", charge: "88٪", accent: "green" },
  { id: 3, x: "34%", y: "18%", charge: "78٪", accent: "yellow" },
  { id: 4, x: "41%", y: "62%", charge: "92٪", accent: "green" },
  { id: 5, x: "54%", y: "44%", charge: "85٪", accent: "yellow" },
  { id: 6, x: "66%", y: "26%", charge: "100٪", accent: "green" },
  { id: 7, x: "76%", y: "58%", charge: "78٪", accent: "yellow" },
  { id: 8, x: "84%", y: "34%", charge: "92٪", accent: "green" },
  { id: 9, x: "58%", y: "78%", charge: "85٪", accent: "yellow" },
];

export const topModels: TopModel[] = [
  {
    id: "sct-urb-01",
    category: "سكوتر",
    model: "EV-Urban Pro",
    sku: "SCT-URB-01",
    orders: "507",
    performance: "24.5٪",
    direction: "up",
    icon: Bike,
  },
  {
    id: "bik-cty-02",
    category: "دراجة كهربائية",
    model: "City-Glide",
    sku: "BIK-CTY-02",
    orders: "507",
    performance: "12.8٪",
    direction: "up",
    icon: MoreHorizontal,
  },
  {
    id: "bik-trl-04",
    category: "دراجة جبلية",
    model: "E-Trail X1",
    sku: "BIK-TRL-04",
    orders: "507",
    performance: "3.4٪",
    direction: "down",
    icon: MapPinned,
  },
];
