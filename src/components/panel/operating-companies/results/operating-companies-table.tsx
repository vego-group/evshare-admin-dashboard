import type { ReactNode } from "react";

import { formatSaudiPhoneNumber } from "@/lib/utils/format-phone";
import type { OperatingCompanyListItem } from "@/types";

import {
  CommissionBadge,
  OperatingCompanyActions,
  OperatingCompanyLogo,
} from "./operating-company-result-parts";

type OperatingCompaniesTableProps = {
  companies: OperatingCompanyListItem[];
  onViewCompany: (company: OperatingCompanyListItem) => void;
  onEditCompany: (company: OperatingCompanyListItem) => void;
  onEditCommission: (company: OperatingCompanyListItem) => void;
  onDeleteCompany: (company: OperatingCompanyListItem) => void;
};

function OperatingCompaniesTable({
  companies,
  onViewCompany,
  onEditCompany,
  onEditCommission,
  onDeleteCompany,
}: OperatingCompaniesTableProps) {
  return (
    <section className="overflow-hidden rounded-lg bg-white">
      <div className="overflow-x-auto">
        <table className="w-full min-w-225 border-separate border-spacing-0 text-right">
          <thead>
            <tr className="bg-primary/8 text-base font-semibold text-dark-gray">
              <HeaderCell>الشعار</HeaderCell>
              <HeaderCell>الاسم</HeaderCell>
              <HeaderCell>المعرف</HeaderCell>
              <HeaderCell>العمولة</HeaderCell>
              <HeaderCell>الجوال</HeaderCell>
              <HeaderCell>البريد الإلكتروني</HeaderCell>
              <HeaderCell>الإجراءات</HeaderCell>
            </tr>
          </thead>
          <tbody>
            {companies.map((company) => (
              <tr key={company.id} className="text-dark-gray">
                <TableCell truncate={false}>
                  <OperatingCompanyLogo company={company} />
                </TableCell>
                <TableCell>
                  <p className="truncate text-base font-medium" title={company.name}>
                    {company.name}
                  </p>
                </TableCell>
                <TableCell dir="ltr">{company.slug}</TableCell>
                <TableCell truncate={false}>
                  <CommissionBadge value={company.commission_percentage} />
                </TableCell>
                <TableCell dir="ltr">
                  {company.mobile ? formatSaudiPhoneNumber(company.mobile) : "-"}
                </TableCell>
                <TableCell dir="ltr">{company.email ?? "-"}</TableCell>
                <TableCell truncate={false}>
                  <OperatingCompanyActions
                    onView={() => onViewCompany(company)}
                    onEdit={() => onEditCompany(company)}
                    onEditCommission={() => onEditCommission(company)}
                    onDelete={() => onDeleteCompany(company)}
                  />
                </TableCell>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function HeaderCell({ children }: { children: ReactNode }) {
  return <th className="border-b border-primary/15 px-5 py-5">{children}</th>;
}

function TableCell({
  children,
  dir,
  truncate = true,
}: {
  children: ReactNode;
  dir?: "ltr" | "rtl";
  truncate?: boolean;
}) {
  return (
    <td
      dir={dir}
      className={
        truncate
          ? "max-w-0 overflow-hidden text-ellipsis whitespace-nowrap border-b border-primary/15 px-5 py-3"
          : "border-b border-primary/15 px-5 py-3"
      }
    >
      {children}
    </td>
  );
}

export default OperatingCompaniesTable;
