import { shipmentDeletableStatuses, shipmentTerminalStatuses } from "@/data";
import type { ShipmentStatus } from "@/types";

/** Terminal shipments are frozen — no status change and no edits. */
export function isShipmentFinal(status: ShipmentStatus) {
  return shipmentTerminalStatuses.includes(status);
}

/** Anything that has moved is part of the audit trail; cancel it instead. */
export function isShipmentDeletable(status: ShipmentStatus) {
  return shipmentDeletableStatuses.includes(status);
}
