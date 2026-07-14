"use client";

import type { ReactNode } from "react";
import type { Control, FieldErrors, UseFormRegister } from "react-hook-form";
import { Controller } from "react-hook-form";

import InputErrorMessage from "@/components/ui/input-error-message";
import RichTextEditor from "@/components/ui/rich-text-editor";
import Shimmer from "@/components/ui/shimmer";
import type { PageFormValues } from "@/schemas/pages";

const inputClassName =
  "h-14 w-full rounded-[14px] border border-primary bg-primary/4 px-4 text-right text-sm font-medium text-dark-gray outline-none transition focus:bg-primary/8";

const inputEnClassName =
  "h-14 w-full rounded-[14px] border border-primary bg-primary/4 px-4 text-left text-sm font-medium text-dark-gray outline-none transition focus:bg-primary/8";

type PageFormFieldsProps = {
  errors: FieldErrors<PageFormValues>;
  register: UseFormRegister<PageFormValues>;
  control: Control<PageFormValues>;
};

function PageFormFields({ errors, register, control }: PageFormFieldsProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-x-5 gap-y-5 sm:grid-cols-2">
        <Field label="العنوان العربي" required error={errors.title_ar?.message}>
          <input type="text" className={inputClassName} {...register("title_ar")} />
        </Field>

        <Field
          label="العنوان الإنجليزي"
          required
          error={errors.title_en?.message}
        >
          <input
            type="text"
            dir="ltr"
            className={inputEnClassName}
            {...register("title_en")}
          />
        </Field>
      </div>

      <Field label="المحتوى بالعربية" required error={errors.content_ar?.message}>
        <Controller
          control={control}
          name="content_ar"
          render={({ field }) => (
            <RichTextEditor dir="rtl" value={field.value} onChange={field.onChange} />
          )}
        />
      </Field>

      <Field
        label="المحتوى بالإنجليزية"
        required
        error={errors.content_en?.message}
      >
        <Controller
          control={control}
          name="content_en"
          render={({ field }) => (
            <RichTextEditor dir="ltr" value={field.value} onChange={field.onChange} />
          )}
        />
      </Field>
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
    <label className="flex flex-col gap-2">
      <span className="text-right text-sm font-medium text-dark-gray">
        {label}
        {required ? <span className="text-red-700"> *</span> : null}
      </span>
      {children}
      <InputErrorMessage msg={error} />
    </label>
  );
}

export function PageFormShimmer() {
  return (
    <div className="space-y-6" aria-hidden="true">
      <div className="grid gap-x-5 gap-y-5 sm:grid-cols-2">
        <Shimmer className="h-14 rounded-[14px]" />
        <Shimmer className="h-14 rounded-[14px]" />
      </div>
      <Shimmer className="h-64 rounded-[14px]" />
      <Shimmer className="h-64 rounded-[14px]" />
    </div>
  );
}

export default PageFormFields;
