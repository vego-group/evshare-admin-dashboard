"use client";

import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import Modal from "@/components/ui/modal";
import InputErrorMessage from "@/components/ui/input-error-message";
import DashboardDropdown from "@/components/ui/dashboard-dropdown";
import { useUser, useCities, useRoles } from "@/hooks/api";
import { useUserPermissions } from "@/hooks";
import { useUserSession } from "@/lib/utils/user-session";
import { assignUserRole, editUser, type EditUserPayload } from "@/services/mutations/users";
import { UserFormActions } from "./user-form-modal-parts";
import UserEditRoleDropdown from "./user-edit-role-dropdown";
import UserEditModalShimmer from "./user-edit-modal-shimmer";

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
const userEditDefaultValues: Values = {
  first_name: "",
  last_name: "",
  email: "",
  city_id: "",
  active: false,
  language: "ar",
  notifications_enabled: false,
};
const languageOptions = [
  { value: "ar", label: "العربية" },
  { value: "en", label: "English" },
];

export default function UserEditModal({ userId, onClose, onSaved }: {
  userId: string | null;
  onClose: () => void;
  onSaved: (id: string, data: NonNullable<Awaited<ReturnType<typeof editUser>>["data"]>) => Promise<void> | void;
}) {
  const session = useUserSession();
  const { hasPermission } = useUserPermissions();
  const canRequestRoles =
    Boolean(userId) &&
    hasPermission("Admin Assign User Roles") &&
    hasPermission("Admin Index Roles");
  const { data, isLoading } = useUser(userId);
  const { data: cities, isLoading: citiesLoading } = useCities({ page: 1, limit: 100 });
  const { data: roles, isLoading: rolesLoading } = useRoles(
    { page: 1, limit: 100 },
    { enabled: canRequestRoles },
  );
  const [selectedRoleId, setSelectedRoleId] = useState("");
  const [roleError, setRoleError] = useState("");
  const [isAssigningRole, setIsAssigningRole] = useState(false);
  const user = data?.data;
  const cityOptions = [
    { value: "", label: "بدون مدينة" },
    ...(user?.city && !cities?.data?.some((city) => city.id === user.city?.id)
      ? [{ value: user.city.id, label: user.city.name }]
      : []),
    ...(cities?.data ?? []).map((city) => ({ value: city.id, label: city.name })),
  ];
  const currentRoleId = user?.role_id ?? roles?.data?.find(role => role.name === user?.role)?.id ?? "";
  const canAssignRole = Boolean(user && user.account_status !== "deleted" && session?.id && session.id !== user.id && canRequestRoles);
  const canEdit = hasPermission("Admin Edit Users");
  const { register, control, handleSubmit, reset, setError, formState: { errors, isSubmitting } } = useForm<Values>({
    defaultValues: userEditDefaultValues,
  });

  function clearStateAndClose() {
    reset(userEditDefaultValues);
    setSelectedRoleId("");
    setRoleError("");
    onClose();
  }

  function handleClose() {
    if (isSubmitting || isAssigningRole) return;
    clearStateAndClose();
  }

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
  }, [user, userId, reset, isAssigningRole]);

  useEffect(() => {
    if (userId) return;
    reset(userEditDefaultValues);
    setSelectedRoleId("");
    setRoleError("");
  }, [reset, userId]);

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
    if (!Object.keys(payload).length) return;
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
  return <Modal open={Boolean(userId)} onClose={handleClose} title="تعديل المستخدم" contentClassName="md:max-w-[560px]">
    {isLoading ? <UserEditModalShimmer showRole={canRequestRoles} /> : !user ? (
      <p className="p-5 text-center text-sm text-red-600">تعذر تحميل بيانات المستخدم.</p>
    ) :
      <div className="space-y-5 p-2">
      {canEdit && <form onSubmit={handleSubmit(submit)} className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-2 block">الاسم الأول</span>
          <input className={inputClass} {...register("first_name", { required: "الاسم الأول مطلوب", minLength: { value: 2, message: "حرفان على الأقل" }, maxLength: 100 })} />
          <InputErrorMessage msg={errors.first_name?.message} />
        </label>
        <label className="block">
          <span className="mb-2 block">الاسم الأخير</span>
          <input className={inputClass} {...register("last_name", { required: "الاسم الأخير مطلوب", minLength: { value: 2, message: "حرفان على الأقل" }, maxLength: 100 })} />
          <InputErrorMessage msg={errors.last_name?.message} />
        </label>
        <label className="block sm:col-span-2">
          <span className="mb-2 block">البريد الإلكتروني</span>
          <input type="email" dir="ltr" className={inputClass} {...register("email")} />
          <InputErrorMessage msg={errors.email?.message} />
        </label>
        <div>
          <label htmlFor="user-city-id" className="mb-2 block">المدينة</label>
          <Controller
            name="city_id"
            control={control}
            render={({ field }) => (
              <DashboardDropdown
                id="user-city-id"
                value={field.value ?? ""}
                options={cityOptions}
                onChange={field.onChange}
                placeholder="اختر المدينة"
                ariaLabel="المدن"
                loadingLabel="جاري تحميل المدن..."
                isLoading={citiesLoading}
              />
            )}
          />
          <InputErrorMessage msg={errors.city_id?.message} />
        </div>
        <div>
          <label htmlFor="user-language" className="mb-2 block">اللغة</label>
          <Controller
            name="language"
            control={control}
            render={({ field }) => (
              <DashboardDropdown
                id="user-language"
                value={field.value ?? "ar"}
                options={languageOptions}
                onChange={field.onChange}
                placeholder="اختر اللغة"
                ariaLabel="اللغات"
              />
            )}
          />
          <InputErrorMessage msg={errors.language?.message} />
        </div>
        <label className="flex items-center gap-2"><input type="checkbox" className="size-4 accent-primary" {...register("active")} />الحساب نشط</label>
        <label className="flex items-center gap-2"><input type="checkbox" className="size-4 accent-primary" {...register("notifications_enabled")} />الإشعارات مفعلة</label>
        <div className="sm:col-span-2"><UserFormActions submitLabel="حفظ التغييرات" isSubmitting={isSubmitting || isAssigningRole} onClose={handleClose} /></div>
      </form>}
      {canAssignRole && <div className="border-t border-primary/15 pt-4">
        <label htmlFor="user-role-id" className="mb-2 block">الدور</label>
        <div className="flex gap-2">
          <UserEditRoleDropdown
            roles={roles?.data ?? []}
            value={selectedRoleId}
            currentRole={currentRoleId ? { id: currentRoleId, name: user.role ?? "الدور الحالي" } : undefined}
            isLoading={rolesLoading}
            disabled={isAssigningRole || isSubmitting}
            onChange={(roleId) => {
              setSelectedRoleId(roleId);
              setRoleError("");
            }}
          />
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
