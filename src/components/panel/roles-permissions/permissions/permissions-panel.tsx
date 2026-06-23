"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { PAGE_SIZE } from "@/constants";
import { useDeletePermission, usePermission, usePermissions } from "@/hooks/api";
import type { Permission } from "@/types";
import DeleteModal from "../shared/delete-modal";
import DetailsModal from "../shared/details-modal";
import EntityPagination from "../shared/entity-pagination";
import EntityTable, { type TableColumn } from "../shared/entity-table";
import EntityToolbar from "../shared/entity-toolbar";
import PermissionFormModal from "./permission-form-modal";
import BooleanBadge from "../shared/boolean-badge";

const columns: TableColumn<Permission>[] = [
  { key: "name", label: "الاسم البرمجي", render: (item) => <span dir="ltr">{item.name}</span> },
  { key: "ar", label: "العربية", render: (item) => item.name_ar },
  { key: "en", label: "الإنجليزية", render: (item) => item.name_en },
  { key: "dashboard", label: "لوحة التحكم", render: (item) => <BooleanBadge value={item.dashboard_permissions} yes="مفعّلة" no="غير مفعّلة" /> },
];

export default function PermissionsPanel() {
  const client = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [orderBy, setOrderBy] = useState<"asc" | "desc">("desc");
  const [form, setForm] = useState<Permission | "new" | null>(null);
  const [view, setView] = useState<Permission | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Permission | null>(null);
  const deleteMutation = useDeletePermission();
  const { data, isLoading } = usePermissions({ page, limit: PAGE_SIZE, search, order_by: orderBy });
  const { data: detail, isLoading: detailLoading, error: detailError } = usePermission(view?.id ?? null);
  const refresh = async () => {
    await Promise.all([
      client.invalidateQueries({ queryKey: ["permissions"] }),
      client.invalidateQueries({ queryKey: ["permission"] }),
    ]);
  };
  async function remove() {
    if (!pendingDelete) return;
    const result = await deleteMutation.mutateAsync(pendingDelete.id);
    if (!result.ok) return toast.error(result.message || "تعذر حذف الصلاحية");
    toast.success(result.message || "تم حذف الصلاحية");
    setPendingDelete(null); refresh();
  }
  const item = detail?.data;
  return (
    <section className="space-y-4">
      <EntityToolbar title="الصلاحيات" description="إدارة صلاحيات النظام وربطها بالتصنيفات" addLabel="إضافة صلاحية" search={search} orderBy={orderBy} onSort={(value) => { setOrderBy(value); setPage(1); }} onSearch={(value) => { setSearch(value); setPage(1); }} onAdd={() => setForm("new")} />
      <EntityTable rows={Array.isArray(data?.data) ? data.data : []} columns={columns} isLoading={isLoading} onView={setView} onEdit={setForm} onDelete={setPendingDelete} />
      <EntityPagination meta={data?.meta} onChange={setPage} />
      {form && <PermissionFormModal open permission={form === "new" ? null : form} onClose={() => setForm(null)} onSaved={refresh} />}
      <DetailsModal open={Boolean(view)} title="تفاصيل الصلاحية" loading={detailLoading} error={detailError} onClose={() => setView(null)} fields={[
        { label: "المعرّف", value: item?.id }, { label: "الاسم البرمجي", value: item?.name },
        { label: "الاسم العربي", value: item?.name_ar }, { label: "الاسم الإنجليزي", value: item?.name_en },
        { label: "معرّف التصنيف", value: item?.permission_category_id }, { label: "لوحة التحكم", value: item?.dashboard_permissions ? "نعم" : "لا" },
        { label: "تاريخ الإنشاء", value: item?.created_at }, { label: "آخر تحديث", value: item?.updated_at },
      ]} />
      <DeleteModal open={Boolean(pendingDelete)} name={pendingDelete?.name} loading={deleteMutation.isPending} onClose={() => setPendingDelete(null)} onConfirm={remove} />
    </section>
  );
}
