"use client";

import { showSuccessModal } from "@/components/ui/success-modal";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
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

type Props = {
  open: boolean;
  role?: Role | null;
  onClose: () => void;
  onSaved: () => void;
};

export default function RoleFormModal({ open, role, onClose, onSaved }: Props) {
  const [submitError, setSubmitError] = useState<unknown>(null);
  const { isLoading: detailLoading, error: detailError } = useRole(
    role?.id ?? null,
  );
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<RoleEditFormValues>({
    resolver: roleFormResolver,
    defaultValues: {
      name: role?.name ?? "",
    },
    mode: "onChange",
  });

  // The modal instance is reused across roles, so useForm's one-time
  // defaultValues won't reflect a newly selected role. Force a fresh reset
  // every time it opens (and clear stale values when it closes).
  useEffect(() => {
    if (!open) {
      reset({ name: "" });
      return;
    }
    reset({
      name: role?.name ?? "",
    });
  }, [open, role, reset]);

  async function submit(values: RoleEditFormValues) {
    if (!isDirty) return;
    const result = role
      ? await editRole(role.id, values)
      : await addRole({ ...values, permissions: [] });
    if (!result.ok) {
      if (result.status === 404) return setSubmitError({ status: 404 });
      return toast.error(result.message || "تعذر حفظ الدور");
    }
    showSuccessModal(result.message || "تم حفظ الدور بنجاح");
    onSaved();
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
