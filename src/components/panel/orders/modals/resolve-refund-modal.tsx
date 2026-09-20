"use client";

import { AlertTriangle, Phone, Wallet } from "lucide-react";
import { useState } from "react";
import {
  useForm,
  useWatch,
  type FieldErrors,
  type Resolver,
} from "react-hook-form";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import CurrencyAdornment from "@/components/ui/currency-adornment";
import InputErrorMessage from "@/components/ui/input-error-message";
import Loader from "@/components/ui/loader";
import MoneyValue from "@/components/ui/money-value";
import Modal from "@/components/ui/modal";
import { cn } from "@/lib/utils";
import {
  normalizeNonNegativeNumberInput,
  preventNegativeNumberPaste,
} from "@/lib/utils/non-negative-input";
import { useCurrencyInputPadding } from "@/provider/currency";
import {
  resolveOrderRefundSchema,
  type ResolveOrderRefundValues,
} from "@/schemas";
import { resolveOrderReceiptRefundAPI } from "@/services/mutations";
import type { OrderReceiptItem } from "@/types";

type Props = {
  orderId: string;
  item: OrderReceiptItem | null;
  currency?: string;
  open: boolean;
  onClose: () => void;
  onSaved: () => Promise<void>;
};

const UNKNOWN_OUTCOME_STATUSES = new Set([408, 500, 502, 503, 504]);

function createIdempotencyKey(orderId: string, itemId: string) {
  const suffix =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  return `order-${orderId}-item-${itemId}-${suffix}`;
}

