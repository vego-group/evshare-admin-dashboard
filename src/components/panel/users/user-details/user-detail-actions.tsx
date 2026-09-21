"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import PermissionGate from "@/components/permission-gate";
import { reactivateUser, removeUser, suspendUser } from "@/services/mutations/users";
import type { AdminUserDetail, AdminUserDetailResponse } from "@/types";
import { UserDeleteConfirmModal, UserEditModal, UserSuspendModal } from "../modals";
import { ADMIN_PERMISSIONS } from "@/constants";
import { syncUserMutationResponse } from "@/lib/user-query-cache";

export default function UserDetailActions({ user }: { user: AdminUserDetail }) {
  const queryClient = useQueryClient();
  const [action, setAction] = useState<"edit" | "suspend" | "remove" | null>(null);
  const [submitting, setSubmitting] = useState(false);
  async function saved(_id: string, response: AdminUserDetailResponse) {
    await syncUserMutationResponse(queryClient, response);
  }
  async function run(request: () => Promise<Awaited<ReturnType<typeof suspendUser>>>, fallback: string) {
    if (submitting) return;
    setSubmitting(true);
    try {
      const result = await request();
      if (result.ok && result.data) {
        await saved(user.id, result.data);
        toast.success(result.message || "تم تحديث الحساب");
        setAction(null);
      } else toast.error(result.error?.message || result.message || fallback);
    } catch {
      toast.error(fallback);
    } finally {
      setSubmitting(false);
    }
  }
  return <>
    {user.account_status !== "deleted" && <div className="flex flex-wrap gap-2">
      <PermissionGate slug={["Admin Edit Users", "Admin Assign User Roles"]}><Button type="button" variant="outline" onClick={() => setAction("edit")}>تعديل المستخدم</Button></PermissionGate>
      {user.account_status === "active" && <PermissionGate slug={ADMIN_PERMISSIONS.users.suspend}><Button type="button" variant="outline" onClick={() => setAction("suspend")}>تعليق الحساب</Button></PermissionGate>}
      {user.account_status === "suspended" && <PermissionGate slug={ADMIN_PERMISSIONS.users.reactivate}><Button type="button" variant="outline" disabled={submitting} onClick={() => run(() => reactivateUser(user.id), "تعذرت إعادة التفعيل")}>إعادة التفعيل</Button></PermissionGate>}
      <PermissionGate slug={ADMIN_PERMISSIONS.users.delete}><Button type="button" variant="outline" onClick={() => setAction("remove")}>إزالة الحساب</Button></PermissionGate>
    </div>}
    <UserEditModal userId={action === "edit" ? user.id : null} onClose={() => setAction(null)} onSaved={saved} />
    <UserSuspendModal key={action === "suspend" ? user.id : "closed"} open={action === "suspend"} userName={user.name} isSubmitting={submitting} onClose={() => { if (!submitting) setAction(null); }} onConfirm={reason => run(() => suspendUser(user.id, reason), "تعذر تعليق الحساب")} />
    <UserDeleteConfirmModal key={action === "remove" ? user.id : "closed"} open={action === "remove"} userName={user.name} isDeleting={submitting} onClose={() => { if (!submitting) setAction(null); }} onConfirm={reason => run(() => removeUser(user.id, reason), "تعذرت إزالة الحساب")} />
  </>;
}
