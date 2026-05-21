import type { CitiesListResponse, CityListItem, OrderBy, QueryParams, Status } from "@/types";

import type { CitiesViewMode } from "./header";
import CitiesPagination from "./pagination";
import CitiesResults from "./results";
import CitiesStats from "./stats";
import CitiesToolbar from "./toolbar";

type CitiesMainContentProps = {
  data?: CitiesListResponse;
  params: QueryParams;
  viewMode: CitiesViewMode;
  onParamsChange: (params: Partial<QueryParams>) => void;
  onEditCity: (city: CityListItem) => void;
  onDeleteCity: (city: CityListItem) => void;
};

function CitiesMainContent({
  data,
  params,
  viewMode,
  onParamsChange,
  onEditCity,
  onDeleteCity,
}: CitiesMainContentProps) {
  return (
    <>
      <CitiesStats data={data?.analytics} />
      <CitiesToolbar
        searchQuery={params.search ?? ""}
        selectedSort={params.order_by ?? "desc"}
        selectedStatus={params.status}
        onSearchChange={(search) => onParamsChange({ search: search || undefined, page: 1 })}
        onSortChange={(order_by: OrderBy) => onParamsChange({ order_by, page: 1 })}
        onStatusChange={(status?: Status) => onParamsChange({ status, page: 1 })}
      />
      <CitiesResults
        cities={data?.data ?? []}
        viewMode={viewMode}
        onEditCity={onEditCity}
        onDeleteCity={onDeleteCity}
      />
      <CitiesPagination
        meta={data?.meta}
        onPageChange={(page) => onParamsChange({ page })}
      />
    </>
  );
}

export default CitiesMainContent;
