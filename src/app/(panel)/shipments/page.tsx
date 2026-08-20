import Shipments from "@/components/panel/shipments";
import PermissionGate from "@/components/permission-gate";

function ShipmentsPage() {
  return (
    <PermissionGate slug="Admin Index Shipments">
      <Shipments />
    </PermissionGate>
  );
}

export default ShipmentsPage;
