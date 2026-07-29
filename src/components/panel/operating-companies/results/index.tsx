import EmptyState from "@/components/ui/empty-state";
import type { OperatingCompanyListItem } from "@/types";

import type { OperatingCompaniesViewMode } from "../header";
import OperatingCompaniesCards from "./operating-companies-cards";
import OperatingCompaniesTable from "./operating-companies-table";

type OperatingCompaniesResultsProps = {
  companies: OperatingCompanyListItem[];
  viewMode: OperatingCompaniesViewMode;
  onViewCompany: (company: OperatingCompanyListItem) => void;
  onEditCompany: (company: OperatingCompanyListItem) => void;
  onEditCommission: (company: OperatingCompanyListItem) => void;
  onDeleteCompany: (company: OperatingCompanyListItem) => void;
};

function OperatingCompaniesResults({
  companies,
  viewMode,
  onViewCompany,
  onEditCompany,
  onEditCommission,
  onDeleteCompany,
}: OperatingCompaniesResultsProps) {
  if (!companies.length) {
    return <EmptyState description="لا توجد شركات مشغلة مطابقة." />;
  }

  const props = {
    companies,
    onViewCompany,
    onEditCompany,
    onEditCommission,
    onDeleteCompany,
  };

  return viewMode === "table" ? (
    <OperatingCompaniesTable {...props} />
  ) : (
    <OperatingCompaniesCards {...props} />
  );
}

export default OperatingCompaniesResults;
