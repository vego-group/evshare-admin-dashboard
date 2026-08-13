import { z } from "zod";

const emptyToUndefined = (value: unknown) =>
  value === "" || value === null || value === undefined ? undefined : value;

const optionalPositiveInt = z.preprocess(
  emptyToUndefined,
  z.coerce.number().int().positive("يجب أن يكون رقمًا صحيحًا موجبًا").optional(),
);

const optionalNonNegativeNumber = z.preprocess(
  emptyToUndefined,
  z.coerce.number().min(0, "القيمة يجب أن تكون 0 أو أكثر").optional(),
);

const optionalText = z.string().trim().optional().or(z.literal(""));

const optionalUrl = z
  .union([
    z.literal(""),
    z.url("من فضلك أدخل رابطًا صحيحًا").max(2048, "الحد الأقصى 2048 حرفًا"),
  ])
  .optional();

export const shipmentFormObject = z.object({
  order_uuid: optionalText,
  shipping_company_uuid: optionalText,
  delivery_option_id: optionalText,
  tracking_id: optionalText,
  shipping_id: optionalText,
  picking_type: z.enum(["PICKUP_BY_DC", "BRANCH_DROP_OFF"]),
  price: optionalNonNegativeNumber,
  cod_amount: optionalNonNegativeNumber,
  declared_value: optionalNonNegativeNumber,
  currency: z
    .string()
    .trim()
    .max(3, "رمز العملة من 3 أحرف")
    .optional()
    .or(z.literal("")),
  package_count: optionalPositiveInt,
  package_weight: optionalNonNegativeNumber,
  box_width: optionalNonNegativeNumber,
  box_length: optionalNonNegativeNumber,
  box_height: optionalNonNegativeNumber,
  tracking_url: optionalUrl,
  awb_url: optionalUrl,
  driver_name: optionalText,
  driver_phone: optionalText,
  estimated_pickup_date: optionalText,
  estimated_delivery_date: optionalText,
  notes: z.string().max(1000, "الحد الأقصى 1000 حرف").optional().or(z.literal("")),
});

const isDeliveryAfterPickup = (data: {
  estimated_pickup_date?: string;
  estimated_delivery_date?: string;
}) =>
  !data.estimated_pickup_date ||
  !data.estimated_delivery_date ||
  data.estimated_delivery_date >= data.estimated_pickup_date;

const dateOrderIssue: { message: string; path: PropertyKey[] } = {
  message: "تاريخ التسليم يجب أن يكون بعد تاريخ الاستلام",
  path: ["estimated_delivery_date"],
};

export const shipmentSchema = shipmentFormObject.refine(
  isDeliveryAfterPickup,
  dateOrderIssue,
);

export const shipmentAddSchema = shipmentFormObject
  .extend({ order_uuid: z.string().trim().min(1, "الطلب مطلوب") })
  .refine(isDeliveryAfterPickup, dateOrderIssue);

export const shipmentStatusSchema = z.object({
  status: z.enum(
    [
      "pending",
      "action_required",
      "created",
      "picked_up",
      "in_transit",
      "out_for_delivery",
      "failed_attempt",
      "delivered",
      "returned",
      "cancelled",
      "lost",
    ],
    { error: "الحالة مطلوبة" },
  ),
  description: z.string().max(1000, "الحد الأقصى 1000 حرف").optional().or(z.literal("")),
});

export const shipmentCancelSchema = z.object({
  reason: z.string().max(1000, "الحد الأقصى 1000 حرف").optional().or(z.literal("")),
});

export type ShipmentFormValues = z.infer<typeof shipmentFormObject>;
export type ShipmentStatusFormValues = z.infer<typeof shipmentStatusSchema>;
export type ShipmentCancelFormValues = z.infer<typeof shipmentCancelSchema>;
