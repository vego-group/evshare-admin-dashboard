"use client";

import type { ReactNode } from "react";
import { ArrowRight, SaudiRiyal } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { useWalletTransaction } from "@/hooks/api";

import { WalletStatusBadge } from "../table/wallet-status-badge";
import TransactionShimmer from "./transaction-shimmer";

function WalletTransactionDetails() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data, isLoading } = useWalletTransaction(id ?? null);
  const transaction = data?.data;

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex size-10 items-center justify-center rounded-full border border-neutral-200 bg-white text-secondary transition hover:bg-neutral-50"
          aria-label="العودة"
        >
          <ArrowRight className="size-5" />
        </button>
        <div>
          <h1 className="text-2xl font-semibold leading-8 text-secondary">تفاصيل الحركة المالية</h1>
          {transaction ? (
            <p className="text-sm font-normal text-gray">{transaction.title}</p>
          ) : null}
        </div>
      </div>

      {isLoading ? (
        <TransactionShimmer />
      ) : transaction ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <InfoCard label="العنوان" value={transaction.title} />
          <InfoCard
            label="الحالة"
            value={<WalletStatusBadge status={transaction.status} />}
          />
          <InfoCard label="المستخدم" value={`#${transaction.user_id}`} />
          <InfoCard
            label="إيداع"
            value={<AmountValue value={transaction.credit} color="text-green-600" />}
          />
          <InfoCard
            label="سحب"
            value={<AmountValue value={transaction.debit} color="text-red-500" />}
          />
          <InfoCard
            label="الرصيد"
            value={<AmountValue value={transaction.balance} />}
          />
          <InfoCard
            label="التاريخ"
            value={formatDate(transaction.created_at)}
            dir="ltr"
          />
        </div>
      ) : (
        <div className="flex min-h-80 items-center justify-center rounded-[14px] bg-white px-4 text-center text-base text-gray">
          تعذر تحميل تفاصيل الحركة المالية.
        </div>
      )}
    </div>
  );
}

function InfoCard({
  label,
  value,
  dir,
}: {
  label: string;
  value: ReactNode;
  dir?: "ltr" | "rtl";
}) {
  return (
    <div className="flex flex-col gap-1 rounded-[14px] border border-[#e5e7eb] bg-white px-5 py-4">
      <span className="text-sm font-normal text-gray">{label}</span>
      <span dir={dir} className="break-all text-base font-medium text-secondary">
        {value}
      </span>
    </div>
  );
}

function AmountValue({ value, color }: { value: number; color?: string }) {
  if (!value) return <span className="text-gray">—</span>;
  return (
    <span className={`inline-flex items-center gap-1 ${color ?? ""}`} dir="ltr">
      <SaudiRiyal className="size-4" />
      {value.toLocaleString("en-US")}
    </span>
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

export default WalletTransactionDetails;
