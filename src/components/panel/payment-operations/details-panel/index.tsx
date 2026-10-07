"use client";

import type { ReactNode } from "react";

import Panel from "@/components/ui/panel";
import Shimmer from "@/components/ui/shimmer";
import { usePaymentCheckout, usePaymentTransaction } from "@/hooks/api";
import { formatStoredPhone } from "@/lib/utils/format-phone";
import type { PaymentCheckout, PaymentOperationTab, PaymentTransaction } from "@/types";

import { describePayable, formatDate, formatGateway, formatPaymentMethod, MoneyValue } from "../utils";
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
    <Panel open={open} onClose={onClose} contentClassName="w-full gap-0 overflow-hidden bg-white p-0 shadow-xl sm:rounded-l-3xl sm:border-l-0"
      headerClassName="relative h-[101px] shrink-0 border-b border-gray/20 px-6 py-6 text-right"
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
      <Row label="بوابة الدفع" value={formatGateway(checkout.payment_gateway)} />
      <Row label="طريقة الدفع" value={formatPaymentMethod(checkout)} />
      <Row label="المعالجة" value={<ProcessedBadge isProcessed={checkout.is_processed} />} />
    </Section>
    <Section title="المستخدم">
      <Row label="الاسم" value={checkout.user?.name ?? "-"} />
      <Row label="رقم الجوال" value={checkout.user?.mobile ? formatStoredPhone(checkout.user.mobile) : "-"} ltr />
      <Row label="معرف المستخدم" value={checkout.user?.id ?? "-"} ltr />
    </Section>
    <Section title="المرجع">
      {payable.isMissing ? <MissingReferenceNotice /> : null}
      <Row label="النوع" value={payable.type} />
      <Row label="المعرف" value={payable.identifier} ltr />
    </Section>
    <JsonBlock title="بيانات طلب الدفع" value={checkout.request_body} />
  </div>;
}

function TransactionDetails({ transaction }: { transaction: PaymentTransaction }) {
  const checkout = transaction.checkout;
  const user = transaction.user ?? checkout?.user;
  const payable = describePayable(checkout?.payable);

  return <div className="space-y-6">
    <Section title="بيانات الدفع">
      <Row label="معرف السجل" value={transaction.id} ltr />
      <Row label="رقم المعاملة" value={transaction.transaction_id} ltr />
      <Row label="مرجع الدفع" value={transaction.reference ?? "-"} ltr />
      <Row label="المبلغ" value={<MoneyValue amount={transaction.amount} currency={transaction.currency} />} ltr />
      <Row label="بوابة الدفع" value={formatGateway(transaction.payment_gateway)} />
      <Row label="طريقة الدفع" value={formatPaymentMethod(transaction)} />
      <Row label="الحالة" value={<TransactionStatusBadge status={transaction.status} />} />
      <Row label="تاريخ الدفع" value={transaction.paid_at ? formatDate(transaction.paid_at) : "-"} ltr />
    </Section>
    <Section title="المستخدم">
      <Row label="الاسم" value={user?.name ?? "-"} />
      <Row label="رقم الجوال" value={user?.mobile ? formatStoredPhone(user.mobile) : "-"} ltr />
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
    <Section title="الاسترداد">
      <Row label="الحالة" value={transaction.refund_in_progress ? "قيد تأكيد مزود الدفع" : refundStatusLabel(transaction.refund_status)} />
      <Row label="المبلغ المسترد" value={<MoneyValue amount={transaction.refunded_amount} currency={transaction.currency} />} ltr />
      <Row label="المبلغ المتبقي" value={<MoneyValue amount={transaction.remaining_refundable_amount} currency={transaction.currency} />} ltr />
      {transaction.refund ? <>
        <Row label="مرجع الاسترداد" value={transaction.refund.reference} ltr />
        <Row label="مرجع المزود" value={transaction.refund.provider_refund_reference ?? "-"} ltr />
        <Row label="السبب" value={transaction.refund.reason ?? "-"} />
        <Row label="تم بواسطة" value={transaction.refund.refunded_by?.name ?? "-"} />
        <Row label="تاريخ الاسترداد" value={formatDate(transaction.refund.refunded_at)} ltr />
      </> : null}
    </Section>
    <JsonBlock title="استجابة بوابة الدفع" value={transaction.transaction_response} />
  </div>;
}

function refundStatusLabel(status: PaymentTransaction["refund_status"]) {
  return status === "refunded" ? "مسترد بالكامل" : status === "partially_refunded" ? "مسترد جزئياً" : "لا يوجد";
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
