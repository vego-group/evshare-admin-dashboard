import { z } from "zod";
import type { DriverPricingSettingKey } from "@/types";

const decimalKeys = new Set<DriverPricingSettingKey>([
  "trip_min_start_balance", "wallet_low_balance_threshold",
  "wallet_critical_balance_threshold", "wallet_min_top_up_amount",
  "wallet_max_top_up_amount",
]);

export function driverPricingSettingSchema(key: DriverPricingSettingKey) {
  return z.object({
    value: z.string().trim().min(1, "القيمة مطلوبة").superRefine((value, ctx) => {
      if (key === "wallet_suggested_top_up_amounts") {
        const amounts = value.split(",").map((item) => item.trim());
        if (amounts.some((item) => !item || !Number.isFinite(Number(item)) || Number(item) <= 0)) {
          ctx.addIssue({ code: "custom", message: "أدخل مبالغ موجبة مفصولة بفواصل، مثال: 50,100,200" });
        }
        return;
      }
      const number = Number(value);
      const allowsZero = key === "trip_free_cancellation_window_seconds";
      if (!Number.isFinite(number) || (allowsZero ? number < 0 : number <= 0)) {
        ctx.addIssue({ code: "custom", message: allowsZero ? "أدخل صفراً أو رقماً موجباً" : "أدخل رقماً أكبر من صفر" });
      } else if (!decimalKeys.has(key) && !Number.isInteger(number)) {
        ctx.addIssue({ code: "custom", message: "أدخل عدداً صحيحاً" });
      }
    }),
  });
}

export type DriverPricingSettingFormValues = { value: string };
