"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { PAGE_SIZE } from "@/constants";
import { useDeletePermissionCategory, usePermissionCategories, usePermissionCategory } from "@/hooks/api";
import type { PermissionCategory } from "@/types";
import DeleteModal from "../shared/delete-modal";
import DetailsModal from "../shared/details-modal";
import EntityPagination from "../shared/entity-pagination";
import EntityTable, { type TableColumn } from "../shared/entity-table";
import EntityToolbar from "../shared/entity-toolbar";
import PermissionCategoryFormModal from "./permission-category-form-modal";

const columns: TableColumn<PermissionCategory>[] = [
  { key: "name", label: "الاسم", render: (item) => item.name },
  { key: "slug", label: "المعرّف", render: (item) => <span dir="ltr">{item.slug}</span> },
  { key: "ar", label: "العربية", render: (item) => item.name_ar || "—" },
  { key: "en", label: "الإنجليزية", render: (item) => item.name_en || "—" },
];

export default function PermissionCategoriesPanel() {
  const client = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [orderBy, setOrderBy] = useState<"asc" | "desc">("desc");
  const [form, setForm] = useState<PermissionCategory | "new" | null>(null);
  const [view, setView] = useState<PermissionCategory | null>(null);
  const [pendingDelete, setPendingDelete] = useState<PermissionCategory | null>(null);
  const deleteMutation = useDeletePermissionCategory();
  const { data, isLoading } = usePermissionCategories({ page, limit: PAGE_SIZE, search, order_by: orderBy });
  const { data: detail, isLoading: detailLoading, error: detailError } = usePermissionCategory(view?.id ?? null);
  const refresh = async () => {
    await Promise.all([
      client.invalidateQueries({ queryKey: ["permission-categories"] }),
      client.invalidateQueries({ queryKey: ["permission-category"] }),
    ]);
  };
  async function remove() {
    if (!pendingDelete) return;
    const result = await deleteMutation.mutateAsync(pendingDelete.id);
    if (!result.ok) return toast.error(result.message || "تعذر حذف التصنيف");
    toast.success(result.message || "تم حذف التصنيف");
    setPendingDelete(null);
    refresh();
  }
  const item = detail?.data;
  return (
    <section className="space-y-4">
      <EntityToolbar title="تصنيفات الصلاحيات" description="تنظيم الصلاحيات في مجموعات قابلة للإسناد" addLabel="إضافة تصنيف" search={search} orderBy={orderBy} onSort={(value) => { setOrderBy(value); setPage(1); }} onSearch={(value) => { setSearch(value); setPage(1); }} onAdd={() => setForm("new")} />
      <EntityTable rows={Array.isArray(data?.data) ? data.data : []} columns={columns} isLoading={isLoading} onView={setView} onEdit={setForm} onDelete={setPendingDelete} />
      <EntityPagination meta={data?.meta} onChange={setPage} />
      {form && <PermissionCategoryFormModal open category={form === "new" ? null : form} onClose={() => setForm(null)} onSaved={refresh} />}
      <DetailsModal open={Boolean(view)} title="تفاصيل التصنيف" loading={detailLoading} error={detailError} onClose={() => setView(null)} fields={[
        { label: "المعرّف", value: item?.id }, { label: "الاسم", value: item?.name },
        { label: "الاسم العربي", value: item?.name_ar }, { label: "الاسم الإنجليزي", value: item?.name_en },
        { label: "المعرّف البرمجي", value: item?.slug }, { label: "تاريخ الإنشاء", value: item?.created_at },
        { label: "آخر تحديث", value: item?.updated_at },
      ]} />
      <DeleteModal open={Boolean(pendingDelete)} name={pendingDelete?.name} loading={deleteMutation.isPending} onClose={() => setPendingDelete(null)} onConfirm={remove} />
    </section>
  );
}
