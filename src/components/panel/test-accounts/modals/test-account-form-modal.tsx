"use client";

import Modal from "@/components/ui/modal";
import type { TestAccountListItem } from "@/types";

import TestAccountFormFields from "./test-account-form-fields";
import { TestAccountFormActions } from "./test-account-form-modal-parts";
import { useTestAccountForm } from "./use-test-account-form";

type TestAccountFormModalProps = {
  open: boolean;
  testAccount?: TestAccountListItem | null;
  onClose: () => void;
  onSaved: () => Promise<void> | void;
};

function TestAccountFormModal({ open, testAccount, onClose, onSaved }: TestAccountFormModalProps) {
  const { form, isEdit, isActive, close, onSubmit } = useTestAccountForm({
    open,
    testAccount,
    onClose,
    onSaved,
  });

  return (
    <Modal
      open={open}
      onClose={close}
      contentClassName="md:max-w-[640px] rounded-2xl border-0 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)]"
      title={isEdit ? "تعديل حساب اختبار" : "إضافة حساب اختبار"}
      description={
        isEdit
          ? "تحديث قيم التسعير الخاصة بحساب الاختبار المختار"
          : "ربط مستخدم موجود بحساب اختبار للدفع بمبالغ رمزية"
      }
    >
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-7 p-1 text-right md:p-4">
        <TestAccountFormFields
          isEdit={isEdit}
          isActive={isActive}
          errors={form.formState.errors}
          register={form.register}
          setValue={form.setValue}
        />
        <TestAccountFormActions
          submitLabel={isEdit ? "حفظ التعديلات" : "إضافة حساب الاختبار"}
          isSubmitting={form.formState.isSubmitting}
          isSubmitDisabled={isEdit && !form.formState.isDirty}
          onClose={close}
        />
      </form>
    </Modal>
  );
}

export default TestAccountFormModal;
