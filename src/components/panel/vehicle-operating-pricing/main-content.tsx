import type { OrderBy, VehicleListItem, VehiclesListResponse, VehiclesQueryParams } from "@/types";
import VehiclesPagination from "./pagination";
import VehiclesResults from "./results";
import VehicleStats from "./stats";
import VehicleToolbar from "./toolbar";

type Props = {
  data?: VehiclesListResponse;
  params: VehiclesQueryParams;
  onParamsChange: (params: Partial<VehiclesQueryParams>) => void;
  onView: (vehicle: VehicleListItem) => void;
  onEdit: (vehicle: VehicleListItem) => void;
  onReview: (vehicle: VehicleListItem) => void;
  onCommission: (vehicle: VehicleListItem) => void;
  onDelete: (vehicle: VehicleListItem) => void;
};

function VehicleMainContent({ data, params, onParamsChange, ...handlers }: Props) {
  return (
    <>
      <VehicleStats vehicles={data?.data} total={data?.meta?.total} />
      <VehicleToolbar
        searchQuery={params.search ?? ""}
        selectedSort={params.order_by ?? "desc"}
        selectedStatus={params.status}
        selectedActivationStatus={params.activation_status}
        selectedOperatingType={params.operating_type}
        onSearchChange={(search) => onParamsChange({ search: search || undefined, page: 1 })}
        onSortChange={(order_by: OrderBy) => onParamsChange({ order_by, page: 1 })}
        onStatusChange={(status) => onParamsChange({ status, page: 1 })}
        onActivationStatusChange={(activation_status) => onParamsChange({ activation_status, page: 1 })}
        onOperatingTypeChange={(operating_type) => onParamsChange({ operating_type, page: 1 })}
      />
      <VehiclesResults vehicles={data?.data ?? []} {...handlers} />
      <VehiclesPagination meta={data?.meta} onPageChange={(page) => onParamsChange({ page })} />
    </>
  );
}

export default VehicleMainContent;
