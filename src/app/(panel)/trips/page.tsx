import Trips from "@/components/panel/trips";
import PermissionGate from "@/components/permission-gate";

function TripsPage() {
  return (
    <PermissionGate slug="Admin View Trips">
      <Trips />
    </PermissionGate>
  );
}

export default TripsPage;
