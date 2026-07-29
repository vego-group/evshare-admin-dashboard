import type {
  OperatingCompaniesListResponse,
  OperatingCompaniesQueryParams,
  OperatingCompanyListItem,
} from "@/types";

import type { OperatingCompaniesViewMode } from "./header";
import OperatingCompaniesPagination from "./pagination";
import OperatingCompaniesResults from "./results";
import OperatingCompaniesToolbar from "./toolbar";

type OperatingCompaniesMainContentProps = {
  data?: OperatingCompaniesListResponse;
  params: OperatingCompaniesQueryParams;
  viewMode: OperatingCompaniesViewMode;
  onParamsChange: (params: Partial<OperatingCompaniesQueryParams>) => void;
  onViewCompany: (company: OperatingCompanyListItem) => void;
  onEditCompany: (company: OperatingCompanyListItem) => void;
  onEditCommission: (company: OperatingCompanyListItem) => void;
  onDeleteCompany: (company: OperatingCompanyListItem) => void;
};

function OperatingCompaniesMainContent({
  data,
  params,
  viewMode,
  onParamsChange,
  onViewCompany,
  onEditCompany,
  onEditCommission,
  onDeleteCompany,
}: OperatingCompaniesMainContentProps) {
  return (
    <>
      <OperatingCompaniesToolbar
        searchQuery={params.search ?? ""}
        onSearchChange={(search) =>
          onParamsChange({ search: search || undefined, page: 1 })
        }
      />
      <OperatingCompaniesResults
        companies={data?.data ?? []}
        viewMode={viewMode}
        onViewCompany={onViewCompany}
        onEditCompany={onEditCompany}
        onEditCommission={onEditCommission}
        onDeleteCompany={onDeleteCompany}
      />
      <OperatingCompaniesPagination
        meta={data?.meta}
        onPageChange={(page) => onParamsChange({ page })}
      />
    </>
  );
}

export default OperatingCompaniesMainContent;
