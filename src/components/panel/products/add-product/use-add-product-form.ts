"use client";

import { useEffect, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import type { ProductFormValues } from "@/schemas/products";
import { addProductAPI } from "@/services/mutations";

import {
  buildProductPayload,
  productAddFormResolver,
  productDefaultValues,
} from "../modals/product-form-utils";

export function useAddProductForm() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const imageFilesRef = useRef<File[]>([]);

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
    const newFiles = Array.from(event.target.files ?? []);
    if (!newFiles.length) return;
    const newUrls = newFiles.map((f) => URL.createObjectURL(f));
    imageFilesRef.current = [...imageFilesRef.current, ...newFiles];
    setValue("images", imageFilesRef.current, { shouldDirty: true });
    setImagesPreviewUrls((prev) => [...prev, ...newUrls]);
    event.target.value = "";
  };

  const handleRemoveImage = (index: number) => {
    URL.revokeObjectURL(imagesPreviewUrls[index]);
    imageFilesRef.current = imageFilesRef.current.filter((_, i) => i !== index);
    setValue("images", imageFilesRef.current.length ? imageFilesRef.current : undefined);
    setImagesPreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCancel = () => {
    reset(productDefaultValues);
    if (imagePreviewUrl?.startsWith("blob:")) URL.revokeObjectURL(imagePreviewUrl);
    setImagePreviewUrl(null);
    imagesPreviewUrls.forEach((url) => URL.revokeObjectURL(url));
    setImagesPreviewUrls([]);
    imageFilesRef.current = [];
    router.back();
  };

  const onSubmit = async (values: ProductFormValues) => {
    const result = await addProductAPI(buildProductPayload(values));
    if (result?.ok) {
      toast.success(result.message || "تم إضافة المنتج بنجاح");
      await queryClient.invalidateQueries({ queryKey: ["products"] });
      router.push("/products");
      return;
    }
    toast.error(result?.message || "فشل إضافة المنتج");
  };

  return {
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
  };
}
