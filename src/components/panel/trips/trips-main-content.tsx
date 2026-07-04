import type { TripListItem, TripsListResponse, TripsQueryParams } from "@/types";
import TripsPagination from "./pagination";
import TripsResults from "./results";
import TripsToolbar from "./toolbar";

type Props = {
  data?: TripsListResponse;
  params: TripsQueryParams;
  onParamsChange: (params: Partial<TripsQueryParams>) => void;
  onView: (trip: TripListItem) => void;
};

function TripsMainContent({ data, params, onParamsChange, onView }: Props) {
  return (
    <>
      <TripsToolbar
        searchQuery={params.search ?? ""}
        selectedStatus={params.status}
        onSearchChange={(search) => onParamsChange({ search: search || undefined, page: 1 })}
        onStatusChange={(status) => onParamsChange({ status, page: 1 })}
      />
      <TripsResults trips={data?.data ?? []} onView={onView} />
      <TripsPagination meta={data?.meta} onPageChange={(page) => onParamsChange({ page })} />
    </>
  );
}

export default TripsMainContent;
