"use client";

import type { FieldErrors, UseFormRegister } from "react-hook-form";

import { useCities } from "@/hooks/api";
import type { ShipmentFormValues } from "@/schemas/shipments";

import { Field, inputClass, inputClassLtr } from "./form-field";
import FormSelect from "./form-select";

type Props = {
  errors: FieldErrors<ShipmentFormValues>;
  register: UseFormRegister<ShipmentFormValues>;
  senderCity?: string;
  recipientCity?: string;
  onCityChange: (field: "sender_city_uuid" | "recipient_city_uuid", value: string) => void;
};

export default function ShipmentPartiesFields({
  errors,
  register,
  senderCity,
  recipientCity,
  onCityChange,
}: Props) {
  const { data } = useCities({ page: 1, limit: 100 });
  const cities = (data?.data ?? []).map((city) => ({ label: city.name, value: city.id }));

  return (
    <>
      <h3 className="border-b border-neutral-200 pb-2 font-semibold text-secondary sm:col-span-2">
        بيانات المرسل (اختيارية)
      </h3>
      <Field label="اسم المرسل"><input className={inputClass} {...register("sender_name")} /></Field>
      <Field label="جوال المرسل"><input dir="ltr" className={inputClassLtr} {...register("sender_mobile")} /></Field>
      <Field label="بريد المرسل" error={errors.sender_email?.message}><input type="email" dir="ltr" className={inputClassLtr} {...register("sender_email")} /></Field>
      <Field label="مدينة المرسل"><FormSelect value={senderCity} options={cities} placeholder="اختر المدينة" onChange={(value) => onCityChange("sender_city_uuid", value)} /></Field>
      <Field label="عنوان المرسل" className="sm:col-span-2"><input className={inputClass} {...register("sender_address")} /></Field>
      <Field label="خط عرض المرسل" error={errors.sender_latitude?.message}><input type="number" step="any" dir="ltr" className={inputClassLtr} {...register("sender_latitude")} /></Field>
      <Field label="خط طول المرسل" error={errors.sender_longitude?.message}><input type="number" step="any" dir="ltr" className={inputClassLtr} {...register("sender_longitude")} /></Field>

      <h3 className="mt-2 border-b border-neutral-200 pb-2 font-semibold text-secondary sm:col-span-2">
        بيانات المستلم (تتعبأ من الطلب تلقائياً عند تركها فارغة)
      </h3>
      <Field label="اسم المستلم"><input className={inputClass} {...register("recipient_name")} /></Field>
      <Field label="جوال المستلم"><input dir="ltr" className={inputClassLtr} {...register("recipient_mobile")} /></Field>
      <Field label="بريد المستلم" error={errors.recipient_email?.message}><input type="email" dir="ltr" className={inputClassLtr} {...register("recipient_email")} /></Field>
      <Field label="مدينة المستلم"><FormSelect value={recipientCity} options={cities} placeholder="اختر المدينة" onChange={(value) => onCityChange("recipient_city_uuid", value)} /></Field>
      <Field label="عنوان المستلم" className="sm:col-span-2"><input className={inputClass} {...register("recipient_address")} /></Field>
      <Field label="الحي"><input className={inputClass} {...register("recipient_district")} /></Field>
      <Field label="الرمز البريدي"><input dir="ltr" className={inputClassLtr} {...register("recipient_postcode")} /></Field>
      <Field label="رمز العنوان المختصر"><input dir="ltr" className={inputClassLtr} {...register("recipient_short_address_code")} /></Field>
      <div />
      <Field label="خط عرض المستلم" error={errors.recipient_latitude?.message}><input type="number" step="any" dir="ltr" className={inputClassLtr} {...register("recipient_latitude")} /></Field>
      <Field label="خط طول المستلم" error={errors.recipient_longitude?.message}><input type="number" step="any" dir="ltr" className={inputClassLtr} {...register("recipient_longitude")} /></Field>
    </>
  );
}
