"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { PAGE_SIZE } from "@/constants";
import { useUsers } from "@/hooks/api";
import { reactivateUser, removeUser, suspendUser } from "@/services/mutations/users";
import type { AdminUserDetailResponse, UserListItem, UsersQueryParams } from "@/types";
import UsersMainContent from "./users-main-content";
import UsersContentShimmer from "./content-shimmer";
import UsersHeader, { type UsersViewMode } from "./header";
import { UserAddModal, UserDeleteConfirmModal, UserEditModal, UserSuspendModal } from "./modals";

function Users() {
  const queryClient = useQueryClient();
  const [viewMode, setViewMode] = useState<UsersViewMode>("table");
  const [params, setParams] = useState<UsersQueryParams>({ page: 1, limit: PAGE_SIZE });
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [userPendingDelete, setUserPendingDelete] = useState<UserListItem | null>(null);
  const [userPendingSuspend, setUserPendingSuspend] = useState<UserListItem | null>(null);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data, isLoading } = useUsers(params);

  const updateParams = (next: Partial<UsersQueryParams>) => setParams(current => ({ ...current, ...next }));
  const refreshUserQueries = async () => { await queryClient.invalidateQueries({ queryKey: ["users"] }); };
  async function updateUser(id: string, response: AdminUserDetailResponse) {
    queryClient.setQueryData(["user", id], response);
    await refreshUserQueries();
  }

  async function handleDeleteUser(reason: string) {
    if (!userPendingDelete || isSubmitting) return;
    setIsSubmitting(true);
    const result = await removeUser(userPendingDelete.id, reason);
    if (result.ok && result.data) {
      await updateUser(userPendingDelete.id, result.data);
      toast.success(result.message || "تمت إزالة المستخدم");
      setUserPendingDelete(null);
    } else toast.error(result.error?.message || result.message || "تعذرت إزالة المستخدم");
    setIsSubmitting(false);
  }

  async function handleSuspendUser(reason?: string) {
    if (!userPendingSuspend || isSubmitting) return;
    setIsSubmitting(true);
    const result = await suspendUser(userPendingSuspend.id, reason);
    if (result.ok && result.data) {
      await updateUser(userPendingSuspend.id, result.data);
      toast.success(result.message || "تم تعليق المستخدم");
      setUserPendingSuspend(null);
    } else toast.error(result.error?.message || result.message || "تعذر تعليق المستخدم");
    setIsSubmitting(false);
  }

  async function handleReactivateUser(user: UserListItem) {
    if (isSubmitting) return;
    setIsSubmitting(true);
    const result = await reactivateUser(user.id);
    if (result.ok && result.data) {
      await updateUser(user.id, result.data);
      toast.success(result.message || "تمت إعادة تفعيل المستخدم");
    } else toast.error(result.error?.message || result.message || "تعذرت إعادة تفعيل المستخدم");
    setIsSubmitting(false);
  }

  return <div className="flex w-full flex-col gap-6">
    {isLoading ? <UsersContentShimmer /> : <>
      <UsersHeader viewMode={viewMode} onViewModeChange={setViewMode} onAddUser={() => setIsAddModalOpen(true)} />
      <UsersMainContent data={data} params={params} viewMode={viewMode} onParamsChange={updateParams}
        onDeleteUser={setUserPendingDelete} onEditUser={user => setEditingUserId(user.id)}
        onSuspendUser={setUserPendingSuspend} onReactivateUser={handleReactivateUser} />
    </>}
    <UserAddModal open={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onSaved={refreshUserQueries} />
    <UserDeleteConfirmModal key={userPendingDelete?.id ?? "closed"} open={Boolean(userPendingDelete)} userName={userPendingDelete?.name} isDeleting={isSubmitting}
      onClose={() => { if (!isSubmitting) setUserPendingDelete(null); }} onConfirm={handleDeleteUser} />
    <UserSuspendModal key={userPendingSuspend?.id ?? "closed"} open={Boolean(userPendingSuspend)} userName={userPendingSuspend?.name} isSubmitting={isSubmitting}
      onClose={() => { if (!isSubmitting) setUserPendingSuspend(null); }} onConfirm={handleSuspendUser} />
    <UserEditModal userId={editingUserId} onClose={() => setEditingUserId(null)} onSaved={updateUser} />
  </div>;
}

export default Users;
