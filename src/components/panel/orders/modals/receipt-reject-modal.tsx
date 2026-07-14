"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import Loader from "@/components/ui/loader";
import Modal from "@/components/ui/modal";

type Props = {
  open: boolean;
  isSubmitting: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
};

function ReceiptRejectModal({ open, isSubmitting, onClose, onConfirm }: Props) {
  const [reason, setReason] = useState("");
  const trimmedReason = reason.trim();

  function handleClose() {
    if (isSubmitting) return;
    setReason("");
    onClose();
  }

  function handleConfirm() {
    if (!trimmedReason || isSubmitting) return;
    onConfirm(trimmedReason);
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="رفض سند الاستلام"
      contentClassName="max-w-md"
    >
      <div className="space-y-4 p-1">
        <div className="space-y-2 text-right">
          <label
            htmlFor="receipt-reject-reason"
            className="block text-sm font-medium leading-5 text-dark-gray"
          >
            سبب الرفض *
          </label>
          <textarea
            id="receipt-reject-reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="يرجى توضيح ما يجب على العميل تصحيحه..."
            className="h-30 w-full resize-none rounded-[14px] border border-border bg-[#f9fafb] px-4 py-3 text-right text-base font-normal leading-6 text-secondary outline-none transition placeholder:text-secondary/50 focus:border-red/60 focus:ring-2 focus:ring-red/15"
          />
        </div>
        <div className="grid w-full grid-cols-2 gap-3">
          <Button
            type="button"
            variant="ghost"
            onClick={handleClose}
            disabled={isSubmitting}
            className="h-12 rounded-[14px] bg-neutral-100 px-4 text-base font-medium text-dark-gray hover:bg-neutral-200"
          >
            إلغاء
          </Button>
          <Button
            type="button"
            disabled={!trimmedReason || isSubmitting}
            onClick={handleConfirm}
            className="h-12 rounded-[14px] bg-danger px-4 text-base font-medium text-white hover:bg-danger/90 disabled:opacity-50"
          >
            {isSubmitting ? <Loader /> : "تأكيد الرفض"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default ReceiptRejectModal;
