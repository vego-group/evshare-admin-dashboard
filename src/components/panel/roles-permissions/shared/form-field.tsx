import type { ReactNode } from "react";

import InputErrorMessage from "@/components/ui/input-error-message";

export default function FormField(props: {
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-secondary">
        {props.label}
      </span>
      {props.children}
      <InputErrorMessage msg={props.error} />
    </label>
  );
}
