import type { FieldErrors, UseFormRegister, UseFormSetValue } from "react-hook-form";
import InputErrorMessage from "@/components/ui/input-error-message";
import type { PaymentMethodFormValues } from "@/schemas/payment-methods";

type Props = { isDefault: boolean; errors: FieldErrors<PaymentMethodFormValues>; register: UseFormRegister<PaymentMethodFormValues>; setValue: UseFormSetValue<PaymentMethodFormValues> };
const inputClass = "mt-2 h-11 w-full rounded-xl border border-primary/20 px-3 text-sm outline-none focus:border-primary";

export default function GatewayFields({ isDefault, errors, register, setValue }: Props) {
  return (
    <section className="grid gap-4 border-t border-neutral-100 pt-5 sm:grid-cols-2">
      <label className="flex items-center justify-between rounded-xl border border-primary/15 p-4 sm:col-span-2">
        <span><span className="block text-sm font-medium">طريقة الدفع الافتراضية</span><span className="text-xs text-gray">سيتم إلغاء الافتراضي السابق تلقائياً</span></span>
        <input type="checkbox" checked={isDefault} onChange={(e) => setValue("is_default", e.target.checked, { shouldDirty: true })} className="size-5 accent-primary" />
      </label>
      <label className="text-sm font-medium sm:col-span-2">العملات المدعومة
        <input dir="ltr" placeholder="SAR, USD" className={`${inputClass} text-left`} {...register("supported_currencies")} />
        <span className="mt-1 block text-xs text-gray">افصل العملات بفاصلة؛ اتركها فارغة للسماح بكل العملات.</span>
      </label>
      <SecretField label="Secret key" name="secret_key" register={register} />
      <SecretField label="Publishable key" name="publishable_key" register={register} />
      <SecretField label="Webhook secret" name="webhook_secret" register={register} />
      <label className="text-sm font-medium">Base URL<input dir="ltr" className={`${inputClass} text-left`} {...register("base_url")} /><InputErrorMessage msg={errors.base_url?.message} /></label>
      <label className="text-sm font-medium sm:col-span-2">إعدادات عامة (JSON)
        <textarea dir="ltr" rows={4} className="mt-2 w-full rounded-xl border border-primary/20 p-3 text-left font-mono text-xs outline-none focus:border-primary" {...register("config")} />
        <InputErrorMessage msg={errors.config?.message} />
      </label>
      <p className="text-xs text-gray sm:col-span-2">لا تُرسل الأسرار إلا عند تعديلها. تفريغ حقل جرى تعديله يحذف ذلك المفتاح.</p>
    </section>
  );
}

function SecretField({ label, name, register }: { label: string; name: "secret_key" | "publishable_key" | "webhook_secret"; register: UseFormRegister<PaymentMethodFormValues> }) {
  return <label className="text-sm font-medium">{label}<input type="password" dir="ltr" autoComplete="new-password" placeholder="اتركه دون تغيير للاحتفاظ بالقيمة" className={`${inputClass} text-left`} {...register(name)} /></label>;
}
