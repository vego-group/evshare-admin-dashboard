"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import Modal from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import Loader from "@/components/ui/loader";
import { useRole } from "@/hooks/api";
import type { RoleEditFormValues } from "@/schemas/roles-permissions";
import { addRole, editRole } from "@/services/mutations";
import type { Role } from "@/types";
import EntityError from "../shared/entity-error";
import FormField from "../shared/form-field";
import { inputClass } from "../shared/form-controls";
import FormShimmer from "../shared/form-shimmer";
import { roleFormResolver } from "../shared/form-resolvers";
import ToggleField from "../shared/toggle-field";

type Props = { open: boolean; role?: Role | null; onClose: () => void; onSaved: () => void };

export default function RoleFormModal({ open, role, onClose, onSaved }: Props) {
  const [submitError, setSubmitError] = useState<unknown>(null);
  const { isLoading: detailLoading, error: detailError } = useRole(role?.id ?? null);
  const { register, control, handleSubmit, formState: { errors, isSubmitting, isDirty } } = useForm<RoleEditFormValues>({
    resolver: roleFormResolver,
    defaultValues: { name: role?.name ?? "", allowed_user: role?.allowed_user ?? false },
    mode: "onChange",
  });

  async function submit(values: RoleEditFormValues) {
    if (!isDirty) return;
    const result = role
      ? await editRole(role.id, values)
      : await addRole({ ...values, permissions: [] });
    if (!result.ok) {
      if (result.status === 404) return setSubmitError({ status: 404 });
      return toast.error(result.message || "تعذر حفظ الدور");
    }
    toast.success(result.message || "تم حفظ الدور بنجاح");
    onSaved();
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title={role ? "تعديل الدور" : "إضافة دور"} contentClassName="max-w-lg rounded-2xl">
      {role && detailLoading ? <FormShimmer fields={2} /> : detailError || submitError ? (
        <div className="p-4"><EntityError error={detailError ?? submitError} /></div>
      ) : <form onSubmit={handleSubmit(submit)} className="space-y-5 p-5">
        <FormField label="اسم الدور" error={errors.name?.message}>
          <input className={inputClass} {...register("name")} />
        </FormField>
        <Controller control={control} name="allowed_user" render={({ field }) => (
          <ToggleField label="السماح للمستخدم" checked={field.value} onChange={field.onChange} />
        )} />
        <div className="grid grid-cols-2 gap-3 pt-2">
          <Button type="button" variant="ghost" onClick={onClose} disabled={isSubmitting} className="h-12 rounded-[14px] bg-neutral-100 text-dark-gray">إلغاء</Button>
          <Button disabled={isSubmitting || !isDirty} className="h-12 rounded-[14px] text-secondary">{isSubmitting ? <Loader /> : "حفظ"}</Button>
        </div>
      </form>}
    </Modal>
  );
}
