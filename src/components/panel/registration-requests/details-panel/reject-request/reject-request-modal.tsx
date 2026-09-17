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
  loading: boolean;
  error?: string;
};

function RejectRequestModal({
  open,
  onClose,
  onConfirm,
  loading,
  error,
}: RejectRequestModalProps) {
  const [reason, setReason] = useState("");
  const trimmedReason = reason.trim();

  const handleClose = () => {
    if (loading) return;
    setReason("");
    onClose();
  };

  const handleConfirm = () => {
    if (loading || trimmedReason.length < 10 || trimmedReason.length > 1000) return;
    onConfirm(trimmedReason);
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      contentClassName="w-[448px] max-w-[calc(100%-2rem)] gap-0 rounded-2xl border-0 bg-white p-8 shadow-[0_25px_50px_rgba(0,0,0,0.25)] sm:max-w-[448px]"
    >
      <div className="flex flex-col gap-6">
        <RejectRequestModalHeader />
        <RejectRequestReasonField value={reason} onChange={setReason} error={error} />
        <RejectRequestActions
          disabled={trimmedReason.length < 10 || trimmedReason.length > 1000 || loading}
          loading={loading}
          onCancel={handleClose}
          onConfirm={handleConfirm}
        />
      </div>
    </Modal>
  );
}

export default RejectRequestModal;
