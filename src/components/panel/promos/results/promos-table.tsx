import type { ReactNode } from "react";

import type { PromoListItem } from "@/types";

import {
  DiscountValue,
  formatPeriod,
  formatUsage,
  PromoActions,
  PromoIcon,
  StatusBadge,
  TypeBadge,
} from "./promo-result-parts";

type PromosTableProps = {
  promos: PromoListItem[];
  onEditPromo: (promo: PromoListItem) => void;
  onDeletePromo: (promo: PromoListItem) => void;
};

function PromosTable({ promos, onEditPromo, onDeletePromo }: PromosTableProps) {
  return (
    <section className="overflow-hidden rounded-lg bg-white">
      <div className="overflow-x-auto">
        <table className="w-full min-w-225 border-separate border-spacing-0 text-right">
          <thead>
            <tr className="bg-primary/8 text-base font-semibold text-dark-gray">
              <HeaderCell>كود الخصم</HeaderCell>
              <HeaderCell>النوع</HeaderCell>
              <HeaderCell>الخصم</HeaderCell>
              <HeaderCell>الاستخدام</HeaderCell>
              <HeaderCell>الفترة</HeaderCell>
              <HeaderCell>الحالة</HeaderCell>
              <HeaderCell>الإجراءات</HeaderCell>
            </tr>
          </thead>
          <tbody>
            {promos.map((promo) => (
              <tr key={promo.id} className="text-dark-gray">
                <TableCell>
                  <div className="flex max-w-55 items-center gap-3">
                    <PromoIcon />
                    <p
                      className="min-w-0 flex-1 truncate text-base font-medium"
                      dir="ltr"
                      title={promo.code}
                    >
                      {promo.code}
                    </p>
                  </div>
                </TableCell>
                <TableCell truncate={false}>
                  <TypeBadge type={promo.type} />
                </TableCell>
                <TableCell dir="ltr">
                  <DiscountValue promo={promo} />
                </TableCell>
                <TableCell dir="ltr">{formatUsage(promo)}</TableCell>
                <TableCell dir="ltr">{formatPeriod(promo)}</TableCell>
                <TableCell truncate={false}>
                  <StatusBadge promo={promo} />
                </TableCell>
                <TableCell truncate={false}>
                  <PromoActions
                    onEdit={() => onEditPromo(promo)}
                    onDelete={() => onDeletePromo(promo)}
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

export default PromosTable;
