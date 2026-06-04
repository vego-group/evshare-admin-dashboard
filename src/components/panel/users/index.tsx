"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { PAGE_SIZE } from "@/constants";
import { useUsers } from "@/hooks/api";
import type { UserListItem, UsersQueryParams } from "@/types";

import UsersMainContent from "./users-main-content";
import UsersContentShimmer from "./content-shimmer";
import UsersHeader, { type UsersViewMode } from "./header";
import { UserAddModal, UserDeleteConfirmModal } from "./modals";

function Users() {
  const queryClient = useQueryClient();
  const [viewMode, setViewMode] = useState<UsersViewMode>("table");
  const [params, setParams] = useState<UsersQueryParams>({ page: 1, limit: PAGE_SIZE });
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [userPendingDelete, setUserPendingDelete] = useState<UserListItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { data, isLoading } = useUsers(params);

  const updateParams = (nextParams: Partial<UsersQueryParams>) =>
    setParams((current) => ({ ...current, ...nextParams }));

  async function refreshUserQueries() {
    await queryClient.invalidateQueries({ queryKey: ["users"] });
  }

  async function handleDeleteUser() {
    if (!userPendingDelete || isDeleting) return;
    setIsDeleting(true);
    // Delete endpoint to be wired when backend exposes it
    toast.error("حذف المستخدمين غير متاح حالياً");
    setIsDeleting(false);
    setUserPendingDelete(null);
  }

  return (
    <div className="flex w-full flex-col gap-6">
      {isLoading ? (
        <UsersContentShimmer />
      ) : (
        <>
          <UsersHeader
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            onAddUser={() => setIsAddModalOpen(true)}
          />
          <UsersMainContent
            data={data}
            params={params}
            viewMode={viewMode}
            onParamsChange={updateParams}
            onDeleteUser={setUserPendingDelete}
          />
        </>
      )}

      <UserAddModal
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSaved={refreshUserQueries}
      />

      <UserDeleteConfirmModal
        open={Boolean(userPendingDelete)}
        userName={userPendingDelete?.name}
        isDeleting={isDeleting}
        onClose={() => { if (!isDeleting) setUserPendingDelete(null); }}
        onConfirm={handleDeleteUser}
      />
    </div>
  );
}

export default Users;
