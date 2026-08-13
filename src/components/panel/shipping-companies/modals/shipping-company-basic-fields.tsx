import type { FieldErrors, UseFormRegister } from "react-hook-form";

import { shippingDeliveryTypeOptions, shippingServiceTypeOptions } from "@/data";
import type { ShippingCompanyFormValues } from "@/schemas/shipping-companies";
import type { ShippingDeliveryType, ShippingServiceType } from "@/types";

import { Field, inputClass, inputClassLtr } from "./form-field";
import FormSelect from "./form-select";

type ShippingCompanyBasicFieldsProps = {
  serviceType?: ShippingServiceType;
  deliveryType?: ShippingDeliveryType;
  errors: FieldErrors<ShippingCompanyFormValues>;
  register: UseFormRegister<ShippingCompanyFormValues>;
  onServiceTypeChange: (value: string) => void;
  onDeliveryTypeChange: (value: string) => void;
};

function ShippingCompanyBasicFields({
  serviceType,
  deliveryType,
  errors,
  register,
  onServiceTypeChange,
  onDeliveryTypeChange,
}: ShippingCompanyBasicFieldsProps) {
  return (
    <>
      <Field label="الاسم العربي" required error={errors.name_ar?.message}>
        <input
          type="text"
          placeholder="سمسا نقاط الاستلام"
          className={inputClass}
          {...register("name_ar")}
        />
      </Field>

      <Field label="الاسم الإنجليزي" required error={errors.name_en?.message}>
        <input
          type="text"
          dir="ltr"
          placeholder="SMSA PUDO"
          className={inputClassLtr}
          {...register("name_en")}
        />
      </Field>

      <Field label="كود الناقل" required error={errors.code?.message}>
        <input
          type="text"
          dir="ltr"
          placeholder="smsaV2"
          className={inputClassLtr}
          {...register("code")}
        />
      </Field>

      <Field label="معرّف الخدمة" error={errors.shipping_id?.message}>
        <input
          type="text"
          dir="ltr"
          placeholder="7323"
          className={inputClassLtr}
          {...register("shipping_id")}
        />
      </Field>

      <Field label="نوع الخدمة" error={errors.service_type?.message}>
        <FormSelect
          value={serviceType}
          options={shippingServiceTypeOptions}
          onChange={onServiceTypeChange}
        />
      </Field>

      <Field label="نوع التسليم" error={errors.delivery_type?.message}>
        <FormSelect
          value={deliveryType}
          options={shippingDeliveryTypeOptions}
          onChange={onDeliveryTypeChange}
        />
      </Field>

      <Field label="متوسط مدة التسليم" error={errors.avg_delivery_time?.message}>
        <input
          type="text"
          placeholder="من يوم إلى يومين عمل"
          className={inputClass}
          {...register("avg_delivery_time")}
        />
      </Field>

      <Field label="رابط الشعار" error={errors.logo_url?.message}>
        <input
          type="url"
          dir="ltr"
          placeholder="https://..."
          className={inputClassLtr}
          {...register("logo_url")}
        />
      </Field>
    </>
  );
}

export default ShippingCompanyBasicFields;
