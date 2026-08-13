import EmptyState from "@/components/ui/empty-state";
import type { ShippingCompanyListItem } from "@/types";

import ShippingCompaniesTable from "./shipping-companies-table";

type ShippingCompaniesResultsProps = {
  companies: ShippingCompanyListItem[];
  onEditShippingCompany: (company: ShippingCompanyListItem) => void;
  onDeleteShippingCompany: (company: ShippingCompanyListItem) => void;
};

function ShippingCompaniesResults({
  companies,
  onEditShippingCompany,
  onDeleteShippingCompany,
}: ShippingCompaniesResultsProps) {
  if (!companies.length) {
    return <EmptyState description="لا توجد شركات شحن مطابقة." />;
  }

  return (
    <ShippingCompaniesTable
      companies={companies}
      onEditShippingCompany={onEditShippingCompany}
      onDeleteShippingCompany={onDeleteShippingCompany}
    />
  );
}

export default ShippingCompaniesResults;
