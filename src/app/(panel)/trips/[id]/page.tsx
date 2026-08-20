import ViewTrip from "@/components/panel/trips/view-trip";
import PermissionGate from "@/components/permission-gate";

function TripPage() {
  return (
    <PermissionGate slug="Admin View Trips">
      <ViewTrip />
    </PermissionGate>
  );
}

export default TripPage;
