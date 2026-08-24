"use client";

import PhoneInput, { type Value } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import InputErrorMessage from "@/components/ui/input-error-message";
import { cn } from "@/lib/utils";
import PhoneCountrySelect from "./phone-country-select";

interface PhoneFieldProps {
  id: string;
  label?: string;
  error?: string;
  value?: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  name?: string;
  disabled?: boolean;
}

export default function PhoneField({ id, label, error, value, onChange, ...props }: PhoneFieldProps) {
  return (
    <div>
      {label && (
        <label htmlFor={id} className="mb-2 block text-right text-sm font-medium text-secondary">
          {label}
        </label>
      )}

      <div
        dir="ltr"
        className={cn(
          "international-phone-input flex h-11 items-center rounded-lg border border-[#dbe4ef] bg-white px-3 transition focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10",
          error && "border-red-400 focus-within:border-red-400",
        )}
      >
        <PhoneInput
          id={id}
          defaultCountry="SA"
          international
          countryCallingCodeEditable={false}
          countrySelectComponent={PhoneCountrySelect}
          value={(value || undefined) as Value | undefined}
          onChange={(nextValue) => onChange(nextValue ?? "")}
          className="h-full w-full"
          numberInputProps={{
            autoComplete: "tel",
            inputMode: "tel",
            className: "h-full min-w-0 flex-1 border-none bg-transparent px-3 text-left text-sm text-secondary placeholder:text-gray-400 focus:outline-none",
          }}
          {...props}
        />
      </div>

      <InputErrorMessage msg={error} />
    </div>
  );
}
