"use client";

import Modal from "@/components/ui/modal";
import type { ShipmentListItem } from "@/types";

import ShipmentFormFields from "./shipment-form-fields";
import { ShipmentFormActions } from "./shipment-form-modal-parts";
import { useShipmentForm } from "./use-shipment-form";

type ShipmentFormModalProps = {
  open: boolean;
  shipment?: ShipmentListItem | null;
  onClose: () => void;
  onSaved: () => Promise<void> | void;
};

function ShipmentFormModal({
  open,
  shipment,
  onClose,
  onSaved,
}: ShipmentFormModalProps) {
  const {
    form,
    isEdit,
    orderUuid,
    companyUuid,
    pickingType,
    pickupDate,
    deliveryDate,
    close,
    onSubmit,
  } = useShipmentForm({ open, shipment, onClose, onSaved });

  return (
    <Modal
      open={open}
      onClose={close}
      contentClassName="md:max-w-[760px] rounded-2xl border-0 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)]"
      title={isEdit ? "تعديل الشحنة" : "إنشاء شحنة"}
      description={
        isEdit
          ? "تحديث بيانات الشحنة وأرقام التتبع"
          : "إنشاء شحنة لطلب، وتُستكمل البيانات الناقصة من بيانات الطلب"
      }
    >
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-7 p-1 text-right md:p-4"
      >
        <ShipmentFormFields
          isEdit={isEdit}
          orderUuid={orderUuid}
          companyUuid={companyUuid}
          pickingType={pickingType}
          pickupDate={pickupDate}
          deliveryDate={deliveryDate}
          errors={form.formState.errors}
          register={form.register}
          setValue={form.setValue}
        />
        <ShipmentFormActions
          submitLabel={isEdit ? "حفظ التعديلات" : "إنشاء الشحنة"}
          isSubmitting={form.formState.isSubmitting}
          isSubmitDisabled={isEdit && !form.formState.isDirty}
          onClose={close}
        />
      </form>
    </Modal>
  );
}

export default ShipmentFormModal;
