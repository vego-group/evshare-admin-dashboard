"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams, useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import type { OperatingCompanyFormValues } from "@/schemas/operating-companies";
import { editOperatingCompanyAPI } from "@/services/mutations";
import { useOperatingCompany } from "@/hooks/api";
import { stripNonDigits } from "@/lib/utils/digits-only-input";

import {
  buildChangedOperatingCompanyPayload,
  hasFormDataEntries,
  operatingCompanyDefaultValues,
  operatingCompanyFormResolver,
} from "../modals/operating-company-form-utils";

export function useEditOperatingCompanyForm() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { id } = useParams<{ id: string }>();
  const { data: companyData, isLoading } = useOperatingCompany(id ?? null);
  const company = companyData?.data;

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty, dirtyFields, isSubmitting },
  } = useForm<OperatingCompanyFormValues>({
    resolver: operatingCompanyFormResolver,
    defaultValues: operatingCompanyDefaultValues,
    mode: "onChange",
  });

  const [logoPreviewUrl, setLogoPreviewUrl] = useState<string | null>(null);
  const previewUrl = logoPreviewUrl ?? company?.logo?.[0]?.url;

  useEffect(() => {
    if (!company) return;
    reset({
      slug: company.slug,
      name_ar: company.name_ar,
      name_en: company.name_en,
      commission_percentage: Number(company.commission_percentage ?? 0),
      mobile: company.mobile ? stripNonDigits(company.mobile).slice(-9) : undefined,
      email: company.email ?? undefined,
      conditions_ar: company.conditions_ar ?? "",
      conditions_en: company.conditions_en ?? "",
      logo: undefined,
    });
  }, [company, reset]);

  useEffect(() => {
    return () => {
      if (logoPreviewUrl?.startsWith("blob:")) URL.revokeObjectURL(logoPreviewUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (logoPreviewUrl?.startsWith("blob:")) URL.revokeObjectURL(logoPreviewUrl);
    setLogoPreviewUrl(file ? URL.createObjectURL(file) : null);
  };

  const handleCancel = () => router.back();

  const onSubmit = async (values: OperatingCompanyFormValues) => {
    if (!company || !isDirty) return;

    const payload = buildChangedOperatingCompanyPayload(values, dirtyFields);
    if (!hasFormDataEntries(payload)) return;

    const result = await editOperatingCompanyAPI(company.id, payload);
    if (!result?.ok) {
      toast.error(result?.message || "فشل تعديل الشركة");
      return;
    }

    toast.success(result.message || "تم تعديل الشركة بنجاح");
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["operating-companies"] }),
      queryClient.invalidateQueries({
        queryKey: ["operating-company", company.id],
      }),
    ]);
    router.push("/operating-companies");
  };

  return {
    register,
    control,
    handleSubmit,
    errors,
    isSubmitting,
    isDirty,
    isLoading,
    company,
    previewUrl,
    handleLogoChange,
    handleCancel,
    onSubmit,
  };
}