function ResolveRefundModal({
  orderId,
  item,
  currency,
  open,
  onClose,
  onSaved,
}: Props) {
  const currencyInputPadding = useCurrencyInputPadding();
  const [amountText, setAmountText] = useState("");
  const [outcomeUnknown, setOutcomeUnknown] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [idempotencyKey] = useState(() =>
    createIdempotencyKey(orderId, item?.id ?? "unknown"),
  );
  const {
    register,
    handleSubmit,
    control,
    setError,
    setValue,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ResolveOrderRefundValues>({
    resolver: resolveRefundResolver,
    defaultValues: {
      method: "wallet",
      amount: undefined,
      notes: "",
      confirmed: false,
    },
    mode: "onChange",
  });

  const method = useWatch({ control, name: "method" });
  const displayCurrency = item?.refund_currency ?? currency;
  const refundableAmount =
    item?.refundable_amount ?? item?.remaining_refundable_amount;

  function handleClose() {
    if (isSubmitting || isRefreshing) return;
    reset();
    setAmountText("");
    onClose();
  }

  async function refreshStatus() {
    setIsRefreshing(true);
    await onSaved();
    setIsRefreshing(false);
    onClose();
  }

  async function submit(values: ResolveOrderRefundValues) {
    if (!item || outcomeUnknown) return;

    if (
      values.method === "wallet" &&
      refundableAmount != null &&
      (values.amount ?? 0) > refundableAmount
    ) {
      setError("amount", {
        type: "max",
        message: "المبلغ يتجاوز القيمة المتاحة للاسترداد",
      });
      return;
    }

    const payload =
      values.method === "wallet"
        ? {
            method: "wallet" as const,
            amount: values.amount ?? 0,
            notes: values.notes,
            currency: displayCurrency,
          }
        : {
            method: "contact" as const,
            notes: values.notes,
            currency: displayCurrency,
          };

    const result = await resolveOrderReceiptRefundAPI(
      orderId,
      item.id,
      payload,
      idempotencyKey,
    );

    if (result?.ok) {
      toast.success(result.message || "تم إرسال قرار الاسترداد بنجاح");
      reset();
      setAmountText("");
      await onSaved();
      onClose();
      return;
    }

    if (result && UNKNOWN_OUTCOME_STATUSES.has(result.status)) {
      setOutcomeUnknown(true);
      toast.error("تعذر تأكيد نتيجة الطلب. تحقق من الحالة قبل أي محاولة أخرى.");
      return;
    }

    toast.error(result?.message || "فشل إرسال قرار الاسترداد");
  }

  if (!item) return null;

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={`حل استرداد ${item.vehicle.label ?? "المركبة"}`}
      description="تُعتمد القيم النهائية وحالة الاسترداد من الخادم ومزود الدفع."
      contentClassName="max-w-lg"
    >
      <form onSubmit={handleSubmit(submit)} noValidate className="space-y-4 p-1">
        <RefundSummary item={item} currency={displayCurrency} />

        {outcomeUnknown ? (
          <div className="rounded-[12px] border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
            <div className="flex items-start gap-2">
              <AlertTriangle className="mt-0.5 size-4 shrink-0" />
              <p>
                نتيجة العملية غير معروفة. تم إيقاف إعادة الإرسال لتجنب تكرار
                الاسترداد. حدّث الحالة أولاً.
              </p>
            </div>
          </div>
        ) : null}

        <div className="grid grid-cols-2 gap-3">
          <MethodButton
            icon={Wallet}
            label="محفظة"
            active={method === "wallet"}
            disabled={outcomeUnknown}
            onClick={() => setValue("method", "wallet", { shouldValidate: true })}
          />
          <MethodButton
            icon={Phone}
            label="تواصل مباشر"
            active={method === "contact"}
            disabled={outcomeUnknown}
            onClick={() => setValue("method", "contact", { shouldValidate: true })}
          />
        </div>

        {method === "wallet" ? (
          <label className="block">
            <span className="mb-2 flex items-center justify-between gap-2 text-sm text-dark-gray">
              <span>مبلغ الاسترداد</span>
              {refundableAmount != null ? (
                <span className="text-xs text-gray">
                  المتاح: <MoneyValue value={refundableAmount} currency={displayCurrency} />
                </span>
              ) : null}
            </span>
            <div className="relative">
              <input
                type="text"
                inputMode="decimal"
                value={amountText}
                disabled={outcomeUnknown}
                aria-invalid={Boolean(errors.amount)}
                onChange={(event) => {
                  const normalized = normalizeNonNegativeNumberInput(
                    event.target.value,
                    { allowDecimal: true },
                  );
                  setAmountText(normalized);
                  const numeric = Number(normalized);
                  setValue(
                    "amount",
                    normalized === "" || Number.isNaN(numeric) ? undefined : numeric,
                    { shouldValidate: true, shouldDirty: true },
                  );
                }}
                onPaste={(event) =>
                  preventNegativeNumberPaste(event, { allowDecimal: true })
                }
                className={cn(
                  "h-12 w-full rounded-[14px] border border-primary bg-primary/4 text-left outline-none disabled:cursor-not-allowed disabled:opacity-60",
                  currencyInputPadding,
                )}
                dir="ltr"
              />
              <CurrencyAdornment absolute className="text-xs text-primary" />
            </div>
            <InputErrorMessage msg={errors.amount?.message} />
          </label>
        ) : null}

        <label className="block">
          <span className="mb-2 block text-sm text-dark-gray">سبب الاسترداد</span>
          <textarea
            {...register("notes")}
            disabled={outcomeUnknown}
            placeholder="اكتب سبب الاسترداد"
            aria-invalid={Boolean(errors.notes)}
            className="h-24 w-full resize-none rounded-[14px] border border-primary bg-primary/4 p-3 outline-none disabled:cursor-not-allowed disabled:opacity-60"
          />
          <InputErrorMessage msg={errors.notes?.message} />
        </label>

        <label className="flex cursor-pointer items-start gap-2 rounded-[12px] bg-neutral-50 p-3 text-sm text-dark-gray">
          <input
            type="checkbox"
            {...register("confirmed")}
            disabled={outcomeUnknown}
            className="mt-0.5 size-4 accent-primary"
          />
          <span>
            أؤكد مراجعة المبلغ والعملة، وأفهم أن هذا الإجراء قد ينفذ عملية مالية.
            <InputErrorMessage msg={errors.confirmed?.message} />
          </span>
        </label>

        {item.correlation_id || item.refund_id || item.provider_refund_id ? (
          <RefundReferences item={item} />
        ) : null}

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting || isRefreshing}
          >
            إلغاء
          </Button>
          {outcomeUnknown ? (
            <Button
              type="button"
              onClick={refreshStatus}
              disabled={isRefreshing}
              className="min-w-28 bg-primary text-secondary hover:bg-primary/90"
            >
              {isRefreshing ? <Loader borderColor="#1f2937" /> : "تحديث الحالة"}
            </Button>
          ) : (
            <Button
              type="submit"
              disabled={isSubmitting}
              className="min-w-28 bg-primary text-secondary hover:bg-primary/90"
            >
              {isSubmitting ? <Loader borderColor="#1f2937" /> : "تأكيد وإرسال"}
            </Button>
          )}
        </div>
      </form>
    </Modal>
  );
}

