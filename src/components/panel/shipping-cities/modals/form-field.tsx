import type { ReactNode } from "react";

import InputErrorMessage from "@/components/ui/input-error-message";

const inputBaseClass =
  "h-14 w-full rounded-[14px] border border-primary bg-primary/4 px-4 text-sm font-medium text-dark-gray outline-none transition focus:bg-primary/8";

export const inputClass = `${inputBaseClass} text-right`;
export const inputClassLtr = `${inputBaseClass} text-left`;

export function Field({
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
