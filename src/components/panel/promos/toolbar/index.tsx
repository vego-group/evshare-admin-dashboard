"use client";

import { useState } from "react";

import useDebouncedChange from "@/hooks/use-debounced-change";

import SearchInput from "./search-input";

type PromosToolbarProps = {
  searchQuery?: string;
  onSearchChange?: (value: string) => void;
};

function PromosToolbar({ searchQuery, onSearchChange }: PromosToolbarProps) {
  const [internalSearchQuery, setInternalSearchQuery] = useState(searchQuery ?? "");

  useDebouncedChange(internalSearchQuery, onSearchChange, 500);

  return (
    <section className="rounded-2xl border border-neutral-100/60 bg-white p-1.5 shadow-[0_2px_6px_rgba(0,0,0,0.04)]">
      <SearchInput value={internalSearchQuery} onChange={setInternalSearchQuery} />
    </section>
  );
}

export default PromosToolbar;
