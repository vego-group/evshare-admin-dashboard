import type { DashboardAnalyticsMeta, DashboardMeasure } from "@/types";

export function formatMeasure(value: number, measure: DashboardMeasure, currency: string, options?: Intl.NumberFormatOptions) {
  if (measure.unit === "currency") {
    return new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: 2, ...options }).format(value);
  }
  return `${new Intl.NumberFormat("en-US", { maximumFractionDigits: 2, ...options }).format(value)}${measure.unit === "percent" ? "%" : measure.unit === "km" ? " km" : ""}`;
}

export function formatChange(measure: DashboardMeasure, meta: DashboardAnalyticsMeta) {
  return measure.change.percent === null ? (
    <span title={meta.rules.null_when} className="text-sm text-gray">n/a</span>
  ) : (
    <span>{new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(Math.abs(measure.change.percent))}%</span>
  );
}

// ISO bucket starts include the tenant offset. Format them in the declared tenant zone.
export function formatBucket(ts: string, timezone: string, granularity: DashboardMeasure["series"]["granularity"]) {
  const date = new Date(ts);
  if (Number.isNaN(date.getTime())) return ts;
  return new Intl.DateTimeFormat("ar-SA", {
    timeZone: timezone,
    ...(granularity === "month" ? { month: "short", year: "numeric" } : { day: "numeric", month: "short" }),
  }).format(date);
}
