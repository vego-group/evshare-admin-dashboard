"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { PAGE_SIZE } from "@/constants";
import { useVehicle, useVehicles } from "@/hooks/api";
import { deleteVehicleAPI, deleteVehicleZoneAPI } from "@/services/mutations";
import type { MobilityReceipt, VehicleListItem, VehiclesQueryParams } from "@/types";
import { ReviewReceiptModal, UploadTemplateModal } from "../mobility-receipts/modals";
import VehicleContentShimmer from "./content-shimmer";
import VehicleOperatingPricingHeader from "./header";
import VehicleMainContent from "./main-content";
import { vehicleTitle } from "./utils";
import {
  CommandPanelModal,
  CommissionModal,
  ContractReviewModal,
  VehicleDeleteConfirmModal,
  VehicleDetailsModal,
  VehicleEditModal,
  ZoneDeleteConfirmModal,
  ZoneFormModal,
} from "./modals";

type ModalKey =
  | "details"
  | "edit"
  | "review"
  | "receiptReview"
  | "template"
  | "commission"
  | "zone"
  | "zoneDelete"
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
  const shouldFetchVehicle =
    activeVehicle &&
    modal !== null &&
    modal !== "delete";
  const { data: vehicleData } = useVehicle(shouldFetchVehicle ? activeVehicle.id : null);
  const selectedVehicle = vehicleData?.data ?? activeVehicle;
  const selectedReceipt = selectedVehicle as MobilityReceipt | null;

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

  async function handleDeleteZone() {
    if (!activeVehicle || isSaving) return;
    setIsSaving(true);
    const result = await deleteVehicleZoneAPI(activeVehicle.id);
    setIsSaving(false);
    if (result?.ok) {
      toast.success(result.message || "تم حذف المنطقة");
      setModal(null);
      await refresh();
      return;
    }
    toast.error(result?.message || "فشل حذف المنطقة");
  }

  return (
    <div className="flex w-full flex-col gap-6">
      {isLoading ? <VehicleContentShimmer /> : (
        <>
          <VehicleOperatingPricingHeader onOpenMap={() => router.push("/vehicle-operating-pricing/map")} />
          <VehicleMainContent
            data={data}
            params={params}
            onParamsChange={(next) => setParams((current) => ({ ...current, ...next }))}
            onView={openModal("details")}
            onEdit={openModal("edit")}
            onReview={openModal("review")}
            onReviewReceipt={openModal("receiptReview")}
            onEditTemplate={openModal("template")}
            onCommission={openModal("commission")}
            onManageZone={openModal("zone")}
            onControlPanel={openModal("command")}
            onDelete={openModal("delete")}
          />
        </>
      )}
      <VehicleDetailsModal open={modal === "details"} vehicle={selectedVehicle} onClose={() => setModal(null)} />
      <VehicleEditModal key={`edit-${selectedVehicle?.id ?? "none"}`} open={modal === "edit"} vehicle={selectedVehicle} isSaving={isSaving} setIsSaving={setIsSaving} onSaved={refresh} onClose={() => setModal(null)} />
      <ContractReviewModal key={`review-${selectedVehicle?.id ?? "none"}`} open={modal === "review"} vehicle={selectedVehicle} isSaving={isSaving} setIsSaving={setIsSaving} onSaved={refresh} onClose={() => setModal(null)} />
      <ReviewReceiptModal open={modal === "receiptReview"} receipt={selectedReceipt} onClose={() => setModal(null)} onSaved={refresh} />
      <UploadTemplateModal open={modal === "template"} receipt={selectedReceipt} onClose={() => setModal(null)} onSaved={refresh} />
      <CommissionModal key={`commission-${modal === "commission" ? "open" : "closed"}-${selectedVehicle?.operation_company?.id ?? selectedVehicle?.id ?? "none"}`} open={modal === "commission"} vehicle={selectedVehicle} isSaving={isSaving} setIsSaving={setIsSaving} onSaved={refresh} onClose={() => setModal(null)} />
      <ZoneFormModal key={`zone-${selectedVehicle?.id ?? "none"}`} open={modal === "zone"} vehicle={selectedVehicle} isSaving={isSaving} setIsSaving={setIsSaving} onSaved={refresh} onClose={() => setModal(null)} onRequestDelete={() => setModal("zoneDelete")} />
      <CommandPanelModal open={modal === "command"} vehicle={selectedVehicle} onClose={() => setModal(null)} />
      <ZoneDeleteConfirmModal open={modal === "zoneDelete"} isDeleting={isSaving} onClose={() => setModal(null)} onConfirm={handleDeleteZone} />
      <VehicleDeleteConfirmModal open={modal === "delete"} vehicleName={activeVehicle ? vehicleTitle(activeVehicle) : undefined} isDeleting={isSaving} onClose={() => setModal(null)} onConfirm={handleDelete} />
    </div>
  );
}

export default VehicleOperatingPricing;
