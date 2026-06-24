"use client";

import { Search } from "lucide-react";

type Props = {
  value: string;
  onChange: (value: string) => void;
};

function FeatureFlagsToolbar({ value, onChange }: Props) {
  return (
    <label className="relative block rounded-2xl bg-white">
      <Search className="absolute right-4 top-1/2 size-5 -translate-y-1/2 text-gray" />
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="ابحث بالمفتاح أو الاسم..."
        className="h-14 w-full rounded-2xl bg-white px-12 text-right outline-none"
      />
    </label>
  );
}

export default FeatureFlagsToolbar;
