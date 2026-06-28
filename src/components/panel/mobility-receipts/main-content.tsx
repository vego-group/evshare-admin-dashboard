import type {
  MobilityReceipt,
  MobilityReceiptListResponse,
  MobilityReceiptQueryParams,
  OrderBy,
} from "@/types";
import type { MobilityReceiptsViewMode } from "./header";
import MobilityReceiptsPagination from "./pagination";
import MobilityReceiptsResults from "./results";
import MobilityReceiptsStats from "./stats";
import MobilityReceiptsToolbar from "./toolbar";

type Props = {
  data?: MobilityReceiptListResponse;
  params: MobilityReceiptQueryParams;
  viewMode: MobilityReceiptsViewMode;
  onParamsChange: (params: Partial<MobilityReceiptQueryParams>) => void;
  onView: (receipt: MobilityReceipt) => void;
  onEditTemplate: (receipt: MobilityReceipt) => void;
  onReview: (receipt: MobilityReceipt) => void;
};

function MobilityReceiptsMainContent({
  data,
  params,
  viewMode,
  onParamsChange,
  ...handlers
}: Props) {
  return (
    <>
      <MobilityReceiptsStats receipts={data?.data} />
      <MobilityReceiptsToolbar
        searchQuery={params.search ?? ""}
        selectedSort={params.order_by ?? "desc"}
        selectedActivationStatus={params.activation_status}
        selectedOperatingType={params.operating_type}
        onSearchChange={(search) => onParamsChange({ search: search || undefined, page: 1 })}
        onSortChange={(order_by: OrderBy) => onParamsChange({ order_by, page: 1 })}
        onActivationStatusChange={(activation_status) => onParamsChange({ activation_status, page: 1 })}
        onOperatingTypeChange={(operating_type) => onParamsChange({ operating_type, page: 1 })}
      />
      <MobilityReceiptsResults
        receipts={data?.data ?? []}
        viewMode={viewMode}
        {...handlers}
      />
      <MobilityReceiptsPagination
        currentPage={params.page}
        meta={data?.meta}
        onPageChange={(page) => onParamsChange({ page })}
      />
    </>
  );
}

export default MobilityReceiptsMainContent;
