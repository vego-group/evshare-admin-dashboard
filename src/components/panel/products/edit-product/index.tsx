"use client";

import Header from "@/components/ui/header";
import ProductFormFields, {
  ProductFormShimmer,
} from "../modals/product-form-fields";
import { ProductFormActions } from "../modals/product-form-modal-parts";
import { useEditProductForm } from "./use-edit-product-form";

function EditProduct() {
  const {
    register,
    control,
    handleSubmit,
    setValue,
    errors,
    isSubmitting,
    isDirty,
    active,
    categoryId,
    isLoading,
    product,
    previewUrl,
    imagesPreviewUrls,
    handleImageChange,
    handleImagesChange,
    handleRemoveImage,
    handleCancel,
    onSubmit,
  } = useEditProductForm();

  return (
    <div className="flex w-full flex-col gap-6">
      <Header title="تعديل المنتج" subtitle="قم بتعديل تفاصيل المنتج" />

      <div className="rounded-2xl border border-neutral-100 bg-white p-4 shadow-sm md:p-6">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-7 text-right"
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
                onImageRemove={handleRemoveImage}
                register={register}
                setValue={setValue}
                control={control}
              />
              <ProductFormActions
                submitLabel="حفظ التعديلات"
                isSubmitting={isSubmitting}
                isSubmitDisabled={!isDirty}
                onClose={handleCancel}
              />
            </>
          )}
        </form>
      </div>
    </div>
  );
}

export default EditProduct;