function RefundSummary({
  item,
  currency,
}: {
  item: OrderReceiptItem;
  currency?: string;
}) {
  const values = [
    { label: "المدفوع", value: item.total_paid },
    { label: "تم استرداده", value: item.refunded_amount },
    { label: "قيد الاسترداد", value: item.pending_refund_amount },
    {
      label: "المتاح",
      value: item.refundable_amount ?? item.remaining_refundable_amount,
    },
  ].filter((entry) => entry.value != null);

  if (!values.length) return null;

  return (
    <div className="grid grid-cols-2 gap-2 rounded-[12px] bg-neutral-50 p-3 sm:grid-cols-4">
      {values.map((entry) => (
        <div key={entry.label} className="min-w-0">
          <div className="text-xs text-gray">{entry.label}</div>
          <MoneyValue
            value={entry.value}
            currency={currency}
            className="mt-1 text-sm font-semibold text-secondary"
          />
        </div>
      ))}
    </div>
  );
}

function RefundReferences({ item }: { item: OrderReceiptItem }) {
  return (
    <dl className="space-y-1 rounded-[12px] border border-neutral-200 p-3 text-xs">
      {item.refund_id ? <Reference label="رقم الاسترداد" value={item.refund_id} /> : null}
      {item.provider_refund_id ? (
        <Reference label="مرجع مزود الدفع" value={item.provider_refund_id} />
      ) : null}
      {item.correlation_id ? (
        <Reference label="معرف التتبع" value={item.correlation_id} />
      ) : null}
    </dl>
  );
}

function Reference({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <dt className="shrink-0 text-gray">{label}</dt>
      <dd className="break-all text-left font-mono text-secondary" dir="ltr">
        {value}
      </dd>
    </div>
  );
}

function MethodButton({
  icon: Icon,
  label,
  active,
  disabled,
  onClick,
}: {
  icon: typeof Wallet;
  label: string;
  active: boolean;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "flex h-12 items-center justify-center gap-2 rounded-[14px] border text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-60",
        active
          ? "border-primary bg-primary/10 text-secondary"
          : "border-neutral-200 text-gray hover:bg-neutral-50",
      )}
    >
      <Icon className="size-4 shrink-0" />
      {label}
    </button>
  );
}

const resolveRefundResolver: Resolver<ResolveOrderRefundValues> = async (values) => {
  const result = resolveOrderRefundSchema.safeParse(values);
  if (result.success) return { values: result.data, errors: {} };

  const errors: FieldErrors<ResolveOrderRefundValues> = {};
  for (const issue of result.error.issues) {
    const field = issue.path[0] as keyof ResolveOrderRefundValues;
    if (!errors[field]) {
      errors[field] = { type: issue.code, message: issue.message };
    }
  }

  return { values: {}, errors };
};

export default ResolveRefundModal;
