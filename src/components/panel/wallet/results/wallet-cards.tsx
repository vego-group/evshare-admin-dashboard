"use client";

import type { ReactNode } from "react";
import { Eye } from "lucide-react";
import MoneyValue from "@/components/ui/money-value";

import type { WalletTransaction } from "@/types";

import { WalletStatusBadge } from "../table/wallet-status-badge";

function WalletCards({
  transactions,
  onViewTransaction,
}: {
  transactions: WalletTransaction[];
  onViewTransaction: (transaction: WalletTransaction) => void;
}) {
  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {transactions.map((transaction) => (
        <WalletCard
          key={transaction.id}
          transaction={transaction}
          onView={() => onViewTransaction(transaction)}
        />
      ))}
    </section>
  );
}

function WalletCard({
  transaction,
  onView,
}: {
  transaction: WalletTransaction;
  onView: () => void;
}) {
  return (
    <article className="overflow-hidden rounded-2xl border border-neutral-100 bg-white p-4 transition hover:shadow-md">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1 text-right">
          <h3 className="truncate text-lg font-semibold text-secondary">
            {transaction.title}
          </h3>
          <p className="text-sm text-gray">مستخدم #{transaction.user_id}</p>
        </div>
        <div className="shrink-0">
          <WalletStatusBadge status={transaction.status} />
        </div>
      </div>

      <div className="mt-4 space-y-2 rounded-[14px] bg-background p-4 text-right">
        {transaction.credit > 0 && (
          <DetailLine
            label="إيداع"
            value={
              <MoneyValue value={transaction.credit} className="text-green-600" />
            }
          />
        )}
        {transaction.debit > 0 && (
          <DetailLine
            label="سحب"
            value={
              <MoneyValue value={transaction.debit} className="text-red-500" />
            }
          />
        )}
        <DetailLine
          label="الرصيد"
          value={
            <MoneyValue value={transaction.balance} />
          }
        />
        <DetailLine
          label="التاريخ"
          value={formatDate(transaction.created_at)}
          dir="ltr"
        />
      </div>

      <button
        type="button"
        onClick={onView}
        className="mt-4 inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-blue-50 text-sm font-semibold text-blue-600 transition hover:brightness-95"
      >
        <Eye className="size-4 shrink-0" />
        عرض التفاصيل
      </button>
    </article>
  );
}

function DetailLine({
  label,
  value,
  dir,
}: {
  label: string;
  value: ReactNode;
  dir?: "ltr" | "rtl";
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="shrink-0 text-sm text-gray">{label}</span>
      <span
        dir={dir}
        className="min-w-0 truncate text-right text-sm font-medium text-secondary"
      >
        {value}
      </span>
    </div>
  );
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("ar-EG", { dateStyle: "medium" }).format(date);
}

export default WalletCards;
