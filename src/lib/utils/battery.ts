export function batteryLevel(percentage: number): "low" | "medium" | "high" {
  if (percentage <= 20) return "low";
  if (percentage <= 50) return "medium";
  return "high";
}

const batteryTextClasses = {
  low: "text-red-600",
  medium: "text-orange-500",
  high: "text-green-600",
} as const;

const batteryBarClasses = {
  low: "bg-red-500",
  medium: "bg-orange-500",
  high: "bg-green-500",
} as const;

const batteryHexColors = {
  low: "#dc2626",
  medium: "#f59e0b",
  high: "#16a34a",
} as const;

export function batteryTextClass(percentage: number) {
  return batteryTextClasses[batteryLevel(percentage)];
}

export function batteryBarClass(percentage: number) {
  return batteryBarClasses[batteryLevel(percentage)];
}

export function batteryHexColor(percentage: number) {
  return batteryHexColors[batteryLevel(percentage)];
}
