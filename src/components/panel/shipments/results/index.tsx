import EmptyState from "@/components/ui/empty-state";
import type { ShipmentListItem } from "@/types";

import ShipmentsTable from "./shipments-table";

type ShipmentsResultsProps = {
  shipments: ShipmentListItem[];
  onViewShipment: (shipment: ShipmentListItem) => void;
  onEditShipment: (shipment: ShipmentListItem) => void;
  onUpdateShipmentStatus: (shipment: ShipmentListItem) => void;
  onCancelShipment: (shipment: ShipmentListItem) => void;
  onDeleteShipment: (shipment: ShipmentListItem) => void;
};

function ShipmentsResults({ shipments, ...actions }: ShipmentsResultsProps) {
  if (!shipments.length) {
    return <EmptyState description="لا توجد شحنات مطابقة." />;
  }

  return <ShipmentsTable shipments={shipments} {...actions} />;
}

export default ShipmentsResults;
