"use client";

import { useState } from "react";
import { PAGE_SIZE } from "@/constants";
import { usePermission, usePermissions } from "@/hooks/api";
import type { Permission } from "@/types";
import DetailsModal from "../shared/details-modal";
import EntityPagination from "../shared/entity-pagination";
import EntityTable, { type TableColumn } from "../shared/entity-table";
import EntityToolbar from "../shared/entity-toolbar";

const columns: TableColumn<Permission>[] = [
  {
    key: "slug",
    label: "الصلاحية",
    render: (item) => (
      <span
        className="inline-flex max-w-full whitespace-normal wrap-break-word rounded-lg bg-neutral-50 px-3 py-2 font-semibold leading-6 text-secondary"
        dir="ltr"
      >
        {item.slug || item.name}
      </span>
    ),
  },
  {
    key: "dashboard",
    label: "لوحة التحكم",
    render: (item) =>
      item.dashboard_permissions ? (
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
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [orderBy, setOrderBy] = useState<"asc" | "desc">("desc");
  const [view, setView] = useState<Permission | null>(null);
  const { data, isLoading } = usePermissions({
    page,
    limit: PAGE_SIZE,
    search,
    order_by: orderBy,
  });
  const {
    data: detail,
    isLoading: detailLoading,
    error: detailError,
  } = usePermission(view?.id ?? null);
  const item = detail?.data;
  return (
    <section className="space-y-4">
      <EntityToolbar
        title="الصلاحيات"
        description="إدارة صلاحيات النظام وربطها بالتصنيفات"
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
        canView={(item) => item.dashboard_permissions}
        tableClassName="min-w-[680px]"
      />
      <EntityPagination meta={data?.meta} onChange={setPage} />
      <DetailsModal
        open={Boolean(view)}
        title="تفاصيل الصلاحية"
        loading={detailLoading}
        error={detailError}
        onClose={() => setView(null)}
        fields={[
          { label: "المعرّف", value: item?.id },
          { label: "الاسم البرمجي", value: item?.name },
          { label: "الاسم العربي", value: item?.name_ar },
          { label: "الاسم الإنجليزي", value: item?.name_en },
          { label: "معرّف التصنيف", value: item?.permission_category_id },
          {
            label: "لوحة التحكم",
            value: item?.dashboard_permissions ? "نعم" : "لا",
          },
          { label: "تاريخ الإنشاء", value: item?.created_at },
          { label: "آخر تحديث", value: item?.updated_at },
        ]}
      />
    </section>
  );
}
