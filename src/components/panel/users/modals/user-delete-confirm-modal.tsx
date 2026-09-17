"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import InputErrorMessage from "@/components/ui/input-error-message";
import Loader from "@/components/ui/loader";
import Modal from "@/components/ui/modal";

type Props = {
  userName?: string;
  open: boolean;
  isDeleting: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
};

export default function UserDeleteConfirmModal({ userName, open, isDeleting, onClose, onConfirm }: Props) {
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");
  function confirm() {
    const trimmed = reason.trim();
    if (trimmed.length < 3 || trimmed.length > 1000) {
      setError("سبب الإزالة مطلوب (من 3 إلى 1000 حرف)");
      return;
    }
    onConfirm(trimmed);
  }
  return <Modal open={open} onClose={onClose} title="إزالة المستخدم" contentClassName="md:max-w-[480px]">
    <div className="space-y-5 p-2 text-right">
      <p className="text-sm text-dark-gray">هل تريد إزالة حساب {userName ?? "هذا المستخدم"}؟ سيتم إخفاء بياناته الشخصية وتعطيل الحساب مع الاحتفاظ بالسجل المرتبط به.</p>
      <label className="block text-sm text-dark-gray">سبب الإزالة *
        <textarea value={reason} onChange={e => { setReason(e.target.value); setError(""); }} maxLength={1000} rows={4} className="mt-2 w-full rounded-xl border border-primary bg-primary/4 p-3" />
        <InputErrorMessage msg={error} />
      </label>
      <div className="flex gap-3">
        <Button type="button" onClick={confirm} disabled={isDeleting} className="flex-1 bg-red-600 text-white hover:bg-red-700">{isDeleting ? <Loader /> : "إزالة الحساب"}</Button>
        <Button type="button" variant="ghost" onClick={onClose} disabled={isDeleting}>إلغاء</Button>
      </div>
    </div>
  </Modal>;
}
