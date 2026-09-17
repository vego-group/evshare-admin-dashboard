"use client";

import { useState } from "react";

import useDebouncedChange from "@/hooks/use-debounced-change";

import SearchInput from "./search-input";

type OperatingCompaniesToolbarProps = {
  searchQuery?: string;
  onSearchChange?: (value: string) => void;
  status?: "active" | "inactive";
  onStatusChange?: (value?: "active" | "inactive") => void;
};

function OperatingCompaniesToolbar({
  searchQuery,
  onSearchChange,
  status,
  onStatusChange,
}: OperatingCompaniesToolbarProps) {
  const [internalSearchQuery, setInternalSearchQuery] = useState(
    searchQuery ?? "",
  );

  useDebouncedChange(internalSearchQuery, onSearchChange, 500);

  return (
    <section className="rounded-2xl border border-neutral-100/60 bg-white p-1.5 shadow-[0_2px_6px_rgba(0,0,0,0.04)]">
      <div className="flex flex-wrap gap-2"><div className="min-w-60 flex-1"><SearchInput value={internalSearchQuery} onChange={setInternalSearchQuery} /></div><select aria-label="تصفية حسب حالة الشركة" className="rounded-xl border border-neutral-200 px-3 text-sm" value={status ?? "all"} onChange={(event) => onStatusChange?.(event.target.value === "all" ? undefined : event.target.value as "active" | "inactive")}><option value="all">كل الحالات</option><option value="active">نشطة</option><option value="inactive">غير نشطة</option></select></div>
    </section>
  );
}

export default OperatingCompaniesToolbar;
