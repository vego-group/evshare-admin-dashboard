"use client";

import { useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import InputErrorMessage from "@/components/ui/input-error-message";
import Loader from "@/components/ui/loader";
import Modal from "@/components/ui/modal";
import {
  getUserRemovalReasonError,
  normalizeUserRemovalReason,
  USER_REMOVAL_REASON_MAX_LENGTH,
} from "@/lib/user-removal";

type Props = {
  userName?: string;
  open: boolean;
  isDeleting: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
};

export default function UserDeleteConfirmModal({
  userName,
  open,
  isDeleting,
  onClose,
  onConfirm,
}: Props) {
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");

  function confirm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validationError = getUserRemovalReasonError(reason);
    if (validationError) {
      setError(validationError);
      return;
    }

    onConfirm(normalizeUserRemovalReason(reason));
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="إزالة المستخدم"
      contentClassName="md:max-w-[480px]"
    >
      <form className="space-y-5 p-2 text-right" onSubmit={confirm} noValidate>
        <p className="text-sm text-dark-gray">
          هل تريد إزالة حساب {userName ?? "هذا المستخدم"}؟ سيتم إخفاء بياناته
          الشخصية وتعطيل الحساب مع الاحتفاظ بالسجل المرتبط به.
        </p>

        <div>
          <label
            htmlFor="user-removal-reason"
            className="block text-sm text-dark-gray"
          >
            سبب الإزالة *
          </label>
          <textarea
            id="user-removal-reason"
            value={reason}
            onChange={(event) => {
              setReason(event.target.value);
              setError("");
            }}
            maxLength={USER_REMOVAL_REASON_MAX_LENGTH}
            rows={4}
            required
            disabled={isDeleting}
            aria-invalid={Boolean(error)}
            aria-describedby={
              error ? "user-removal-reason-error" : "user-removal-reason-help"
            }
            className="mt-2 block w-full rounded-xl border border-primary bg-primary/4 p-3 disabled:cursor-not-allowed disabled:opacity-60"
          />
          {error ? (
            <InputErrorMessage id="user-removal-reason-error" msg={error} />
          ) : (
            <p id="user-removal-reason-help" className="mt-1 text-xs text-gray">
              من 3 إلى 1000 حرف
            </p>
          )}
          <span
            className="mt-1 block text-left text-xs text-gray"
            aria-live="polite"
          >
            {reason.length}/{USER_REMOVAL_REASON_MAX_LENGTH}
          </span>
        </div>

        <div className="flex gap-3">
          <Button
            type="submit"
            disabled={isDeleting}
            className="flex-1 bg-red-600 text-white hover:bg-red-700"
          >
            {isDeleting ? <Loader /> : "إزالة الحساب"}
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            disabled={isDeleting}
          >
            إلغاء
          </Button>
        </div>
      </form>
    </Modal>
  );
}
