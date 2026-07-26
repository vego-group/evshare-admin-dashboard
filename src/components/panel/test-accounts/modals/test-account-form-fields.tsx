import { SaudiRiyal } from "lucide-react";
import type { ReactNode } from "react";
import type { FieldErrors, UseFormRegister, UseFormSetValue } from "react-hook-form";

import InputErrorMessage from "@/components/ui/input-error-message";
import { cn } from "@/lib/utils";
import {
  preventNegativeNumberInput,
  preventNegativeNumberPaste,
} from "@/lib/utils/non-negative-input";
import type { TestAccountFormValues } from "@/schemas/test-accounts";

import TestAccountStatusDropdown from "./test-account-status-dropdown";

const inputBaseClass =
  "h-14 w-full rounded-[14px] border border-primary bg-primary/4 px-4 text-sm font-medium text-dark-gray outline-none transition focus:bg-primary/8";
const inputClassLtr = `${inputBaseClass} text-left`;

type TestAccountFormFieldsProps = {
  isEdit: boolean;
  isActive: boolean;
  errors: FieldErrors<TestAccountFormValues>;
  register: UseFormRegister<TestAccountFormValues>;
  setValue: UseFormSetValue<TestAccountFormValues>;
};

function TestAccountFormFields({
  isEdit,
  isActive,
  errors,
  register,
  setValue,
}: TestAccountFormFieldsProps) {
  return (
    <div className="grid gap-x-5 gap-y-5 sm:grid-cols-2">
      {isEdit ? null : (
        <Field label="رقم جوال المستخدم" required error={errors.mobile?.message} className="sm:col-span-2">
          <input
            type="text"
            dir="ltr"
            placeholder="5xxxxxxxx"
            className={inputClassLtr}
            {...register("mobile")}
          />
        </Field>
      )}

      <Field label="مبلغ الاشتراك" error={errors.subscription_amount?.message}>
        <NumberInput icon placeholder="1" register={register("subscription_amount")} />
      </Field>

      <Field label="مبلغ الطلب" error={errors.order_amount?.message}>
        <NumberInput icon placeholder="1" register={register("order_amount")} />
      </Field>

      <Field label="رسوم الشحن" error={errors.shipping_fee?.message}>
        <NumberInput icon placeholder="2" register={register("shipping_fee")} />
      </Field>

      <Field label="نسبة الضريبة (%)" error={errors.vat_percentage?.message}>
        <NumberInput placeholder="0" suffix="%" register={register("vat_percentage")} />
      </Field>

      {isEdit ? null : (
        <Field label="الحالة" required error={errors.is_active?.message}>
          <TestAccountStatusDropdown active={isActive} setValue={setValue} />
        </Field>
      )}
    </div>
  );
}

function NumberInput({
  register,
  placeholder,
  icon = false,
  suffix,
}: {
  register: ReturnType<UseFormRegister<TestAccountFormValues>>;
  placeholder?: string;
  icon?: boolean;
  suffix?: ReactNode;
}) {
  return (
    <div className="relative">
      {icon ? (
        <SaudiRiyal className="pointer-events-none absolute left-4 top-1/2 size-4 shrink-0 -translate-y-1/2 text-primary" />
      ) : null}
      <input
        type="number"
        step="0.01"
        min="0"
        dir="ltr"
        placeholder={placeholder}
        onKeyDown={(event) => preventNegativeNumberInput(event, { allowDecimal: true })}
        onPaste={(event) => preventNegativeNumberPaste(event, { allowDecimal: true })}
        className={cn(
          inputClassLtr,
          "[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none",
          icon && "pl-10",
          suffix && "pr-9",
        )}
        {...register}
      />
      {suffix ? (
        <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-gray">
          {suffix}
        </span>
      ) : null}
    </div>
  );
}

function Field({
  label,
  required,
  error,
  className,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  className?: string;
  children: ReactNode;
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

export default TestAccountFormFields;
