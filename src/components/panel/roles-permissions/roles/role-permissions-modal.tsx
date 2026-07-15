"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import Modal from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import Loader from "@/components/ui/loader";
import { useAssignRolePermissionsByCategory, usePermissionCategories, usePermissions, useRole, useSyncRolePermissions } from "@/hooks/api";
import type { Role } from "@/types";
import EntityError from "../shared/entity-error";
import EntityPagination from "../shared/entity-pagination";
import RolePermissionsShimmer from "./role-permissions-shimmer";
import Dropdown from "../shared/dropdown";

type Props = { role: Role | null; onClose: () => void; onSaved: () => void };
const categoriesParams = { page: 1, limit: 200 };

export default function RolePermissionsModal({ role, onClose, onSaved }: Props) {
  const [permissionsPage, setPermissionsPage] = useState(1);
  const { data: roleData, isLoading, error: roleError } = useRole(role?.id ?? null);
  const { data: permissions, isLoading: permissionsLoading } = usePermissions({ page: permissionsPage, limit: 200 });
  const { data: categories, isLoading: categoriesLoading } = usePermissionCategories(categoriesParams);
  const syncMutation = useSyncRolePermissions();
  const assignMutation = useAssignRolePermissionsByCategory();
  const [selection, setSelection] = useState<string[] | null>(null);
  const [categoryId, setCategoryId] = useState("");
  const saving = syncMutation.isPending || assignMutation.isPending;
  const categoryItems = Array.isArray(categories?.data) ? categories.data : [];
  const permissionItems = Array.isArray(permissions?.data) ? permissions.data : [];

  const original = roleData?.data.permissions?.map((item) => item.name) ?? [];
  const selected = selection ?? original;
  const selectedSet = new Set(selected);
  const toggle = (name: string) => setSelection(
    selected.includes(name) ? selected.filter((item) => item !== name) : [...selected, name],
  );
  const hasChanges =
    selected.length !== original.length || selected.some((name) => !original.includes(name));

  async function sync() {
    if (!role) return;
    const result = await syncMutation.mutateAsync({ id: role.id, payload: { permissions: selected } });
    if (!result.ok) return toast.error(result.message || "تعذر مزامنة الصلاحيات");
    toast.success(result.message || "تمت مزامنة الصلاحيات");
    onSaved();
  }

  async function assignCategory() {
    if (!role || !categoryId) return;
    const result = await assignMutation.mutateAsync({ id: role.id, payload: { permission_category_id: categoryId } });
    if (!result.ok) return toast.error(result.message || "تعذر إسناد التصنيف");
    toast.success(result.message || "تم إسناد صلاحيات التصنيف");
    setSelection(null);
    setCategoryId("");
    onSaved();
  }

  return (
    <Modal open={Boolean(role)} onClose={onClose} title={`صلاحيات ${role?.name ?? ""}`} description="حدد الصلاحيات أو أسند تصنيفًا كاملًا للدور" contentClassName="max-w-3xl rounded-[20px]">
      <div className="space-y-5 p-5">
        {isLoading || permissionsLoading || categoriesLoading ? <RolePermissionsShimmer /> : roleError ? (
          <EntityError error={roleError} />
        ) : <>
        <div className="flex flex-col gap-3 rounded-[14px] bg-background p-3 sm:flex-row">
          <Dropdown value={categoryId} placeholder="اختر تصنيف صلاحيات" onChange={setCategoryId} options={categoryItems.map((item) => ({ label: item.name, value: item.id }))} />
          <Button type="button" disabled={!categoryId || saving} onClick={assignCategory} className="h-12 rounded-[14px] bg-primary px-5 text-secondary shadow-[0_4px_12px_rgba(255,213,79,0.25)] hover:bg-primary/90">{assignMutation.isPending ? <Loader /> : "إسناد التصنيف"}</Button>
        </div>
          <div className="grid max-h-96 gap-3 overflow-y-auto sm:grid-cols-2">
            {permissionItems.map((permission) => (
              <label key={permission.id} className="flex cursor-pointer items-center gap-3 rounded-[14px] border border-neutral-100 bg-white p-4 text-sm text-secondary transition hover:border-primary/70 hover:bg-primary/5">
                <input type="checkbox" checked={selectedSet.has(permission.name)} onChange={() => toggle(permission.name)} className="size-5 accent-primary" />
                <span className="font-medium">{permission.name_en || permission.name}</span>
              </label>
            ))}
          </div>
          <EntityPagination meta={permissions?.meta} onChange={setPermissionsPage} />
        <div className="grid grid-cols-2 gap-3 pt-2">
          <Button variant="ghost" type="button" disabled={saving} onClick={onClose} className="h-12 rounded-[14px] bg-neutral-100 text-dark-gray">إغلاق</Button>
          <Button type="button" disabled={saving || !hasChanges} onClick={sync} className="h-12 rounded-[14px] text-secondary">{syncMutation.isPending ? <Loader /> : "حفظ الصلاحيات"}</Button>
        </div>
        </>}
      </div>
    </Modal>
  );
}
