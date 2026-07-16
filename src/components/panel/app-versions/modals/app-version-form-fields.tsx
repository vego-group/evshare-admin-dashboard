import type { ReactNode } from "react";
import type {
  FieldErrors,
  UseFormRegister,
  UseFormSetValue,
} from "react-hook-form";

import InputErrorMessage from "@/components/ui/input-error-message";
import {
  preventNegativeNumberInput,
  preventNegativeNumberPaste,
} from "@/lib/utils/non-negative-input";
import type { AppVersionFormValues } from "@/schemas/app-versions";

import AppVersionFormDropdown from "./app-version-form-dropdown";
import AppVersionSwitchField from "./app-version-switch-field";

type AppVersionFormFieldsProps = {
  type: AppVersionFormValues["type"];
  platform: AppVersionFormValues["platform"];
  status: AppVersionFormValues["status"];
  isCritical: boolean;
  errors: FieldErrors<AppVersionFormValues>;
  register: UseFormRegister<AppVersionFormValues>;
  setValue: UseFormSetValue<AppVersionFormValues>;
};

function AppVersionFormFields({
  type,
  platform,
  status,
  isCritical,
  errors,
  register,
  setValue,
}: AppVersionFormFieldsProps) {
  return (
    <div className="grid gap-x-5 gap-y-5 sm:grid-cols-2">
      <Field label="النوع" required error={errors.type?.message}>
        <AppVersionFormDropdown
          field="type"
          value={type}
          options={[
            { label: "تاجر", value: "merchant" },
            { label: "سائق", value: "driver" },
          ]}
          setValue={setValue}
        />
      </Field>
      <Field label="المنصة" required error={errors.platform?.message}>
        <AppVersionFormDropdown
          field="platform"
          value={platform}
          options={[
            { label: "Android", value: "android" },
            { label: "iOS", value: "ios" },
          ]}
          setValue={setValue}
        />
      </Field>
      <Field label="الإصدار" required error={errors.version?.message}>
        <input
          type="text"
          dir="ltr"
          placeholder="1.0.0"
          className="h-14 w-full rounded-[14px] border border-primary bg-primary/4 px-4 text-left text-sm font-medium text-dark-gray outline-none transition focus:bg-primary/8"
          {...register("version")}
        />
      </Field>
      <Field label="رمز الإصدار" required error={errors.version_code?.message}>
        <input
          type="number"
          dir="ltr"
          min={1}
          step={1}
          onKeyDown={preventNegativeNumberInput}
          onPaste={(event) => preventNegativeNumberPaste(event)}
          placeholder="10"
          className="h-14 w-full rounded-[14px] border border-primary bg-primary/4 px-4 text-left text-sm font-medium text-dark-gray outline-none transition focus:bg-primary/8 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          {...register("version_code", { valueAsNumber: true })}
        />
      </Field>
      <Field label="الحالة" required error={errors.status?.message}>
        <AppVersionFormDropdown
          field="status"
          value={status}
          options={[
            { label: "مسودة", value: "draft" },
            { label: "نشط", value: "active" },
            { label: "مؤرشف", value: "archived" },
          ]}
          setValue={setValue}
        />
      </Field>
      <Field
        label="ملاحظات الإصدار بالعربية"
        error={errors.release_notes_ar?.message}
      >
        <textarea
          rows={4}
          className="min-h-28 w-full resize-none overflow-y-auto rounded-[14px] border border-primary bg-primary/4 px-4 py-3 text-right text-sm font-medium text-dark-gray outline-none transition focus:bg-primary/8 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-button]:hidden [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-primary/60 [&::-webkit-scrollbar-track]:my-2 [&::-webkit-scrollbar-track]:bg-transparent"
          {...register("release_notes_ar")}
        />
      </Field>
      <Field
        label="ملاحظات الإصدار بالإنجليزية"
        error={errors.release_notes_en?.message}
      >
        <textarea
          rows={4}
          dir="ltr"
          className="min-h-28 w-full resize-none overflow-y-auto rounded-[14px] border border-primary bg-primary/4 px-4 py-3 text-left text-sm font-medium text-dark-gray outline-none transition focus:bg-primary/8 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-button]:hidden [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-primary/60 [&::-webkit-scrollbar-track]:my-2 [&::-webkit-scrollbar-track]:bg-transparent"
          {...register("release_notes_en")}
        />
      </Field>
      <div className="flex items-end sm:col-span-2">
        <AppVersionSwitchField
          label="تحديث حرج"
          checked={isCritical}
          onChange={(value) =>
            setValue("is_critical", value, { shouldDirty: true })
          }
        />
      </div>
    </div>
  );
}

function Field({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="block">
      <span className="mb-2 block text-right text-sm font-medium text-dark-gray">
        {label}
        {required ? <span className="text-red-700"> *</span> : null}
      </span>
      {children}
      <InputErrorMessage msg={error} />
    </div>
  );
}

export default AppVersionFormFields;
