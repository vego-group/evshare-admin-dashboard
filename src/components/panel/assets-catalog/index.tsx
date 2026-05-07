"use client";

import { useState } from "react";

import { assetsCatalogItems } from "@/data";
import type {
  AssetItem,
  AssetStatus,
  AssetType,
  AssetsCatalogViewMode,
} from "@/types";

import AssetsCatalogHeader from "./header";
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
import AssetsCatalogToolbar, { type AssetFilterValue } from "./toolbar";

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
      <AssetsCatalogHeader
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onAddAsset={() => setIsAddModalOpen(true)}
      />

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
