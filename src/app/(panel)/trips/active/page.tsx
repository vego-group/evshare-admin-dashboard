import ActiveTrips from "@/components/panel/trips/active-trips";
import PermissionGate from "@/components/permission-gate";

function ActiveTripsPage() {
  return (
    <PermissionGate slug="Admin View Trips">
      <ActiveTrips />
    </PermissionGate>
  );
}

export default ActiveTripsPage;
