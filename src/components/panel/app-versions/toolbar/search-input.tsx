"use client";

import { Search } from "lucide-react";

type SearchInputProps = {
  value: string;
  onChange: (value: string) => void;
};

function SearchInput({ value, onChange }: SearchInputProps) {
  return (
    <label className="relative block">
      <span className="sr-only">بحث في إصدارات التطبيقات</span>
      <Search className="absolute right-4 top-1/2 size-5 -translate-y-1/2 text-gray" />
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="ابحث برقم الإصدار..."
        className="h-12 w-full rounded-2xl border-0 bg-white px-12 text-right text-sm font-medium text-dark-gray outline-none placeholder:text-gray lg:bg-transparent"
      />
    </label>
  );
}

export default SearchInput;
