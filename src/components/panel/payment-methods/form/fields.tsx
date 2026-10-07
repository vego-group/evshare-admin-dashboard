import type { FieldErrors, UseFormRegister, UseFormSetValue } from "react-hook-form";

import InputErrorMessage from "@/components/ui/input-error-message";
import type { PaymentMethodFormValues } from "@/schemas/payment-methods";
import type { PaymentMethodAvailability } from "@/types";

type Props = {
  isActive: boolean;
  availableFor: PaymentMethodAvailability[];
  errors: FieldErrors<PaymentMethodFormValues>;
  register: UseFormRegister<PaymentMethodFormValues>;
  setValue: UseFormSetValue<PaymentMethodFormValues>;
};

const inputClass = "h-12 w-full rounded-xl border border-primary/20 px-4 text-sm outline-none focus:border-primary";
const availabilityOptions: Array<{ label: string; value: PaymentMethodAvailability }> = [
  { label: "الطلبات", value: "orders" },
  { label: "الاشتراكات", value: "subscriptions" },
];

export default function PaymentMethodFields({ isActive, availableFor, errors, register, setValue }: Props) {
  const toggleAvailability = (value: PaymentMethodAvailability) => {
    const next = availableFor.includes(value)
      ? availableFor.filter((item) => item !== value)
      : [...availableFor, value];
    setValue("available_for", next, { shouldDirty: true, shouldValidate: true });
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
        <span><span className="block text-sm font-medium">الحالة</span><span className="text-xs text-gray">إظهار طريقة الدفع في الاستخدامات المحددة أدناه</span></span>
        <input type="checkbox" checked={isActive} onChange={(event) => setValue("is_active", event.target.checked, { shouldDirty: true, shouldValidate: true })} className="size-5 accent-primary" />
      </label>
      <fieldset className="rounded-xl border border-primary/15 p-4 sm:col-span-2">
        <legend className="px-1 text-sm font-medium text-dark-gray">متاحة للاستخدام في</legend>
        <p className="mt-1 text-xs text-gray">يمنع الخادم استخدام الطريقة خارج السياقات المحددة.</p>
        <div className="mt-4 flex flex-wrap gap-3">
          {availabilityOptions.map((option) => (
            <label key={option.value} className="flex items-center gap-2 rounded-xl bg-primary/4 px-4 py-3 text-sm font-medium text-dark-gray">
              <input type="checkbox" checked={availableFor.includes(option.value)} onChange={() => toggleAvailability(option.value)} className="size-5 accent-primary" />
              {option.label}
            </label>
          ))}
        </div>
        <InputErrorMessage msg={errors.available_for?.message} />
      </fieldset>
    </div>
  );
}
