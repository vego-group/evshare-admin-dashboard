import type { FieldErrors, UseFormRegister } from "react-hook-form";

import type { ShipmentFormValues } from "@/schemas/shipments";
import CurrencyAdornment from "@/components/ui/currency-adornment";
import { useCurrencyInputPadding } from "@/provider/currency";
import { preventNegativeNumberInput, preventNegativeNumberPaste } from "@/lib/utils/non-negative-input";

import { Field, inputClassLtr } from "./form-field";

type ShipmentPackageFieldsProps = {
  isEdit: boolean;
  errors: FieldErrors<ShipmentFormValues>;
  register: UseFormRegister<ShipmentFormValues>;
};

const numberInputClass = `${inputClassLtr} [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none`;

const sharedFields = [
  { name: "price", label: "تكلفة الشحن", placeholder: "13.92", step: "0.01", currency: true },
  { name: "cod_amount", label: "مبلغ التحصيل", placeholder: "0", step: "0.01", currency: true },
  { name: "package_count", label: "عدد الطرود", placeholder: "1", step: "1", currency: false },
  { name: "package_weight", label: "الوزن (كجم)", placeholder: "25", step: "0.01", currency: false },
  { name: "box_width", label: "العرض (سم)", placeholder: "30", step: "0.01", currency: false },
  { name: "box_length", label: "الطول (سم)", placeholder: "30", step: "0.01", currency: false },
  { name: "box_height", label: "الارتفاع (سم)", placeholder: "30", step: "0.01", currency: false },
] as const;

const addOnlyFields = [
  {
    name: "declared_value",
    label: "القيمة المعلنة",
    placeholder: "1150",
    step: "0.01",
    currency: true,
  },
] as const;

function ShipmentPackageFields({
  isEdit,
  errors,
  register,
}: ShipmentPackageFieldsProps) {
  const currencyInputPadding = useCurrencyInputPadding();
  const fields = isEdit ? sharedFields : [...sharedFields, ...addOnlyFields];

  return (
    <>
      {fields.map((field) => (
        <Field
          key={field.name}
          label={field.label}
          error={errors[field.name]?.message}
        >
          <div className="relative">
          <input
            type="number"
            step={field.step}
            min="0"
            dir="ltr"
            placeholder={field.placeholder}
            className={`${numberInputClass} ${field.currency ? currencyInputPadding : ""}`}
            {...register(field.name)}
            onKeyDown={(event) => preventNegativeNumberInput(event, { allowDecimal: field.step !== "1" })}
            onPaste={(event) => preventNegativeNumberPaste(event, { allowDecimal: field.step !== "1" })}
          />
          {field.currency ? <CurrencyAdornment absolute className="text-xs text-primary" /> : null}
          </div>
        </Field>
      ))}
    </>
  );
}

export default ShipmentPackageFields;
