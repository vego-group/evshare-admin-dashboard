import type { FieldErrors, UseFormRegister, UseFormSetValue } from "react-hook-form";
import InputErrorMessage from "@/components/ui/input-error-message";
import type { PaymentMethodFormValues } from "@/schemas";

type Props = { isDefault: boolean; errors: FieldErrors<PaymentMethodFormValues>; register: UseFormRegister<PaymentMethodFormValues>; setValue: UseFormSetValue<PaymentMethodFormValues> };
const inputClass = "mt-2 h-11 w-full rounded-xl border border-primary/20 px-3 text-left text-sm outline-none focus:border-primary";
const secrets: Array<[keyof PaymentMethodFormValues, string]> = [["secret_key", "Secret key"], ["publishable_key", "Publishable key"], ["webhook_secret", "Webhook secret"], ["base_url", "Base URL"], ["gateway_currency", "Gateway currency"]];

export default function GatewayFields({ isDefault, errors, register, setValue }: Props) {
  return (
    <section className="space-y-4 rounded-xl border border-amber-200 bg-amber-50/40 p-4 sm:col-span-2">
      <div><h3 className="font-bold text-secondary">إعدادات البوابة لهذه الدولة</h3><p className="text-xs text-gray">غيّر المفاتيح المطلوبة فقط. إرسال قيمة فارغة يحذف المفتاح.</p></div>
      <label className="flex items-center justify-between rounded-lg bg-white p-3 text-sm font-medium">بوابة الدفع الافتراضية<input type="checkbox" checked={isDefault} onChange={(event) => setValue("is_default", event.target.checked, { shouldDirty: true })} className="size-5 accent-primary" /></label>
      <label className="block text-sm font-medium">العملات المدعومة (مفصولة بفاصلة)<input dir="ltr" placeholder="SAR, JOD" className={inputClass} {...register("supported_currencies")} /></label>
      <div className="grid gap-3 sm:grid-cols-2">{secrets.map(([name, label]) => <label key={name} className="text-sm font-medium">{label}<input dir="ltr" className={inputClass} {...register(name)} /></label>)}</div>
      <label className="block text-sm font-medium">Config (JSON غير سري)<textarea dir="ltr" rows={4} className="mt-2 w-full rounded-xl border border-primary/20 p-3 text-left font-mono text-xs outline-none focus:border-primary" {...register("config")} /><InputErrorMessage msg={errors.config?.message} /></label>
    </section>
  );
}
