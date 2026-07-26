import { z } from "zod";

const emptyToUndefined = (value: unknown) =>
  value === "" || value === null || value === undefined ? undefined : value;

const optionalNonNegativeNumber = z.preprocess(
  emptyToUndefined,
  z.coerce.number().min(0, "القيمة يجب أن تكون 0 أو أكثر").optional(),
);

export const testAccountSchema = z.object({
  mobile: z
    .string()
    .trim()
    .regex(/^5\d{8}$/, "من فضلك أدخل رقم جوال صحيح")
    .optional()
    .or(z.literal("")),
  subscription_amount: optionalNonNegativeNumber,
  order_amount: optionalNonNegativeNumber,
  shipping_fee: optionalNonNegativeNumber,
  vat_percentage: z.preprocess(
    emptyToUndefined,
    z.coerce.number().min(0).max(100, "النسبة يجب ألا تتجاوز 100%").optional(),
  ),
  is_active: z.boolean(),
});

export type TestAccountFormValues = z.infer<typeof testAccountSchema>;
