"use client";

import { forwardRef } from "react";
import Image from "next/image";
import InputErrorMessage from "@/components/ui/input-error-message";
import { cn } from "@/lib/utils";

interface PhoneFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label?: string;
  error?: string;
}

const PhoneField = forwardRef<HTMLInputElement, PhoneFieldProps>(
  ({ id, label, error, className, ...props }, ref) => {
    const hasError = Boolean(error);

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
            "flex h-10 items-center overflow-hidden rounded-lg border border-[#dbe4ef] bg-white transition",
            hasError && "border-red-400",
          )}
        >
          <div className="flex shrink-0 items-center gap-1.5 border-r border-[#dbe4ef] px-3 select-none">
            <Image
              src="/images/flag.png"
              alt="SA"
              width={28}
              height={20}
              className="rounded-sm object-cover"
            />
            <span className="text-sm font-medium text-secondary">+966</span>
          </div>

          <input
            id={id}
            ref={ref}
            type="tel"
            inputMode="numeric"
            maxLength={9}
            className={cn(
              "h-full w-full border-none bg-transparent px-3 text-left text-sm text-secondary placeholder:text-gray-400 focus:outline-none",
              className,
            )}
            {...props}
          />
        </div>

        <InputErrorMessage msg={error} />
      </div>
    );
  },
);

PhoneField.displayName = "PhoneField";

export default PhoneField;
