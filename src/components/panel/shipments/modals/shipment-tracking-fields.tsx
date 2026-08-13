import type { FieldErrors, UseFormRegister } from "react-hook-form";

import type { ShipmentFormValues } from "@/schemas/shipments";

import { Field, inputClass, inputClassLtr } from "./form-field";

type ShipmentTrackingFieldsProps = {
  errors: FieldErrors<ShipmentFormValues>;
  register: UseFormRegister<ShipmentFormValues>;
};

/** Only editable after the shipment exists — the courier supplies these by phone. */
function ShipmentTrackingFields({
  errors,
  register,
}: ShipmentTrackingFieldsProps) {
  return (
    <>
      <Field label="رابط التتبع" error={errors.tracking_url?.message}>
        <input
          type="url"
          dir="ltr"
          placeholder="https://..."
          className={inputClassLtr}
          {...register("tracking_url")}
        />
      </Field>

      <Field label="رابط بوليصة الشحن" error={errors.awb_url?.message}>
        <input
          type="url"
          dir="ltr"
          placeholder="https://..."
          className={inputClassLtr}
          {...register("awb_url")}
        />
      </Field>

      <Field label="اسم المندوب" error={errors.driver_name?.message}>
        <input
          type="text"
          placeholder="سامي"
          className={inputClass}
          {...register("driver_name")}
        />
      </Field>

      <Field label="جوال المندوب" error={errors.driver_phone?.message}>
        <input
          type="tel"
          dir="ltr"
          placeholder="9665xxxxxxxx"
          className={inputClassLtr}
          {...register("driver_phone")}
        />
      </Field>
    </>
  );
}

export default ShipmentTrackingFields;
