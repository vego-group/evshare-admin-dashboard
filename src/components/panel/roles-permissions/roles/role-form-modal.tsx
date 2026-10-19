"use client";

import { showSuccessModal } from "@/components/ui/success-modal";

import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import Modal from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import Loader from "@/components/ui/loader";
import { useRole, useRoles } from "@/hooks/api";
import { roleSchema, type RoleFormInput } from "@/schemas/roles-permissions";
import { addRole, editRole } from "@/services/mutations";
import type { CreateRoleResponse, Role } from "@/types";
import EntityError from "../shared/entity-error";
import FormField from "../shared/form-field";
import { inputClass } from "../shared/form-controls";
import FormShimmer from "../shared/form-shimmer";
import { roleFormResolver } from "../shared/form-resolvers";
import Dropdown from "../shared/dropdown";

type Props = {
  open: boolean;
  role?: Role | null;
  onClose: () => void;
  onSaved: () => void | Promise<void>;
};

export default function RoleFormModal({ open, role, onClose, onSaved }: Props) {
  const [submitError, setSubmitError] = useState<unknown>(null);
  const { isLoading: detailLoading, error: detailError } = useRole(
    role?.id ?? null,
  );
  const {
    data: roles,
    isLoading: rolesLoading,
    error: rolesError,
  } = useRoles(
    { page: 1, limit: 200, order_by: "asc" },
    { enabled: open && !role },
  );
  const roleOptions = Array.isArray(roles?.data) ? roles.data : [];
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<RoleFormInput>({
    resolver: roleFormResolver,
    defaultValues: {
      name: role?.name ?? "",
      source_role_id: "",
    },
    mode: "onChange",
  });

  // The modal instance is reused across roles, so useForm's one-time
  // defaultValues won't reflect a newly selected role. Force a fresh reset
  // every time it opens (and clear stale values when it closes).
  useEffect(() => {
    if (!open) {
      reset({ name: "", source_role_id: "" });
      return;
    }
    reset({
      name: role?.name ?? "",
      source_role_id: "",
    });
  }, [open, role, reset]);

  async function submit(values: RoleFormInput) {
    if (!isDirty) return;
    const result = role
      ? await editRole(role.id, { name: values.name })
      : await addRole(roleSchema.parse(values));
    if (!result.ok) {
      if (result.status === 404) return setSubmitError({ status: 404 });
      return toast.error(result.message || "تعذر حفظ الدور");
    }
    if (role) {
      showSuccessModal(result.message || "تم حفظ الدور بنجاح");
      await onSaved();
      return;
    }

    // The edit branch has an untyped response, so the conditional result loses
    // the create endpoint's more specific envelope at compile time.
    const createdRole = (result.data as CreateRoleResponse | undefined)?.data;
    showSuccessModal(
      createdRole?.copied_from?.name
        ? `تم إنشاء الدور ونسخ صلاحيات ${createdRole.copied_from.name}`
        : (result.message || "تم إنشاء الدور بنجاح"),
    );
    await onSaved();
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={role ? "تعديل الدور" : "إضافة دور"}
      contentClassName="max-w-lg rounded-2xl"
    >
      {role && detailLoading ? (
        <FormShimmer fields={2} />
      ) : detailError || submitError ? (
        <div className="p-4">
          <EntityError error={detailError ?? submitError} />
        </div>
      ) : (
        <form onSubmit={handleSubmit(submit)} className="space-y-5 p-5">
          <FormField
            label="اسم الدور"
            error={errors.name?.message}
          >
            <input className={inputClass} {...register("name")} />
          </FormField>
          {!role && (
            <FormField label="نسخ الصلاحيات من (اختياري)">
              {rolesLoading ? (
                <div className="h-12 animate-pulse rounded-[14px] bg-neutral-100" />
              ) : rolesError ? (
                <p className="rounded-[14px] bg-amber-50 px-4 py-3 text-sm text-amber-800">
                  تعذر تحميل الأدوار. لا يزال بإمكانك إنشاء دور بدون نسخ صلاحيات.
                </p>
              ) : (
                <Controller
                  control={control}
                  name="source_role_id"
                  render={({ field }) => (
                    <Dropdown
                      value={field.value}
                      placeholder="اختر دورًا"
                      onChange={field.onChange}
                      options={[
                        { label: "بدون نسخ صلاحيات", value: "" },
                        ...roleOptions.map((item) => ({
                          label: item.name,
                          value: item.id,
                        })),
                      ]}
                    />
                  )}
                />
              )}
            </FormField>
          )}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              disabled={isSubmitting}
              className="h-12 rounded-[14px] bg-neutral-100 text-dark-gray"
            >
              إلغاء
            </Button>
            <Button
              disabled={isSubmitting || !isDirty}
              className="h-12 rounded-[14px] text-secondary"
            >
              {isSubmitting ? <Loader /> : "حفظ"}
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}
