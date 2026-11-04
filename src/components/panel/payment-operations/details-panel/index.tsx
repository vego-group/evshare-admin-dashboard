"use client";

import type { ReactNode } from "react";

import Panel from "@/components/ui/panel";
import Shimmer from "@/components/ui/shimmer";
import { usePaymentCheckout, usePaymentTransaction } from "@/hooks/api";
import { formatUserMobile } from "@/lib/utils/format-phone";
import type { PaymentCheckout, PaymentOperationTab, PaymentTransaction } from "@/types";

import {
  describePayable,
  formatDate,
  formatGateway,
  formatPaymentMethod,
  getTransactionCurrency,
  getTransactionEventDate,
  hasRefundData,
  merchantAnalyticsReconciliation,
  MoneyValue,
} from "../utils";
import { ProcessedBadge, TransactionStatusBadge } from "../table/status-badges";

type Props = { activeTab: PaymentOperationTab; checkoutId: string | null; transactionId: string | null; open: boolean; onClose: () => void };

export default function PaymentOperationDetailsPanel({ activeTab, checkoutId, transactionId, open, onClose }: Props) {
  const checkoutQuery = usePaymentCheckout(checkoutId);
  const transactionQuery = usePaymentTransaction(transactionId);
  const checkout = checkoutQuery.data?.data;
  const transaction = transactionQuery.data?.data;
  if (!checkoutId && !transactionId) return null;
  const isCheckout = activeTab === "checkouts";
  return (
    <Panel open={open} onClose={onClose} contentClassName="w-[min(100vw,44rem)]! max-w-none! gap-0 overflow-hidden bg-white p-0 shadow-xl sm:rounded-l-3xl sm:border-l-0"
      headerClassName="relative min-h-[101px] shrink-0 border-b border-gray/20 px-6 py-6 pl-16 text-right"
      title={isCheckout ? "تفاصيل عملية التحقق" : "تفاصيل المعاملة"} titleClassName="text-2xl font-medium leading-8 text-secondary">
      <div className="h-full min-h-0 overflow-y-auto px-6 py-6 text-right">
        {(isCheckout ? checkoutQuery.isLoading : transactionQuery.isLoading) ? <DetailsShimmer />
          : isCheckout && checkout ? <CheckoutDetails checkout={checkout} />
          : !isCheckout && transaction ? <TransactionDetails transaction={transaction} />
          : <div className="flex min-h-80 items-center justify-center rounded-[14px] bg-background text-gray">تعذر تحميل التفاصيل.</div>}
      </div>
    </Panel>
  );
}

function CheckoutDetails({ checkout }: { checkout: PaymentCheckout }) {
  const payable = describePayable(checkout.payable);

  return <div className="space-y-6">
    <Section title="بيانات الدفع">
      <Row label="رقم العملية" value={checkout.id} ltr />
      <Row label="مرجع الدفع" value={checkout.reference ?? "-"} ltr />
      <Row label="المبلغ" value={<MoneyValue amount={checkout.amount} currency={checkout.currency} />} ltr />
      <Row label="بوابة الدفع" value={formatGateway(checkout.payment_gateway, checkout.payment_gateway_name)} />
      <Row label="طريقة الدفع" value={formatPaymentMethod(checkout)} />
      <Row label="المعالجة" value={<ProcessedBadge isProcessed={checkout.is_processed} />} />
      <Row label="تاريخ الإنشاء" value={formatDate(checkout.created_at)} ltr />
      {checkout.updated_at ? <Row label="آخر تحديث" value={formatDate(checkout.updated_at)} ltr /> : null}
    </Section>
    <Section title="المستخدم">
      <Row label="الاسم" value={checkout.user?.name ?? "-"} />
      <Row label="رقم الجوال" value={formatUserMobile(checkout.user?.mobile)} ltr />
      <Row label="معرف المستخدم" value={checkout.user?.id ?? "-"} ltr />
    </Section>
    <Section title="المرجع">
      {payable.isMissing ? <MissingReferenceNotice /> : null}
      <Row label="النوع" value={payable.type} />
      <Row label="المعرف" value={payable.identifier} ltr />
    </Section>
    <CheckoutTransactions transactions={checkout.transactions} currency={checkout.currency} />
    <JsonBlock title="بيانات طلب الدفع" value={checkout.request_body} />
  </div>;
}

