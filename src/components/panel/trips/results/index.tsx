import EmptyState from "@/components/ui/empty-state";
import type { TripListItem } from "@/types";
import TripsTable from "./trips-table";

function TripsResults({ trips, onView }: { trips: TripListItem[]; onView: (trip: TripListItem) => void }) {
  if (!trips.length) return <EmptyState />;
  return <TripsTable trips={trips} onView={onView} />;
}

export default TripsResults;
