"use client";

import type { ReactNode } from "react";
import { SaudiRiyal } from "lucide-react";
import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import type { WalletTransaction } from "@/types";

import { WalletStatusBadge } from "./wallet-status-badge";

function WalletTableRow({ transaction }: { transaction: WalletTransaction }) {
  const router = useRouter();
  const handleSelect = () => router.push(`/wallet/${transaction.id}`);

  return (
    <tr
      tabIndex={0}
      role="button"
      onClick={handleSelect}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleSelect();
        }
      }}
      className="cursor-pointer text-base font-medium leading-6 text-dark-gray transition hover:bg-primary/5 focus-visible:bg-primary/5 focus-visible:outline-none"
    >
      <TableCell dir="ltr" className="max-w-0 text-right">
        <span className="block truncate font-semibold text-secondary">
          {transaction.title}
        </span>
      </TableCell>
      <TableCell dir="ltr" className="text-right">
        <AmountCell value={transaction.credit} color="text-green-600" />
      </TableCell>
      <TableCell dir="ltr" className="text-right">
        <AmountCell value={transaction.debit} color="text-red-500" />
      </TableCell>
      <TableCell dir="ltr" className="text-right">
        <AmountCell value={transaction.balance} />
      </TableCell>
      <TableCell className="max-w-none overflow-visible whitespace-normal">
        <WalletStatusBadge status={transaction.status} />
      </TableCell>
      <TableCell>{transaction.user_id}</TableCell>
      <TableCell dir="ltr">{formatDate(transaction.created_at)}</TableCell>
    </tr>
  );
}

function AmountCell({
  value,
  color,
}: {
  value: number;
  color?: string;
}) {
  if (!value) return <span className="text-gray">—</span>;
  return (
    <span className={cn("inline-flex items-center gap-1", color)}>
      <SaudiRiyal className="size-4" />
      {value.toLocaleString("en-US")}
    </span>
  );
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
    timeStyle: "short",
  }).format(date);
}

export default WalletTableRow;
