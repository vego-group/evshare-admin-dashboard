"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useDeleteRole, useRole, useRoles } from "@/hooks/api";
import type { Role } from "@/types";
import DeleteModal from "../shared/delete-modal";
import DetailsModal from "../shared/details-modal";
import EntityTable, { type TableColumn } from "../shared/entity-table";
import EntityToolbar from "../shared/entity-toolbar";
import RoleFormModal from "./role-form-modal";
import RolePermissionsModal from "./role-permissions-modal";
import BooleanBadge from "../shared/boolean-badge";

const columns: TableColumn<Role>[] = [
  { key: "name", label: "الدور", render: (item) => item.name },
  { key: "allowed", label: "السماح للمستخدم", render: (item) => <BooleanBadge value={item.allowed_user} /> },
];

const protectedRoleNames = new Set(["merchant", "root", "driver"]);
const canModifyRole = (role: Role) => !protectedRoleNames.has(role.name.trim().toLowerCase());

export default function RolesPanel() {
  const client = useQueryClient();
  const [search, setSearch] = useState("");
  const [orderBy, setOrderBy] = useState<"asc" | "desc">("desc");
  const [form, setForm] = useState<Role | "new" | null>(null);
  const [view, setView] = useState<Role | null>(null);
  const [permissionsRole, setPermissionsRole] = useState<Role | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Role | null>(null);
  const deleteMutation = useDeleteRole();
  const { data, isLoading } = useRoles({ search, order_by: orderBy });
  const { data: detail, isLoading: detailLoading, error: detailError } = useRole(view?.id ?? null);

  const refresh = async () => {
    await Promise.all([
      client.invalidateQueries({ queryKey: ["roles"] }),
      client.invalidateQueries({ queryKey: ["role"] }),
    ]);
  };
  async function remove() {
    if (!pendingDelete) return;
    const result = await deleteMutation.mutateAsync(pendingDelete.id);
    if (!result.ok) return toast.error(result.message || "تعذر حذف الدور");
    toast.success(result.message || "تم حذف الدور");
    setPendingDelete(null);
    refresh();
  }

  return (
    <section className="space-y-4">
      <EntityToolbar title="الأدوار" description="إدارة الأدوار والصلاحيات المرتبطة بها" addLabel="إضافة دور" search={search} orderBy={orderBy} onSort={setOrderBy} onSearch={setSearch} onAdd={() => setForm("new")} />
      <EntityTable rows={Array.isArray(data?.data) ? data.data : []} columns={columns} isLoading={isLoading} onView={setView} onEdit={setForm} onDelete={setPendingDelete} onPermissions={setPermissionsRole} canEdit={canModifyRole} canDelete={canModifyRole} />
      {form && <RoleFormModal open role={form === "new" ? null : form} onClose={() => setForm(null)} onSaved={refresh} />}
      <RolePermissionsModal role={permissionsRole} onClose={() => setPermissionsRole(null)} onSaved={refresh} />
      <DetailsModal open={Boolean(view)} title="تفاصيل الدور" loading={detailLoading} error={detailError} onClose={() => setView(null)} fields={[
        { label: "المعرّف", value: detail?.data.id }, { label: "الاسم", value: detail?.data.name },
        { label: "السماح للمستخدم", value: detail?.data.allowed_user ? "نعم" : "لا" },
        { label: "الصلاحيات", value: detail?.data.permissions?.map((item) => item.name).join("، ") },
      ]} />
      <DeleteModal open={Boolean(pendingDelete)} name={pendingDelete?.name} loading={deleteMutation.isPending} onClose={() => setPendingDelete(null)} onConfirm={remove} />
    </section>
  );
}
