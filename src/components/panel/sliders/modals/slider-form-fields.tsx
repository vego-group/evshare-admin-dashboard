"use client";

import { ImageIcon, Upload, X } from "lucide-react";
import Image from "next/image";
import type { ReactNode } from "react";
import type { FieldErrors, UseFormRegister, UseFormSetValue } from "react-hook-form";

import InputErrorMessage from "@/components/ui/input-error-message";
import type { SliderFormValues } from "@/schemas/sliders";

import SliderStatusDropdown from "./slider-status-dropdown";

type SliderFormFieldsProps = {
  active: boolean;
  errors: FieldErrors<SliderFormValues>;
  register: UseFormRegister<SliderFormValues>;
  setValue: UseFormSetValue<SliderFormValues>;
  imagePreviewUrl?: string | null;
  existingImageUrl?: string;
  onImageChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onImageClear?: () => void;
  isImageRequired?: boolean;
};

function SliderFormFields({
  active,
  errors,
  register,
  setValue,
  imagePreviewUrl,
  existingImageUrl,
  onImageChange,
  onImageClear,
  isImageRequired,
}: SliderFormFieldsProps) {
  const previewSrc = imagePreviewUrl ?? existingImageUrl;

  return (
    <div className="flex flex-col gap-5">
      <Field label="الحالة" required error={errors.active?.message}>
        <SliderStatusDropdown active={active} setValue={setValue} />
      </Field>

      <Field label="صورة السلايدر" required={isImageRequired} error={errors.image?.message}>
        <div className="flex flex-col gap-3">
          <label className="flex min-h-14 cursor-pointer items-center gap-3 rounded-[14px] border border-dashed border-primary bg-primary/4 px-4 py-2 text-sm font-medium text-dark-gray transition hover:bg-primary/8">
            <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary/15 text-secondary">
              <ImageIcon className="size-5" />
            </span>
            <span className="flex-1">
              {previewSrc ? "تغيير الصورة" : "اختر صورة السلايدر"}
            </span>
            <Upload className="size-5 text-primary" />
            <input
              type="file"
              accept="image/*"
              className="sr-only"
              {...register("image", { onChange: onImageChange })}
            />
          </label>

          {previewSrc && (
            <div className="relative h-40 w-full max-w-sm overflow-hidden rounded-xl">
              <Image
                src={previewSrc}
                alt="معاينة الصورة"
                fill
                unoptimized
                className="object-cover"
              />
              {imagePreviewUrl && onImageClear && (
                <button
                  type="button"
                  onClick={onImageClear}
                  aria-label="إزالة الصورة"
                  className="absolute -right-2 -top-2 grid size-6 place-items-center rounded-full bg-red-500 text-white hover:bg-red-600"
                >
                  <X className="size-3.5" />
                </button>
              )}
            </div>
          )}

          <p className="text-xs text-gray">الحد الأقصى لحجم الصورة: 5MB</p>
        </div>
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
    <label className="block">
      <span className="mb-2 block text-right text-sm font-medium text-dark-gray">
        {label}
        {required ? <span className="text-red-700"> *</span> : null}
      </span>
      {children}
      <InputErrorMessage msg={error} />
    </label>
  );
}

export default SliderFormFields;
