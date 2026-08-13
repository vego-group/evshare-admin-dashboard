"use client";

import Modal from "@/components/ui/modal";
import type { ShippingCompanyListItem } from "@/types";

import ShippingCompanyFormFields from "./shipping-company-form-fields";
import { ShippingCompanyFormActions } from "./shipping-company-form-modal-parts";
import { useShippingCompanyForm } from "./use-shipping-company-form";

type ShippingCompanyFormModalProps = {
  open: boolean;
  company?: ShippingCompanyListItem | null;
  onClose: () => void;
  onSaved: () => Promise<void> | void;
};

function ShippingCompanyFormModal({
  open,
  company,
  onClose,
  onSaved,
}: ShippingCompanyFormModalProps) {
  const { form, serviceType, deliveryType, supportsCod, active, close, onSubmit } =
    useShippingCompanyForm({ open, company, onClose, onSaved });
  const isEdit = Boolean(company);

  return (
    <Modal
      open={open}
      onClose={close}
      contentClassName="md:max-w-[720px] rounded-2xl border-0 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)]"
      title={isEdit ? "تعديل شركة الشحن" : "إضافة شركة شحن"}
      description={
        isEdit
          ? "تحديث بيانات شركة الشحن المختارة"
          : "إضافة ناقل جديد بأسعاره وحدوده"
      }
    >
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-7 p-1 text-right md:p-4"
      >
        <ShippingCompanyFormFields
          serviceType={serviceType}
          deliveryType={deliveryType}
          supportsCod={supportsCod}
          active={active}
          errors={form.formState.errors}
          register={form.register}
          setValue={form.setValue}
        />
        <ShippingCompanyFormActions
          submitLabel={isEdit ? "حفظ التعديلات" : "إضافة شركة الشحن"}
          isSubmitting={form.formState.isSubmitting}
          isSubmitDisabled={isEdit && !form.formState.isDirty}
          onClose={close}
        />
      </form>
    </Modal>
  );
}

export default ShippingCompanyFormModal;
