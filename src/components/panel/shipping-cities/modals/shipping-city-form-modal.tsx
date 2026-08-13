"use client";

import Modal from "@/components/ui/modal";
import type { ShippingCityListItem } from "@/types";

import ShippingCityFormFields from "./shipping-city-form-fields";
import { ShippingCityFormActions } from "./shipping-city-form-modal-parts";
import { useShippingCityForm } from "./use-shipping-city-form";

type ShippingCityFormModalProps = {
  open: boolean;
  shippingCity?: ShippingCityListItem | null;
  onClose: () => void;
  onSaved: () => Promise<void> | void;
};

function ShippingCityFormModal({
  open,
  shippingCity,
  onClose,
  onSaved,
}: ShippingCityFormModalProps) {
  const {
    form,
    cityUuid,
    courierDelivery,
    bulletDelivery,
    branchCoverage,
    active,
    close,
    onSubmit,
  } = useShippingCityForm({ open, shippingCity, onClose, onSaved });
  const isEdit = Boolean(shippingCity);

  return (
    <Modal
      open={open}
      onClose={close}
      contentClassName="md:max-w-[640px] rounded-2xl border-0 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)]"
      title={isEdit ? "تعديل مدينة الشحن" : "إضافة مدينة شحن"}
      description={
        isEdit
          ? "تحديث بيانات مدينة الشحن المختارة"
          : "إضافة مدينة جديدة لمزود الشحن وربطها بمدننا"
      }
    >
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-7 p-1 text-right md:p-4"
      >
        <ShippingCityFormFields
          cityUuid={cityUuid}
          courierDelivery={courierDelivery}
          bulletDelivery={bulletDelivery}
          branchCoverage={branchCoverage}
          active={active}
          errors={form.formState.errors}
          register={form.register}
          setValue={form.setValue}
        />
        <ShippingCityFormActions
          submitLabel={isEdit ? "حفظ التعديلات" : "إضافة مدينة الشحن"}
          isSubmitting={form.formState.isSubmitting}
          isSubmitDisabled={isEdit && !form.formState.isDirty}
          onClose={close}
        />
      </form>
    </Modal>
  );
}

export default ShippingCityFormModal;
