"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import Modal from "@/components/ui/modal";
import InputErrorMessage from "@/components/ui/input-error-message";
import { useUser, useCities, useRoles } from "@/hooks/api";
import { useUserPermissions } from "@/hooks";
import { useUserSession } from "@/lib/utils/user-session";
import { assignUserRole, editUser, type EditUserPayload } from "@/services/mutations/users";
import { UserFormActions } from "./user-form-modal-parts";

type Values = {
  first_name: string;
  last_name: string;
  email: string;
  city_id: string;
  active: boolean;
  language: "ar" | "en";
  notifications_enabled: boolean;
};

const fields = ["first_name", "last_name", "email", "city_id", "active", "language", "notifications_enabled"] as const;

export default function UserEditModal({ userId, onClose, onSaved }: {
  userId: string | null;
  onClose: () => void;
  onSaved: (id: string, data: NonNullable<Awaited<ReturnType<typeof editUser>>["data"]>) => Promise<void> | void;
}) {
  const { data, isLoading } = useUser(userId);
  const { data: cities } = useCities({ page: 1, limit: 100 });
  const { data: roles } = useRoles({ page: 1, limit: 100 });
  const session = useUserSession();
  const { hasPermission } = useUserPermissions();
  const [selectedRoleId, setSelectedRoleId] = useState("");
  const [roleError, setRoleError] = useState("");
  const [isAssigningRole, setIsAssigningRole] = useState(false);
  const user = data?.data;
  const currentRoleId = user?.role_id ?? roles?.data?.find(role => role.name === user?.role)?.id ?? "";
  const canAssignRole = Boolean(user && user.account_status !== "deleted" && session?.id && session.id !== user.id && hasPermission("Admin Assign User Roles"));
  const canEdit = hasPermission("Admin Edit Users");
  const { register, handleSubmit, reset, setError, formState: { errors, isSubmitting } } = useForm<Values>();

  useEffect(() => {
    if (!user || !userId || isAssigningRole) return;
    reset({
      first_name: user.first_name ?? "",
      last_name: user.last_name ?? "",
      email: user.email ?? "",
      city_id: user.city?.id ?? "",
      active: user.active,
      language: user.language ?? "ar",
      notifications_enabled: user.notifications_enabled ?? false,
    });
  }, [user, userId, reset]);

  useEffect(() => {
    setSelectedRoleId(currentRoleId);
    setRoleError("");
  }, [userId, currentRoleId]);

  async function submit(values: Values) {
    if (!user || !userId) return;
    const original: Values = {
      first_name: user.first_name ?? "", last_name: user.last_name ?? "",
      email: user.email ?? "", city_id: user.city?.id ?? "",
      active: user.active,
      language: user.language ?? "ar", notifications_enabled: user.notifications_enabled ?? false,
    };
    const payload: EditUserPayload = {};
    for (const field of fields) {
      if (values[field] === original[field]) continue;
      if (field === "email" || field === "city_id") {
        payload[field] = values[field] || null;
      } else if (field === "notifications_enabled" || field === "active") {
        payload[field] = values[field];
      } else if (field === "language") {
        payload[field] = values[field];
      } else {
        payload[field] = values[field];
      }
    }
    if (!Object.keys(payload).length) { onClose(); return; }
    const result = await editUser(userId, payload);
    if (!result.ok) {
      if (result.status === 422 && result.error?.errors) {
        for (const field of fields) {
          const message = result.error.errors[field]?.[0];
          if (message) setError(field, { type: "server", message });
        }
      }
      toast.error(result.error?.message || result.message || "تعذر تحديث المستخدم");
      return;
    }
    toast.success(result.message || "تم تحديث المستخدم");
    await onSaved(userId, result.data!);
    onClose();
  }

  async function saveRole() {
    if (!userId || !canAssignRole || !selectedRoleId || selectedRoleId === currentRoleId || isAssigningRole) return;
    setIsAssigningRole(true);
    setRoleError("");
    try {
      const result = await assignUserRole(userId, selectedRoleId);
      if (!result.ok || !result.data) {
        const message = result.error?.error_code === "SELF_ROLE_CHANGE_FORBIDDEN"
          ? "لا يمكنك تغيير دورك الخاص"
          : result.error?.error_code === "ROLE_ESCALATION_FORBIDDEN"
            ? "لا تملك صلاحية تعيين هذا الدور أو تغيير دور هذا المستخدم"
            : result.error?.error_code === "INVALID_ACCOUNT_TRANSITION"
              ? "لا يمكن تغيير دور حساب محذوف"
              : result.error?.errors?.role_id?.[0] || result.error?.message || result.message || "تعذر تعيين الدور";
        setRoleError(message);
        return;
      }
      await onSaved(userId, result.data);
      toast.success(result.message || "تم تعيين الدور");
    } finally {
      setIsAssigningRole(false);
    }
  }

  const inputClass = "h-12 w-full rounded-xl border border-primary bg-primary/4 px-3 text-sm text-dark-gray";
  return <Modal open={Boolean(userId)} onClose={() => { if (!isAssigningRole) onClose(); }} title="تعديل المستخدم" contentClassName="md:max-w-[560px]">
    {isLoading || !user ? <p className="p-5 text-center">جار التحميل...</p> :
      <div className="space-y-5 p-2">
      {canEdit && <form onSubmit={handleSubmit(submit)} className="grid gap-4 sm:grid-cols-2">
        <label>الاسم الأول<input className={inputClass} {...register("first_name", { required: "الاسم الأول مطلوب", minLength: { value: 2, message: "حرفان على الأقل" }, maxLength: 100 })} /><InputErrorMessage msg={errors.first_name?.message} /></label>
        <label>الاسم الأخير<input className={inputClass} {...register("last_name", { required: "الاسم الأخير مطلوب", minLength: { value: 2, message: "حرفان على الأقل" }, maxLength: 100 })} /><InputErrorMessage msg={errors.last_name?.message} /></label>
        <label className="sm:col-span-2">البريد الإلكتروني<input type="email" dir="ltr" className={inputClass} {...register("email")} /><InputErrorMessage msg={errors.email?.message} /></label>
        <label>المدينة<select className={inputClass} {...register("city_id")}><option value="">بدون مدينة</option>{user.city && !cities?.data?.some(city => city.id === user.city?.id) && <option value={user.city.id}>{user.city.name}</option>}{cities?.data?.map(city => <option key={city.id} value={city.id}>{city.name}</option>)}</select><InputErrorMessage msg={errors.city_id?.message} /></label>
        <label>اللغة<select className={inputClass} {...register("language")}><option value="ar">العربية</option><option value="en">English</option></select><InputErrorMessage msg={errors.language?.message} /></label>
        <label className="flex items-center gap-2"><input type="checkbox" {...register("active")} />الحساب نشط</label>
        <label className="flex items-center gap-2"><input type="checkbox" {...register("notifications_enabled")} />الإشعارات مفعلة</label>
        <div className="sm:col-span-2"><UserFormActions submitLabel="حفظ التغييرات" isSubmitting={isSubmitting || isAssigningRole} onClose={onClose} /></div>
      </form>}
      {canAssignRole && <div className="border-t border-primary/15 pt-4">
        <label htmlFor="user-role-id">الدور</label>
        <div className="flex gap-2">
          <select id="user-role-id" className={inputClass} value={selectedRoleId} onChange={event => { setSelectedRoleId(event.target.value); setRoleError(""); }}>
            <option value="" disabled>اختر الدور</option>
            {currentRoleId && !roles?.data?.some(role => role.id === currentRoleId) && <option value={currentRoleId}>{user.role}</option>}
            {roles?.data?.map(role => <option key={role.id} value={role.id}>{role.name}</option>)}
          </select>
          <button type="button" className="shrink-0 rounded-xl bg-primary px-4 text-sm text-secondary disabled:opacity-50" disabled={!selectedRoleId || selectedRoleId === currentRoleId || isAssigningRole || isSubmitting} onClick={saveRole}>
            {isAssigningRole ? "جار الحفظ..." : "حفظ الدور"}
          </button>
        </div>
        <InputErrorMessage msg={roleError} />
        <p className="mt-1 text-xs text-gray">تغيير الدور يسجل خروج المستخدم من جميع أجهزته.</p>
      </div>}
      </div>}
  </Modal>;
}
