"use client";

import { useEffect, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useParams, useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import type { ProductFormValues } from "@/schemas/products";
import { editProductAPI } from "@/services/mutations";
import { useProduct } from "@/hooks/api";

import {
  buildChangedProductPayload,
  hasFormDataEntries,
  productDefaultValues,
  productFormResolver,
} from "../modals/product-form-utils";

export function useEditProductForm() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { id } = useParams<{ id: string }>();
  const { data: productData, isLoading } = useProduct(id ?? null);
  const product = productData?.data;
  const imageFilesRef = useRef<File[]>([]);

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
    if (!product) return;
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
      price_per_minute: String(product.price_per_minute ?? ""),
      price_per_km: String(product.price_per_km ?? ""),
      price_per_hour: String(product.price_per_hour ?? ""),
      price_per_day: String(product.price_per_day ?? ""),
      active: product.active,
      category_id: product.category?.id ?? "",
      key_features: product.features.map((f) => ({ title_ar: f.title_ar, title_en: f.title_en })),
      default_image: undefined,
      images: undefined,
    });
  }, [product, reset]);

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

  const handleCancel = () => router.back();

  const onSubmit = async (values: ProductFormValues) => {
    if (!product || !isDirty) return;
    const payload = buildChangedProductPayload(values, dirtyFields);
    if (!hasFormDataEntries(payload)) return;
    const result = await editProductAPI(product.id, payload);
    if (result?.ok) {
      toast.success(result.message || "تم تعديل المنتج بنجاح");
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["products"] }),
        queryClient.invalidateQueries({ queryKey: ["product", product.id] }),
      ]);
      router.push("/products");
      return;
    }
    toast.error(result?.message || "فشل تعديل المنتج");
  };

  return {
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
  };
}
