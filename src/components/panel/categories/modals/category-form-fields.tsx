import { ImageIcon, Upload } from "lucide-react";
import type { ReactNode } from "react";
import type {
  FieldErrors,
  UseFormRegister,
  UseFormSetValue,
} from "react-hook-form";

import InputErrorMessage from "@/components/ui/input-error-message";
import Shimmer from "@/components/ui/shimmer";
import type { CategoryFormValues } from "@/schemas/categories";

import CategoryStatusDropdown from "./category-status-dropdown";

type CategoryFormFieldsProps = {
  active: boolean;
  errors: FieldErrors<CategoryFormValues>;
  imagePreviewUrl?: string | null;
  onImageChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  register: UseFormRegister<CategoryFormValues>;
  setValue: UseFormSetValue<CategoryFormValues>;
};

function CategoryFormFields({
  active,
  errors,
  imagePreviewUrl,
  onImageChange,
  register,
  setValue,
}: CategoryFormFieldsProps) {
  return (
    <div className="grid gap-x-5 gap-y-5 sm:grid-cols-2">
      <Field label="الاسم العربي" required error={errors.name_ar?.message}>
        <input
          type="text"
          placeholder="سكوتر"
          className="h-14 w-full rounded-[14px] border border-primary bg-primary/4 px-4 text-right text-sm font-medium text-dark-gray outline-none transition focus:bg-primary/8"
          {...register("name_ar")}
        />
      </Field>

      <Field label="الاسم الإنجليزي" required error={errors.name_en?.message}>
        <input
          type="text"
          dir="ltr"
          placeholder="scooter"
          className="h-14 w-full rounded-[14px] border border-primary bg-primary/4 px-4 text-left text-sm font-medium text-dark-gray outline-none transition focus:bg-primary/8"
          {...register("name_en")}
        />
      </Field>

      <Field label="الحالة" required error={errors.active?.message}>
        <CategoryStatusDropdown active={active} setValue={setValue} />
      </Field>

      <Field label="الصورة" error={errors.image?.message}>
        <label className="flex min-h-14 cursor-pointer items-center gap-3 rounded-[14px] border border-dashed border-primary bg-primary/4 px-4 py-2 text-sm font-medium text-dark-gray transition hover:bg-primary/8">
          <ImagePreview previewUrl={imagePreviewUrl} />
          <span className="flex-1">اختر صورة</span>
          <Upload className="size-5 text-primary" />
          <input
            type="file"
            accept="image/*"
            className="sr-only"
            {...register("image", { onChange: onImageChange })}
          />
        </label>
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

export function CategoryFormShimmer() {
  return (
    <div className="space-y-7" aria-hidden="true">
      <div className="grid gap-x-5 gap-y-5 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
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

export default CategoryFormFields;
