import type { FieldErrors, UseFormRegister, UseFormSetValue } from "react-hook-form";

import type { ShippingCityFormValues } from "@/schemas/shipping-cities";

import { Field, inputClass, inputClassLtr } from "./form-field";
import FormSelect from "./form-select";
import ShippingCitySelect from "./shipping-city-select";

type ShippingCityFormFieldsProps = {
  cityUuid?: string;
  courierDelivery: boolean;
  bulletDelivery: boolean;
  branchCoverage: boolean;
  active: boolean;
  errors: FieldErrors<ShippingCityFormValues>;
  register: UseFormRegister<ShippingCityFormValues>;
  setValue: UseFormSetValue<ShippingCityFormValues>;
};

type FlagField = Extract<
  keyof ShippingCityFormValues,
  "courier_delivery" | "bullet_delivery" | "branch_coverage" | "active"
>;

const yesNoOptions = (yes: string, no: string) => [
  { label: yes, value: "true" },
  { label: no, value: "false" },
];

function ShippingCityFormFields({
  cityUuid,
  courierDelivery,
  bulletDelivery,
  branchCoverage,
  active,
  errors,
  register,
  setValue,
}: ShippingCityFormFieldsProps) {
  const setFlag = (name: FlagField, value: string) =>
    setValue(name, value === "true", {
      shouldDirty: true,
      shouldValidate: true,
    });

  const flags: { name: FlagField; label: string; value: boolean }[] = [
    { name: "courier_delivery", label: "توصيل بمندوب", value: courierDelivery },
    { name: "bullet_delivery", label: "توصيل سريع", value: bulletDelivery },
    { name: "branch_coverage", label: "تغطية الفروع", value: branchCoverage },
  ];

  return (
    <div className="grid gap-x-5 gap-y-5 sm:grid-cols-2">
      <Field label="الاسم العربي" required error={errors.name_ar?.message}>
        <input
          type="text"
          placeholder="جدة"
          className={inputClass}
          {...register("name_ar")}
        />
      </Field>

      <Field label="الاسم الإنجليزي" required error={errors.name_en?.message}>
        <input
          type="text"
          dir="ltr"
          placeholder="Jeddah"
          className={inputClassLtr}
          {...register("name_en")}
        />
      </Field>

      <Field
        label="اسم المدينة لدى المزود"
        error={errors.oto_name?.message}
      >
        <input
          type="text"
          dir="ltr"
          placeholder="يُستخدم الاسم الإنجليزي تلقائيًا"
          className={inputClassLtr}
          {...register("oto_name")}
        />
      </Field>

      <Field label="رمز الدولة" error={errors.country_code?.message}>
        <input
          type="text"
          dir="ltr"
          maxLength={2}
          placeholder="SA"
          className={inputClassLtr}
          {...register("country_code")}
        />
      </Field>

      <Field label="المدينة المرتبطة" error={errors.city_uuid?.message}>
        <ShippingCitySelect
          value={cityUuid}
          onChange={(cityId) =>
            setValue("city_uuid", cityId, {
              shouldDirty: true,
              shouldValidate: true,
            })
          }
        />
      </Field>

      {flags.map((flag) => (
        <Field
          key={flag.name}
          label={flag.label}
          error={errors[flag.name]?.message}
        >
          <FormSelect
            value={String(flag.value)}
            options={yesNoOptions("متاح", "غير متاح")}
            onChange={(value) => setFlag(flag.name, value)}
          />
        </Field>
      ))}

      <Field label="الحالة" required error={errors.active?.message}>
        <FormSelect
          value={String(active)}
          options={yesNoOptions("نشط", "غير نشط")}
          onChange={(value) => setFlag("active", value)}
        />
      </Field>
    </div>
  );
}

export default ShippingCityFormFields;
