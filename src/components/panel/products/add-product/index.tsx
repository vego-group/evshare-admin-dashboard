"use client";

import Header from "@/components/ui/header";
import ProductFormFields from "../modals/product-form-fields";
import { ProductFormActions } from "../modals/product-form-modal-parts";
import { useAddProductForm } from "./use-add-product-form";

function AddProduct() {
  const {
    register,
    control,
    handleSubmit,
    setValue,
    errors,
    isSubmitting,
    active,
    categoryId,
    imagePreviewUrl,
    imagesPreviewUrls,
    handleImageChange,
    handleImagesChange,
    handleRemoveImage,
    handleCancel,
    onSubmit,
  } = useAddProductForm();

  return (
    <div className="flex w-full flex-col gap-6">
      <Header title="إضافة منتج" subtitle="إضافة منتج جديد للقائمة" />

      <div className="rounded-2xl border border-neutral-100 bg-white p-4 shadow-sm md:p-6">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-7 text-right"
        >
          <ProductFormFields
            active={active}
            categoryId={categoryId}
            errors={errors}
            imagePreviewUrl={imagePreviewUrl}
            imagesPreviewUrls={imagesPreviewUrls}
            onImageChange={handleImageChange}
            onImagesChange={handleImagesChange}
            onImageRemove={handleRemoveImage}
            register={register}
            setValue={setValue}
            control={control}
          />
          <ProductFormActions
            submitLabel="إضافة المنتج"
            isSubmitting={isSubmitting}
            onClose={handleCancel}
          />
        </form>
      </div>
    </div>
  );
}

export default AddProduct;
