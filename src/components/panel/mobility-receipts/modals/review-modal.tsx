"use client";

import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import toast from "react-hot-toast";

import Modal from "@/components/ui/modal";
import type { MobilityReceiptReviewValues } from "@/schemas/mobility-receipts";
import { reviewMobilityReceiptAPI } from "@/services/mutations";
import type { MobilityReceipt } from "@/types";
import AttachmentLink from "../results/attachment-link";
import {
  buildReviewPayload,
  getReceiptAttachments,
  receiptReviewResolver,
  receiptTitle,
  reviewDefaults,
} from "../utils";
import ReceiptFormActions from "./form-actions";
import ReceiptFormField from "./form-field";
import ReviewStatusDropdown from "./review-status-dropdown";

type Props = {
  open: boolean;
  receipt: MobilityReceipt | null;
  onClose: () => void;
  onSaved: () => Promise<void>;
};

function ReviewReceiptModal({ open, receipt, onClose, onSaved }: Props) {
  const form = useForm<MobilityReceiptReviewValues>({
    resolver: receiptReviewResolver,
    defaultValues: reviewDefaults(receipt),
    mode: "onChange",
  });
  const status = useWatch({ control: form.control, name: "status" });

  useEffect(() => {
    if (open) form.reset(reviewDefaults(receipt));
  }, [form, open, receipt]);

  const close = (force = false) => {
    if (form.formState.isSubmitting && !force) return;
    form.reset(reviewDefaults(receipt));
    onClose();
  };

  const submit = async (values: MobilityReceiptReviewValues) => {
    if (!receipt || !form.formState.isDirty) return;
    const payload = buildReviewPayload(values, form.formState.dirtyFields);
    if (!payload) return;
    const result = await reviewMobilityReceiptAPI(receipt.id, payload);
    if (!result?.ok) {
      toast.error(result?.message || "فشلت مراجعة العقد");
      return;
    }
    toast.success(result.message || "تمت مراجعة العقد");
    close(true);
    await onSaved();
  };

  if (!receipt) return null;

  return (
    <Modal open={open} onClose={close} title={`مراجعة سند ${receiptTitle(receipt)}`} contentClassName="max-w-xl">
      <form onSubmit={form.handleSubmit(submit)} className="space-y-5 p-1">
        <Attachments receipt={receipt} />
        <ReceiptFormField label="قرار المراجعة" error={form.formState.errors.status?.message}>
          <ReviewStatusDropdown
            value={status}
            onChange={(value) =>
              form.setValue("status", value, {
                shouldDirty: true,
                shouldValidate: true,
              })
            }
          />
        </ReceiptFormField>
        {status === "rejected" && (
          <ReceiptFormField label="سبب الرفض" error={form.formState.errors.rejection_reason?.message}>
            <textarea {...form.register("rejection_reason")} className="min-h-28 w-full resize-none rounded-[14px] border border-primary bg-white p-3 text-sm text-secondary outline-none" />
          </ReceiptFormField>
        )}
        <ReceiptFormActions isDirty={form.formState.isDirty} isSubmitting={form.formState.isSubmitting} submitLabel="حفظ المراجعة" onClose={close} />
      </form>
    </Modal>
  );
}

function Attachments({ receipt }: { receipt: MobilityReceipt }) {
  const attachments = getReceiptAttachments(receipt);
  return (
    <section className="rounded-[14px] bg-primary/5 p-3">
      <p className="mb-2 text-sm font-medium text-secondary">المرفقات</p>
      {attachments.length ? attachments.map((attachment, index) => (
        <AttachmentLink key={index} attachment={attachment} index={index} />
      )) : <p className="text-sm text-gray">لا توجد مرفقات</p>}
    </section>
  );
}

export default ReviewReceiptModal;
