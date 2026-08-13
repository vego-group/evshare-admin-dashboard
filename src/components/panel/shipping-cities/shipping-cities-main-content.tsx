import type {
  ShippingCitiesListResponse,
  ShippingCitiesQueryParams,
  ShippingCityListItem,
  Status,
} from "@/types";

import ShippingCitiesPagination from "./pagination";
import ShippingCitiesResults from "./results";
import ShippingCitiesStats from "./stats";
import ShippingCitiesToolbar from "./toolbar";

type ShippingCitiesMainContentProps = {
  data?: ShippingCitiesListResponse;
  params: ShippingCitiesQueryParams;
  onParamsChange: (params: Partial<ShippingCitiesQueryParams>) => void;
  onEditShippingCity: (city: ShippingCityListItem) => void;
  onDeleteShippingCity: (city: ShippingCityListItem) => void;
};

function ShippingCitiesMainContent({
  data,
  params,
  onParamsChange,
  onEditShippingCity,
  onDeleteShippingCity,
}: ShippingCitiesMainContentProps) {
  return (
    <>
      <ShippingCitiesStats data={data?.analytics} />
      <ShippingCitiesToolbar
        searchQuery={params.search ?? ""}
        selectedStatus={params.status}
        selectedCity={params.city_uuid}
        onSearchChange={(search) =>
          onParamsChange({ search: search || undefined, page: 1 })
        }
        onStatusChange={(status?: Status) => onParamsChange({ status, page: 1 })}
        onCityChange={(cityId) => onParamsChange({ city_uuid: cityId, page: 1 })}
      />
      <ShippingCitiesResults
        shippingCities={data?.data ?? []}
        onEditShippingCity={onEditShippingCity}
        onDeleteShippingCity={onDeleteShippingCity}
      />
      <ShippingCitiesPagination
        meta={data?.meta}
        onPageChange={(page) => onParamsChange({ page })}
      />
    </>
  );
}

export default ShippingCitiesMainContent;
