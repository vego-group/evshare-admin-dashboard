"use client";

import type { ReactNode } from "react";

import Panel from "@/components/ui/panel";
import Shimmer from "@/components/ui/shimmer";
import { usePaymentCheckout, usePaymentTransaction } from "@/hooks/api";
import { formatSaudiPhoneNumber } from "@/lib/utils/format-phone";
import type {
  PaymentCheckout,
  PaymentGatewayTab,
  PaymentTransaction,
} from "@/types";

import {
  formatDate,
  formatGateway,
  formatPayableType,
  formatPaymentMethod,
  MoneyValue,
} from "../utils";
import { ProcessedBadge, TransactionStatusBadge } from "../table/status-badges";

type PaymentGatewayDetailsPanelProps = {
  activeTab: PaymentGatewayTab;
  checkoutId: string | null;
  transactionId: string | null;
  open: boolean;
  onClose: () => void;
};

function PaymentGatewayDetailsPanel({
  activeTab,
  checkoutId,
  transactionId,
  open,
  onClose,
}: PaymentGatewayDetailsPanelProps) {
  const checkoutQuery = usePaymentCheckout(checkoutId);
  const transactionQuery = usePaymentTransaction(transactionId);
  const isCheckout = activeTab === "checkouts";
  const isLoading = isCheckout
    ? checkoutQuery.isLoading
    : transactionQuery.isLoading;
  const checkout = checkoutQuery.data?.data;
  const transaction = transactionQuery.data?.data;

  if (!checkoutId && !transactionId) return null;

  return (
    <Panel
      open={open}
      onClose={onClose}
      contentClassName="w-full gap-0 overflow-hidden bg-white p-0 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] sm:rounded-l-3xl sm:border-l-0"
      headerClassName="relative h-[101px] shrink-0 border-b border-gray/20 px-6 py-6 text-right"
      title={isCheckout ? "تفاصيل عملية التحقق" : "تفاصيل المعاملة"}
      titleClassName="text-2xl font-medium leading-8 text-secondary"
    >
      <div className="flex h-full min-h-0 flex-col text-right">
        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6">
          {isLoading ? (
            <DetailsShimmer />
          ) : isCheckout && checkout ? (
            <CheckoutDetails checkout={checkout} />
          ) : !isCheckout && transaction ? (
            <TransactionDetails transaction={transaction} />
          ) : (
            <div className="flex h-full min-h-80 items-center justify-center rounded-[14px] bg-background px-4 text-center text-base text-gray">
              تعذر تحميل التفاصيل.
            </div>
          )}
        </div>
      </div>
    </Panel>
  );
}

function CheckoutDetails({ checkout }: { checkout: PaymentCheckout }) {
  return (
    <div className="space-y-6">
      <section className="space-y-4 rounded-[14px] bg-background p-5">
        <DetailRow label="رقم العملية" value={checkout.id} valueDir="ltr" />
        <DetailRow
          label="المبلغ"
          value={<MoneyValue amount={checkout.amount} />}
          valueDir="ltr"
        />
        <DetailRow
          label="بوابة الدفع"
          value={formatGateway(checkout.payment_gateway)}
        />
        <DetailRow
          label="حالة المعالجة"
          value={<ProcessedBadge isProcessed={checkout.is_processed} />}
        />
        <DetailRow
          label="تاريخ الإنشاء"
          value={formatDate(checkout.created_at)}
          valueDir="ltr"
        />
        <DetailRow
          label="آخر تحديث"
          value={formatDate(checkout.updated_at)}
          valueDir="ltr"
        />
      </section>

      <section className="space-y-4 rounded-[14px] bg-background p-5">
        <PanelSectionTitle>بيانات المستخدم</PanelSectionTitle>
        <DetailRow label="الاسم" value={checkout.user?.name ?? "-"} />
        <DetailRow
          label="رقم الجوال"
          value={
            checkout.user?.mobile
              ? formatSaudiPhoneNumber(checkout.user.mobile)
              : "-"
          }
          valueDir="ltr"
        />
        <DetailRow
          label="معرف المستخدم"
          value={checkout.user?.id ?? "-"}
          valueDir="ltr"
        />
      </section>

      <section className="space-y-4 rounded-[14px] bg-background p-5">
        <PanelSectionTitle>المرجع</PanelSectionTitle>
        <DetailRow
          label="النوع"
          value={formatPayableType(checkout.payable?.type)}
        />
        <DetailRow
          label="المعرف"
          value={checkout.payable?.uuid ?? checkout.payable?.id ?? "-"}
          valueDir="ltr"
        />
      </section>

      <JsonBlock title="بيانات الطلب" value={checkout.request_body} />
    </div>
  );
}

function TransactionDetails({
  transaction,
}: {
  transaction: PaymentTransaction;
}) {
  return (
    <div className="space-y-6">
      <section className="space-y-4 rounded-[14px] bg-background p-5">
        <DetailRow label="معرف السجل" value={transaction.id} valueDir="ltr" />
        <DetailRow
          label="رقم المعاملة"
          value={transaction.transaction_id}
          valueDir="ltr"
        />
        <DetailRow
          label="المبلغ"
          value={<MoneyValue amount={transaction.amount} />}
          valueDir="ltr"
        />
        <DetailRow
          label="بوابة الدفع"
          value={formatGateway(transaction.payment_gateway)}
        />
        <DetailRow
          label="طريقة الدفع"
          value={formatPaymentMethod(transaction)}
        />
        <DetailRow
          label="الحالة"
          value={<TransactionStatusBadge status={transaction.status} />}
        />
        <DetailRow
          label="تاريخ الإنشاء"
          value={formatDate(transaction.created_at)}
          valueDir="ltr"
        />
        <DetailRow
          label="آخر تحديث"
          value={formatDate(transaction.updated_at)}
          valueDir="ltr"
        />
      </section>

      <JsonBlock
        title="استجابة بوابة الدفع"
        value={transaction.transaction_response}
      />
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
    <div className="flex items-center justify-between gap-4 rounded-[10px] bg-white px-4 py-3">
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

function PanelSectionTitle({ children }: { children: ReactNode }) {
  return (
    <h3 className="text-base font-semibold leading-6 text-secondary">
      {children}
    </h3>
  );
}

function JsonBlock({
  title,
  value,
}: {
  title: string;
  value: Record<string, unknown> | null;
}) {
  if (!value || !Object.keys(value).length) return null;

  return (
    <section className="space-y-4 rounded-[14px] bg-background p-5">
      <PanelSectionTitle>{title}</PanelSectionTitle>
      <pre
        dir="ltr"
        className="max-h-72 overflow-auto rounded-[10px] bg-white p-4 text-left text-xs leading-5 text-secondary"
      >
        {JSON.stringify(value, null, 2)}
      </pre>
    </section>
  );
}

function DetailsShimmer() {
  return (
    <div className="space-y-6">
      <section className="space-y-4 rounded-[14px] bg-background p-5">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="flex items-center justify-between gap-4 rounded-[10px] bg-white px-4 py-3"
          >
            <Shimmer className="h-4 w-24" />
            <Shimmer className="h-5 w-40" />
          </div>
        ))}
      </section>
    </div>
  );
}

export default PaymentGatewayDetailsPanel;
