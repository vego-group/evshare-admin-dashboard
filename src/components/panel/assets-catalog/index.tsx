"use client";

import { useState } from "react";
import { LayoutGrid, List, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { assetsCatalogItems } from "@/data";
import type {
  AssetItem,
  AssetStatus,
  AssetType,
  AssetsCatalogViewMode,
} from "@/types";
import AssetsCatalogToolbar, {
  type AssetFilterValue,
} from "./toolbar";
import {
  AssetsCatalogAddModal,
  AssetsCatalogAddSuccessModal,
  AssetsCatalogDeleteConfirmModal,
  AssetsCatalogDetailsModal,
  AssetsCatalogEditModal,
  AssetsCatalogEditSuccessModal,
} from "./modals";
import AssetsCatalogResults from "./results";
import AssetsCatalogStats from "./stats";

function AssetsCatalog() {
  const [viewMode, setViewMode] = useState<AssetsCatalogViewMode>("table");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("الكل");
  const [selectedStatus, setSelectedStatus] =
    useState<AssetFilterValue<AssetStatus>>("الكل");
  const [selectedType, setSelectedType] =
    useState<AssetFilterValue<AssetType>>("الكل");

  const [assetPendingDelete, setAssetPendingDelete] =
    useState<AssetItem | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAddSuccessOpen, setIsAddSuccessOpen] = useState(false);
  const [assetPendingView, setAssetPendingView] = useState<AssetItem | null>(
    null,
  );
  const [assetPendingEdit, setAssetPendingEdit] = useState<AssetItem | null>(
    null,
  );
  const [isEditSuccessOpen, setIsEditSuccessOpen] = useState(false);

  const cities = Array.from(
    new Set(assetsCatalogItems.map((asset) => asset.city)),
  );
  const normalizedQuery = searchQuery.trim().toLowerCase();
  const filteredAssets = assetsCatalogItems.filter((asset) => {
    const matchesSearch =
      !normalizedQuery ||
      [
        asset.name,
        asset.id,
        asset.location,
        asset.city,
        asset.type,
        asset.status,
      ]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery);
    const matchesType = selectedType === "الكل" || asset.type === selectedType;
    const matchesStatus =
      selectedStatus === "الكل" || asset.status === selectedStatus;
    const matchesCity = selectedCity === "الكل" || asset.city === selectedCity;

    return matchesSearch && matchesType && matchesStatus && matchesCity;
  });

  return (
    <div className="flex w-full flex-col gap-6">
      <section className="flex w-full flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2 text-right">
          <h1 className="text-[30px] font-medium leading-[38px] text-secondary">
            كتالوج الأصول
          </h1>
          <p className="text-base font-medium leading-6 text-gray">
            إدارة ومتابعة جميع الأصول الكهربائية
          </p>
        </div>
        <div className="flex items-center gap-3 self-start sm:self-auto">
          <div className="flex h-[53px] items-center gap-1 rounded-2xl border border-neutral-100/80 bg-white p-1.5">
            <Button
              type="button"
              size="icon"
              variant="ghost"
              aria-label="عرض كروت"
              aria-pressed={viewMode === "card"}
              onClick={() => setViewMode("card")}
              className={cn(
                "size-10 rounded-[14px] text-gray hover:bg-neutral-50 hover:text-secondary",
                viewMode === "card" &&
                  "bg-primary text-secondary shadow-sm hover:bg-primary/90",
              )}
            >
              <LayoutGrid className="size-5" />
            </Button>

            <Button
              type="button"
              size="icon"
              variant="ghost"
              aria-label="عرض الجدول"
              aria-pressed={viewMode === "table"}
              onClick={() => setViewMode("table")}
              className={cn(
                "size-10 rounded-[14px] text-gray hover:bg-neutral-50 hover:text-secondary",
                viewMode === "table" &&
                  "bg-primary text-secondary shadow-sm hover:bg-primary/90",
              )}
            >
              <List className="size-5" />
            </Button>
          </div>
          <Button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="h-12 rounded-2xl bg-primary px-6 text-base font-medium text-secondary shadow-[0_4px_12px_rgba(255,213,79,0.25)] hover:bg-primary/90"
          >
            <Plus className="size-5" />
            إضافة أصل
          </Button>
        </div>
      </section>

      <AssetsCatalogStats />
      <AssetsCatalogToolbar
        searchQuery={searchQuery}
        cities={cities}
        selectedCity={selectedCity}
        selectedStatus={selectedStatus}
        selectedType={selectedType}
        onSearchChange={setSearchQuery}
        onCityChange={setSelectedCity}
        onStatusChange={setSelectedStatus}
        onTypeChange={setSelectedType}
      />
      <AssetsCatalogResults
        assets={filteredAssets}
        viewMode={viewMode}
        onViewAsset={setAssetPendingView}
        onEditAsset={setAssetPendingEdit}
        onDeleteAsset={setAssetPendingDelete}
      />
      <AssetsCatalogDetailsModal
        asset={assetPendingView}
        open={Boolean(assetPendingView)}
        onClose={() => setAssetPendingView(null)}
      />
      <AssetsCatalogEditModal
        key={assetPendingEdit?.id ?? "edit-modal"}
        asset={assetPendingEdit}
        open={Boolean(assetPendingEdit)}
        onClose={() => setAssetPendingEdit(null)}
        onSave={() => {
          setAssetPendingEdit(null);
          setIsEditSuccessOpen(true);
        }}
      />
      <AssetsCatalogAddModal
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={() => {
          setIsAddModalOpen(false);
          setIsAddSuccessOpen(true);
        }}
      />
      <AssetsCatalogAddSuccessModal
        open={isAddSuccessOpen}
        onClose={() => setIsAddSuccessOpen(false)}
      />
      <AssetsCatalogEditSuccessModal
        open={isEditSuccessOpen}
        onClose={() => setIsEditSuccessOpen(false)}
      />
      <AssetsCatalogDeleteConfirmModal
        open={Boolean(assetPendingDelete)}
        onClose={() => setAssetPendingDelete(null)}
        onConfirm={() => setAssetPendingDelete(null)}
      />
    </div>
  );
}

export default AssetsCatalog;
