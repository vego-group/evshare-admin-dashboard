"use client";

import { useEffect, useRef, useState } from "react";

import useDebounce from "@/hooks/use-debounce";
import type { UserRole } from "@/types";

import FilterSelect, { type FilterOption } from "./filter-select";
import SearchInput from "./search-input";

type UsersToolbarProps = {
  searchQuery?: string;
  selectedRole?: UserRole;
  selectedSort?: "asc" | "desc";
  onSearchChange?: (value: string) => void;
  onRoleChange?: (value?: UserRole) => void;
  onSortChange?: (value: "asc" | "desc") => void;
};

const sortOptions: FilterOption<"asc" | "desc">[] = [
  { label: "الأحدث", value: "desc" },
  { label: "الأقدم", value: "asc" },
];

const roleOptions: FilterOption<UserRole | "all">[] = [
  { label: "الكل", value: "all" },
  { label: "مستخدم", value: "user" },
  { label: "تاجر", value: "merchant" },
  { label: "سائق", value: "driver" },
  { label: "مدير", value: "root" },
];

function UsersToolbar({
  searchQuery,
  selectedRole,
  selectedSort,
  onSearchChange,
  onRoleChange,
  onSortChange,
}: UsersToolbarProps) {
  const [internalSearch, setInternalSearch] = useState(searchQuery ?? "");
  const [internalSort, setInternalSort] = useState<"asc" | "desc">("desc");
  const [internalRole, setInternalRole] = useState<UserRole | "all">("all");

  const debouncedSearch = useDebounce(internalSearch, 500);
  const mounted = useRef(false);
  useEffect(() => {
    if (!mounted.current) { mounted.current = true; return; }
    onSearchChange?.(debouncedSearch);
  }, [debouncedSearch]);

  return (
    <section className="space-y-3 lg:flex lg:items-center lg:justify-between lg:gap-3 lg:space-y-0 lg:rounded-2xl lg:border lg:border-neutral-100/60 lg:bg-white lg:p-1.5 lg:shadow-[0_2px_6px_rgba(0,0,0,0.04)]">
      <div className="rounded-2xl border border-neutral-100/60 bg-white p-1.5 shadow-[0_2px_6px_rgba(0,0,0,0.04)] lg:flex-1 lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none">
        <SearchInput value={internalSearch} onChange={setInternalSearch} />
      </div>

      <div className="flex flex-col gap-3.25 sm:flex-row sm:flex-wrap lg:shrink-0">
        <FilterSelect
          label="الدور"
          options={roleOptions}
          value={selectedRole ?? internalRole}
          onChange={(value) => {
            setInternalRole(value);
            onRoleChange?.(value === "all" ? undefined : (value as UserRole));
          }}
        />
        <FilterSelect
          label="الترتيب"
          options={sortOptions}
          value={selectedSort ?? internalSort}
          onChange={(value) => { setInternalSort(value); onSortChange?.(value); }}
        />
      </div>
    </section>
  );
}

export default UsersToolbar;
