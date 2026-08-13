"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { PAGE_SIZE } from "@/constants";
import { useShippingCities } from "@/hooks/api";
import { deleteShippingCity } from "@/services/mutations";
import type { ShippingCitiesQueryParams, ShippingCityListItem } from "@/types";

import ShippingCitiesContentShimmer from "./content-shimmer";
import ShippingCitiesHeader from "./header";
import { ShippingCityDeleteConfirmModal, ShippingCityFormModal } from "./modals";
import ShippingCitiesMainContent from "./shipping-cities-main-content";

function ShippingCities() {
  const queryClient = useQueryClient();
  const [params, setParams] = useState<ShippingCitiesQueryParams>({
    page: 1,
    limit: PAGE_SIZE,
  });
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [cityPendingEdit, setCityPendingEdit] =
    useState<ShippingCityListItem | null>(null);
  const [cityPendingDelete, setCityPendingDelete] =
    useState<ShippingCityListItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { data, isLoading } = useShippingCities(params);

  const updateParams = (nextParams: Partial<ShippingCitiesQueryParams>) =>
    setParams((current) => ({ ...current, ...nextParams }));

  async function refreshShippingCityQueries() {
    await queryClient.invalidateQueries({ queryKey: ["shipping-cities"] });
  }

  async function handleDeleteShippingCity() {
    if (!cityPendingDelete || isDeleting) return;
    setIsDeleting(true);
    const result = await deleteShippingCity(cityPendingDelete.id);
    setIsDeleting(false);

    if (result?.ok) {
      toast.success(result.message || "تم حذف مدينة الشحن بنجاح");
      setCityPendingDelete(null);
      await refreshShippingCityQueries();
      return;
    }

    toast.error(result?.message || "فشل حذف مدينة الشحن");
  }

  return (
    <div className="flex w-full flex-col gap-6">
      {isLoading ? (
        <ShippingCitiesContentShimmer />
      ) : (
        <>
          <ShippingCitiesHeader
            onAddShippingCity={() => {
              setCityPendingEdit(null);
              setIsFormOpen(true);
            }}
          />
          <ShippingCitiesMainContent
            data={data}
            params={params}
            onParamsChange={updateParams}
            onEditShippingCity={(city) => {
              setCityPendingEdit(city);
              setIsFormOpen(true);
            }}
            onDeleteShippingCity={setCityPendingDelete}
          />
        </>
      )}

      <ShippingCityFormModal
        key={cityPendingEdit?.id ?? "add-shipping-city"}
        open={isFormOpen}
        shippingCity={cityPendingEdit}
        onClose={() => setIsFormOpen(false)}
        onSaved={refreshShippingCityQueries}
      />

      <ShippingCityDeleteConfirmModal
        open={Boolean(cityPendingDelete)}
        cityName={cityPendingDelete?.name}
        isDeleting={isDeleting}
        onClose={() => {
          if (!isDeleting) setCityPendingDelete(null);
        }}
        onConfirm={handleDeleteShippingCity}
      />
    </div>
  );
}

export default ShippingCities;
