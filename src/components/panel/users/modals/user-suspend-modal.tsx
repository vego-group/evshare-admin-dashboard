"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import Loader from "@/components/ui/loader";
import Modal from "@/components/ui/modal";

export default function UserSuspendModal({ open, userName, isSubmitting, onClose, onConfirm }: {
  open: boolean; userName?: string; isSubmitting: boolean; onClose: () => void; onConfirm: (reason?: string) => void;
}) {
  const [reason, setReason] = useState("");
  return <Modal open={open} onClose={onClose} title="تعليق المستخدم" contentClassName="md:max-w-[480px]">
    <div className="space-y-5 p-2 text-right">
      <p className="text-sm text-dark-gray">تعليق حساب {userName ?? "هذا المستخدم"} سيمنع تسجيل الدخول واستخدام الحساب حتى إعادة تفعيله.</p>
      <label className="block text-sm text-dark-gray">سبب التعليق (اختياري)
        <textarea value={reason} onChange={e => setReason(e.target.value)} maxLength={1000} rows={3} className="mt-2 w-full rounded-xl border border-primary bg-primary/4 p-3" />
      </label>
      <div className="flex gap-3">
        <Button type="button" disabled={isSubmitting} onClick={() => onConfirm(reason.trim() || undefined)} className="flex-1">{isSubmitting ? <Loader /> : "تعليق الحساب"}</Button>
        <Button type="button" variant="ghost" onClick={onClose} disabled={isSubmitting}>إلغاء</Button>
      </div>
    </div>
  </Modal>;
}
