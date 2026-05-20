"use client";

import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import toast from "react-hot-toast";

import Modal from "@/components/ui/modal";
import type { ProductFormValues } from "@/schemas/products";
import { editProductAPI } from "@/services/mutations";
import type { ProductDetail } from "@/types";

import ProductFormFields, { ProductFormShimmer } from "./product-form-fields";
import { ProductFormActions } from "./product-form-modal-parts";
import {
  buildChangedProductPayload,
  hasFormDataEntries,
  productDefaultValues,
  productFormResolver,
} from "./product-form-utils";

type ProductEditModalProps = {
  open: boolean;
  product?: ProductDetail;
  isLoading?: boolean;
  onClose: () => void;
  onSaved: () => Promise<void> | void;
};

function ProductEditModal({
  open,
  product,
  isLoading = false,
  onClose,
  onSaved,
}: ProductEditModalProps) {
  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isDirty, dirtyFields, isSubmitting },
  } = useForm<ProductFormValues>({
    resolver: productFormResolver,
    defaultValues: productDefaultValues,
    mode: "onChange",
  });

  const active = useWatch({ control, name: "active" });
  const categoryId = useWatch({ control, name: "category_id" });
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [imagesPreviewUrls, setImagesPreviewUrls] = useState<string[]>([]);
  const previewUrl = imagePreviewUrl ?? product?.default_image?.url;

  useEffect(() => {
    if (!open) {
      reset(productDefaultValues);
      return;
    }

    if (product) {
      reset({
        title_ar: product.title_ar,
        title_en: product.title_en,
        description_ar: product.description_ar,
        description_en: product.description_en,
        small_description_ar: product.small_description_ar,
        small_description_en: product.small_description_en,
        price: product.price,
        quantity: product.quantity,
        monthly_subscription_price: product.monthly_subscription_price,
        open_price: product.open_price,
        active: product.active,
        category_id: product.category?.id ?? "",
        key_features: product.features.map((f) => ({
          title_ar: f.title_ar,
          title_en: f.title_en,
        })),
        default_image: undefined,
        images: undefined,
      });
    }
  }, [product, open, reset]);

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
    if (imagePreviewUrl?.startsWith("blob:")) URL.revokeObjectURL(imagePreviewUrl);
    setImagePreviewUrl(null);
    imagesPreviewUrls.forEach((url) => URL.revokeObjectURL(url));
    setImagesPreviewUrls([]);
    onClose();
  };

  const onSubmit = async (values: ProductFormValues) => {
    if (!product || !isDirty) return;

    const payload = buildChangedProductPayload(values, dirtyFields);
    if (!hasFormDataEntries(payload)) return;

    const result = await editProductAPI(product.id, payload);

    if (result?.ok) {
      toast.success(result.message || "تم تعديل المنتج بنجاح");
      await onSaved();
      handleClose();
      return;
    }

    toast.error(result?.message || "فشل تعديل المنتج");
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      contentClassName="md:max-w-[700px] rounded-2xl border-0 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)]"
      title="تعديل المنتج"
      description="تحديث بيانات المنتج المختار"
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-7 p-1 text-right md:p-4"
      >
        {isLoading ? (
          <ProductFormShimmer />
        ) : (
          <>
            <ProductFormFields
              active={active}
              categoryId={categoryId}
              errors={errors}
              imagePreviewUrl={previewUrl}
              imagesPreviewUrls={imagesPreviewUrls}
              existingImagesUrls={product?.images.map((img) => img.url)}
              onImageChange={handleImageChange}
              onImagesChange={handleImagesChange}
              register={register}
              setValue={setValue}
              control={control}
            />
            <ProductFormActions
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

export default ProductEditModal;
