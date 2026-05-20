"use client";

import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import toast from "react-hot-toast";

import Modal from "@/components/ui/modal";
import type { CategoryFormValues } from "@/schemas/categories";
import { addCategory } from "@/services/mutations";

import CategoryFormFields from "./category-form-fields";
import { CategoryFormActions } from "./category-form-modal-parts";
import {
  buildCategoryPayload,
  categoryDefaultValues,
  categoryFormResolver,
} from "./category-form-utils";

type CategoryAddModalProps = {
  open: boolean;
  onClose: () => void;
  onSaved: () => Promise<void> | void;
};

function CategoryAddModal({ open, onClose, onSaved }: CategoryAddModalProps) {
  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CategoryFormValues>({
    resolver: categoryFormResolver,
    defaultValues: categoryDefaultValues,
    mode: "onChange",
  });
  const active = useWatch({ control, name: "active" });
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);

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
    reset(categoryDefaultValues);
    clearImagePreview();
    onClose();
  };

  const onSubmit = async (values: CategoryFormValues) => {
    const result = await addCategory(buildCategoryPayload(values));

    if (result?.ok) {
      toast.success(result.message || "تم إضافة التصنيف بنجاح");
      await onSaved();
      handleClose();
      return;
    }

    toast.error(result?.message || "فشل إضافة التصنيف");
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      contentClassName="md:max-w-[700px] rounded-2xl border-0 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)]"
      title="إضافة تصنيف"
      description="إضافة تصنيف جديد لقائمة المنتجات"
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-7 p-1 text-right md:p-4"
      >
        <CategoryFormFields
          active={active}
          errors={errors}
          imagePreviewUrl={imagePreviewUrl}
          onImageChange={handleImageChange}
          register={register}
          setValue={setValue}
        />
        <CategoryFormActions
          submitLabel="إضافة التصنيف"
          isSubmitting={isSubmitting}
          onClose={handleClose}
        />
      </form>
    </Modal>
  );
}

export default CategoryAddModal;
