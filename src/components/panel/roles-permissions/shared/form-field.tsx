import type { ReactNode } from "react";

export default function FormField(props: { label: string; error?: string; children: ReactNode }) {
  return (
    <label className="block space-y-2.5">
      <span className="text-sm font-medium text-secondary">{props.label}</span>
      {props.children}
      {props.error && <span className="block text-xs text-red-600">{props.error}</span>}
    </label>
  );
}
