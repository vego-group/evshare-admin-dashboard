"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useParams, useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { usePage } from "@/hooks/api";
import { editPageAPI } from "@/services/mutations";
import type { PageFormValues } from "@/schemas/pages";
import type { UpdatePagePayload } from "@/types";

import { pageDefaultValues, pageFormResolver } from "./page-form-utils";

export function useEditPageForm() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { uuid } = useParams<{ uuid: string }>();
  const { data: pageData, isLoading } = usePage(uuid ?? null);
  const page = pageData?.data;

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty, dirtyFields, isSubmitting },
  } = useForm<PageFormValues>({
    resolver: pageFormResolver,
    defaultValues: pageDefaultValues,
    mode: "onChange",
  });

  useEffect(() => {
    if (!page) return;
    reset({
      title_ar: page.title_ar,
      title_en: page.title_en,
      content_ar: page.content_ar,
      content_en: page.content_en,
    });
  }, [page, reset]);

  const handleCancel = () => router.push("/pages");

  const onSubmit = async (values: PageFormValues) => {
    if (!page || !isDirty) return;

    const payload: UpdatePagePayload = {};
    if (dirtyFields.title_ar) payload.title_ar = values.title_ar;
    if (dirtyFields.title_en) payload.title_en = values.title_en;
    if (dirtyFields.content_ar) payload.content_ar = values.content_ar;
    if (dirtyFields.content_en) payload.content_en = values.content_en;

    if (!Object.keys(payload).length) return;

    const result = await editPageAPI(page.uuid, payload);
    if (result?.ok) {
      toast.success(result.message || "تم تعديل الصفحة بنجاح");
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["pages"] }),
        queryClient.invalidateQueries({ queryKey: ["page", page.uuid] }),
      ]);
      router.push("/pages");
      return;
    }
    toast.error(result?.message || "فشل تعديل الصفحة");
  };

  return {
    register,
    control,
    handleSubmit,
    errors,
    isSubmitting,
    isDirty,
    isLoading,
    page,
    handleCancel,
    onSubmit,
  };
}
