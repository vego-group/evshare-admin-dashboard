"use client";

import { useState } from "react";

import Modal from "@/components/ui/modal";

import RejectOrderActions from "./reject-order-actions";
import RejectOrderModalHeader from "./reject-order-modal-header";
import RejectOrderReasonField from "./reject-order-reason-field";

type RejectOrderModalProps = {
  open: boolean;
  productName: string;
  onClose: () => void;
  onConfirm: (reason: string) => void;
};

function RejectOrderModal({
  open,
  productName,
  onClose,
  onConfirm,
}: RejectOrderModalProps) {
  const [reason, setReason] = useState("");
  const trimmedReason = reason.trim();

  const handleClose = () => {
    setReason("");
    onClose();
  };

  const handleConfirm = () => {
    onConfirm(trimmedReason);
    setReason("");
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      contentClassName="w-[448px] max-w-[calc(100%-2rem)] gap-0 rounded-2xl border-0 bg-white p-8 shadow-[0_25px_50px_rgba(0,0,0,0.25)] sm:max-w-[448px]"
    >
      <div className="flex flex-col gap-6">
        <RejectOrderModalHeader productName={productName} />
        <RejectOrderReasonField value={reason} onChange={setReason} />
        <RejectOrderActions
          disabled={!trimmedReason}
          onCancel={handleClose}
          onConfirm={handleConfirm}
        />
      </div>
    </Modal>
  );
}

export default RejectOrderModal;
