import type {
  OperationCompany,
  OrderBy,
  VehicleListItem,
  VehiclesListResponse,
  VehiclesQueryParams,
} from "@/types";
import VehiclesPagination from "./pagination";
import VehiclesResults from "./results";
import VehicleStats from "./stats";
import VehicleToolbar from "./toolbar";

type Props = {
  data?: VehiclesListResponse;
  companies: OperationCompany[];
  params: VehiclesQueryParams;
  onParamsChange: (params: Partial<VehiclesQueryParams>) => void;
  onView: (vehicle: VehicleListItem) => void;
  onEdit: (vehicle: VehicleListItem) => void;
  onCommission: (vehicle: VehicleListItem) => void;
  onManageZone: (vehicle: VehicleListItem) => void;
  onControlPanel: (vehicle: VehicleListItem) => void;
  onDelete: (vehicle: VehicleListItem) => void;
};

function VehicleMainContent({ data, companies, params, onParamsChange, ...handlers }: Props) {
  return (
    <>
      <VehicleStats analysis={data?.analysis} />
      <VehicleToolbar
        searchQuery={params.search ?? ""}
        selectedSort={params.order_by ?? "desc"}
        selectedStatus={params.status}
        selectedOperationCompany={params.operation_company_uuid}
        companies={companies}
        onSearchChange={(search) => onParamsChange({ search: search || undefined, page: 1 })}
        onSortChange={(order_by: OrderBy) => onParamsChange({ order_by, page: 1 })}
        onStatusChange={(status) => onParamsChange({ status, page: 1 })}
        onOperationCompanyChange={(operation_company_uuid) => onParamsChange({ operation_company_uuid, page: 1 })}
      />
      <VehiclesResults vehicles={data?.data ?? []} {...handlers} />
      <VehiclesPagination meta={data?.meta} onPageChange={(page) => onParamsChange({ page })} />
    </>
  );
}

export default VehicleMainContent;
