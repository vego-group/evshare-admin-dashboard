import type { FieldErrors, UseFormRegister } from "react-hook-form";

import { shipmentPickingTypeLabels } from "@/data";
import type { ShipmentFormValues } from "@/schemas/shipments";
import type { ShipmentPickingType } from "@/types";

import { Field, inputClassLtr } from "./form-field";
import FormSelect from "./form-select";

type ShipmentIdentifierFieldsProps = {
  isEdit: boolean;
  pickingType: ShipmentPickingType;
  errors: FieldErrors<ShipmentFormValues>;
  register: UseFormRegister<ShipmentFormValues>;
  onPickingTypeChange: (value: string) => void;
};

const pickingTypeOptions = (
  Object.keys(shipmentPickingTypeLabels) as ShipmentPickingType[]
).map((value) => ({ label: shipmentPickingTypeLabels[value], value }));

function ShipmentIdentifierFields({
  isEdit,
  pickingType,
  errors,
  register,
  onPickingTypeChange,
}: ShipmentIdentifierFieldsProps) {
  return (
    <>
      <Field label="معرّف الخدمة" error={errors.delivery_option_id?.message}>
        <input
          type="text"
          dir="ltr"
          placeholder="7323"
          className={inputClassLtr}
          {...register("delivery_option_id")}
        />
      </Field>

      <Field label="رقم التتبع" error={errors.tracking_id?.message}>
        <input
          type="text"
          dir="ltr"
          placeholder="إن وُجد"
          className={inputClassLtr}
          {...register("tracking_id")}
        />
      </Field>

      <Field label="رقم الشحنة لدى الناقل" error={errors.shipping_id?.message}>
        <input
          type="text"
          dir="ltr"
          placeholder="إن وُجد"
          className={inputClassLtr}
          {...register("shipping_id")}
        />
      </Field>

      <Field label="طريقة الاستلام" error={errors.picking_type?.message}>
        <FormSelect
          value={pickingType}
          options={pickingTypeOptions}
          onChange={onPickingTypeChange}
        />
      </Field>

      {!isEdit ? (
        <Field label="العملة" error={errors.currency?.message}>
          <input
            type="text"
            dir="ltr"
            maxLength={3}
            placeholder="SAR"
            className={inputClassLtr}
            {...register("currency")}
          />
        </Field>
      ) : null}
    </>
  );
}

export default ShipmentIdentifierFields;
