"use client";

import { AlertTriangle } from "lucide-react";
import { useState, type FormEvent } from "react";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import InputErrorMessage from "@/components/ui/input-error-message";
import Loader from "@/components/ui/loader";
import Modal from "@/components/ui/modal";
import MoneyValue from "@/components/ui/money-value";
import { refundPaymentTransactionAPI } from "@/services/mutations";
import type { PaymentTransaction } from "@/types";

type Props = {
  transaction: PaymentTransaction;
  open: boolean;
  onClose: () => void;
  onRefunded: (transaction: PaymentTransaction) => Promise<void> | void;
};

const UNKNOWN_OUTCOME_STATUSES = new Set([408, 500, 502, 503, 504]);

function makeIdempotencyKey(transactionId: string) {
  const suffix = typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  return `transaction-refund-${transactionId}-${suffix}`;
}

export default function PaymentRefundModal({ transaction, open, onClose, onRefunded }: Props) {
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [outcomeUnknown, setOutcomeUnknown] = useState(false);
  const [idempotencyKey, setIdempotencyKey] = useState(() => makeIdempotencyKey(transaction.id));
  const numericAmount = amount === "" ? undefined : Number(amount);
  const invalidAmount = numericAmount !== undefined &&
    (!Number.isFinite(numericAmount) || numericAmount <= 0 || numericAmount > transaction.remaining_refundable_amount);

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!transaction || submitting || outcomeUnknown || !confirmed || invalidAmount) return;
    setSubmitting(true);
    const result = await refundPaymentTransactionAPI(transaction.id, {
      ...(numericAmount === undefined ? {} : { amount: numericAmount }),
      ...(reason.trim() ? { reason: reason.trim() } : {}),
      idempotency_key: idempotencyKey,
    });
    setSubmitting(false);

    if (result.ok && result.data?.data.transaction) {
      await onRefunded(result.data.data.transaction);
      toast.success(result.status === 202 ? "تم إرسال طلب الاسترداد وهو قيد تأكيد مزود الدفع." : result.message || "تم استرداد المعاملة بنجاح.");
      onClose();
      return;
    }
    if (result && UNKNOWN_OUTCOME_STATUSES.has(result.status)) {
      setOutcomeUnknown(true);
      toast.error("تعذر تأكيد نتيجة الاسترداد. حدّث البيانات قبل إعادة المحاولة لتجنب التكرار.");
      return;
    }
    if (result.error?.error_code === "PROVIDER_REFUND_FAILED") {
      setIdempotencyKey(makeIdempotencyKey(transaction.id));
    }
    toast.error(result.message || "فشل طلب الاسترداد.");
  }

  return (
    <Modal open={open} onClose={() => { if (!submitting) onClose(); }} title="استرداد معاملة الدفع"
      description="يمكنك ترك المبلغ فارغاً لاسترداد كامل المبلغ المتبقي." contentClassName="max-w-lg">
      <form onSubmit={submit} className="space-y-4 p-1">
        <div className="grid grid-cols-2 gap-3 rounded-[12px] bg-neutral-50 p-3">
          <div><p className="text-xs text-gray">المبلغ الأصلي</p><MoneyValue value={transaction.amount} currency={transaction.currency} className="mt-1 font-semibold" /></div>
          <div><p className="text-xs text-gray">المتاح للاسترداد</p><MoneyValue value={transaction.remaining_refundable_amount} currency={transaction.currency} className="mt-1 font-semibold" /></div>
        </div>
        {outcomeUnknown ? <div className="flex gap-2 rounded-[12px] border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800"><AlertTriangle className="mt-0.5 size-4 shrink-0" /><p>نتيجة الطلب غير معروفة. أغلق النافذة وحدّث القائمة للتحقق من الحالة.</p></div> : null}
        <label className="block text-sm text-dark-gray">
          <span className="mb-2 block">المبلغ (اختياري)</span>
          <input type="number" min="0.01" step="0.01" max={transaction.remaining_refundable_amount} value={amount}
            disabled={submitting || outcomeUnknown} onChange={(event) => setAmount(event.target.value)}
            className="h-12 w-full rounded-[14px] border border-primary bg-primary/4 px-3 text-left outline-none" dir="ltr" />
          <InputErrorMessage msg={invalidAmount ? "أدخل مبلغاً أكبر من صفر ولا يتجاوز المبلغ المتاح." : undefined} />
        </label>
        <label className="block text-sm text-dark-gray">
          <span className="mb-2 block">سبب الاسترداد (اختياري)</span>
          <textarea maxLength={1000} value={reason} disabled={submitting || outcomeUnknown} onChange={(event) => setReason(event.target.value)}
            className="h-24 w-full resize-none rounded-[14px] border border-primary bg-primary/4 p-3 outline-none" placeholder="مثال: طلب العميل" />
          <span className="mt-1 block text-left text-xs text-gray">{reason.length}/1000</span>
        </label>
        <label className="flex items-start gap-2 rounded-[12px] bg-neutral-50 p-3 text-sm text-dark-gray">
          <input type="checkbox" checked={confirmed} disabled={submitting || outcomeUnknown} onChange={(event) => setConfirmed(event.target.checked)} className="mt-0.5 size-4 accent-primary" />
          <span>أؤكد مراجعة المبلغ، وأفهم أن هذا الإجراء ينفذ عملية مالية.</span>
        </label>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose} disabled={submitting}>إلغاء</Button>
          <Button type="submit" disabled={submitting || outcomeUnknown || !confirmed || invalidAmount} className="min-w-28">
            {submitting ? <Loader borderColor="#1f2937" /> : "تأكيد الاسترداد"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
