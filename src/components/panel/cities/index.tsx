"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { PAGE_SIZE } from "@/constants";
import { useCities } from "@/hooks/api";
import { deleteCity } from "@/services/mutations";
import type { CityListItem, QueryParams } from "@/types";

import CitiesMainContent from "./cities-main-content";
import CitiesContentShimmer from "./content-shimmer";
import CitiesHeader, { type CitiesViewMode } from "./header";
import { CityAddModal, CityDeleteConfirmModal, CityEditModal } from "./modals";

function Cities() {
  const queryClient = useQueryClient();
  const [viewMode, setViewMode] = useState<CitiesViewMode>("table");
  const [params, setParams] = useState<QueryParams>({ page: 1, limit: PAGE_SIZE });
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [cityPendingEdit, setCityPendingEdit] = useState<CityListItem | null>(null);
  const [cityPendingDelete, setCityPendingDelete] = useState<CityListItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { data, isLoading } = useCities(params);

  const updateParams = (nextParams: Partial<QueryParams>) =>
    setParams((current) => ({ ...current, ...nextParams }));

  async function refreshCityQueries() {
    await queryClient.invalidateQueries({ queryKey: ["cities"] });
  }

  async function handleDeleteCity() {
    if (!cityPendingDelete || isDeleting) return;
    const current = cityPendingDelete;
    setIsDeleting(true);
    const result = await deleteCity(current.id);
    setIsDeleting(false);
    if (result?.ok) {
      toast.success(result.message || "تم حذف المدينة بنجاح");
      setCityPendingDelete(null);
      await refreshCityQueries();
      return;
    }
    toast.error(result?.message || "فشل حذف المدينة");
  }

  return (
    <div className="flex w-full flex-col gap-6">
      {isLoading ? (
        <CitiesContentShimmer />
      ) : (
        <>
          <CitiesHeader
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            onAddCity={() => setIsAddModalOpen(true)}
          />
          <CitiesMainContent
            data={data}
            params={params}
            viewMode={viewMode}
            onParamsChange={updateParams}
            onEditCity={setCityPendingEdit}
            onDeleteCity={setCityPendingDelete}
          />
        </>
      )}

      <CityAddModal
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSaved={refreshCityQueries}
      />

      <CityEditModal
        key={cityPendingEdit?.id ?? "edit-city"}
        open={Boolean(cityPendingEdit)}
        city={cityPendingEdit ?? undefined}
        onClose={() => setCityPendingEdit(null)}
        onSaved={refreshCityQueries}
      />

      <CityDeleteConfirmModal
        open={Boolean(cityPendingDelete)}
        cityName={cityPendingDelete?.name}
        isDeleting={isDeleting}
        onClose={() => { if (!isDeleting) setCityPendingDelete(null); }}
        onConfirm={handleDeleteCity}
      />
    </div>
  );
}

export default Cities;
