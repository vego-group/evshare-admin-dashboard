import type { FieldErrors, UseFormRegister, UseFormSetValue } from "react-hook-form";

import InputErrorMessage from "@/components/ui/input-error-message";
import type { PaymentMethodFormValues } from "@/schemas/payment-methods";

type Props = {
  isActive: boolean;
  errors: FieldErrors<PaymentMethodFormValues>;
  register: UseFormRegister<PaymentMethodFormValues>;
  setValue: UseFormSetValue<PaymentMethodFormValues>;
};

const inputClass = "h-12 w-full rounded-xl border border-primary/20 px-4 text-sm outline-none focus:border-primary";

function PaymentMethodFields({ isActive, errors, register, setValue }: Props) {
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
    </div>
  );
}

export default PaymentMethodFields;
