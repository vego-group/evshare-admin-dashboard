import type { FieldErrors, UseFormRegister } from "react-hook-form";

import type { ShippingCompanyFormValues } from "@/schemas/shipping-companies";
import CurrencyAdornment from "@/components/ui/currency-adornment";
import { useCurrencyInputPadding } from "@/provider/currency";
import { preventNegativeNumberInput, preventNegativeNumberPaste } from "@/lib/utils/non-negative-input";

import { Field, inputClassLtr } from "./form-field";

type PricingFieldsProps = {
  errors: FieldErrors<ShippingCompanyFormValues>;
  register: UseFormRegister<ShippingCompanyFormValues>;
};

const numericFields = [
  { name: "base_price", label: "السعر الأساسي", placeholder: "13.92", currency: true },
  { name: "cod_charge", label: "رسوم الدفع عند الاستلام", placeholder: "8", currency: true },
  { name: "return_fee", label: "رسوم الإرجاع", placeholder: "13", currency: true },
  { name: "max_free_weight", label: "الوزن المجاني (كجم)", placeholder: "15", currency: false },
  {
    name: "extra_weight_per_kg",
    label: "رسوم الكيلو الإضافي",
    placeholder: "1",
    currency: true,
  },
  { name: "max_order_value", label: "أقصى قيمة للطلب", placeholder: "10000", currency: true },
  { name: "max_cod_value", label: "أقصى مبلغ تحصيل", placeholder: "5000", currency: true },
] as const;

function ShippingCompanyPricingFields({
  errors,
  register,
}: PricingFieldsProps) {
  const currencyInputPadding = useCurrencyInputPadding();
  return (
    <>
      {numericFields.map((field) => (
        <Field
          key={field.name}
          label={field.label}
          error={errors[field.name]?.message}
        >
          <div className="relative">
          <input
            type="number"
            step="0.01"
            min="0"
            dir="ltr"
            placeholder={field.placeholder}
            className={`${inputClassLtr} ${field.currency ? currencyInputPadding : ""} [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none`}
            {...register(field.name)}
            onKeyDown={(event) => preventNegativeNumberInput(event, { allowDecimal: true })}
            onPaste={(event) => preventNegativeNumberPaste(event, { allowDecimal: true })}
          />
          {field.currency ? <CurrencyAdornment absolute className="text-xs text-primary" /> : null}
          </div>
        </Field>
      ))}
    </>
  );
}

export default ShippingCompanyPricingFields;
