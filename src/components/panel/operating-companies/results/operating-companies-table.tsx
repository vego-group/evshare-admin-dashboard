import type { ReactNode } from "react";

import { formatSaudiPhoneNumber } from "@/lib/utils/format-phone";
import type { OperatingCompanyListItem } from "@/types";

import {
  CommissionBadge,
  OperatingCompanyActions,
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
        <table className="w-full min-w-270 table-fixed border-separate border-spacing-0 text-right">
          <colgroup>
            <col className="w-[22%]" />
            <col className="w-[16%]" />
            <col className="w-27.5" />
            <col className="w-[15%]" />
            <col className="w-[19%]" />
            <col className="w-57.5" />
          </colgroup>
          <thead>
            <tr className="bg-primary/8 text-base font-semibold text-dark-gray">
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
