import type { ReactNode } from "react";
import MoneyValue from "@/components/ui/money-value";

import { cn } from "@/lib/utils";
import type { VatRecord } from "@/types";

import { VatStatusBadge } from "../status-badge";

function VatTableRow({ record }: { record: VatRecord }) {
  return (
    <tr className="text-base font-medium leading-6 text-dark-gray transition hover:bg-primary/5">
      <TableCell dir="ltr" className="text-right">
        <span className="block truncate font-semibold text-secondary">
          {record.reference}
        </span>
      </TableCell>
      <TableCell dir="ltr">{formatDate(record.date)}</TableCell>
      <TableCell dir="ltr">{record.period}</TableCell>
      <TableCell dir="ltr">
        <AmountCell value={record.base_amount} />
      </TableCell>
      <TableCell dir="ltr">
        <AmountCell value={record.vat_amount} />
      </TableCell>
      <TableCell dir="ltr">{record.due_date}</TableCell>
      <TableCell className="max-w-none overflow-visible whitespace-normal">
        <VatStatusBadge status={record.status} />
      </TableCell>
      <TableCell>{record.order?.customer?.name ?? "—"}</TableCell>
      <TableCell dir="ltr">
        <AmountCell value={record.period_vat_remaining} />
      </TableCell>
    </tr>
  );
}

function AmountCell({ value }: { value: number }) {
  return <MoneyValue value={value} />;
}

function TableCell({
  children,
  className,
  dir,
}: {
  children: ReactNode;
  className?: string;
  dir?: "ltr" | "rtl";
}) {
  return (
    <td
      dir={dir}
      className={cn(
        "h-16 max-w-0 overflow-hidden text-ellipsis whitespace-nowrap border-b border-primary/15 px-5 py-3 text-right",
        className,
      )}
    >
      {children}
    </td>
  );
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("ar-EG", {
    dateStyle: "medium",
  }).format(date);
}

export default VatTableRow;
