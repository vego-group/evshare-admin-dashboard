"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import Modal from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import Loader from "@/components/ui/loader";
import { PAGE_SIZE } from "@/constants";
import { usePermission, usePermissionCategories } from "@/hooks/api";
import { permissionSchema, type PermissionFormInput } from "@/schemas/roles-permissions";
import { addPermission, editPermission } from "@/services/mutations";
import type { Permission } from "@/types";
import EntityError from "../shared/entity-error";
import FormField from "../shared/form-field";
import { inputClass } from "../shared/form-controls";
import FormShimmer from "../shared/form-shimmer";
import { permissionFormResolver } from "../shared/form-resolvers";
import ToggleField from "../shared/toggle-field";
import Dropdown from "../shared/dropdown";

type Props = { open: boolean; permission?: Permission | null; onClose: () => void; onSaved: () => void };
const empty: PermissionFormInput = { name: "", name_ar: "", name_en: "", permission_category_id: "", dashboard_permissions: false };

export default function PermissionFormModal({ open, permission, onClose, onSaved }: Props) {
  const defaultValues: PermissionFormInput = permission ? {
    name: permission.name,
    name_ar: permission.name_ar,
    name_en: permission.name_en,
    permission_category_id: permission.permission_category_id == null ? "" : String(permission.permission_category_id),
    dashboard_permissions: permission.dashboard_permissions,
  } : empty;
  const [submitError, setSubmitError] = useState<unknown>(null);
  const { data: categories, isLoading: categoriesLoading } = usePermissionCategories({ page: 1, limit: PAGE_SIZE });
  const { isLoading: detailLoading, error: detailError } = usePermission(permission?.id ?? null);
  const categoryItems = Array.isArray(categories?.data) ? categories.data : [];
  const { register, control, handleSubmit, formState: { errors, isSubmitting, isDirty } } = useForm<PermissionFormInput>({
    resolver: permissionFormResolver,
    defaultValues,
    mode: "onChange",
  });

  async function submit(values: PermissionFormInput) {
    if (!isDirty) return;
    const payload = permissionSchema.parse(values);
    const result = permission
      ? await editPermission(permission.id, payload)
      : await addPermission(payload);
    if (!result.ok) {
      if (result.status === 404) return setSubmitError({ status: 404 });
      return toast.error(result.message || "تعذر حفظ الصلاحية");
    }
    toast.success(result.message || "تم حفظ الصلاحية");
    onSaved(); onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title={permission ? "تعديل الصلاحية" : "إضافة صلاحية"} contentClassName="max-w-2xl rounded-2xl">
      {categoriesLoading || (permission && detailLoading) ? <FormShimmer fields={5} /> : detailError || submitError ? (
        <div className="p-4"><EntityError error={detailError ?? submitError} /></div>
      ) : <form onSubmit={handleSubmit(submit)} className="grid gap-5 p-5 sm:grid-cols-2">
        <FormField label="الاسم البرمجي" error={errors.name?.message}><input dir="ltr" className={inputClass} {...register("name")} /></FormField>
        <FormField label="الاسم العربي" error={errors.name_ar?.message}><input className={inputClass} {...register("name_ar")} /></FormField>
        <FormField label="الاسم الإنجليزي" error={errors.name_en?.message}><input dir="ltr" className={inputClass} {...register("name_en")} /></FormField>
        <FormField label="التصنيف" error={errors.permission_category_id?.message}>
          <Controller control={control} name="permission_category_id" render={({ field }) => (
            <Dropdown value={field.value} placeholder="اختر التصنيف" onChange={field.onChange} options={[
              { label: "بدون تصنيف", value: "" },
              ...categoryItems.map((item) => ({ label: item.name, value: item.id })),
            ]} />
          )} />
        </FormField>
        <Controller control={control} name="dashboard_permissions" render={({ field }) => (
          <ToggleField label="صلاحية لوحة تحكم" checked={Boolean(field.value)} onChange={field.onChange} />
        )} />
        <div className="grid grid-cols-2 gap-3 pt-2 sm:col-span-2">
          <Button type="button" variant="ghost" onClick={onClose} disabled={isSubmitting} className="h-12 rounded-[14px] bg-neutral-100 text-dark-gray">إلغاء</Button>
          <Button disabled={isSubmitting || !isDirty} className="h-12 rounded-[14px] text-secondary">{isSubmitting ? <Loader /> : "حفظ"}</Button>
        </div>
      </form>}
    </Modal>
  );
}