function TransactionDetails({ transaction }: { transaction: PaymentTransaction }) {
  const checkout = transaction.checkout;
  const user = transaction.user ?? checkout?.user;
  const payable = describePayable(checkout?.payable);
  const analytics = merchantAnalyticsReconciliation(transaction);

  return <div className="space-y-6">
    <Section title="بيانات الدفع">
      <Row label="معرف السجل" value={transaction.id} ltr />
      <Row label="رقم المعاملة" value={transaction.transaction_id} ltr />
      <Row label="مرجع الدفع" value={transaction.reference ?? "-"} ltr />
      <Row label="المبلغ" value={<MoneyValue amount={transaction.amount} currency={getTransactionCurrency(transaction)} />} ltr />
      <Row label="بوابة الدفع" value={formatGateway(transaction.payment_gateway, transaction.payment_gateway_name)} />
      <Row label="طريقة الدفع" value={formatPaymentMethod(transaction)} />
      <Row label="الحالة" value={<TransactionStatusBadge status={transaction.status} />} />
      <Row label="تاريخ العملية" value={formatDate(getTransactionEventDate(transaction))} ltr />
      {transaction.updated_at ? <Row label="آخر تحديث" value={formatDate(transaction.updated_at)} ltr /> : null}
      <Row
        label="تحليلات التاجر"
        value={
          <span>
            <span className={analytics.state === "candidate" ? "text-emerald-700" : analytics.state === "excluded" ? "text-red-700" : "text-amber-700"}>
              {analytics.label}
            </span>
            <span className="mt-1 block max-w-80 text-xs font-normal leading-5 text-gray">
              {analytics.description}
            </span>
          </span>
        }
      />
    </Section>
    <Section title="المستخدم">
      <Row label="الاسم" value={user?.name ?? "-"} />
      <Row label="رقم الجوال" value={formatUserMobile(user?.mobile)} ltr />
      <Row label="معرف المستخدم" value={user?.id ?? "-"} ltr />
    </Section>
    {checkout ? <Section title="عملية التحقق المرتبطة">
      <Row label="معرف عملية التحقق" value={checkout.id} ltr />
      <Row label="المبلغ" value={<MoneyValue amount={checkout.amount} currency={checkout.currency} />} ltr />
      <Row label="حالة المعالجة" value={<ProcessedBadge isProcessed={checkout.is_processed} />} />
      {payable.isMissing ? <MissingReferenceNotice /> : null}
      <Row label="نوع المرجع" value={payable.type} />
      <Row label="معرف المرجع" value={payable.identifier} ltr />
    </Section> : null}
    {hasRefundData(transaction) ? <Section title="الاسترداد">
      <Row label="الحالة" value={transaction.refund_in_progress ? "قيد تأكيد مزود الدفع" : refundStatusLabel(transaction.refund_status)} />
      <Row label="المبلغ المسترد" value={<MoneyValue amount={transaction.refunded_amount ?? 0} currency={getTransactionCurrency(transaction)} />} ltr />
      <Row label="المبلغ المتبقي" value={<MoneyValue amount={transaction.remaining_refundable_amount ?? transaction.amount} currency={getTransactionCurrency(transaction)} />} ltr />
      {transaction.refund ? <>
        <Row label="مرجع الاسترداد" value={transaction.refund.reference} ltr />
        <Row label="مرجع المزود" value={transaction.refund.provider_refund_reference ?? "-"} ltr />
        <Row label="السبب" value={transaction.refund.reason ?? "-"} />
        <Row label="تم بواسطة" value={transaction.refund.refunded_by?.name ?? "-"} />
        <Row label="تاريخ الاسترداد" value={formatDate(transaction.refund.refunded_at)} ltr />
      </> : null}
    </Section> : null}
    <JsonBlock title="استجابة بوابة الدفع" value={transaction.transaction_response} />
  </div>;
}

function refundStatusLabel(status?: PaymentTransaction["refund_status"]) {
  return status === "refunded" ? "مسترد بالكامل" : status === "partially_refunded" ? "مسترد جزئياً" : "لا يوجد";
}

function CheckoutTransactions({
  transactions,
  currency,
}: {
  transactions: PaymentCheckout["transactions"];
  currency: string;
}) {
  if (!transactions.length) return null;

  return (
    <Section title={`محاولات الدفع (${transactions.length})`}>
      <div className="space-y-3">
        {transactions.map((transaction) => {
          if (typeof transaction === "string") {
            return <Row key={transaction} label="معرف المعاملة" value={transaction} ltr />;
          }

          return (
            <article key={transaction.id} className="rounded-[10px] bg-white px-4 py-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <p dir="ltr" className="truncate text-left text-sm font-semibold text-secondary">
                    {transaction.transaction_id}
                  </p>
                  <p dir="ltr" className="mt-1 text-left text-xs text-gray">
                    {formatDate(transaction.created_at)}
                  </p>
                </div>
                <TransactionStatusBadge status={transaction.status} />
              </div>
              <div className="mt-3 border-t border-border-subtle pt-3 text-sm font-medium text-secondary">
                <MoneyValue amount={transaction.amount} currency={transaction.currency ?? currency} />
              </div>
            </article>
          );
        })}
      </div>
    </Section>
  );
}

function MissingReferenceNotice() {
  return (
    <p className="rounded-[10px] border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-800" role="status">
      السجل المرتبط لم يعد متاحاً. تبقى عملية الدفع وسجلها المالي صالحين للعرض والمراجعة.
    </p>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return <section className="space-y-4 rounded-[14px] bg-background p-5"><h3 className="text-base font-semibold text-secondary">{title}</h3>{children}</section>;
}

function Row({ label, value, ltr }: { label: string; value: ReactNode; ltr?: boolean }) {
  return <div className="flex items-center justify-between gap-4 rounded-[10px] bg-white px-4 py-3"><span className="shrink-0 text-sm text-gray">{label}</span><span dir={ltr ? "ltr" : undefined} className="min-w-0 break-all text-base font-medium text-secondary">{value}</span></div>;
}

function JsonBlock({ title, value }: { title: string; value?: Record<string, unknown> | null }) {
  if (!value || !Object.keys(value).length) return null;
  return <section className="space-y-4 rounded-[14px] bg-background p-5">
    <h3 className="text-base font-semibold text-secondary">{title}</h3>
    <pre dir="ltr" className="max-h-80 overflow-auto rounded-[10px] bg-white p-4 text-left text-xs leading-5 text-secondary">
      {JSON.stringify(value, null, 2)}
    </pre>
  </section>;
}

function DetailsShimmer() {
  return <section className="space-y-4 rounded-[14px] bg-background p-5">{Array.from({ length: 7 }).map((_, index) => <div key={index} className="flex justify-between rounded-[10px] bg-white px-4 py-3"><Shimmer className="h-4 w-24" /><Shimmer className="h-5 w-40" /></div>)}</section>;
}
