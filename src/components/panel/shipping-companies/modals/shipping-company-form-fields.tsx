import type { FieldErrors, UseFormRegister, UseFormSetValue } from "react-hook-form";

import type { ShippingCompanyFormValues } from "@/schemas/shipping-companies";
import type { ShippingDeliveryType, ShippingServiceType } from "@/types";

import { Field, inputClassLtr } from "./form-field";
import FormSelect from "./form-select";
import ShippingCompanyBasicFields from "./shipping-company-basic-fields";
import ShippingCompanyPricingFields from "./shipping-company-pricing-fields";

type ShippingCompanyFormFieldsProps = {
  serviceType?: ShippingServiceType;
  deliveryType?: ShippingDeliveryType;
  supportsCod: boolean;
  active: boolean;
  errors: FieldErrors<ShippingCompanyFormValues>;
  register: UseFormRegister<ShippingCompanyFormValues>;
  setValue: UseFormSetValue<ShippingCompanyFormValues>;
};

const booleanOptions = (yes: string, no: string) => [
  { label: yes, value: "true" },
  { label: no, value: "false" },
];

function ShippingCompanyFormFields({
  serviceType,
  deliveryType,
  supportsCod,
  active,
  errors,
  register,
  setValue,
}: ShippingCompanyFormFieldsProps) {
  const setFlag = (name: "supports_cod" | "active", value: string) =>
    setValue(name, value === "true", {
      shouldDirty: true,
      shouldValidate: true,
    });

  return (
    <div className="grid gap-x-5 gap-y-5 sm:grid-cols-2">
      <ShippingCompanyBasicFields
        serviceType={serviceType}
        deliveryType={deliveryType}
        errors={errors}
        register={register}
        onServiceTypeChange={(value) =>
          setValue("service_type", value as ShippingServiceType, {
            shouldDirty: true,
            shouldValidate: true,
          })
        }
        onDeliveryTypeChange={(value) =>
          setValue("delivery_type", value as ShippingDeliveryType, {
            shouldDirty: true,
            shouldValidate: true,
          })
        }
      />

      <ShippingCompanyPricingFields errors={errors} register={register} />

      <Field label="الدفع عند الاستلام" error={errors.supports_cod?.message}>
        <FormSelect
          value={String(supportsCod)}
          options={booleanOptions("مدعوم", "غير مدعوم")}
          onChange={(value) => setFlag("supports_cod", value)}
        />
      </Field>

      <Field label="الحالة" required error={errors.active?.message}>
        <FormSelect
          value={String(active)}
          options={booleanOptions("نشط", "غير نشط")}
          onChange={(value) => setFlag("active", value)}
        />
      </Field>

      <Field label="ترتيب العرض" error={errors.sort_order?.message}>
        <input
          type="number"
          step="1"
          min="0"
          dir="ltr"
          placeholder="1"
          className={inputClassLtr}
          {...register("sort_order")}
        />
      </Field>
    </div>
  );
}

export default ShippingCompanyFormFields;
