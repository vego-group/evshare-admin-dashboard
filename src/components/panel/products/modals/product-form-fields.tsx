"use client";

import { ImageIcon, Plus, Trash2, Upload } from "lucide-react";
import type { ReactNode } from "react";
import type {
  Control,
  FieldErrors,
  UseFormRegister,
  UseFormSetValue,
} from "react-hook-form";
import { useFieldArray } from "react-hook-form";

import InputErrorMessage from "@/components/ui/input-error-message";
import Shimmer from "@/components/ui/shimmer";
import { Button } from "@/components/ui/button";
import type { ProductFormValues } from "@/schemas/products";

import ProductCategorySelect from "./product-category-select";
import ProductStatusDropdown from "./product-status-dropdown";

const inputClassName =
  "h-14 w-full rounded-[14px] border border-primary bg-primary/4 px-4 text-right text-sm font-medium text-dark-gray outline-none transition focus:bg-primary/8";

const textareaClassName =
  "w-full rounded-[14px] border border-primary bg-primary/4 px-4 py-3 text-right text-sm font-medium text-dark-gray outline-none transition focus:bg-primary/8 min-h-[100px] resize-none";

type ProductFormFieldsProps = {
  active: boolean;
  categoryId: string;
  errors: FieldErrors<ProductFormValues>;
  imagePreviewUrl?: string | null;
  imagesPreviewUrls?: string[];
  existingImagesUrls?: string[];
  onImageChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onImagesChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  register: UseFormRegister<ProductFormValues>;
  setValue: UseFormSetValue<ProductFormValues>;
  control: Control<ProductFormValues>;
};

