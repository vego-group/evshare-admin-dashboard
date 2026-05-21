import type { ReactNode } from "react";
import type { FieldErrors, UseFormRegister, UseFormSetValue } from "react-hook-form";

import InputErrorMessage from "@/components/ui/input-error-message";
import type { CityFormValues } from "@/schemas/cities";

import CityStatusDropdown from "./city-status-dropdown";

type CityFormFieldsProps = {
  active: boolean;
  errors: FieldErrors<CityFormValues>;
  register: UseFormRegister<CityFormValues>;
  setValue: UseFormSetValue<CityFormValues>;
};

function CityFormFields({ active, errors, register, setValue }: CityFormFieldsProps) {
  return (
    <div className="grid gap-x-5 gap-y-5 sm:grid-cols-2">
      <Field label="الاسم العربي" required error={errors.name_ar?.message}>
        <input
          type="text"
          placeholder="الرياض"
          className="h-14 w-full rounded-[14px] border border-primary bg-primary/4 px-4 text-right text-sm font-medium text-dark-gray outline-none transition focus:bg-primary/8"
          {...register("name_ar")}
        />
      </Field>

      <Field label="الاسم الإنجليزي" required error={errors.name_en?.message}>
        <input
          type="text"
          dir="ltr"
          placeholder="Riyadh"
          className="h-14 w-full rounded-[14px] border border-primary bg-primary/4 px-4 text-left text-sm font-medium text-dark-gray outline-none transition focus:bg-primary/8"
          {...register("name_en")}
        />
      </Field>

      <Field label="الحالة" required error={errors.active?.message}>
        <CityStatusDropdown active={active} setValue={setValue} />
      </Field>
    </div>
  );
}

function Field({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-right text-sm font-medium text-dark-gray">
        {label}
        {required ? <span className="text-red-700"> *</span> : null}
      </span>
      {children}
      <InputErrorMessage msg={error} />
    </label>
  );
}

export default CityFormFields;
