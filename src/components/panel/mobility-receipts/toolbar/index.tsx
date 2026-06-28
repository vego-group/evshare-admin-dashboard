"use client";

import { useState } from "react";

import useDebouncedChange from "@/hooks/use-debounced-change";
import type {
  OrderBy,
  VehicleActivationStatus,
  VehicleOperatingType,
} from "@/types";
import FilterSelect, {
  type FilterOption,
} from "../../vehicle-operating-pricing/toolbar/filter-select";
import SearchInput from "./search-input";

type Props = {
  searchQuery: string;
  selectedSort?: OrderBy;
  selectedActivationStatus?: VehicleActivationStatus;
  selectedOperatingType?: VehicleOperatingType;
  onSearchChange: (value: string) => void;
  onSortChange: (value: OrderBy) => void;
  onActivationStatusChange: (value?: VehicleActivationStatus) => void;
  onOperatingTypeChange: (value?: VehicleOperatingType) => void;
};

const sortOptions: FilterOption<OrderBy>[] = [
  { label: "الأحدث", value: "desc" },
  { label: "الأقدم", value: "asc" },
];

const contractStatusOptions: FilterOption<VehicleActivationStatus | "all">[] = [
  { label: "كل حالات السند", value: "all" },
  { label: "مسودة", value: "draft" },
  { label: "بانتظار رفع العقد", value: "pending_contract_upload" },
  { label: "بانتظار الموافقة", value: "pending_admin_approval" },
  { label: "العقد مرفوض", value: "contract_rejected" },
  { label: "معتمد", value: "working" },
];

const operatingTypeOptions: FilterOption<VehicleOperatingType | "all">[] = [
  { label: "كل أنواع التشغيل", value: "all" },
  { label: "EvShare", value: "evshare" },
  { label: "شركة تشغيل", value: "operation_company" },
];

function MobilityReceiptsToolbar(props: Props) {
  const [search, setSearch] = useState(props.searchQuery);
  const [sort, setSort] = useState<OrderBy>("desc");
  const [status, setStatus] = useState<VehicleActivationStatus | "all">("all");
  const [operatingType, setOperatingType] =
    useState<VehicleOperatingType | "all">("all");

  useDebouncedChange(search, props.onSearchChange, 500);

  return (
    <section className="space-y-3 lg:flex lg:items-center lg:justify-between lg:gap-3 lg:rounded-2xl lg:border lg:border-neutral-100/60 lg:bg-white lg:p-1.5 lg:shadow-[0_2px_6px_rgba(0,0,0,0.04)]">
      <div className="rounded-2xl border border-neutral-100/60 bg-white p-1.5 shadow-[0_2px_6px_rgba(0,0,0,0.04)] lg:flex-1 lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none">
        <SearchInput value={search} onChange={setSearch} />
      </div>
      <div className="flex flex-col gap-3.25 sm:flex-row sm:flex-wrap lg:shrink-0">
        <FilterSelect
          label="حالة السند"
          options={contractStatusOptions}
          value={props.selectedActivationStatus ?? status}
          onChange={(value) => {
            setStatus(value);
            props.onActivationStatusChange(value === "all" ? undefined : value);
          }}
        />
        <FilterSelect
          label="نوع التشغيل"
          options={operatingTypeOptions}
          value={props.selectedOperatingType ?? operatingType}
          onChange={(value) => {
            setOperatingType(value);
            props.onOperatingTypeChange(value === "all" ? undefined : value);
          }}
        />
        <FilterSelect
          label="الترتيب"
          options={sortOptions}
          value={props.selectedSort ?? sort}
          onChange={(value) => {
            setSort(value);
            props.onSortChange(value);
          }}
        />
      </div>
    </section>
  );
}

export default MobilityReceiptsToolbar;
