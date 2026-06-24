import type { ReactNode } from "react";

import InputErrorMessage from "@/components/ui/input-error-message";

type Props = {
  label: string;
  error?: string;
  fullWidth?: boolean;
  children: ReactNode;
};

function FeatureFlagField({ label, error, fullWidth, children }: Props) {
  return (
    <label className={fullWidth ? "sm:col-span-2" : undefined}>
      <span className="mb-2 block text-sm font-medium text-dark-gray">
        {label} <span className="text-red-700">*</span>
      </span>
      {children}
      <InputErrorMessage msg={error} />
    </label>
  );
}

export default FeatureFlagField;
