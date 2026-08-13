"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { PAGE_SIZE } from "@/constants";
import { useShipments } from "@/hooks/api";
import { deleteShipment } from "@/services/mutations";
import type { ShipmentListItem, ShipmentsQueryParams } from "@/types";

/** Owns the list params plus the four modal targets the shipments screen drives. */
export function useShipmentsPage() {
  const queryClient = useQueryClient();
  const [params, setParams] = useState<ShipmentsQueryParams>({
    page: 1,
    limit: PAGE_SIZE,
  });
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [shipmentPendingEdit, setShipmentPendingEdit] =
    useState<ShipmentListItem | null>(null);
  const [shipmentPendingStatus, setShipmentPendingStatus] =
    useState<ShipmentListItem | null>(null);
  const [shipmentPendingCancel, setShipmentPendingCancel] =
    useState<ShipmentListItem | null>(null);
  const [shipmentPendingDelete, setShipmentPendingDelete] =
    useState<ShipmentListItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { data, isLoading } = useShipments(params);

  const updateParams = (nextParams: Partial<ShipmentsQueryParams>) =>
    setParams((current) => ({ ...current, ...nextParams }));

  async function refreshShipmentQueries(shipmentId?: string) {
    await queryClient.invalidateQueries({ queryKey: ["shipments"] });
    if (shipmentId) {
      await queryClient.invalidateQueries({
        queryKey: ["shipment", shipmentId],
      });
    }
  }

  async function handleDeleteShipment() {
    if (!shipmentPendingDelete || isDeleting) return;

    const current = shipmentPendingDelete;
    setIsDeleting(true);
    const result = await deleteShipment(current.id);
    setIsDeleting(false);

    if (result?.ok) {
      toast.success(result.message || "تم حذف الشحنة بنجاح");
      setShipmentPendingDelete(null);
      await refreshShipmentQueries(current.id);
      return;
    }

    toast.error(result?.message || "فشل حذف الشحنة");
  }

  const openAddForm = () => {
    setShipmentPendingEdit(null);
    setIsFormOpen(true);
  };

  const openEditForm = (shipment: ShipmentListItem) => {
    setShipmentPendingEdit(shipment);
    setIsFormOpen(true);
  };

  return {
    data,
    isLoading,
    params,
    updateParams,
    isFormOpen,
    setIsFormOpen,
    shipmentPendingEdit,
    shipmentPendingStatus,
    setShipmentPendingStatus,
    shipmentPendingCancel,
    setShipmentPendingCancel,
    shipmentPendingDelete,
    setShipmentPendingDelete,
    isDeleting,
    openAddForm,
    openEditForm,
    handleDeleteShipment,
    refreshShipmentQueries,
  };
}
