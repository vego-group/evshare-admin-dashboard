"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { PAGE_SIZE } from "@/constants";
import {
  useDeletePermissionCategory,
  usePermissionCategories,
  usePermissionCategory,
} from "@/hooks/api";
import { useUserPermissions } from "@/hooks";
import { showSuccessModal } from "@/components/ui/success-modal";
import type { PermissionCategory } from "@/types";
import DeleteModal from "../shared/delete-modal";
import DetailsModal from "../shared/details-modal";
import EntityPagination from "../shared/entity-pagination";
import EntityTable, { type TableColumn } from "../shared/entity-table";
import EntityToolbar from "../shared/entity-toolbar";
import PermissionCategoryFormModal from "./permission-category-form-modal";

const categoryLabel = (item: PermissionCategory) =>
  item.name_ar || item.name_en || item.name;

const columns: TableColumn<PermissionCategory>[] = [
  {
    key: "name",
    label: "الاسم",
    render: (item) => (
      <div className="min-w-0">
        <p className="truncate font-semibold text-secondary">{categoryLabel(item)}</p>
        {(item.name_en || item.name) !== categoryLabel(item) && (
          <p className="mt-1 truncate text-xs text-gray" dir="ltr">
            {item.name_en || item.name}
          </p>
        )}
      </div>
    ),
  },
  {
    key: "slug",
    label: "المعرّف",
    render: (item) => <span dir="ltr">{item.slug}</span>,
  },
];

export default function PermissionCategoriesPanel() {
  const { hasPermission } = useUserPermissions();
  const client = useQueryClient();
  const deleteMutation = useDeletePermissionCategory();
  const canView = hasPermission("Admin Details Permission Categories");
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [orderBy, setOrderBy] = useState<"asc" | "desc">("desc");
  const [view, setView] = useState<PermissionCategory | null>(null);
  const [form, setForm] = useState<PermissionCategory | "new" | null>(null);
  const [pendingDelete, setPendingDelete] = useState<PermissionCategory | null>(null);
  const { data, isLoading } = usePermissionCategories({
    page,
    limit: PAGE_SIZE,
    search,
    order_by: orderBy,
  });
  const {
    data: detail,
    isLoading: detailLoading,
    error: detailError,
  } = usePermissionCategory(view?.id ?? null);
  const item = detail?.data;

  const refresh = () => Promise.all([
    client.invalidateQueries({ queryKey: ["permission-categories"] }),
    client.invalidateQueries({ queryKey: ["permission-category"] }),
    client.invalidateQueries({ queryKey: ["permissions"] }),
    client.invalidateQueries({ queryKey: ["permission"] }),
  ]);

  async function saved() {
    await refresh();
    setForm(null);
  }

  async function remove() {
    if (!pendingDelete) return;
    const result = await deleteMutation.mutateAsync(pendingDelete.id);
    if (!result.ok) {
      return toast.error(result.message || "تعذر حذف تصنيف الصلاحيات");
    }
    const shouldGoBack = page > 1 && data?.data.length === 1;
    setPendingDelete(null);
    if (shouldGoBack) setPage((current) => current - 1);
    await refresh();
    showSuccessModal(result.message || "تم حذف تصنيف الصلاحيات");
  }

  return (
    <section className="space-y-4">
      <EntityToolbar
        title="تصنيفات الصلاحيات"
        description="تنظيم الصلاحيات في مجموعات قابلة للإسناد"
        addLabel="إضافة تصنيف"
        search={search}
        orderBy={orderBy}
        onSort={(value) => {
          setOrderBy(value);
          setPage(1);
        }}
        onSearch={(value) => {
          setSearch(value);
          setPage(1);
        }}
        onAdd={hasPermission("Admin Add Permission Categories") ? () => setForm("new") : undefined}
      />
      <EntityTable
        rows={Array.isArray(data?.data) ? data.data : []}
        columns={columns}
        isLoading={isLoading}
        onView={canView ? setView : undefined}
        onEdit={hasPermission("Admin Edit Permission Categories") ? setForm : undefined}
        onDelete={hasPermission("Admin Delete Permission Categories") ? setPendingDelete : undefined}
      />
      <EntityPagination meta={data?.meta} onChange={setPage} />
      {form && (
        <PermissionCategoryFormModal
          open
          category={form === "new" ? null : form}
          onClose={() => setForm(null)}
          onSaved={saved}
        />
      )}
      <DetailsModal
        open={Boolean(view)}
        title="تفاصيل التصنيف"
        loading={detailLoading}
        error={detailError}
        onClose={() => setView(null)}
        fields={[
          { label: "المعرّف", value: item?.id },
          { label: "الاسم", value: item ? categoryLabel(item) : undefined },
          { label: "الاسم العربي", value: item?.name_ar },
          { label: "الاسم الإنجليزي", value: item?.name_en },
          { label: "المعرّف البرمجي", value: item?.slug },
          { label: "تاريخ الإنشاء", value: item?.created_at },
          { label: "آخر تحديث", value: item?.updated_at },
          {
            label: `الصلاحيات${item?.permissions ? ` (${item.permissions.length})` : ""}`,
            fullWidth: true,
            value: item?.permissions?.length ? (
              <div className="max-h-56 overflow-y-auto pr-2 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-primary/40 hover:[&::-webkit-scrollbar-thumb]:bg-primary/60">
                <div className="flex flex-wrap gap-2">
                  {item.permissions.map((permission) => (
                    <span
                      key={permission.id}
                      className="inline-flex h-7.5 items-center rounded-full bg-primary/10 px-3 text-xs font-medium text-secondary"
                    >
                      {permission.name_ar || permission.name_en || permission.slug || permission.name}
                    </span>
                  ))}
                </div>
              </div>
            ) : undefined,
          },
        ]}
      />
      <DeleteModal
        open={Boolean(pendingDelete)}
        name={pendingDelete ? categoryLabel(pendingDelete) : undefined}
        description="سيتم حذف التصنيف من القائمة، بينما ستبقى الصلاحيات التابعة له محفوظة وتصبح بلا تصنيف."
        loading={deleteMutation.isPending}
        onClose={() => setPendingDelete(null)}
        onConfirm={remove}
      />
    </section>
  );
}
