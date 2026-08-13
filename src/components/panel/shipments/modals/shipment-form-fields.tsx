import type { FieldErrors, UseFormRegister, UseFormSetValue } from "react-hook-form";

import DatePicker from "@/components/ui/date-picker";
import type { ShipmentFormValues } from "@/schemas/shipments";
import type { ShipmentPickingType } from "@/types";

import { Field, inputClass } from "./form-field";
import ShipmentCompanySelect from "./shipment-company-select";
import ShipmentIdentifierFields from "./shipment-identifier-fields";
import ShipmentOrderSelect from "./shipment-order-select";
import ShipmentPackageFields from "./shipment-package-fields";
import ShipmentTrackingFields from "./shipment-tracking-fields";

type ShipmentFormFieldsProps = {
  isEdit: boolean;
  orderUuid?: string;
  companyUuid?: string;
  pickingType: ShipmentPickingType;
  pickupDate?: string;
  deliveryDate?: string;
  errors: FieldErrors<ShipmentFormValues>;
  register: UseFormRegister<ShipmentFormValues>;
  setValue: UseFormSetValue<ShipmentFormValues>;
};

function ShipmentFormFields({
  isEdit,
  orderUuid,
  companyUuid,
  pickingType,
  pickupDate,
  deliveryDate,
  errors,
  register,
  setValue,
}: ShipmentFormFieldsProps) {
  const setField = (name: keyof ShipmentFormValues, value: string) =>
    setValue(name, value, { shouldDirty: true, shouldValidate: true });

  return (
    <div className="grid gap-x-5 gap-y-5 sm:grid-cols-2">
      {!isEdit ? (
        <Field
          label="الطلب"
          required
          error={errors.order_uuid?.message}
          className="sm:col-span-2"
        >
          <ShipmentOrderSelect
            value={orderUuid}
            onChange={(orderId) => setField("order_uuid", orderId)}
          />
        </Field>
      ) : null}

      <Field label="شركة الشحن" error={errors.shipping_company_uuid?.message}>
        <ShipmentCompanySelect
          value={companyUuid}
          onChange={(companyId) => setField("shipping_company_uuid", companyId)}
        />
      </Field>

      <ShipmentIdentifierFields
        isEdit={isEdit}
        pickingType={pickingType}
        errors={errors}
        register={register}
        onPickingTypeChange={(value) => setField("picking_type", value)}
      />

      <ShipmentPackageFields
        isEdit={isEdit}
        errors={errors}
        register={register}
      />

      <Field
        label="تاريخ الاستلام المتوقع"
        error={errors.estimated_pickup_date?.message}
      >
        <DatePicker
          value={pickupDate}
          maxDate={deliveryDate}
          onChange={(value) => setField("estimated_pickup_date", value ?? "")}
        />
      </Field>

      <Field
        label="تاريخ التسليم المتوقع"
        error={errors.estimated_delivery_date?.message}
      >
        <DatePicker
          value={deliveryDate}
          minDate={pickupDate}
          onChange={(value) => setField("estimated_delivery_date", value ?? "")}
        />
      </Field>

      {isEdit ? (
        <ShipmentTrackingFields errors={errors} register={register} />
      ) : null}

      <Field
        label="ملاحظات"
        error={errors.notes?.message}
        className="sm:col-span-2"
      >
        <textarea
          rows={3}
          className={`${inputClass} h-auto py-3`}
          {...register("notes")}
        />
      </Field>
    </div>
  );
}

export default ShipmentFormFields;
