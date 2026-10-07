import type { ReactNode } from "react";

import InputErrorMessage from "@/components/ui/input-error-message";

export default function FormField(props: { label: string; error?: string; children: ReactNode; gapClassName?: string }) {
  return (
    <label className={`block ${props.gapClassName ?? "space-y-2.5"}`}>
      <span className="text-sm font-medium text-secondary">{props.label}</span>
      {props.children}
      <InputErrorMessage msg={props.error} />
    </label>
  );
}
