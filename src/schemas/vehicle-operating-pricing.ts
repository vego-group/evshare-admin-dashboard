import { z } from "zod";

const optionalPrice = z.preprocess(
  (value) => (value === "" || value == null ? undefined : value),
  z.coerce.number().min(0, "Price must be 0 or more").optional(),
);

export const vehiclePricingSchema = z.object({
  status: z.string().trim().optional(),
  operation_company_id: z.preprocess(
    (value) => (value === "" || value == null ? undefined : value),
    z.coerce.number().optional(),
  ),
  open_price: optionalPrice,
  price_per_minute: optionalPrice,
  price_per_km: optionalPrice,
  price_per_hour: optionalPrice,
  price_per_day: optionalPrice,
});

export const contractReviewSchema = z
  .object({
    status: z.enum(["working", "contract_rejected"]),
    rejection_reason: z.string().trim().optional(),
  })
  .refine(
    (value) => value.status === "working" || Boolean(value.rejection_reason),
    { path: ["rejection_reason"], message: "Rejection reason is required" },
  );

export const commissionSchema = z.object({
  commission_percentage: z.preprocess(
    (value) => (value === "" || value == null ? undefined : value),
    z.coerce
      .number({ error: "العمولة مطلوبة" })
      .min(0, "العمولة يجب أن تكون 0 أو أكثر")
      .max(100, "العمولة يجب أن تكون أقل من أو تساوي 100"),
  ),
});

export const vehicleZoneSchema = z
  .object({
    name_ar: z.string().trim().min(1, "الاسم بالعربية مطلوب"),
    name_en: z.string().trim().min(1, "الاسم بالإنجليزية مطلوب"),
    type: z.enum(["slow", "normal"], { error: "نوع المنطقة مطلوب" }),
    speed_limit: z.preprocess(
      (value) => (value === "" || value == null ? undefined : value),
      z.coerce.number().min(0, "حد السرعة يجب أن يكون 0 أو أكثر").optional(),
    ),
    coordinates: z.string().trim().min(1, "يجب رسم حدود المنطقة على الخريطة"),
    is_active: z.boolean(),
  })
  .refine((value) => value.type !== "slow" || value.speed_limit != null, {
    path: ["speed_limit"],
    message: "حد السرعة مطلوب لهذا النوع من المناطق",
  });

export const vehicleCommandSchema = z.object({
  command: z.enum(["lock", "unlock", "sound_alarm"]),
  params: z.record(z.string(), z.unknown()).optional(),
});

export type VehiclePricingSchemaValues = z.infer<typeof vehiclePricingSchema>;
export type ContractReviewValues = z.infer<typeof contractReviewSchema>;
export type CommissionValues = z.infer<typeof commissionSchema>;
export type VehicleZoneValues = z.infer<typeof vehicleZoneSchema>;
export type VehicleCommandValues = z.infer<typeof vehicleCommandSchema>;
