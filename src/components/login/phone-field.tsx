"use client";

import { forwardRef } from "react";
import InputErrorMessage from "@/components/ui/input-error-message";
import { cn } from "@/lib/utils";
import {
  preventNonDigitInput,
  preventNonDigitPaste,
  stripNonDigits,
} from "@/lib/utils/digits-only-input";
import { mergePhoneCountries } from "@/data";
import type { Country, CountryCode } from "@/types";
import CountryPhoneSelect from "./country-phone-select";

interface PhoneFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label?: string;
  error?: string;
  countries: Country[];
  country: CountryCode;
  onCountryChange: (country: CountryCode) => void;
}

const PhoneField = forwardRef<HTMLInputElement, PhoneFieldProps>(
  ({ id, label, error, countries, country, onCountryChange, className, onKeyDown, onPaste, onChange, ...props }, ref) => {
    const hasError = Boolean(error);
    const options = mergePhoneCountries(countries);

    return (
      <div>
        {label && (
          <label
            htmlFor={id}
            className="mb-2 block text-right text-sm font-medium text-secondary"
          >
            {label}
          </label>
        )}

        <div
          dir="ltr"
          className={cn(
            "flex h-10 items-center rounded-lg border border-[#dbe4ef] bg-white transition",
            hasError && "border-red-400",
          )}
        >
          <CountryPhoneSelect options={options.filter((option) => option.active)} value={country} onChange={onCountryChange} />

          <input
            id={id}
            ref={ref}
            type="tel"
            inputMode="numeric"
            maxLength={10}
            className={cn(
              "h-full w-full border-none bg-transparent px-3 text-left text-sm text-secondary placeholder:text-gray-400 focus:outline-none",
              className,
            )}
            {...props}
            onKeyDown={(event) => {
              preventNonDigitInput(event);
              onKeyDown?.(event);
            }}
            onPaste={(event) => {
              preventNonDigitPaste(event);
              onPaste?.(event);
            }}
            onChange={(event) => {
              const normalizedValue = stripNonDigits(event.target.value);
              if (event.target.value !== normalizedValue) {
                event.target.value = normalizedValue;
              }
              onChange?.(event);
            }}
          />
        </div>

        <InputErrorMessage msg={error} />
      </div>
    );
  },
);

PhoneField.displayName = "PhoneField";

export default PhoneField;
