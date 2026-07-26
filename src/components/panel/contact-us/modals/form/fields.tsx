import type { FieldErrors, UseFormRegister } from "react-hook-form";

import { CONTACT_US_EMAIL_KEY } from "@/types";
import type { ContactUsSettingFormValues } from "@/schemas/contact-us";

import ContactUsField from "./field";

type Props = {
  settingName: string;
  label: string;
  errors: FieldErrors<ContactUsSettingFormValues>;
  register: UseFormRegister<ContactUsSettingFormValues>;
};

const inputClass =
  "h-12 w-full rounded-xl border border-neutral-200 bg-white px-4 text-sm text-dark-gray outline-none transition placeholder:text-gray/70 focus:border-primary focus:ring-3 focus:ring-primary/15 disabled:cursor-not-allowed disabled:bg-neutral-100 disabled:text-gray";

function ContactUsFormFields({ settingName, label, errors, register }: Props) {
  const isEmail = settingName === CONTACT_US_EMAIL_KEY;

  return (
    <div className="flex flex-col gap-4">
      <ContactUsField label={label} error={errors.value?.message}>
        <input
          dir="ltr"
          type={isEmail ? "email" : "tel"}
          className={inputClass}
          {...register("value")}
        />
      </ContactUsField>
    </div>
  );
}

export default ContactUsFormFields;
