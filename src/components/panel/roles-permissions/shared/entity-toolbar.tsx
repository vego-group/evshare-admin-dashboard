"use client";

import { useState } from "react";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import useDebouncedChange from "@/hooks/use-debounced-change";
import Dropdown from "./dropdown";

type Props = {
  title: string;
  description: string;
  addLabel: string;
  search: string;
  onSearch: (value: string) => void;
  orderBy?: "asc" | "desc";
  onSort?: (value: "asc" | "desc") => void;
  onAdd: () => void;
};

export default function EntityToolbar(props: Props) {
  const [search, setSearch] = useState(props.search);
  useDebouncedChange(search, props.onSearch, 500);
  return (
    <header className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-secondary">{props.title}</h2>
          <p className="mt-1 text-sm font-medium text-gray">{props.description}</p>
        </div>
        <Button onClick={props.onAdd} type="button" className="h-12 rounded-2xl px-6 text-base font-medium text-secondary shadow-[0_4px_12px_rgba(255,213,79,0.25)]">
          <Plus className="size-5" /> {props.addLabel}
        </Button>
      </div>
      <div className="flex flex-col gap-3 rounded-2xl border border-neutral-100/60 bg-white p-1.5 shadow-[0_2px_6px_rgba(0,0,0,0.04)] sm:flex-row">
        <label className="relative flex min-h-14 flex-1 items-center rounded-[14px] px-5 pr-14">
          <Search className="pointer-events-none absolute right-5 size-5 text-gray" />
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={`ابحث في ${props.title}...`}
            className="h-full w-full bg-transparent text-sm text-secondary outline-none placeholder:text-[#99a1af] sm:text-base"
          />
        </label>
        {props.onSort && <Dropdown className="sm:w-48" value={props.orderBy ?? "desc"} placeholder="الترتيب" options={[
          { label: "الأحدث", value: "desc" },
          { label: "الأقدم", value: "asc" },
        ]} onChange={(value) => props.onSort?.(value as "asc" | "desc")} />}
      </div>
    </header>
  );
}
