import type { FieldErrors, UseFormRegister } from "react-hook-form";

import InputErrorMessage from "@/components/ui/input-error-message";
import CurrencyAdornment from "@/components/ui/currency-adornment";
import { useCurrencyInputPadding } from "@/provider/currency";
import {
  preventNegativeNumberInput,
  preventNegativeNumberPaste,
} from "@/lib/utils/non-negative-input";
import type { VatSettlementFormValues } from "@/schemas/finance";

type Props = {
  errors: FieldErrors<VatSettlementFormValues>;
  register: UseFormRegister<VatSettlementFormValues>;
};

const inputClass =
  "h-12 w-full rounded-xl border border-primary/20 px-4 text-sm outline-none focus:border-primary";

function SettlementFields({ errors, register }: Props) {
  const currencyInputPadding = useCurrencyInputPadding();
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <label className="text-sm font-medium text-dark-gray">
        الفترة
        <input
          type="month"
          dir="ltr"
          className={`${inputClass} mt-2 text-left`}
          {...register("period")}
        />
        <InputErrorMessage msg={errors.period?.message} />
      </label>

      <label className="text-sm font-medium text-dark-gray">
        المبلغ
        <div className="relative mt-2">
        <input
          type="number"
          step="0.01"
          min="0"
          dir="ltr"
          placeholder="0.00"
          onKeyDown={(event) =>
            preventNegativeNumberInput(event, { allowDecimal: true })
          }
          onPaste={(event) => preventNegativeNumberPaste(event, { allowDecimal: true })}
          className={`${inputClass} ${currencyInputPadding} text-left [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none`}
          {...register("amount")}
        />
        <CurrencyAdornment absolute className="text-xs text-primary" />
        </div>
        <InputErrorMessage msg={errors.amount?.message} />
      </label>

      <label className="text-sm font-medium text-dark-gray">
        تاريخ السداد
        <input
          type="date"
          dir="ltr"
          className={`${inputClass} mt-2 text-left`}
          {...register("paid_at")}
        />
        <InputErrorMessage msg={errors.paid_at?.message} />
      </label>

      <label className="text-sm font-medium text-dark-gray sm:col-span-2">
        ملاحظات
        <textarea
          rows={3}
          placeholder="ملاحظات إضافية (اختياري)"
          className="mt-2 w-full rounded-xl border border-primary/20 px-4 py-3 text-sm outline-none focus:border-primary"
          {...register("notes")}
        />
        <InputErrorMessage msg={errors.notes?.message} />
      </label>
    </div>
  );
}

export default SettlementFields;
