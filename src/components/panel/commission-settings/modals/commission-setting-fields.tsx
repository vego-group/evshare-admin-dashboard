import type { FieldErrors, UseFormRegister, UseFormSetValue } from "react-hook-form";

import InputErrorMessage from "@/components/ui/input-error-message";
import {
  preventNegativeNumberInput,
  preventNegativeNumberPaste,
} from "@/lib/utils/non-negative-input";
import type { CommissionSettingFormValues } from "@/schemas/commission-settings";
import type { CommissionType } from "@/types";

import CommissionTypeDropdown from "./commission-type-dropdown";

type Props = {
  type: CommissionType;
  isActive: boolean;
  errors: FieldErrors<CommissionSettingFormValues>;
  register: UseFormRegister<CommissionSettingFormValues>;
  setValue: UseFormSetValue<CommissionSettingFormValues>;
};

const inputClass =
  "h-12 w-full rounded-xl border border-primary/20 px-4 text-sm outline-none focus:border-primary";

function CommissionSettingFields({ type, isActive, errors, register, setValue }: Props) {
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <label className="text-sm font-medium text-dark-gray">
        الاسم بالعربية
        <input
          placeholder="أدخل الاسم بالعربية"
          className={`${inputClass} mt-2`}
          {...register("name_ar")}
        />
        <InputErrorMessage msg={errors.name_ar?.message} />
      </label>
      <label className="text-sm font-medium text-dark-gray">
        الاسم بالإنجليزية
        <input
          dir="ltr"
          placeholder="Enter name in English"
          className={`${inputClass} mt-2 text-left`}
          {...register("name_en")}
        />
        <InputErrorMessage msg={errors.name_en?.message} />
      </label>

      <label className="text-sm font-medium text-dark-gray">
        نوع العمولة
        <CommissionTypeDropdown value={type} setValue={setValue} />
        <InputErrorMessage msg={errors.type?.message} />
      </label>

      <label className="text-sm font-medium text-dark-gray">
        القيمة
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
          className={`${inputClass} mt-2 text-left [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none`}
          {...register("amount")}
        />
        <InputErrorMessage msg={errors.amount?.message} />
      </label>

      <label className="flex items-center justify-between rounded-xl border border-primary/15 p-4 sm:col-span-2">
        <span>
          <span className="block text-sm font-medium">الحالة</span>
          <span className="text-xs text-gray">تفعيل تطبيق هذه العمولة على المعاملات</span>
        </span>
        <input
          type="checkbox"
          checked={isActive}
          onChange={(event) =>
            setValue("is_active", event.target.checked, { shouldDirty: true, shouldValidate: true })
          }
          className="size-5 accent-primary"
        />
      </label>
    </div>
  );
}

export default CommissionSettingFields;
