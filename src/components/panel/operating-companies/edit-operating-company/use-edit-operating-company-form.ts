"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams, useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import type { OperatingCompanyFormValues } from "@/schemas/operating-companies";
import { editOperatingCompanyAPI } from "@/services/mutations";
import { useOperatingCompany, useUsers } from "@/hooks/api";
import { useTenantCountry } from "@/provider/currency";

import {
  buildChangedOperatingCompanyPayload,
  hasFormDataEntries,
  operatingCompanyDefaultValues,
  operatingCompanyFormResolver,
} from "../modals/operating-company-form-utils";

export function useEditOperatingCompanyForm() {
  const countryCode = useTenantCountry();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { id } = useParams<{ id: string }>();
  const { data: companyData, isLoading } = useOperatingCompany(id ?? null);
  const company = companyData?.data;

  const {
    register,
    control,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isDirty, dirtyFields, isSubmitting },
  } = useForm<OperatingCompanyFormValues>({
    resolver: operatingCompanyFormResolver(countryCode, company?.mobile),
    defaultValues: operatingCompanyDefaultValues,
    mode: "onChange",
  });

  const [logoPreviewUrl, setLogoPreviewUrl] = useState<string | null>(null);
  const [ownerSearch, setOwnerSearch] = useState("");
  const [ownerId, setOwnerId] = useState("");
  const [ownerLabel, setOwnerLabel] = useState("");
  const [status, setStatus] = useState<"active" | "inactive">("active");
  const [extraErrors, setExtraErrors] = useState<{ owner_id?: string; status?: string }>({});
  const { data: owners } = useUsers({ page: 1, limit: 100, account_status: "active", search: ownerSearch || undefined });
  const extraDirty = Boolean(company && (ownerId !== (company.owner?.id ?? "") || status !== (company.status ?? "active")));
  const previewUrl = logoPreviewUrl ?? company?.logo?.[0]?.url;

  useEffect(() => {
    if (!company) return;
    setOwnerId(company.owner?.id ?? "");
    setOwnerLabel(company.owner ? `${company.owner.name} — ${company.owner.mobile}` : "");
    setStatus(company.status ?? "active");
    reset({
      slug: company.slug,
      name_ar: company.name_ar,
      name_en: company.name_en,
      commission_percentage: Number(company.commission_percentage ?? 0),
      mobile: company.mobile ?? undefined,
      email: company.email ?? undefined,
      conditions_ar: company.conditions_ar ?? "",
      conditions_en: company.conditions_en ?? "",
      logo: undefined,
    }, { keepDirtyValues: true });
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
    if (!company || (!isDirty && !extraDirty)) return;

    const payload = buildChangedOperatingCompanyPayload(values, dirtyFields, countryCode);
    // Commission has a dedicated endpoint and permission; never send it via
    // the broad company-edit operation.
    payload.delete("commission_percentage");
    if (ownerId && ownerId !== (company.owner?.id ?? "")) payload.set("owner_id", ownerId);
    if (status !== (company.status ?? "active")) payload.set("status", status);
    if (!hasFormDataEntries(payload)) return;

    const result = await editOperatingCompanyAPI(company.id, payload);
    if (!result?.ok) {
      const fieldErrors = (result.error as { errors?: Record<string, string[]> } | undefined)?.errors;
      if (fieldErrors) {
        for (const field of ["slug", "name_ar", "name_en", "commission_percentage", "mobile", "email", "logo", "conditions_ar", "conditions_en"] as const) {
          if (fieldErrors[field]?.[0]) setError(field, { type: "server", message: fieldErrors[field][0] });
        }
        setExtraErrors({ owner_id: fieldErrors.owner_id?.[0], status: fieldErrors.status?.[0] });
      }
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
    extraDirty,
    ownerSearch,
    setOwnerSearch,
    ownerId,
    setOwnerId,
    ownerLabel,
    setOwnerLabel,
    status,
    setStatus,
    owners: owners?.data ?? [],
    extraErrors,
    isLoading,
    company,
    previewUrl,
    handleLogoChange,
    handleCancel,
    onSubmit,
  };
}
