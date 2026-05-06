"use client";

import { useState } from "react";

import Modal from "@/components/ui/modal";

import RejectRequestActions from "./reject-request-actions";
import RejectRequestModalHeader from "./reject-request-modal-header";
import RejectRequestReasonField from "./reject-request-reason-field";

type RejectRequestModalProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
};

function RejectRequestModal({
  open,
  onClose,
  onConfirm,
}: RejectRequestModalProps) {
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
        <RejectRequestModalHeader />
        <RejectRequestReasonField value={reason} onChange={setReason} />
        <RejectRequestActions
          disabled={!trimmedReason}
          onCancel={handleClose}
          onConfirm={handleConfirm}
        />
      </div>
    </Modal>
  );
}

export default RejectRequestModal;
