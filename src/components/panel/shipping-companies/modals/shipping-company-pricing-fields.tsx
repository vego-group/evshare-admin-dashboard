import type { FieldErrors, UseFormRegister } from "react-hook-form";

import type { ShippingCompanyFormValues } from "@/schemas/shipping-companies";
import { preventNegativeNumberInput, preventNegativeNumberPaste } from "@/lib/utils/non-negative-input";

import { Field, inputClassLtr } from "./form-field";

type PricingFieldsProps = {
  errors: FieldErrors<ShippingCompanyFormValues>;
  register: UseFormRegister<ShippingCompanyFormValues>;
};

const numericFields = [
  { name: "base_price", label: "السعر الأساسي", placeholder: "13.92" },
  { name: "cod_charge", label: "رسوم الدفع عند الاستلام", placeholder: "8" },
  { name: "return_fee", label: "رسوم الإرجاع", placeholder: "13" },
  { name: "max_free_weight", label: "الوزن المجاني (كجم)", placeholder: "15" },
  {
    name: "extra_weight_per_kg",
    label: "رسوم الكيلو الإضافي",
    placeholder: "1",
  },
  { name: "max_order_value", label: "أقصى قيمة للطلب", placeholder: "10000" },
  { name: "max_cod_value", label: "أقصى مبلغ تحصيل", placeholder: "5000" },
] as const;

function ShippingCompanyPricingFields({
  errors,
  register,
}: PricingFieldsProps) {
  return (
    <>
      {numericFields.map((field) => (
        <Field
          key={field.name}
          label={field.label}
          error={errors[field.name]?.message}
        >
          <input
            type="number"
            step="0.01"
            min="0"
            dir="ltr"
            placeholder={field.placeholder}
            className={`${inputClassLtr} [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none`}
            {...register(field.name)}
            onKeyDown={(event) => preventNegativeNumberInput(event, { allowDecimal: true })}
            onPaste={(event) => preventNegativeNumberPaste(event, { allowDecimal: true })}
          />
        </Field>
      ))}
    </>
  );
}

export default ShippingCompanyPricingFields;
