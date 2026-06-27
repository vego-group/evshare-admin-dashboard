 "use client";

import { useState } from "react";

import useDebouncedChange from "@/hooks/use-debounced-change";
import type {
  OrderBy,
  VehicleActivationStatus,
  VehicleOperatingType,
  VehicleStatus,
} from "@/types";

import FilterSelect, { type FilterOption } from "./filter-select";
import SearchInput from "./search-input";

type Props = {
  searchQuery: string;
  selectedSort?: OrderBy;
  selectedStatus?: VehicleStatus;
  selectedActivationStatus?: VehicleActivationStatus;
  selectedOperatingType?: VehicleOperatingType;
  onSearchChange: (value: string) => void;
  onSortChange: (value: OrderBy) => void;
  onStatusChange: (value?: VehicleStatus) => void;
  onActivationStatusChange: (value?: VehicleActivationStatus) => void;
  onOperatingTypeChange: (value?: VehicleOperatingType) => void;
};

const sortOptions: FilterOption<OrderBy>[] = [
  { label: "الأحدث", value: "desc" },
  { label: "الأقدم", value: "asc" },
];

const statusOptions: FilterOption<VehicleStatus | "all">[] = [
  { label: "كل حالات المركبة", value: "all" },
  { label: "جديد", value: "new" },
  { label: "نشط", value: "active" },
  { label: "معطل", value: "disabled" },
  { label: "صيانة", value: "maintenance" },
  { label: "موقوف", value: "suspended" },
  { label: "قيد الاستخدام", value: "in_use" },
];

const activationStatusOptions: FilterOption<VehicleActivationStatus | "all">[] = [
  { label: "كل حالات التفعيل", value: "all" },
  { label: "مسودة", value: "draft" },
  { label: "بانتظار رفع العقد", value: "pending_contract_upload" },
  { label: "بانتظار الموافقة", value: "pending_admin_approval" },
  { label: "العقد مرفوض", value: "contract_rejected" },
  { label: "يعمل", value: "working" },
];

const operatingTypeOptions: FilterOption<VehicleOperatingType | "all">[] = [
  { label: "كل أنواع التشغيل", value: "all" },
  { label: "EvShare", value: "evshare" },
  { label: "شركة تشغيل", value: "operation_company" },
];

function VehicleToolbar({
  searchQuery,
  selectedSort = "desc",
  selectedStatus,
  selectedActivationStatus,
  selectedOperatingType,
  onSearchChange,
  onSortChange,
  onStatusChange,
  onActivationStatusChange,
  onOperatingTypeChange,
}: Props) {
  const [internalSearchQuery, setInternalSearchQuery] = useState(searchQuery);
  const [internalSort, setInternalSort] = useState<OrderBy>("desc");
  const [internalStatus, setInternalStatus] = useState<VehicleStatus | "all">("all");
  const [internalActivationStatus, setInternalActivationStatus] =
    useState<VehicleActivationStatus | "all">("all");
  const [internalOperatingType, setInternalOperatingType] =
    useState<VehicleOperatingType | "all">("all");

  useDebouncedChange(internalSearchQuery, onSearchChange, 500);

  return (
    <section className="space-y-3 lg:flex lg:items-center lg:justify-between lg:gap-3 lg:space-y-0 lg:rounded-2xl lg:border lg:border-neutral-100/60 lg:bg-white lg:p-1.5 lg:shadow-[0_2px_6px_rgba(0,0,0,0.04)]">
      <div className="rounded-2xl border border-neutral-100/60 bg-white p-1.5 shadow-[0_2px_6px_rgba(0,0,0,0.04)] lg:flex-1 lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none">
        <SearchInput value={internalSearchQuery} onChange={setInternalSearchQuery} />
      </div>

      <div className="flex flex-col gap-3.25 sm:flex-row sm:flex-wrap lg:shrink-0">
        <FilterSelect
          label="حالة المركبة"
          options={statusOptions}
          value={selectedStatus ?? internalStatus}
          onChange={(value) => {
            setInternalStatus(value);
            onStatusChange(value === "all" ? undefined : value);
          }}
        />
        <FilterSelect
          label="حالة التفعيل"
          options={activationStatusOptions}
          value={selectedActivationStatus ?? internalActivationStatus}
          onChange={(value) => {
            setInternalActivationStatus(value);
            onActivationStatusChange(value === "all" ? undefined : value);
          }}
        />
        <FilterSelect
          label="نوع التشغيل"
          options={operatingTypeOptions}
          value={selectedOperatingType ?? internalOperatingType}
          onChange={(value) => {
            setInternalOperatingType(value);
            onOperatingTypeChange(value === "all" ? undefined : value);
          }}
        />
        <FilterSelect
          label="الترتيب"
          options={sortOptions}
          value={selectedSort ?? internalSort}
          onChange={(value) => {
            setInternalSort(value);
            onSortChange(value);
          }}
        />
      </div>
    </section>
  );
}

export default VehicleToolbar;
