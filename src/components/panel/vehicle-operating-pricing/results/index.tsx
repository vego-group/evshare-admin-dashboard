import EmptyState from "@/components/ui/empty-state";
import type { VehicleListItem } from "@/types";
import VehiclesTable from "./vehicles-table";

type Props = {
  vehicles: VehicleListItem[];
  onView: (vehicle: VehicleListItem) => void;
  onEdit: (vehicle: VehicleListItem) => void;
  onReview: (vehicle: VehicleListItem) => void;
  onCommission: (vehicle: VehicleListItem) => void;
  onDelete: (vehicle: VehicleListItem) => void;
};

function VehiclesResults({ vehicles, ...handlers }: Props) {
  if (!vehicles.length) return <EmptyState />;
  return <VehiclesTable vehicles={vehicles} {...handlers} />;
}

export default VehiclesResults;
