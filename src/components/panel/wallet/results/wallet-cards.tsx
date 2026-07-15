"use client";

import type { ReactNode } from "react";
import { SaudiRiyal } from "lucide-react";
import { useRouter } from "next/navigation";

import type { WalletTransaction } from "@/types";

import { WalletStatusBadge } from "../table/wallet-status-badge";

function WalletCards({ transactions }: { transactions: WalletTransaction[] }) {
  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {transactions.map((transaction) => (
        <WalletCard key={transaction.id} transaction={transaction} />
      ))}
    </section>
  );
}

function WalletCard({ transaction }: { transaction: WalletTransaction }) {
  const router = useRouter();
  const handleSelect = () => router.push(`/wallet/${transaction.id}`);

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={handleSelect}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleSelect();
        }
      }}
      className="cursor-pointer overflow-hidden rounded-2xl border border-neutral-100 bg-white p-4 transition hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
    >
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
              <span className="inline-flex items-center gap-1 text-green-600">
                <SaudiRiyal className="size-4 shrink-0" />
                {transaction.credit.toLocaleString("en-US")}
              </span>
            }
          />
        )}
        {transaction.debit > 0 && (
          <DetailLine
            label="سحب"
            value={
              <span className="inline-flex items-center gap-1 text-red-500">
                <SaudiRiyal className="size-4 shrink-0" />
                {transaction.debit.toLocaleString("en-US")}
              </span>
            }
          />
        )}
        <DetailLine
          label="الرصيد"
          value={
            <span className="inline-flex items-center gap-1">
              <SaudiRiyal className="size-4 shrink-0" />
              {transaction.balance.toLocaleString("en-US")}
            </span>
          }
        />
        <DetailLine label="التاريخ" value={formatDate(transaction.created_at)} dir="ltr" />
      </div>
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
