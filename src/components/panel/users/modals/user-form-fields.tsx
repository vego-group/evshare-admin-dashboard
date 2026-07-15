import type { ReactNode } from "react";
import Image from "next/image";
import type { FieldErrors, UseFormRegister, UseFormSetValue, UseFormWatch } from "react-hook-form";

import InputErrorMessage from "@/components/ui/input-error-message";
import type { AddUserFormValues } from "@/schemas/users";

import UserRoleDropdown from "./user-role-dropdown";

type UserFormFieldsProps = {
  errors: FieldErrors<AddUserFormValues>;
  register: UseFormRegister<AddUserFormValues>;
  setValue: UseFormSetValue<AddUserFormValues>;
  watch: UseFormWatch<AddUserFormValues>;
};

function UserFormFields({ errors, register, setValue, watch }: UserFormFieldsProps) {
  const role = watch("role");

  return (
    <div className="grid gap-x-5 gap-y-5 sm:grid-cols-2">
      <Field label="الاسم الأول" required error={errors.first_name?.message}>
        <input
          type="text"
          placeholder="أحمد"
          className="h-14 w-full rounded-[14px] border border-primary bg-primary/4 px-4 text-right text-sm font-medium text-dark-gray outline-none transition focus:bg-primary/8"
          {...register("first_name")}
        />
      </Field>

      <Field label="الأسم الأخير" required error={errors.last_name?.message}>
        <input
          type="text"
          placeholder="خالد"
          className="h-14 w-full rounded-[14px] border border-primary bg-primary/4 px-4 text-right text-sm font-medium text-dark-gray outline-none transition focus:bg-primary/8"
          {...register("last_name")}
        />
      </Field>

      <Field label="رقم الجوال" required error={errors.mobile?.message}>
        <div
          dir="ltr"
          className="flex h-14 w-full overflow-hidden rounded-[14px] border border-primary bg-primary/4 transition focus-within:bg-primary/8"
        >
          <div className="flex shrink-0 items-center gap-1.5 border-r border-primary px-4 select-none">
            <Image src="/images/flag.png" alt="SA" width={28} height={20} className="rounded-sm object-cover" />
            <span className="text-sm font-medium text-dark-gray">+966</span>
          </div>
          <input
            type="tel"
            inputMode="numeric"
            maxLength={9}
            placeholder="5x xxx xxxx"
            className="h-full w-full bg-transparent px-4 text-left text-sm font-medium text-dark-gray outline-none placeholder:text-gray-400"
            {...register("mobile")}
          />
        </div>
      </Field>

      <Field label="الدور" required error={errors.role?.message}>
        <UserRoleDropdown value={role} setValue={setValue} />
      </Field>

      <Field label="البريد الإلكتروني" error={errors.email?.message} className="sm:col-span-2">
        <input
          type="email"
          dir="ltr"
          placeholder="user@example.com"
          className="h-14 w-full rounded-[14px] border border-primary bg-primary/4 px-4 text-left text-sm font-medium text-dark-gray outline-none transition focus:bg-primary/8"
          {...register("email")}
        />
      </Field>
    </div>
  );
}

function Field({
  label,
  required,
  error,
  children,
  className,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label className={`block ${className ?? ""}`}>
      <span className="mb-2 block text-right text-sm font-medium text-dark-gray">
        {label}
        {required ? <span className="text-red-700"> *</span> : null}
      </span>
      {children}
      <InputErrorMessage msg={error} />
    </label>
  );
}

export default UserFormFields;
