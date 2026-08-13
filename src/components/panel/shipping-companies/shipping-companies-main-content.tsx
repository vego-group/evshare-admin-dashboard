import type {
  OrderBy,
  ShippingCompaniesListResponse,
  ShippingCompaniesQueryParams,
  ShippingCompanyListItem,
  Status,
} from "@/types";

import ShippingCompaniesPagination from "./pagination";
import ShippingCompaniesResults from "./results";
import ShippingCompaniesStats from "./stats";
import ShippingCompaniesToolbar from "./toolbar";

type ShippingCompaniesMainContentProps = {
  data?: ShippingCompaniesListResponse;
  params: ShippingCompaniesQueryParams;
  onParamsChange: (params: Partial<ShippingCompaniesQueryParams>) => void;
  onEditShippingCompany: (company: ShippingCompanyListItem) => void;
  onDeleteShippingCompany: (company: ShippingCompanyListItem) => void;
};

function ShippingCompaniesMainContent({
  data,
  params,
  onParamsChange,
  onEditShippingCompany,
  onDeleteShippingCompany,
}: ShippingCompaniesMainContentProps) {
  return (
    <>
      <ShippingCompaniesStats data={data?.analytics} />
      <ShippingCompaniesToolbar
        searchQuery={params.search ?? ""}
        selectedSort={params.order_by ?? "desc"}
        selectedStatus={params.status}
        onSearchChange={(search) =>
          onParamsChange({ search: search || undefined, page: 1 })
        }
        onSortChange={(order_by: OrderBy) =>
          onParamsChange({ order_by, page: 1 })
        }
        onStatusChange={(status?: Status) => onParamsChange({ status, page: 1 })}
      />
      <ShippingCompaniesResults
        companies={data?.data ?? []}
        onEditShippingCompany={onEditShippingCompany}
        onDeleteShippingCompany={onDeleteShippingCompany}
      />
      <ShippingCompaniesPagination
        meta={data?.meta}
        onPageChange={(page) => onParamsChange({ page })}
      />
    </>
  );
}

export default ShippingCompaniesMainContent;
