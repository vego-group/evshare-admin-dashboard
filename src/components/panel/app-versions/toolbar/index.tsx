"use client";

import type { AppVersionPlatform, AppVersionStatus } from "@/types";

import FilterSelect, { type FilterOption } from "./filter-select";

type AppVersionsToolbarProps = {
  selectedPlatform?: AppVersionPlatform;
  selectedStatus?: AppVersionStatus;
  onPlatformChange?: (value?: AppVersionPlatform) => void;
  onStatusChange?: (value?: AppVersionStatus) => void;
};

const platformOptions: FilterOption<AppVersionPlatform | "all">[] = [
  { label: "كل المنصات", value: "all" },
  { label: "Android", value: "android" },
  { label: "iOS", value: "ios" },
];

const statusOptions: FilterOption<AppVersionStatus | "all">[] = [
  { label: "كل الحالات", value: "all" },
  { label: "مسودة", value: "draft" },
  { label: "نشط", value: "active" },
  { label: "مؤرشف", value: "archived" },
];

function AppVersionsToolbar({
  selectedPlatform,
  selectedStatus,
  onPlatformChange,
  onStatusChange,
}: AppVersionsToolbarProps) {
  return (
    <section className="flex flex-col gap-3 rounded-2xl border border-neutral-100/60 bg-white p-1.5 shadow-[0_2px_6px_rgba(0,0,0,0.04)] sm:flex-row sm:flex-wrap">
      <FilterSelect
        label="المنصة"
        options={platformOptions}
        value={selectedPlatform ?? "all"}
        onChange={(value) =>
          onPlatformChange?.(value === "all" ? undefined : value)
        }
      />
      <FilterSelect
        label="الحالة"
        options={statusOptions}
        value={selectedStatus ?? "all"}
        onChange={(value) =>
          onStatusChange?.(value === "all" ? undefined : value)
        }
      />
    </section>
  );
}

export default AppVersionsToolbar;
