"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { AlertTriangle, SaudiRiyal } from "lucide-react";
import { Button } from "@/components/ui/button";
import InputErrorMessage from "@/components/ui/input-error-message";
import Loader from "@/components/ui/loader";
import Modal from "@/components/ui/modal";
import {
  normalizeNonNegativeNumberInput,
  preventNegativeNumberInput,
  preventNegativeNumberPaste,
} from "@/lib/utils/non-negative-input";
import { driverPricingSettingSchema, type DriverPricingSettingFormValues } from "@/schemas";
import { editDriverPricingSettingAPI } from "@/services/mutations";
import type { DriverPricingSetting } from "@/types";
import { SETTING_META } from "./config";

type Props = { setting: DriverPricingSetting | null; onClose: () => void; onSaved: () => Promise<void> };

export default function EditSettingModal({ setting, onClose, onSaved }: Props) {
  const schema = driverPricingSettingSchema(setting?.setting_name ?? "trip_min_start_balance");
  const form = useForm<DriverPricingSettingFormValues>({
    resolver: zodResolver(schema), defaultValues: { value: "" }, mode: "onChange",
  });
  const meta = setting ? SETTING_META[setting.setting_name] : null;
  const isAmountsList = setting?.setting_name === "wallet_suggested_top_up_amounts";
  const allowsDecimal = meta?.unit === "currency";

  useEffect(() => {
    form.reset({ value: setting?.setting_value ?? "" });
  }, [form, setting]);

  async function submit(values: DriverPricingSettingFormValues) {
    if (!setting || !form.formState.isDirty) return;
    const result = await editDriverPricingSettingAPI(setting.id, values);
    if (!result.ok) return toast.error(result.message || "تعذر حفظ الإعداد");
    toast.success(result.message || "تم حفظ الإعداد بنجاح");
    onClose();
    await onSaved();
  }

  return (
    <Modal open={Boolean(setting)} onClose={onClose} title={meta ? `تعديل ${meta.label}` : "تعديل الإعداد"} description={meta?.description} contentClassName="rounded-2xl border-0 md:max-w-[560px]">
      <form onSubmit={form.handleSubmit(submit)} className="space-y-6 p-1 text-right md:p-4">
        {meta?.critical ? (
          <div className="flex gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
            <AlertTriangle className="mt-1 size-5 shrink-0" />
            <p>هذا الإعداد مؤثر على الفوترة. نسّق تغييره مع فرق المنتج والمالية. يسري تغيير وحدة الاحتساب على الرحلات الجديدة فقط.</p>
          </div>
        ) : null}
        <label className="block">
          <span className="mb-2 flex items-center gap-1 text-sm font-medium text-dark-gray">القيمة {meta?.unit === "currency" ? <SaudiRiyal className="size-4" /> : meta?.unit ? `(${meta.unit})` : ""}</span>
          <input
            type={isAmountsList ? "text" : "number"}
            inputMode={isAmountsList ? "decimal" : allowsDecimal ? "decimal" : "numeric"}
            min={isAmountsList ? undefined : "0"}
            step={allowsDecimal ? "0.01" : "1"}
            dir="ltr"
            autoFocus
            className="h-12 w-full rounded-xl border border-neutral-200 bg-white px-4 text-sm outline-none [appearance:textfield] focus:border-primary focus:ring-3 focus:ring-primary/15 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            {...form.register("value")}
            onKeyDown={(event) => {
              if (isAmountsList && event.key === ",") return;
              preventNegativeNumberInput(event, { allowDecimal: allowsDecimal });
            }}
            onPaste={(event) => {
              if (isAmountsList && /^\d+(?:\.\d+)?(?:,\d+(?:\.\d+)?)*$/.test(event.clipboardData.getData("text").trim())) return;
              preventNegativeNumberPaste(event, { allowDecimal: allowsDecimal });
            }}
            onChange={(event) => {
              const value = isAmountsList
                ? event.target.value.replace(/[^0-9.,]/g, "")
                : normalizeNonNegativeNumberInput(event.target.value, { allowDecimal: allowsDecimal });
              form.setValue("value", value, { shouldDirty: true, shouldValidate: true });
            }}
          />
          <InputErrorMessage msg={form.formState.errors.value?.message} />
        </label>
        <div className="grid gap-3 sm:grid-cols-2">
          <Button type="submit" disabled={form.formState.isSubmitting || !form.formState.isDirty} className="h-12 rounded-xl bg-primary text-secondary">
            {form.formState.isSubmitting ? <Loader /> : "حفظ التغييرات"}
          </Button>
          <Button type="button" variant="ghost" disabled={form.formState.isSubmitting} onClick={onClose} className="h-12 rounded-xl bg-neutral-100">إلغاء</Button>
        </div>
      </form>
    </Modal>
  );
}
