"use client";

import { ImageIcon, Upload } from "lucide-react";
import Image from "next/image";
import type { ReactNode } from "react";
import type {
  Control,
  FieldErrors,
  UseFormRegister,
} from "react-hook-form";
import { Controller } from "react-hook-form";

import InputErrorMessage from "@/components/ui/input-error-message";
import RichTextEditor from "@/components/ui/rich-text-editor";
import Shimmer from "@/components/ui/shimmer";
import {
  preventNonDigitInput,
  preventNonDigitPaste,
  stripNonDigits,
} from "@/lib/utils/digits-only-input";
import {
  preventNegativeNumberInput,
  preventNegativeNumberPaste,
} from "@/lib/utils/non-negative-input";
import type { OperatingCompanyFormValues } from "@/schemas/operating-companies";

const inputClassName =
  "h-14 w-full rounded-[14px] border border-primary bg-primary/4 px-4 text-right text-sm font-medium text-dark-gray outline-none transition focus:bg-primary/8";

const inputEnClassName =
  "h-14 w-full rounded-[14px] border border-primary bg-primary/4 px-4 text-left text-sm font-medium text-dark-gray outline-none transition focus:bg-primary/8";

type OperatingCompanyFormFieldsProps = {
  errors: FieldErrors<OperatingCompanyFormValues>;
  logoPreviewUrl?: string | null;
  onLogoChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  register: UseFormRegister<OperatingCompanyFormValues>;
  control: Control<OperatingCompanyFormValues>;
};

function OperatingCompanyFormFields({
  errors,
  logoPreviewUrl,
  onLogoChange,
  register,
  control,
}: OperatingCompanyFormFieldsProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-x-5 gap-y-5 sm:grid-cols-2">
        <Field label="الاسم بالعربية" error={errors.name_ar?.message}>
          <input
            type="text"
            placeholder="اسم الشركة بالعربية"
            className={inputClassName}
            {...register("name_ar")}
          />
        </Field>

        <Field label="الاسم بالإنجليزية" error={errors.name_en?.message}>
          <input
            type="text"
            dir="ltr"
            placeholder="Company name in English"
            className={inputEnClassName}
            {...register("name_en")}
          />
        </Field>

        <Field label="المعرف (Slug)" error={errors.slug?.message}>
          <input
            type="text"
            dir="ltr"
            placeholder="company-slug"
            className={inputEnClassName}
            {...register("slug")}
          />
        </Field>

        <Field
          label="نسبة العمولة"
          error={errors.commission_percentage?.message}
        >
          <div
            dir="ltr"
            className="flex h-14 items-center gap-1 rounded-[14px] border border-primary bg-primary/4 px-4 transition focus-within:bg-primary/8"
          >
            <input
              type="number"
              min="0"
              step="0.01"
              placeholder="10"
              className="min-w-0 flex-1 bg-transparent text-left text-sm font-medium text-dark-gray outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              {...register("commission_percentage", { valueAsNumber: true })}
              onKeyDown={(event) =>
                preventNegativeNumberInput(event, { allowDecimal: true })
              }
              onPaste={(event) =>
                preventNegativeNumberPaste(event, { allowDecimal: true })
              }
            />
            <span className="shrink-0 text-sm font-medium text-gray">%</span>
          </div>
        </Field>

        <Field label="رقم الجوال" error={errors.mobile?.message}>
          <div
            dir="ltr"
            className="flex h-14 w-full overflow-hidden rounded-[14px] border border-primary bg-primary/4 transition focus-within:bg-primary/8"
          >
            <div className="flex shrink-0 items-center gap-1.5 border-r border-primary px-4 select-none">
              <Image
                src="/images/flag.png"
                alt="SA"
                width={28}
                height={20}
                className="rounded-sm object-cover"
              />
              <span className="text-sm font-medium text-dark-gray">+966</span>
            </div>
            <input
              type="tel"
              inputMode="numeric"
              maxLength={9}
              placeholder="5x xxx xxxx"
              className="h-full w-full bg-transparent px-4 text-left text-sm font-medium text-dark-gray outline-none placeholder:text-gray-400"
              {...register("mobile", {
                onChange: (event) => {
                  const normalizedValue = stripNonDigits(event.target.value);
                  if (event.target.value !== normalizedValue) {
                    event.target.value = normalizedValue;
                  }
                },
              })}
              onKeyDown={preventNonDigitInput}
              onPaste={(event) => preventNonDigitPaste(event)}
            />
          </div>
        </Field>

        <Field label="البريد الإلكتروني" error={errors.email?.message}>
          <input
            type="email"
            dir="ltr"
            placeholder="ops@example.com"
            className={inputEnClassName}
            {...register("email")}
          />
        </Field>

        <Field label="شعار الشركة" error={errors.logo?.message}>
          <div className="flex flex-col gap-2">
            <label className="flex min-h-14 cursor-pointer items-center gap-3 rounded-[14px] border border-dashed border-primary bg-primary/4 px-4 py-2 text-sm font-medium text-dark-gray transition hover:bg-primary/8">
              <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary/15 text-secondary">
                <ImageIcon className="size-5" />
              </span>
              <span className="flex-1">اختر شعار الشركة</span>
              <Upload className="size-5 text-primary" />
              <input
                type="file"
                accept="image/*"
                className="sr-only"
                {...register("logo", { onChange: onLogoChange })}
              />
            </label>
            {logoPreviewUrl && (
              <span className="relative size-20 overflow-hidden rounded-xl">
                <Image
                  src={logoPreviewUrl}
                  alt="معاينة الشعار"
                  fill
                  unoptimized
                  className="object-cover"
                />
              </span>
            )}
          </div>
        </Field>
      </div>

      <Field
        label="الشروط والأحكام بالعربية"
        error={errors.conditions_ar?.message}
      >
        <Controller
          control={control}
          name="conditions_ar"
          render={({ field }) => (
            <RichTextEditor
              dir="rtl"
              value={field.value ?? ""}
              onChange={field.onChange}
            />
          )}
        />
      </Field>

      <Field
        label="الشروط والأحكام بالإنجليزية"
        error={errors.conditions_en?.message}
      >
        <Controller
          control={control}
          name="conditions_en"
          render={({ field }) => (
            <RichTextEditor
              dir="ltr"
              value={field.value ?? ""}
              onChange={field.onChange}
            />
          )}
        />
      </Field>
    </div>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <label className="flex flex-col">
      <span className="mb-2 text-right text-sm font-medium text-dark-gray">
        {label}
      </span>
      {children}
      <InputErrorMessage msg={error} />
    </label>
  );
}

export function OperatingCompanyFormShimmer() {
  return (
    <div className="space-y-7" aria-hidden="true">
      <div className="grid gap-x-5 gap-y-5 sm:grid-cols-2">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="space-y-2">
            <Shimmer className="h-5 w-24 rounded-md" />
            <Shimmer className="h-14 w-full rounded-[14px]" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default OperatingCompanyFormFields;
