import type { FieldErrors, UseFormRegister, UseFormSetValue } from "react-hook-form";

import InputErrorMessage from "@/components/ui/input-error-message";
import type { PaymentMethodFormValues } from "@/schemas/payment-methods";
import type { PaymentMethodAllowedType } from "@/types";

type Props = {
  isActive: boolean;
  allowedTypes: PaymentMethodAllowedType[];
  errors: FieldErrors<PaymentMethodFormValues>;
  register: UseFormRegister<PaymentMethodFormValues>;
  setValue: UseFormSetValue<PaymentMethodFormValues>;
};

const inputClass = "h-12 w-full rounded-xl border border-primary/20 px-4 text-sm outline-none focus:border-primary";

const allowedTypeOptions: Array<{
  label: string;
  value: PaymentMethodAllowedType;
}> = [
  { label: "تاجر", value: "merchant" },
  { label: "سائق", value: "driver" },
];

function PaymentMethodFields({
  isActive,
  allowedTypes,
  errors,
  register,
  setValue,
}: Props) {
  const toggleAllowedType = (type: PaymentMethodAllowedType) => {
    const nextAllowedTypes = allowedTypes.includes(type)
      ? allowedTypes.filter((value) => value !== type)
      : [...allowedTypes, type];

    setValue("allowed_user_types", nextAllowedTypes, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <label className="text-sm font-medium text-dark-gray">الاسم بالعربية
        <input className={`${inputClass} mt-2`} {...register("name_ar")} />
        <InputErrorMessage msg={errors.name_ar?.message} />
      </label>
      <label className="text-sm font-medium text-dark-gray">الاسم بالإنجليزية
        <input dir="ltr" className={`${inputClass} mt-2 text-left`} {...register("name_en")} />
        <InputErrorMessage msg={errors.name_en?.message} />
      </label>
      <label className="flex items-center justify-between rounded-xl border border-primary/15 p-4 sm:col-span-2">
        <span><span className="block text-sm font-medium">الحالة</span><span className="text-xs text-gray">إتاحة طريقة الدفع للمستخدمين</span></span>
        <input type="checkbox" checked={isActive} onChange={(event) => setValue("is_active", event.target.checked, { shouldDirty: true, shouldValidate: true })} className="size-5 accent-primary" />
      </label>
      <div className="rounded-xl border border-primary/15 p-4 sm:col-span-2">
        <span className="block text-sm font-medium text-dark-gray">
          الأنواع المسموح بها
        </span>
        <span className="mt-1 block text-xs text-gray">
          اختر من يمكنه استخدام طريقة الدفع.
        </span>
        <div className="mt-4 flex flex-wrap gap-3">
          {allowedTypeOptions.map((option) => (
            <label
              key={option.value}
              className="flex items-center gap-2 rounded-xl bg-primary/4 px-4 py-3 text-sm font-medium text-dark-gray"
            >
              <input
                type="checkbox"
                checked={allowedTypes.includes(option.value)}
                onChange={() => toggleAllowedType(option.value)}
                className="size-5 accent-primary"
              />
              {option.label}
            </label>
          ))}
        </div>
        <InputErrorMessage msg={errors.allowed_user_types?.message} />
      </div>
    </div>
  );
}

export default PaymentMethodFields;
