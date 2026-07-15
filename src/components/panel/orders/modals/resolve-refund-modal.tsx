"use client";

import { Wallet, Phone } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm, type FieldErrors, type Resolver } from "react-hook-form";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import InputErrorMessage from "@/components/ui/input-error-message";
import Loader from "@/components/ui/loader";
import Modal from "@/components/ui/modal";
import { cn } from "@/lib/utils";
import {
  normalizeNonNegativeNumberInput,
  preventNegativeNumberPaste,
} from "@/lib/utils/non-negative-input";
import {
  resolveOrderRefundSchema,
  type ResolveOrderRefundValues,
} from "@/schemas";
import { resolveOrderReceiptRefundAPI } from "@/services/mutations";
import type { OrderReceiptItem } from "@/types";

type Props = {
  orderId: string;
  item: OrderReceiptItem | null;
  open: boolean;
  onClose: () => void;
  onSaved: () => Promise<void>;
};

function ResolveRefundModal({ orderId, item, open, onClose, onSaved }: Props) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ResolveOrderRefundValues>({
    resolver: resolveRefundResolver,
    defaultValues: { method: "wallet", amount: undefined, notes: "" },
    mode: "onChange",
  });

  const method = watch("method");
  const [amountText, setAmountText] = useState("");

  useEffect(() => {
    if (!open) setAmountText("");
  }, [open]);

  function handleClose() {
    if (isSubmitting) return;
    reset();
    setAmountText("");
    onClose();
  }

  async function submit(values: ResolveOrderRefundValues) {
    if (!item) return;

    const payload =
      values.method === "wallet"
        ? { method: "wallet" as const, amount: values.amount ?? 0, notes: values.notes }
        : { method: "contact" as const, notes: values.notes };

    const result = await resolveOrderReceiptRefundAPI(orderId, item.id, payload);
    if (result?.ok) {
      toast.success(result.message || "تم حل الاسترداد بنجاح");
      reset();
      setAmountText("");
      await onSaved();
      onClose();
      return;
    }
    toast.error(result?.message || "فشل حل الاسترداد");
  }

  if (!item) return null;

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={`حل استرداد ${item.vehicle.label ?? "المركبة"}`}
      contentClassName="max-w-md"
    >
      <form onSubmit={handleSubmit(submit)} noValidate className="space-y-4 p-1">
        <div className="grid grid-cols-2 gap-3">
          <MethodButton
            icon={Wallet}
            label="محفظة"
            active={method === "wallet"}
            onClick={() => setValue("method", "wallet", { shouldValidate: true })}
          />
          <MethodButton
            icon={Phone}
            label="تواصل مباشر"
            active={method === "contact"}
            onClick={() => setValue("method", "contact", { shouldValidate: true })}
          />
        </div>

        {method === "wallet" ? (
          <label className="block">
            <span className="mb-2 block text-sm text-dark-gray">المبلغ</span>
            <input
              type="text"
              inputMode="decimal"
              value={amountText}
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
              className="h-12 w-full rounded-[14px] border border-primary bg-primary/4 px-3 text-left outline-none"
              dir="ltr"
            />
            <InputErrorMessage msg={errors.amount?.message} />
          </label>
        ) : null}

        <label className="block">
          <span className="mb-2 block text-sm text-dark-gray">ملاحظات</span>
          <textarea
            {...register("notes")}
            placeholder="اكتب ملاحظات الحل (اختياري)"
            className="h-24 w-full resize-none rounded-[14px] border border-primary bg-primary/4 p-3 outline-none"
          />
          <InputErrorMessage msg={errors.notes?.message} />
        </label>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={handleClose} disabled={isSubmitting}>
            إلغاء
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="min-w-24 bg-primary text-secondary hover:bg-primary/90"
          >
            {isSubmitting ? <Loader borderColor="#1f2937" /> : "حفظ"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

function MethodButton({
  icon: Icon,
  label,
  active,
  onClick,
}: {
  icon: typeof Wallet;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex h-12 items-center justify-center gap-2 rounded-[14px] border text-sm font-medium transition",
        active
          ? "border-primary bg-primary/10 text-secondary"
          : "border-neutral-200 text-gray hover:bg-neutral-50",
      )}
    >
      <Icon className="size-4" />
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
