import type {
  OrderBy,
  ShipmentDirection,
  ShipmentListItem,
  ShipmentStatus,
  ShipmentsListResponse,
  ShipmentsQueryParams,
} from "@/types";

import ShipmentsPagination from "./pagination";
import ShipmentsResults from "./results";
import ShipmentsStats from "./stats";
import ShipmentsToolbar from "./toolbar";

type ShipmentsMainContentProps = {
  data?: ShipmentsListResponse;
  params: ShipmentsQueryParams;
  onParamsChange: (params: Partial<ShipmentsQueryParams>) => void;
  onViewShipment: (shipment: ShipmentListItem) => void;
  onEditShipment: (shipment: ShipmentListItem) => void;
  onUpdateShipmentStatus: (shipment: ShipmentListItem) => void;
  onCancelShipment: (shipment: ShipmentListItem) => void;
  onDeleteShipment: (shipment: ShipmentListItem) => void;
};

function ShipmentsMainContent({
  data,
  params,
  onParamsChange,
  ...actions
}: ShipmentsMainContentProps) {
  return (
    <>
      <ShipmentsStats data={data?.analytics} />
      <ShipmentsToolbar
        searchQuery={params.search ?? ""}
        selectedStatus={params.status}
        selectedDirection={params.direction}
        selectedCompany={params.shipping_company_uuid}
        selectedSort={params.order_by ?? "desc"}
        onSearchChange={(search) =>
          onParamsChange({ search: search || undefined, page: 1 })
        }
        onStatusChange={(status?: ShipmentStatus) =>
          onParamsChange({ status, page: 1 })
        }
        onDirectionChange={(direction?: ShipmentDirection) =>
          onParamsChange({ direction, page: 1 })
        }
        onCompanyChange={(shipping_company_uuid) =>
          onParamsChange({ shipping_company_uuid, page: 1 })
        }
        onSortChange={(order_by: OrderBy) =>
          onParamsChange({ order_by, page: 1 })
        }
      />
      <ShipmentsResults shipments={data?.data ?? []} {...actions} />
      <ShipmentsPagination
        meta={data?.meta}
        onPageChange={(page) => onParamsChange({ page })}
      />
    </>
  );
}

export default ShipmentsMainContent;
