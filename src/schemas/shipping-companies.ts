import { z } from "zod";

const emptyToUndefined = (value: unknown) =>
  value === "" || value === null || value === undefined ? undefined : value;

const optionalNonNegativeNumber = z.preprocess(
  emptyToUndefined,
  z.coerce.number().min(0, "القيمة يجب أن تكون 0 أو أكثر").optional(),
);

const optionalText = z.string().trim().optional().or(z.literal(""));

export const shippingCompanySchema = z.object({
  name_ar: z
    .string()
    .trim()
    .min(1, "الاسم العربي مطلوب")
    .max(255, "الحد الأقصى 255 حرفًا"),
  name_en: z
    .string()
    .trim()
    .min(1, "الاسم الإنجليزي مطلوب")
    .max(255, "الحد الأقصى 255 حرفًا"),
  code: z
    .string()
    .trim()
    .min(1, "كود الناقل مطلوب")
    .max(100, "الحد الأقصى 100 حرف"),
  shipping_id: optionalText,
  service_type: z
    .enum([
      "express",
      "sameDay",
      "pudo",
      "lockerDelivery",
      "coldDelivery",
      "heavyAndBulky",
    ])
    .optional(),
  delivery_type: z
    .enum(["toCustomerDoorstep", "pickupByCustomer", "locker"])
    .optional(),
  logo_url: z
    .union([
      z.literal(""),
      z.url("من فضلك أدخل رابطًا صحيحًا").max(2048, "الحد الأقصى 2048 حرفًا"),
    ])
    .optional(),
  avg_delivery_time: optionalText,
  base_price: optionalNonNegativeNumber,
  cod_charge: optionalNonNegativeNumber,
  return_fee: optionalNonNegativeNumber,
  max_free_weight: optionalNonNegativeNumber,
  extra_weight_per_kg: optionalNonNegativeNumber,
  max_order_value: optionalNonNegativeNumber,
  max_cod_value: optionalNonNegativeNumber,
  supports_cod: z.boolean(),
  active: z.boolean(),
  sort_order: z.preprocess(
    emptyToUndefined,
    z.coerce.number().int().min(0, "القيمة يجب أن تكون 0 أو أكثر").optional(),
  ),
});

export type ShippingCompanyFormValues = z.infer<typeof shippingCompanySchema>;
