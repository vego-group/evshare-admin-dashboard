"use client";

import { useState } from "react";
import { LayoutGrid, List, Plus } from "lucide-react";

import PermissionGate from "@/components/permission-gate";
import { Button } from "@/components/ui/button";
import useDebouncedChange from "@/hooks/use-debounced-change";
import { cn } from "@/lib/utils";
import type { UserAccountStatus, UserRole, UserRoleSummary, UserSubscriptionStatus } from "@/types";

import type { UsersViewMode } from "../header";

import FilterSelect, { type FilterOption } from "./filter-select";
import SearchInput from "./search-input";

type UsersToolbarProps = {
  searchQuery?: string;
  selectedRole?: UserRole;
  selectedStatus?: UserAccountStatus;
  selectedSubscriptionStatus?: UserSubscriptionStatus;
  selectedSort?: "asc" | "desc";
  roles?: UserRoleSummary[];
  viewMode: UsersViewMode;
  onSearchChange?: (value: string) => void;
  onRoleChange?: (value?: UserRole) => void;
  onStatusChange?: (value?: UserAccountStatus) => void;
  onSubscriptionStatusChange?: (value?: UserSubscriptionStatus) => void;
  onSortChange?: (value: "asc" | "desc") => void;
  onViewModeChange: (viewMode: UsersViewMode) => void;
  onAddUser: () => void;
};

const sortOptions: FilterOption<"asc" | "desc">[] = [
  { label: "الأحدث", value: "desc" },
  { label: "الأقدم", value: "asc" },
];

const statusOptions: FilterOption<UserAccountStatus | "all">[] = [
  { label: "كل الحالات", value: "all" },
  { label: "نشط", value: "active" },
  { label: "معلق", value: "suspended" },
  { label: "محذوف", value: "deleted" },
];

const subscriptionOptions: FilterOption<UserSubscriptionStatus | "all">[] = [
  { label: "كل الاشتراكات", value: "all" },
  { label: "مشترك", value: "subscribed" },
  { label: "غير مشترك", value: "unsubscribed" },
];

function UsersToolbar({
  searchQuery,
  selectedRole,
  selectedStatus,
  selectedSubscriptionStatus,
  selectedSort,
  roles = [],
  viewMode,
  onSearchChange,
  onRoleChange,
  onStatusChange,
  onSubscriptionStatusChange,
  onSortChange,
  onViewModeChange,
  onAddUser,
}: UsersToolbarProps) {
  const [internalSearch, setInternalSearch] = useState(searchQuery ?? "");

  useDebouncedChange(internalSearch, onSearchChange, 500);

  const roleOptions: FilterOption<string>[] = [
    { label: "كل الأدوار", value: "all" },
    ...roles.map((role) => ({ label: role.name, value: role.key })),
  ];

  return (
    <section className="space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="w-full rounded-2xl border border-slate-100 bg-white shadow-[0_2px_8px_rgba(15,23,42,0.04)] sm:max-w-xl sm:flex-1">
          <SearchInput value={internalSearch} onChange={setInternalSearch} />
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <div className="flex h-12 items-center gap-1 rounded-2xl border border-slate-100 bg-white p-1 shadow-sm">
            <Button type="button" size="icon" variant="ghost" aria-label="عرض كروت" aria-pressed={viewMode === "card"}
              onClick={() => onViewModeChange("card")}
              className={cn("size-10 rounded-xl text-slate-500", viewMode === "card" && "bg-primary text-slate-900 hover:bg-primary/90")}>
              <LayoutGrid className="size-5" />
            </Button>
            <Button type="button" size="icon" variant="ghost" aria-label="عرض الجدول" aria-pressed={viewMode === "table"}
              onClick={() => onViewModeChange("table")}
              className={cn("size-10 rounded-xl text-slate-500", viewMode === "table" && "bg-primary text-slate-900 hover:bg-primary/90")}>
              <List className="size-5" />
            </Button>
          </div>
          <PermissionGate slug="Admin Add Users">
            <Button type="button" onClick={onAddUser}
              className="h-12 rounded-2xl bg-primary px-5 text-sm font-semibold text-secondary shadow-[0_5px_16px_rgba(255,206,39,0.28)] hover:bg-primary/90 sm:text-base">
              <Plus className="size-5" />
              إضافة مستخدم
            </Button>
          </PermissionGate>
        </div>
      </div>

      <div className="flex flex-col gap-3 rounded-2xl border border-slate-100 bg-white p-2 shadow-[0_2px_8px_rgba(15,23,42,0.04)] sm:flex-row sm:flex-wrap">
        <FilterSelect
          label="حالة الحساب"
          options={statusOptions}
          value={selectedStatus ?? "all"}
          onChange={(value) => onStatusChange?.(value === "all" ? undefined : value)}
        />
        <FilterSelect
          label="الدور"
          options={roleOptions}
          value={selectedRole ?? "all"}
          onChange={(value) => {
            onRoleChange?.(value === "all" ? undefined : (value as UserRole));
          }}
        />
        {selectedRole === "merchant" ? (
          <FilterSelect
            label="حالة الاشتراك"
            options={subscriptionOptions}
            value={selectedSubscriptionStatus ?? "all"}
            onChange={(value) => onSubscriptionStatusChange?.(value === "all" ? undefined : value)}
          />
        ) : null}
        <FilterSelect
          label="الترتيب"
          options={sortOptions}
          value={selectedSort ?? "desc"}
          onChange={(value) => onSortChange?.(value)}
        />
      </div>
    </section>
  );
}

export default UsersToolbar;
