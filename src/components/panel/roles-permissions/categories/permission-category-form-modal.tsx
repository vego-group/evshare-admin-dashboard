"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import Loader from "@/components/ui/loader";
import Modal from "@/components/ui/modal";
import { usePermissionCategory } from "@/hooks/api";
import {
  permissionCategorySchema,
  type PermissionCategoryFormInput,
} from "@/schemas/roles-permissions";
import {
  addPermissionCategory,
  editPermissionCategory,
} from "@/services/mutations";
import type { PermissionCategory } from "@/types";
import EntityError from "../shared/entity-error";
import FormField from "../shared/form-field";
import { inputClass } from "../shared/form-controls";
import FormShimmer from "../shared/form-shimmer";
import { categoryFormResolver } from "../shared/form-resolvers";

type Props = {
  open: boolean;
  category?: PermissionCategory | null;
  onClose: () => void;
  onSaved: () => void;
};
const empty: PermissionCategoryFormInput = {
  name: "",
  name_ar: "",
  name_en: "",
  slug: "",
};

export default function PermissionCategoryFormModal({
  open,
  category,
  onClose,
  onSaved,
}: Props) {
  const defaultValues: PermissionCategoryFormInput = category ? {
    name: category.name,
    name_ar: category.name_ar ?? "",
    name_en: category.name_en ?? "",
    slug: category.slug,
  } : empty;
  const [submitError, setSubmitError] = useState<unknown>(null);
  const { isLoading: detailLoading, error: detailError } =
    usePermissionCategory(category?.id ?? null);
  const { register, handleSubmit, reset, formState: { errors, isSubmitting, isDirty } } = useForm<PermissionCategoryFormInput>({
    resolver: categoryFormResolver,
    defaultValues,
    mode: "onChange",
  });

  // The modal instance is reused across categories, so useForm's one-time
  // defaultValues won't reflect a newly selected category. Force a fresh
  // reset every time it opens (and clear stale values when it closes).
  useEffect(() => {
    if (!open) { reset(empty); return; }
    reset(defaultValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, category, reset]);

  async function submit(values: PermissionCategoryFormInput) {
    if (!isDirty) return;
    const payload = permissionCategorySchema.parse(values);
    const result = category
      ? await editPermissionCategory(category.id, payload)
      : await addPermissionCategory(payload);
    if (!result.ok) {
      if (result.status === 404) return setSubmitError({ status: 404 });
      return toast.error(result.message || "تعذر حفظ التصنيف");
    }
    toast.success(result.message || "تم حفظ التصنيف");
    onSaved();
    onClose();
  }
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={category ? "تعديل التصنيف" : "إضافة تصنيف"}
      contentClassName="max-w-2xl rounded-2xl"
    >
      {category && detailLoading ? (
        <FormShimmer />
      ) : detailError || submitError ? (
        <div className="p-4">
          <EntityError error={detailError ?? submitError} />
        </div>
      ) : (
        <form onSubmit={handleSubmit(submit)} className="grid gap-5 p-5 sm:grid-cols-2">
          <FormField label="الاسم" error={errors.name?.message}>
            <input className={inputClass} {...register("name")} />
          </FormField>
          <FormField label="المعرّف البرمجي" error={errors.slug?.message}>
            <input dir="ltr" className={inputClass} {...register("slug")} />
          </FormField>
          <FormField label="الاسم العربي" error={errors.name_ar?.message}>
            <input className={inputClass} {...register("name_ar")} />
          </FormField>
          <FormField label="الاسم الإنجليزي" error={errors.name_en?.message}>
            <input dir="ltr" className={inputClass} {...register("name_en")} />
          </FormField>
          <div className="grid grid-cols-2 gap-3 pt-2 sm:col-span-2">
            <Button type="button" variant="ghost" onClick={onClose} disabled={isSubmitting} className="h-12 rounded-[14px] bg-neutral-100 text-dark-gray">
              إلغاء
            </Button>
            <Button disabled={isSubmitting || !isDirty} className="h-12 rounded-[14px] text-secondary">{isSubmitting ? <Loader /> : "حفظ"}</Button>
          </div>
        </form>
      )}
    </Modal>
  );
}
