import type { ReactNode } from "react";

import type { ShippingCompanyListItem } from "@/types";

import {
  CompanyActions,
  CompanyLogo,
  MoneyValue,
  ServiceTypeBadge,
  StatusBadge,
} from "./shipping-company-result-parts";

type ShippingCompaniesTableProps = {
  companies: ShippingCompanyListItem[];
  onEditShippingCompany: (company: ShippingCompanyListItem) => void;
  onDeleteShippingCompany: (company: ShippingCompanyListItem) => void;
};

function ShippingCompaniesTable({
  companies,
  onEditShippingCompany,
  onDeleteShippingCompany,
}: ShippingCompaniesTableProps) {
  return (
    <section className="overflow-hidden rounded-lg bg-white">
      <div className="overflow-x-auto">
        <table className="w-full min-w-225 border-separate border-spacing-0 text-right">
          <thead>
            <tr className="bg-primary/8 text-base font-semibold text-dark-gray">
              <HeaderCell>الشركة</HeaderCell>
              <HeaderCell>الكود</HeaderCell>
              <HeaderCell>نوع الخدمة</HeaderCell>
              <HeaderCell>السعر الأساسي</HeaderCell>
              <HeaderCell>الدفع عند الاستلام</HeaderCell>
              <HeaderCell>عدد الشحنات</HeaderCell>
              <HeaderCell>الحالة</HeaderCell>
              <HeaderCell>الإجراءات</HeaderCell>
            </tr>
          </thead>
          <tbody>
            {companies.map((company) => (
              <tr key={company.id} className="text-dark-gray">
                <TableCell>
                  <div className="flex max-w-64 items-center gap-3">
                    <CompanyLogo company={company} />
                    <div className="min-w-0 flex-1">
                      <p
                        className="truncate text-base font-medium"
                        title={company.name}
                      >
                        {company.name}
                      </p>
                      <p className="truncate text-sm text-gray">
                        {company.avg_delivery_time ?? "-"}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell dir="ltr">{company.code}</TableCell>
                <TableCell truncate={false}>
                  <ServiceTypeBadge company={company} />
                </TableCell>
                <TableCell dir="ltr">
                  <MoneyValue value={company.base_price} />
                </TableCell>
                <TableCell>{company.supports_cod ? "مدعوم" : "غير مدعوم"}</TableCell>
                <TableCell dir="ltr">{company.shipments_count}</TableCell>
                <TableCell truncate={false}>
                  <StatusBadge active={company.active} />
                </TableCell>
                <TableCell truncate={false}>
                  <CompanyActions
                    onEdit={() => onEditShippingCompany(company)}
                    onDelete={() => onDeleteShippingCompany(company)}
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

export default ShippingCompaniesTable;
