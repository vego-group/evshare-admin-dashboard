"use client";

import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import toast from "react-hot-toast";

import Modal from "@/components/ui/modal";
import type { CategoryFormValues } from "@/schemas/categories";
import { editCategory } from "@/services/mutations";
import type { CategoryDetail } from "@/types";

import CategoryFormFields, {
  CategoryFormShimmer,
} from "./category-form-fields";
import { CategoryFormActions } from "./category-form-modal-parts";
import {
  buildChangedCategoryPayload,
  categoryDefaultValues,
  categoryFormResolver,
  hasFormDataEntries,
} from "./category-form-utils";

type CategoryEditModalProps = {
  open: boolean;
  category?: CategoryDetail;
  isLoading?: boolean;
  onClose: () => void;
  onSaved: () => Promise<void> | void;
};

function CategoryEditModal({
  open,
  category,
  isLoading = false,
  onClose,
  onSaved,
}: CategoryEditModalProps) {
  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isDirty, dirtyFields, isSubmitting },
  } = useForm<CategoryFormValues>({
    resolver: categoryFormResolver,
    defaultValues: categoryDefaultValues,
    mode: "onChange",
  });
  const active = useWatch({ control, name: "active" });
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const previewUrl = imagePreviewUrl ?? category?.image?.url;

  useEffect(() => {
    if (!open) {
      reset(categoryDefaultValues);
      return;
    }

    if (category) {
      reset({
        name_ar: category.name_ar,
        name_en: category.name_en,
        active: category.active,
        image: undefined,
      });
    }
  }, [category, open, reset]);

  useEffect(() => {
    return () => {
      if (imagePreviewUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreviewUrl);
      }
    };
  }, [imagePreviewUrl]);

  const clearImagePreview = () => {
    setImagePreviewUrl(null);
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    clearImagePreview();

    if (file) {
      setImagePreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleClose = () => {
    clearImagePreview();
    onClose();
  };

  const onSubmit = async (values: CategoryFormValues) => {
    if (!category || !isDirty) return;

    const payload = buildChangedCategoryPayload(values, dirtyFields);
    if (!hasFormDataEntries(payload)) return;

    const result = await editCategory(category.id, payload);

    if (result?.ok) {
      toast.success(result.message || "تم تعديل التصنيف بنجاح");
      await onSaved();
      handleClose();
      return;
    }

    toast.error(result?.message || "فشل تعديل التصنيف");
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      contentClassName="md:max-w-[700px] rounded-2xl border-0 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)]"
      title="تعديل التصنيف"
      description="تحديث بيانات التصنيف المختار"
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-7 p-1 text-right md:p-4"
      >
        {isLoading ? <CategoryFormShimmer /> : (
          <>
            <CategoryFormFields
              active={active}
              errors={errors}
              imagePreviewUrl={previewUrl}
              onImageChange={handleImageChange}
              register={register}
              setValue={setValue}
            />
            <CategoryFormActions
              submitLabel="حفظ التعديلات"
              isSubmitting={isSubmitting}
              isSubmitDisabled={!isDirty}
              onClose={handleClose}
            />
          </>
        )}
      </form>
    </Modal>
  );
}

export default CategoryEditModal;
