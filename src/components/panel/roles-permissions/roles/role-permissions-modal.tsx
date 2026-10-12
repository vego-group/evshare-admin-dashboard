"use client";

import { showSuccessModal } from "@/components/ui/success-modal";

import { useState } from "react";
import toast from "react-hot-toast";
import { Search } from "lucide-react";
import Modal from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import Loader from "@/components/ui/loader";
import {
  useAssignRolePermissionsByCategory,
  usePermissionCategories,
  usePermissions,
  useRole,
  useSyncRolePermissions,
} from "@/hooks/api";
import type { Role } from "@/types";
import EntityError from "../shared/entity-error";
import EntityPagination from "../shared/entity-pagination";
import RolePermissionsShimmer from "./role-permissions-shimmer";
import Dropdown from "../shared/dropdown";
import PermissionGate from "@/components/permission-gate";
import { PAGE_SIZE } from "@/constants";
import useDebouncedChange from "@/hooks/use-debounced-change";

type Props = { role: Role | null; onClose: () => void; onSaved: () => void };
const categoriesParams = { page: 1, limit: 200 };

export default function RolePermissionsModal({
  role,
  onClose,
  onSaved,
}: Props) {
  const [permissionsPage, setPermissionsPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [permissionsSearch, setPermissionsSearch] = useState("");
  const {
    data: roleData,
    isLoading,
    error: roleError,
  } = useRole(role?.id ?? null);
  const {
    data: permissions,
    isLoading: permissionsLoading,
    error: permissionsError,
  } = usePermissions({
    page: permissionsPage,
    limit: PAGE_SIZE,
    search: permissionsSearch,
  });
  const { data: categories, isLoading: categoriesLoading, error: categoriesError } =
    usePermissionCategories(categoriesParams);
  const syncMutation = useSyncRolePermissions();
  const assignMutation = useAssignRolePermissionsByCategory();
  const [selection, setSelection] = useState<string[] | null>(null);
  const [categoryId, setCategoryId] = useState("");
  const saving = syncMutation.isPending || assignMutation.isPending;
  const categoryItems = Array.isArray(categories?.data) ? categories.data : [];
  const permissionItems = Array.isArray(permissions?.data)
    ? permissions.data
    : [];

  useDebouncedChange(searchInput, (value) => {
    setPermissionsSearch(value.trim());
    setPermissionsPage(1);
  }, 400);

  const original = roleData?.data.permissions?.map((item) => item.name) ?? [];
  const selected = selection ?? original;
  const selectedSet = new Set(selected);
  const toggle = (name: string) =>
    setSelection(
      selected.includes(name)
        ? selected.filter((item) => item !== name)
        : [...selected, name],
    );
  const hasChanges =
    selected.length !== original.length ||
    selected.some((name) => !original.includes(name));

  async function sync() {
    if (!role) return;
    const result = await syncMutation.mutateAsync({
      id: role.id,
      payload: { permissions: selected },
    });
    if (!result.ok)
      return toast.error(result.message || "تعذر مزامنة الصلاحيات");
    showSuccessModal(result.message || "تمت مزامنة الصلاحيات");
    onSaved();
  }

  async function assignCategory() {
    if (!role || !categoryId) return;
    const result = await assignMutation.mutateAsync({
      id: role.id,
      payload: { permission_category_id: categoryId },
    });
    if (!result.ok) return toast.error(result.message || "تعذر إسناد التصنيف");
    showSuccessModal(result.message || "تم إسناد صلاحيات التصنيف");
    setSelection(null);
    setCategoryId("");
    onSaved();
  }

  return (
    <Modal
      open={Boolean(role)}
      onClose={onClose}
      title={`صلاحيات ${role?.name ?? ""}`}
      description="حدد الصلاحيات أو أسند تصنيفًا كاملًا للدور"
      contentClassName="max-w-3xl rounded-[20px]"
    >
      <div className="space-y-5 p-5">
        {isLoading || permissionsLoading || categoriesLoading ? (
          <RolePermissionsShimmer />
        ) : roleError || permissionsError || categoriesError ? (
          <EntityError error={roleError ?? permissionsError ?? categoriesError} />
        ) : (
          <>
            <PermissionGate slug="Admin Assign Roles Permissions By Category">
              <div className="flex flex-col gap-3 rounded-[14px] bg-background p-3 sm:flex-row">
                <Dropdown
                  value={categoryId}
                  placeholder="اختر تصنيف صلاحيات"
                  onChange={setCategoryId}
                  options={categoryItems.map((item) => ({
                    label: item.name,
                    value: item.id,
                  }))}
                />
                <Button
                  type="button"
                  disabled={!categoryId || saving}
                  onClick={assignCategory}
                  className="h-12 rounded-[14px] bg-primary px-5 text-secondary shadow-[0_4px_12px_rgba(255,213,79,0.25)] hover:bg-primary/90"
                >
                  {assignMutation.isPending ? <Loader /> : "إسناد التصنيف"}
                </Button>
              </div>
            </PermissionGate>
            <label className="relative flex h-12 items-center rounded-[14px] border border-neutral-200 bg-white px-4 pr-12 transition focus-within:border-primary focus-within:ring-3 focus-within:ring-primary/15">
              <Search className="pointer-events-none absolute right-4 size-5 text-gray" />
              <input
                type="search"
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                placeholder="ابحث في الصلاحيات..."
                className="h-full w-full bg-transparent text-sm text-secondary outline-none placeholder:text-[#99a1af]"
              />
            </label>
            <div className="grid max-h-96 gap-3 overflow-y-auto rounded-3xl bg-neutral-50/70 p-2 [scrollbar-color:color-mix(in_srgb,var(--color-primary)_70%,transparent)_transparent] [scrollbar-gutter:stable] [scrollbar-width:thin] sm:grid-cols-2 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-button]:hidden [&::-webkit-scrollbar-thumb]:min-h-12 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:border-2 [&::-webkit-scrollbar-thumb]:border-solid [&::-webkit-scrollbar-thumb]:border-transparent [&::-webkit-scrollbar-thumb]:bg-primary/60 [&::-webkit-scrollbar-thumb]:bg-clip-padding hover:[&::-webkit-scrollbar-thumb]:bg-primary [&::-webkit-scrollbar-track]:my-2 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-neutral-200/60">
              {permissionItems.length ? permissionItems.map((permission) => (
                <label
                  key={permission.id}
                  className="flex cursor-pointer items-center gap-3 rounded-[14px] border border-neutral-100 bg-white p-4 text-sm text-secondary transition hover:border-primary/70 hover:bg-primary/5"
                >
                  <input
                    type="checkbox"
                    checked={selectedSet.has(permission.name)}
                    onChange={() => toggle(permission.name)}
                    className="size-5 accent-primary"
                  />
                  <span className="font-medium" dir="ltr">
                    {permission.slug}
                  </span>
                </label>
              )) : (
                <p className="py-8 text-center text-sm text-gray sm:col-span-2">
                  لا توجد صلاحيات مطابقة
                </p>
              )}
            </div>
            <EntityPagination
              meta={permissions?.meta}
              onChange={setPermissionsPage}
            />
            <div className="grid grid-cols-2 gap-3 pt-2">
              <Button
                variant="ghost"
                type="button"
                disabled={saving}
                onClick={onClose}
                className="h-12 rounded-[14px] bg-neutral-100 text-dark-gray"
              >
                إغلاق
              </Button>
              <PermissionGate slug="Admin Sync Roles Permissions">
                <Button
                  type="button"
                  disabled={saving || !hasChanges}
                  onClick={sync}
                  className="h-12 rounded-[14px] text-secondary"
                >
                  {syncMutation.isPending ? <Loader /> : "حفظ الصلاحيات"}
                </Button>
              </PermissionGate>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}
