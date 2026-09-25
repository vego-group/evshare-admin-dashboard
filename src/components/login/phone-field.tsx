"use client";

import {
  forwardRef,
  useMemo,
  useRef,
  useState,
  type ComponentProps,
} from "react";
import { getExampleNumber } from "libphonenumber-js/min";
import mobilePhoneExamples from "libphonenumber-js/examples.mobile.json";
import PhoneInput, {
  getCountryCallingCode,
  type Country,
  type Value,
} from "react-phone-number-input";
import "react-phone-number-input/style.css";
import InputErrorMessage from "@/components/ui/input-error-message";
import { cn } from "@/lib/utils";
import PhoneCountrySelect from "./phone-country-select";

type PhoneNumberInputProps = ComponentProps<"input"> & {
  "data-phone-example"?: string;
  "data-show-example"?: boolean;
};

const PhoneNumberInput = forwardRef<HTMLInputElement, PhoneNumberInputProps>(
  function PhoneNumberInput(
    {
      className,
      value,
      "data-phone-example": phoneExample,
      "data-show-example": showExample,
      ...props
    },
    ref,
  ) {
    return (
      <div className="relative h-full min-w-0 flex-1">
        <input
          ref={ref}
          value={value}
          className={cn(
            "w-full",
            className,
            showExample && "text-transparent caret-secondary",
          )}
          {...props}
        />
        {showExample && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 flex items-center gap-2 px-3 text-left text-sm"
          >
            <span className="text-secondary">{String(value ?? "")}</span>
            <span className="text-gray-400">{phoneExample}</span>
          </span>
        )}
      </div>
    );
  },
);

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
  const [phoneCountry, setPhoneCountry] = useState<Country | undefined>("SA");
  const phoneCountryRef = useRef<Country | undefined>("SA");
  const phoneExample = useMemo(() => {
    if (!phoneCountry) return "Phone number";

    const example = getExampleNumber(phoneCountry, mobilePhoneExamples);
    if (!example) return "Phone number";

    const callingCode = getCountryCallingCode(phoneCountry);
    return example
      .formatInternational()
      .replace(new RegExp(`^\\+${callingCode}\\s*`), "");
  }, [phoneCountry]);

  const handleCountryChange = (nextCountry?: Country) => {
    phoneCountryRef.current = nextCountry;
    setPhoneCountry(nextCountry);
  };

  const handlePhoneChange = (nextValue?: Value) => {
    const selectedCountry = phoneCountryRef.current;
    const callingCodeOnly = selectedCountry
      ? `+${getCountryCallingCode(selectedCountry)}`
      : undefined;

    onChange(!nextValue || nextValue === callingCodeOnly ? "" : nextValue);
  };

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
          placeholder={phoneExample}
          countrySelectComponent={PhoneCountrySelect}
          inputComponent={PhoneNumberInput}
          onCountryChange={handleCountryChange}
          value={(value || undefined) as Value | undefined}
          onChange={handlePhoneChange}
          className="h-full w-full"
          numberInputProps={{
            autoComplete: "tel",
            inputMode: "tel",
            "data-phone-example": phoneExample,
            "data-show-example": !value || undefined,
            className: "h-full min-w-0 flex-1 border-none bg-transparent px-3 text-left text-sm text-secondary placeholder:text-gray-400 focus:outline-none",
          }}
          {...props}
        />
      </div>

      <InputErrorMessage msg={error} />
    </div>
  );
}
