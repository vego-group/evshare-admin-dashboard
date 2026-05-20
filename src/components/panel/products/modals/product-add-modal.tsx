"use client";

import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import toast from "react-hot-toast";

import Modal from "@/components/ui/modal";
import type { ProductFormValues } from "@/schemas/products";
import { addProductAPI } from "@/services/mutations";

import ProductFormFields from "./product-form-fields";
import { ProductFormActions } from "./product-form-modal-parts";
import {
  buildProductPayload,
  productAddFormResolver,
  productDefaultValues,
} from "./product-form-utils";

type ProductAddModalProps = {
  open: boolean;
  onClose: () => void;
  onSaved: () => Promise<void> | void;
};

function ProductAddModal({ open, onClose, onSaved }: ProductAddModalProps) {
  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormValues>({
    resolver: productAddFormResolver,
    defaultValues: productDefaultValues,
    mode: "onChange",
  });

  const active = useWatch({ control, name: "active" });
  const categoryId = useWatch({ control, name: "category_id" });
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [imagesPreviewUrls, setImagesPreviewUrls] = useState<string[]>([]);

  useEffect(() => {
    return () => {
      if (imagePreviewUrl?.startsWith("blob:")) URL.revokeObjectURL(imagePreviewUrl);
      imagesPreviewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (imagePreviewUrl?.startsWith("blob:")) URL.revokeObjectURL(imagePreviewUrl);
    setImagePreviewUrl(file ? URL.createObjectURL(file) : null);
  };

  const handleImagesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    imagesPreviewUrls.forEach((url) => URL.revokeObjectURL(url));
    const files = event.target.files;
    if (!files?.length) {
      setImagesPreviewUrls([]);
      return;
    }
    setImagesPreviewUrls(Array.from(files).map((f) => URL.createObjectURL(f)));
  };

  const handleClose = () => {
    reset(productDefaultValues);
    if (imagePreviewUrl?.startsWith("blob:")) URL.revokeObjectURL(imagePreviewUrl);
    setImagePreviewUrl(null);
    imagesPreviewUrls.forEach((url) => URL.revokeObjectURL(url));
    setImagesPreviewUrls([]);
    onClose();
  };

  const onSubmit = async (values: ProductFormValues) => {
    const result = await addProductAPI(buildProductPayload(values));

    if (result?.ok) {
      toast.success(result.message || "تم إضافة المنتج بنجاح");
      await onSaved();
      handleClose();
      return;
    }

    toast.error(result?.message || "فشل إضافة المنتج");
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      contentClassName="md:max-w-[700px] rounded-2xl border-0 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] overflow-hidden"
      title="إضافة منتج"
      description="إضافة منتج جديد للقائمة"
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-7 p-1 text-right md:p-4"
      >
        <ProductFormFields
          active={active}
          categoryId={categoryId}
          errors={errors}
          imagePreviewUrl={imagePreviewUrl}
          imagesPreviewUrls={imagesPreviewUrls}
          onImageChange={handleImageChange}
          onImagesChange={handleImagesChange}
          register={register}
          setValue={setValue}
          control={control}
        />
        <ProductFormActions
          submitLabel="إضافة المنتج"
          isSubmitting={isSubmitting}
          onClose={handleClose}
        />
      </form>
    </Modal>
  );
}

export default ProductAddModal;