function ProductFormFields({
  active,
  categoryId,
  errors,
  imagePreviewUrl,
  imagesPreviewUrls,
  existingImagesUrls,
  onImageChange,
  onImagesChange,
  register,
  setValue,
  control,
}: ProductFormFieldsProps) {
  const displayedImages = imagesPreviewUrls?.length ? imagesPreviewUrls : existingImagesUrls;
  const { fields, append, remove } = useFieldArray({
    control,
    name: "key_features",
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-x-5 gap-y-5 sm:grid-cols-2">
        <Field label="العنوان العربي" required error={errors.title_ar?.message}>
          <input
            type="text"
            placeholder="دباب"
            className={inputClassName}
            {...register("title_ar")}
          />
        </Field>

        <Field
          label="العنوان الإنجليزي"
          required
          error={errors.title_en?.message}
        >
          <input
            type="text"
            dir="ltr"
            placeholder="scooter"
            className={`${inputClassName} text-left`}
            {...register("title_en")}
          />
        </Field>

        <Field
          label="الوصف العربي"
          required
          error={errors.description_ar?.message}
        >
          <textarea
            placeholder="وصف المنتج بالعربية"
            className={textareaClassName}
            {...register("description_ar")}
          />
        </Field>

        <Field
          label="الوصف الإنجليزي"
          required
          error={errors.description_en?.message}
        >
          <textarea
            dir="ltr"
            placeholder="Product description in English"
            className={`${textareaClassName} text-left`}
            {...register("description_en")}
          />
        </Field>

        <Field
          label="الوصف المختصر العربي"
          required
          error={errors.small_description_ar?.message}
        >
          <textarea
            placeholder="وصف مختصر بالعربية"
            className={textareaClassName}
            {...register("small_description_ar")}
          />
        </Field>

        <Field
          label="الوصف المختصر الإنجليزي"
          required
          error={errors.small_description_en?.message}
        >
          <textarea
            dir="ltr"
            placeholder="Short description in English"
            className={`${textareaClassName} text-left`}
            {...register("small_description_en")}
          />
        </Field>

        <Field label="السعر" required error={errors.price?.message}>
          <PriceInput placeholder="100.00" {...register("price")} />
        </Field>

        <Field label="الكمية" required error={errors.quantity?.message}>
          <input
            type="number"
            min="0"
            placeholder="0"
            className={inputClassName}
            {...register("quantity")}
          />
        </Field>

        <Field
          label="سعر الاشتراك الشهري"
          required
          error={errors.monthly_subscription_price?.message}
        >
          <PriceInput placeholder="10.00" {...register("monthly_subscription_price")} />
        </Field>

        <Field
          label="السعر المفتوح"
          required
          error={errors.open_price?.message}
        >
          <PriceInput placeholder="10.00" {...register("open_price")} />
        </Field>

        <Field label="الحالة" required error={errors.active?.message}>
          <ProductStatusDropdown active={active} setValue={setValue} />
        </Field>

        <Field label="التصنيف" required error={errors.category_id?.message}>
          <ProductCategorySelect value={categoryId} setValue={setValue} />
        </Field>

        <Field label="الصورة الرئيسية" required error={errors.default_image?.message}>
          <label className="flex min-h-14 cursor-pointer items-center gap-3 rounded-[14px] border border-dashed border-primary bg-primary/4 px-4 py-2 text-sm font-medium text-dark-gray transition hover:bg-primary/8">
            <ImagePreview previewUrl={imagePreviewUrl} />
            <span className="flex-1">اختر صورة رئيسية</span>
            <Upload className="size-5 text-primary" />
            <input
              type="file"
              accept="image/*"
              className="sr-only"
              {...register("default_image", { onChange: onImageChange })}
            />
          </label>
        </Field>

        <Field label="صور إضافية" error={errors.images?.message}>
          <div className="flex flex-col gap-2">
            <label className="flex min-h-14 cursor-pointer items-center gap-3 rounded-[14px] border border-dashed border-primary bg-primary/4 px-4 py-2 text-sm font-medium text-dark-gray transition hover:bg-primary/8">
              <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary/15 text-secondary">
                <ImageIcon className="size-5" />
              </span>
              <span className="flex-1">اختر صور إضافية</span>
              <Upload className="size-5 text-primary" />
              <input
                type="file"
                accept="image/*"
                multiple
                className="sr-only"
                {...register("images", { onChange: onImagesChange })}
              />
            </label>
            {displayedImages && displayedImages.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {displayedImages.map((url, i) => (
                  <span
                    key={i}
                    role="img"
                    aria-label={`صورة إضافية ${i + 1}`}
                    className="size-16 rounded-xl bg-cover bg-center"
                    style={{ backgroundImage: `url(${url})` }}
                  />
                ))}
              </div>
            )}
          </div>
        </Field>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-dark-gray">
            المزايا الرئيسية
          </span>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={() => append({ title_ar: "", title_en: "" })}
            className="h-9 rounded-[10px] bg-primary/10 px-3 text-sm font-medium text-secondary hover:bg-primary/20"
          >
            <Plus className="size-4" />
            إضافة ميزة
          </Button>
        </div>

        {fields.map((field, index) => (
          <div key={field.id} className="grid gap-3 sm:grid-cols-2">
            <div>
              <input
                type="text"
                placeholder="اسم الميزة بالعربية"
                className={inputClassName}
                {...register(`key_features.${index}.title_ar`)}
              />
              <InputErrorMessage
                msg={errors.key_features?.[index]?.title_ar?.message}
              />
            </div>
            <div className="flex gap-2">
              <div className="flex-1">
                <input
                  type="text"
                  dir="ltr"
                  placeholder="Feature name in English"
                  className={`${inputClassName} text-left`}
                  {...register(`key_features.${index}.title_en`)}
                />
                <InputErrorMessage
                  msg={errors.key_features?.[index]?.title_en?.message}
                />
              </div>
              <button
                type="button"
                onClick={() => remove(index)}
                aria-label="حذف الميزة"
                className="mt-0 grid size-14 shrink-0 place-items-center rounded-[14px] bg-red-50 text-red-500 transition hover:bg-red-100"
              >
                <Trash2 className="size-5" />
              </button>
            </div>
          </div>
        ))}
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
    <label className="flex flex-col">
      <span className="mb-2 text-right text-sm font-medium text-dark-gray">
        {label}
        {required ? <span className="text-red-700"> *</span> : null}
      </span>
      {children}
      <InputErrorMessage msg={error} />
    </label>
  );
}

function ImagePreview({ previewUrl }: { previewUrl?: string | null }) {
  return previewUrl ? (
    <span
      role="img"
      aria-label="معاينة الصورة"
      className="size-11 shrink-0 rounded-xl bg-cover bg-center"
      style={{ backgroundImage: `url(${previewUrl})` }}
    />
  ) : (
    <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary/15 text-secondary">
      <ImageIcon className="size-5" />
    </span>
  );
}

const priceInputClassName =
  "h-14 w-full rounded-[14px] border border-primary bg-primary/4 px-4 pr-14 text-left text-sm font-medium text-dark-gray outline-none transition focus:bg-primary/8";

function PriceInput({
  placeholder,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="relative flex items-center">
      <input
        type="text"
        dir="ltr"
        placeholder={placeholder}
        className={priceInputClassName}
        {...props}
      />
      <span className="pointer-events-none absolute right-4 text-sm font-medium text-gray">
        SAR
      </span>
    </div>
  );
}

export function ProductFormShimmer() {
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
      <div className="grid gap-4 sm:grid-cols-2">
        <Shimmer className="h-14 rounded-[14px]" />
        <Shimmer className="h-14 rounded-[14px]" />
      </div>
    </div>
  );
}

export default ProductFormFields;
