"use client";

import { Cpu } from "lucide-react";
import { useState } from "react";
import useDebouncedChange from "@/hooks/use-debounced-change";
import type {
  OperationCompany,
  OrderBy,
  VehicleLockConnectivity,
  VehicleStatus,
  VehicleType,
} from "@/types";
import FilterSelect, { type FilterOption } from "./filter-select";
import SearchInput from "./search-input";

type Props = {
  searchQuery: string;
  deviceQuery: string;
  selectedSort?: OrderBy;
  selectedStatus?: VehicleStatus;
  selectedOperationCompany?: string;
  selectedVehicleType?: VehicleType;
  selectedConnectivity?: VehicleLockConnectivity;
  companies: OperationCompany[];
  onSearchChange: (value: string) => void;
  onDeviceQueryChange: (value: string) => void;
  onSortChange: (value: OrderBy) => void;
  onStatusChange: (value?: VehicleStatus) => void;
  onOperationCompanyChange: (value?: string) => void;
  onVehicleTypeChange: (value?: VehicleType) => void;
  onConnectivityChange: (value?: VehicleLockConnectivity) => void;
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
const vehicleTypeOptions: FilterOption<VehicleType | "all">[] = [
  { label: "كل أنواع المركبات", value: "all" },
  { label: "دراجة", value: "bike" },
  { label: "سكوتر", value: "scooter" },
  { label: "سيارة", value: "car" },
];
const connectivityOptions: FilterOption<VehicleLockConnectivity | "all">[] = [
  { label: "كل حالات اتصال IoT", value: "all" },
  { label: "متصل", value: "online" },
  { label: "غير متصل", value: "offline" },
  { label: "حالة الاتصال غير معروفة", value: "unknown" },
];

function VehicleToolbar({
  searchQuery,
  deviceQuery,
  selectedSort = "desc",
  selectedStatus,
  selectedOperationCompany,
  selectedVehicleType,
  selectedConnectivity,
  companies,
  onSearchChange,
  onDeviceQueryChange,
  onSortChange,
  onStatusChange,
  onOperationCompanyChange,
  onVehicleTypeChange,
  onConnectivityChange,
}: Props) {
  const [internalSearchQuery, setInternalSearchQuery] = useState(searchQuery);
  const [internalDeviceQuery, setInternalDeviceQuery] = useState(deviceQuery);
  useDebouncedChange(internalSearchQuery, onSearchChange, 500);
  useDebouncedChange(internalDeviceQuery, onDeviceQueryChange, 500);
  const companyOptions: FilterOption<string>[] = [
    { label: "كل شركات التشغيل", value: "all" },
    ...companies.map((company) => ({ label: company.name, value: company.id })),
  ];

  return (
    <section className="space-y-3 rounded-2xl border border-neutral-100/60 bg-white p-2 shadow-[0_2px_6px_rgba(0,0,0,0.04)]">
      <div className="flex items-center justify-between gap-3 px-2 pt-1">
        <div>
          <h2 className="font-semibold text-secondary">البحث والتصفية</h2>
          <p className="mt-0.5 text-xs text-gray">
            ابحث عن المركبات وأجهزة IoT والأقفال
          </p>
        </div>
        <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-medium text-teal-700">
          فلاتر IoT
        </span>
      </div>
      <div className="grid gap-3 lg:grid-cols-2">
        <SearchInput
          value={internalSearchQuery}
          onChange={setInternalSearchQuery}
        />
        <label className="relative flex min-h-12 flex-1 items-center rounded-[14px] border border-teal-200 bg-teal-50/50 px-3 pr-11 sm:min-h-14 sm:px-5 sm:pr-14">
          <Cpu className="pointer-events-none absolute right-3 top-1/2 size-5 shrink-0 -translate-y-1/2 text-teal-600 sm:right-5 sm:size-5.5" />
          <input
            type="text"
            inputMode="search"
            aria-label="البحث بمعرّف جهاز المركبة أو القفل"
            placeholder="ابحث بمعرّف جهاز المركبة أو القفل"
            value={internalDeviceQuery}
            onChange={(event) => setInternalDeviceQuery(event.target.value)}
            className="h-full w-full bg-transparent text-right text-sm font-normal text-secondary outline-none placeholder:text-[#99a1af] sm:text-base"
          />
        </label>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <FilterSelect
          label="حالة اتصال جهاز IoT أو القفل"
          options={connectivityOptions}
          value={selectedConnectivity ?? "all"}
          onChange={(value) =>
            onConnectivityChange(value === "all" ? undefined : value)
          }
          className="sm:w-full"
        />
        <FilterSelect
          label="نوع المركبة"
          options={vehicleTypeOptions}
          value={selectedVehicleType ?? "all"}
          onChange={(value) =>
            onVehicleTypeChange(value === "all" ? undefined : value)
          }
          className="sm:w-full"
        />
        <FilterSelect
          label="حالة المركبة"
          options={statusOptions}
          value={selectedStatus ?? "all"}
          onChange={(value) =>
            onStatusChange(value === "all" ? undefined : value)
          }
          className="sm:w-full"
        />
        <FilterSelect
          label="شركة التشغيل"
          options={companyOptions}
          value={selectedOperationCompany ?? "all"}
          onChange={(value) =>
            onOperationCompanyChange(value === "all" ? undefined : value)
          }
          className="sm:w-full"
        />
        <FilterSelect
          label="الترتيب"
          options={sortOptions}
          value={selectedSort}
          onChange={onSortChange}
          className="sm:w-full"
        />
      </div>
    </section>
  );
}

export default VehicleToolbar;
