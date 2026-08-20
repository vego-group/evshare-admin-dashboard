import ViewShipment from "@/components/panel/shipments/view-shipment";
import PermissionGate from "@/components/permission-gate";

function ShipmentPage() {
  return <PermissionGate slug="Admin Details Shipments"><ViewShipment /></PermissionGate>;
}

export default ShipmentPage;
