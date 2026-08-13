"use client";

import { useRouter } from "next/navigation";

import ShipmentsContentShimmer from "./content-shimmer";
import ShipmentsHeader from "./header";
import {
  ShipmentCancelModal,
  ShipmentDeleteConfirmModal,
  ShipmentFormModal,
  ShipmentStatusModal,
} from "./modals";
import ShipmentsMainContent from "./shipments-main-content";
import { useShipmentsPage } from "./use-shipments-page";

function Shipments() {
  const router = useRouter();
  const {
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
  } = useShipmentsPage();

  return (
    <div className="flex w-full flex-col gap-6">
      {isLoading ? (
        <ShipmentsContentShimmer />
      ) : (
        <>
          <ShipmentsHeader onAddShipment={openAddForm} />
          <ShipmentsMainContent
            data={data}
            params={params}
            onParamsChange={updateParams}
            onViewShipment={(shipment) =>
              router.push(`/shipments/${shipment.id}`)
            }
            onEditShipment={openEditForm}
            onUpdateShipmentStatus={setShipmentPendingStatus}
            onCancelShipment={setShipmentPendingCancel}
            onDeleteShipment={setShipmentPendingDelete}
          />
        </>
      )}

      <ShipmentFormModal
        key={shipmentPendingEdit?.id ?? "add-shipment"}
        open={isFormOpen}
        shipment={shipmentPendingEdit}
        onClose={() => setIsFormOpen(false)}
        onSaved={() => refreshShipmentQueries(shipmentPendingEdit?.id)}
      />

      <ShipmentStatusModal
        key={`status-${shipmentPendingStatus?.id ?? "none"}`}
        open={Boolean(shipmentPendingStatus)}
        shipment={shipmentPendingStatus}
        onClose={() => setShipmentPendingStatus(null)}
        onSaved={() => refreshShipmentQueries(shipmentPendingStatus?.id)}
      />

      <ShipmentCancelModal
        key={`cancel-${shipmentPendingCancel?.id ?? "none"}`}
        open={Boolean(shipmentPendingCancel)}
        shipment={shipmentPendingCancel}
        onClose={() => setShipmentPendingCancel(null)}
        onSaved={() => refreshShipmentQueries(shipmentPendingCancel?.id)}
      />

      <ShipmentDeleteConfirmModal
        open={Boolean(shipmentPendingDelete)}
        shipmentLabel={
          shipmentPendingDelete?.tracking_id ??
          shipmentPendingDelete?.order?.order_code
        }
        isDeleting={isDeleting}
        onClose={() => {
          if (!isDeleting) setShipmentPendingDelete(null);
        }}
        onConfirm={handleDeleteShipment}
      />
    </div>
  );
}

export default Shipments;
