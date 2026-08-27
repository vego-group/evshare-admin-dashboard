"use client";

import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import CurrencyMoneyValue from "@/components/ui/money-value";
import { useParams, useRouter } from "next/navigation";

import Header from "@/components/ui/header";
import Shimmer from "@/components/ui/shimmer";
import { useWalletTransaction } from "@/hooks/api";
import { formatSaudiPhoneNumber } from "@/lib/utils/format-phone";
import type { WalletTransactionDetails } from "@/types";

import { WalletStatusBadge } from "../table/wallet-status-badge";

function ViewWalletTransaction() {
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
          className="flex size-10 shrink-0 items-center justify-center rounded-full border border-neutral-200 bg-white text-secondary transition hover:bg-neutral-50"
          aria-label="العودة"
        >
          <ArrowRight className="size-5 shrink-0" />
        </button>
        <Header
          title="تفاصيل المعاملة"
          subtitle={transaction ? transaction.title : "عرض بيانات معاملة المحفظة المحددة"}
        />
      </div>

      {isLoading ? (
        <DetailsShimmer />
      ) : transaction ? (
        <TransactionDetails transaction={transaction} />
      ) : (
        <div className="flex min-h-80 items-center justify-center rounded-[14px] bg-white px-4 text-center text-base text-gray">
          تعذر تحميل تفاصيل المعاملة.
        </div>
      )}
    </div>
  );
}

function TransactionDetails({
  transaction,
}: {
  transaction: WalletTransactionDetails;
}) {
  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(340px,0.65fr)]">
      <section className="space-y-3 rounded-[14px] bg-white p-5">
        <SectionTitle>بيانات المعاملة</SectionTitle>
        <DetailRow label="معرف المعاملة" value={transaction.id} valueDir="ltr" />
        <DetailRow label="العنوان" value={transaction.title} />
        <DetailRow
          label="الحالة"
          value={<WalletStatusBadge status={transaction.status} />}
        />
        <DetailRow
          label="الإيداع"
          value={<MoneyValue value={transaction.credit} color="text-green-600" />}
          valueDir="ltr"
        />
        <DetailRow
          label="السحب"
          value={<MoneyValue value={transaction.debit} color="text-red-500" />}
          valueDir="ltr"
        />
        <DetailRow
          label="الرصيد"
          value={<MoneyValue value={transaction.balance} />}
          valueDir="ltr"
        />
        <DetailRow
          label="تاريخ الإنشاء"
          value={formatDate(transaction.created_at)}
          valueDir="ltr"
        />
      </section>

      <div className="space-y-5">
        <section className="space-y-3 rounded-[14px] bg-white p-5">
          <SectionTitle>بيانات المستخدم</SectionTitle>
          <DetailRow
            label="معرف المستخدم"
            value={String(transaction.user_id)}
            valueDir="ltr"
          />
          <DetailRow label="الاسم" value={transaction.user?.name ?? "-"} />
          <DetailRow
            label="رقم الجوال"
            value={
              transaction.user?.mobile
                ? formatSaudiPhoneNumber(transaction.user.mobile)
                : "-"
            }
            valueDir="ltr"
          />
          <DetailRow label="الدور" value={transaction.user?.role ?? "-"} />
          <DetailRow
            label="الحساب البنكي"
            value={transaction.user?.bank_account ?? "-"}
            valueDir="ltr"
          />
        </section>

        <section className="space-y-3 rounded-[14px] bg-white p-5">
          <SectionTitle>المرجع</SectionTitle>
          <DetailRow label="النوع" value={transaction.reference?.type ?? "-"} />
          <DetailRow
            label="المعرف"
            value={transaction.reference?.id ?? "-"}
            valueDir="ltr"
          />
        </section>
      </div>
    </div>
  );
}

function DetailRow({
  label,
  value,
  valueDir,
}: {
  label: string;
  value: ReactNode;
  valueDir?: "ltr" | "rtl";
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-[10px] bg-background px-4 py-3 text-right">
      <span className="shrink-0 text-sm text-gray">{label}</span>
      <span
        dir={valueDir}
        className="min-w-0 break-all text-base font-medium text-secondary"
      >
        {value}
      </span>
    </div>
  );
}

function MoneyValue({ value, color }: { value: number; color?: string }) {
  return <CurrencyMoneyValue value={value} className={color} />;
}

function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <h2 className="text-base font-semibold leading-6 text-secondary">
      {children}
    </h2>
  );
}

function DetailsShimmer() {
  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(340px,0.65fr)]">
      {Array.from({ length: 3 }).map((_, sectionIndex) => (
        <section
          key={sectionIndex}
          className="space-y-3 rounded-[14px] bg-white p-5"
        >
          {Array.from({ length: sectionIndex === 0 ? 7 : 4 }).map(
            (_, rowIndex) => (
              <div
                key={rowIndex}
                className="flex items-center justify-between gap-4 rounded-[10px] bg-background px-4 py-3"
              >
                <Shimmer className="h-4 w-24" />
                <Shimmer className="h-5 w-40" />
              </div>
            ),
          )}
        </section>
      ))}
    </div>
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

export default ViewWalletTransaction;
