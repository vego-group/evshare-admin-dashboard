import type { ReactNode } from "react";

import InputErrorMessage from "@/components/ui/input-error-message";

type Props = {
  label: string;
  error?: string;
  children: ReactNode;
};

function SettingField({ label, error, children }: Props) {
  return (
    <label>
      <span className="mb-2 block text-sm font-medium text-dark-gray">
        {label} <span className="text-red-700">*</span>
      </span>
      {children}
      <InputErrorMessage msg={error} />
    </label>
  );
}

export default SettingField;
