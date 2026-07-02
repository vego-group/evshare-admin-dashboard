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

const columns: TableColumn<Permission>[] = [
  {
    key: "slug",
    label: "الصلاحية",
    render: (item) => (
      <span className="inline-flex max-w-full whitespace-normal break-words rounded-lg bg-neutral-50 px-3 py-2 font-semibold leading-6 text-secondary" dir="ltr">
        {item.slug || item.name}
      </span>
    ),
  },
  {
    key: "dashboard",
    label: "لوحة التحكم",
    render: (item) => item.dashboard_permissions ? (
      <span className="inline-flex rounded-full bg-green-50 px-3 py-1.5 text-sm font-medium text-green-600">
        مفعّلة
      </span>
    ) : (
      <span className="inline-flex rounded-full bg-neutral-100 px-3 py-1.5 text-sm font-medium text-dark-gray">
        غير مفعّلة
      </span>
    ),
  },
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
      <EntityTable rows={Array.isArray(data?.data) ? data.data : []} columns={columns} isLoading={isLoading} onView={setView} onEdit={setForm} onDelete={setPendingDelete} tableClassName="min-w-[680px]" />
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
