import { SaudiRiyal } from "lucide-react";
import type { ReactNode } from "react";
import type { FieldErrors, UseFormRegister, UseFormSetValue } from "react-hook-form";

import DatePicker from "@/components/ui/date-picker";
import InputErrorMessage from "@/components/ui/input-error-message";
import { cn } from "@/lib/utils";
import {
  preventNegativeNumberInput,
  preventNegativeNumberPaste,
} from "@/lib/utils/non-negative-input";
import type { PromoFormValues } from "@/schemas/promos";
import type { PromoContext, PromoDiscountType } from "@/types";

import PromoDiscountTypeDropdown from "./promo-discount-type-dropdown";
import PromoStatusDropdown from "./promo-status-dropdown";
import PromoTypeDropdown from "./promo-type-dropdown";

const inputBaseClass =
  "h-14 w-full rounded-[14px] border border-primary bg-primary/4 px-4 text-sm font-medium text-dark-gray outline-none transition focus:bg-primary/8";
const inputClass = `${inputBaseClass} text-right`;
const inputClassLtr = `${inputBaseClass} text-left`;

type PromoFormFieldsProps = {
  type: PromoContext;
  discountType: PromoDiscountType;
  isActive: boolean;
  startDate?: string;
  endDate?: string;
  errors: FieldErrors<PromoFormValues>;
  register: UseFormRegister<PromoFormValues>;
  setValue: UseFormSetValue<PromoFormValues>;
};

function PromoFormFields({
  type,
  discountType,
  isActive,
  startDate,
  endDate,
  errors,
  register,
  setValue,
}: PromoFormFieldsProps) {
  return (
    <div className="grid gap-x-5 gap-y-5 sm:grid-cols-2">
      <Field label="كود الخصم" required error={errors.code?.message}>
        <input
          type="text"
          dir="ltr"
          placeholder="SUMMER10"
          className={inputClassLtr}
          {...register("code")}
        />
      </Field>

      <Field label="نوع الطلب المستهدف" required error={errors.type?.message}>
        <PromoTypeDropdown value={type} setValue={setValue} />
      </Field>

      <Field label="نوع الخصم" required error={errors.discount_type?.message}>
        <PromoDiscountTypeDropdown value={discountType} setValue={setValue} />
      </Field>

      <Field
        label={discountType === "percentage" ? "قيمة الخصم (%)" : "قيمة الخصم"}
        required
        error={errors.discount_value?.message}
      >
        <NumberInput
          placeholder="10"
          suffix={discountType === "percentage" ? "%" : undefined}
          icon={discountType === "fixed"}
          register={register("discount_value")}
        />
      </Field>

      {discountType === "percentage" ? (
        <Field label="الحد الأقصى لمبلغ الخصم" error={errors.max_discount_amount?.message}>
          <NumberInput icon placeholder="30" register={register("max_discount_amount")} />
        </Field>
      ) : null}

      <Field label="الحد الأدنى لمبلغ الطلب" error={errors.minimum_order_amount?.message}>
        <NumberInput icon placeholder="50" register={register("minimum_order_amount")} />
      </Field>

      <Field label="الحد الأقصى للاستخدام الكلي" error={errors.usage_limit?.message}>
        <NumberInput allowDecimal={false} placeholder="بدون حد" register={register("usage_limit")} />
      </Field>

      <Field label="الحد الأقصى للاستخدام لكل مستخدم" error={errors.per_user_limit?.message}>
        <NumberInput allowDecimal={false} placeholder="1" register={register("per_user_limit")} />
      </Field>

      <Field label="تاريخ البدء" error={errors.start_date?.message}>
        <DatePicker
          value={startDate}
          maxDate={endDate}
          onChange={(value) =>
            setValue("start_date", value ?? "", { shouldDirty: true, shouldValidate: true })
          }
        />
      </Field>

      <Field label="تاريخ الانتهاء" error={errors.end_date?.message}>
        <DatePicker
          value={endDate}
          minDate={startDate}
          onChange={(value) =>
            setValue("end_date", value ?? "", { shouldDirty: true, shouldValidate: true })
          }
        />
      </Field>

      <Field label="الحالة" required error={errors.is_active?.message}>
        <PromoStatusDropdown active={isActive} setValue={setValue} />
      </Field>

      <Field label="الوصف بالعربية" error={errors.description_ar?.message} className="sm:col-span-2">
        <textarea rows={3} className={`${inputClass} h-auto py-3`} {...register("description_ar")} />
      </Field>

      <Field label="الوصف بالإنجليزية" error={errors.description_en?.message} className="sm:col-span-2">
        <textarea
          rows={3}
          dir="ltr"
          className={`${inputClassLtr} h-auto py-3`}
          {...register("description_en")}
        />
      </Field>
    </div>
  );
}

function NumberInput({
  register,
  placeholder,
  allowDecimal = true,
  icon = false,
  suffix,
}: {
  register: ReturnType<UseFormRegister<PromoFormValues>>;
  placeholder?: string;
  allowDecimal?: boolean;
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
        step={allowDecimal ? "0.01" : "1"}
        min="0"
        dir="ltr"
        placeholder={placeholder}
        onKeyDown={(event) => preventNegativeNumberInput(event, { allowDecimal })}
        onPaste={(event) => preventNegativeNumberPaste(event, { allowDecimal })}
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

export default PromoFormFields;
