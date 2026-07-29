import { formatSaudiPhoneNumber } from "@/lib/utils/format-phone";
import type { OperatingCompanyListItem } from "@/types";

import {
  CommissionBadge,
  DetailLine,
  OperatingCompanyActions,
  OperatingCompanyLogo,
} from "./operating-company-result-parts";

type OperatingCompaniesCardsProps = {
  companies: OperatingCompanyListItem[];
  onViewCompany: (company: OperatingCompanyListItem) => void;
  onEditCompany: (company: OperatingCompanyListItem) => void;
  onEditCommission: (company: OperatingCompanyListItem) => void;
  onDeleteCompany: (company: OperatingCompanyListItem) => void;
};

function OperatingCompaniesCards({
  companies,
  onViewCompany,
  onEditCompany,
  onEditCommission,
  onDeleteCompany,
}: OperatingCompaniesCardsProps) {
  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {companies.map((company) => (
        <article
          key={company.id}
          className="overflow-hidden rounded-2xl border border-neutral-100 bg-white p-4"
        >
          <div className="space-y-3">
            <div className="flex justify-center rounded-[14px] bg-background p-3">
              <OperatingCompanyLogo company={company} className="size-24" />
            </div>
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1 text-right">
                <h3 className="truncate text-lg font-semibold text-secondary">
                  {company.name}
                </h3>
                <p dir="ltr" className="truncate text-sm text-gray">
                  {company.slug}
                </p>
              </div>
              <div className="shrink-0">
                <CommissionBadge value={company.commission_percentage} />
              </div>
            </div>
          </div>

          <div className="mt-5 space-y-3 rounded-[14px] bg-background p-4 text-right">
            <DetailLine
              label="الجوال"
              value={company.mobile ? formatSaudiPhoneNumber(company.mobile) : "-"}
            />
            <DetailLine label="البريد الإلكتروني" value={company.email ?? "-"} />
          </div>

          <div className="mt-4 border-t border-neutral-100 pt-4">
            <OperatingCompanyActions
              compact
              onView={() => onViewCompany(company)}
              onEdit={() => onEditCompany(company)}
              onEditCommission={() => onEditCommission(company)}
              onDelete={() => onDeleteCompany(company)}
            />
          </div>
        </article>
      ))}
    </section>
  );
}

export default OperatingCompaniesCards;
