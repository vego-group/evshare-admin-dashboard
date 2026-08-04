"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { PAGE_SIZE } from "@/constants";
import { useUserPermissions } from "@/hooks";
import { useTestAccounts } from "@/hooks/api";
import { deleteTestAccount, disableTestAccount, enableTestAccount } from "@/services/mutations";
import type { TestAccountListItem, TestAccountsQueryParams } from "@/types";

import TestAccountsContentShimmer from "./content-shimmer";
import TestAccountsHeader from "./header";
import {
  TestAccountConfirmModal,
  TestAccountDetailsModal,
  TestAccountFormModal,
} from "./modals";
import TestAccountsMainContent from "./test-accounts-main-content";

function TestAccounts() {
  const queryClient = useQueryClient();
  const { isLoading: isPermissionsLoading, hasAnyPermission } = useUserPermissions();
  const canIndexTestAccounts = hasAnyPermission("Admin Index Test Accounts");
  const [params, setParams] = useState<TestAccountsQueryParams>({ page: 1, limit: PAGE_SIZE });
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [testAccountPendingView, setTestAccountPendingView] = useState<TestAccountListItem | null>(null);
  const [testAccountPendingEdit, setTestAccountPendingEdit] = useState<TestAccountListItem | null>(null);
  const [testAccountPendingToggle, setTestAccountPendingToggle] = useState<TestAccountListItem | null>(null);
  const [testAccountPendingDelete, setTestAccountPendingDelete] = useState<TestAccountListItem | null>(null);
  const [isTogglingActive, setIsTogglingActive] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const { data, isLoading } = useTestAccounts(params, canIndexTestAccounts);

  const updateParams = (nextParams: Partial<TestAccountsQueryParams>) =>
    setParams((current) => ({ ...current, ...nextParams }));

  async function refreshTestAccountQueries() {
    await queryClient.invalidateQueries({ queryKey: ["test-accounts"] });
  }

  async function handleToggleActive() {
    if (!testAccountPendingToggle || isTogglingActive) return;
    setIsTogglingActive(true);
    const mutate = testAccountPendingToggle.is_active ? disableTestAccount : enableTestAccount;
    const result = await mutate(testAccountPendingToggle.id);
    setIsTogglingActive(false);
    if (result?.ok) {
      toast.success(result.message || "تم تحديث حالة حساب الاختبار بنجاح");
      setTestAccountPendingToggle(null);
      await refreshTestAccountQueries();
      return;
    }
    toast.error(result?.message || "فشل تحديث حالة حساب الاختبار");
  }

  async function handleDeleteTestAccount() {
    if (!testAccountPendingDelete || isDeleting) return;
    setIsDeleting(true);
    const result = await deleteTestAccount(testAccountPendingDelete.id);
    setIsDeleting(false);
    if (result?.ok) {
      toast.success(result.message || "تم حذف حساب الاختبار بنجاح");
      setTestAccountPendingDelete(null);
      await refreshTestAccountQueries();
      return;
    }
    toast.error(result?.message || "فشل حذف حساب الاختبار");
  }

  return (
    <div className="flex w-full flex-col gap-6">
      {isPermissionsLoading || isLoading ? (
        <TestAccountsContentShimmer />
      ) : (
        <>
          <TestAccountsHeader
            onAddTestAccount={() => {
              setTestAccountPendingEdit(null);
              setIsFormOpen(true);
            }}
          />
          {canIndexTestAccounts ? (
            <TestAccountsMainContent
              data={data}
              params={params}
              onParamsChange={updateParams}
              onViewTestAccount={setTestAccountPendingView}
              onEditTestAccount={(testAccount) => {
                setTestAccountPendingEdit(testAccount);
                setIsFormOpen(true);
              }}
              onToggleActive={setTestAccountPendingToggle}
              onDeleteTestAccount={setTestAccountPendingDelete}
            />
          ) : (
            <p className="rounded-2xl bg-white p-6 text-center text-sm text-gray">
              You do not have permission to access test accounts.
            </p>
          )}
        </>
      )}

      <TestAccountDetailsModal
        testAccountId={testAccountPendingView?.id ?? null}
        open={Boolean(testAccountPendingView)}
        onClose={() => setTestAccountPendingView(null)}
      />

      <TestAccountFormModal
        key={testAccountPendingEdit?.id ?? "add-test-account"}
        open={isFormOpen}
        testAccount={testAccountPendingEdit}
        onClose={() => setIsFormOpen(false)}
        onSaved={refreshTestAccountQueries}
      />

      <TestAccountConfirmModal
        open={Boolean(testAccountPendingToggle)}
        variant={testAccountPendingToggle?.is_active ? "disable" : "enable"}
        userName={testAccountPendingToggle?.user.name}
        isSubmitting={isTogglingActive}
        onClose={() => {
          if (!isTogglingActive) setTestAccountPendingToggle(null);
        }}
        onConfirm={handleToggleActive}
      />

      <TestAccountConfirmModal
        open={Boolean(testAccountPendingDelete)}
        variant="delete"
        userName={testAccountPendingDelete?.user.name}
        isSubmitting={isDeleting}
        onClose={() => {
          if (!isDeleting) setTestAccountPendingDelete(null);
        }}
        onConfirm={handleDeleteTestAccount}
      />
    </div>
  );
}

export default TestAccounts;
