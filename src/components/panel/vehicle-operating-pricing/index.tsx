"use client";

import { useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { PAGE_SIZE } from "@/constants";
import { useAllVehicles, useVehicle, useVehicles } from "@/hooks/api";
import { deleteVehicleAPI } from "@/services/mutations";
import type { OperationCompany, VehicleListItem, VehiclesQueryParams } from "@/types";
import VehicleContentShimmer from "./content-shimmer";
import VehicleOperatingPricingHeader from "./header";
import VehicleMainContent from "./main-content";
import { vehicleTitle } from "./utils";
import {
  CommandPanelModal,
  CommissionModal,
  VehicleDeleteConfirmModal,
  VehicleDetailsModal,
  VehicleEditModal,
  ZonesModal,
} from "./modals";

type ModalKey =
  | "details"
  | "edit"
  | "commission"
  | "zones"
  | "command"
  | "delete";

function VehicleOperatingPricing() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [params, setParams] = useState<VehiclesQueryParams>({ page: 1, limit: PAGE_SIZE });
  const [activeVehicle, setActiveVehicle] = useState<VehicleListItem | null>(null);
  const [modal, setModal] = useState<ModalKey | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const { data, isLoading } = useVehicles(params);
  const { data: allVehicles } = useAllVehicles();
  const companies = useMemo(() => {
    const byId = new Map<string, OperationCompany>();
    for (const vehicle of allVehicles ?? []) {
      if (vehicle.operation_company) byId.set(vehicle.operation_company.id, vehicle.operation_company);
    }
    return Array.from(byId.values());
  }, [allVehicles]);
  const shouldFetchVehicle =
    activeVehicle &&
    modal !== null &&
    modal !== "delete";
  const { data: vehicleData } = useVehicle(shouldFetchVehicle ? activeVehicle.id : null);
  const selectedVehicle = vehicleData?.data ?? activeVehicle;

  const openModal = (nextModal: NonNullable<typeof modal>) => (vehicle: VehicleListItem) => {
    setActiveVehicle(vehicle);
    setModal(nextModal);
  };

  async function refresh() {
    await queryClient.invalidateQueries({ queryKey: ["vehicles"] });
    await queryClient.invalidateQueries({ queryKey: ["vehicles-all"] });
    if (activeVehicle) await queryClient.invalidateQueries({ queryKey: ["vehicle", activeVehicle.id] });
  }

  async function handleDelete() {
    if (!activeVehicle || isSaving) return;
    setIsSaving(true);
    const result = await deleteVehicleAPI(activeVehicle.id);
    setIsSaving(false);
    if (result?.ok) {
      toast.success(result.message || "تم حذف المركبة");
      setModal(null);
      await refresh();
      return;
    }
    toast.error(result?.message || "فشل حذف المركبة");
  }

  return (
    <div className="flex w-full flex-col gap-6">
      {isLoading ? <VehicleContentShimmer /> : (
        <>
          <VehicleOperatingPricingHeader onOpenMap={() => router.push("/vehicle-operating-pricing/map")} />
          <VehicleMainContent
            data={data}
            companies={companies}
            params={params}
            onParamsChange={(next) => setParams((current) => ({ ...current, ...next }))}
            onView={openModal("details")}
            onEdit={openModal("edit")}
            onCommission={openModal("commission")}
            onManageZone={openModal("zones")}
            onControlPanel={openModal("command")}
            onDelete={openModal("delete")}
          />
        </>
      )}
      <VehicleDetailsModal open={modal === "details"} vehicle={selectedVehicle} onClose={() => setModal(null)} />
      <VehicleEditModal key={`edit-${selectedVehicle?.id ?? "none"}`} open={modal === "edit"} vehicle={selectedVehicle} isSaving={isSaving} setIsSaving={setIsSaving} onSaved={refresh} onClose={() => setModal(null)} />
      <CommissionModal key={`commission-${modal === "commission" ? "open" : "closed"}-${selectedVehicle?.operation_company?.id ?? selectedVehicle?.id ?? "none"}`} open={modal === "commission"} vehicle={selectedVehicle} isSaving={isSaving} setIsSaving={setIsSaving} onSaved={refresh} onClose={() => setModal(null)} />
      <ZonesModal key={`zones-${selectedVehicle?.id ?? "none"}`} open={modal === "zones"} vehicle={selectedVehicle} isSaving={isSaving} setIsSaving={setIsSaving} onSaved={refresh} onClose={() => setModal(null)} />
      <CommandPanelModal open={modal === "command"} vehicle={selectedVehicle} onClose={() => setModal(null)} />
      <VehicleDeleteConfirmModal open={modal === "delete"} vehicleName={activeVehicle ? vehicleTitle(activeVehicle) : undefined} isDeleting={isSaving} onClose={() => setModal(null)} onConfirm={handleDelete} />
    </div>
  );
}

export default VehicleOperatingPricing;
