"use client";

import Modal from "@/components/ui/modal";
import type { PromoListItem } from "@/types";

import PromoFormFields from "./promo-form-fields";
import { PromoFormActions } from "./promo-form-modal-parts";
import { usePromoForm } from "./use-promo-form";

type PromoFormModalProps = {
  open: boolean;
  promo?: PromoListItem | null;
  onClose: () => void;
  onSaved: () => Promise<void> | void;
};

function PromoFormModal({ open, promo, onClose, onSaved }: PromoFormModalProps) {
  const { form, type, discountType, isActive, startDate, endDate, close, onSubmit } = usePromoForm({
    open,
    promo,
    onClose,
    onSaved,
  });
  const isEdit = Boolean(promo);

  return (
    <Modal
      open={open}
      onClose={close}
      contentClassName="md:max-w-[720px] rounded-2xl border-0 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)]"
      title={isEdit ? "تعديل كود الخصم" : "إضافة كود خصم"}
      description={isEdit ? "تحديث بيانات كود الخصم المختار" : "إضافة كود خصم جديد للقائمة"}
    >
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-7 p-1 text-right md:p-4">
        <PromoFormFields
          type={type}
          discountType={discountType}
          isActive={isActive}
          startDate={startDate}
          endDate={endDate}
          errors={form.formState.errors}
          register={form.register}
          setValue={form.setValue}
        />
        <PromoFormActions
          submitLabel={isEdit ? "حفظ التعديلات" : "إضافة كود الخصم"}
          isSubmitting={form.formState.isSubmitting}
          isSubmitDisabled={isEdit && !form.formState.isDirty}
          onClose={close}
        />
      </form>
    </Modal>
  );
}

export default PromoFormModal;
