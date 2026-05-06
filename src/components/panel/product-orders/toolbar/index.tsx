"use client";

import { useState } from "react";

import ProductOrdersToolbarSearch from "./product-orders-toolbar-search";
import ProductOrdersToolbarSelect from "./product-orders-toolbar-select";

type ProductOrderTypeFilter = "الكل";
type ProductOrderStatusFilter =
  | "الحاله"
  | "الكل"
  | "تم القبول"
  | "قيد الانتظار"
  | "مرفوضة";
type ProductOrderSortFilter = "الاحدث" | "الاقدم";

type ProductOrdersToolbarProps = {
  searchQuery?: string;
  selectedType?: ProductOrderTypeFilter;
  selectedStatus?: ProductOrderStatusFilter;
  selectedSort?: ProductOrderSortFilter;
  onSearchChange?: (value: string) => void;
  onTypeChange?: (value: ProductOrderTypeFilter) => void;
  onStatusChange?: (value: ProductOrderStatusFilter) => void;
  onSortChange?: (value: ProductOrderSortFilter) => void;
};

const typeOptions: ProductOrderTypeFilter[] = ["الكل"];
const statusOptions: ProductOrderStatusFilter[] = [
  "الحاله",
  "الكل",
  "تم القبول",
  "قيد الانتظار",
  "مرفوضة",
];
const sortOptions: ProductOrderSortFilter[] = ["الاحدث", "الاقدم"];

function ProductOrdersToolbar({
  searchQuery,
  selectedType,
  selectedStatus,
  selectedSort,
  onSearchChange,
  onTypeChange,
  onStatusChange,
  onSortChange,
}: ProductOrdersToolbarProps) {
  const [internalSearchQuery, setInternalSearchQuery] = useState("");
  const [internalType, setInternalType] = useState<ProductOrderTypeFilter>("الكل");
  const [internalStatus, setInternalStatus] =
    useState<ProductOrderStatusFilter>("الحاله");
  const [internalSort, setInternalSort] =
    useState<ProductOrderSortFilter>("الاحدث");

  const searchValue = searchQuery ?? internalSearchQuery;
  const typeValue = selectedType ?? internalType;
  const statusValue = selectedStatus ?? internalStatus;
  const sortValue = selectedSort ?? internalSort;

  const handleSearchChange = (value: string) => {
    setInternalSearchQuery(value);
    onSearchChange?.(value);
  };

  const handleTypeChange = (value: ProductOrderTypeFilter) => {
    setInternalType(value);
    onTypeChange?.(value);
  };

  const handleStatusChange = (value: ProductOrderStatusFilter) => {
    setInternalStatus(value);
    onStatusChange?.(value);
  };

  const handleSortChange = (value: ProductOrderSortFilter) => {
    setInternalSort(value);
    onSortChange?.(value);
  };

  return (
    <section className="space-y-3 lg:flex lg:items-center lg:justify-between lg:gap-3 lg:space-y-0 lg:rounded-2xl lg:border lg:border-neutral-100/60 lg:bg-white lg:p-1.5 lg:shadow-[0_2px_6px_rgba(0,0,0,0.04)]">
      <div className="rounded-2xl border border-neutral-100/60 bg-white p-1.5 shadow-[0_2px_6px_rgba(0,0,0,0.04)] lg:flex-1 lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none">
        <ProductOrdersToolbarSearch
          value={searchValue}
          onChange={handleSearchChange}
        />
      </div>

      <div className="flex flex-col gap-[13px] sm:flex-row sm:flex-wrap lg:shrink-0">
        <ProductOrdersToolbarSelect
          label="النوع"
          options={typeOptions}
          value={typeValue}
          onChange={handleTypeChange}
        />
        <ProductOrdersToolbarSelect
          label="الحالة"
          options={statusOptions}
          value={statusValue}
          onChange={handleStatusChange}
        />
        <ProductOrdersToolbarSelect
          label="الترتيب"
          options={sortOptions}
          value={sortValue}
          onChange={handleSortChange}
        />
      </div>
    </section>
  );
}

export default ProductOrdersToolbar;
