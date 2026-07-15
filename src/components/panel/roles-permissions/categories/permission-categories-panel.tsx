"use client";

import { useState } from "react";
import { PAGE_SIZE } from "@/constants";
import { usePermissionCategories, usePermissionCategory } from "@/hooks/api";
import type { PermissionCategory } from "@/types";
import DetailsModal from "../shared/details-modal";
import EntityPagination from "../shared/entity-pagination";
import EntityTable, { type TableColumn } from "../shared/entity-table";
import EntityToolbar from "../shared/entity-toolbar";

const columns: TableColumn<PermissionCategory>[] = [
  { key: "name", label: "الاسم", render: (item) => item.name },
  {
    key: "slug",
    label: "المعرّف",
    render: (item) => <span dir="ltr">{item.slug}</span>,
  },
];

export default function PermissionCategoriesPanel() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [orderBy, setOrderBy] = useState<"asc" | "desc">("desc");
  const [view, setView] = useState<PermissionCategory | null>(null);
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
  return (
    <section className="space-y-4">
      <EntityToolbar
        title="تصنيفات الصلاحيات"
        description="تنظيم الصلاحيات في مجموعات قابلة للإسناد"
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
      />
      <EntityTable
        rows={Array.isArray(data?.data) ? data.data : []}
        columns={columns}
        isLoading={isLoading}
        onView={setView}
      />
      <EntityPagination meta={data?.meta} onChange={setPage} />
      <DetailsModal
        open={Boolean(view)}
        title="تفاصيل التصنيف"
        loading={detailLoading}
        error={detailError}
        onClose={() => setView(null)}
        fields={[
          { label: "المعرّف", value: item?.id },
          { label: "الاسم", value: item?.name },
          { label: "الاسم العربي", value: item?.name_ar },
          { label: "الاسم الإنجليزي", value: item?.name_en },
          { label: "المعرّف البرمجي", value: item?.slug },
          { label: "تاريخ الإنشاء", value: item?.created_at },
          { label: "آخر تحديث", value: item?.updated_at },
          {
            label: "الصلاحيات",
            fullWidth: true,
            value: item?.permissions?.length ? (
              <div className="max-h-56 overflow-y-auto pr-2 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-primary/40 hover:[&::-webkit-scrollbar-thumb]:bg-primary/60">
                <div className="flex flex-wrap gap-2">
                  {item.permissions.map((permission) => (
                    <span
                      key={permission.id}
                      className="inline-flex h-7.5 items-center rounded-full bg-primary/10 px-3 text-xs font-medium text-secondary"
                    >
                      {permission.name}
                    </span>
                  ))}
                </div>
              </div>
            ) : undefined,
          },
        ]}
      />
    </section>
  );
}
